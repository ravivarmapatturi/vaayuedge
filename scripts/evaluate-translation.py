#!/usr/bin/env python3
"""Score a translation prediction file against a pinned benchmark export.

Input JSONL rows must contain ``source`` and ``target`` for references, and
``source`` and ``prediction`` for predictions.  The evaluator joins on the
normalized source, so benchmark text is never copied into training outputs.
It reports corpus chrF++ and sacreBLEU (with its signature), plus missing,
extra, and category-level empty/error rows when ``category`` is present.
"""

import argparse
import hashlib
import json
import unicodedata
from collections import defaultdict
from pathlib import Path


EVALUATOR_VERSION = "2026-10-28-input-provenance-v2"


def non_empty_argument(value):
    value = value.strip()
    if not value:
        raise argparse.ArgumentTypeError("must be non-empty")
    return value


def normalize(text):
    return " ".join(unicodedata.normalize("NFKC", text).casefold().split())


def file_fingerprint(path):
    data = path.read_bytes()
    return {"bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()}


def read_rows(path, value_key, allow_empty_value=False, allow_duplicate_sources=False):
    rows = {}
    occurrences = defaultdict(int)
    for line_number, line in enumerate(path.open(encoding="utf-8"), 1):
        try:
            row = json.loads(line)
        except json.JSONDecodeError as exc:
            raise ValueError(f"{path}:{line_number}: invalid JSON: {exc.msg}") from exc
        if not isinstance(row, dict) or not isinstance(row.get("source"), str) or not row["source"].strip():
            raise ValueError(f"{path}:{line_number}: expected a non-empty source")
        key = normalize(row["source"])
        if not key:
            raise ValueError(f"{path}:{line_number}: source normalizes to empty")
        if key in rows and not allow_duplicate_sources:
            raise ValueError(f"{path}:{line_number}: duplicate normalized source")
        if not isinstance(row.get(value_key), str):
            raise ValueError(f"{path}:{line_number}: missing string {value_key!r}")
        if not allow_empty_value and not row[value_key].strip():
            raise ValueError(f"{path}:{line_number}: {value_key!r} must be non-empty")
        if allow_duplicate_sources:
            occurrence = occurrences[key]
            occurrences[key] += 1
            key = f"{key}\x00{occurrence}"
        rows[key] = row
    return rows


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--references", type=Path, required=True)
    parser.add_argument("--predictions", type=Path, required=True)
    parser.add_argument(
        "--model-name",
        type=non_empty_argument,
        required=True,
        help="exact model or deployed pipeline identifier that produced predictions",
    )
    parser.add_argument(
        "--model-revision",
        type=non_empty_argument,
        help="checkpoint, commit, or model revision; omit only when the provider has none",
    )
    parser.add_argument(
        "--pipeline-source",
        type=non_empty_argument,
        required=True,
        help="prediction source, such as browser, api, or local adapter",
    )
    parser.add_argument(
        "--output",
        type=Path,
        help="write the JSON report to this path in addition to stdout",
    )
    parser.add_argument(
        "--allow-partial",
        action="store_true",
        help="score matched rows even when predictions are missing or extra (not recommended for final benchmarks)",
    )
    parser.add_argument(
        "--allow-duplicate-sources", action="store_true",
        help="match repeated benchmark sources by occurrence order; required for IN22 files with duplicates",
    )
    args = parser.parse_args()
    references = read_rows(args.references, "target", allow_duplicate_sources=args.allow_duplicate_sources)
    # Empty predictions are retained as explicit model failures so they can be
    # counted by category; reference targets must always be usable for scoring.
    predictions = read_rows(args.predictions, "prediction", allow_empty_value=True, allow_duplicate_sources=args.allow_duplicate_sources)
    missing = sorted(set(references) - set(predictions))
    extra = sorted(set(predictions) - set(references))
    if (missing or extra) and not args.allow_partial:
        raise SystemExit(
            "Coverage mismatch: "
            f"{len(missing)} missing predictions and {len(extra)} extra predictions. "
            "Use --allow-partial only for exploratory scoring."
        )
    keys = [key for key in references if key in predictions]
    if not keys:
        raise SystemExit("No matching normalized sources")

    try:
        import sacrebleu
    except ImportError as exc:
        raise SystemExit("Install sacrebleu to score: python -m pip install sacrebleu") from exc

    refs = [references[key]["target"] for key in keys]
    hyps = [predictions[key]["prediction"] for key in keys]
    bleu = sacrebleu.corpus_bleu(hyps, [refs])
    chrf = sacrebleu.corpus_chrf(hyps, [refs], word_order=2)
    bleu_metric = sacrebleu.BLEU()
    chrf_metric = sacrebleu.CHRF(word_order=2)
    bleu_metric.corpus_score(hyps, [refs])
    chrf_metric.corpus_score(hyps, [refs])

    by_category = defaultdict(lambda: {"rows": 0, "empty_predictions": 0})
    for key in keys:
        category = references[key].get("category", "uncategorized")
        by_category[category]["rows"] += 1
        if not predictions[key]["prediction"].strip():
            by_category[category]["empty_predictions"] += 1

    report = {
        "evaluator": {
            "version": EVALUATOR_VERSION,
            "references": {"path": str(args.references), **file_fingerprint(args.references), "rows": len(references)},
            "predictions": {"path": str(args.predictions), **file_fingerprint(args.predictions), "rows": len(predictions)},
            "allow_partial": args.allow_partial,
            "allow_duplicate_sources": args.allow_duplicate_sources,
            "prediction_provenance": {
                "model_name": args.model_name,
                "model_revision": args.model_revision,
                "pipeline_source": args.pipeline_source,
            },
        },
        "metrics": {
            "bleu": bleu.score,
            "bleu_signature": str(bleu_metric.get_signature()),
            "chrf_plus_plus": chrf.score,
            "chrf_signature": str(chrf_metric.get_signature()),
        },
        "counts": {"reference_rows": len(references), "prediction_rows": len(predictions),
                   "matched": len(keys), "missing_predictions": len(missing), "extra_predictions": len(extra),
                   "complete_coverage": not missing and not extra},
        "stratified": dict(sorted(by_category.items())),
        "evaluation_only": True,
        "benchmark_text_written_to_training_artifacts": False,
        "evidence_class": "measured benchmark score" if not (missing or extra) else "exploratory partial score",
    }
    rendered = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(rendered, encoding="utf-8")
    print(rendered, end="")


if __name__ == "__main__":
    main()
