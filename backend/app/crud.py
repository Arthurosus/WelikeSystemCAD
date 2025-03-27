from sqlalchemy.orm import Session
from app.models import Empresa, Telefone, RedesSociais, Endereco
from app.schemas import EmpresaCreate

def create_empresa(db: Session, empresa: EmpresaCreate):
    db_empresa = Empresa(
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
        exibir_site=empresa.exibir_site
    )
    db.add(db_empresa)
    db.commit()
    db.refresh(db_empresa)

    db_endereco = Endereco(**empresa.endereco.dict(), empresa_id=db_empresa.id)
    db.add(db_endereco)

    for tel in empresa.telefones:
        db_tel = Telefone(empresa_id=db_empresa.id, **tel.dict())
        db.add(db_tel)

    db_redes = RedesSociais(empresa_id=db_empresa.id, **empresa.redes_sociais.dict())
    db.add(db_redes)

    db.commit()
    return db_empresa
