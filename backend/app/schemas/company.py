# app/schemas/company.py
from typing import List, Optional, Union

from pydantic import BaseModel, Field, field_validator


# ───────────────────────────── TELEFONE ──────────────────────────────
class TelefoneBase(BaseModel):
    codigo_pais: str = "+55"
    numero: str
    principal: bool = False
    whatsapp: bool = False


# ─────────────────────────── REDES SOCIAIS ───────────────────────────
class RedesSociaisBase(BaseModel):
    email: Optional[str] = None
    instagram: Optional[str] = None
    twitter: Optional[str] = None
    tiktok: Optional[str] = None


# ───────────────────────────── ENDEREÇO ──────────────────────────────
class EnderecoBase(BaseModel):
    formato: str = Field(default="brasil", pattern="^(brasil|internacional)$")
    cep: Optional[str] = None
    zip: Optional[str] = None            # usado quando formato = internacional
    rua: Optional[str] = None
    numero: Optional[str] = None
    complemento: Optional[str] = None
    bairro: Optional[str] = None
    cidade: Optional[str] = None
    estado: Optional[str] = None
    regiao: Optional[str] = None
    pais: Optional[str] = None
    latitude:  Optional[Union[float, str]] = None
    longitude: Optional[Union[float, str]] = None
    link_maps: Optional[str] = None

    # ─── converte "" → None antes da validação de tipo ───
    @field_validator("latitude", "longitude", mode="before")
    @classmethod
    def empty_str_to_none(cls, v):
        return None if v in ("", None) else v


# ───────────────────────────── EMPRESA ───────────────────────────────
class EmpresaBase(BaseModel):
    codigo: str
    cnpj: str
    inscricao_municipal: Optional[str] = None
    inscricao_estadual: Optional[str] = None
    razao_social: str
    nome_fantasia: Optional[str] = None
    sigla: Optional[str] = None
    nome_site: Optional[str] = None

    tipo_empresa: str = "Própria"
    regime_empresarial: str = "Simples"
    estado_empresa: str = "Ativa"

    exibir_site: bool = False


# -------- payloads de entrada ---------------------------------------
class EmpresaCreate(EmpresaBase):
    telefones: List[TelefoneBase]
    redes_sociais: RedesSociaisBase
    endereco: EnderecoBase


class EmpresaUpdate(EmpresaCreate):
    """Para este projeto, update exige o mesmo payload de create."""
    pass


# -------- respostas da API ------------------------------------------
class EmpresaResponse(EmpresaBase):
    id: int
    telefones: List[TelefoneBase]
    redes_sociais: RedesSociaisBase
    endereco: EnderecoBase

    model_config = {"from_attributes": True}  # habilita ORM mode (Pydantic v2)


# ─────────────────────────── PAGINAÇÃO ───────────────────────────────
class PaginatedEmpresas(BaseModel):
    total: int
    skip: int
    limit: int
    items: List[EmpresaResponse]
