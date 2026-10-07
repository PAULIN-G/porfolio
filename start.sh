#!/usr/bin/env bash
# Déploiement local automatique (Linux / macOS / Git Bash)
set -e
cd "$(dirname "$0")"
PY=$(command -v python3 || command -v python) || { echo "Python 3.10+ requis"; exit 1; }
[ -d .venv ] || "$PY" -m venv .venv
# shellcheck disable=SC1091
source .venv/bin/activate 2>/dev/null || source .venv/Scripts/activate
pip install -q -r requirements.txt
[ -f .env ] || cp .env.example .env
python tools/export_content.py
PORT="${PORT:-8000}"
( sleep 2; (command -v xdg-open >/dev/null && xdg-open "http://localhost:$PORT") || (command -v open >/dev/null && open "http://localhost:$PORT") ) >/dev/null 2>&1 &
echo "Portfolio : http://localhost:$PORT   (Ctrl+C pour arrêter)"
exec python -m uvicorn backend.app.main:app --host 127.0.0.1 --port "$PORT"
