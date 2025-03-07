from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import CompanyCreate
from app.crud import create_company

router = APIRouter()

@router.post("/companies/")
def register_company(company: CompanyCreate, db: Session = Depends(get_db)):
    return create_company(db, company)
