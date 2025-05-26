"""
Centraliza a engine do banco “mestre” e helpers para sub-bancos de franquia.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.db.base_class import Base   # declarative_base()

# ----------------------------------------------------------------------
# BANCO CENTRAL
# ----------------------------------------------------------------------
engine_central = create_engine(
    settings.database_url,             # ← minúsculo!
    pool_pre_ping=True,
    pool_recycle=3600,
    echo=False,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine_central,
)

# Dependência que você já usa nos endpoints “centrais”
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ----------------------------------------------------------------------
# BANCOS DE FRANQUIA
# ----------------------------------------------------------------------
def _franchise_url(name: str) -> str:
    """Monta a URL mysql+pymysql://user:pass@host:port/<franquia>."""
    return (
        f"mysql+pymysql://{settings.DB_USER}:{settings.DB_PASS}"
        f"@{settings.DB_HOST}:{settings.DB_PORT}/{name}"
    )


def _franchise_engine(name: str):
    return create_engine(_franchise_url(name), pool_pre_ping=True)


def get_franchise_db(name: str):
    """
    Dependência FastAPI para injetar uma sessão de banco exclusiva da franquia.
    Exemplo de uso:

    @app.get("/empresas/{franquia}/")
    def listar(franquia: str, db: Session = Depends(get_franchise_db)):
        ...
    """
    SessionFranchise = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=_franchise_engine(name),
    )
    db = SessionFranchise()
    try:
        yield db
    finally:
        db.close()
