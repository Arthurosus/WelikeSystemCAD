from sqlalchemy.orm import Session
from app.models import Company, User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, username: str, password: str, role: str, company_id: int = None):
    hashed_password = pwd_context.hash(password)
    db_user = User(username=username, password=hashed_password, role=role, company_id=company_id)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
