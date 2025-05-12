-- ======================================================================
-- REBUILD DO ESQUEMA CENTRAL  (MySQL 8+)
-- ======================================================================

/* 1. Mata o banco se já existir -------------------------------------- */
DROP DATABASE IF EXISTS central_system;

/* 2. Cria o banco principal ------------------------------------------ */
CREATE DATABASE central_system
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE central_system;

/* 3. Tabelas de referência (look‑up) --------------------------------- */
CREATE TABLE tipos_empresa (
    id   INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE regimes_empresariais (
    id   INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE estados_empresa (
    id   INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

/* 4. Tabela principal ------------------------------------------------- */
CREATE TABLE empresas (
    id                     INT AUTO_INCREMENT PRIMARY KEY,
    codigo                 VARCHAR(50)  NOT NULL UNIQUE,
    cnpj                   VARCHAR(20)  NOT NULL UNIQUE,
    inscricao_municipal    VARCHAR(50),
    inscricao_estadual     VARCHAR(50),
    razao_social           VARCHAR(255) NOT NULL,
    nome_fantasia          VARCHAR(255),
    sigla                  VARCHAR(10),
    nome_site              VARCHAR(255),

    tipo_empresa_id        INT NOT NULL,
    regime_empresarial_id  INT NOT NULL,
    estado_empresa_id      INT NOT NULL,

    exibir_site            TINYINT(1) DEFAULT 0,

    CONSTRAINT fk_emp_tipo   FOREIGN KEY (tipo_empresa_id)
                             REFERENCES tipos_empresa(id)
                             ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_emp_regime FOREIGN KEY (regime_empresarial_id)
                             REFERENCES regimes_empresariais(id)
                             ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_emp_estado FOREIGN KEY (estado_empresa_id)
                             REFERENCES estados_empresa(id)
                             ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

/* 5. Detalhes da empresa --------------------------------------------- */
CREATE TABLE telefones (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    numero      VARCHAR(20) NOT NULL,
    principal   TINYINT(1) DEFAULT 0,
    whatsapp    TINYINT(1) DEFAULT 0,
    empresa_id  INT,
    CONSTRAINT fk_tel_empresa FOREIGN KEY (empresa_id)
                              REFERENCES empresas(id)
                              ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE redes_sociais (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    tipo        VARCHAR(50)  NOT NULL,
    link        VARCHAR(255),
    empresa_id  INT,
    CONSTRAINT fk_rs_empresa FOREIGN KEY (empresa_id)
                             REFERENCES empresas(id)
                             ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE enderecos (
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
    empresa_id  INT UNIQUE,                   -- 1‑para‑1
    CONSTRAINT fk_end_empresa FOREIGN KEY (empresa_id)
                              REFERENCES empresas(id)
                              ON DELETE CASCADE
) ENGINE=InnoDB;

/* --------------------------------------------------------------------
   6. <<< Inserir aqui novas tabelas quando forem criadas >>>
   ------------------------------------------------------------------ */

/* 7. Índices auxiliares (exemplo) ------------------------------------ */
CREATE INDEX idx_emp_razao      ON empresas (razao_social);
CREATE INDEX idx_tel_numero     ON telefones (numero);
CREATE INDEX idx_end_cidade     ON enderecos (cidade);

/* 8. (Opcional) dados seed ------------------------------------------- */
/*
INSERT INTO tipos_empresa (nome) VALUES ('Própria'), ('Franqueada');
INSERT INTO regimes_empresariais (nome) VALUES ('Simples'), ('Lucro Presumido');
INSERT INTO estados_empresa (nome) VALUES ('Ativa'), ('Inativa');
*/

-- ======================================================================
-- Fim do rebuild
-- ======================================================================
