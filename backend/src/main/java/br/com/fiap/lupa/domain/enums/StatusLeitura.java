package br.com.fiap.lupa.domain.enums;

/**
 * Classificação de risco de uma leitura, espelhando a lógica do dispositivo IoT (ESP32):
 * <ul>
 *   <li>{@code OK}      - nenhum limiar crítico ultrapassado (0 alertas);</li>
 *   <li>{@code RISCO}   - exatamente 1 limiar ultrapassado (1 alerta);</li>
 *   <li>{@code CRITICO} - 2 ou mais limiares ultrapassados simultaneamente.</li>
 * </ul>
 */
public enum StatusLeitura {
    OK,
    RISCO,
    CRITICO
}
