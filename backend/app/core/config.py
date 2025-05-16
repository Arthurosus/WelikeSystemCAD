# app/core/config.py
# ——————————————————————————————————————————————
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # *** Obrigatórios ***
    DATABASE_URL:            str
    JWT_SECRET_KEY:          str
    JWT_ALGORITHM:           str = "HS256"
    JWT_EXPIRATION_MINUTES:  int = 60

    # *** Configuração para ler o .env ***
    # extra="allow" → quaisquer chaves a mais no .env
    #                 são simplesmente ignoradas (não causam erro).
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="allow",
    )

# Instância única usada no projeto inteiro
settings = Settings()
