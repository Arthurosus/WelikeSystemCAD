from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db, Base, engine_central
from app.crud import create_company
from app.schemas import CompanyCreate

# Criar tabelas no banco de dados central
Base.metadata.create_all(bind=engine_central)

app = FastAPI()

@app.post("/create_company/")
def create_new_company(company: CompanyCreate, db: Session = Depends(get_db)):
    return create_company(db, company.dict())
