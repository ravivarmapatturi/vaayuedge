"""Regression checks for the dependency-free training contract."""
import json
import hashlib
import subprocess
import sys
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SCRIPT = ROOT / "scripts/validate-training-contract.py"


def write(path, value):
    path.write_text(json.dumps(value), encoding="utf-8")


def run(config):
    return subprocess.run([sys.executable, str(SCRIPT), str(config)], capture_output=True, text=True)


with tempfile.TemporaryDirectory() as directory:
    root = Path(directory)
    for name, rows in {"train": [1, 2], "validation": [3], "test": [4]}.items():
        (root / f"{name}.jsonl").write_text("".join(json.dumps({"source": str(row), "target": str(row)}) + "\n" for row in rows), encoding="utf-8")
    hashes = {name: hashlib.sha256((root / f"{name}.jsonl").read_bytes()).hexdigest() for name in ("train", "validation", "test")}
    write(root / "manifest.json", {"counts": {"train": 2, "validation": 1, "test": 1}, "input_sha256": "a" * 64, "split_sha256": hashes})
    write(root / "candidates.json", {"candidates": [{"id": "fixture-candidate", "role": "fixture"}]})
    config = root / "contract.json"
    write(config, {"manifest": "manifest.json", "candidate_inventory": "candidates.json", "candidate_id": "fixture-candidate", "seed": 17,
                   "max_source_chars": 256, "max_target_chars": 256, "checkpoint_dir": "checkpoints"})
    result = run(config)
    assert result.returncode == 0, result.stderr
    assert json.loads(result.stdout)["split_counts"]["train"] == 2

    for value in ("", "   ", "."):
        invalid = json.loads(config.read_text(encoding="utf-8"))
        invalid["checkpoint_dir"] = value
        invalid_path = root / "invalid-checkpoint.json"
        write(invalid_path, invalid)
        result = run(invalid_path)
        assert result.returncode != 0 and "checkpoint_dir" in result.stderr

    write(root / "bad-input-hash.json", {"counts": {"train": 2, "validation": 1, "test": 1},
                                          "input_sha256": "g" * 64, "split_sha256": hashes})
    write(root / "bad-input-hash-contract.json", {"manifest": "bad-input-hash.json", "candidate_inventory": "candidates.json", "candidate_id": "fixture-candidate", "seed": 17,
                                                    "max_source_chars": 256, "max_target_chars": 256, "checkpoint_dir": "checkpoints"})
    result = run(root / "bad-input-hash-contract.json")
    assert result.returncode != 0 and "hexadecimal input_sha256" in result.stderr

    bad_split_hashes = dict(hashes)
    bad_split_hashes["validation"] = "g" * 64
    write(root / "bad-split-hash.json", {"counts": {"train": 2, "validation": 1, "test": 1},
                                          "input_sha256": "a" * 64, "split_sha256": bad_split_hashes})
    write(root / "bad-split-hash-contract.json", {"manifest": "bad-split-hash.json", "candidate_inventory": "candidates.json", "candidate_id": "fixture-candidate", "seed": 17,
                                                    "max_source_chars": 256, "max_target_chars": 256, "checkpoint_dir": "checkpoints"})
    result = run(root / "bad-split-hash-contract.json")
    assert result.returncode != 0 and "hash is malformed for validation" in result.stderr

    (root / "test.jsonl").write_text('{"source":"changed","target":"changed"}\n', encoding="utf-8")
    result = run(config)
    assert result.returncode != 0 and "hash mismatch for test" in result.stderr
    (root / "test.jsonl").write_text(json.dumps({"source": "4", "target": "4"}) + "\n", encoding="utf-8")

    write(root / "bad-gpu.json", {"manifest": "manifest.json", "candidate_inventory": "candidates.json", "candidate_id": "fixture-candidate", "seed": 17,
                                  "max_source_chars": 256, "max_target_chars": 256, "checkpoint_dir": "checkpoints",
                                  "gpu": True})
    result = run(root / "bad-gpu.json")
    assert result.returncode != 0 and "gpu" in result.stderr

    write(root / "oversized.json", {"manifest": "manifest.json", "candidate_inventory": "candidates.json", "candidate_id": "fixture-candidate", "seed": 17,
                                     "max_source_chars": 4097, "max_target_chars": 256, "checkpoint_dir": "checkpoints"})
    result = run(root / "oversized.json")
    assert result.returncode != 0 and "1 to 4096" in result.stderr

    write(root / "bad-counts.json", {"counts": {"train": 2, "validation": 0, "test": 1}, "input_sha256": "a" * 64,
                                      "split_sha256": hashes})
    write(root / "bad-manifest.json", {"manifest": "bad-counts.json", "candidate_inventory": "candidates.json", "candidate_id": "fixture-candidate", "seed": 17,
                                        "max_source_chars": 256, "max_target_chars": 256, "checkpoint_dir": "checkpoints"})
    result = run(root / "bad-manifest.json")
    assert result.returncode != 0 and "positive" in result.stderr

    write(root / "missing-hashes.json", {"counts": {"train": 2, "validation": 1, "test": 1}, "input_sha256": "a" * 64})
    write(root / "missing-hashes-contract.json", {"manifest": "missing-hashes.json", "candidate_inventory": "candidates.json", "candidate_id": "fixture-candidate", "seed": 17,
                                                      "max_source_chars": 256, "max_target_chars": 256, "checkpoint_dir": "checkpoints"})
    result = run(root / "missing-hashes-contract.json")
    assert result.returncode != 0 and "split_sha256" in result.stderr

    write(root / "escaping-manifest.json", {"manifest": "../manifest.json", "candidate_inventory": "candidates.json", "candidate_id": "fixture-candidate", "seed": 17,
                                              "max_source_chars": 256, "max_target_chars": 256, "checkpoint_dir": "checkpoints"})
    result = run(root / "escaping-manifest.json")
    assert result.returncode != 0 and "must not escape" in result.stderr

    write(root / "escaping-checkpoint.json", {"manifest": "manifest.json", "candidate_inventory": "candidates.json", "candidate_id": "fixture-candidate", "seed": 17,
                                               "max_source_chars": 256, "max_target_chars": 256, "checkpoint_dir": "../checkpoints"})
    result = run(root / "escaping-checkpoint.json")
    assert result.returncode != 0 and "must not escape" in result.stderr

    write(root / "unknown-candidate.json", {"manifest": "manifest.json", "candidate_inventory": "candidates.json", "candidate_id": "not-registered", "seed": 17,
                                               "max_source_chars": 256, "max_target_chars": 256, "checkpoint_dir": "checkpoints"})
    result = run(root / "unknown-candidate.json")
    assert result.returncode != 0 and "not registered" in result.stderr

    write(root / "duplicate-candidates.json", {
        "candidates": [
            {"id": "fixture-candidate", "role": "baseline"},
            {"id": "fixture-candidate", "role": "student"},
        ]
    })
    write(root / "duplicate-inventory.json", {"manifest": "manifest.json", "candidate_inventory": "duplicate-candidates.json", "candidate_id": "fixture-candidate", "seed": 17,
                                                 "max_source_chars": 256, "max_target_chars": 256, "checkpoint_dir": "checkpoints"})
    result = run(root / "duplicate-inventory.json")
    assert result.returncode != 0 and "IDs must be unique" in result.stderr

    write(root / "malformed-candidates.json", {"candidates": [{"id": "fixture-candidate", "role": ""}]})
    write(root / "malformed-inventory.json", {"manifest": "manifest.json", "candidate_inventory": "malformed-candidates.json", "candidate_id": "fixture-candidate", "seed": 17,
                                                 "max_source_chars": 256, "max_target_chars": 256, "checkpoint_dir": "checkpoints"})
    result = run(root / "malformed-inventory.json")
    assert result.returncode != 0 and "non-empty id and role" in result.stderr

print("training contract checks passed")
