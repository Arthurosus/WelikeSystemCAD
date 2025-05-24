"""
Declarative base compartilhada por todos os modelos.

Coloque aqui _apenas_ o declarative-base – a engine,
SessionLocal e afins ficam em app/db/session.py (ou base.py)
"""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):  # type: ignore[valid-type]
    """Classe base para todos os modelos."""
    pass
