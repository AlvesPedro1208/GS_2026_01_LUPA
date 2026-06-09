# LUPA — App Mobile (Parte 4)

Aplicativo mobile dos agentes de campo do LUPA, em **React Native + Expo (TypeScript)**.
Atende a **Parte 4** da FIAP Global Solution 2026/1 — equipe GateMinds.

## Stack

- **Expo SDK 51** · **React Native 0.74** · **TypeScript**
- **React Navigation** (stack de autenticação + bottom tabs)
- **expo-camera**, **expo-location**, **expo-image-picker**, **react-native-maps**
- **AsyncStorage** (sessão/login mockados)

## Telas (7)

Login · Cadastro · Dashboard (stats + mapa) · Registrar Ocorrência · Relatórios · Alertas · Perfil

## Integração com o backend (incremental)

O app começou 100% mockado. Estamos conectando-o **gradualmente** à API real (backend Spring Boot,
Partes 1 e 2) — sempre com **fallback automático** para o mock, de modo que o app **nunca quebra**
se o servidor estiver fora do ar.

| Tela | Estado da integração |
|------|----------------------|
| **Registrar Ocorrência** | ✅ **Conectada** — lê comunidades reais (`GET /api/comunidades`) e envia a ocorrência (`POST /api/ocorrencias`), com fallback local |
| Dashboard / Alertas / Relatórios / Auth | ⏳ mockados (próximos incrementos) |

Camada de integração isolada em:
- `src/config/apiConfig.ts` — descobre o endereço do backend automaticamente (Expo Go/simulador/emulador)
- `src/services/lupaApi.ts` — cliente `fetch` tipado da API real (sem dependências novas)

## Como rodar

### 1) Suba o backend (em outro terminal)
```bash
cd ../backend
docker compose up -d
./mvnw spring-boot:run     # API em http://localhost:8080
```

### 2) Rode o app
```bash
cd mobile
npm install          # se node_modules não estiver presente
npx expo start
```
Abra no **Expo Go** (celular), **simulador iOS** ou **emulador Android**.

> O endereço do backend é detectado automaticamente:
> - Celular físico (Expo Go) → IP da máquina na rede (mesmo do Metro)
> - Simulador iOS → `localhost:8080`
> - Emulador Android → `10.0.2.2:8080`
>
> Para forçar um endereço, edite `MANUAL_HOST` em `src/config/apiConfig.ts`.

## Teste rápido da integração

1. Backend rodando + dados de exemplo carregados (Flyway).
2. No app, aba **Registrar**: o topo deve mostrar **"Conectado ao servidor LUPA"** e listar as comunidades reais.
3. Selecione comunidade, tipo e descrição → **Enviar**.
4. O modal mostra **"Registrada no servidor LUPA"**.
5. Confirme a persistência: `curl http://localhost:8080/api/ocorrencias` (a nova ocorrência aparece).

Se o backend estiver offline, o banner mostra **"Servidor offline — será salvo localmente"** e o
envio cai no fallback, sem quebrar o app.

## Conta de demonstração (login mockado)

`joao@prefeitura.gov.br` / `senha123` — ou entre como **Visitante**.

## Credenciais e mapas

A chave do Google Maps em `app.json` é placeholder. No iOS o mapa usa OpenStreetMap/Apple; para o
mapa nativo do Google no Android, configure uma chave válida.
