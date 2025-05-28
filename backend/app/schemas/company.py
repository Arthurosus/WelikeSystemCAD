"""
Esquemas (Pydantic) para a entidade Empresa e seus agregados
"""

from typing import List, Optional
from pydantic import BaseModel, Field


# ────────────────────────── blocos auxiliares ──────────────────────────
class TelefoneBase(BaseModel):
    codigo_pais: str = "+55"
    numero: str
    principal: bool = False
    whatsapp: bool  = False


class RedesSociaisBase(BaseModel):
    email:     Optional[str] = None
    instagram: Optional[str] = None
    twitter:   Optional[str] = None
    tiktok:    Optional[str] = None


class EnderecoBase(BaseModel):
    formato:     str           = "brasil"      # "brasil" | "internacional"
    cep:         Optional[str] = None
    zip:         Optional[str] = None          # usado p/ formato internacional
    rua:         Optional[str] = None
    numero:      Optional[str] = None
    complemento: Optional[str] = None
    bairro:      Optional[str] = None
    cidade:      Optional[str] = None
    estado:      Optional[str] = None
    regiao:      Optional[str] = None
    pais:        Optional[str] = None
    latitude:    Optional[float] = None
    longitude:   Optional[float] = None
    link_maps:   Optional[str] = Field(None, alias="linkMaps")


# ───────────────────── entidade principal (empresa) ────────────────────
class EmpresaBase(BaseModel):
    codigo:              str
    sigla:               str
    razao_social:        str
    cnpj:                str
    nome_fantasia:       Optional[str] = None
    nome_site:           Optional[str] = None
    inscricao_municipal: Optional[str] = None
    inscricao_estadual:  Optional[str] = None
    exibir_site:         bool = False

    # relações look-up (enviamos **nome**, não id)
    tipo_empresa:        str
    regime_empresarial:  str
    estado_empresa:      str


class EmpresaCreate(EmpresaBase):
    telefones:     List[TelefoneBase]
    endereco:      EnderecoBase
    redes_sociais: RedesSociaisBase


class EmpresaUpdate(EmpresaCreate):
    """Mesmo payload do create, reaproveitado para edição."""
    pass


class EmpresaResponse(EmpresaBase):
    id:            int
    telefones:     List[TelefoneBase]
    endereco:      EnderecoBase
    redes_sociais: RedesSociaisBase

    class Config:
        orm_mode                       = True
        allow_population_by_field_name = True


# ─────────────────────────── paginação padrão ──────────────────────────
class PaginatedEmpresas(BaseModel):
    total: int
    skip:  int
    limit: int
    items: List[EmpresaResponse]
