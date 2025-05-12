# app/main.py
from fastapi import FastAPI
from app.api.endpoints import company

app = FastAPI(title="WeLike API")
app.include_router(company.router)
