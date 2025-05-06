/* --------------------------------------------------------------
   Inicialização completa do banco central_system
   --------------------------------------------------------------*/

-- 1) Banco
CREATE DATABASE IF NOT EXISTS `central_system`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `central_system`;

/* --------------------------------------------------------------
   2) Tabelas de domínio
   --------------------------------------------------------------*/
CREATE TABLE IF NOT EXISTS tipos_empresa (
    id   INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS regimes_empresariais (
    id   INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS estados_empresa (
    id   INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL
);

/* --------------------------------------------------------------
   3) Tabelas centrais
   --------------------------------------------------------------*/
CREATE TABLE IF NOT EXISTS empresas (
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    codigo               VARCHAR(50)  UNIQUE NOT NULL,
    cnpj                 VARCHAR(20)  UNIQUE NOT NULL,
    inscricao_municipal  VARCHAR(50),
    inscricao_estadual   VARCHAR(50),
    razao_social         VARCHAR(255) NOT NULL,
    nome_fantasia        VARCHAR(255),
    sigla                VARCHAR(10),
    nome_site            VARCHAR(255),
    tipo_empresa_id      INT          NOT NULL,
    regime_empresarial_id INT         NOT NULL,
    estado_empresa_id    INT          NOT NULL,
    exibir_site          TINYINT(1)   DEFAULT 0,

    CONSTRAINT fk_tipo_empresa
        FOREIGN KEY (tipo_empresa_id) REFERENCES tipos_empresa(id),
    CONSTRAINT fk_regime_empresarial
        FOREIGN KEY (regime_empresarial_id) REFERENCES regimes_empresariais(id),
    CONSTRAINT fk_estado_empresa
        FOREIGN KEY (estado_empresa_id) REFERENCES estados_empresa(id)
);

CREATE TABLE IF NOT EXISTS enderecos (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    formato     VARCHAR(20) NOT NULL,
    cep         VARCHAR(20),
    rua         VARCHAR(255),
    numero      VARCHAR(20),
    complemento VARCHAR(255),
    bairro      VARCHAR(255),
    cidade      VARCHAR(255),
    estado      VARCHAR(255),
    regiao      VARCHAR(255),
    pais        VARCHAR(255),
    latitude    VARCHAR(50),
    longitude   VARCHAR(50),
    link_maps   VARCHAR(255),
    empresa_id  INT,
    CONSTRAINT fk_end_empresa
        FOREIGN KEY (empresa_id) REFERENCES empresas(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS telefones (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    numero     VARCHAR(20) NOT NULL,
    principal  TINYINT(1)  DEFAULT 0,
    whatsapp   TINYINT(1)  DEFAULT 0,
    empresa_id INT,
    CONSTRAINT fk_tel_empresa
        FOREIGN KEY (empresa_id) REFERENCES empresas(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS redes_sociais (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    tipo       VARCHAR(50) NOT NULL,
    link       VARCHAR(255),
    empresa_id INT,
    CONSTRAINT fk_rs_empresa
        FOREIGN KEY (empresa_id) REFERENCES empresas(id)
        ON DELETE CASCADE
);

/* Alembic (caso use migrations) */
CREATE TABLE IF NOT EXISTS alembic_version (
    version_num VARCHAR(32) NOT NULL,
    PRIMARY KEY (version_num)
);

/* --------------------------------------------------------------
   4) Seeds básicos (IGNORAM duplicatas)
   --------------------------------------------------------------*/
INSERT IGNORE INTO tipos_empresa (nome) VALUES
    ('Própria'), ('Franqueada');

INSERT IGNORE INTO regimes_empresariais (nome) VALUES
    ('Simples'), ('Lucro Presumido'), ('Lucro Real');

INSERT IGNORE INTO estados_empresa (nome) VALUES
    ('Ativa'), ('Inativa');

/* --------------------------------------------------------------
   5) Registro‑exemplo completo para testes
   --------------------------------------------------------------*/
INSERT IGNORE INTO empresas
(codigo, cnpj, razao_social, nome_fantasia,
 tipo_empresa_id, regime_empresarial_id, estado_empresa_id, exibir_site)
VALUES ('EMP001', '00.000.000/0001-00',
        'Empresa Exemplo Ltda', 'Exemplo',
        1, 1, 1, 1);

INSERT IGNORE INTO enderecos
(formato, cep, rua, cidade, estado, pais, empresa_id)
VALUES ('brasil', '01000-000', 'Rua Fictícia', 'São Paulo', 'SP', 'Brasil', 1);

INSERT IGNORE INTO telefones
(numero, principal, whatsapp, empresa_id)
VALUES ('11999990000', 1, 1, 1);

INSERT IGNORE INTO redes_sociais
(tipo, link, empresa_id)
VALUES ('Instagram', 'https://instagram.com/empresa', 1);

/* --------------------------------------------------------------
   6) Criação rápida de bancos de franquia
   --------------------------------------------------------------*/
-- Exemplo (comment‑out para usar):
-- CREATE DATABASE IF NOT EXISTS `franquia_loja1`
--   DEFAULT CHARACTER SET utf8mb4
--   COLLATE utf8mb4_unicode_ci;
--
-- -- depois basta importar o mesmo esquema nas franquias
-- -- (ou usar seus scripts Python para gerá‑lo automaticamente).

/* Fim do script */
