package br.com.fiap.lupa.repository;

import br.com.fiap.lupa.domain.Agente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgenteRepository extends JpaRepository<Agente, Long> {

    boolean existsByMatricula(String matricula);

    boolean existsByEmail(String email);
}
