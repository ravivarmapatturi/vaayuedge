#!/usr/bin/env python3
"""Report local model-bundle readiness without loading or downloading models."""

import argparse
import json
import os
import platform
import sys
from pathlib import Path


def size_bytes(path: Path) -> int:
    if path.is_file():
        return path.stat().st_size
    return sum(item.stat().st_size for item in path.rglob("*") if item.is_file())


def file_count(path: Path) -> int:
    if path.is_file():
        return 1
    return sum(1 for item in path.rglob("*") if item.is_file())


def inspect_path(label: str, raw_path: str, root: Path) -> dict:
    path = Path(raw_path)
    if not path.is_absolute():
        path = root / path
    path = path.resolve()
    exists = path.exists()
    return {"label": label, "configured_path": raw_path, "resolved_path": str(path),
            "exists": exists, "kind": "directory" if path.is_dir() else "file" if path.is_file() else "missing",
            "size_bytes": size_bytes(path) if exists else 0,
            "file_count": file_count(path) if exists else 0,
            "readable": os.access(path, os.R_OK) if exists else False}


def required_bundle_labels(adapters: dict) -> set[str]:
    """Return bundles needed by the configured adapters.

    Mock adapters intentionally have no local model bundle.  Unknown adapters
    remain conservative and require their corresponding configured bundle.
    """
    requirements = {
        "asr": ("mock", "whisper_cpp_binary", "whisper_cpp_model"),
        "translation": ("mock", "translation_model"),
        "tts": ("mock", "tts_model"),
    }
    required = set()
    for component, (mock_name, *labels) in requirements.items():
        if adapters.get(component, "") != mock_name:
            required.update(labels)
    return required


def build_report(root: Path, env: dict | None = None) -> dict:
    env = os.environ if env is None else env
    entries = [
        inspect_path("whisper_cpp_binary", env.get("WHISPER_CPP_BINARY_PATH", "/usr/local/bin/whisper-cli"), root),
        inspect_path("whisper_cpp_model", env.get("WHISPER_CPP_MODEL_PATH", "./models/ggml-tiny.en.bin"), root),
        inspect_path("translation_model", env.get("INDICTRANS2_MODEL_PATH", "./models/indictrans2-en-indic-1B"), root),
        inspect_path("tts_model", env.get("TTS_MODEL_PATH", "./models/tts_telugu"), root),
    ]
    adapters = {"asr": env.get("ASR_ADAPTER", "whisper_local"),
                "translation": env.get("TRANSLATION_ADAPTER", "opus_mt"),
                "tts": env.get("TTS_ADAPTER", "mms_telugu_tts")}
    required = required_bundle_labels(adapters)
    total_bytes = sum(item["size_bytes"] for item in entries)
    # An empty directory is not a usable model bundle.  Keep this preflight
    # conservative: it only checks that a required path is readable and
    # contains at least one byte/file; it never opens or loads model content.
    missing = [item["label"] for item in entries
               if item["label"] in required and not (
                   item["exists"] and item["readable"]
                   and item["size_bytes"] > 0 and item["file_count"] > 0
               )]
    return {"evidence_class": "deployment preflight; no model loading or inference",
            "repository_root": str(root), "platform": platform.platform(), "python": sys.version.split()[0],
            "configured_adapters": adapters,
            "bundles": entries, "total_discovered_bytes": total_bytes,
            "required_bundles": sorted(required), "missing_bundles": missing,
            "total_discovered_mb": round(total_bytes / (1024 * 1024), 3),
            "ready_for_local_bundle_benchmark": not missing,
            "limitations": ["Presence and disk size do not establish model quality, RAM use, latency, or license rights.",
                            "The current end-to-end benchmark still uses synthetic audio, fixed text, and mock TTS."]}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", default=os.path.join(os.path.dirname(__file__), ".."))
    parser.add_argument("--output")
    args = parser.parse_args()
    report = build_report(Path(args.root).resolve())
    rendered = json.dumps(report, indent=2, sort_keys=True)
    print(rendered)
    if args.output:
        output = Path(args.output)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(rendered + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
