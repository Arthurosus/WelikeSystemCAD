"""
Importa todos os modelos para que o SQLAlchemy tenha o metadata completo.
Esses imports servem apenas para efeitos colaterais (registro das tabelas).
"""

from app.models.company import (  # noqa: F401
    TipoEmpresa,
    RegimeEmpresarial,
    EstadoEmpresa,
    Empresa,
    Telefone,
    RedeSocial,
    Endereco,
)
