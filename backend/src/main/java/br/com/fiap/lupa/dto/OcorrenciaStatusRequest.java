package br.com.fiap.lupa.dto;

import br.com.fiap.lupa.domain.enums.StatusOcorrencia;
import jakarta.validation.constraints.NotNull;

/** Corpo para atualização do status de uma ocorrência (PUT). */
public record OcorrenciaStatusRequest(

        @NotNull(message = "status é obrigatório")
        StatusOcorrencia status
) {
}
