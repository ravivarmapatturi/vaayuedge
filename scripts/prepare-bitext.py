"""CPU-only bitext cleaning. Input JSONL: source, target, provenance.

Run separately for training and benchmark files; reserve benchmark sources using
--exclude. No downloads, GPU use, or synthetic references.
"""
import argparse
import hashlib
import json
import unicodedata
from pathlib import Path


def normalize(value):
    return " ".join(unicodedata.normalize("NFC", value).split())


def read_rows(path):
    with path.open(encoding="utf-8") as handle:
        for number, line in enumerate(handle, 1):
            if not line.strip():
                continue
            row = json.loads(line)
            for key in ("source", "target", "provenance"):
                if not isinstance(row.get(key), str) or not row[key].strip():
                    raise ValueError(f"{path}:{number}: missing nonempty {key}")
            yield row


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--exclude", type=Path, action="append", default=[])
    args = parser.parse_args()
    reserved = {normalize(row["source"]).casefold() for path in args.exclude for row in read_rows(path)}
    seen = set()
    counts = dict(accepted=0, duplicate_source=0, reserved_source=0, invalid_text=0)
    # Exclusive creation protects existing corpora from accidental replacement.
    with args.output.open("x", encoding="utf-8") as output:
        for row in read_rows(args.input):
            source, target = normalize(row["source"]), normalize(row["target"])
            key = source.casefold()
            if key in reserved:
                counts["reserved_source"] += 1
                continue
            if key in seen:
                counts["duplicate_source"] += 1
                continue
            if not source or not target or not any("\u0c00" <= c <= "\u0c7f" for c in target):
                counts["invalid_text"] += 1
                continue
            seen.add(key)
            row.update(source=source, target=target, source_sha256=hashlib.sha256(key.encode()).hexdigest())
            output.write(json.dumps(row, ensure_ascii=False) + "\n")
            counts["accepted"] += 1
    print(json.dumps(counts, sort_keys=True))


if __name__ == "__main__":
    main()
