-- =====================================================================
-- LUPA - V2 - Dados de exemplo (seed)
-- Inclui os três cenários documentados do IoT: OK, RISCO e CRÍTICO.
-- Usa bloco PL/pgSQL para resolver as chaves estrangeiras de forma robusta.
-- =====================================================================
DO $$
DECLARE
    c_setor_a   BIGINT;
    c_setor_b   BIGINT;
    c_setor_c   BIGINT;
    ag_ana      BIGINT;
    ag_bruno    BIGINT;
    l_risco     BIGINT;
    l_critica   BIGINT;
BEGIN
    -- ---------------- Comunidades ----------------
    INSERT INTO comunidade (nome, setor, cidade, latitude, longitude, populacao_estimada, area_risco, criado_em)
    VALUES ('Comunidade Jardim União', 'Setor_A', 'São Paulo', -23.6045, -46.7220, 4200, TRUE, NOW())
    RETURNING id INTO c_setor_a;

    INSERT INTO comunidade (nome, setor, cidade, latitude, longitude, populacao_estimada, area_risco, criado_em)
    VALUES ('Comunidade Vale Verde', 'Setor_B', 'São Paulo', -23.6100, -46.7300, 2600, FALSE, NOW())
    RETURNING id INTO c_setor_b;

    INSERT INTO comunidade (nome, setor, cidade, latitude, longitude, populacao_estimada, area_risco, criado_em)
    VALUES ('Comunidade Beira-Rio', 'Setor_C', 'São Paulo', -23.6180, -46.7410, 5100, TRUE, NOW())
    RETURNING id INTO c_setor_c;

    -- ---------------- Agentes ----------------
    INSERT INTO agente (nome, matricula, email, orgao, criado_em)
    VALUES ('Ana Souza', 'AG-1001', 'ana.souza@prefeitura.gov.br', 'Defesa Civil', NOW())
    RETURNING id INTO ag_ana;

    INSERT INTO agente (nome, matricula, email, orgao, criado_em)
    VALUES ('Bruno Lima', 'AG-1002', 'bruno.lima@prefeitura.gov.br', 'Secretaria de Saúde', NOW())
    RETURNING id INTO ag_bruno;

    -- ---------------- Leituras (cenários documentados) ----------------
    -- Cenário OK: 26.7°C / 70.0% / 3628
    INSERT INTO leitura (comunidade_id, temperatura, umidade, qualidade_ar, status, registrado_em)
    VALUES (c_setor_a, 26.7, 70.0, 3628, 'OK', NOW() - INTERVAL '30 minutes');

    -- Cenário RISCO: 34.4°C / 70.0% / 3628 (apenas temperatura acima do limiar)
    INSERT INTO leitura (comunidade_id, temperatura, umidade, qualidade_ar, status, registrado_em)
    VALUES (c_setor_a, 34.4, 70.0, 3628, 'RISCO', NOW() - INTERVAL '15 minutes')
    RETURNING id INTO l_risco;

    -- Cenário CRÍTICO: 36.1°C / 23.5% / 3913 (os três limiares ultrapassados)
    INSERT INTO leitura (comunidade_id, temperatura, umidade, qualidade_ar, status, registrado_em)
    VALUES (c_setor_c, 36.1, 23.5, 3913, 'CRITICO', NOW() - INTERVAL '5 minutes')
    RETURNING id INTO l_critica;

    -- ---------------- Alertas (gerados pelas leituras não-OK) ----------------
    INSERT INTO alerta (comunidade_id, leitura_id, nivel, mensagem, resolvido, criado_em)
    VALUES (c_setor_a, l_risco, 'RISCO',
            'Temperatura 34.4°C acima de 32°C: adensamento populacional',
            FALSE, NOW() - INTERVAL '15 minutes');

    INSERT INTO alerta (comunidade_id, leitura_id, nivel, mensagem, resolvido, criado_em)
    VALUES (c_setor_c, l_critica, 'CRITICO',
            'Temperatura 36.1°C acima de 32°C: adensamento populacional | ' ||
            'Umidade 23.5% abaixo de 30%: ausência de saneamento/água | ' ||
            'Qualidade do ar 3913 acima de 3800: queima de lixo/poluição',
            FALSE, NOW() - INTERVAL '5 minutes');

    -- ---------------- Ocorrências de campo ----------------
    INSERT INTO ocorrencia (comunidade_id, agente_id, tipo, descricao, latitude, longitude, foto_url, status, criado_em)
    VALUES (c_setor_c, ag_ana, 'RISCO_INCENDIO',
            'Moradores relatam queima de lixo próxima a barracos de madeira no Setor_C.',
            -23.6181, -46.7409, NULL, 'ABERTA', NOW() - INTERVAL '10 minutes');

    INSERT INTO ocorrencia (comunidade_id, agente_id, tipo, descricao, latitude, longitude, foto_url, status, criado_em)
    VALUES (c_setor_a, ag_bruno, 'FALTA_AGUA',
            'Ausência de abastecimento; moradores armazenam água em baldes (risco de dengue).',
            -23.6046, -46.7219, NULL, 'EM_ANALISE', NOW() - INTERVAL '2 hours');
END $$;
