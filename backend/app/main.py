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
    return get_franchise_db(franchise_name)  # reserva p/ futuro

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

# ───────────────────────────── rotas ───────────────────────────────
@app.post("/empresas/", response_model=schemas.EmpresaResponse, status_code=201)
def criar_empresa(empresa: schemas.EmpresaCreate, db: Session = Depends(get_db)):
    # 1. look-ups
    tipo   = db.query(models.TipoEmpresa).filter_by(nome=empresa.tipo_empresa).first()
    regime = db.query(models.RegimeEmpresarial).filter_by(nome=empresa.regime_empresarial).first()
    estado = db.query(models.EstadoEmpresa).filter_by(nome=empresa.estado_empresa).first()
    if not (tipo and regime and estado):
        raise HTTPException(400, "Tipo, regime ou estado não encontrados")

    # 2. entidade principal
    db_empresa = models.Empresa(
        codigo=empresa.codigo,
        cnpj=empresa.cnpj,
        inscricao_municipal=empresa.inscricao_municipal,
        inscricao_estadual=empresa.inscricao_estadual,
        razao_social=empresa.razao_social,
        nome_fantasia=empresa.nome_fantasia,
        sigla=empresa.sigla,
        nome_site=empresa.nome_site,
        exibir_site=empresa.exibir_site,
        tipo_empresa=tipo,
        regime_empresarial=regime,
        estado_empresa=estado,
    )
    db.add(db_empresa)
    db.flush()  # garante id para agregados

    # 3. agregados
    for tel in empresa.telefones:
        db.add(
            models.Telefone(
                empresa_id=db_empresa.id,
                codigo_pais=tel.codigo_pais or "+55",
                numero=tel.numero,
                principal=tel.principal,
                whatsapp=tel.whatsapp,
            )
        )

    if empresa.redes_sociais:
        rs = empresa.redes_sociais
        if rs.email:
            db.add(models.RedeSocial(empresa_id=db_empresa.id, tipo="email", link=rs.email))
        if rs.instagram:
            db.add(models.RedeSocial(empresa_id=db_empresa.id, tipo="instagram", link=rs.instagram))
        if rs.twitter:
            db.add(models.RedeSocial(empresa_id=db_empresa.id, tipo="twitter", link=rs.twitter))
        if rs.tiktok:
            db.add(models.RedeSocial(empresa_id=db_empresa.id, tipo="tiktok", link=rs.tiktok))

    db.add(models.Endereco(empresa_id=db_empresa.id, **empresa.endereco.dict()))

    # 4. commit + tratamento duplicidade
    try:
        db.commit()
    except IntegrityError as e:
        db.rollback()
        msg = str(e.orig)
        if "empresas.codigo" in msg:
            raise HTTPException(409, "Código já cadastrado")
        if "empresas.cnpj" in msg:
            raise HTTPException(409, "CNPJ já cadastrado")
        raise HTTPException(500, "Erro de banco de dados")

    db.refresh(db_empresa)
    return _empresa_to_response(db_empresa)

# -------------------------------------------------------------------
#  LISTAGEM paginada + busca
# -------------------------------------------------------------------
@app.get(
    "/empresas/",
    response_model=schemas.PaginatedEmpresas,
    summary="Lista empresas com paginação e busca",
)
def listar_empresas(
    skip: int = Query(0, ge=0, description="Offset"),
    limit: int = Query(20, ge=1, le=100, description="Qtd registros"),
    search: Optional[str] = Query(None, description="Busca por razão social / nome fantasia"),
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

# -------------------------------------------------------------------
@app.get("/empresas/{empresa_id}", response_model=schemas.EmpresaResponse)
def obter_empresa(empresa_id: int, db: Session = Depends(get_db)):
    e = db.query(models.Empresa).filter(models.Empresa.id == empresa_id).first()
    if not e:
        raise HTTPException(404, "Empresa não encontrada")
    return _empresa_to_response(e)


@app.delete("/empresas/{empresa_id}", response_model=dict)
def deletar_empresa(empresa_id: int, db: Session = Depends(get_db)):
    empresa = db.query(models.Empresa).filter(models.Empresa.id == empresa_id).first()
    if not empresa:
        raise HTTPException(404, "Empresa não encontrada")
    db.delete(empresa)
    db.commit()
    return {"message": "Empresa deletada com sucesso"}

# ----------------- listas de look-ups -----------------
@app.get("/tipos_empresa/")
def listar_tipos_empresa(db: Session = Depends(get_db)):
    return db.query(models.TipoEmpresa).all()


@app.get("/regimes_empresariais/")
def listar_regimes_empresariais(db: Session = Depends(get_db)):
    return db.query(models.RegimeEmpresarial).all()


@app.get("/estados_empresa/")
def listar_estados_empresa(db: Session = Depends(get_db)):
    return db.query(models.EstadoEmpresa).all()
