from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL_ROOT: str = "mysql+pymysql://root:Rtk3rzJZ8@localhost"
    DATABASE_URL: str = "mysql+pymysql://root:Rtk3rzJZ8@localhost/master_db"

    JWT_SECRET_KEY: str = "supersecretkey"  # Chave para autenticação JWT
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 60  # Tempo de expiração do token

    class Config:
        env_file = ".env"

settings = Settings()
