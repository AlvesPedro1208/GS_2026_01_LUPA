package br.com.fiap.lupa.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Comunidade / assentamento informal monitorado pelo LUPA.
 * É a entidade central: agrega leituras de sensores, ocorrências e alertas.
 */
@Entity
@Table(name = "comunidade")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comunidade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nome;

    /** Identificador do setor monitorado (ex.: "Setor_A"), igual ao usado no dispositivo IoT. */
    @Column(nullable = false, length = 60)
    private String setor;

    @Column(length = 120)
    private String cidade;

    private Double latitude;

    private Double longitude;

    @Column(name = "populacao_estimada")
    private Integer populacaoEstimada;

    /** Indica se a comunidade está em área de risco (encosta, margem de rio, etc.). */
    @Column(name = "area_risco", nullable = false)
    private boolean areaRisco;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    void prePersist() {
        if (criadoEm == null) {
            criadoEm = LocalDateTime.now();
        }
    }
}
