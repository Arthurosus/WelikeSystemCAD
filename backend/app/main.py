from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine_central as engine
from app.models import Base
from app.schemas import EmpresaCreate, EmpresaResponse

# Garantindo que as tabelas sejam criadas no banco de dados central
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    """Obtém uma sessão do banco de dados central."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/empresas/", response_model=EmpresaResponse)
def criar_empresa(empresa: EmpresaCreate, db: Session = Depends(get_db)):
    """Cria uma nova empresa no banco de dados."""
    db_empresa = models.Empresa(**empresa.dict())
    db.add(db_empresa)
    db.commit()
    db.refresh(db_empresa)
    return db_empresa

@app.get("/empresas/", response_model=list[EmpresaResponse])
def listar_empresas(db: Session = Depends(get_db)):
    """Lista todas as empresas cadastradas."""
    return db.query(models.Empresa).all()

@app.get("/empresas/{empresa_id}", response_model=EmpresaResponse)
def obter_empresa(empresa_id: int, db: Session = Depends(get_db)):
    """Obtém uma empresa pelo ID."""
    empresa = db.query(models.Empresa).filter(models.Empresa.id == empresa_id).first()
    if empresa is None:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    return empresa
