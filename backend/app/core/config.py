from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # ---- banco central / root ------------
    db_user: str
    db_pass: str
    db_host: str
    db_port: int = 3306
    central_db: str                 # nome do BD “central”
    database_url_root: str          # string sem o nome do BD

    # ---- jwt -----------------------------
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_expiration_minutes: int = 60

    model_config = SettingsConfigDict(env_file=".env", extra="allow")

    # propriedades dinâmicas ----------------
    @property
    def database_url(self) -> str:
        """URL completa do banco central."""
        return (
            f"mysql+pymysql://{self.db_user}:{self.db_pass}"
            f"@{self.db_host}:{self.db_port}/{self.central_db}"
        )

settings = Settings()
