"""
Camada de API REST para Empresa – CRUD completo + paginação.
"""

from typing import List

from fastapi import (
    FastAPI,
    Depends,
    HTTPException,
    Query,
)
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app import models
from app.db.database import SessionLocal, engine_central
from app.schemas import company as schemas

# ───────────────────── inicialização ────────────────────────────
models.Base.metadata.create_all(bind=engine_central)

app = FastAPI(title="WelikeSystemCAD – API")

# CORS (frontend React roda em http://localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ───────────────────── dependência de sessão ────────────────────
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ───────────────────── helpers internos ─────────────────────────
def _tel_to_schema(t: models.Telefone) -> schemas.TelefoneBase:
    """Converte Telefone SQLAlchemy → schema Pydantic."""
    return schemas.TelefoneBase(
        codigo_pais=t.codigo_pais or "+55",
        numero=t.numero,
        principal=t.principal,
        whatsapp=t.whatsapp,
    )


def _empresa_to_response(e: models.Empresa) -> schemas.EmpresaResponse:
    """Converte Empresa + relações para o schema de saída."""
    return schemas.EmpresaResponse(
        id=e.id,
        codigo=e.codigo,
        sigla=e.sigla,
        razao_social=e.razao_social,
        cnpj=e.cnpj,
        nome_fantasia=e.nome_fantasia,
        nome_site=e.nome_site,
        inscricao_municipal=e.inscricao_municipal,
        inscricao_estadual=e.inscricao_estadual,
        exibir_site=e.exibir_site,
        tipo_empresa=e.tipo_empresa.nome,
        regime_empresarial=e.regime_empresarial.nome,
        estado_empresa=e.estado_empresa.nome,
        telefones=[_tel_to_schema(t) for t in e.telefones],
        endereco=e.endereco.__dict__ if e.endereco else None,
        redes_sociais=e.redes_sociais.__dict__ if e.redes_sociais else None,
    )

# ───────────────────────────── CRUD ─────────────────────────────
@app.post("/empresas/", response_model=schemas.EmpresaResponse, status_code=201)
def criar_empresa(payload: schemas.EmpresaCreate, db: Session = Depends(get_db)):
    # look-ups
    tipo   = db.query(models.TipoEmpresa).filter_by(nome=payload.tipo_empresa).first()
    regime = db.query(models.RegimeEmpresarial).filter_by(nome=payload.regime_empresarial).first()
    estado = db.query(models.EstadoEmpresa).filter_by(nome=payload.estado_empresa).first()
    if not (tipo and regime and estado):
        raise HTTPException(400, "Tipo, regime ou estado inválidos")

    # entidade principal
    emp = models.Empresa(
        codigo=payload.codigo,
        cnpj=payload.cnpj,
        inscricao_municipal=payload.inscricao_municipal,
        inscricao_estadual=payload.inscricao_estadual,
        razao_social=payload.razao_social,
        nome_fantasia=payload.nome_fantasia,
        sigla=payload.sigla,
        nome_site=payload.nome_site,
        exibir_site=payload.exibir_site,
        tipo_empresa=tipo,
        regime_empresarial=regime,
        estado_empresa=estado,
    )
    db.add(emp)
    db.flush()  # garante emp.id para relacionamentos

    # telefones
    for tel in payload.telefones:
        db.add(models.Telefone(empresa_id=emp.id, **tel.dict()))

    # endereço  (converte zip → cep se vier no formato internacional)
    end_dict = payload.endereco.dict()
    if end_dict.get("zip"):
        end_dict["cep"] = end_dict.pop("zip")
    db.add(models.Endereco(empresa_id=emp.id, **end_dict))

    # redes sociais
    db.add(models.RedeSocial(empresa_id=emp.id, **payload.redes_sociais.dict()))

    # commit
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        msg = str(exc.orig)
        if "empresas.codigo" in msg:
            raise HTTPException(409, "Código já cadastrado")
        if "empresas.cnpj" in msg:
            raise HTTPException(409, "CNPJ já cadastrado")
        raise HTTPException(500, "Erro no banco de dados")

    db.refresh(emp)
    return _empresa_to_response(emp)


@app.get("/empresas/{empresa_id}", response_model=schemas.EmpresaResponse)
def obter_empresa(empresa_id: int, db: Session = Depends(get_db)):
    emp = db.query(models.Empresa).get(empresa_id)
    if not emp:
        raise HTTPException(404, "Empresa não encontrada")
    return _empresa_to_response(emp)


@app.put("/empresas/{empresa_id}", response_model=schemas.EmpresaResponse)
def atualizar_empresa(
    empresa_id: int,
    payload: schemas.EmpresaUpdate,
    db: Session = Depends(get_db),
):
    emp = db.query(models.Empresa).get(empresa_id)
    if not emp:
        raise HTTPException(404, "Empresa não encontrada")

    # campos simples
    for field in (
        "codigo", "cnpj", "inscricao_municipal", "inscricao_estadual",
        "razao_social", "nome_fantasia", "sigla", "nome_site", "exibir_site",
    ):
        setattr(emp, field, getattr(payload, field))

    # look-ups
    emp.tipo_empresa = db.query(models.TipoEmpresa).filter_by(nome=payload.tipo_empresa).first()
    emp.regime_empresarial = db.query(models.RegimeEmpresarial).filter_by(nome=payload.regime_empresarial).first()
    emp.estado_empresa = db.query(models.EstadoEmpresa).filter_by(nome=payload.estado_empresa).first()

    # substituir telefones
    db.query(models.Telefone).filter_by(empresa_id=empresa_id).delete()
    for tel in payload.telefones:
        db.add(models.Telefone(empresa_id=empresa_id, **tel.dict()))

    # substituir endereço & redes
    db.query(models.Endereco).filter_by(empresa_id=empresa_id).delete()
    db.query(models.RedeSocial).filter_by(empresa_id=empresa_id).delete()

    end_dict = payload.endereco.dict()
    if end_dict.get("zip"):
        end_dict["cep"] = end_dict.pop("zip")
    db.add(models.Endereco(empresa_id=empresa_id, **end_dict))
    db.add(models.RedeSocial(empresa_id=empresa_id, **payload.redes_sociais.dict()))

    db.commit()
    db.refresh(emp)
    return _empresa_to_response(emp)


@app.delete("/empresas/{empresa_id}", response_model=dict)
def deletar_empresa(empresa_id: int, db: Session = Depends(get_db)):
    if not db.query(models.Empresa).filter_by(id=empresa_id).delete():
        raise HTTPException(404, "Empresa não encontrada")
    db.commit()
    return {"message": "Empresa deletada com sucesso"}

# ───────────────────── listagem paginada ────────────────────────
@app.get("/empresas/", response_model=schemas.PaginatedEmpresas)
def listar_empresas(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    total = db.query(models.Empresa).count()
    rows: List[models.Empresa] = (
        db.query(models.Empresa)
        .order_by(models.Empresa.razao_social)
        .offset(skip)
        .limit(limit)
        .all()
    )
    return schemas.PaginatedEmpresas(
        total=total,
        skip=skip,
        limit=limit,
        items=[_empresa_to_response(e) for e in rows],
    )

# ─────────────────────── look-ups auxiliares ────────────────────
@app.get("/tipos_empresa/")
def listar_tipos(db: Session = Depends(get_db)):
    return db.query(models.TipoEmpresa).order_by(models.TipoEmpresa.nome).all()


@app.get("/regimes_empresariais/")
def listar_regimes(db: Session = Depends(get_db)):
    return db.query(models.RegimeEmpresarial).order_by(models.RegimeEmpresarial.nome).all()


@app.get("/estados_empresa/")
def listar_estados(db: Session = Depends(get_db)):
    return db.query(models.EstadoEmpresa).order_by(models.EstadoEmpresa.nome).all()
