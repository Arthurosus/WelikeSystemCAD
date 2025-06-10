# app/core/config.py
from pydantic_settings import BaseSettings
from pydantic import ConfigDict


class Settings(BaseSettings):
    """
    Carrega variáveis de ambiente do arquivo `.env`
    (ou do ambiente do sistema). Todos os atributos
    declarados aqui ficam disponíveis em `settings`.
    """

    # ---------- principais ----------
    database_url: str                  # ex.: mysql+pymysql://user:pwd@localhost/welike_central
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_expiration_minutes: int = 60

    # ---------- compatibilidade ----------
    @property
    def DATABASE_URL(self) -> str:     # mantém código legado funcionando
        return self.database_url

    # ---------- meta ----------
    model_config = ConfigDict(
        env_file=".env",       # lê variáveis a partir deste arquivo
        extra="allow",         # ignora vars não declaradas
    )


settings = Settings()
