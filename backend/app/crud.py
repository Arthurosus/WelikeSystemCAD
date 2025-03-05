from sqlalchemy.orm import Session
from app.models import User, Company
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, username: str, password: str, role: str):
    hashed_password = pwd_context.hash(password)
    db_user = User(username=username, password=hashed_password, role=role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_company(db: Session, name: str, cnpj: str, email: str, phone: str, address: str):
    db_company = Company(name=name, cnpj=cnpj, email=email, phone=phone, address=address)
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company
