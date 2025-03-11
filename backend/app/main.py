from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import EmpresaCreate
from app.crud import create_empresa

app = FastAPI()

@app.post("/empresas/")
def criar_empresa(empresa: EmpresaCreate, db: Session = Depends(get_db)):
    return create_empresa(db, empresa)