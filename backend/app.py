from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from models import db, Company
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

@app.route('/api/companies', methods=['POST'])
def register_company():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['cnpj', 'razao_social', 'sigla']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required'}), 400

    # Generate franchise database name
    database_name = f"welike_{data['sigla'].lower()}"

    # Check if CNPJ or database already exists
    if Company.query.filter_by(cnpj=data['cnpj']).first():
        return jsonify({'error': 'CNPJ already registered'}), 400
    if Company.query.filter_by(database_name=database_name).first():
        return jsonify({'error': 'Sigla already in use'}), 400

    # Create company in central database
    new_company = Company(
        cnpj=data['cnpj'],
        razao_social=data['razao_social'],
        nome_fantasia=data.get('nome_fantasia'),
        sigla=data['sigla'],
        database_name=database_name,
        telefone1=data.get('telefone1'),
        email=data.get('email'),
        homepage=data.get('homepage')
        # Add other fields
    )

    try:
        db.session.add(new_company)
        db.session.commit()
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    # Create franchise-specific database
    engine = db.create_engine(Config.SQLALCHEMY_DATABASE_URI)
    with engine.connect() as conn:
        conn.execution_options(isolation_level="AUTOCOMMIT")
        conn.execute(text(f"CREATE DATABASE {database_name}"))

    # Initialize tables in the new database (simplified example)
    franchise_uri = f"{Config.SQLALCHEMY_DATABASE_URI.rsplit('/', 1)[0]}/{database_name}"
    franchise_engine = db.create_engine(franchise_uri)
    with franchise_engine.connect() as conn:
        # Example: Create a table for future student data
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS alunos (
                id INT PRIMARY KEY AUTO_INCREMENT,
                nome VARCHAR(255) NOT NULL,
                email VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """))

    return jsonify({
        'message': 'Company registered successfully',
        'company_id': new_company.id,
        'database_name': database_name
    }), 201

if __name__ == '__main__':
    app.run(debug=True)