# app/db/models/company.py
from sqlalchemy import Column, Integer, String
from app.db.base import Base

class Company(Base):
    __tablename__ = "companies"
    id    = Column(Integer, primary_key=True, index=True)
    code  = Column(String(50), unique=True, nullable=False)
    name  = Column(String(255), nullable=False)
