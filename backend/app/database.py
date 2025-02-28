from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings

DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_franchise_db(franchise_name: str):
    engine_franchise = create_engine(f"{DATABASE_URL}/{franchise_name}", pool_pre_ping=True)
    SessionFranchise = sessionmaker(autocommit=False, autoflush=False, bind=engine_franchise)
    return SessionFranchise()
