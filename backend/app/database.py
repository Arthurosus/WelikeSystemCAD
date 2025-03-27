from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

Base = declarative_base()

# 🔹 Criando engine para o banco central
engine_central = create_engine(settings.database_url, echo=True)

# 🔹 Criando um SessionLocal para conexões com o banco central
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_central)

def get_db():
    """Obtém uma sessão do banco de dados central."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 🔹 Função para obter a URL do banco de cada franquia
def get_franchise_db_url(franchise_name: str) -> str:
    """Retorna a URL de conexão para o banco de uma franquia."""
    return f"mysql+pymysql://welike_user:Rtk3rzJZ8@localhost/{franchise_name}"

# 🔹 Criando engine e sessão para franquias específicas
def get_franchise_engine(franchise_name: str):
    """Cria um engine para um banco de dados de franquia específica."""
    return create_engine(get_franchise_db_url(franchise_name), echo=True)

def get_franchise_db(franchise_name: str):
    """Cria uma sessão de banco de dados para uma franquia específica."""
    SessionLocalFranchise = sessionmaker(autocommit=False, autoflush=False, bind=get_franchise_engine(franchise_name))
    db = SessionLocalFranchise()
    try:
        yield db
    finally:
        db.close()

# 🔹 Inicialização do banco central
def init_db():
    """Inicializa o banco de dados central, garantindo que as tabelas sejam criadas."""
    from app import models  
    Base.metadata.create_all(bind=engine_central)
