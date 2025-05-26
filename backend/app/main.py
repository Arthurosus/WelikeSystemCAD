from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import SessionLocal, engine_central, get_franchise_db
from app import models
from app.schemas import company as schemas  # ← CORRIGIDO AQUI

# Criar tabelas no banco de dados central
models.Base.metadata.create_all(bind=engine_central)

# Inicializa a aplicação FastAPI
app = FastAPI()

# Dependência para obter a sessão do banco central
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Dependência para obter a sessão de uma franquia específica
def get_franchise_db_dep(franchise_name: str):
    return get_franchise_db(franchise_name)

@app.post("/empresas/", response_model=schemas.EmpresaResponse)
def criar_empresa(empresa: schemas.EmpresaCreate, db: Session = Depends(get_db)):
    tipo = db.query(models.TipoEmpresa).filter_by(nome=empresa.tipo_empresa).first()
    regime = db.query(models.RegimeEmpresarial).filter_by(nome=empresa.regime_empresarial).first()
    estado = db.query(models.EstadoEmpresa).filter_by(nome=empresa.estado_empresa).first()

    if not tipo or not regime or not estado:
        raise HTTPException(status_code=400, detail="Tipo, regime ou estado não encontrados")

    db_empresa = models.Empresa(
        codigo=empresa.codigo,
        cnpj=empresa.cnpj,
        inscricao_municipal=empresa.inscricao_municipal,
        inscricao_estadual=empresa.inscricao_estadual,
        razao_social=empresa.razao_social,
        nome_fantasia=empresa.nome_fantasia,
        sigla=empresa.sigla,
        nome_site=empresa.nome_site,
        tipo_empresa=tipo,
        regime_empresarial=regime,
        estado_empresa=estado,
        exibir_site=empresa.exibir_site
    )
    db.add(db_empresa)
    db.commit()
    db.refresh(db_empresa)
    return db_empresa

@app.get("/empresas/", response_model=List[schemas.EmpresaResponse])
def listar_empresas(db: Session = Depends(get_db)):
    return db.query(models.Empresa).all()

@app.get("/empresas/{empresa_id}", response_model=schemas.EmpresaResponse)
def obter_empresa(empresa_id: int, db: Session = Depends(get_db)):
    empresa = db.query(models.Empresa).filter(models.Empresa.id == empresa_id).first()
    if empresa is None:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    return empresa

@app.delete("/empresas/{empresa_id}", response_model=dict)
def deletar_empresa(empresa_id: int, db: Session = Depends(get_db)):
    empresa = db.query(models.Empresa).filter(models.Empresa.id == empresa_id).first()
    if empresa is None:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")

    db.delete(empresa)
    db.commit()
    return {"message": "Empresa deletada com sucesso"}

@app.get("/tipos_empresa/")
def listar_tipos_empresa(db: Session = Depends(get_db)):
    return db.query(models.TipoEmpresa).all()

@app.get("/regimes_empresariais/")
def listar_regimes_empresariais(db: Session = Depends(get_db)):
    return db.query(models.RegimeEmpresarial).all()

@app.get("/estados_empresa/")
def listar_estados_empresa(db: Session = Depends(get_db)):
    return db.query(models.EstadoEmpresa).all()
