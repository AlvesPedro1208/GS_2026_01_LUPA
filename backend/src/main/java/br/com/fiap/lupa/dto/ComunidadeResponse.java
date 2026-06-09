package br.com.fiap.lupa.dto;

import br.com.fiap.lupa.domain.Comunidade;

import java.time.LocalDateTime;

/** Representação de saída de uma comunidade. */
public record ComunidadeResponse(
        Long id,
        String nome,
        String setor,
        String cidade,
        Double latitude,
        Double longitude,
        Integer populacaoEstimada,
        boolean areaRisco,
        LocalDateTime criadoEm
) {
    public static ComunidadeResponse from(Comunidade c) {
        return new ComunidadeResponse(
                c.getId(), c.getNome(), c.getSetor(), c.getCidade(),
                c.getLatitude(), c.getLongitude(), c.getPopulacaoEstimada(),
                c.isAreaRisco(), c.getCriadoEm()
        );
    }
}
