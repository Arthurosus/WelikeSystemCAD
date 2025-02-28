from sqlalchemy.orm import Session
from app.models import Company

def create_company(db: Session, company_data: dict):
    db_company = Company(**company_data)
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company
