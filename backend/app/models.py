from sqlalchemy import Column, Integer, String
from .database import Base, engine

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True, nullable=False)
    db_name = Column(String(255), unique=True, nullable=False)

# Criar as tabelas no banco de dados central
Base.metadata.create_all(bind=engine)
