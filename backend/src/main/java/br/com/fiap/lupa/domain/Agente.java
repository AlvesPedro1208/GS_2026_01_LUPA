package br.com.fiap.lupa.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Agente público de campo que registra ocorrências através do aplicativo mobile.
 */
@Entity
@Table(name = "agente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Agente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nome;

    /** Matrícula funcional do agente (única). */
    @Column(nullable = false, unique = true, length = 30)
    private String matricula;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(length = 80)
    private String orgao;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    void prePersist() {
        if (criadoEm == null) {
            criadoEm = LocalDateTime.now();
        }
    }
}
