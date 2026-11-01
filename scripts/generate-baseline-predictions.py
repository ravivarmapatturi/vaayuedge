#!/usr/bin/env python3
"""Generate complete predictions with the deployed Helsinki Opus-MT adapter."""
import argparse
import hashlib
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "services" / "api"))


def fingerprint(path):
    data = path.read_bytes()
    return {"path": str(path), "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--references", type=Path, required=True)
    parser.add_argument("--predictions", type=Path, required=True)
    parser.add_argument("--batch-size", type=int, default=8)
    parser.add_argument("--export-dir", type=Path, help="Evaluate a recovered local fine-tuned export instead of the baseline")
    args = parser.parse_args()
    if args.batch_size < 1:
        parser.error("--batch-size must be positive")
    rows = [json.loads(line) for line in args.references.read_text(encoding="utf-8").splitlines()]
    if not rows or any(not isinstance(row.get("source"), str) or not row["source"].strip() for row in rows):
        raise SystemExit("references must contain non-empty source strings")
    from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
    model_id = "Helsinki-NLP/opus-mt-en-dra"
    revision = "5ecfd223f954f860b67f1b4c42e6f4c70d347581"
    export_files = None
    if args.export_dir:
        if not (args.export_dir / "model.safetensors").is_file():
            parser.error("--export-dir must contain model.safetensors")
        model_id = str(args.export_dir.resolve())
        revision = None
        export_files = [fingerprint(p) for p in sorted(args.export_dir.rglob("*")) if p.is_file()]
    tokenizer = AutoTokenizer.from_pretrained(model_id, revision=revision, local_files_only=True)
    # This pinned upstream revision exposes pytorch_model.bin, not SafeTensors.
    # The revision and file format are recorded in provenance; generation
    # settings remain identical to the deployed adapter.
    model = AutoModelForSeq2SeqLM.from_pretrained(model_id, revision=revision, use_safetensors=bool(args.export_dir), local_files_only=True)
    model.eval()
    predictions = []
    import torch
    with torch.inference_mode():
        for start in range(0, len(rows), args.batch_size):
            batch = rows[start:start + args.batch_size]
            inputs = tokenizer([f">>tel<< {row['source'].strip()}" for row in batch], return_tensors="pt", padding=True, truncation=True, max_length=256)
            outputs = model.generate(**inputs, max_length=256, num_beams=3, early_stopping=True)
            decoded = tokenizer.batch_decode(outputs, skip_special_tokens=True)
            predictions.extend({"source": row["source"], "prediction": text.strip(), "category": row.get("category", "uncategorized")} for row, text in zip(batch, decoded))
            print(f"predicted {len(predictions)}/{len(rows)}", file=sys.stderr, flush=True)
    if len(predictions) != len(rows):
        raise SystemExit("prediction coverage mismatch")
    args.predictions.parent.mkdir(parents=True, exist_ok=True)
    args.predictions.write_text("".join(json.dumps(row, ensure_ascii=False) + "\n" for row in predictions), encoding="utf-8")
    provenance = {"model_name": model_id, "model_revision": revision, "weight_format": "model.safetensors" if args.export_dir else "pytorch_model.bin", "export_files": export_files, "adapter_settings": {"target_prefix": ">>tel<<", "max_length": 256, "num_beams": 3}, "references": fingerprint(args.references), "predictions": fingerprint(args.predictions), "rows": len(predictions), "evidence_class": "measured local-derivative predictions" if args.export_dir else "measured deployed-baseline predictions"}
    metadata = args.predictions.with_suffix(args.predictions.suffix + ".provenance.json")
    metadata.write_text(json.dumps(provenance, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(provenance, ensure_ascii=False))


if __name__ == "__main__":
    main()
