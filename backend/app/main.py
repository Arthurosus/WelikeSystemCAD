from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # ✅ Importa CORS
from sqlalchemy.orm import Session
from typing import List
from app.database import SessionLocal, engine_central, get_franchise_db
from app import models, schemas

# 🔹 Cria tabelas no banco de dados central
models.Base.metadata.create_all(bind=engine_central)

# 🔹 Inicializa a aplicação FastAPI
app = FastAPI()

# 🔹 Adiciona suporte a CORS para frontend em localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # ✅ Permite requisições do frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔹 Dependência para obter a sessão do banco central
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 🔹 Dependência para obter a sessão de uma franquia específica
def get_franchise_db_dep(franchise_name: str):
    return get_franchise_db(franchise_name)

# 🔹 Criar uma nova empresa no banco central
@app.post("/empresas/", response_model=schemas.EmpresaResponse)
def criar_empresa(empresa: schemas.EmpresaCreate, db: Session = Depends(get_db)):
    db_empresa = models.Empresa(**empresa.dict())
    db.add(db_empresa)
    db.commit()
    db.refresh(db_empresa)
    return db_empresa

# 🔹 Criar uma nova empresa em uma franquia específica
@app.post("/empresas/{franchise_name}/", response_model=schemas.EmpresaResponse)
def criar_empresa_franquia(franchise_name: str, empresa: schemas.EmpresaCreate, db: Session = Depends(get_franchise_db_dep)):
    db_empresa = models.Empresa(**empresa.dict())
    db.add(db_empresa)
    db.commit()
    db.refresh(db_empresa)
    return db_empresa

# 🔹 Listar todas as empresas do banco central
@app.get("/empresas/", response_model=List[schemas.EmpresaResponse])
def listar_empresas(db: Session = Depends(get_db)):
    return db.query(models.Empresa).all()

# 🔹 Listar todas as empresas de uma franquia específica
@app.get("/empresas/{franchise_name}/", response_model=List[schemas.EmpresaResponse])
def listar_empresas_franquia(franchise_name: str, db: Session = Depends(get_franchise_db_dep)):
    return db.query(models.Empresa).all()

# 🔹 Obter detalhes de uma empresa no banco central
@app.get("/empresas/{empresa_id}", response_model=schemas.EmpresaResponse)
def obter_empresa(empresa_id: int, db: Session = Depends(get_db)):
    empresa = db.query(models.Empresa).filter(models.Empresa.id == empresa_id).first()
    if empresa is None:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    return empresa

# 🔹 Obter detalhes de uma empresa em uma franquia
@app.get("/empresas/{franchise_name}/{empresa_id}", response_model=schemas.EmpresaResponse)
def obter_empresa_franquia(franchise_name: str, empresa_id: int, db: Session = Depends(get_franchise_db_dep)):
    empresa = db.query(models.Empresa).filter(models.Empresa.id == empresa_id).first()
    if empresa is None:
        raise HTTPException(status_code=404, detail="Empresa não encontrada na franquia")
    return empresa

# 🔹 Excluir uma empresa do banco central
@app.delete("/empresas/{empresa_id}", response_model=dict)
def deletar_empresa(empresa_id: int, db: Session = Depends(get_db)):
    empresa = db.query(models.Empresa).filter(models.Empresa.id == empresa_id).first()
    if empresa is None:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    db.delete(empresa)
    db.commit()
    return {"message": "Empresa deletada com sucesso"}

# 🔹 Excluir uma empresa de uma franquia
@app.delete("/empresas/{franchise_name}/{empresa_id}", response_model=dict)
def deletar_empresa_franquia(franchise_name: str, empresa_id: int, db: Session = Depends(get_franchise_db_dep)):
    empresa = db.query(models.Empresa).filter(models.Empresa.id == empresa_id).first()
    if empresa is None:
        raise HTTPException(status_code=404, detail="Empresa não encontrada na franquia")
    db.delete(empresa)
    db.commit()
    return {"message": "Empresa deletada com sucesso"}

# 🔹 Listar tipos de empresa
@app.get("/tipos_empresa/")
def listar_tipos_empresa(db: Session = Depends(get_db)):
    return db.query(models.TipoEmpresa).all()

# 🔹 Listar regimes empresariais
@app.get("/regimes_empresariais/")
def listar_regimes_empresariais(db: Session = Depends(get_db)):
    return db.query(models.RegimeEmpresarial).all()

# 🔹 Listar estados de empresa
@app.get("/estados_empresa/")
def listar_estados_empresa(db: Session = Depends(get_db)):
    return db.query(models.EstadoEmpresa).all()































