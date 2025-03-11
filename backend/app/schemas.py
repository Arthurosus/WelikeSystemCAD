from pydantic import BaseModel
from typing import List, Optional

class TelefoneBase(BaseModel):
    numero: str
    principal: bool = False
    whatsapp: bool = False

class RedesSociaisBase(BaseModel):
    email: str
    instagram: Optional[str] = None
    twitter: Optional[str] = None
    tiktok: Optional[str] = None

class EmpresaCreate(BaseModel):
    nome: str
    sigla: str
    nome_site: str
    cnpj: str
    email: str
    tipo_empresa: str
    regime_empresarial: str
    estado_empresa: str
    endereco: str
    formato_endereco: str
    link_maps: Optional[str] = None
    telefones: List[TelefoneBase]
    redes_sociais: RedesSociaisBase