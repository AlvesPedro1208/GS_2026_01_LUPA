# LUPA — Leitura Urbana e Planejamento de Assentamentos

**FIAP Global Solution 2026/1** · 3º ano de Engenharia de Software · Equipe **GateMinds**
Tema: **Economia Espacial** · **ODS 11 — Cidades e Comunidades Sustentáveis**

LUPA é uma plataforma que ajuda gestores públicos a monitorar o crescimento de assentamentos
informais (favelas) e a planejar infraestrutura de forma **preventiva**, cruzando imagens de
satélite, dados de campo de agentes (app mobile) e sensores IoT.

> **Para o professor:** este README é o ponto de partida. As seções
> [Pré-requisitos](#pré-requisitos) e [Como iniciar e testar](#como-iniciar-e-testar) trazem o
> passo a passo completo para rodar e avaliar o projeto.

---

## Cobertura das 6 partes da Global Solution

| # | Parte | Onde está | Status |
|---|-------|-----------|--------|
| 1 | **Banco de Dados** | [`database/`](database) (schema, seed, consultas) + [`docs/diagrama-er.md`](docs/diagrama-er.md) | ✅ |
| 2 | **API RESTful** | [`backend/`](backend) (Java + Spring Boot) | ✅ |
| 3 | **Plano de Testes** | testes automatizados em [`backend/`](backend) (JUnit + Testcontainers) + plano no PDF | ✅ |
| 4 | **Front-end Mobile** | [`mobile/`](mobile) (React Native + Expo, 7 telas) | ✅ |
| 5 | **Segurança** | login/cadastro com **hash BCrypt** no [`backend/`](backend) + app | ✅ |
| 6 | **IoT** | simulação no Wokwi (ESP32 + DHT22 + MQ2), integrada via `POST /api/leituras` | ✅ |

## Estrutura do repositório (monorepo)

```
GS_2026_01_LUPA/
├── backend/     # API REST (Java/Spring Boot) + Banco (Flyway) + Segurança (auth)
├── database/    # Entregável do Banco: schema.sql, seed.sql, consultas.sql
├── mobile/      # App mobile dos agentes (React Native + Expo)
├── docs/        # Diagrama ER, coleção Postman, screenshots do app
└── iot/         # Documentação/integração do IoT (simulação no Wokwi)
```

---

## Pré-requisitos

| Ferramenta | Para quê | Instalação (macOS) |
|------------|----------|--------------------|
| **Git** | clonar o repositório | já incluso no macOS |
| **Docker** | PostgreSQL e testes do backend | [Docker Desktop](https://www.docker.com/products/docker-desktop/) |
| **JDK 21** | rodar a API (backend) | `brew install openjdk@21` |
| **Node.js 18+** | rodar o app mobile | `brew install node` |
| **Watchman** | file-watcher do Metro (evita erro `EMFILE` no macOS) | `brew install watchman` |
| **Expo Go** (opcional) | testar no celular físico | App Store / Play Store |

> Maven **não** é necessário: o backend usa o wrapper `./mvnw`.
> Para o mobile no celular físico, use o app **Expo Go**; no computador, use um **simulador iOS/Android**.

---

## Como iniciar e testar

O projeto tem **dois componentes que rodam de forma independente**: o **backend** (API + Banco +
Segurança) e o **app mobile**. Use **dois terminais**.

### 1) Backend — API, Banco de Dados e Segurança

```bash
cd backend

# 1. Sobe o PostgreSQL em container
docker compose up -d

# 2. Aponta o Java 21 e roda a API
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
./mvnw spring-boot:run
```

Ao subir, o **Flyway** cria todo o schema e carrega dados de exemplo automaticamente, e um usuário
de demonstração é criado. A API fica em **http://localhost:8080**.

**Como testar o backend (3 opções):**

- **Swagger UI** (interface visual com todos os endpoints): **http://localhost:8080/swagger-ui.html**
- **Verificação rápida por linha de comando** (copie e cole em outro terminal):

  ```bash
  # Lista as comunidades monitoradas
  curl http://localhost:8080/api/comunidades

  # Segurança (Parte 5): cadastra usuário (senha vira hash BCrypt) e faz login
  curl -X POST http://localhost:8080/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"nome":"Professor","email":"prof@fiap.com","senha":"fiap123"}'

  curl -X POST http://localhost:8080/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"prof@fiap.com","senha":"fiap123"}'

  # IoT (Parte 6): envia uma leitura CRÍTICA -> classifica status e gera alerta automático
  curl -X POST http://localhost:8080/api/leituras \
    -H "Content-Type: application/json" \
    -d '{"comunidadeId":1,"temperatura":36.1,"umidade":23.5,"qualidadeAr":3913}'

  curl http://localhost:8080/api/alertas
  ```

- **Prova de que a senha é armazenada como hash** (não em texto puro):

  ```bash
  docker exec lupa-postgres psql -U lupa -d lupa -c "SELECT email, left(senha_hash,7) AS hash FROM usuario;"
  # senha_hash começa com $2a$10$...  (BCrypt)
  ```

**Testes automatizados (Parte 3):**

```bash
cd backend && ./mvnw test
```
Sobe um PostgreSQL real via Testcontainers, roda as migrations e valida a aplicação.

➡️ Detalhes completos de endpoints, segurança e exemplos: **[backend/README.md](backend/README.md)**
➡️ Modelo de dados e consultas SQL: **[database/README.md](database/README.md)** · **[docs/diagrama-er.md](docs/diagrama-er.md)**

### 2) App mobile (Parte 4)

> Mantenha o **backend rodando** (passo 1) para o app consumir a API real. Sem backend, o app
> continua funcionando com dados locais (fallback automático).

```bash
cd mobile

# 1. Instala as dependências (node_modules não vai para o Git)
npm install

# 2. Inicia o Expo
npx expo start
```

Depois, no terminal do Expo:

- Pressione **`i`** para abrir no **simulador iOS** (requer Xcode), ou
- Pressione **`a`** para abrir no **emulador Android** (requer Android Studio), ou
- Escaneie o **QR Code** com o app **Expo Go** no celular.

**Como testar o app:**

1. **Login** com a conta demo `joao@prefeitura.gov.br` / `senha123` (validado contra o **hash BCrypt** do backend), ou entre como **Visitante**.
2. **Senha errada** mostra "Email ou senha incorretos" (backend retorna 401).
3. **Cadastro** de um novo usuário cria de verdade no backend.
4. Aba **Registrar**: deve exibir 🟢 *"Conectado ao servidor LUPA"* e listar as comunidades reais; ao enviar uma ocorrência, ela é persistida via `POST /api/ocorrencias`.

> **Testando no celular físico:** o computador e o celular precisam estar na **mesma rede Wi-Fi**.
> Se o app não conectar, rode `REACT_NATIVE_PACKAGER_HOSTNAME=<IP_do_computador> npx expo start --lan`
> e escaneie o QR (não toque em um projeto "recente" na lista do Expo Go).

➡️ Detalhes do app, telas e integração: **[mobile/README.md](mobile/README.md)**

---

## Credenciais de demonstração

| Campo | Valor |
|-------|-------|
| E-mail | `joao@prefeitura.gov.br` |
| Senha | `senha123` |

---

## Como o IoT se conecta (Parte 6)

O dispositivo IoT (ESP32 + sensores **DHT22** e **MQ2**, simulado no **Wokwi**) monitora cada zona e
classifica leituras em **OK / RISCO / CRÍTICO** conforme os limiares:

| Sensor | Limiar | Significado |
|--------|--------|-------------|
| Temperatura (DHT22) | > 32 °C | Adensamento populacional |
| Umidade (DHT22) | < 30 % | Ausência de saneamento/água |
| Qualidade do ar (MQ2) | > 3800 | Queima de lixo / poluição |

O backend **reproduz essa mesma lógica** no endpoint `POST /api/leituras`: calcula o status e, quando
há alerta, gera automaticamente um registro de **Alerta** para a gestão pública.

---

## Documentação adicional

- **[backend/README.md](backend/README.md)** — endpoints, segurança e execução da API
- **[database/README.md](database/README.md)** — schema, seed e consultas SQL
- **[docs/diagrama-er.md](docs/diagrama-er.md)** — diagrama ER do banco
- **[docs/LUPA.postman_collection.json](docs)** — coleção Postman para testar a API
- **[docs/mobile-screenshots/](docs/mobile-screenshots)** — telas do app
- **[mobile/README.md](mobile/README.md)** — guia do app mobile

## Equipe

**GateMinds** — 3º ano de Engenharia de Software, FIAP.
Integrantes e RMs constam no documento PDF / arquivo `.txt` da entrega.
