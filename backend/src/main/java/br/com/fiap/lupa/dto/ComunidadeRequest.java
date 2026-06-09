package br.com.fiap.lupa.dto;

import jakarta.validation.constraints.*;

/** Dados de entrada para criar/atualizar uma comunidade. */
public record ComunidadeRequest(

        @NotBlank(message = "nome é obrigatório")
        @Size(max = 120)
        String nome,

        @NotBlank(message = "setor é obrigatório")
        @Size(max = 60)
        String setor,

        @Size(max = 120)
        String cidade,

        @DecimalMin(value = "-90.0") @DecimalMax(value = "90.0")
        Double latitude,

        @DecimalMin(value = "-180.0") @DecimalMax(value = "180.0")
        Double longitude,

        @PositiveOrZero(message = "populacaoEstimada não pode ser negativa")
        Integer populacaoEstimada,

        boolean areaRisco
) {
}
