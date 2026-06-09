package br.com.fiap.lupa.domain;

import br.com.fiap.lupa.domain.enums.StatusOcorrencia;
import br.com.fiap.lupa.domain.enums.TipoOcorrencia;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Ocorrência registrada em campo por um {@link Agente} em uma {@link Comunidade}
 * (ex.: falta de água, esgoto a céu aberto, risco de deslizamento).
 */
@Entity
@Table(name = "ocorrencia")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ocorrencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "comunidade_id", nullable = false)
    private Comunidade comunidade;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "agente_id", nullable = false)
    private Agente agente;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TipoOcorrencia tipo;

    @Column(nullable = false, length = 500)
    private String descricao;

    private Double latitude;

    private Double longitude;

    /** URL da foto anexada pelo agente (mockada nesta fase). */
    @Column(name = "foto_url", length = 300)
    private String fotoUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private StatusOcorrencia status;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    void prePersist() {
        if (criadoEm == null) {
            criadoEm = LocalDateTime.now();
        }
        if (status == null) {
            status = StatusOcorrencia.ABERTA;
        }
    }
}
