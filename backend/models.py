from extensions import db  # Importe do novo arquivo

class Company(db.Model):
    __bind_key__ = 'central'
    __tablename__ = 'companies'

    # ... (mantenha os campos existentes)