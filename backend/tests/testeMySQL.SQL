CREATE DATABASE IF NOT EXISTS central_system CHARACTER SET utf8mb4;
USE central_system;

-- tabelas de look‑up mínimas (id = 1)
INSERT INTO tipos_empresa          (id,nome) VALUES (1,'Própria');
INSERT INTO regimes_empresariais   (id,nome) VALUES (1,'Simples');
INSERT INTO estados_empresa        (id,nome) VALUES (1,'Ativa');

-- empresa + relacionamentos
INSERT INTO empresas
(codigo,cnpj,inscricao_municipal,inscricao_estadual,razao_social,
 nome_fantasia,sigla,nome_site,tipo_empresa_id,regime_empresarial_id,
 estado_empresa_id,exibir_site)
VALUES
('EMP001','12.345.678/0001-90','12345','54321','Empresa Teste Ltda',
 'Empresa Teste','ET','empresateste',1,1,1,1);

INSERT INTO enderecos
(formato,cep,rua,numero,bairro,cidade,estado,pais,empresa_id)
VALUES
('brasil','01001-000','Rua Teste','100','Centro','São Paulo','SP','Brasil',1);

INSERT INTO telefones (numero,principal,whatsapp,empresa_id)
VALUES ('11999999999',1,1,1);

INSERT INTO redes_sociais (tipo,link,empresa_id)
VALUES ('instagram','https://instagram.com/empresateste',1);
