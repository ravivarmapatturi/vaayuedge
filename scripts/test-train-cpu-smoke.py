#!/usr/bin/env python3
"""Dependency-light regression checks for the CPU smoke checkpoint contract."""
import json
import subprocess
import sys
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TRAINER = ROOT / "scripts" / "train_cpu_smoke.py"


def main():
    with tempfile.TemporaryDirectory(prefix="vaayuedge-cpu-smoke-") as directory:
        root = Path(directory)
        train = root / "train.jsonl"
        validation = root / "validation.jsonl"
        checkpoint = root / "nested" / "checkpoint.pt"
        uninterrupted = root / "uninterrupted.pt"
        rows = [{"source": "hello", "target": "హలో"}, {"source": "thanks", "target": "ధన్యవాదాలు"}]
        train.write_text("\n".join(json.dumps(row, ensure_ascii=False) for row in rows) + "\n", encoding="utf-8")
        validation.write_text(json.dumps(rows[0], ensure_ascii=False) + "\n", encoding="utf-8")

        first = subprocess.run([sys.executable, str(TRAINER), str(train), str(validation), str(checkpoint), "--epochs", "1"], text=True, capture_output=True, check=True)
        report = json.loads(first.stdout)
        assert report["epochs_completed"] == 1
        resumed = subprocess.run([sys.executable, str(TRAINER), str(train), str(validation), str(checkpoint), "--epochs", "2"], text=True, capture_output=True, check=True)
        assert json.loads(resumed.stdout)["epochs_completed"] == 2

        subprocess.run([sys.executable, str(TRAINER), str(train), str(validation), str(uninterrupted), "--epochs", "2"], text=True, capture_output=True, check=True)
        import torch

        resumed_state = torch.load(checkpoint, map_location="cpu", weights_only=True)
        uninterrupted_state = torch.load(uninterrupted, map_location="cpu", weights_only=True)
        assert resumed_state["epoch"] == uninterrupted_state["epoch"] == 2
        assert resumed_state["vocabulary"] == uninterrupted_state["vocabulary"]
        for name, tensor in uninterrupted_state["model"].items():
            assert torch.equal(resumed_state["model"][name], tensor), f"resumed model diverged at {name}"
        for name, state in uninterrupted_state["optimizer"]["state"].items():
            for field, value in state.items():
                if torch.is_tensor(value):
                    assert torch.equal(resumed_state["optimizer"]["state"][name][field], value), f"resumed optimizer diverged at {name}/{field}"
                else:
                    assert resumed_state["optimizer"]["state"][name][field] == value

        # The checkpoint is an epoch boundary, not a per-row progress marker.
        # This keeps the recovery contract explicit for interrupted runs.
        assert resumed_state["epoch"] == 2
        stale = subprocess.run([sys.executable, str(TRAINER), str(train), str(validation), str(checkpoint), "--epochs", "2"], text=True, capture_output=True)
        assert stale.returncode != 0 and "request a larger --epochs" in stale.stderr

        checkpoint.write_bytes(b"truncated checkpoint")
        malformed = subprocess.run([sys.executable, str(TRAINER), str(train), str(validation), str(checkpoint), "--epochs", "2"], text=True, capture_output=True)
        assert malformed.returncode != 0 and "invalid CPU smoke checkpoint" in malformed.stderr
    print("CPU smoke checkpoint contract checks passed")


if __name__ == "__main__":
    main()
