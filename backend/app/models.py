from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Empresa(Base):
    __tablename__ = "empresas"

    id = Column(Integer, primary_key=True, index=True)
    codigo = Column(String, unique=True, nullable=False)
    cnpj = Column(String, unique=True, nullable=False)
    inscricao_municipal = Column(String, nullable=True)
    inscricao_estadual = Column(String, nullable=True)
    razao_social = Column(String, nullable=False)
    nome_fantasia = Column(String, nullable=False)
    sigla = Column(String, nullable=False)
    nome_site = Column(String, nullable=True)
    tipo_empresa = Column(String, nullable=False)
    regime_empresarial = Column(String, nullable=False)
    estado_empresa = Column(String, nullable=False)
    exibir_site = Column(Boolean, default=False)

    endereco = relationship("Endereco", back_populates="empresa", uselist=False)
    telefones = relationship("Telefone", back_populates="empresa", cascade="all, delete")
    redes_sociais = relationship("RedesSociais", back_populates="empresa", uselist=False)

class Endereco(Base):
    __tablename__ = "enderecos"

    id = Column(Integer, primary_key=True, index=True)
    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=False)
    formato = Column(String, nullable=False, default="brasil")
    cep = Column(String, nullable=True)
    rua = Column(String, nullable=False)
    numero = Column(String, nullable=True)
    complemento = Column(String, nullable=True)
    bairro = Column(String, nullable=True)
    cidade = Column(String, nullable=True)
    estado = Column(String, nullable=True)
    regiao = Column(String, nullable=True)
    pais = Column(String, nullable=True)
    latitude = Column(String, nullable=True)
    longitude = Column(String, nullable=True)
    link_maps = Column(String, nullable=True)

    empresa = relationship("Empresa", back_populates="endereco")

class Telefone(Base):
    __tablename__ = "telefones"

    id = Column(Integer, primary_key=True, index=True)
    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=False)
    numero = Column(String, nullable=False)
    principal = Column(Boolean, default=False)
    whatsapp = Column(Boolean, default=False)

    empresa = relationship("Empresa", back_populates="telefones")

class RedesSociais(Base):
    __tablename__ = "redes_sociais"

    id = Column(Integer, primary_key=True, index=True)
    empresa_id = Column(Integer, ForeignKey("empresas.id"), nullable=False)
    email = Column(String, nullable=True)
    instagram = Column(String, nullable=True)
    twitter = Column(String, nullable=True)
    tiktok = Column(String, nullable=True)

    empresa = relationship("Empresa", back_populates="redes_sociais")
