from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database connection
DATABASE_URL = f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Returns a session with the central database"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_franchise_db(db_name: str):
    """Creates a dynamic connection to a franchise-specific database"""
    franchise_url = f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}/{db_name}"
    franchise_engine = create_engine(franchise_url)
    FranchiseSession = sessionmaker(autocommit=False, autoflush=False, bind=franchise_engine)
    return FranchiseSession()
