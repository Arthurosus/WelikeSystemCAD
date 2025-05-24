from typing import List

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import SessionLocal, engine_central, get_franchise_db
from app import models, schemas

# ─────────────────────  cria as tabelas do banco “mestre” ──────────────────────
models.Base.metadata.create_all(bind=engine_central)

app = FastAPI(title="WelikeSystem API")

# ─────────────────────────────  CORS (frontend React) ──────────────────────────
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────── dependências de banco ─────────────────────────────
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_franchise_db_dep(franchise_name: str):
    return get_franchise_db(franchise_name)


# ════════════════════════════ EMPRESA – banco central ══════════════════════════
@app.post("/empresas/", response_model=schemas.EmpresaResponse)
def criar_empresa(empresa: schemas.EmpresaCreate, db: Session = Depends(get_db)):
    db_empresa = models.Empresa(**empresa.dict())
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
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    return empresa


@app.delete("/empresas/{empresa_id}", response_model=dict)
def deletar_empresa(empresa_id: int, db: Session = Depends(get_db)):
    empresa = db.query(models.Empresa).filter(models.Empresa.id == empresa_id).first()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    db.delete(empresa)
    db.commit()
    return {"message": "Empresa deletada com sucesso"}


# ═════════════════════════════ EMPRESA – franquias ═════════════════════════════
@app.post("/empresas/{franchise_name}/", response_model=schemas.EmpresaResponse)
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


@app.get("/empresas/{franchise_name}/", response_model=List[schemas.EmpresaResponse])
def listar_empresas_franquia(franchise_name: str, db: Session = Depends(get_franchise_db_dep)):
    return db.query(models.Empresa).all()


@app.get(
    "/empresas/{franchise_name}/{empresa_id}",
    response_model=schemas.EmpresaResponse,
)
def obter_empresa_franquia(
    franchise_name: str,
    empresa_id: int,
    db: Session = Depends(get_franchise_db_dep),
):
    empresa = (
        db.query(models.Empresa).filter(models.Empresa.id == empresa_id).first()
    )
    if not empresa:
        raise HTTPException(
            status_code=404, detail="Empresa não encontrada na franquia"
        )
    return empresa


@app.delete("/empresas/{franchise_name}/{empresa_id}", response_model=dict)
def deletar_empresa_franquia(
    franchise_name: str,
    empresa_id: int,
    db: Session = Depends(get_franchise_db_dep),
):
    empresa = (
        db.query(models.Empresa).filter(models.Empresa.id == empresa_id).first()
    )
    if not empresa:
        raise HTTPException(
            status_code=404, detail="Empresa não encontrada na franquia"
        )
    db.delete(empresa)
    db.commit()
    return {"message": "Empresa deletada com sucesso"}


# ═════════════════════ listas auxiliares (tipo, regime, estado) ════════════════
@app.get("/tipos_empresa/", response_model=List[schemas.TipoEmpresaResponse])
def listar_tipos_empresa(db: Session = Depends(get_db)):
    return db.query(models.TipoEmpresa).all()


@app.get(
    "/regimes_empresariais/",
    response_model=List[schemas.RegimeEmpresarialResponse],
)
def listar_regimes_empresariais(db: Session = Depends(get_db)):
    return db.query(models.RegimeEmpresarial).all()


@app.get(
    "/estados_empresa/", response_model=List[schemas.EstadoEmpresaResponse]
)
def listar_estados_empresa(db: Session = Depends(get_db)):
    return db.query(models.EstadoEmpresa).all()
