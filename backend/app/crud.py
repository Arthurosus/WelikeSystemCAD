from sqlalchemy.orm import Session
from . import models

def create_company(db: Session, name: str):
    db_name = name.lower().replace(" ", "_")
    existing_company = db.query(models.Company).filter(models.Company.name == name).first()
    
    if existing_company:
        return None
    
    new_company = models.Company(name=name, db_name=db_name)
    db.add(new_company)
    db.commit()
    db.refresh(new_company)
    
    return new_company


def create_franchise_database(db_name: str):
    from sqlalchemy import create_engine
    engine = create_engine(f"mysql+pymysql://root:password@localhost/")
    with engine.connect() as conn:
        conn.execute(f"CREATE DATABASE IF NOT EXISTS {db_name}")
    print(f"Database {db_name} created successfully")
