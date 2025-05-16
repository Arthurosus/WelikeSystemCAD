from typing import Optional, List
from pydantic import BaseModel


# ── sub‑schemas (caso precise) ───────────────────────────────────
class TelefoneBase(BaseModel):
    codigo_pais: str = "+55"
    numero: str
    principal: bool = False
    whatsapp: bool = False


class EnderecoBase(BaseModel):
    formato: str = "brasil"
    cep: Optional[str] = None
    rua: Optional[str] = None
    numero: Optional[str] = None
    bairro: Optional[str] = None
    cidade: Optional[str] = None
    estado: Optional[str] = None
    pais: Optional[str] = None


# ── schemas principais ───────────────────────────────────────────
class EmpresaBase(BaseModel):
    codigo: str
    sigla: str
    razao_social: str
    cnpj: str
    nome_fantasia: Optional[str] = None
    inscricao_municipal: Optional[str] = None
    inscricao_estadual: Optional[str] = None
    exibir_site: bool = False


class EmpresaCreate(EmpresaBase):
    telefones: List[TelefoneBase] = []
    endereco: EnderecoBase


class EmpresaResponse(EmpresaBase):
    id: int
    telefones: List[TelefoneBase] | None = None
    endereco: EnderecoBase | None = None

    class Config:
        orm_mode = True
