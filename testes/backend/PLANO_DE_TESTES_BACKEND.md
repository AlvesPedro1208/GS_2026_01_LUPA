# Plano de Testes — LUPA

**Projeto:** LUPA — Leitura Urbana e Planejamento de Assentamentos  
**Módulo:** Backend — Gestão de Alertas  
**Programa:** LUPA-BACKEND  
**Versão da API:** Spring Boot 3.5 · `/api/alertas`

---

## Escopo

Este plano cobre os casos de teste do módulo de **Alertas**, exercitando os métodos de `AlertaService` e os endpoints REST equivalentes em `AlertaController`:

- `listar(boolean apenasAtivos)` → `GET /api/alertas`
- `buscarPorId(Long id)` → `GET /api/alertas/{id}`
- `resolver(Long id)` → `PUT /api/alertas/{id}/resolver`

### Pré-requisitos gerais

1. PostgreSQL ativo (`docker compose up -d` na pasta `backend/`).
2. API em execução (`./mvnw spring-boot:run`).
3. Flyway aplicado com seed (`V2__seed_data.sql`): 2 alertas ativos (`resolvido = false`).

**Autenticação:** não é necessária para os endpoints de alertas. A API permanece aberta no protótipo (`SecurityConfig` expõe apenas o codificador BCrypt, sem filtro de proteção nos endpoints). Os endpoints `POST /api/auth/register` e `POST /api/auth/login` existem para cadastro e validação de credenciais, mas não bloqueiam o acesso a `/api/alertas`.

> **Nota:** Os IDs `1` e `2` assumem banco vazio com seed padrão. Se o banco já contém dados, confirme os IDs reais com `GET /api/alertas?ativos=false` antes de executar os testes.

### Reset do banco

Vários casos alteram o estado dos alertas (resolução do id `1`) ou exigem os 2 alertas ativos do seed. **Reaplique o seed antes de cada caso que exija estado inicial limpo** — especialmente entre CT-002 e CT-005, que resolvem o mesmo alerta.

Na pasta `backend/`:

```bash
docker compose down -v && docker compose up -d
```

Aguarde o PostgreSQL ficar saudável (`docker compose ps`), reinicie a API se necessário (`./mvnw spring-boot:run`) e confirme o estado com:

```bash
curl -s http://localhost:8080/api/alertas
```

Deve retornar 2 alertas com `"resolvido": false` (ids `1` e `2`).

---

## Roteiro de testes

| Id                                                         | Atividade                                                                                                                      | Responsável      | Data prevista Início / Fim | Dependência                                                                                  |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------- | -------------------------- | -------------------------------------------------------------------------------------------- |
| [CT-LUPA-ALERTA-001](#caso-de-teste-1--ct-lupa-alerta-001) | Verificar que a listagem com filtro de ativos retorna apenas alertas não resolvidos, ordenados do mais recente ao mais antigo. | Leandro Cuminato | 08/06/2026 – 09/06/2026    | [Reset do banco](#reset-do-banco); executar após CT-003/004 e **antes** de CT-002/005        |
| [CT-LUPA-ALERTA-002](#caso-de-teste-2--ct-lupa-alerta-002) | Verificar que a listagem sem filtro de ativos retorna todos os alertas, inclusive os já resolvidos.                            | Leandro Cuminato | 08/06/2026 – 09/06/2026    | [Reset do banco](#reset-do-banco); após CT-001; reset obrigatório se CT-005 já executado     |
| [CT-LUPA-ALERTA-003](#caso-de-teste-3--ct-lupa-alerta-003) | Verificar que a busca por ID retorna corretamente os dados de um alerta existente.                                             | Leandro Cuminato | 08/06/2026 – 09/06/2026    | —                                                                                            |
| [CT-LUPA-ALERTA-004](#caso-de-teste-4--ct-lupa-alerta-004) | Verificar que a busca por ID inexistente lança exceção de recurso não encontrado (HTTP 404 na camada REST).                    | Leandro Cuminato | 08/06/2026 – 09/06/2026    | —                                                                                            |
| [CT-LUPA-ALERTA-005](#caso-de-teste-5--ct-lupa-alerta-005) | Verificar que a operação de resolver marca o alerta como tratado e persiste o estado no banco.                                 | Leandro Cuminato | 08/06/2026 – 09/06/2026    | [Reset do banco](#reset-do-banco); após CT-003/004; reset obrigatório se CT-002 já executado |

---

## Caso de teste 1 — CT-LUPA-ALERTA-001

| Campo                                | Valor                                                                                                                          |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| **Identificação**                    | CT-LUPA-ALERTA-001                                                                                                             |
| **Descrição de objetivo**            | Verificar que a listagem com filtro de ativos retorna apenas alertas não resolvidos, ordenados do mais recente ao mais antigo. |
| **Objeto avaliado**                  | LUPA-BACKEND — `AlertaService.listar(boolean apenasAtivos)` / `GET /api/alertas`                                               |
| **Preparação**                       | Garantir ambiente preparado de acordo com os pré-requisitos gerais.                                                            |
| **Massa de dados de entrada**        | `apenasAtivos = true` (padrão da API: `GET /api/alertas` ou `?ativos=true`)                                                    |
| **Massa de dados de saída esperada** | `List` com 2 elementos; todos com `resolvido = false`; ordem: id `2` (CRÍTICO) antes de id `1` (RISCO).                        |

| Procedimento de teste                                                                        | Resultado para cada passo                                                                       |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Passo 1 — Garantir ambiente preparado de acordo com os pré-requisitos.                       | PostgreSQL e API disponíveis; seed com 2 alertas ativos (`resolvido = false`).                  |
| Passo 2 — Executar o teste: `curl -s http://localhost:8080/api/alertas` (ou `?ativos=true`). | Resposta HTTP `200`; JSON array com tamanho `2`.                                                |
| Passo 3 — Validar o primeiro elemento da lista.                                              | `id = 2`, `nivel = "CRITICO"`, `comunidadeNome = "Comunidade Beira-Rio"`, `resolvido = false`.  |
| Passo 4 — Validar o segundo elemento da lista.                                               | `id = 1`, `nivel = "RISCO"`, `comunidadeNome = "Comunidade Jardim União"`, `resolvido = false`. |

---

## Caso de teste 2 — CT-LUPA-ALERTA-002

| Campo                                | Valor                                                                                               |
| ------------------------------------ | --------------------------------------------------------------------------------------------------- |
| **Identificação**                    | CT-LUPA-ALERTA-002                                                                                  |
| **Descrição de objetivo**            | Verificar que a listagem sem filtro de ativos retorna todos os alertas, inclusive os já resolvidos. |
| **Objeto avaliado**                  | LUPA-BACKEND — `AlertaService.listar(boolean apenasAtivos)` / `GET /api/alertas?ativos=false`       |
| **Preparação**                       | Garantir ambiente preparado de acordo com os pré-requisitos gerais.                                 |
| **Massa de dados de entrada**        | `apenasAtivos = false` (`GET /api/alertas?ativos=false`)                                            |
| **Massa de dados de saída esperada** | `List` com 2 elementos; id `1` com `resolvido = true`; id `2` com `resolvido = false`.              |

| Procedimento de test                                                                          | Resultado para cada passo                                                        |
| --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Passo 1 — Garantir ambiente preparado de acordo com os pré-requisitos.                        | PostgreSQL e API disponíveis; seed com 2 alertas ativos.                         |
| Passo 2 — Verificar estado inicial: `curl -s http://localhost:8080/api/alertas/1`.            | HTTP `200`; `"resolvido": false`, `"nivel": "RISCO"`.                            |
| Passo 3 — Resolver o alerta 1: `curl -s -X PUT http://localhost:8080/api/alertas/1/resolver`. | HTTP `200`; corpo com `"id": 1`, `"resolvido": true`.                            |
| Passo 4 — Listar apenas ativos: `curl -s http://localhost:8080/api/alertas`.                  | HTTP `200`; array com **1** elemento (`id = 2`); alerta `1` **não** aparece.     |
| Passo 5 — Listar todos: `curl -s "http://localhost:8080/api/alertas?ativos=false"`.           | HTTP `200`; array com **2** elementos.                                           |
| Passo 6 — Validar conteúdo da lista completa.                                                 | Alerta `id = 1` com `resolvido = true`; alerta `id = 2` com `resolvido = false`. |

---

## Caso de teste 3 — CT-LUPA-ALERTA-003

| Campo                                | Valor                                                                                                                          |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| **Identificação**                    | CT-LUPA-ALERTA-003                                                                                                             |
| **Descrição de objetivo**            | Verificar que a busca por ID retorna corretamente os dados de um alerta existente.                                             |
| **Objeto avaliado**                  | LUPA-BACKEND — `AlertaService.buscarPorId(Long id)` / `GET /api/alertas/{id}`                                                  |
| **Preparação**                       | Garantir ambiente preparado de acordo com os pré-requisitos gerais.                                                            |
| **Massa de dados de entrada**        | `id = 2`                                                                                                                       |
| **Massa de dados de saída esperada** | `AlertaResponse` com `id = 2`, `comunidadeId = 3`, `nivel = CRITICO`, `resolvido = false`, `mensagem` com os três motivos IoT. |

| Procedimento de test                                                     | Resultado para cada passo                                                                       |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Passo 1 — Garantir ambiente preparado de acordo com os pré-requisitos.   | PostgreSQL e API disponíveis; alertas id `1` e `2` existentes no banco.                         |
| Passo 2 — Executar busca: `curl -s http://localhost:8080/api/alertas/2`. | HTTP `200`; corpo JSON com um único objeto `AlertaResponse`.                                    |
| Passo 3 — Validar identificação e comunidade.                            | `"id": 2`, `"comunidadeId": 3`, `"comunidadeNome": "Comunidade Beira-Rio"`.                     |
| Passo 4 — Validar nível e status.                                        | `"nivel": "CRITICO"`, `"resolvido": false`.                                                     |
| Passo 5 — Validar mensagem.                                              | `mensagem` contém referências a temperatura (36.1°C), umidade (23.5%) e qualidade do ar (3913). |
| Passo 6 — Validar metadados.                                             | `"leituraId"` não nulo; `"criadoEm"` presente e com data/hora válida.                           |

---

## Caso de teste 4 — CT-LUPA-ALERTA-004

| Campo                                | Valor                                                                                                              |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| **Identificação**                    | CT-LUPA-ALERTA-004                                                                                                 |
| **Descrição de objetivo**            | Verificar que a busca por ID inexistente retorna erro padronizado (HTTP 404).                                      |
| **Objeto avaliado**                  | LUPA-BACKEND — `AlertaService.buscarPorId(Long id)` / `GET /api/alertas/{id}`                                      |
| **Preparação**                       | Garantir ambiente preparado de acordo com os pré-requisitos gerais.                                                |
| **Massa de dados de entrada**        | `id = 999`                                                                                                         |
| **Massa de dados de saída esperada** | `ResourceNotFoundException` → `ApiError` com `status = 404`, `message = "Alerta não encontrado(a) para o id 999"`. |

| Procedimento de test                                                                                    | Resultado para cada passo                                                            |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Passo 1 — Garantir ambiente preparado de acordo com os pré-requisitos.                                  | PostgreSQL e API disponíveis; não existe alerta com id `999`.                        |
| Passo 2 — Executar busca inválida: `curl -s -w "\n%{http_code}" http://localhost:8080/api/alertas/999`. | HTTP `404` (código de status na resposta).                                           |
| Passo 3 — Validar corpo de erro (`ApiError`).                                                           | `"status": 404`, `"error": "Not Found"`.                                             |
| Passo 4 — Validar mensagem de negócio.                                                                  | `"message": "Alerta não encontrado(a) para o id 999"`.                               |
| Passo 5 — Validar campos auxiliares do erro.                                                            | `"path": "/api/alertas/999"`; `"details": []` (lista vazia); `"timestamp"` presente. |

---

## Caso de teste 5 — CT-LUPA-ALERTA-005

| Campo                                | Valor                                                                                                                   |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| **Identificação**                    | CT-LUPA-ALERTA-005                                                                                                      |
| **Descrição de objetivo**            | Verificar que resolver marca o alerta como tratado e persiste o estado no banco.                                        |
| **Objeto avaliado**                  | LUPA-BACKEND — `AlertaService.resolver(Long id)` / `PUT /api/alertas/{id}/resolver`                                     |
| **Preparação**                       | Garantir ambiente preparado de acordo com os pré-requisitos gerais.                                                     |
| **Massa de dados de entrada**        | `id = 1`                                                                                                                |
| **Massa de dados de saída esperada** | `AlertaResponse` com `id = 1`, `resolvido = true`; demais campos inalterados; alerta não aparece em listagem de ativos. |

| Procedimento de test                                                                           | Resultado para cada passo                                                                                                          |
| ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Passo 1 — Garantir ambiente preparado de acordo com os pré-requisitos.                         | PostgreSQL e API disponíveis; alerta id `1` com `resolvido = false`.                                                               |
| Passo 2 — Verificar estado pré-resolução: `curl -s http://localhost:8080/api/alertas/1`.       | HTTP `200`; `"resolvido": false`, `"nivel": "RISCO"`, `"comunidadeId": 1`.                                                         |
| Passo 3 — Executar resolução: `curl -s -X PUT http://localhost:8080/api/alertas/1/resolver`.   | HTTP `200`; corpo JSON retornado.                                                                                                  |
| Passo 4 — Validar resposta da resolução.                                                       | `"id": 1`, `"resolvido": true`, `"nivel": "RISCO"`, `"comunidadeNome": "Comunidade Jardim União"` (campos de negócio preservados). |
| Passo 5 — Confirmar persistência: `curl -s http://localhost:8080/api/alertas/1`.               | HTTP `200`; `"resolvido": true` (estado persistido no banco).                                                                      |
| Passo 6 — Confirmar efeito na listagem de ativos: `curl -s http://localhost:8080/api/alertas`. | HTTP `200`; alerta `id = 1` **não** consta na lista; apenas alertas ativos restantes (ex.: id `2`).                                |
