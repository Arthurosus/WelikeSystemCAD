from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db, get_franchise_db
from app.auth import create_access_token, verify_token
from app.crud import create_user, get_user_by_username
from app.database import engine
from app.models import Base


Base.metadata.create_all(bind=engine)

app = FastAPI()

@app.post("/register")
def register(username: str, password: str, role: str, db: Session = Depends(get_db)):
    user = create_user(db, username, password, role)
    return {"message": "User created successfully"}

@app.post("/login")
def login(username: str, password: str, db: Session = Depends(get_db)):
    user = get_user_by_username(db, username)
    if not user or not pwd_context.verify(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": user.username, "role": user.role})
    return {"access_token": token}

@app.get("/franchise/{db_name}/data")
def get_franchise_data(db_name: str, db: Session = Depends(get_franchise_db)):
    return {"message": f"Acesso ao banco {db_name} permitido"}
