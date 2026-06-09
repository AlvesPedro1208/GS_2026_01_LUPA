-- =====================================================================
-- LUPA - V3 - Autenticação de usuários (Parte 5 - Segurança)
-- A senha é armazenada apenas como hash BCrypt em senha_hash.
-- O usuário de demonstração é criado em runtime (DataInitializer),
-- garantindo um hash BCrypt válido para a senha.
-- =====================================================================
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
