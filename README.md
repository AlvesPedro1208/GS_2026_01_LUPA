# LUPA — Leitura Urbana e Planejamento de Assentamentos

**FIAP Global Solution 2026/1** · 3º ano Engenharia de Software · Equipe **GateMinds**
Tema: Economia Espacial · **ODS 11 — Cidades e Comunidades Sustentáveis**

LUPA é uma plataforma que ajuda gestores públicos a monitorar o crescimento de
assentamentos informais (favelas) e a planejar infraestrutura de forma **preventiva**,
cruzando imagens de satélite, dados de campo de agentes (app mobile) e sensores IoT.

## Estrutura do repositório (monorepo)

| Pasta | Conteúdo | Parte da GS | Status |
|-------|----------|-------------|--------|
| [`backend/`](backend) | API REST (Java + Spring Boot) | **2 — Serviços (API)** | ✅ |
| [`database/`](database) | Schema `.sql`, seed e consultas | **1 — Banco de Dados** | ✅ |
| [`docs/`](docs) | Diagrama ER e documentação | — | ✅ |
| `mobile/` | App mobile dos agentes | 4 — Front-end Mobile | ⏳ reservado |
| `iot/` | Sketch ESP32 (Wokwi) / simulação | 6 — IoT | ⏳ reservado |

> As partes 1 e 2 (Banco de Dados e API) já estão implementadas neste repositório.
> As demais pastas estão reservadas para as entregas dos outros integrantes da equipe.

## Backend (Partes 1 e 2)

- **Stack:** Java 21 · Spring Boot 3.5 · Spring Data JPA · PostgreSQL · Flyway · Swagger
- **5 entidades:** Comunidade, Agente, Leitura, Ocorrência, Alerta
- **API REST** com camadas Controller → Service → Repository e documentação Swagger

```bash
cd backend
docker compose up -d          # PostgreSQL
./mvnw spring-boot:run        # API em http://localhost:8080
```

Swagger UI: **http://localhost:8080/swagger-ui.html**

Detalhes de execução, endpoints e exemplos: **[backend/README.md](backend/README.md)**.
Modelo de dados e consultas: **[database/README.md](database/README.md)** e **[docs/diagrama-er.md](docs/diagrama-er.md)**.

## Integração com o IoT

O dispositivo IoT (ESP32 + sensores DHT22 e MQ2, simulado no Wokwi) monitora cada zona e
classifica leituras em **OK / RISCO / CRÍTICO** conforme os limiares:

| Sensor | Limiar | Significado |
|--------|--------|-------------|
| Temperatura (DHT22) | > 32 °C | Adensamento populacional |
| Umidade (DHT22) | < 30 % | Ausência de saneamento/água |
| Qualidade do ar (MQ2) | > 3800 | Queima de lixo / poluição |

O backend reproduz essa lógica no endpoint `POST /api/leituras`: classifica o status e,
quando há alerta, gera automaticamente um registro de **Alerta** para a gestão pública.

## Equipe

GateMinds — 3º ano de Engenharia de Software, FIAP.
