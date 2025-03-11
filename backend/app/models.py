from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Empresa(Base):
    __tablename__ = "empresas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    sigla = Column(String, index=True)
    nome_site = Column(String, index=True)
    cnpj = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    tipo_empresa = Column(String)
    regime_empresarial = Column(String)
    estado_empresa = Column(String)
    endereco = Column(String)
    formato_endereco = Column(String)
    link_maps = Column(String)
    
    telefones = relationship("Telefone", back_populates="empresa")
    redes_sociais = relationship("RedesSociais", back_populates="empresa", uselist=False)

class Telefone(Base):
    __tablename__ = "telefones"

    id = Column(Integer, primary_key=True, index=True)
    empresa_id = Column(Integer, ForeignKey("empresas.id"))
    numero = Column(String, index=True)
    principal = Column(Boolean, default=False)
    whatsapp = Column(Boolean, default=False)

    empresa = relationship("Empresa", back_populates="telefones")

class RedesSociais(Base):
    __tablename__ = "redes_sociais"

    id = Column(Integer, primary_key=True, index=True)
    empresa_id = Column(Integer, ForeignKey("empresas.id"))
    email = Column(String, unique=True, index=True)
    instagram = Column(String, index=True)
    twitter = Column(String, index=True)
    tiktok = Column(String, index=True)

    empresa = relationship("Empresa", back_populates="redes_sociais")