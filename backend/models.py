from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Company(db.Model):
    __bind_key__ = 'central'
    __tablename__ = 'companies'

    id = db.Column(db.Integer, primary_key=True)
    cnpj = db.Column(db.String(18), unique=True, nullable=False)
    razao_social = db.Column(db.String(255), nullable=False)
    nome_fantasia = db.Column(db.String(255))
    inscricao_municipal = db.Column(db.String(50))
    inscricao_estadual = db.Column(db.String(50))
    telefone1 = db.Column(db.String(20))
    sigla = db.Column(db.String(10), unique=True)
    email = db.Column(db.String(100))
    homepage = db.Column(db.String(100))
    database_name = db.Column(db.String(50), unique=True)  # e.g., welike_gtn
    # Add other fields from the image as needed