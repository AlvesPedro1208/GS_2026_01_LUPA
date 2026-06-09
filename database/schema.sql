-- =====================================================================
-- LUPA - Leitura Urbana e Planejamento de Assentamentos
-- FIAP Global Solution 2026/1 - Equipe GateMinds
-- V1 - Criação do schema (PostgreSQL)
-- =====================================================================

-- ---------------------------------------------------------------------
-- COMUNIDADE: assentamento informal monitorado (entidade central)
-- ---------------------------------------------------------------------
CREATE TABLE comunidade (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome                VARCHAR(120) NOT NULL,
    setor               VARCHAR(60)  NOT NULL,
    cidade              VARCHAR(120),
    latitude            DOUBLE PRECISION,
    longitude           DOUBLE PRECISION,
    populacao_estimada  INTEGER,
    area_risco          BOOLEAN      NOT NULL DEFAULT FALSE,
    criado_em           TIMESTAMP    NOT NULL,
    CONSTRAINT uk_comunidade_setor UNIQUE (setor)
);

-- ---------------------------------------------------------------------
-- AGENTE: agente público de campo (registra ocorrências via app mobile)
-- ---------------------------------------------------------------------
CREATE TABLE agente (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome        VARCHAR(120) NOT NULL,
    matricula   VARCHAR(30)  NOT NULL,
    email       VARCHAR(150) NOT NULL,
    orgao       VARCHAR(80),
    criado_em   TIMESTAMP    NOT NULL,
    CONSTRAINT uk_agente_matricula UNIQUE (matricula),
    CONSTRAINT uk_agente_email     UNIQUE (email)
);

-- ---------------------------------------------------------------------
-- LEITURA: snapshot dos sensores IoT de uma comunidade (a cada ~15s)
-- ---------------------------------------------------------------------
CREATE TABLE leitura (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    comunidade_id   BIGINT           NOT NULL,
    temperatura     DOUBLE PRECISION NOT NULL,
    umidade         DOUBLE PRECISION NOT NULL,
    qualidade_ar    INTEGER          NOT NULL,
    status          VARCHAR(10)      NOT NULL,
    registrado_em   TIMESTAMP        NOT NULL,
    CONSTRAINT fk_leitura_comunidade FOREIGN KEY (comunidade_id) REFERENCES comunidade (id),
    CONSTRAINT ck_leitura_status CHECK (status IN ('OK', 'RISCO', 'CRITICO'))
);

CREATE INDEX ix_leitura_comunidade ON leitura (comunidade_id);
CREATE INDEX ix_leitura_status     ON leitura (status);

-- ---------------------------------------------------------------------
-- OCORRENCIA: problema registrado em campo por um agente
-- ---------------------------------------------------------------------
CREATE TABLE ocorrencia (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    comunidade_id   BIGINT       NOT NULL,
    agente_id       BIGINT       NOT NULL,
    tipo            VARCHAR(30)  NOT NULL,
    descricao       VARCHAR(500) NOT NULL,
    latitude        DOUBLE PRECISION,
    longitude       DOUBLE PRECISION,
    foto_url        VARCHAR(300),
    status          VARCHAR(15)  NOT NULL,
    criado_em       TIMESTAMP    NOT NULL,
    CONSTRAINT fk_ocorrencia_comunidade FOREIGN KEY (comunidade_id) REFERENCES comunidade (id),
    CONSTRAINT fk_ocorrencia_agente     FOREIGN KEY (agente_id)     REFERENCES agente (id),
    CONSTRAINT ck_ocorrencia_status CHECK (status IN ('ABERTA', 'EM_ANALISE', 'RESOLVIDA'))
);

CREATE INDEX ix_ocorrencia_comunidade ON ocorrencia (comunidade_id);
CREATE INDEX ix_ocorrencia_agente     ON ocorrencia (agente_id);

-- ---------------------------------------------------------------------
-- ALERTA: gerado automaticamente a partir de uma leitura crítica (1:1)
-- ---------------------------------------------------------------------
CREATE TABLE alerta (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    comunidade_id   BIGINT       NOT NULL,
    leitura_id      BIGINT       NOT NULL,
    nivel           VARCHAR(10)  NOT NULL,
    mensagem        VARCHAR(500) NOT NULL,
    resolvido       BOOLEAN      NOT NULL DEFAULT FALSE,
    criado_em       TIMESTAMP    NOT NULL,
    CONSTRAINT fk_alerta_comunidade FOREIGN KEY (comunidade_id) REFERENCES comunidade (id),
    CONSTRAINT fk_alerta_leitura    FOREIGN KEY (leitura_id)    REFERENCES leitura (id),
    CONSTRAINT uk_alerta_leitura    UNIQUE (leitura_id),
    CONSTRAINT ck_alerta_nivel CHECK (nivel IN ('RISCO', 'CRITICO'))
);

CREATE INDEX ix_alerta_comunidade ON alerta (comunidade_id);
CREATE INDEX ix_alerta_resolvido  ON alerta (resolvido);

-- ---------------------------------------------------------------------
-- USUARIO: autenticação (Parte 5 - Segurança).
-- A senha é armazenada apenas como hash BCrypt em senha_hash.
-- ---------------------------------------------------------------------
CREATE TABLE usuario (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome        VARCHAR(120) NOT NULL,
    email       VARCHAR(150) NOT NULL,
    senha_hash  VARCHAR(100) NOT NULL,
    role        VARCHAR(10)  NOT NULL,
    criado_em   TIMESTAMP    NOT NULL,
    CONSTRAINT uk_usuario_email UNIQUE (email),
    CONSTRAINT ck_usuario_role CHECK (role IN ('AGENTE', 'GESTOR'))
);

-- ---------------------------------------------------------------------
-- USUARIO: autenticação (Parte 5 - Segurança). A senha é armazenada
-- exclusivamente como hash BCrypt em senha_hash (nunca em texto puro).
-- ---------------------------------------------------------------------
CREATE TABLE usuario (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome        VARCHAR(120) NOT NULL,
    email       VARCHAR(150) NOT NULL,
    senha_hash  VARCHAR(100) NOT NULL,
    role        VARCHAR(10)  NOT NULL,
    criado_em   TIMESTAMP    NOT NULL,
    CONSTRAINT uk_usuario_email UNIQUE (email),
    CONSTRAINT ck_usuario_role CHECK (role IN ('AGENTE', 'GESTOR'))
);
