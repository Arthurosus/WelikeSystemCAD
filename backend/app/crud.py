from sqlalchemy.orm import Session
from app import models, schemas

def create_company(db: Session, company: schemas.CompanyCreate):
    db_company = models.Company(
        name=company.name,
        cnpj=company.cnpj,
        email=company.email,
        sigla=company.sigla,
        site=company.site,
        tipo_empresa=company.tipo_empresa,
        regime_empresarial=company.regime_empresarial,
        estado_empresa=company.estado_empresa,
        address=company.address,
        google_maps_link=company.google_maps_link
    )
    db.add(db_company)
    db.commit()
    db.refresh(db_company)

    for phone in company.phones:
        db_phone = models.Phone(company_id=db_company.id, **phone.dict())
        db.add(db_phone)

    for social in company.social_media:
        db_social = models.SocialMedia(company_id=db_company.id, **social.dict())
        db.add(db_social)

    db.commit()
    return db_company
