"""Regression checks for offline IN22 archive export."""
import hashlib
import json
import subprocess
import sys
import tarfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXPORTER = ROOT / "scripts/export-in22-benchmark.py"


def make_archive(path: Path, prefix: str, rows: list[tuple[str, str]]) -> None:
    staging = path.parent / (path.stem + "-files")
    (staging / "IN22_benchmark" / prefix).mkdir(parents=True)
    (staging / "IN22_benchmark" / prefix / "test.eng_Latn").write_text(
        "\n".join(src for src, _ in rows) + "\n", encoding="utf-8"
    )
    (staging / "IN22_benchmark" / prefix / "test.tel_Telu").write_text(
        "\n".join(tgt for _, tgt in rows) + "\n", encoding="utf-8"
    )
    with tarfile.open(path, "w:gz") as archive:
        archive.add(staging / "IN22_benchmark", arcname="IN22_benchmark")


def main() -> None:
    root = ROOT / ".export-in22-fixture"
    root.mkdir()
    try:
        conv = root / "conv.tar.gz"
        gen = root / "gen.tar.gz"
        make_archive(conv, "conv", [("Hello", "హలో"), ("Good night", "శుభ రాత్రి")])
        make_archive(gen, "gen", [("Where are you?", "మీరు ఎక్కడ ఉన్నారు?")])
        output = root / "export"
        result = subprocess.run(
            [sys.executable, str(EXPORTER), str(output),
             "--archive", f"in22-conv={conv}", "--archive", f"in22-gen={gen}"],
            cwd=ROOT, text=True, capture_output=True, check=True,
        )
        manifest = json.loads(result.stdout)
        assert manifest["evaluation_only"] is True
        assert manifest["benchmarks"]["in22-conv"]["archive_source"] == "local"
        assert manifest["benchmarks"]["in22-conv"]["rows"] == 2
        assert manifest["benchmarks"]["in22-gen"]["rows"] == 1
        assert manifest["benchmarks"]["in22-gen"]["archive_sha256"] == hashlib.sha256(gen.read_bytes()).hexdigest()
        assert len((output / "in22-conv.jsonl").read_text(encoding="utf-8").splitlines()) == 2
        assert len((output / "in22-gen.jsonl").read_text(encoding="utf-8").splitlines()) == 1
        for name in ("in22-conv", "in22-gen"):
            artifact = output / f"{name}.jsonl"
            metadata = manifest["benchmarks"][name]
            artifact_bytes = artifact.read_bytes()
            assert metadata["artifact_bytes"] == len(artifact_bytes)
            assert metadata["artifact_sha256"] == hashlib.sha256(artifact_bytes).hexdigest()
        print("offline IN22 export checks passed")
    finally:
        for path in sorted(root.rglob("*"), reverse=True):
            if path.is_file() or path.is_symlink():
                path.unlink()
            elif path.is_dir():
                path.rmdir()
        root.rmdir()


if __name__ == "__main__":
    main()
