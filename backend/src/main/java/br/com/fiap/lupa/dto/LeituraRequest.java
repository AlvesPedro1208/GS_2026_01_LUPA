package br.com.fiap.lupa.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

/**
 * Dados de entrada de uma leitura de sensores enviada pelo dispositivo IoT
 * (ou por um simulador). O {@code status} NÃO é informado: é calculado pelo
 * serviço a partir dos limiares de negócio.
 */
public record LeituraRequest(

        @NotNull(message = "comunidadeId é obrigatório")
        Long comunidadeId,

        @NotNull(message = "temperatura é obrigatória")
        Double temperatura,

        @NotNull(message = "umidade é obrigatória")
        @PositiveOrZero
        Double umidade,

        @NotNull(message = "qualidadeAr é obrigatória")
        @PositiveOrZero
        Integer qualidadeAr
) {
}
