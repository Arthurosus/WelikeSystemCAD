# app/db/base.py
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings   # Settings tem 'database_url'

Base = declarative_base()

# Engine para o banco central
engine = create_engine(
    settings.database_url,   # <- minúsculo, corresponde ao .env
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)
