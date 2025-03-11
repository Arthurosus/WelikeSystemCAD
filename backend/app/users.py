from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Franchise
from passlib.context import CryptContext

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/register")
def create_user(username: str, password: str, role: str, db_name: str, db: Session = Depends(get_db("central_db"))):
    hashed_password = pwd_context.hash(password)
    user = User(username=username, password=hashed_password, role=role, database=db_name)
    db.add(user)
    db.commit()
    return {"message": "Usuário criado com sucesso"}

@router.post("/add_franchise")
def add_franchise(name: str, db_name: str, db: Session = Depends(get_db("central_db"))):
    franchise = Franchise(name=name, db_name=db_name)
    db.add(franchise)
    db.commit()
    return {"message": "Franquia adicionada com sucesso"}
