"""Regression checks for validate-training-inputs.py."""
import hashlib
import json
import subprocess
import sys
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
CHECK = ROOT / "scripts" / "validate-training-inputs.py"


def write_case(root, split_rows):
    for split, rows in split_rows.items():
        (root / f"{split}.jsonl").write_text(
            "".join(json.dumps(row) + "\n" for row in rows), encoding="utf-8"
        )
    hashes = {
        split: hashlib.sha256((root / f"{split}.jsonl").read_bytes()).hexdigest()
        for split in split_rows
    }
    (root / "manifest.json").write_text(
        json.dumps({"counts": {split: len(rows) for split, rows in split_rows.items()}, "split_sha256": hashes}),
        encoding="utf-8",
    )


def run(root):
    return subprocess.run([sys.executable, str(CHECK), str(root)], text=True, capture_output=True)


with tempfile.TemporaryDirectory() as directory:
    root = Path(directory)
    write_case(root, {"train": [{"source": "Hello", "target": "హలో"}], "validation": [{"source": "Bye", "target": "వీడ్కోలు"}], "test": [{"source": "Thanks", "target": "ధన్యవాదాలు"}]})
    result = run(root)
    assert result.returncode == 0, result.stderr
    report = json.loads(result.stdout)
    assert report["total_rows"] == 3
    assert report["declared_hashes_checked"] is True

    (root / "train.jsonl").write_text('{"source":"Changed","target":"హలో"}\n', encoding="utf-8")
    result = run(root)
    assert result.returncode != 0 and "hash mismatch for train" in result.stderr

    write_case(root, {"train": [{"source": "Hello", "target": "హలో"}], "validation": [{"source": " hello ", "target": "హలో"}], "test": [{"source": "Bye", "target": "వీడ్కోలు"}]})
    result = run(root)
    assert result.returncode != 0 and "cross-split" in result.stderr

print("training-input validation checks passed")
