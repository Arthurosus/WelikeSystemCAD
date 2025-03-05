from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class Settings(BaseSettings):
    database_url_root: str
    database_url: str
    jwt_secret_key: str
    jwt_algorithm: str
    jwt_expiration_minutes: int

    model_config = ConfigDict(env_file=".env", extra="allow")  # Permite variáveis extras no .env

settings = Settings()
