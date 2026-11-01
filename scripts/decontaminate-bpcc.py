"""Prepare BPCC Daily training data and remove exact benchmark source overlaps.

Downloads pinned public benchmark files from the authenticated Hugging Face
account. Benchmark texts are used only for exclusion and are never written out.
CPU only; no model training or GPU use.
"""
import argparse
import csv
import hashlib
import json
import tarfile
import unicodedata
from pathlib import Path

BPCC_REV = "5bde309374f21c39e7c3d505f28ae11f58f2a220"
BENCHMARKS = {
    "ai4bharat/IN22-Conv": "18cd45870ff0a9e65df9b80dbbcc615eec0e4899",
    "ai4bharat/IN22-Gen": "e042ab3d3063110b1a85efa0a59bdbf8553bb928",
}


def norm(text):
    return " ".join(unicodedata.normalize("NFKC", text).casefold().split())


def benchmark_sources():
    from huggingface_hub import hf_hub_download
    all_sources = set()
    manifests = {}
    for repo, revision in BENCHMARKS.items():
        archive = hf_hub_download(repo, "IN22_benchmark.tar.gz", repo_type="dataset", revision=revision)
        name = "conv" if repo.endswith("Conv") else "gen"
        with tarfile.open(archive, "r:gz") as tar:
            member = tar.extractfile(f"IN22_benchmark/{name}/test.eng_Latn")
            if member is None:
                raise ValueError(f"English source file missing in {repo}")
            rows = {norm(line) for line in member.read().decode("utf-8").splitlines() if norm(line)}
        all_sources.update(rows)
        manifests[repo] = {"revision": revision, "source_rows": len(rows), "archive_sha256": hashlib.sha256(Path(archive).read_bytes()).hexdigest()}
    return all_sources, manifests


def main():
    from huggingface_hub import hf_hub_download
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output_dir", type=Path)
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=False)
    protected, benchmark_manifest = benchmark_sources()
    dataset = Path(hf_hub_download("ai4bharat/BPCC", "daily/tel_Telu.tsv", repo_type="dataset", revision=BPCC_REV))
    kept, overlaps, duplicates = 0, 0, 0
    seen = set()
    out_path = args.output_dir / "bpcc_daily_train.jsonl"
    with dataset.open(encoding="utf-8", newline="") as inp, out_path.open("x", encoding="utf-8") as out:
        for row in csv.DictReader(inp, delimiter="\t"):
            source, target = row["src"], row["tgt"]
            key = norm(source)
            if not key or not target.strip() or not any("\u0c00" <= ch <= "\u0c7f" for ch in target):
                continue
            if key in protected:
                overlaps += 1
                continue
            if key in seen:
                duplicates += 1
                continue
            seen.add(key)
            out.write(json.dumps({"source": source, "target": target, "provenance": f"ai4bharat/BPCC@{BPCC_REV}/daily/tel_Telu.tsv", "license": "CC-BY-4.0", "attribution": "AI4Bharat BPCC-H-Daily"}, ensure_ascii=False) + "\n")
            kept += 1
    report = {"bpcc_revision": BPCC_REV, "bpcc_file_sha256": hashlib.sha256(dataset.read_bytes()).hexdigest(), "benchmarks": benchmark_manifest, "counts": {"retained": kept, "exact_normalized_benchmark_overlaps_removed": overlaps, "duplicate_sources_removed": duplicates}, "benchmark_text_written": False, "limitations": ["Exact normalized source overlap only; semantic and near-duplicate contamination not assessed.", "Upstream teacher pretraining or training contamination cannot be excluded.", "Use the benchmark only for final evaluation, not model selection; retain a separate development set."]}
    with (args.output_dir / "decontamination_manifest.json").open("x", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    print(json.dumps(report))


if __name__ == "__main__":
    main()
