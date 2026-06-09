package br.com.fiap.lupa.domain;

import br.com.fiap.lupa.domain.enums.StatusLeitura;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Alerta gerado automaticamente a partir de uma {@link Leitura} cujo status
 * ficou diferente de OK. Descreve quais limiares foram ultrapassados e serve
 * de base para as ações recomendadas (Defesa Civil, Saúde, Saneamento).
 */
@Entity
@Table(name = "alerta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alerta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "comunidade_id", nullable = false)
    private Comunidade comunidade;

    /** Leitura que originou o alerta (relação 1:1). */
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "leitura_id", nullable = false, unique = true)
    private Leitura leitura;

    /** Nível do alerta = status da leitura que o originou (RISCO ou CRITICO). */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private StatusLeitura nivel;

    @Column(nullable = false, length = 500)
    private String mensagem;

    /** Indica se o alerta já foi tratado/baixado por um gestor. */
    @Column(nullable = false)
    private boolean resolvido;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    void prePersist() {
        if (criadoEm == null) {
            criadoEm = LocalDateTime.now();
        }
    }
}
