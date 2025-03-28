"""Corrigindo VARCHAR nas tabelas

Revision ID: fc795a00cd48
Revises: 
Create Date: 2025-03-12 10:20:24.171029

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = 'fc795a00cd48'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('empresas',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('codigo', sa.String(length=50), nullable=False),
    sa.Column('cnpj', sa.String(length=20), nullable=False),
    sa.Column('inscricao_municipal', sa.String(length=50), nullable=True),
    sa.Column('inscricao_estadual', sa.String(length=50), nullable=True),
    sa.Column('razao_social', sa.String(length=100), nullable=False),
    sa.Column('nome_fantasia', sa.String(length=100), nullable=True),
    sa.Column('sigla', sa.String(length=10), nullable=False),
    sa.Column('nome_site', sa.String(length=100), nullable=True),
    sa.Column('tipo_empresa', sa.String(length=20), nullable=False),
    sa.Column('regime_empresarial', sa.String(length=20), nullable=False),
    sa.Column('estado_empresa', sa.String(length=20), nullable=False),
    sa.Column('exibir_site', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('cnpj'),
    sa.UniqueConstraint('codigo')
    )
    op.create_index(op.f('ix_empresas_id'), 'empresas', ['id'], unique=False)
    op.create_table('enderecos',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('empresa_id', sa.Integer(), nullable=False),
    sa.Column('formato', sa.String(length=20), nullable=False),
    sa.Column('cep', sa.String(length=10), nullable=True),
    sa.Column('rua', sa.String(length=100), nullable=True),
    sa.Column('numero', sa.String(length=10), nullable=True),
    sa.Column('complemento', sa.String(length=100), nullable=True),
    sa.Column('bairro', sa.String(length=100), nullable=True),
    sa.Column('cidade', sa.String(length=100), nullable=True),
    sa.Column('estado', sa.String(length=100), nullable=True),
    sa.Column('regiao', sa.String(length=100), nullable=True),
    sa.Column('pais', sa.String(length=100), nullable=True),
    sa.Column('latitude', sa.String(length=50), nullable=True),
    sa.Column('longitude', sa.String(length=50), nullable=True),
    sa.Column('link_maps', sa.String(length=255), nullable=True),
    sa.ForeignKeyConstraint(['empresa_id'], ['empresas.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_enderecos_id'), 'enderecos', ['id'], unique=False)
    op.create_table('redes_sociais',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('empresa_id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=100), nullable=True),
    sa.Column('instagram', sa.String(length=100), nullable=True),
    sa.Column('twitter', sa.String(length=100), nullable=True),
    sa.Column('tiktok', sa.String(length=100), nullable=True),
    sa.ForeignKeyConstraint(['empresa_id'], ['empresas.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_redes_sociais_id'), 'redes_sociais', ['id'], unique=False)
    op.create_table('telefones',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('empresa_id', sa.Integer(), nullable=False),
    sa.Column('numero', sa.String(length=20), nullable=False),
    sa.Column('principal', sa.Boolean(), nullable=True),
    sa.Column('whatsapp', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['empresa_id'], ['empresas.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_telefones_id'), 'telefones', ['id'], unique=False)
    op.drop_index('ix_phones_id', table_name='phones')
    op.drop_table('phones')
    op.drop_index('ix_social_media_id', table_name='social_media')
    op.drop_table('social_media')
    op.drop_index('email', table_name='users')
    op.drop_index('ix_users_id', table_name='users')
    op.drop_index('username', table_name='users')
    op.drop_table('users')
    op.drop_index('db_name', table_name='companies')
    op.drop_index('ix_companies_id', table_name='companies')
    op.drop_index('ix_companies_name', table_name='companies')
    op.drop_table('companies')
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('companies',
    sa.Column('id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('name', mysql.VARCHAR(length=255), nullable=False),
    sa.Column('db_name', mysql.VARCHAR(length=255), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_index('ix_companies_name', 'companies', ['name'], unique=True)
    op.create_index('ix_companies_id', 'companies', ['id'], unique=False)
    op.create_index('db_name', 'companies', ['db_name'], unique=True)
    op.create_table('users',
    sa.Column('id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('username', mysql.VARCHAR(length=255), nullable=False),
    sa.Column('email', mysql.VARCHAR(length=255), nullable=False),
    sa.Column('hashed_password', mysql.VARCHAR(length=255), nullable=False),
    sa.Column('company_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['company_id'], ['companies.id'], name='users_ibfk_1'),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_index('username', 'users', ['username'], unique=True)
    op.create_index('ix_users_id', 'users', ['id'], unique=False)
    op.create_index('email', 'users', ['email'], unique=True)
    op.create_table('social_media',
    sa.Column('id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('company_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('platform', mysql.VARCHAR(length=50), nullable=False),
    sa.Column('link', mysql.VARCHAR(length=500), nullable=False),
    sa.ForeignKeyConstraint(['company_id'], ['companies.id'], name='social_media_ibfk_1'),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_index('ix_social_media_id', 'social_media', ['id'], unique=False)
    op.create_table('phones',
    sa.Column('id', mysql.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('company_id', mysql.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('number', mysql.VARCHAR(length=20), nullable=False),
    sa.Column('is_primary', mysql.TINYINT(display_width=1), autoincrement=False, nullable=True),
    sa.Column('is_whatsapp', mysql.TINYINT(display_width=1), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['company_id'], ['companies.id'], name='phones_ibfk_1'),
    sa.PrimaryKeyConstraint('id'),
    mysql_collate='utf8mb4_0900_ai_ci',
    mysql_default_charset='utf8mb4',
    mysql_engine='InnoDB'
    )
    op.create_index('ix_phones_id', 'phones', ['id'], unique=False)
    op.drop_index(op.f('ix_telefones_id'), table_name='telefones')
    op.drop_table('telefones')
    op.drop_index(op.f('ix_redes_sociais_id'), table_name='redes_sociais')
    op.drop_table('redes_sociais')
    op.drop_index(op.f('ix_enderecos_id'), table_name='enderecos')
    op.drop_table('enderecos')
    op.drop_index(op.f('ix_empresas_id'), table_name='empresas')
    op.drop_table('empresas')
    # ### end Alembic commands ###
