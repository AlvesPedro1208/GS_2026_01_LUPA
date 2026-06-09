package br.com.fiap.lupa.service;

import br.com.fiap.lupa.domain.enums.StatusLeitura;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Testes unitários da regra de classificação (sem banco), cobrindo os três
 * cenários documentados do IoT.
 */
class ClassificadorLeituraTest {

    private final ClassificadorLeitura classificador = new ClassificadorLeitura();

    @Test
    @DisplayName("Cenário OK: nenhum limiar ultrapassado")
    void deveClassificarComoOk() {
        var r = classificador.classificar(26.7, 70.0, 3628);
        assertThat(r.status()).isEqualTo(StatusLeitura.OK);
        assertThat(r.motivos()).isEmpty();
    }

    @Test
    @DisplayName("Cenário RISCO: apenas temperatura acima do limiar")
    void deveClassificarComoRisco() {
        var r = classificador.classificar(34.4, 70.0, 3628);
        assertThat(r.status()).isEqualTo(StatusLeitura.RISCO);
        assertThat(r.motivos()).hasSize(1);
    }

    @Test
    @DisplayName("Cenário CRÍTICO: três limiares ultrapassados")
    void deveClassificarComoCritico() {
        var r = classificador.classificar(36.1, 23.5, 3913);
        assertThat(r.status()).isEqualTo(StatusLeitura.CRITICO);
        assertThat(r.motivos()).hasSize(3);
    }
}
