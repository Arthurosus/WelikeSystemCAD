from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings

# Conexão para o banco central
engine_central = create_engine(settings.database_url)
SessionLocalCentral = sessionmaker(autocommit=False, autoflush=False, bind=engine_central)

# Função para obter conexão com banco da franquia
def get_franchise_engine(franchise_db_url):
    return create_engine(franchise_db_url)

# Função para obter sessão do banco central
def get_db():
    db = SessionLocalCentral()
    try:
        yield db
    finally:
        db.close()

# Função para obter sessão do banco de uma franquia
def get_franchise_db(franchise_name: str):
    franchise_db_url = f"{settings.database_url_root}/{franchise_name}"
    engine = get_franchise_engine(franchise_db_url)
    SessionLocalFranchise = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocalFranchise()
    try:
        yield db
    finally:
        db.close()
