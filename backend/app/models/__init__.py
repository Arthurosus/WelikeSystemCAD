"""
Pacote de modelos.

Ao fazer `from app import models`, todos os modelos declarados aqui
ficarão acessíveis (ex.: `models.Empresa`), resolvendo o AttributeError.
"""

from app.models.company import Empresa          # noqa: F401  (reexport)

# Importe também seus outros modelos, por exemplo:
# from app.models.telefone import Telefone     # noqa: F401
# from app.models.endereco import Endereco     # noqa: F401
# from app.models.tipo_empresa import TipoEmpresa  # noqa: F401
# …

# Exponha `Base` a quem precisar (útil para Alembic)
from app.db.base import Base                   # noqa: F401
