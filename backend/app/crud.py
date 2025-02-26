from sqlalchemy.orm import Session
from sqlalchemy import text
from .models import Company
from .database import engine

def create_company(db: Session, name: str):
    """Cria uma nova empresa e um banco de dados separado para ela"""
    db_name = f"db_{name.lower().replace(' ', '_')}"  # Gera um nome válido
    company = Company(name=name, db_name=db_name)

    # Adiciona a empresa ao banco central
    db.add(company)
    db.commit()
    db.refresh(company)

    # Criar banco de dados para a empresa
    create_franchise_database(db_name)

    return company

def create_franchise_database(db_name: str):
    """Cria um novo banco de dados para a empresa"""
    with engine.connect() as connection:
        connection.execute(text(f"CREATE DATABASE IF NOT EXISTS {db_name};"))
        connection.commit()
