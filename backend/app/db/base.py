"""
Cria a engine, SessionLocal e exporta a Base (de base_class).

Tudo centralizado para evitar import-loops.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.db.base_class import Base   #  ← agora existe!

# ------------------------------------------------------------------
# Engine / Session
# ------------------------------------------------------------------
engine = create_engine(
    settings.DATABASE_URL,   # ex.: mysql+pymysql://root:SENHA@localhost/central_system
    pool_pre_ping=True,
    pool_recycle=3600,
)

# fabrica de sessões
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# conveniência para dependência FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
