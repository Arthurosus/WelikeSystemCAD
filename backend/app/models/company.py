# backend/app/models/company.py
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base


# ───────────────────────────── look-ups ──────────────────────────────
class TipoEmpresa(Base):
    __tablename__ = "tipos_empresa"

    id   = Column(Integer, primary_key=True, index=True)
    nome = Column(String(50), unique=True, nullable=False)


class RegimeEmpresarial(Base):
    __tablename__ = "regimes_empresariais"

    id   = Column(Integer, primary_key=True, index=True)
    nome = Column(String(50), unique=True, nullable=False)


class EstadoEmpresa(Base):
    __tablename__ = "estados_empresa"

    id   = Column(Integer, primary_key=True, index=True)
    nome = Column(String(50), unique=True, nullable=False)


# ───────────────────── entidade principal ────────────────────────────
class Empresa(Base):
    __tablename__ = "empresas"

    id      = Column(Integer, primary_key=True, index=True)
    codigo  = Column(String(50),  unique=True, nullable=False)
    cnpj    = Column(String(20),  unique=True, nullable=False)

    inscricao_municipal = Column(String(50))
    inscricao_estadual  = Column(String(50))
    razao_social        = Column(String(255), nullable=False)
    nome_fantasia       = Column(String(255))
    sigla               = Column(String(10))
    nome_site           = Column(String(255))
    exibir_site         = Column(Boolean, default=False)

    tipo_empresa_id       = Column(Integer, ForeignKey("tipos_empresa.id"),       nullable=False)
    regime_empresarial_id = Column(Integer, ForeignKey("regimes_empresariais.id"),nullable=False)
    estado_empresa_id     = Column(Integer, ForeignKey("estados_empresa.id"),     nullable=False)

    tipo_empresa       = relationship("TipoEmpresa")
    regime_empresarial = relationship("RegimeEmpresarial")
    estado_empresa     = relationship("EstadoEmpresa")

    telefones     = relationship("Telefone",   back_populates="empresa", uselist=True,  cascade="all, delete-orphan")
    redes_sociais = relationship("RedeSocial", back_populates="empresa", uselist=True,  cascade="all, delete-orphan")
    endereco      = relationship("Endereco",   back_populates="empresa", uselist=False, cascade="all, delete-orphan")


# ───────────────────── agregados ─────────────────────────────────────
class Telefone(Base):
    __tablename__ = "telefones"

    id          = Column(Integer, primary_key=True, index=True)
    codigo_pais = Column(String(5), default="+55")
    numero      = Column(String(20), nullable=False)
    principal   = Column(Boolean, default=False)
    whatsapp    = Column(Boolean, default=False)

    empresa_id  = Column(Integer, ForeignKey("empresas.id"))
    empresa     = relationship("Empresa", back_populates="telefones")


class RedeSocial(Base):
    __tablename__ = "redes_sociais"

    id         = Column(Integer, primary_key=True, index=True)
    tipo       = Column(String(50), nullable=False)     # email | instagram | twitter | tiktok
    link       = Column(String(255))

    empresa_id = Column(Integer, ForeignKey("empresas.id"))
    empresa    = relationship("Empresa", back_populates="redes_sociais")


class Endereco(Base):
    __tablename__ = "enderecos"

    id          = Column(Integer, primary_key=True, index=True)

    formato     = Column(String(20),  nullable=False)   # brasil | internacional
    cep         = Column(String(20))
    zip         = Column(String(20))                    # ← NOVA coluna para endereços internacionais
    rua         = Column(String(255))
    numero      = Column(String(20))
    complemento = Column(String(255))
    bairro      = Column(String(255))
    cidade      = Column(String(255))
    estado      = Column(String(255))
    regiao      = Column(String(255))
    pais        = Column(String(255))
    latitude    = Column(String(50))
    longitude   = Column(String(50))
    link_maps   = Column(String(255))

    empresa_id  = Column(Integer, ForeignKey("empresas.id"))
    empresa     = relationship("Empresa", back_populates="endereco")
