from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import CORS_ORIGINS, FRONTEND_DIR
from .database import Base, SessionLocal, engine
from .routes import router
from .seed import sync_content


@asynccontextmanager
async def lifespan(_: FastAPI):
    try:
        Base.metadata.create_all(engine)
        with SessionLocal() as db:
            sync_content(db)
    except Exception as exc:  # démarrages simultanés en serverless : un autre processus a déjà synchronisé
        print("Synchronisation du contenu ignorée :", exc)
    yield


app = FastAPI(title="Portfolio API", version="1.0.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=CORS_ORIGINS, allow_methods=["GET", "POST"], allow_headers=["*"])
app.include_router(router, prefix="/api")
if FRONTEND_DIR.is_dir():  # en local FastAPI sert le site ; sur Vercel c'est public/ via le CDN
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="site")
