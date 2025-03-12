from pydantic import BaseModel
from typing import List, Optional

class TelefoneBase(BaseModel):
    numero: str
    principal: bool = False
    whatsapp: bool = False

class TelefoneCreate(TelefoneBase):
    pass

class Telefone(TelefoneBase):
    id: int

    class Config:
        from_attributes = True

class RedesSociaisBase(BaseModel):
    email: Optional[str] = None
    instagram: Optional[str] = None
    twitter: Optional[str] = None
    tiktok: Optional[str] = None

class RedesSociaisCreate(RedesSociaisBase):
    pass

class RedesSociais(RedesSociaisBase):
    id: int

    class Config:
        from_attributes = True

class EnderecoBase(BaseModel):
    formato: str
    cep: Optional[str] = None
    rua: str
    numero: Optional[str] = None
    complemento: Optional[str] = None
    bairro: Optional[str] = None
    cidade: Optional[str] = None
    estado: Optional[str] = None
    regiao: Optional[str] = None
    pais: Optional[str] = None
    latitude: Optional[str] = None
    longitude: Optional[str] = None
    link_maps: Optional[str] = None

class EnderecoCreate(EnderecoBase):
    pass

class Endereco(EnderecoBase):
    id: int

    class Config:
        from_attributes = True

class EmpresaBase(BaseModel):
    codigo: str
    cnpj: str
    inscricao_municipal: Optional[str] = None
    inscricao_estadual: Optional[str] = None
    razao_social: str
    nome_fantasia: str
    sigla: str
    nome_site: Optional[str] = None
    tipo_empresa: str
    regime_empresarial: str
    estado_empresa: str
    exibir_site: bool = False

class EmpresaCreate(EmpresaBase):
    endereco: EnderecoCreate
    telefones: List[TelefoneCreate]
    redes_sociais: RedesSociaisCreate

class Empresa(EmpresaBase):
    id: int
    endereco: Endereco
    telefones: List[Telefone]
    redes_sociais: RedesSociais

    class Config:
        from_attributes = True
