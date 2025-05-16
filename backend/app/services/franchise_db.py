"""
Serviços auxiliares para criação automática do banco ― “franquia” ― de
cada empresa logo após o cadastro no banco central.

• A sigla (campo único na tabela Empresa) é normalizada e usada como
  nome do novo schema/banco no MySQL.
• Cria o schema se ainda não existir.
• Executa as migrações Alembic sobre o novo banco para que ele tenha
  a mesma estrutura do banco central.
"""

from __future__ import annotations

import re
import subprocess
from pathlib import Path
from typing import Final

import sqlalchemy as sa
from alembic import command, config

from app.core.config import settings  # importa variáveis do .env


# ────────────────────────────────────────────────────────────────────────────
# 1. helpers
# ────────────────────────────────────────────────────────────────────────────
def normalize_sigla(raw: str) -> str:
    """
    Converte a sigla para um nome de schema:
    - minúsculas
    - substitui espaços por underscore
    - remove caracteres não alfanuméricos
    """
    cleaned = re.sub(r"[^a-zA-Z0-9_]", "", raw.replace(" ", "_"))
    return cleaned.lower()


def build_franchise_url(schema: str) -> str:
    """Monta a URL de conexão para o novo banco."""
    return (
        f"mysql+pymysql://{settings.DB_USER}:{settings.DB_PASS}"
        f"@{settings.DB_HOST}:{settings.DB_PORT}/{schema}"
    )


# ────────────────────────────────────────────────────────────────────────────
# 2. criação do schema + migrações
# ────────────────────────────────────────────────────────────────────────────
def create_franchise_database(sigla: str) -> None:
    """
    1) Cria o schema `<sigla_normalizada>` caso não exista.
    2) Executa as migrações Alembic nele.
    Lança exceção se algo falhar.
    """
    schema_name = normalize_sigla(sigla)

    root_engine = sa.create_engine(settings.DATABASE_URL_ROOT, isolation_level="AUTOCOMMIT")
    with root_engine.connect() as conn:
        conn.execute(sa.text(f"CREATE DATABASE IF NOT EXISTS `{schema_name}`"))
        conn.commit()

    # ── aplica migrations ───────────────────────────────────────────────
    alembic_cfg = _make_alembic_cfg(schema_name)
    command.upgrade(alembic_cfg, "head")


def _make_alembic_cfg(schema_name: str) -> config.Config:
    """
    Gera um objeto Alembic Config apontando para o novo schema.
    Usamos um arquivo temporário porque o constructor de Alembic espera
    ler um .ini; mas podemos criá‑lo em memória (Path/tempfile).
    """
    ini_template: Final[str] = f"""
[alembic]
script_location = {Path(__file__).resolve().parent.parent.parent}/alembic

[loggers]
keys = root

[handlers]
keys = console

[formatters]
keys = generic

[logger_root]
level = WARN
handlers = console

[handler_console]
class = StreamHandler
args = (sys.stderr,)
level = NOTSET
formatter = generic

[formatter_generic]
format = %(levelname)-5.5s [%(name)s] %(message)s

[alembic:runtime]
sqlalchemy.url = {build_franchise_url(schema_name)}
"""

    tmp_ini = Path.cwd() / f"alembic_{schema_name}.ini"
    tmp_ini.write_text(ini_template, encoding="utf-8")

    cfg = config.Config(str(tmp_ini))
    cfg.set_main_option("sqlalchemy.url", build_franchise_url(schema_name))
    return cfg
