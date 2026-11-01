#!/usr/bin/env python3
"""Regression checks for the speech-grounded benchmark fixture contract."""

import json
import contextlib
import io
import tempfile
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
import benchmark  # noqa: E402


def main():
    with tempfile.TemporaryDirectory() as temp:
        root = Path(temp)
        audio = root / "sample.wav"
        audio.write_bytes(benchmark.generate_benchmark_audio_wav(0.05))
        fixture = root / "fixture.json"
        fixture.write_text(json.dumps([{
            "audio_path": str(audio),
            "transcript": "Hello, how are you?",
            "reference_translation": "నమస్కారం, మీరు ఎలా ఉన్నారు?",
            "category": "Greeting",
        }]), encoding="utf-8")
        samples = benchmark.load_fixture_samples(str(fixture))
        assert samples[0]["category"] == "Greeting"
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            result = benchmark.run_benchmark("fixture", fixture=str(fixture))
        assert result["samples"] == 1
        assert "[1/1] Greeting" in output.getvalue()
        assert result["evidence_class"].startswith("speech-grounded harness timing")
        assert "no WER" in result["limitations"][0]
        assert result["fixture_provenance"] == [{
            "audio_path": str(audio.resolve()),
            "transcript": "Hello, how are you?",
            "reference_translation": "నమస్కారం, మీరు ఎలా ఉన్నారు?",
            "category": "Greeting",
        }]

        bad = root / "bad.json"
        bad.write_text(json.dumps([{"audio_path": str(audio), "transcript": "x"}]), encoding="utf-8")
        try:
            benchmark.load_fixture_samples(str(bad))
        except ValueError as exc:
            assert "reference_translation" in str(exc)
        else:
            raise AssertionError("incomplete fixture was accepted")
    print("benchmark fixture contract: PASS")


if __name__ == "__main__":
    main()
