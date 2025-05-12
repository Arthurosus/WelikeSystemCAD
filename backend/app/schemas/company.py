# app/schemas/company.py
from pydantic import BaseModel

class CompanyBase(BaseModel):
    code: str
    name: str

class CompanyCreate(CompanyBase): pass
class CompanyRead(CompanyBase):
    id: int
    class Config: from_attributes = True
