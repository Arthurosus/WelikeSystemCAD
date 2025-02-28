from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "mysql+pymysql://root:Rtk3rzJZ8@localhost"
    SECRET_KEY: str = "sua_chave_secreta"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings()
