"""
Script de execução do Alembic.

– Lê a URL do banco do objeto settings (já populado pelo app/core/config.py)
– Inclui todos os modelos para que o autogenerate enxergue as tabelas
"""

from __future__ import annotations

import logging
from logging.config import fileConfig
from pathlib import Path
from alembic import context
from sqlalchemy import engine_from_config, pool

# ------------------------------------------------------------------
# 1. Carrega settings e modelos
# ------------------------------------------------------------------
import sys
sys.path.append(str(Path(__file__).resolve().parents[1]))  # adiciona /backend ao PYTHONPATH

from app.core.config import settings                    # noqa: E402
from app.db.database import Base                            # noqa: E402  (contém metadata)

# ------------------------------------------------------------------
# 2. Config Alembic / Logging
# ------------------------------------------------------------------
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)
logger = logging.getLogger("alembic.env")

# ←<<<<  ALTERAÇÃO AQUI  >>>>>>→
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)
# ------------------------------------------------------------------

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Modo 'offline': gera apenas SQL."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
        compare_server_default=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Modo 'online': conecta-se ao banco e executa DDL."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
            compare_server_default=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
