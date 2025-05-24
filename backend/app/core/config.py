"""
Carrega variáveis de ambiente (.env) e constrói as URLs de conexão.

O atributo `settings.DATABASE_URL` agora sempre existe:
se não vier do .env é montado a partir de DB_USER/DB_PASS/DB_HOST/CENTRAL_DB.
"""

from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # --------------------------- DB ---------------------------
    DB_USER: str = "root"
    DB_PASS: str = "password"
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    CENTRAL_DB: str = "central_system"

    # URLs completas (podem vir do .env ou serão geradas)
    DATABASE_URL: str | None = None
    DATABASE_URL_ROOT: str | None = None

    # --------------------------- JWT --------------------------
    JWT_SECRET_KEY: str = "super-secret"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 60

    # ----------------------------------------------------------
    model_config = SettingsConfigDict(
        env_file=".env",              # lê backend/.env
        case_sensitive=False,
        extra="allow",                # ignora variáveis não mapeadas
    )

    # ----------------------------------------------------------
    def __init__(self, **data):
        super().__init__(**data)

        # monta automaticamente se faltar
        if not self.DATABASE_URL:
            self.DATABASE_URL = (
                f"mysql+pymysql://{self.DB_USER}:{self.DB_PASS}"
                f"@{self.DB_HOST}/{self.CENTRAL_DB}"
            )

        if not self.DATABASE_URL_ROOT:
            self.DATABASE_URL_ROOT = (
                f"mysql+pymysql://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}"
            )


# instância única usada em todo o projeto
settings = Settings()
