from pydantic import BaseModel, EmailStr
from typing import List, Optional

class PhoneCreate(BaseModel):
    number: str
    is_primary: bool
    is_whatsapp: bool

class SocialMediaCreate(BaseModel):
    platform: str
    link: str

class CompanyCreate(BaseModel):
    name: str
    cnpj: str
    email: EmailStr
    sigla: str
    site: str
    tipo_empresa: str
    regime_empresarial: str
    estado_empresa: str
    address: str
    google_maps_link: Optional[str] = None
    phones: List[PhoneCreate]
    social_media: List[SocialMediaCreate]
