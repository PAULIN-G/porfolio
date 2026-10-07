import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[2]
FRONTEND_DIR = BASE_DIR / "public"
ON_VERCEL = bool(os.getenv("VERCEL"))


def _load_env() -> None:
    f = BASE_DIR / ".env"
    if not f.exists():
        return
    for line in f.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            k, v = line.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"'))


_load_env()

_url = os.getenv("DATABASE_URL") or os.getenv("POSTGRES_URL") or ""
if not _url:
    # Sur Vercel seul /tmp est inscriptible (et éphémère) : prévoir PostgreSQL en production.
    _url = "sqlite:////tmp/portfolio.db" if ON_VERCEL else "sqlite:///./database/portfolio.db"
if _url.startswith("sqlite:///./"):
    _url = "sqlite:///" + str(BASE_DIR / _url[len("sqlite:///./"):])
for _p in ("postgres://", "postgresql://"):  # Neon / Vercel fournissent ces formes
    if _url.startswith(_p):
        _url = "postgresql+psycopg://" + _url[len(_p):]

DATABASE_URL = _url
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "")
CORS_ORIGINS = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:8000").split(",") if o.strip()]
