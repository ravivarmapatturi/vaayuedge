#!/usr/bin/env bash
set -e

echo "============================================="
echo "   VayyuEdge — Development Setup"
echo "   Less compute. More intelligence."
echo "============================================="

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "1. Checking prerequisites..."
command -v node >/dev/null 2>&1 || { echo "Error: Node.js is not installed."; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "Error: Python 3 is not installed."; exit 1; }

echo "2. Setting up API service (FastAPI)..."
cd "$PROJECT_ROOT/services/api"
if [ ! -d ".venv" ]; then
    python3 -m venv .venv || echo "Virtualenv already present or shared"
fi
if [ -f ".venv/bin/activate" ]; then
    source .venv/bin/activate
fi
pip install -r requirements.txt

echo "3. Setting up Web client (React + Vite)..."
cd "$PROJECT_ROOT/apps/web"
npm install

echo "4. Checking environment configuration..."
cd "$PROJECT_ROOT"
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Created .env from .env.example"
fi

echo "============================================="
echo "   Setup Complete!"
echo "   Start backend: cd services/api && uvicorn app.main:app --reload"
echo "   Start frontend: cd apps/web && npm run dev"
echo "============================================="
