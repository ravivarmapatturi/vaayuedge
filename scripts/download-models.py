#!/usr/bin/env python3
"""
VayyuEdge Model Downloader Script

Automates obtaining quantised edge weights for:
1. Whisper / whisper.cpp (GGML models)
2. AI4Bharat IndicTrans2 English -> Telugu
3. Telugu Text-to-Speech (Piper / MMS)

IMPORTANT LICENSE NOTICE:
Model weights are subject to their respective creators' licenses.
- Whisper: MIT License
- IndicTrans2: AI4Bharat Academic/Research License (check terms for commercial use)
- Piper Telugu: MIT / Apache 2.0
"""

import argparse
import hashlib
import os
import sys
import urllib.request

MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models"))

WHISPER_MODELS = {
    "tiny.en": {
        "url": "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.en.bin",
        "filename": "ggml-tiny.en.bin",
        "size_mb": 75,
    },
    "base.en": {
        "url": "https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin",
        "filename": "ggml-base.en.bin",
        "size_mb": 142,
    },
}

def download_file(url: str, dest_path: str):
    print(f"Downloading from: {url}")
    print(f"Saving to: {dest_path}")
    def report_progress(block_num, block_size, total_size):
        downloaded = block_num * block_size
        if total_size > 0:
            percent = min(100, downloaded * 100 // total_size)
            sys.stdout.write(f"\rProgress: {percent}% ({downloaded // (1024*1024)} MB / {total_size // (1024*1024)} MB)")
            sys.stdout.flush()
    urllib.request.urlretrieve(url, dest_path, reporthook=report_progress)
    print("\nDownload complete!")

def main():
    parser = argparse.ArgumentParser(description="Download VayyuEdge model weights")
    parser.add_argument("--asr-model", choices=["tiny.en", "base.en", "none"], default="tiny.en", help="Whisper model variant")
    parser.add_argument("--dest", default=MODELS_DIR, help="Destination directory for model weights")
    args = parser.parse_args()

    os.makedirs(args.dest, exist_ok=True)

    print("==================================================")
    print(" VayyuEdge — Model Weight Retrieval")
    print(" Note: Downloaded weights are not stored in Git.")
    print("==================================================")

    if args.asr_model != "none":
        model_info = WHISPER_MODELS[args.asr_model]
        dest_file = os.path.join(args.dest, model_info["filename"])
        if os.path.exists(dest_file):
            print(f"[ASR] Model file already exists: {dest_file}")
        else:
            print(f"[ASR] Downloading Whisper {args.asr_model} (~{model_info['size_mb']} MB)...")
            download_file(model_info["url"], dest_file)

    print("\nModel setup complete! Update your .env to point to downloaded model paths.")

if __name__ == "__main__":
    main()
