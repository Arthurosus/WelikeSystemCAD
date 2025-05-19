from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Welike System API",
    version="0.1.0",
)

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],   # ajuste se usar outro host/porta
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Mock simples até ligar no banco ---
PESSOAS = [
    {"id": 1, "nome": "Ana Beatriz da Silva", "cpf": "123.456.789-01", "email": "ana@email.com",
     "telefone": "(11) 99999-1234"},
    {"id": 2, "nome": "Carlos Eduardo Souza", "cpf": "987.654.321-00", "email": "carlos@email.com",
     "telefone": "(21) 98888-4321"},
    {"id": 3, "nome": "Fernanda Ramos",       "cpf": "111.222.333-44", "email": "fer@email.com",
     "telefone": "(31) 97777-5555"},
]

@app.get("/pessoas")
def listar_pessoas():
    return PESSOAS
