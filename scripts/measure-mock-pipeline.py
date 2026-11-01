#!/usr/bin/env python3
"""Measure the mock ASR -> translation -> TTS pipeline on CPU.

This is a repeatable plumbing diagnostic only. It deliberately reports mock
adapter timings and must not be used as a production or model comparison.
"""
import argparse
import json
import os
import statistics
import sys
import time
from pathlib import Path


def percentile(values, fraction):
    ordered = sorted(values)
    index = min(len(ordered) - 1, max(0, int((len(ordered) - 1) * fraction)))
    return ordered[index]


def run(iterations=5, warmup=1):
    root = Path(__file__).resolve().parents[1]
    sys.path.insert(0, str(root / "services" / "api"))
    from app.adapters.asr.mock_asr import MockASRAdapter
    from app.adapters.translation.mock_translation import MockTranslationAdapter
    from app.adapters.tts.mock_tts import MockTTSAdapter

    asr, translator, tts = MockASRAdapter(), MockTranslationAdapter(), MockTTSAdapter()
    samples = []
    for _ in range(warmup + iterations):
        start = time.perf_counter()
        asr_result = asr.transcribe(b"\0" * 32000)
        translation_result = translator.translate(asr_result.transcript)
        tts_result = tts.synthesize(translation_result.translated_text)
        elapsed = (time.perf_counter() - start) * 1000
        if len(samples) >= warmup:
            samples.append({
                "wall_ms": elapsed,
                "asr_reported_ms": asr_result.inference_time_ms,
                "translation_reported_ms": translation_result.inference_time_ms,
                "tts_reported_ms": tts_result.inference_time_ms,
                "audio_bytes": len(tts_result.audio_bytes),
            })
        else:
            samples.append(None)
    samples = [sample for sample in samples if sample is not None]
    wall = [sample["wall_ms"] for sample in samples]
    return {
        "evidence_class": "mock pipeline timing diagnostic; not a model or deployment result",
        "device": "cpu",
        "adapters": {"asr": "mock", "translation": "mock", "tts": "mock"},
        "iterations": iterations,
        "warmup": warmup,
        "wall_time_ms": {"mean": statistics.mean(wall), "p50": percentile(wall, .50), "p95": percentile(wall, .95)},
        "reported_adapter_time_ms": {
            name: {"mean": statistics.mean(sample[name] for sample in samples)}
            for name in ("asr_reported_ms", "translation_reported_ms", "tts_reported_ms")
        },
        "audio_bytes_mean": statistics.mean(sample["audio_bytes"] for sample in samples),
        "limitations": ["Mock adapters add fixed synthetic timing offsets.", "No quality, RAM, energy, or real-model latency claim is established."],
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--iterations", type=int, default=5)
    parser.add_argument("--warmup", type=int, default=1)
    args = parser.parse_args()
    if args.iterations < 1 or args.warmup < 0:
        parser.error("--iterations must be positive and --warmup nonnegative")
    print(json.dumps(run(args.iterations, args.warmup), indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
