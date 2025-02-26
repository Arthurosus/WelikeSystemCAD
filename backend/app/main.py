from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from .database import get_db, get_franchise_db
from . import crud, models

app = FastAPI()

@app.post("/register_company/")
def register_company(name: str, db: Session = Depends(get_db)):
    """Registra uma nova empresa e cria um banco para ela"""
    company = crud.create_company(db, name)
    
    if not company:
        raise HTTPException(status_code=400, detail="Empresa já registrada")
    
    return {"message": "Empresa registrada com sucesso!", "company": company.name}

@app.get("/get_companies/")
def get_all_companies(db: Session = Depends(get_db)):
    """Retorna todas as empresas cadastradas no banco central"""
    return db.query(models.Company).all()

@app.get("/get_company_data/{company_name}")
def get_company_data(company_name: str, db: Session = Depends(get_db)):
    """Conecta-se ao banco de uma franquia e retorna informações"""
    
    # Buscar no banco central o nome real do banco da franquia
    company = db.query(models.Company).filter(models.Company.name == company_name).first()
    
    if not company:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    
    # Conectar-se ao banco específico da franquia
    franchise_db = get_franchise_db(company.db_name)
    
    # Aqui você pode rodar queries dentro do banco específico
    return {"message": f"Conectado ao banco {company.db_name} com sucesso!"}
