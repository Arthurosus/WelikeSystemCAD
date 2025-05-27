from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional

from app.db.database import SessionLocal, engine_central, get_franchise_db
from app import models
from app.schemas import company as schemas

# ────────────────────────── inicialização ──────────────────────────
models.Base.metadata.create_all(bind=engine_central)
app = FastAPI(title="WelikeSystemCAD – API")

# ───────────────────── dependências de sessão ──────────────────────
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_franchise_db_dep(franchise_name: str):
    return get_franchise_db(franchise_name)

# ───────────────────────── helpers internos ────────────────────────
def _telefone_to_schema(t: models.Telefone) -> schemas.TelefoneBase:
    return schemas.TelefoneBase(
        codigo_pais=t.codigo_pais or "+55",
        numero=t.numero,
        principal=t.principal,
        whatsapp=t.whatsapp,
    )

def _empresa_to_response(e: models.Empresa) -> schemas.EmpresaResponse:
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
        telefones=[_telefone_to_schema(t) for t in e.telefones],
        endereco=e.endereco.__dict__ if e.endereco else None,
        redes_sociais=e.redes_sociais.__dict__ if e.redes_sociais else None,
    )

# ─────────────────────── criar empresa (POST) ──────────────────────
@app.post("/empresas/", response_model=schemas.EmpresaResponse, status_code=201)
def criar_empresa(empresa: schemas.EmpresaCreate, db: Session = Depends(get_db)):
    return _create_or_update(empresa, db)

# ─────────────────────── editar empresa (PUT) ──────────────────────
@app.put("/empresas/{empresa_id}", response_model=schemas.EmpresaResponse)
def atualizar_empresa(
    empresa_id: int,
    payload: schemas.EmpresaCreate,   # mesmo schema; PUT requer corpo completo
    db: Session = Depends(get_db),
):
    # verificar existência
    db_empresa = db.query(models.Empresa).filter_by(id=empresa_id).first()
    if not db_empresa:
        raise HTTPException(404, "Empresa não encontrada")

    # delegar para helper (faz delete/insert dos agregados)
    return _create_or_update(payload, db, existing=db_empresa)

# -------------------------------------------------------------------
#  helper reutilizado por POST e PUT
# -------------------------------------------------------------------
def _create_or_update(
    data: schemas.EmpresaCreate,
    db: Session,
    existing: Optional[models.Empresa] = None,
) -> schemas.EmpresaResponse:
    """Cria nova empresa ou atualiza uma existente (passada em `existing`)."""

    # look-ups
    tipo   = db.query(models.TipoEmpresa).filter_by(nome=data.tipo_empresa).first()
    regime = db.query(models.RegimeEmpresarial).filter_by(nome=data.regime_empresarial).first()
    estado = db.query(models.EstadoEmpresa).filter_by(nome=data.estado_empresa).first()
    if not (tipo and regime and estado):
        raise HTTPException(400, "Tipo, regime ou estado não encontrados")

    # se atualização, limpe agregados
    if existing:
        # duplicidade (código / cnpj) se mudou
        if (existing.codigo != data.codigo and
            db.query(models.Empresa).filter(models.Empresa.codigo == data.codigo).first()):
            raise HTTPException(409, "Código já cadastrado")
        if (existing.cnpj != data.cnpj and
            db.query(models.Empresa).filter(models.Empresa.cnpj == data.cnpj).first()):
            raise HTTPException(409, "CNPJ já cadastrado")

        db.query(models.Telefone).filter_by(empresa_id=existing.id).delete()
        db.query(models.RedeSocial).filter_by(empresa_id=existing.id).delete()
        db.query(models.Endereco).filter_by(empresa_id=existing.id).delete()

        target = existing
        target.codigo              = data.codigo
        target.cnpj                = data.cnpj
        target.inscricao_municipal = data.inscricao_municipal
        target.inscricao_estadual  = data.inscricao_estadual
        target.razao_social        = data.razao_social
        target.nome_fantasia       = data.nome_fantasia
        target.sigla               = data.sigla
        target.nome_site           = data.nome_site
        target.exibir_site         = data.exibir_site
        target.tipo_empresa        = tipo
        target.regime_empresarial  = regime
        target.estado_empresa      = estado
    else:
        target = models.Empresa(
            codigo=data.codigo,
            cnpj=data.cnpj,
            inscricao_municipal=data.inscricao_municipal,
            inscricao_estadual=data.inscricao_estadual,
            razao_social=data.razao_social,
            nome_fantasia=data.nome_fantasia,
            sigla=data.sigla,
            nome_site=data.nome_site,
            exibir_site=data.exibir_site,
            tipo_empresa=tipo,
            regime_empresarial=regime,
            estado_empresa=estado,
        )
        db.add(target)
        db.flush()  # id p/ agregados

    # agregados (recriados)
    for tel in data.telefones:
        db.add(
            models.Telefone(
                empresa_id=target.id,
                codigo_pais=tel.codigo_pais or "+55",
                numero=tel.numero,
                principal=tel.principal,
                whatsapp=tel.whatsapp,
            )
        )

    if data.redes_sociais:
        rs = data.redes_sociais
        if rs.email:
            db.add(models.RedeSocial(empresa_id=target.id, tipo="email", link=rs.email))
        if rs.instagram:
            db.add(models.RedeSocial(empresa_id=target.id, tipo="instagram", link=rs.instagram))
        if rs.twitter:
            db.add(models.RedeSocial(empresa_id=target.id, tipo="twitter", link=rs.twitter))
        if rs.tiktok:
            db.add(models.RedeSocial(empresa_id=target.id, tipo="tiktok", link=rs.tiktok))

    db.add(models.Endereco(empresa_id=target.id, **data.endereco.dict()))

    # commit
    try:
        db.commit()
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(500, "Erro de banco de dados")

    db.refresh(target)
    return _empresa_to_response(target)

# -------------------------------------------------------------------
#  LISTAGEM paginada + busca (inalterada)
# -------------------------------------------------------------------
@app.get(
    "/empresas/",
    response_model=schemas.PaginatedEmpresas,
    summary="Lista empresas com paginação e busca",
)
def listar_empresas(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(models.Empresa)
    if search:
        like = f"%{search}%"
        query = query.filter(
            models.Empresa.razao_social.ilike(like) |
            models.Empresa.nome_fantasia.ilike(like)
        )
    total = query.count()
    empresas = query.order_by(models.Empresa.id.desc()).offset(skip).limit(limit).all()
    return schemas.PaginatedEmpresas(
        total=total,
        skip=skip,
        limit=limit,
        items=[_empresa_to_response(e) for e in empresas],
    )

# --------- obter, deletar, look-ups (mesmos de antes) --------------
@app.get("/empresas/{empresa_id}", response_model=schemas.EmpresaResponse)
def obter_empresa(empresa_id: int, db: Session = Depends(get_db)):
    e = db.query(models.Empresa).filter_by(id=empresa_id).first()
    if not e:
        raise HTTPException(404, "Empresa não encontrada")
    return _empresa_to_response(e)

@app.delete("/empresas/{empresa_id}", response_model=dict)
def deletar_empresa(empresa_id: int, db: Session = Depends(get_db)):
    e = db.query(models.Empresa).filter_by(id=empresa_id).first()
    if not e:
        raise HTTPException(404, "Empresa não encontrada")
    db.delete(e)
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
