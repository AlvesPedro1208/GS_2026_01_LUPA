package br.com.fiap.lupa.dto;

import br.com.fiap.lupa.domain.Leitura;
import br.com.fiap.lupa.domain.enums.StatusLeitura;

import java.time.LocalDateTime;

/** Representação de saída de uma leitura, já com o status classificado. */
public record LeituraResponse(
        Long id,
        Long comunidadeId,
        String comunidadeNome,
        Double temperatura,
        Double umidade,
        Integer qualidadeAr,
        StatusLeitura status,
        LocalDateTime registradoEm
) {
    public static LeituraResponse from(Leitura l) {
        return new LeituraResponse(
                l.getId(),
                l.getComunidade().getId(),
                l.getComunidade().getNome(),
                l.getTemperatura(),
                l.getUmidade(),
                l.getQualidadeAr(),
                l.getStatus(),
                l.getRegistradoEm()
        );
    }
}
