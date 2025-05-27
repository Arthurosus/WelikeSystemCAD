"""
Ferramentas de linha de comando para o WelikeSystemCAD.

• reset-db     → drop + create + seed em desenvolvimento
• seed-db      → apenas insere (ou garante) valores-padrão

Requer Typer →  pip install typer[all]
"""

import typer
from sqlalchemy import text
from app.db.database import engine_central, SessionLocal
from app import models

app = typer.Typer(help="CLI utilitário para o banco de dados")

# ────────────────────────── dados-padrão ───────────────────────────
SEED_DATA = {
    models.TipoEmpresa: [
        "Própria",
        "Franqueada",
        "Parceira",
    ],
    models.RegimeEmpresarial: [
        "Simples",
        "Lucro Presumido",
        "Lucro Real",
    ],
    models.EstadoEmpresa: [
        "Ativa",
        "Inativa",
        "Encerrada",
    ],
}

# ────────────────────────── helpers ────────────────────────────────
def _seed_defaults(db):
    """Insere valores que não existirem nas tabelas de lookup."""
    for model_cls, nomes in SEED_DATA.items():
        for nome in nomes:
            exists = db.query(model_cls).filter_by(nome=nome).first()
            if not exists:
                db.add(model_cls(nome=nome))
    db.commit()


# ────────────────────────── comandos CLI ───────────────────────────
@app.command()
def seed_db():
    """Só popula valores de lookup (não exclui nada)."""
    db = SessionLocal()
    try:
        _seed_defaults(db)
        typer.echo("✔ Valores default garantidos no banco central.")
    finally:
        db.close()


@app.command()
def reset_db(confirm: bool = typer.Option(False, "--confirm", "-c", help="Confirma DROP")):
    """
    ⚠ Destrói e recria TODAS as tabelas no banco central,
    depois insere os dados-padrão.  Útil em ambiente de dev.
    """
    if not confirm:
        typer.echo("Use --confirm ou -c para realmente dropar o banco.")
        raise typer.Abort()

    with engine_central.connect() as conn:
        typer.echo("🗑  Dropando todas as tabelas …")
        conn.execute(text("SET FOREIGN_KEY_CHECKS = 0;"))
        for table in reversed(models.Base.metadata.sorted_tables):
            conn.execute(text(f"DROP TABLE IF EXISTS {table.name};"))
        conn.execute(text("SET FOREIGN_KEY_CHECKS = 1;"))

    typer.echo("🛠  Criando tabelas …")
    models.Base.metadata.create_all(bind=engine_central)

    db = SessionLocal()
    try:
        _seed_defaults(db)
        typer.echo("🌱 Banco recriado + seed concluído!")
    finally:
        db.close()


if __name__ == "__main__":
    app()
