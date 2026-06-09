package br.com.fiap.lupa.dto;

import br.com.fiap.lupa.domain.enums.TipoOcorrencia;
import jakarta.validation.constraints.*;

/** Dados de entrada para registrar uma ocorrência de campo. */
public record OcorrenciaRequest(

        @NotNull(message = "comunidadeId é obrigatório")
        Long comunidadeId,

        @NotNull(message = "agenteId é obrigatório")
        Long agenteId,

        @NotNull(message = "tipo é obrigatório")
        TipoOcorrencia tipo,

        @NotBlank(message = "descricao é obrigatória")
        @Size(max = 500)
        String descricao,

        @DecimalMin("-90.0") @DecimalMax("90.0")
        Double latitude,

        @DecimalMin("-180.0") @DecimalMax("180.0")
        Double longitude,

        @Size(max = 300)
        String fotoUrl
) {
}
