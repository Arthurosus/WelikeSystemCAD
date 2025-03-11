from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

Base = declarative_base()

# Criando o engine para o banco central
engine_central = create_engine(settings.database_url, echo=True)

# Criando um SessionLocal para conexões com o banco central
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_central)

def get_db():
    """Obtém uma sessão do banco de dados central."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_franchise_engine(franchise_db_url: str):
    """Cria um engine para uma franquia específica."""
    return create_engine(franchise_db_url, echo=True)

def get_franchise_db(franchise_db_url: str):
    """Cria uma sessão de banco de dados para uma franquia específica."""
    SessionLocalFranchise = sessionmaker(autocommit=False, autoflush=False, bind=get_franchise_engine(franchise_db_url))
    db = SessionLocalFranchise()
    try:
        yield db
    finally:
        db.close()
