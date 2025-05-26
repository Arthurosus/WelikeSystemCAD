# app/models/__init__.py
"""
Reúne todas as classes de modelo em um único local e expõe `Base`
para que possa ser importado como `from app import models; models.Base`.
"""

from app.db.base_class import Base        #  ← agora disponível!
from .empresa import Empresa              #  ←  seus modelos reais
# from .outro_modelo import OutroModelo   #  adicione os próximos aqui

__all__ = [
    "Base",
    "Empresa",
    # "OutroModelo",
]
