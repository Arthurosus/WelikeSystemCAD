from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # ----- conexão central -------------------------------------------------
    db_user: str = "root"
    db_pass: str = "Rtk3rzJZ8"
    db_host: str = "localhost"
    db_port: int = 3306
    central_db: str = "central_system"

    # URL completa do banco central  (usada pelo SQLAlchemy)
    database_url: str | None = None   # ← NOVO!

    # ----- JWT -------------------------------------------------------------
    jwt_secret_key: str = "super-secret"
    jwt_algorithm: str = "HS256"
    jwt_expiration_minutes: int = 60

    # ----------------------------------------------------------------------
    # Configuração do Pydantic para aceitar variáveis extras no .env
    # ----------------------------------------------------------------------
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="allow"  # ← permite variáveis extras no .env sem quebrar
    )

    # ----------------------------------------------------------------------
    # Pydantic – variáveis que **não** forem passadas no .env
    # serão montadas automaticamente aqui.
    # ----------------------------------------------------------------------
    def __init__(self, **values):
        super().__init__(**values)

        # se o usuário não definiu DATABASE_URL no .env, montamos
        # a partir dos outros campos.
        if self.database_url is None:
            self.database_url = (
                f"mysql+pymysql://{self.db_user}:{self.db_pass}"
                f"@{self.db_host}:{self.db_port}/{self.central_db}"
            )

# instância global
settings = Settings()
