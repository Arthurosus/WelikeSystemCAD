from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from .database import get_db  # Corrigido aqui
from . import crud  # Corrigido aqui

app = FastAPI()

@app.post("/register_company/")
def register_company(name: str, db: Session = Depends(get_db)):
    company = crud.create_company(db, name)
    if not company:
        raise HTTPException(status_code=400, detail="Company already registered")
    
    crud.create_franchise_database(company.db_name)
    return {"message": "Company registered successfully", "company": company.name}
