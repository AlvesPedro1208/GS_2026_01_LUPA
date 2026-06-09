# IoT — LUPA (Parte 6)

Pasta reservada para a **simulação/integração IoT** (Parte 6 da Global Solution).

Dispositivo ESP32 (simulado no Wokwi) com sensores **DHT22** (temperatura/umidade) e
**MQ2** (qualidade do ar), classificando cada zona em **OK / RISCO / CRÍTICO** e enviando
dados para o ThingSpeak.

Limiares: Temperatura > 32 °C · Umidade < 30 % · Qualidade do ar > 3800.

> O backend (`../backend`) reproduz essa lógica no endpoint `POST /api/leituras`, calculando
> o status e gerando alertas — ver [README do backend](../backend/README.md).
>
> Sugestão: adicionar aqui o `sketch.ino`, o `diagram.json` do Wokwi e os prints dos cenários.
