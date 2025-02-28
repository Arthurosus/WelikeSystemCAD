from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings

# Engine e sessão para o banco de dados principal
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Função para conectar a uma franquia específica
def get_franchise_db(db_name: str):
    franchise_engine = create_engine(f"{settings.DATABASE_URL_ROOT}/{db_name}")
    FranchiseSession = sessionmaker(autocommit=False, autoflush=False, bind=franchise_engine)
    db = FranchiseSession()
    try:
        yield db
    finally:
        db.close()
