"""Deterministic source-group split for cleaned bitext (not an external benchmark)."""
import argparse
import hashlib
import json
import unicodedata
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path)
    parser.add_argument("output_dir", type=Path)
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=False)
    counts = {"train": 0, "validation": 0, "test": 0}
    handles = {name: (args.output_dir / f"{name}.jsonl").open("x", encoding="utf-8") for name in counts}
    seen = set()
    try:
        with args.input.open(encoding="utf-8") as source:
            for line in source:
                row = json.loads(line)
                normalized = " ".join(unicodedata.normalize("NFC", row["source"]).split()).casefold()
                if normalized in seen:
                    raise ValueError("Input must be source-deduplicated first")
                seen.add(normalized)
                bucket = int(hashlib.sha256(("inferedge-v1:" + normalized).encode()).hexdigest()[:8], 16) % 100
                split = "test" if bucket < 5 else "validation" if bucket < 10 else "train"
                handles[split].write(json.dumps(row, ensure_ascii=False) + "\n")
                counts[split] += 1
    finally:
        for handle in handles.values():
            handle.close()
    report = {"counts": counts, "method": "sha256 normalized source; 90/5/5 buckets",
        "input_sha256": hashlib.sha256(args.input.read_bytes()).hexdigest(),
        "split_sha256": {
            name: hashlib.sha256((args.output_dir / f"{name}.jsonl").read_bytes()).hexdigest()
            for name in counts
        },
        "external_benchmark_decontamination": "NOT_COMPLETED",
        "limitation": "Internal holdout may overlap upstream pretrained-model data; not evidence of unseen-data generalization. Near-duplicate and document-group leakage not addressed."}
    with (args.output_dir / "manifest.json").open("x") as output:
        json.dump(report, output, indent=2)
    print(json.dumps(report))


if __name__ == "__main__":
    main()
