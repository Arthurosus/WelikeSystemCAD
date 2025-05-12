# app/api/endpoints/company.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.deps import get_db
from app.db.models.company import Company
from app.schemas.company import CompanyCreate, CompanyRead

router = APIRouter(prefix="/companies", tags=["Companies"])

@router.post("/", response_model=CompanyRead, status_code=status.HTTP_201_CREATED)
def create_company(obj_in: CompanyCreate, db: Session = Depends(get_db)):
    if db.query(Company).filter_by(code=obj_in.code).first():
        raise HTTPException(400, "Code already exists")
    db_obj = Company(**obj_in.dict())
    db.add(db_obj); db.commit(); db.refresh(db_obj)
    return db_obj

@router.get("/", response_model=list[CompanyRead])
def list_companies(db: Session = Depends(get_db)):
    return db.query(Company).all()
