package br.com.fiap.lupa.dto;

import br.com.fiap.lupa.domain.Agente;

import java.time.LocalDateTime;

/** Representação de saída de um agente de campo. */
public record AgenteResponse(
        Long id,
        String nome,
        String matricula,
        String email,
        String orgao,
        LocalDateTime criadoEm
) {
    public static AgenteResponse from(Agente a) {
        return new AgenteResponse(a.getId(), a.getNome(), a.getMatricula(),
                a.getEmail(), a.getOrgao(), a.getCriadoEm());
    }
}
