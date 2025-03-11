from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Empresa(Base):
    __tablename__ = "empresas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    sigla = Column(String, nullable=True)
    nome_site = Column(String, nullable=True)
    cnpj = Column(String, unique=True, nullable=False)
    email = Column(String, nullable=True)
    tipo_empresa = Column(String, ForeignKey("tipo_empresa.nome"))
    regime_empresarial = Column(String, ForeignKey("regime_empresarial.nome"))
    estado_empresa = Column(String, ForeignKey("estado_empresa.nome"))
    endereco = Column(String, nullable=False)
    formato_endereco = Column(String, nullable=False)  # "br" ou "int"
    link_maps = Column(String, nullable=True)

    telefones = relationship("Telefone", back_populates="empresa")
    redes_sociais = relationship("RedesSociais", back_populates="empresa")

class TipoEmpresa(Base):
    __tablename__ = "tipo_empresa"

    nome = Column(String, primary_key=True)

class RegimeEmpresarial(Base):
    __tablename__ = "regime_empresarial"

    nome = Column(String, primary_key=True)

class EstadoEmpresa(Base):
    __tablename__ = "estado_empresa"

    nome = Column(String, primary_key=True)

class Telefone(Base):
    __tablename__ = "telefones"

    id = Column(Integer, primary_key=True, index=True)
    empresa_id = Column(Integer, ForeignKey("empresas.id"))
    numero = Column(String, nullable=False)
    principal = Column(Boolean, default=False)
    whatsapp = Column(Boolean, default=False)

    empresa = relationship("Empresa", back_populates="telefones")

class RedesSociais(Base):
    __tablename__ = "redes_sociais"

    id = Column(Integer, primary_key=True, index=True)
    empresa_id = Column(Integer, ForeignKey("empresas.id"))
    email = Column(String, nullable=True)
    instagram = Column(String, nullable=True)
    twitter = Column(String, nullable=True)
    tiktok = Column(String, nullable=True)

    empresa = relationship("Empresa", back_populates="redes_sociais")
