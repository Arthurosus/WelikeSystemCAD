from sqlalchemy.orm import Session
from app.models import Empresa, Telefone, RedesSociais
from app.schemas import EmpresaCreate

def create_empresa(db: Session, empresa: EmpresaCreate):
    db_empresa = Empresa(
        nome=empresa.nome,
        sigla=empresa.sigla,
        nome_site=empresa.nome_site,
        cnpj=empresa.cnpj,
        email=empresa.email,
        tipo_empresa=empresa.tipo_empresa,
        regime_empresarial=empresa.regime_empresarial,
        estado_empresa=empresa.estado_empresa,
        endereco=empresa.endereco,
        formato_endereco=empresa.formato_endereco,
        link_maps=empresa.link_maps
    )
    db.add(db_empresa)
    db.commit()
    db.refresh(db_empresa)

    for tel in empresa.telefones:
        db_tel = Telefone(
            empresa_id=db_empresa.id,
            numero=tel.numero,
            principal=tel.principal,
            whatsapp=tel.whatsapp
        )
        db.add(db_tel)

    db_redes = RedesSociais(
        empresa_id=db_empresa.id,
        email=empresa.redes_sociais.email,
        instagram=empresa.redes_sociais.instagram,
        twitter=empresa.redes_sociais.twitter,
        tiktok=empresa.redes_sociais.tiktok
    )
    db.add(db_redes)

    db.commit()
    return db_empresa