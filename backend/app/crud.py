from sqlalchemy.orm import Session
from sqlalchemy import text
from .models import Company
from .database import engine

def create_company(db: Session, name: str):
    """Creates a new company and a separate database for it"""
    db_name = f"db_{name.lower().replace(' ', '_')}"  # Generates a valid DB name
    company = Company(name=name, db_name=db_name)

    # Add the company to the central database
    db.add(company)
    db.commit()
    db.refresh(company)

    # Create a database for the company
    create_franchise_database(db_name)

    return company

def create_franchise_database(db_name: str):
    """Creates a new database for the company"""
    with engine.connect() as connection:
        connection.execute(text(f"CREATE DATABASE IF NOT EXISTS {db_name};"))
        connection.commit()
