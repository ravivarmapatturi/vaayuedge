# VaayuEdge

> **Less compute. More intelligence.**

Private, lightweight, English-to-Telugu speech intelligence designed to run directly on laptops, mobile phones, and resource-constrained edge devices.

- **Live Web Preview**: [https://ravivarmapatturi.github.io/vaayuedge/](https://ravivarmapatturi.github.io/vaayuedge/)
- **Target Domain**: `vaayuedge.neuralmasteryai.com`
- **Milestone**: **v0.2 — Real On-Device AI Pipeline (CPU Inference)**

---

## What is VaayuEdge?

VaayuEdge is an offline-first speech intelligence platform that converts spoken English into natural, meaning-preserving Telugu text and speech without sending conversations to third-party cloud APIs.

### Key Capabilities (v0.2)
- 🎙️ **Real On-Device ASR**: In-process Whisper CPU transcription (~856ms for 3.0s audio; RTF: 0.28).
- ✍️ **Editable English Transcript**: Inspect and edit transcripts before neural language transfer.
- 🔄 **Real On-Device MT**: Meaning-preserving English-to-Telugu neural translation using `Helsinki-NLP/opus-mt-en-dra` SafeTensors (~637ms per sentence).
- 🔊 **Telugu Speech Synthesis**: Audio synthesis with Web Speech API browser engine fallback.
- 🛡️ **Air-Gap Verified**: Automatic test assertions prove zero outbound network packets during local inference.
- 💾 **Local-Only Storage**: Session history stored in client-side IndexedDB with one-click export and complete local deletion.
- 🔍 **Transparent Connectivity**: Honest indicator showing **Local Engine Connected** or **Static Prototype Mode**.

---

## Monorepo Architecture

```
vaayuedge/
├── apps/
│   └── web/            # React + TypeScript + Vite + Tailwind CSS PWA
├── services/
│   └── api/            # FastAPI backend with Whisper CPU & Opus-MT adapters
├── packages/
│   └── contracts/      # Shared Pydantic contracts & API specs
├── docs/               # Benchmark results, installation, privacy, model cards
├── scripts/            # Single-command launchers, air-gap tests, benchmarks
└── docker-compose.yml  # Local multi-service orchestration
```

---

## Quick Start (On-Device Local Mode)

### Prerequisites
- **Python**: 3.10+ (tested on Python 3.12)
- **Node.js**: v18+
- **ffmpeg** (for audio transcoding)

### Single-Command Launch
```bash
git clone https://github.com/ravivarmapatturi/vaayuedge.git
cd vaayuedge

# Build web frontend and start on-device engine on loopback (127.0.0.1:8000)
./scripts/start-local.sh
```

Open **http://127.0.0.1:8000** in your browser. Audio recording and speech translation will run 100% on your laptop's CPU.

---

## Verification & Benchmarks

### 1. Air-Gap Offline Verification
Verify zero network requests and authentic Telugu generation:
```bash
python3 scripts/verify-local-mode.py
```

### 2. Edge Performance Benchmark
Profile real latency, memory delta, and accuracy:
```bash
python3 scripts/benchmark.py --mode real
```

**Measured Latency (12-core laptop CPU)**:
- **Whisper ASR (3.0s audio)**: ~856 ms
- **Opus-MT Translation**: ~637 ms
- **End-to-End Pipeline**: **1,726.98 ms**
- **Peak RAM Footprint**: ~1,525 MB
- **Outbound Packets**: **0**

For complete methodology and benchmarks, see [docs/benchmark-results.md](docs/benchmark-results.md).

---

## Running Test Suites

```bash
# Backend test suite (FastAPI, Whisper & Opus-MT adapters, API contracts)
PYTHONPATH=services/api python3 -m pytest services/api/tests/ -v

# Frontend test suite (Vitest + Happy-DOM)
cd apps/web && npm test

# Compile production web client
cd apps/web && npm run build
```

---

## Privacy & Model Cards

- **Privacy & Threat Model**: See [docs/privacy-and-threat-model.md](docs/privacy-and-threat-model.md) for loopback binding guarantees and air-gap audit procedures.
- **Model Cards & Licenses**: See [docs/model-cards.md](docs/model-cards.md) for Whisper (MIT) and OPUS-MT (Apache 2.0 / CC-BY-4.0) attribution.
- **Local Installation**: Detailed guide in [docs/local-installation.md](docs/local-installation.md).
