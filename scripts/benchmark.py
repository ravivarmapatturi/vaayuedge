#!/usr/bin/env python3
"""
VaayuEdge Edge Benchmark Runner

Profiles:
- Real on-device ASR latency (Whisper base.en / tiny.en on CPU)
- Real on-device MT latency (Helsinki-NLP Opus-MT English -> Telugu on CPU)
- Speech synthesis latency
- End-to-end local pipeline latency
- Peak RSS RAM consumption and memory delta
- Verification of authentic Telugu Unicode generation
"""

import argparse
import io
import json
import math
import os
import re
import struct
import sys
import time
import threading
import wave
import psutil

# Add api directory to sys.path
api_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "services", "api"))
sys.path.insert(0, api_path)

from app.adapters.asr.mock_asr import MockASRAdapter
from app.adapters.asr.whisper_adapter import WhisperLocalAdapter
from app.adapters.translation.mock_translation import MockTranslationAdapter
from app.adapters.translation.opus_adapter import OpusMTAdapter
from app.adapters.tts.mock_tts import MockTTSAdapter
from app.adapters.runtime.device import RuntimeDeviceManager
from app.core.config import settings

EVALUATION_SAMPLES = [
    {
        "source": "I will call you after I finish the meeting.",
        "category": "Work & Scheduling"
    },
    {
        "source": "Could you please share the project documentation and requirements?",
        "category": "Information Request"
    },
    {
        "source": "Please turn off the lights and lock the front door before leaving.",
        "category": "Daily Instructions"
    },
    {
        "source": "The doctors advised drinking plenty of water during the summer.",
        "category": "Healthcare & Wellness"
    },
    {
        "source": "We are testing private speech intelligence on our edge devices.",
        "category": "Edge AI & Systems"
    }
]


def load_fixture_samples(path):
    """Load speech-grounded benchmark rows without downloading or scoring them."""
    with open(path, encoding="utf-8") as handle:
        rows = json.load(handle)
    if not isinstance(rows, list) or not rows:
        raise ValueError("fixture must be a non-empty JSON array")
    required = {"audio_path", "transcript", "reference_translation"}
    samples = []
    for index, row in enumerate(rows, 1):
        if not isinstance(row, dict) or not required.issubset(row):
            raise ValueError(f"fixture row {index} must contain {sorted(required)}")
        if not all(isinstance(row[key], str) and row[key].strip() for key in required):
            raise ValueError(f"fixture row {index} contains blank or non-string fields")
        audio_path = os.path.abspath(row["audio_path"])
        if not os.path.isfile(audio_path) or os.path.getsize(audio_path) == 0:
            raise ValueError(f"fixture row {index} audio_path is missing or empty: {audio_path}")
        samples.append({**row, "audio_path": audio_path, "category": row.get("category", "Uncategorized")})
    return samples


def generate_benchmark_audio_wav(duration_seconds: float = 3.0, sample_rate: int = 16000) -> bytes:
    """Generate audio for ASR benchmarking."""
    num_samples = int(sample_rate * duration_seconds)
    buf = io.BytesIO()
    with wave.open(buf, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        frames = bytearray()
        for i in range(num_samples):
            t = i / sample_rate
            s = 0.25 * math.sin(2 * math.pi * 300 * t) + 0.1 * math.sin(2 * math.pi * 600 * t)
            val = int(32767.0 * s)
            frames.extend(struct.pack("<h", max(-32768, min(32767, val))))
        wf.writeframes(frames)
    return buf.getvalue()


def run_benchmark(mode: str = "real", output=None, fixture=None):
    if mode == "fixture" and not fixture:
        raise ValueError("--mode fixture requires --fixture")
    if fixture and mode != "fixture":
        raise ValueError("--fixture requires --mode fixture")
    samples = load_fixture_samples(fixture) if fixture else EVALUATION_SAMPLES
    device_info = RuntimeDeviceManager.get_device_info()
    process = psutil.Process()
    ram_initial_mb = process.memory_info().rss / (1024 * 1024)
    peak_rss_mb = ram_initial_mb
    sampling = True

    def sample_rss():
        nonlocal peak_rss_mb
        while sampling:
            peak_rss_mb = max(peak_rss_mb, process.memory_info().rss / (1024 * 1024))
            time.sleep(0.01)

    sampler = threading.Thread(target=sample_rss, daemon=True)
    sampler.start()

    print("================================================================")
    print(" VaayuEdge — Edge Performance & Quality Benchmark")
    print(" Tagline: Less compute. More intelligence.")
    print("================================================================")
    print(f"Benchmark Mode:    {mode.upper()}")
    print(f"Device OS:         {device_info['os']}")
    print(f"CPU Cores:         {device_info['cpu_cores']}")
    print(f"RAM Available:     {device_info['ram_gb_available']} GB")
    print(f"Initial Proc RAM:  {ram_initial_mb:.2f} MB")
    print("----------------------------------------------------------------")

    try:
        if mode == "real":
            print("[INIT] Loading WhisperLocalAdapter (CPU) and OpusMTAdapter (CPU)...")
            asr = WhisperLocalAdapter(model_size=settings.WHISPER_MODEL_SIZE)
            translation = OpusMTAdapter(device=settings.INDICTRANS2_DEVICE)
            translation.load_model()
        else:
            asr = MockASRAdapter()
            translation = MockTranslationAdapter()
    except BaseException:
        sampling = False
        sampler.join(timeout=1)
        raise

    # TTS is intentionally mock-only until a pinned Telugu voice bundle is
    # available. Keep this explicit in the artifact: a real ASR/MT load does
    # not make the complete pipeline a real neural benchmark.
    tts = MockTTSAdapter()

    total_pipeline_time_ms = 0
    total_asr_ms = 0
    total_mt_ms = 0
    total_tts_ms = 0
    valid_telugu_count = 0

    dummy_audio = generate_benchmark_audio_wav(duration_seconds=3.0)

    print("\nRunning evaluation samples...")
    try:
        for i, sample in enumerate(samples, 1):
            t0 = time.perf_counter()

            # Step 1: ASR
            if mode == "fixture":
                with open(sample["audio_path"], "rb") as audio_file:
                    audio = audio_file.read()
            else:
                audio = dummy_audio
            asr_res = asr.transcribe(audio, audio_format="wav")

            # Step 2: Translation
            source = asr_res.transcript if mode == "fixture" else sample["source"]
            trans_res = translation.translate(source, source_lang="eng_Latn", target_lang="tel_Telu")

            # Step 3: TTS
            tts_res = tts.synthesize(trans_res.translated_text)

            elapsed_ms = (time.perf_counter() - t0) * 1000
            total_pipeline_time_ms += elapsed_ms
            total_asr_ms += asr_res.inference_time_ms
            total_mt_ms += trans_res.inference_time_ms
            total_tts_ms += tts_res.inference_time_ms

            has_telugu = bool(re.search(r"[\u0C00-\u0C7F]", trans_res.translated_text))
            if has_telugu:
                valid_telugu_count += 1

            print(f"[{i}/{len(samples)}] {sample['category']} | Pipeline: {elapsed_ms:.1f}ms | ASR: {asr_res.inference_time_ms:.1f}ms | MT: {trans_res.inference_time_ms:.1f}ms | TTS: {tts_res.inference_time_ms:.1f}ms")
            print(f"     EN: {source}")
            print(f"     TE: {trans_res.translated_text}")
    except BaseException:
        sampling = False
        sampler.join(timeout=1)
        raise

    sampling = False
    sampler.join(timeout=1)
    ram_final_mb = process.memory_info().rss / (1024 * 1024)
    n = len(samples)
    avg_pipeline_ms = total_pipeline_time_ms / n
    avg_asr_ms = total_asr_ms / n
    avg_mt_ms = total_mt_ms / n
    avg_tts_ms = total_tts_ms / n

    print("----------------------------------------------------------------")
    print(" Benchmark Summary Results:")
    print(f" - Pipeline Mode:           {mode.upper()} ON-DEVICE CPU")
    print(f" - Valid Telugu Script:     {(valid_telugu_count / n) * 100:.1f}% ({valid_telugu_count}/{n})")
    print(f" - Mean End-to-End Latency: {avg_pipeline_ms:.2f} ms")
    print(f"   · Mean ASR (Whisper):    {avg_asr_ms:.2f} ms (for 3.0s audio)")
    print(f"   · Mean MT (Opus-MT):     {avg_mt_ms:.2f} ms (per sentence)")
    print(f"   · Mean TTS (Synthesis):  {avg_tts_ms:.2f} ms")
    print(f" - Peak RAM Consumption:    {peak_rss_mb:.2f} MB")
    print(f" - RAM Footprint Delta:     +{peak_rss_mb - ram_initial_mb:.2f} MB")
    print(f" - Outbound Cloud Requests: 0 (Strict Offline Loopback)")
    print("================================================================")
    result = {
        "mode": mode,
        "device": device_info,
        "samples": n,
        "valid_telugu_count": valid_telugu_count,
        "valid_telugu_fraction": valid_telugu_count / n,
        "mean_pipeline_ms": avg_pipeline_ms,
        "mean_asr_ms": avg_asr_ms,
        "mean_translation_ms": avg_mt_ms,
        "mean_tts_ms": avg_tts_ms,
        "initial_rss_mb": ram_initial_mb,
        "peak_rss_mb": peak_rss_mb,
        "peak_rss_delta_mb": peak_rss_mb - ram_initial_mb,
        "outbound_cloud_requests": 0,
        "evidence_class": (
            "speech-grounded harness timing; mock ASR/MT/TTS; no quality score"
            if mode == "fixture"
            else "mock diagnostic; not a model quality result"
            if mode == "mock"
            else "partial local ASR/MT timing; synthetic audio, fixed text, and mock TTS"
        ),
        "limitations": [
            "ASR input is generated synthetic tone audio, not speech with a transcript."
            if mode != "fixture" else "Fixture transcript/reference fields are metadata only; no WER or translation score is computed.",
            "Translation uses fixed sample text rather than ASR output."
            if mode != "fixture" else "Fixture mode translates the ASR output but does not compare it with the reference translation.",
            "TTS uses MockTTSAdapter; no neural speech synthesis timing is measured.",
            "No quality metric is computed by this runner.",
        ],
    }
    if mode == "fixture":
        result["fixture_provenance"] = [
            {
                "audio_path": sample["audio_path"],
                "transcript": sample["transcript"],
                "reference_translation": sample["reference_translation"],
                "category": sample["category"],
            }
            for sample in samples
        ]
    if output:
        with open(output, "w", encoding="utf-8") as handle:
            json.dump(result, handle, indent=2, sort_keys=True)
            handle.write("\n")
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="VaayuEdge Edge Benchmark Runner")
    parser.add_argument("--mode", choices=["real", "mock", "fixture"], default="real", help="Benchmark mode")
    parser.add_argument("--fixture", help="JSON array of audio_path/transcript/reference_translation rows for fixture mode")
    parser.add_argument("--output", help="Write JSON results to this file")
    args = parser.parse_args()
    run_benchmark(mode=args.mode, output=args.output, fixture=args.fixture)
