import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('CENTRAL_DB_URI')
    SQLALCHEMY_BINDS = {
        'central': os.getenv('CENTRAL_DB_URI')
    }
    SQLALCHEMY_TRACK_MODIFICATIONS = False