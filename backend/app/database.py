from sqlalchemy import create_engine
from sqlalchemy.pool import NullPool
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from .config import DATABASE_URL, ON_VERCEL

_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
_pool = {"poolclass": NullPool} if ON_VERCEL else {"pool_pre_ping": True}  # serverless : pas de pool persistant
engine = create_engine(DATABASE_URL, connect_args=_args, **_pool)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
