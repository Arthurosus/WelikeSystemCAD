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
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
