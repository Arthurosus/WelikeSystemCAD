from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import settings   # ← instância do Settings

# ——————————————————————————————————————————————
# Use o atributo *caixa‑ALTA* definido no Settings
# ——————————————————————————————————————————————
engine = create_engine(
    settings.DATABASE_URL,   # <— era settings.database_url
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
