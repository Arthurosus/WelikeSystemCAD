"""
Declaração da tabela **empresas** e seus relacionamentos principais.

Se você já possui outros modelos (Telefone, Endereco, etc.),
basta ajustar os `import` s e deixar somente as relações que existem.
"""

from sqlalchemy import (
    Column, Integer, String, Boolean,
    ForeignKey
)
from sqlalchemy.orm import relationship

# Usamos o `Base` já criado em `app/db/base.py`
from app.db.base import Base


class Empresa(Base):
    __tablename__ = "empresas"

    # ── campos básicos ────────────────────────────────────────────
    id                = Column(Integer, primary_key=True, index=True)
    codigo            = Column(String(50),  unique=True, nullable=False)
    sigla             = Column(String(20),  unique=True, nullable=False)
    razao_social      = Column(String(255), nullable=False)
    nome_fantasia     = Column(String(255))
    cnpj              = Column(String(20),  unique=True, nullable=False)
    inscricao_municipal = Column(String(50))
    inscricao_estadual  = Column(String(50))
    exibir_site       = Column(Boolean, default=False)

    # ── relacionamentos (adicione/remova conforme precisar) ──────
    telefones = relationship(
        "Telefone",
        back_populates="empresa",
        cascade="all, delete-orphan"
    )

    endereco = relationship(
        "Endereco",
        back_populates="empresa",
        uselist=False,
        cascade="all, delete-orphan"
    )

    # Exemplo de campo estrangeiro se você tiver uma tabela de “Tipos”
    # tipo_empresa_id = Column(Integer, ForeignKey("tipos_empresa.id"))
    # tipo_empresa    = relationship("TipoEmpresa")
