from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import engine_central as engine, get_db
from app.models import Base
from app.crud import create_company
from app.schemas import CompanyCreate

# Criar tabelas no banco de dados central
Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.post("/create_company/")
def create_new_company(company: CompanyCreate, db: Session = Depends(get_db)):
    return create_company(db, company)
