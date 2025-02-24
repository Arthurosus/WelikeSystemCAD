from flask import Flask, request, jsonify
from flask_migrate import Migrate
from sqlalchemy import text
from config import Config
from extensions import db  # Importe do novo arquivo
from models import Company  # Agora seguro

app = Flask(__name__)
app.config.from_object(Config)

# Inicializa o banco de dados
db.init_app(app)
migrate = Migrate(app, db)

@app.route('/api/companies', methods=['POST'])
def register_company():
    # ... (mantenha o código existente)

    if __name__ == '__main__':
        app.run(debug=True)