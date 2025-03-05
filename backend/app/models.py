from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

Base = declarative_base()

# Cria a conexão com o banco central
engine_central = create_engine(settings.database_url)  # Certifique-se de que `database_url` está correto!

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_central)

# Exemplo de modelo para a tabela de usuários
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(255))
