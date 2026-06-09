# LUPA — Backend (Banco de Dados + API)

API REST do projeto **LUPA — Leitura Urbana e Planejamento de Assentamentos**.
Cobre as **Partes 1 (Banco de Dados)** e **2 (API RESTful)** da FIAP Global Solution 2026/1 — equipe **GateMinds**.

## Stack

- **Java 21** + **Spring Boot 3.5**
- **Spring Web** (REST) · **Spring Data JPA** (Hibernate) · **Bean Validation**
- **PostgreSQL** + **Flyway** (versionamento do schema)
- **springdoc-openapi** (Swagger UI)
- **Testes:** JUnit 5 + Testcontainers (PostgreSQL real via Docker)
- Arquitetura em camadas: **Controller → Service → Repository**

## Pré-requisitos

- JDK 21 (`brew install openjdk@21`)
- Docker (para o PostgreSQL e os testes com Testcontainers)
- Maven não é necessário: use o wrapper `./mvnw`

## Como rodar

```bash
# 1. Suba o PostgreSQL
docker compose up -d

# 2. Rode a aplicação (Flyway cria o schema e carrega os dados de exemplo)
export JAVA_HOME=$(/usr/libexec/java_home -v 21)   # ou aponte para o openjdk@21
./mvnw spring-boot:run
```

A API sobe em `http://localhost:8080`.

| Recurso | URL |
|---------|-----|
| **Swagger UI** | http://localhost:8080/swagger-ui.html |
| **OpenAPI JSON** | http://localhost:8080/v3/api-docs |

### Configuração (variáveis de ambiente)

| Variável | Padrão |
|----------|--------|
| `DB_URL` | `jdbc:postgresql://localhost:5432/lupa` |
| `DB_USER` | `lupa` |
| `DB_PASSWORD` | `lupa` |
| `SERVER_PORT` | `8080` |

## Testes

```bash
./mvnw test
```

- `ClassificadorLeituraTest` — unitário, valida os 3 cenários (OK/RISCO/CRÍTICO).
- `LupaBackendApplicationTests` — integração: sobe PostgreSQL via Testcontainers,
  roda as migrations e valida o contexto Spring + mapeamento JPA.

## Endpoints

Base: `/api`

### Comunidades — `/api/comunidades`
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/comunidades` | Lista todas |
| GET | `/api/comunidades/{id}` | Busca por id |
| POST | `/api/comunidades` | Cria |
| PUT | `/api/comunidades/{id}` | Atualiza |
| DELETE | `/api/comunidades/{id}` | Remove |

### Agentes — `/api/agentes`
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/agentes` | Lista todos |
| GET | `/api/agentes/{id}` | Busca por id |
| POST | `/api/agentes` | Cria |
| PUT | `/api/agentes/{id}` | Atualiza |
| DELETE | `/api/agentes/{id}` | Remove |

### Leituras (IoT) — `/api/leituras`
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/leituras` | Lista (filtro `?comunidadeId=`) |
| GET | `/api/leituras/{id}` | Busca por id |
| POST | `/api/leituras` | Registra leitura; **calcula o status e gera alerta** automaticamente |

### Ocorrências — `/api/ocorrencias`
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/ocorrencias` | Lista (filtro `?comunidadeId=`) |
| GET | `/api/ocorrencias/{id}` | Busca por id |
| POST | `/api/ocorrencias` | Registra ocorrência de campo |
| PUT | `/api/ocorrencias/{id}/status` | Atualiza status |
| DELETE | `/api/ocorrencias/{id}` | Remove |

### Alertas — `/api/alertas`
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/alertas` | Lista (padrão só ativos; `?ativos=false` para todos) |
| GET | `/api/alertas/{id}` | Busca por id |
| PUT | `/api/alertas/{id}/resolver` | Marca como resolvido |

## Exemplos (curl)

```bash
# Listar comunidades
curl http://localhost:8080/api/comunidades

# Registrar uma leitura CRÍTICA -> gera alerta automaticamente
curl -X POST http://localhost:8080/api/leituras \
  -H "Content-Type: application/json" \
  -d '{"comunidadeId":1,"temperatura":36.1,"umidade":23.5,"qualidadeAr":3913}'

# Ver alertas ativos
curl http://localhost:8080/api/alertas
```

## Estrutura

```
backend/
├── docker-compose.yml          # PostgreSQL local
├── pom.xml
└── src/main/
    ├── java/br/com/fiap/lupa/
    │   ├── config/             # OpenAPI/Swagger
    │   ├── controller/         # camada REST
    │   ├── domain/             # entidades JPA + enums
    │   ├── dto/                # records de entrada/saída
    │   ├── exception/          # tratamento global de erros
    │   ├── repository/         # Spring Data JPA
    │   └── service/            # regras de negócio
    └── resources/
        ├── application.yml
        └── db/migration/       # Flyway: V1 schema, V2 seed
```
