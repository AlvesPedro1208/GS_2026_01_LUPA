package br.com.fiap.lupa.service;

import br.com.fiap.lupa.domain.enums.StatusLeitura;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

/**
 * Replica, no backend, a lógica de classificação executada pelo dispositivo IoT
 * (ESP32). A cada leitura, conta quantos limiares críticos foram ultrapassados e
 * deriva o {@link StatusLeitura} e as mensagens de alerta correspondentes.
 *
 * <p>Limiares (contexto de favelas/assentamentos informais):</p>
 * <ul>
 *   <li>Temperatura &gt; 32°C  → adensamento populacional / estrutura inadequada;</li>
 *   <li>Umidade &lt; 30%       → ausência de saneamento e água encanada;</li>
 *   <li>Qualidade do ar &gt; 3800 → queima de lixo / poluição.</li>
 * </ul>
 */
@Component
public class ClassificadorLeitura {

    public static final double TEMP_CRITICA = 32.0;
    public static final double UMIDADE_CRITICA = 30.0;
    public static final int AR_CRITICO = 3800;

    /** Resultado da classificação: status + lista de alertas (motivos). */
    public record Resultado(StatusLeitura status, List<String> motivos) {
    }

    public Resultado classificar(double temperatura, double umidade, int qualidadeAr) {
        List<String> motivos = new ArrayList<>();

        if (temperatura > TEMP_CRITICA) {
            motivos.add("Temperatura %.1f°C acima de %.0f°C: adensamento populacional"
                    .formatted(temperatura, TEMP_CRITICA));
        }
        if (umidade < UMIDADE_CRITICA) {
            motivos.add("Umidade %.1f%% abaixo de %.0f%%: ausência de saneamento/água"
                    .formatted(umidade, UMIDADE_CRITICA));
        }
        if (qualidadeAr > AR_CRITICO) {
            motivos.add("Qualidade do ar %d acima de %d: queima de lixo/poluição"
                    .formatted(qualidadeAr, AR_CRITICO));
        }

        StatusLeitura status = switch (motivos.size()) {
            case 0 -> StatusLeitura.OK;
            case 1 -> StatusLeitura.RISCO;
            default -> StatusLeitura.CRITICO;
        };
        return new Resultado(status, motivos);
    }
}
