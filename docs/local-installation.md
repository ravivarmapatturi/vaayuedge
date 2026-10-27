# VaayuEdge v0.2 — Local Installation & Operator Guide

Run private, 100% on-device English-to-Telugu speech intelligence on your laptop. Zero data exfiltration, loopback execution (`127.0.0.1`), and no cloud accounts required.

---

## 1. System Requirements

- **Operating System**: Linux (Ubuntu 20.04+, Debian, Fedora, Arch), macOS (Apple Silicon or Intel), or Windows (WSL2 recommended).
- **Python**: Version 3.10, 3.11, or 3.12.
- **Node.js**: Version 18 or higher (for compiling the frontend).
- **RAM**: Minimum 4 GB; 8 GB or higher recommended.
- **Disk Space**: ~2 GB free disk space for dependencies and cached model weights.
- **Audio Utility**: `ffmpeg` (required for converting diverse audio formats such as WebM/OGG/MP3 to 16kHz PCM for Whisper).

---

## 2. Quick Start (Single Command)

Clone the repository and run the local launcher:

```bash
git clone https://github.com/ravivarmapatturi/vaayuedge.git
cd vaayuedge

# Launch both local backend and compiled web application
./scripts/start-local.sh
```

Now open **http://127.0.0.1:8000** in your browser.  
The status badge in the navbar and console will indicate **Local Engine Connected**.

---

## 3. Step-by-Step Manual Setup

If you prefer to configure components individually:

### Step 3.1: Install System Prerequisites

#### On Ubuntu / Debian:
```bash
sudo apt update
sudo apt install -y python3 python3-pip python3-venv ffmpeg nodejs npm
```

#### On macOS (via Homebrew):
```bash
brew install ffmpeg node python@3.12
```

### Step 3.2: Python Backend Environment
```bash
cd services/api

# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

### Step 3.3: Frontend Client Setup
```bash
cd ../../apps/web
npm install
npm run build  # Compiles production assets into apps/web/dist
```

### Step 3.4: Configure Environment Variables
Copy `.env.example` to `.env` in the repository root:
```bash
cp .env.example .env
```

Key environment configurations in `.env`:
```ini
HOST=127.0.0.1
PORT=8000
PROCESSING_MODE=local
ASR_ADAPTER=whisper_local
WHISPER_MODEL_SIZE=base.en
TRANSLATION_ADAPTER=opus_mt
CORS_ORIGINS=["http://localhost:5173","http://127.0.0.1:5173","http://127.0.0.1:8000","https://ravivarmapatturi.github.io"]
```

### Step 3.5: Run the Services

#### Option A: Unified Server (Serves both API and Web UI on Port 8000)
```bash
cd services/api
PYTHONPATH=. uvicorn app.main:app --host 127.0.0.1 --port 8000
```
Visit: `http://127.0.0.1:8000`

#### Option B: Developer Hot-Reloading Mode
Terminal 1 (Backend API):
```bash
cd services/api
PYTHONPATH=. uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Terminal 2 (Vite Frontend with Dev Proxy):
```bash
cd apps/web
npm run dev
```
Visit: `http://localhost:5173`

---

## 4. Verifying Offline Integrity

### 4.1 Automated Air-Gap Test
Run the automated verification script:
```bash
python3 scripts/verify-local-mode.py
```
This script validates:
- Loopback-only socket binding (`127.0.0.1`).
- In-process Whisper CPU transcription.
- On-device SafeTensors translation into authentic Telugu Unicode (`\u0C00-\u0C7F`).
- **Zero outbound TCP connections** during inference.

### 4.2 Performance Benchmark
Run the performance benchmark runner to profile latency and memory:
```bash
python3 scripts/benchmark.py --mode real
```

### 4.3 Running the Test Suites
Backend tests:
```bash
PYTHONPATH=services/api python3 -m pytest services/api/tests/ -v
```

Frontend tests:
```bash
cd apps/web
npm test
```

---

## 5. Troubleshooting & FAQ

### Q: Why does the hosted GitHub Pages site say "Static Prototype Mode"?
**A**: GitHub Pages is a static file host; it cannot execute a persistent Python inference engine on your computer. When you browse `https://ravivarmapatturi.github.io/vaayuedge/`, the web app probes `http://127.0.0.1:8000`. If you run `./scripts/start-local.sh` on your computer, the local engine activates and handles inference directly.

### Q: How do I switch to a smaller or larger Whisper model?
**A**: Set `WHISPER_MODEL_SIZE=tiny.en` (~75 MB, lowest latency) or `WHISPER_MODEL_SIZE=small.en` (~466 MB, higher precision) in your `.env` file.

### Q: How do I clean up saved history?
**A**: Click **History** in the interactive console and select **Clear All History**. All IndexedDB records are purged immediately from your browser.
