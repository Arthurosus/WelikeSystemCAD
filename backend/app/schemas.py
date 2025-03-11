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
    empresa_id: int

    class Config:
        orm_mode = True

class RedesSociaisBase(BaseModel):
    email: Optional[str]
    instagram: Optional[str]
    twitter: Optional[str]
    tiktok: Optional[str]

class RedesSociaisCreate(RedesSociaisBase):
    pass

class RedesSociais(RedesSociaisBase):
    id: int
    empresa_id: int

    class Config:
        orm_mode = True

class EmpresaBase(BaseModel):
    nome: str
    sigla: Optional[str]
    nome_site: Optional[str]
    cnpj: str
    email: Optional[str]
    tipo_empresa: str
    regime_empresarial: str
    estado_empresa: str
    endereco: str
    formato_endereco: str  # "br" para Brasil, "int" para Internacional
    link_maps: Optional[str]

class EmpresaCreate(EmpresaBase):
    telefones: List[TelefoneCreate]
    redes_sociais: RedesSociaisCreate

class Empresa(EmpresaBase):
    id: int
    telefones: List[Telefone]
    redes_sociais: RedesSociais

    class Config:
        orm_mode = True
