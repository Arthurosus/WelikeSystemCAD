"""
Provisiona o banco central e, opcionalmente, bancos‑franquia.

• Cria o schema central_system
• Importa os dumps de dbSetup/seeds
• Cria franquias passadas por linha de comando
"""

import os, sys, glob, argparse
import mysql.connector as mc


# ───────── 1. Config ─────────
DB_USER    = os.getenv("DB_USER", "root")
DB_PASS    = os.getenv("DB_PASS", "senha")
DB_HOST    = os.getenv("DB_HOST", "localhost")
DB_PORT    = int(os.getenv("DB_PORT", 3306))
CENTRAL_DB = os.getenv("CENTRAL_DB_NAME", "central_system")
CHARSET    = "utf8mb4"


# ───────── 2. Helpers ─────────
def conn(db: str | None = None) -> mc.MySQLConnection:
    """Abre conexão (database opcional)."""
    return mc.connect(
        user=DB_USER, password=DB_PASS,
        host=DB_HOST, port=DB_PORT,
        database=db,
        charset=CHARSET
    )


def run_sql(cur: mc.cursor.MySQLCursor, path: str) -> None:
    """Executa todo o arquivo .sql."""
    print(f"▶  Importando {os.path.basename(path)}")
    with open(path, encoding="utf-8") as f:
        script = f.read()
    for _ in cur.execute(script, multi=True):
        pass


# ───────── 3. Central ─────────
def init_central_db() -> None:
    print(f"=== Criando banco central '{CENTRAL_DB}' ===")
    with conn() as c:
        c.autocommit = True
        c.cursor().execute(
            f"CREATE DATABASE IF NOT EXISTS `{CENTRAL_DB}` "
            f"DEFAULT CHARACTER SET {CHARSET}"
        )

    seed_dir = os.path.join("dbSetup", "seeds")
    with conn(CENTRAL_DB) as c:
        cur = c.cursor()
        for f in sorted(glob.glob(os.path.join(seed_dir, "central_system_*.sql"))):
            run_sql(cur, f)
        c.commit()
    print("✅ Banco central pronto!\n")


# ───────── 4. Franquia ─────────
def create_franchise_db(name: str) -> None:
    print(f"=== Criando franquia '{name}' ===")
    with conn() as c:
        c.autocommit = True
        c.cursor().execute(
            f"CREATE DATABASE IF NOT EXISTS `{name}` "
            f"DEFAULT CHARACTER SET {CHARSET}"
        )
    print(f"✅ Franquia '{name}' criada.\n")


# ───────── 5. CLI ─────────
def main() -> None:
    parser = argparse.ArgumentParser("Provisiona banco central + franquias")
    parser.add_argument("-f", "--franchise", action="append", default=[])
    parser.add_argument("--only-franchise", action="store_true")
    args = parser.parse_args()

    if not args.only_franchise:
        init_central_db()

    for fr in args.franchise:
        create_franchise_db(fr)


if __name__ == "__main__":
    main()
