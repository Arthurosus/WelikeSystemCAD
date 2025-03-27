from pydantic import BaseModel
from typing import Optional, List

# 🔹 Esquemas para Empresa
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
    latitude: Optional[float] = None
    longitude: Optional[float] = None
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

# 🔹 Esquemas para Tipo de Empresa
class TipoEmpresaBase(BaseModel):
    nome: str

class TipoEmpresaCreate(TipoEmpresaBase):
    pass

class TipoEmpresaResponse(TipoEmpresaBase):
    id: int

    class Config:
        from_attributes = True

# 🔹 Esquemas para Regime Empresarial
class RegimeEmpresarialBase(BaseModel):
    nome: str

class RegimeEmpresarialCreate(RegimeEmpresarialBase):
    pass

class RegimeEmpresarialResponse(RegimeEmpresarialBase):
    id: int

    class Config:
        from_attributes = True

# 🔹 Esquemas para Estado da Empresa
class EstadoEmpresaBase(BaseModel):
    nome: str

class EstadoEmpresaCreate(EstadoEmpresaBase):
    pass

class EstadoEmpresaResponse(EstadoEmpresaBase):
    id: int

    class Config:
        from_attributes = True
