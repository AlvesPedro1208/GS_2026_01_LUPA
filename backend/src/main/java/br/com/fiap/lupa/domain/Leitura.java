package br.com.fiap.lupa.domain;

import br.com.fiap.lupa.domain.enums.StatusLeitura;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Snapshot de uma leitura dos sensores IoT de uma comunidade, a cada ciclo (~15s).
 * Guarda os três valores medidos (temperatura, umidade e qualidade do ar) e o
 * {@link StatusLeitura} classificado pela regra de negócio.
 */
@Entity
@Table(name = "leitura")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Leitura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "comunidade_id", nullable = false)
    private Comunidade comunidade;

    /** Temperatura em °C (sensor DHT22). */
    @Column(nullable = false)
    private Double temperatura;

    /** Umidade relativa em % (sensor DHT22). */
    @Column(nullable = false)
    private Double umidade;

    /** Qualidade do ar — valor bruto do sensor MQ2 (gases/fumaça). */
    @Column(name = "qualidade_ar", nullable = false)
    private Integer qualidadeAr;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private StatusLeitura status;

    @Column(name = "registrado_em", nullable = false)
    private LocalDateTime registradoEm;

    @PrePersist
    void prePersist() {
        if (registradoEm == null) {
            registradoEm = LocalDateTime.now();
        }
    }
}
