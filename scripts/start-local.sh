#!/usr/bin/env bash
set -e

# ==============================================================================
# VaayuEdge v0.2 — Local Daemon & Web App Launcher
# Runs 100% on-device speech intelligence on loopback (127.0.0.1:8000)
# ==============================================================================

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "================================================================="
echo "   VaayuEdge v0.2 — Local Application Launcher"
echo "   Less compute. More intelligence."
echo "================================================================="

# Check prerequisites
command -v python3 >/dev/null 2>&1 || { echo "Error: Python 3 is required."; exit 1; }
command -v ffmpeg >/dev/null 2>&1 || { echo "Warning: ffmpeg not found in PATH. Audio transcoding may be limited."; }

# Python environment with real on-device models (first run downloads ~1.5 GB)
VENV="$PROJECT_ROOT/services/api/.venv"
if [ ! -x "$VENV/bin/python" ]; then
    echo "[SETUP] Creating Python environment..."
    python3 -m venv "$VENV"
fi
PY="$VENV/bin/python"
if ! "$PY" -c "import whisper, transformers, torch, fastapi" >/dev/null 2>&1; then
    echo "[SETUP] Installing engine dependencies (one time)..."
    "$PY" -m pip install --upgrade pip -q
    "$PY" -m pip install -q -r "$PROJECT_ROOT/services/api/requirements.txt" -r "$PROJECT_ROOT/services/api/requirements-ml.txt"
fi

# Build the web client if Node is available (the hosted site works without it)
if [ ! -d "$PROJECT_ROOT/apps/web/dist" ] && command -v npm >/dev/null 2>&1; then
    echo "[BUILD] Building web client..."
    (cd "$PROJECT_ROOT/apps/web" && npm install --silent && npm run build)
fi

# Ensure .env is present
if [ ! -f "$PROJECT_ROOT/.env" ]; then
    cp "$PROJECT_ROOT/.env.example" "$PROJECT_ROOT/.env"
fi

echo "[START] Launching VaayuEdge on loopback: http://127.0.0.1:8000"
echo "        Zero external network requests. All audio stays on this device."
echo "        Press Ctrl+C to stop."
echo "-----------------------------------------------------------------"

cd "$PROJECT_ROOT/services/api"
export PYTHONPATH="$PROJECT_ROOT/services/api:$PYTHONPATH"
exec "$PY" -m uvicorn app.main:app --host 127.0.0.1 --port 8000
