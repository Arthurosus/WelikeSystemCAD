from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Base, engine
from app.crud import create_company
from app.auth import create_access_token, verify_token

app = FastAPI()

Base.metadata.create_all(bind=engine)

@app.post("/register")
def register(company: dict, db: Session = Depends(get_db)):
    return create_company(db, company)

@app.post("/login")
def login(email: str, db: Session = Depends(get_db)):
    user = db.query(Company).filter(Company.email == email).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return {"access_token": create_access_token({"sub": email})}

@app.get("/protected")
def protected_route(token: str):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"message": "Access granted", "user": payload["sub"]}
