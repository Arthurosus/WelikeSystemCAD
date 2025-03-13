from pydantic import BaseModel
from typing import Optional, List

class EmpresaBase(BaseModel):
    codigo: str
    cnpj: str
    inscricao_municipal: Optional[str] = None
    inscricao_estadual: Optional[str] = None
    razao_social: str
    nome_fantasia: Optional[str] = None
    sigla: Optional[str] = None
    nome_site: Optional[str] = None
    tipo_empresa: Optional[str] = "Própria"
    regime_empresarial: Optional[str] = "Simples"
    estado_empresa: Optional[str] = "Ativa"
    exibir_site: Optional[bool] = False

class TelefoneBase(BaseModel):
    numero: str
    principal: bool = False
    whatsapp: bool = False

class RedesSociaisBase(BaseModel):
    email: Optional[str] = None
    instagram: Optional[str] = None
    twitter: Optional[str] = None
    tiktok: Optional[str] = None

class EnderecoBase(BaseModel):
    formato: str = "brasil"
    cep: Optional[str] = None
    rua: Optional[str] = None
    numero: Optional[str] = None
    complemento: Optional[str] = None
    bairro: Optional[str] = None
    cidade: Optional[str] = None
    estado: Optional[str] = None
    regiao: Optional[str] = None
    pais: Optional[str] = None
    latitude: Optional[float] = None  # Alterado para float
    longitude: Optional[float] = None  # Alterado para float
    link_maps: Optional[str] = None

class EmpresaCreate(EmpresaBase):
    telefones: List[TelefoneBase] = []
    redes_sociais: RedesSociaisBase
    endereco: EnderecoBase

class EmpresaResponse(EmpresaBase):
    id: int
    telefones: List[TelefoneBase] = []
    redes_sociais: RedesSociaisBase
    endereco: EnderecoBase

    class Config:
        from_attributes = True
