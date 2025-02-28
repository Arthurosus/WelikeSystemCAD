from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String

Base = declarative_base()

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    cnpj = Column(String(20), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    phone = Column(String(20), nullable=False)
    address = Column(String(255), nullable=False)
