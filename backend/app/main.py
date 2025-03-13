from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app import models
from app.schemas import EmpresaCreate, EmpresaResponse

# Criar tabelas no banco de dados (caso ainda não existam)
models.Base.metadata.create_all(bind=engine)

# Inicializa a aplicação FastAPI
app = FastAPI()

# Dependência para obter a sessão do banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Rota para criar uma nova empresa
@app.post("/empresas/", response_model=EmpresaResponse)
def criar_empresa(empresa: EmpresaCreate, db: Session = Depends(get_db)):
    db_empresa = models.Empresa(
        codigo=empresa.codigo,
        cnpj=empresa.cnpj,
        inscricao_municipal=empresa.inscricao_municipal,
        inscricao_estadual=empresa.inscricao_estadual,
        razao_social=empresa.razao_social,
        nome_fantasia=empresa.nome_fantasia,
        sigla=empresa.sigla,
        nome_site=empresa.nome_site,
        tipo_empresa=empresa.tipo_empresa,
        regime_empresarial=empresa.regime_empresarial,
        estado_empresa=empresa.estado_empresa,
        exibir_site=empresa.exibir_site,
    )
    db.add(db_empresa)
    db.commit()
    db.refresh(db_empresa)
    return db_empresa

# Rota para listar todas as empresas cadastradas
@app.get("/empresas/", response_model=list[EmpresaResponse])
def listar_empresas(db: Session = Depends(get_db)):
    return db.query(models.Empresa).all()

# Rota para obter detalhes de uma empresa específica pelo ID
@app.get("/empresas/{empresa_id}", response_model=EmpresaResponse)
def obter_empresa(empresa_id: int, db: Session = Depends(get_db)):
    empresa = db.query(models.Empresa).filter(models.Empresa.id == empresa_id).first()
    if empresa is None:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    return empresa

# Rota para excluir uma empresa pelo ID
@app.delete("/empresas/{empresa_id}", response_model=dict)
def deletar_empresa(empresa_id: int, db: Session = Depends(get_db)):
    empresa = db.query(models.Empresa).filter(models.Empresa.id == empresa_id).first()
    if empresa is None:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    
    db.delete(empresa)
    db.commit()
    return {"message": "Empresa deletada com sucesso"}

# Rota para atualizar uma empresa pelo ID
@app.put("/empresas/{empresa_id}", response_model=EmpresaResponse)
def atualizar_empresa(empresa_id: int, empresa_update: EmpresaCreate, db: Session = Depends(get_db)):
    empresa = db.query(models.Empresa).filter(models.Empresa.id == empresa_id).first()
    if empresa is None:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    
    for key, value in empresa_update.model_dump().items():
        setattr(empresa, key, value)
    
    db.commit()
    db.refresh(empresa)
    return empresa
