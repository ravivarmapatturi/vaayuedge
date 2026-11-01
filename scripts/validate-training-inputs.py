"""Validate a prepared bitext split before model training.

This check is intentionally dependency-free.  It validates the local JSONL
artifacts and manifest, but does not claim translation quality or license
approval.
"""
import argparse
import hashlib
import json
import unicodedata
from pathlib import Path


def rows(path):
    with path.open(encoding="utf-8") as handle:
        for number, line in enumerate(handle, 1):
            if not line.strip():
                continue
            try:
                row = json.loads(line)
            except json.JSONDecodeError as exc:
                raise ValueError(f"{path}:{number}: invalid JSON: {exc.msg}") from exc
            if not isinstance(row, dict):
                raise ValueError(f"{path}:{number}: row must be an object")
            source, target = row.get("source"), row.get("target")
            if not isinstance(source, str) or not source.strip():
                raise ValueError(f"{path}:{number}: source must be nonempty")
            if not isinstance(target, str) or not target.strip():
                raise ValueError(f"{path}:{number}: target must be nonempty")
            yield source, target


def sha256(path):
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("directory", type=Path)
    args = parser.parse_args()
    manifest_path = args.directory / "manifest.json"
    if not manifest_path.is_file():
        raise ValueError(f"missing manifest: {manifest_path}")
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    expected = manifest.get("counts")
    if not isinstance(expected, dict):
        raise ValueError("manifest.counts must be an object")
    declared_hashes = manifest.get("split_sha256")
    if declared_hashes is not None and not isinstance(declared_hashes, dict):
        raise ValueError("manifest.split_sha256 must be an object when present")

    seen = {}
    result = {"directory": str(args.directory), "splits": {}}
    for split in ("train", "validation", "test"):
        path = args.directory / f"{split}.jsonl"
        if not path.is_file():
            raise ValueError(f"missing split: {path}")
        count = 0
        sources = set()
        for source, _target in rows(path):
            key = " ".join(unicodedata.normalize("NFC", source).split()).casefold()
            if key in sources:
                raise ValueError(f"duplicate normalized source in {split}: {source!r}")
            sources.add(key)
            if key in seen:
                raise ValueError(f"cross-split source overlap: {source!r} in {seen[key]} and {split}")
            seen[key] = split
            count += 1
        if expected.get(split) != count:
            raise ValueError(f"manifest row mismatch for {split}: expected {expected.get(split)}, got {count}")
        actual_hash = sha256(path)
        if declared_hashes is not None:
            declared_hash = declared_hashes.get(split)
            if not isinstance(declared_hash, str) or len(declared_hash) != 64:
                raise ValueError(f"manifest hash missing or malformed for {split}")
            if declared_hash != actual_hash:
                raise ValueError(f"manifest hash mismatch for {split}")
        result["splits"][split] = {"rows": count, "sha256": actual_hash}
    result["total_rows"] = sum(item["rows"] for item in result["splits"].values())
    result["unique_normalized_sources"] = len(seen)
    result["declared_hashes_checked"] = declared_hashes is not None
    result["provenance"] = "input-integrity check only; no model or quality claim"
    print(json.dumps(result, sort_keys=True))


if __name__ == "__main__":
    main()
