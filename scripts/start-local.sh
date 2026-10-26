#!/usr/bin/env bash
set -e

# ==============================================================================
# VayyuEdge v0.2 — Local Daemon & Web App Launcher
# Runs 100% on-device speech intelligence on loopback (127.0.0.1:8000)
# ==============================================================================

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "================================================================="
echo "   VayyuEdge v0.2 — Local Application Launcher"
echo "   Less compute. More intelligence."
echo "================================================================="

# Check prerequisites
command -v python3 >/dev/null 2>&1 || { echo "Error: Python 3 is required."; exit 1; }
command -v ffmpeg >/dev/null 2>&1 || { echo "Warning: ffmpeg not found in PATH. Audio transcoding may be limited."; }

# Verify or build web assets
if [ ! -d "$PROJECT_ROOT/apps/web/dist" ]; then
    echo "[BUILD] Building frontend web client..."
    cd "$PROJECT_ROOT/apps/web"
    if [ ! -d "node_modules" ]; then
        npm install
    fi
    npm run build
    cd "$PROJECT_ROOT"
fi

# Ensure .env is present
if [ ! -f "$PROJECT_ROOT/.env" ]; then
    cp "$PROJECT_ROOT/.env.example" "$PROJECT_ROOT/.env"
fi

echo "[START] Launching VayyuEdge on loopback: http://127.0.0.1:8000"
echo "        Zero external network requests. All audio stays on this device."
echo "        Press Ctrl+C to stop."
echo "-----------------------------------------------------------------"

cd "$PROJECT_ROOT/services/api"
export PYTHONPATH="$PROJECT_ROOT/services/api:$PYTHONPATH"
exec python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000
