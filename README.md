# VayyuEdge

> **Less compute. More intelligence.**

Private, lightweight, English-to-Telugu speech intelligence designed to run directly on laptops, mobile phones, and resource-constrained edge devices.

Working Product Identity: **VayyuEdge** · Built on [neuralmasteryai.com](https://neuralmasteryai.com)  
Deployment target: `vayyuedge.neuralmasteryai.com`

---

## What is VayyuEdge?

VayyuEdge is an offline-first speech translation system that converts spoken English into natural, meaning-preserving Telugu text and speech without sending conversations to third-party cloud APIs in local mode.

### Key Capabilities
- 🎙️ **Audio Capture & Upload**: Record directly from the microphone or upload audio files (WAV, MP3, WebM, OGG).
- ✍️ **Editable English Transcript**: Transcribe speech locally and correct words before translation.
- 🔄 **Semantic Telugu Translation**: Context-aware linguistic transfer to Telugu (`eng_Latn` → `tel_Telu`) preserving intent, tone, and nuance.
- 🔊 **Telugu Speech Synthesis**: Play back translated Telugu speech with responsive fallback to native synthesis engines.
- 🛡️ **Offline-First & Transparent**: Explicit badge for local vs remote processing. Never claims local execution unless truly on-device.
- 💾 **Local-Only Storage**: Session history stored in client-side IndexedDB with one-click export and complete local deletion.

---

## Monorepo Architecture

```
vayyuedge/
├── apps/
│   └── web/            # React + TypeScript + Vite + Tailwind CSS PWA
├── services/
│   └── api/            # FastAPI application with pluggable ML adapters
├── packages/
│   └── contracts/      # OpenAPI schemas & shared TypeScript types
├── docs/               # Architecture, PRD, privacy, model cards, deployment
├── scripts/            # Setup, model downloader, and benchmark runners
└── docker-compose.yml  # Local multi-service orchestration
```

---

## Quick Start (Local Development)

### Prerequisites
- **Node.js**: v18+ (v20+ recommended)
- **Python**: 3.10+ (tested on Python 3.12)
- **Git**

### 1. Automated Setup
Run the development setup script:
```bash
./scripts/setup-dev.sh
```

### 2. Manual Setup

#### Backend (FastAPI API Daemon)
```bash
cd services/api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API documentation will be available at: `http://localhost:8000/docs`

#### Frontend (React + Vite Web App)
```bash
cd apps/web
npm install
npm run dev
```
The web application will be accessible at: `http://localhost:5173`

---

## Testing

```bash
# Backend unit & integration tests
cd services/api
pytest tests/ -v

# Frontend unit & component tests
cd apps/web
npm test

# Full benchmark evaluation
python3 scripts/benchmark.py --mode local
```

---

## Privacy & Security

- **Strict Offline Mode**: In local mode, zero telemetry or audio packets are dispatched to external cloud servers.
- **No Stored Audio**: Audio is held in transient memory only for inference and immediately unlinked.
- **Model Licenses**: See [docs/model-cards.md](docs/model-cards.md) for licensing, attribution, and model weight details.

---

## License

Source code is released under the [MIT License](LICENSE). Third-party models (Whisper, IndicTrans2, Telugu TTS) retain their respective upstream licenses.
