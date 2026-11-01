"""Regression checks for deterministic split manifests and fingerprints."""
import hashlib
import json
import subprocess
import sys
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts/split-bitext.py"


def main() -> None:
    with tempfile.TemporaryDirectory(prefix="vaayuedge-split-") as temp:
        temp_dir = Path(temp)
        source = temp_dir / "clean.jsonl"
        rows = [
            {"source": "Hello", "target": "హలో"},
            {"source": "Good morning", "target": "శుభోదయం"},
            {"source": "How are you?", "target": "మీరు ఎలా ఉన్నారు?"},
        ]
        source.write_text(
            "".join(json.dumps(row, ensure_ascii=False) + "\n" for row in rows),
            encoding="utf-8",
        )
        output = temp_dir / "splits"
        result = subprocess.run(
            [sys.executable, str(SCRIPT), str(source), str(output)],
            cwd=ROOT, text=True, capture_output=True, check=True,
        )
        report = json.loads(result.stdout)
        manifest = json.loads((output / "manifest.json").read_text(encoding="utf-8"))
        assert manifest == report
        assert sum(manifest["counts"].values()) == len(rows)
        assert set(manifest["split_sha256"]) == {"train", "validation", "test"}
        for name, declared in manifest["split_sha256"].items():
            split_path = output / f"{name}.jsonl"
            assert declared == hashlib.sha256(split_path.read_bytes()).hexdigest()
        assert manifest["input_sha256"] == hashlib.sha256(source.read_bytes()).hexdigest()
    print("split manifest contract checks passed")


if __name__ == "__main__":
    main()
