# Banco de Dados — LUPA (Parte 1)

Entregáveis da Parte 1 (Modelo de Banco de Dados) do projeto LUPA.

| Arquivo | Conteúdo |
|---------|----------|
| [`schema.sql`](schema.sql) | DDL completo: `CREATE TABLE` das 5 entidades, PKs, FKs, constraints e índices |
| [`seed.sql`](seed.sql) | Dados de exemplo, incluindo os 3 cenários do IoT (OK / RISCO / CRÍTICO) |
| [`consultas.sql`](consultas.sql) | 8 consultas SQL de simulação de uso |
| [`../docs/diagrama-er.md`](../docs/diagrama-er.md) | Diagrama ER (Mermaid) e descrição dos relacionamentos |

> **Fonte única da verdade:** `schema.sql` e `seed.sql` são cópias fiéis das migrations
> Flyway em `backend/src/main/resources/db/migration/` (`V1__init_schema.sql` e
> `V2__seed_data.sql`), executadas automaticamente quando o backend sobe. Esta pasta
> existe para rodar o banco de forma independente da aplicação.

## Como rodar sem a aplicação

```bash
# 1. Suba um PostgreSQL (a partir de backend/docker-compose.yml)
cd ../backend && docker compose up -d

# 2. Aplique schema, seed e consultas
psql "postgresql://lupa:lupa@localhost:5432/lupa" -f ../database/schema.sql
psql "postgresql://lupa:lupa@localhost:5432/lupa" -f ../database/seed.sql
psql "postgresql://lupa:lupa@localhost:5432/lupa" -f ../database/consultas.sql
```

## Modelo

5 entidades: **comunidade**, **agente**, **leitura**, **ocorrencia**, **alerta**.
Ver o [diagrama ER](../docs/diagrama-er.md) para os relacionamentos.
