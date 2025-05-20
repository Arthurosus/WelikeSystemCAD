"""
Alembic migration environment.

Executado sempre que você chama `alembic revision --autogenerate`
ou `alembic upgrade`.  Ajustado para carregar as configurações de
`app.core.config.settings` e para tornar todo o modelo `app.models`
visível ao contexto de migrações.
"""

from __future__ import annotations

import logging
from logging.config import fileConfig
from pathlib import Path
from typing import Any

from alembic import context
from sqlalchemy import engine_from_config, pool

# ──────────────────────────────────────────────────────────────
# 1. Configuração de logging (padrão do Alembic)
# ──────────────────────────────────────────────────────────────
fileConfig(context.config.config_file_name)  # type: ignore[arg-type]
logger = logging.getLogger("alembic.env")

# ──────────────────────────────────────────────────────────────
# 2. Importa settings + models do projeto
# ──────────────────────────────────────────────────────────────
import sys

ROOT_DIR = Path(__file__).resolve().parents[2]  # …/backend
sys.path.append(str(ROOT_DIR))                  # garante import “app.*”

from app.core.config import settings           # noqa: E402
from app import models                         # noqa: E402

# ──────────────────────────────────────────────────────────────
# 3. Inclui URL do BD central na configuração do Alembic
# ──────────────────────────────────────────────────────────────
config = context.config
config.set_main_option("sqlalchemy.url", settings.database_url)

# ──────────────────────────────────────────────────────────────
# 4. Metadata alvo (para autogenerate)
# ──────────────────────────────────────────────────────────────
target_metadata = models.Base.metadata  # type: ignore[attr-defined]

# ──────────────────────────────────────────────────────────────
# 5. Funções helpers
# ──────────────────────────────────────────────────────────────
def _run_migrations_offline() -> None:
    """Migrations em modo offline (gera SQL)."""
    url = settings.database_url
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,  # detecta mudanças em tipos/nullable
    )

    with context.begin_transaction():
        context.run_migrations()


def _run_migrations_online() -> None:
    """Migrations em modo online (aplica direto no BD)."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,          # detecta mudanças de tipo/nullable
            compare_server_default=True,
            include_schemas=False,
        )

        with context.begin_transaction():
            context.run_migrations()


# ──────────────────────────────────────────────────────────────
# 6. Entrada principal
# ──────────────────────────────────────────────────────────────
if context.is_offline_mode():
    _run_migrations_offline()
else:
    _run_migrations_online()
