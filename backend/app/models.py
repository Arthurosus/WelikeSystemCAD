from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .database import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    cnpj = Column(String(18), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    sigla = Column(String(50), unique=True, nullable=False)
    site = Column(String(255), nullable=False)
    
    tipo_empresa = Column(String(50), nullable=False)
    regime_empresarial = Column(String(50), nullable=False)
    estado_empresa = Column(String(50), nullable=False)

    address = Column(String(500), nullable=False)
    google_maps_link = Column(String(500), nullable=True)

    users = relationship("User", back_populates="company")
    phones = relationship("Phone", back_populates="company")
    social_media = relationship("SocialMedia", back_populates="company")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"))

    company = relationship("Company", back_populates="users")

class Phone(Base):
    __tablename__ = "phones"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    number = Column(String(20), nullable=False)
    is_primary = Column(Boolean, default=False)
    is_whatsapp = Column(Boolean, default=False)

    company = relationship("Company", back_populates="phones")

class SocialMedia(Base):
    __tablename__ = "social_media"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    platform = Column(String(50), nullable=False)
    link = Column(String(500), nullable=False)

    company = relationship("Company", back_populates="social_media")
