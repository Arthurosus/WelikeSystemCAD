from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db, get_franchise_db
from app.auth import create_access_token, verify_token
from app.crud import create_user, create_company, get_user
from app.models import Base, engine_central

Base.metadata.create_all(bind=engine_central)

app = FastAPI()

@app.post("/register/")
def register_user(username: str, password: str, role: str, db: Session = Depends(get_db)):
    user = get_user(db, username)
    if user:
        raise HTTPException(status_code=400, detail="Usuário já existe")
    return create_user(db, username, password, role)

@app.post("/login/")
def login(username: str, password: str, db: Session = Depends(get_db)):
    user = get_user(db, username)
    if not user or not pwd_context.verify(password, user.password):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    
    token = create_access_token({"sub": user.username, "role": user.role})
    return {"access_token": token, "token_type": "bearer"}

@app.post("/create_company/")
def create_new_company(name: str, cnpj: str, email: str, phone: str, address: str, db: Session = Depends(get_db)):
    return create_company(db, name, cnpj, email, phone, address)

@app.get("/protected/")
def protected_route(token: str):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido")
    return {"message": f"Acesso autorizado para {payload['sub']}"}
