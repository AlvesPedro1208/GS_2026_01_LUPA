package br.com.fiap.lupa.dto;

import br.com.fiap.lupa.domain.Alerta;
import br.com.fiap.lupa.domain.enums.StatusLeitura;

import java.time.LocalDateTime;

/** Representação de saída de um alerta gerado a partir de uma leitura. */
public record AlertaResponse(
        Long id,
        Long comunidadeId,
        String comunidadeNome,
        Long leituraId,
        StatusLeitura nivel,
        String mensagem,
        boolean resolvido,
        LocalDateTime criadoEm
) {
    public static AlertaResponse from(Alerta a) {
        return new AlertaResponse(
                a.getId(),
                a.getComunidade().getId(),
                a.getComunidade().getNome(),
                a.getLeitura().getId(),
                a.getNivel(),
                a.getMensagem(),
                a.isResolvido(),
                a.getCriadoEm()
        );
    }
}
