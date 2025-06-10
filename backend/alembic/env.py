"""
Env-file do Alembic.
Responsável por configurar o SQLAlchemy, carregar o metadata
e gerar/aplicar migrations.
"""

# ────────────────────────────────────────────────────────────────
# Ajuste para que 'app' seja encontrado mesmo fora do PYTHONPATH.
# (Coloque ANTES de qualquer import que use 'app')
# ────────────────────────────────────────────────────────────────
import pathlib, sys               #  ←  linha nova
sys.path.append(str(pathlib.Path(__file__).resolve().parents[1]))   #  ←  linha nova

from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool

# Carregar settings do projeto
from app.core.config import settings          # agora funciona

from alembic import context
from app import models                        # importa todos os modelos

# Interpretar o arquivo .ini e configurar logging
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# URL do banco vem do settings
config.set_main_option("sqlalchemy.url", settings.DATABASE_URL)

# “target_metadata” diz ao Alembic onde procurar os modelos
target_metadata = models.Base.metadata


def run_migrations_offline() -> None:
    """Gera SQL (modo offline)."""
    context.configure(
        url=settings.DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,            # detecta mudanças de tipo
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Aplica migrations diretamente no banco (modo online)."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        url=settings.DATABASE_URL,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
