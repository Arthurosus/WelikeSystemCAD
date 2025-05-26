from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

# 🔹 engine / helpers do banco central e de franquias
from app.db.database import (
    SessionLocal,
    engine_central,
    get_franchise_db,   # helper que devolve uma Session para a franquia
)

# 🔹 modelos e esquemas
from app import models, schemas
from app.db.base_class import Base as BaseModel  # <- Base real, declarative_base()

# ---------------------------------------------------------------------
# Garanta que models.Base exista para a chamada abaixo -----------------
# (evita AttributeError e mantém compatibilidade com o código já escrito)
setattr(models, "Base", BaseModel)

# ---------------------------------------------------------------------
# Cria todas as tabelas no **banco central** quando a API sobe
models.Base.metadata.create_all(bind=engine_central)
# ---------------------------------------------------------------------

app = FastAPI(
    title="Welike System API",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ---------------------------------------------------------------------
# Dependências de sessão ------------------------------------------------
def get_db() -> Session:
    """Sessão do banco CENTRAL"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_franchise_db_dep(franchise_name: str):
    """Sessão do sub-banco da franquia (nome vem do path)."""
    return get_franchise_db(franchise_name)


# ---------------------------------------------------------------------
# Rotas utilitárias -----------------------------------------------------
@app.get("/health", tags=["Utils"])
def health():
    return {"status": "ok"}


# ---------------------------------------------------------------------
# --------------------------- EMPRESA ----------------------------------
# Banco CENTRAL
@app.post("/empresas/", response_model=schemas.EmpresaResponse, tags=["Empresa"])
def criar_empresa(
    empresa: schemas.EmpresaCreate, db: Session = Depends(get_db)
):
    db_empresa = models.Empresa(**empresa.dict())
    db.add(db_empresa)
    db.commit()
    db.refresh(db_empresa)
    return db_empresa


@app.get(
    "/empresas/",
    response_model=List[schemas.EmpresaResponse],
    tags=["Empresa"],
)
def listar_empresas(db: Session = Depends(get_db)):
    return db.query(models.Empresa).all()


@app.get(
    "/empresas/{empresa_id}",
    response_model=schemas.EmpresaResponse,
    tags=["Empresa"],
)
def obter_empresa(empresa_id: int, db: Session = Depends(get_db)):
    empresa = (
        db.query(models.Empresa)
        .filter(models.Empresa.id == empresa_id)
        .first()
    )
    if empresa is None:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    return empresa


@app.delete("/empresas/{empresa_id}", tags=["Empresa"])
def deletar_empresa(empresa_id: int, db: Session = Depends(get_db)):
    empresa = (
        db.query(models.Empresa)
        .filter(models.Empresa.id == empresa_id)
        .first()
    )
    if empresa is None:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")

    db.delete(empresa)
    db.commit()
    return {"message": "Empresa deletada com sucesso"}


# Banco da FRANQUIA (sub-banco)
@app.post(
    "/empresas/{franchise_name}/",
    response_model=schemas.EmpresaResponse,
    tags=["Empresa – Franquia"],
)
def criar_empresa_franquia(
    franchise_name: str,
    empresa: schemas.EmpresaCreate,
    db: Session = Depends(get_franchise_db_dep),
):
    db_empresa = models.Empresa(**empresa.dict())
    db.add(db_empresa)
    db.commit()
    db.refresh(db_empresa)
    return db_empresa


@app.get(
    "/empresas/{franchise_name}/",
    response_model=List[schemas.EmpresaResponse],
    tags=["Empresa – Franquia"],
)
def listar_empresas_franquia(
    franchise_name: str, db: Session = Depends(get_franchise_db_dep)
):
    return db.query(models.Empresa).all()


@app.get(
    "/empresas/{franchise_name}/{empresa_id}",
    response_model=schemas.EmpresaResponse,
    tags=["Empresa – Franquia"],
)
def obter_empresa_franquia(
    franchise_name: str,
    empresa_id: int,
    db: Session = Depends(get_franchise_db_dep),
):
    empresa = (
        db.query(models.Empresa)
        .filter(models.Empresa.id == empresa_id)
        .first()
    )
    if empresa is None:
        raise HTTPException(
            status_code=404, detail="Empresa não encontrada na franquia"
        )
    return empresa


@app.delete(
    "/empresas/{franchise_name}/{empresa_id}",
    tags=["Empresa – Franquia"],
)
def deletar_empresa_franquia(
    franchise_name: str,
    empresa_id: int,
    db: Session = Depends(get_franchise_db_dep),
):
    empresa = (
        db.query(models.Empresa)
        .filter(models.Empresa.id == empresa_id)
        .first()
    )
    if empresa is None:
        raise HTTPException(
            status_code=404, detail="Empresa não encontrada na franquia"
        )

    db.delete(empresa)
    db.commit()
    return {"message": "Empresa deletada com sucesso"}


# ---------------------------------------------------------------------
# ----------------------- Tabelas auxiliares ---------------------------
@app.get("/tipos_empresa/", tags=["Auxiliares"])
def listar_tipos_empresa(db: Session = Depends(get_db)):
    return db.query(models.TipoEmpresa).all()


@app.get("/regimes_empresariais/", tags=["Auxiliares"])
def listar_regimes_empresariais(db: Session = Depends(get_db)):
    return db.query(models.RegimeEmpresarial).all()


@app.get("/estados_empresa/", tags=["Auxiliares"])
def listar_estados_empresa(db: Session = Depends(get_db)):
    return db.query(models.EstadoEmpresa).all()
