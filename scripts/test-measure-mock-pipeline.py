#!/usr/bin/env python3
"""Regression checks for the mock pipeline timing diagnostic."""
import importlib.util
from pathlib import Path

script = Path(__file__).with_name("measure-mock-pipeline.py")
spec = importlib.util.spec_from_file_location("measure_mock_pipeline", script)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

report = module.run(iterations=2, warmup=1)
assert report["evidence_class"].startswith("mock pipeline timing")
assert report["device"] == "cpu"
assert report["iterations"] == 2
assert report["wall_time_ms"]["p95"] >= report["wall_time_ms"]["p50"]
assert report["audio_bytes_mean"] > 44
print("mock pipeline measurement checks passed")
