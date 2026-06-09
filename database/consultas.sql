-- =====================================================================
-- LUPA - Consultas SQL básicas de simulação de uso
-- FIAP Global Solution 2026/1 - Equipe GateMinds
-- Entregável da Parte 1 (Banco de Dados).
-- Execute após aplicar schema.sql e seed.sql (ou após subir o backend,
-- que aplica as mesmas migrations via Flyway).
-- =====================================================================

-- 1) Listar todas as comunidades monitoradas, das mais populosas para as menos.
SELECT id, nome, setor, cidade, populacao_estimada, area_risco
FROM comunidade
ORDER BY populacao_estimada DESC;

-- 2) Última leitura de cada comunidade (status atual da zona).
SELECT DISTINCT ON (l.comunidade_id)
       c.setor, c.nome, l.temperatura, l.umidade, l.qualidade_ar, l.status, l.registrado_em
FROM leitura l
JOIN comunidade c ON c.id = l.comunidade_id
ORDER BY l.comunidade_id, l.registrado_em DESC;

-- 3) Todas as leituras em estado CRÍTICO (2+ limiares ultrapassados).
SELECT c.setor, l.temperatura, l.umidade, l.qualidade_ar, l.registrado_em
FROM leitura l
JOIN comunidade c ON c.id = l.comunidade_id
WHERE l.status = 'CRITICO'
ORDER BY l.registrado_em DESC;

-- 4) Alertas ativos (não resolvidos) com a comunidade afetada.
SELECT a.id, c.setor, a.nivel, a.mensagem, a.criado_em
FROM alerta a
JOIN comunidade c ON c.id = a.comunidade_id
WHERE a.resolvido = FALSE
ORDER BY a.criado_em DESC;

-- 5) Ocorrências de uma comunidade específica (ex.: Setor_C), com o agente responsável.
SELECT o.id, o.tipo, o.descricao, o.status, ag.nome AS agente, o.criado_em
FROM ocorrencia o
JOIN comunidade c ON c.id = o.comunidade_id
JOIN agente ag    ON ag.id = o.agente_id
WHERE c.setor = 'Setor_C'
ORDER BY o.criado_em DESC;

-- 6) Quantidade de leituras por status (visão geral de risco da cidade).
SELECT status, COUNT(*) AS total
FROM leitura
GROUP BY status
ORDER BY total DESC;

-- 7) Comunidades em área de risco que possuem pelo menos um alerta ativo.
SELECT DISTINCT c.setor, c.nome
FROM comunidade c
JOIN alerta a ON a.comunidade_id = c.id AND a.resolvido = FALSE
WHERE c.area_risco = TRUE
ORDER BY c.setor;

-- 8) Ranking de agentes por número de ocorrências registradas.
SELECT ag.nome, ag.orgao, COUNT(o.id) AS ocorrencias_registradas
FROM agente ag
LEFT JOIN ocorrencia o ON o.agente_id = ag.id
GROUP BY ag.id, ag.nome, ag.orgao
ORDER BY ocorrencias_registradas DESC;
