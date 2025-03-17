from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine_central, get_franchise_db
from app import models
from app.schemas import EmpresaCreate, EmpresaResponse, TipoEmpresaBase, RegimeEmpresarialBase, EstadoEmpresaBase

# Criar tabelas no banco de dados central
models.Base.metadata.create_all(bind=engine_central)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_franchise_db_dep(franchise_name: str):
    return get_franchise_db(franchise_name)

# 🔹 Criar um novo tipo de empresa
@app.post("/tipos_empresa/")
def criar_tipo_empresa(tipo: TipoEmpresaBase, db: Session = Depends(get_db)):
    novo_tipo = models.TipoEmpresa(nome=tipo.nome)
    db.add(novo_tipo)
    db.commit()
    db.refresh(novo_tipo)
    return novo_tipo

# 🔹 Criar um novo regime empresarial
@app.post("/regimes_empresariais/")
def criar_regime_empresarial(regime: RegimeEmpresarialBase, db: Session = Depends(get_db)):
    novo_regime = models.RegimeEmpresarial(nome=regime.nome)
    db.add(novo_regime)
    db.commit()
    db.refresh(novo_regime)
    return novo_regime

# 🔹 Criar um novo estado de empresa
@app.post("/estados_empresa/")
def criar_estado_empresa(estado: EstadoEmpresaBase, db: Session = Depends(get_db)):
    novo_estado = models.EstadoEmpresa(nome=estado.nome)
    db.add(novo_estado)
    db.commit()
    db.refresh(novo_estado)
    return novo_estado

# 🔹 Criar uma nova empresa no **banco central**
@app.post("/empresas/", response_model=EmpresaResponse)
def criar_empresa(empresa: EmpresaCreate, db: Session = Depends(get_db)):
    db_empresa = models.Empresa(**empresa.dict())
    
    db.add(db_empresa)
    db.commit()
    db.refresh(db_empresa)
    return db_empresa

# 🔹 Criar uma nova empresa em uma **franquia específica**
@app.post("/empresas/{franchise_name}/", response_model=EmpresaResponse)
def criar_empresa_franquia(franchise_name: str, empresa: EmpresaCreate, db: Session = Depends(get_franchise_db_dep)):
    db_empresa = models.Empresa(**empresa.dict())
    
    db.add(db_empresa)
    db.commit()
    db.refresh(db_empresa)
    return db_empresa

# 🔹 Listar todas as empresas do banco **central**
@app.get("/empresas/", response_model=list[EmpresaResponse])
def listar_empresas(db: Session = Depends(get_db)):
    return db.query(models.Empresa).all()

# 🔹 Listar todas as empresas de uma **franquia específica**
@app.get("/empresas/{franchise_name}/", response_model=list[EmpresaResponse])
def listar_empresas_franquia(franchise_name: str, db: Session = Depends(get_franchise_db_dep)):
    return db.query(models.Empresa).all()

# 🔹 Obter detalhes de uma empresa no banco **central**
@app.get("/empresas/{empresa_id}", response_model=EmpresaResponse)
def obter_empresa(empresa_id: int, db: Session = Depends(get_db)):
    empresa = db.query(models.Empresa).filter(models.Empresa.id == empresa_id).first()
    if empresa is None:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    return empresa

# 🔹 Obter detalhes de uma empresa em uma **franquia**
@app.get("/empresas/{franchise_name}/{empresa_id}", response_model=EmpresaResponse)
def obter_empresa_franquia(franchise_name: str, empresa_id: int, db: Session = Depends(get_franchise_db_dep)):
    empresa = db.query(models.Empresa).filter(models.Empresa.id == empresa_id).first()
    if empresa is None:
        raise HTTPException(status_code=404, detail="Empresa não encontrada na franquia")
    return empresa

# 🔹 Excluir uma empresa do banco **central**
@app.delete("/empresas/{empresa_id}", response_model=dict)
def deletar_empresa(empresa_id: int, db: Session = Depends(get_db)):
    empresa = db.query(models.Empresa).filter(models.Empresa.id == empresa_id).first()
    if empresa is None:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    
    db.delete(empresa)
    db.commit()
    return {"message": "Empresa deletada com sucesso"}

# 🔹 Excluir uma empresa de uma **franquia**
@app.delete("/empresas/{franchise_name}/{empresa_id}", response_model=dict)
def deletar_empresa_franquia(franchise_name: str, empresa_id: int, db: Session = Depends(get_franchise_db_dep)):
    empresa = db.query(models.Empresa).filter(models.Empresa.id == empresa_id).first()
    if empresa is None:
        raise HTTPException(status_code=404, detail="Empresa não encontrada na franquia")
    
    db.delete(empresa)
    db.commit()
    return {"message": "Empresa deletada com sucesso"}
