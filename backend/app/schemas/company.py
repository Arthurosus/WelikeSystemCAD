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
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    link_maps: Optional[str] = None


class RedesSociaisBase(BaseModel):
    email: Optional[str] = None
    instagram: Optional[str] = None
    twitter: Optional[str] = None
    tiktok: Optional[str] = None


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

    tipo_empresa: Optional[str] = "Própria"
    regime_empresarial: Optional[str] = "Simples"
    estado_empresa: Optional[str] = "Ativa"


class EmpresaCreate(EmpresaBase):
    telefones: List[TelefoneBase] = []
    endereco: EnderecoBase
    redes_sociais: RedesSociaisBase


class EmpresaResponse(EmpresaBase):
    id: int
    telefones: List[TelefoneBase] | None = None
    endereco: EnderecoBase | None = None
    redes_sociais: RedesSociaisBase | None = None

    class Config:
        from_attributes = True  # atualizado para Pydantic v2
