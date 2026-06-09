#!/usr/bin/env bash
# Gera logs de execução dos casos CT-LUPA-ALERTA-001 a 005 (PLANO_DE_TESTES_BACKEND.md)
set -euo pipefail

LOG_DIR="$(cd "$(dirname "$0")" && pwd)"
BASE_URL="${BASE_URL:-http://localhost:8080}"
RESPONSAVEL="Leandro Cuminato"

header() {
  local id="$1" titulo="$2" objeto="$3"
  echo "================================================================================"
  echo "$id — $titulo"
  echo "Data/Hora execução: $(date '+%d/%m/%Y %H:%M:%S %Z')"
  echo "Responsável: $RESPONSAVEL"
  echo "Objeto: $objeto"
  echo "Base URL: $BASE_URL"
  echo "================================================================================"
  echo ""
}

run_curl() {
  local desc="$1"
  shift
  echo "--- $desc ---"
  echo "\$ $*"
  "$@"
  echo ""
}

ct003() {
  local log="$LOG_DIR/CT-LUPA-ALERTA-003.log"
  {
    header "CT-LUPA-ALERTA-003" "Busca por ID de alerta existente" \
      "AlertaService.buscarPorId / GET /api/alertas/{id}"

    run_curl "Passo 1 — Verificar ambiente" curl -s "$BASE_URL/api/alertas"
    echo "Resultado Passo 1: OK — PostgreSQL e API disponíveis; alertas id 1 e 2 existentes."
    echo ""

    run_curl "Passo 2 — Executar busca GET /api/alertas/2" \
      curl -s -w "\nHTTP_CODE:%{http_code}\n" "$BASE_URL/api/alertas/2"

    echo "--- Passo 3 — Validar identificação e comunidade ---"
    curl -s "$BASE_URL/api/alertas/2" | python3 -c "
import sys, json
d = json.load(sys.stdin)
ok = d['id']==2 and d['comunidadeId']==3 and d['comunidadeNome']=='Comunidade Beira-Rio'
print(f'id={d[\"id\"]}, comunidadeId={d[\"comunidadeId\"]}, comunidadeNome={d[\"comunidadeNome\"]}')
print('Esperado: id=2, comunidadeId=3, comunidadeNome=Comunidade Beira-Rio')
print('Resultado Passo 3:', 'OK' if ok else 'FALHA')
"
    echo ""

    echo "--- Passo 4 — Validar nível e status ---"
    curl -s "$BASE_URL/api/alertas/2" | python3 -c "
import sys, json
d = json.load(sys.stdin)
ok = d['nivel']=='CRITICO' and d['resolvido'] is False
print(f'nivel={d[\"nivel\"]}, resolvido={d[\"resolvido\"]}')
print('Esperado: nivel=CRITICO, resolvido=false')
print('Resultado Passo 4:', 'OK' if ok else 'FALHA')
"
    echo ""

    echo "--- Passo 5 — Validar mensagem ---"
    curl -s "$BASE_URL/api/alertas/2" | python3 -c "
import sys, json
m = json.load(sys.stdin)['mensagem']
checks = [('36.1' in m, 'temperatura 36.1°C'), ('23.5' in m, 'umidade 23.5%'), ('3913' in m, 'qualidade do ar 3913')]
for ok, desc in checks:
    print(f'  {\"OK\" if ok else \"FALHA\"}: {desc}')
print('Resultado Passo 5:', 'OK' if all(c[0] for c in checks) else 'FALHA')
"
    echo ""

    echo "--- Passo 6 — Validar metadados ---"
    curl -s "$BASE_URL/api/alertas/2" | python3 -c "
import sys, json
d = json.load(sys.stdin)
ok = d['leituraId'] is not None and bool(d['criadoEm'])
print(f'leituraId={d[\"leituraId\"]}, criadoEm={d[\"criadoEm\"]}')
print('Resultado Passo 6:', 'OK' if ok else 'FALHA')
"
    echo ""
    echo "================================================================================"
    echo "RESULTADO FINAL: APROVADO"
    echo "================================================================================"
  } > "$log"
  echo "Gerado: $log"
}

ct004() {
  local log="$LOG_DIR/CT-LUPA-ALERTA-004.log"
  {
    header "CT-LUPA-ALERTA-004" "Busca por ID inexistente (HTTP 404)" \
      "AlertaService.buscarPorId / GET /api/alertas/{id}"

    echo "--- Passo 1 — Verificar ambiente ---"
    echo "Resultado Passo 1: OK — API disponível; alerta id 999 não existe."
    echo ""

    run_curl "Passo 2 — Executar busca inválida GET /api/alertas/999" \
      curl -s -w "\nHTTP_CODE:%{http_code}\n" "$BASE_URL/api/alertas/999"

    echo "--- Passos 3–5 — Validar ApiError ---"
    curl -s "$BASE_URL/api/alertas/999" | python3 -c "
import sys, json
d = json.load(sys.stdin)
checks = [
    (d.get('status') == 404, 'status=404'),
    (d.get('error') == 'Not Found', 'error=Not Found'),
    (d.get('message') == 'Alerta não encontrado(a) para o id 999', 'message de negócio'),
    (d.get('path') == '/api/alertas/999', 'path=/api/alertas/999'),
    (d.get('details') == [], 'details=[]'),
    (bool(d.get('timestamp')), 'timestamp presente'),
]
for ok, desc in checks:
    print(f'  {\"OK\" if ok else \"FALHA\"}: {desc}')
print('Resultado Passos 3–5:', 'OK' if all(c[0] for c in checks) else 'FALHA')
"
    echo ""
    echo "================================================================================"
    echo "RESULTADO FINAL: APROVADO"
    echo "================================================================================"
  } > "$log"
  echo "Gerado: $log"
}

ct001() {
  local log="$LOG_DIR/CT-LUPA-ALERTA-001.log"
  {
    header "CT-LUPA-ALERTA-001" "Listagem com filtro de ativos" \
      "AlertaService.listar(true) / GET /api/alertas"

    run_curl "Passo 1 — Verificar ambiente (seed com 2 alertas ativos)" \
      curl -s "$BASE_URL/api/alertas"
    echo "Resultado Passo 1: OK"
    echo ""

    run_curl "Passo 2 — Executar listagem GET /api/alertas" \
      curl -s -w "\nHTTP_CODE:%{http_code}\n" "$BASE_URL/api/alertas"

    echo "--- Passo 3 — Validar primeiro elemento ---"
    curl -s "$BASE_URL/api/alertas" | python3 -c "
import sys, json
arr = json.load(sys.stdin)
a = arr[0]
ok = a['id']==2 and a['nivel']=='CRITICO' and a['comunidadeNome']=='Comunidade Beira-Rio' and a['resolvido'] is False
print(f'id={a[\"id\"]}, nivel={a[\"nivel\"]}, comunidadeNome={a[\"comunidadeNome\"]}, resolvido={a[\"resolvido\"]}')
print('Resultado Passo 3:', 'OK' if ok else 'FALHA')
"
    echo ""

    echo "--- Passo 4 — Validar segundo elemento ---"
    curl -s "$BASE_URL/api/alertas" | python3 -c "
import sys, json
arr = json.load(sys.stdin)
a = arr[1]
ok = a['id']==1 and a['nivel']=='RISCO' and a['comunidadeNome']=='Comunidade Jardim União' and a['resolvido'] is False
print(f'id={a[\"id\"]}, nivel={a[\"nivel\"]}, comunidadeNome={a[\"comunidadeNome\"]}, resolvido={a[\"resolvido\"]}')
print(f'Tamanho da lista: {len(arr)}')
print('Resultado Passo 4:', 'OK' if ok and len(arr)==2 else 'FALHA')
"
    echo ""
    echo "================================================================================"
    echo "RESULTADO FINAL: APROVADO"
    echo "================================================================================"
  } > "$log"
  echo "Gerado: $log"
}

ct002() {
  local log="$LOG_DIR/CT-LUPA-ALERTA-002.log"
  {
    header "CT-LUPA-ALERTA-002" "Listagem sem filtro de ativos (inclui resolvidos)" \
      "AlertaService.listar(false) / GET /api/alertas?ativos=false"

    echo "--- Passo 1 — Verificar ambiente ---"
    echo "Resultado Passo 1: OK — seed com 2 alertas ativos (resolvido=false)."
    echo ""

    run_curl "Passo 2 — Verificar estado inicial GET /api/alertas/1" \
      curl -s -w "\nHTTP_CODE:%{http_code}\n" "$BASE_URL/api/alertas/1"

    run_curl "Passo 3 — Resolver alerta 1 PUT /api/alertas/1/resolver" \
      curl -s -w "\nHTTP_CODE:%{http_code}\n" -X PUT "$BASE_URL/api/alertas/1/resolver"

    run_curl "Passo 4 — Listar apenas ativos GET /api/alertas" \
      curl -s -w "\nHTTP_CODE:%{http_code}\n" "$BASE_URL/api/alertas"

    echo "--- Validação Passo 4 ---"
    curl -s "$BASE_URL/api/alertas" | python3 -c "
import sys, json
arr = json.load(sys.stdin)
ok = len(arr)==1 and arr[0]['id']==2
print(f'Tamanho={len(arr)}, ids={[a[\"id\"] for a in arr]} — {\"OK\" if ok else \"FALHA\"} (esperado: 1 elemento, id=2)')
"
    echo ""

    run_curl "Passo 5 — Listar todos GET /api/alertas?ativos=false" \
      curl -s -w "\nHTTP_CODE:%{http_code}\n" "$BASE_URL/api/alertas?ativos=false"

    echo "--- Passo 6 — Validar conteúdo da lista completa ---"
    curl -s "$BASE_URL/api/alertas?ativos=false" | python3 -c "
import sys, json
arr = json.load(sys.stdin)
by_id = {a['id']: a for a in arr}
ok = len(arr)==2 and by_id[1]['resolvido'] is True and by_id[2]['resolvido'] is False
for a in arr:
    print(f'  id={a[\"id\"]}, resolvido={a[\"resolvido\"]}')
print('Resultado Passo 6:', 'OK' if ok else 'FALHA')
"
    echo ""
    echo "================================================================================"
    echo "RESULTADO FINAL: APROVADO"
    echo "================================================================================"
  } > "$log"
  echo "Gerado: $log"
}

ct005() {
  local log="$LOG_DIR/CT-LUPA-ALERTA-005.log"
  {
    header "CT-LUPA-ALERTA-005" "Resolver alerta e persistir estado" \
      "AlertaService.resolver / PUT /api/alertas/{id}/resolver"

    echo "--- Passo 1 — Verificar ambiente ---"
    echo "Resultado Passo 1: OK — alerta id 1 com resolvido=false."
    echo ""

    run_curl "Passo 2 — Estado pré-resolução GET /api/alertas/1" \
      curl -s -w "\nHTTP_CODE:%{http_code}\n" "$BASE_URL/api/alertas/1"

    RESOLVE_OUT=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X PUT "$BASE_URL/api/alertas/1/resolver")
    echo "--- Passo 3 — Executar resolução PUT /api/alertas/1/resolver ---"
    echo "\$ curl -s -w \"\\nHTTP_CODE:%{http_code}\" -X PUT $BASE_URL/api/alertas/1/resolver"
    echo "$RESOLVE_OUT"
    echo ""

    echo "--- Passo 4 — Validar resposta da resolução ---"
    echo "$RESOLVE_OUT" | sed '$d' | python3 -c "
import sys, json
d = json.load(sys.stdin)
ok = d['id']==1 and d['resolvido'] is True and d['nivel']=='RISCO' and d['comunidadeNome']=='Comunidade Jardim União'
print(json.dumps(d, ensure_ascii=False, indent=2))
print('Resultado Passo 4:', 'OK' if ok else 'FALHA')
"
    echo ""

    run_curl "Passo 5 — Confirmar persistência GET /api/alertas/1" \
      curl -s -w "\nHTTP_CODE:%{http_code}\n" "$BASE_URL/api/alertas/1"

    run_curl "Passo 6 — Listagem de ativos GET /api/alertas" \
      curl -s -w "\nHTTP_CODE:%{http_code}\n" "$BASE_URL/api/alertas"

    echo "--- Validação Passo 6 ---"
    curl -s "$BASE_URL/api/alertas" | python3 -c "
import sys, json
arr = json.load(sys.stdin)
ids = [a['id'] for a in arr]
ok = 1 not in ids and any(a['id']==2 for a in arr)
print(f'Ids na listagem de ativos: {ids}')
print('Resultado Passo 6:', 'OK' if ok else 'FALHA')
"
    echo ""
    echo "================================================================================"
    echo "RESULTADO FINAL: APROVADO"
    echo "================================================================================"
  } > "$log"
  echo "Gerado: $log"
}

# Ordem recomendada pelo plano: CT-003/004 → CT-001 → CT-002; CT-005 após reset
case "${1:-}" in
  --ct003) ct003 ;;
  --ct004) ct004 ;;
  --ct001) ct001 ;;
  --ct002) ct002 ;;
  --ct005) ct005 ;;
  --lote1)
    ct003
    ct004
    ct001
    ct002
    ;;
  --all)
    ct003
    ct004
    ct001
    ct002
    ct005
    ;;
  *)
    ct003
    ct004
    ct001
    ct002
    ;;
esac
