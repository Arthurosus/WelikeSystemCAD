"""
Alembic environment file – carrega as models do projeto e expõe o MetaData
para geração / execução de migrações.

Executar:
    alembic revision --autogenerate -m "minha mensagem"
    alembic upgrade head
"""

from __future__ import annotations

import os
import sys
from logging.config import fileConfig
from pathlib import Path

from alembic import context
from sqlalchemy import engine_from_config, pool

# ──────────────────────────────────────────────────────────────
# 1) Permitir import "from app.…" mesmo quando chamado via CLI
# ──────────────────────────────────────────────────────────────
PROJECT_ROOT = Path(__file__).resolve().parents[1]  # …/backend
if str(PROJECT_ROOT) not in sys.path:
    sys.path.append(str(PROJECT_ROOT))

# ──────────────────────────────────────────────────────────────
# 2) Import das configs e models
# ──────────────────────────────────────────────────────────────
from app.core.config import settings        # noqa: E402
from app.db.base import Base                # noqa: E402  (contém metadata)
from app import models                      # noqa: F401,E402  (importa tudo p/ registrar)

# ──────────────────────────────────────────────────────────────
# 3) Configuração da seção [alembic] do alembic.ini (fileConfig)
# ──────────────────────────────────────────────────────────────
config = context.config
fileConfig(config.config_file_name)  # habilita logging do Alembic

# Banco de dados raiz (central)
config.set_main_option("sqlalchemy.url", settings.database_url)

target_metadata = Base.metadata  # permite autogenerate()


# ──────────────────────────────────────────────────────────────
# 4) Rotinas padrão do Alembic
# ──────────────────────────────────────────────────────────────
def run_migrations_offline() -> None:
    """Gera um script SQL (modo *offline*)."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Aplica migrações direto no banco (modo *online*)."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,   # detecta alterações no tipo das colunas
        )

        with context.begin_transaction():
            context.run_migrations()


# Alembic escolhe automaticamente se está em modo offline/online
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
