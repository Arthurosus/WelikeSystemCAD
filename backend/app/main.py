from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Empresa

app = FastAPI()

@app.get("/empresas/")
def listar_empresas(db: Session = Depends(get_db)):
    empresas = db.query(Empresa).all()
    return empresas
