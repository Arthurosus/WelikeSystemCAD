"""
Endpoints relativos a EMPRESAS no banco **central**.

• Cria / lê / lista / deleta empresas.
• Ao criar, gera automaticamente um banco (“franquia”) individual
  para a nova empresa, usando a sigla como nome do schema.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.deps import get_db           # SessionLocal do banco central
from app import models, schemas
from app.services.franchise_db import create_franchise_database

router = APIRouter(prefix="/empresas", tags=["empresas"])


# ───────────────────────────────────────────────────────────────
# helpers
# ───────────────────────────────────────────────────────────────
def _get_empresa_or_404(db: Session, empresa_id: int) -> models.Empresa:
    obj = db.query(models.Empresa).filter(models.Empresa.id == empresa_id).first()
    if not obj:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    return obj


# ───────────────────────────────────────────────────────────────
# CRUD
# ───────────────────────────────────────────────────────────────
@router.post("/", response_model=schemas.EmpresaResponse, status_code=status.HTTP_201_CREATED)
def create_empresa(
    payload: schemas.EmpresaCreate,
    db: Session = Depends(get_db),
):
    # --- verifica unicidade da sigla ---
    if db.query(models.Empresa).filter(models.Empresa.sigla == payload.sigla).first():
        raise HTTPException(status_code=400, detail="Sigla já existe")

    # --- cria registro no banco central ---
    empresa = models.Empresa(**payload.dict(exclude_unset=True))
    db.add(empresa)
    db.commit()
    db.refresh(empresa)

    # --- cria banco da franquia (pode lançar exceção) ---
    try:
        create_franchise_database(empresa.sigla)
    except Exception as exc:                              # rollback em caso de falha
        db.delete(empresa)
        db.commit()
        raise HTTPException(
            status_code=500,
            detail=f"Falha ao criar banco da franquia: {exc}"
        ) from exc

    return empresa


@router.get("/", response_model=list[schemas.EmpresaResponse])
def list_empresas(db: Session = Depends(get_db)):
    return db.query(models.Empresa).order_by(models.Empresa.razao_social).all()


@router.get("/{empresa_id}", response_model=schemas.EmpresaResponse)
def get_empresa(empresa_id: int, db: Session = Depends(get_db)):
    return _get_empresa_or_404(db, empresa_id)


@router.delete("/{empresa_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_empresa(empresa_id: int, db: Session = Depends(get_db)):
    empresa = _get_empresa_or_404(db, empresa_id)
    db.delete(empresa)
    db.commit()
