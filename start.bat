@echo off
rem Deploiement local automatique (Windows) : double-cliquez sur ce fichier
cd /d "%~dp0"
where py >nul 2>nul && (set PY=py -3) || (set PY=python)
if not exist .venv (%PY% -m venv .venv)
call .venv\Scripts\activate.bat
pip install -q -r requirements.txt
if not exist .env copy .env.example .env >nul
python tools\export_content.py
start "" cmd /c "timeout /t 3 >nul & start http://localhost:8000"
echo Portfolio : http://localhost:8000  (Ctrl+C pour arreter)
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
pause
