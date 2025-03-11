from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud import create_empresa
from app.schemas import EmpresaCreate, Empresa

router = APIRouter()

@router.post("/empresas/", response_model=Empresa)
def criar_empresa(empresa: EmpresaCreate, db: Session = Depends(get_db)):
    return create_empresa(db, empresa)

@router.get("/empresas/")
def listar_empresas(db: Session = Depends(get_db)):
    return db.query(Empresa).all()

@router.get("/empresas/{empresa_id}")
def buscar_empresa(empresa_id: int, db: Session = Depends(get_db)):
    return db.query(Empresa).filter(Empresa.id == empresa_id).first()
