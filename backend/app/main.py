"""
Camada de API REST para Empresa, com CRUD + paginação.
"""

from typing import List

from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.db.database import SessionLocal, engine_central
from app import models
from app.schemas import company as schemas


# ────────────────────────── inicialização ──────────────────────────────
models.Base.metadata.create_all(bind=engine_central)
app = FastAPI(title="WelikeSystemCAD – API")


# ──────────────────── dependency – sessão de BD ────────────────────────
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ─────────────────────────── helpers locais ────────────────────────────
def _tel_to_schema(t: models.Telefone) -> schemas.TelefoneBase:       # noqa: E501
    return schemas.TelefoneBase(
        codigo_pais=t.codigo_pais or "+55",
        numero=t.numero,
        principal=t.principal,
        whatsapp=t.whatsapp,
    )


def _empresa_to_response(e: models.Empresa) -> schemas.EmpresaResponse:  # noqa: E501
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
        telefones=[_tel_to_schema(tel) for tel in e.telefones],
        endereco=e.endereco.__dict__ if e.endereco else None,
        redes_sociais=e.redes_sociais.__dict__ if e.redes_sociais else None,
    )


# ───────────────────────────── rotas CRUD ──────────────────────────────
@app.post("/empresas/", response_model=schemas.EmpresaResponse, status_code=201)
def criar_empresa(payload: schemas.EmpresaCreate, db: Session = Depends(get_db)):
    # look-ups
    tipo   = db.query(models.TipoEmpresa      ).filter_by(nome=payload.tipo_empresa      ).first()
    regime = db.query(models.RegimeEmpresarial).filter_by(nome=payload.regime_empresarial).first()
    estado = db.query(models.EstadoEmpresa    ).filter_by(nome=payload.estado_empresa    ).first()
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
    db.flush()                    # obtém o id antes de filhos

    # telefones (1-N)
    for tel in payload.telefones:
        db.add(models.Telefone(empresa_id=emp.id, **tel.dict()))

    # endereço e redes (0-1)
    db.add(models.Endereco  (empresa_id=emp.id, **payload.endereco.dict()))
    db.add(models.RedeSocial(empresa_id=emp.id, **payload.redes_sociais.dict()))

    # commit com tratamento de duplicidade
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
    emp.tipo_empresa       = db.query(models.TipoEmpresa      ).filter_by(nome=payload.tipo_empresa      ).first()
    emp.regime_empresarial = db.query(models.RegimeEmpresarial).filter_by(nome=payload.regime_empresarial).first()
    emp.estado_empresa     = db.query(models.EstadoEmpresa    ).filter_by(nome=payload.estado_empresa    ).first()

    # substituir telefones
    db.query(models.Telefone).filter_by(empresa_id=empresa_id).delete()
    for tel in payload.telefones:
        db.add(models.Telefone(empresa_id=empresa_id, **tel.dict()))

    # upsert endereço & redes
    db.query(models.Endereco   ).filter_by(empresa_id=empresa_id).delete()
    db.query(models.RedeSocial ).filter_by(empresa_id=empresa_id).delete()
    db.add(models.Endereco  (empresa_id=empresa_id, **payload.endereco.dict()))
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


# ────────────────────────── listagem paginada ─────────────────────────
@app.get("/empresas/", response_model=schemas.PaginatedEmpresas)
def listar_empresas(
    skip:  int = Query(0,  ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    total = db.query(models.Empresa).count()
    rows  = (
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


# ───────────────────────────── look-ups ───────────────────────────────
@app.get("/tipos_empresa/")
def listar_tipos(db: Session = Depends(get_db)):
    return db.query(models.TipoEmpresa).order_by(models.TipoEmpresa.nome).all()


@app.get("/regimes_empresariais/")
def listar_regimes(db: Session = Depends(get_db)):
    return db.query(models.RegimeEmpresarial).order_by(models.RegimeEmpresarial.nome).all()


@app.get("/estados_empresa/")
def listar_estados(db: Session = Depends(get_db)):
    return db.query(models.EstadoEmpresa).order_by(models.EstadoEmpresa.nome).all()
