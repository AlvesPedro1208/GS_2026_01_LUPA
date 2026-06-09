package br.com.fiap.lupa.dto;

import br.com.fiap.lupa.domain.Ocorrencia;
import br.com.fiap.lupa.domain.enums.StatusOcorrencia;
import br.com.fiap.lupa.domain.enums.TipoOcorrencia;

import java.time.LocalDateTime;

/** Representação de saída de uma ocorrência. */
public record OcorrenciaResponse(
        Long id,
        Long comunidadeId,
        String comunidadeNome,
        Long agenteId,
        String agenteNome,
        TipoOcorrencia tipo,
        String descricao,
        Double latitude,
        Double longitude,
        String fotoUrl,
        StatusOcorrencia status,
        LocalDateTime criadoEm
) {
    public static OcorrenciaResponse from(Ocorrencia o) {
        return new OcorrenciaResponse(
                o.getId(),
                o.getComunidade().getId(),
                o.getComunidade().getNome(),
                o.getAgente().getId(),
                o.getAgente().getNome(),
                o.getTipo(),
                o.getDescricao(),
                o.getLatitude(),
                o.getLongitude(),
                o.getFotoUrl(),
                o.getStatus(),
                o.getCriadoEm()
        );
    }
}
