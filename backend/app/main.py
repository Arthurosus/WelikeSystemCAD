from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from .database import get_db, get_franchise_db
from . import crud, models

app = FastAPI()

@app.post("/register_company/")
def register_company(name: str, db: Session = Depends(get_db)):
    """Registers a new company and creates a database for it"""
    company = crud.create_company(db, name)
    
    if not company:
        raise HTTPException(status_code=400, detail="Company already registered")
    
    return {"message": "Company registered successfully!", "company": company.name}

@app.get("/get_companies/")
def get_all_companies(db: Session = Depends(get_db)):
    """Returns all registered companies from the central database"""
    return db.query(models.Company).all()

@app.get("/get_company_data/{company_name}")
def get_company_data(company_name: str, db: Session = Depends(get_db)):
    """Connects to a company's database and returns connection status"""

    # Find the real database name in the central database
    company = db.query(models.Company).filter(models.Company.name == company_name).first()
    
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    
    # Connect to the specific franchise database
    franchise_db = get_franchise_db(company.db_name)
    
    # You can run queries inside this specific database
    return {"message": f"Connected to database {company.db_name} successfully!"}
