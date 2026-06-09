package br.com.fiap.lupa.repository;

import br.com.fiap.lupa.domain.Comunidade;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ComunidadeRepository extends JpaRepository<Comunidade, Long> {

    boolean existsBySetorIgnoreCase(String setor);

    Optional<Comunidade> findBySetorIgnoreCase(String setor);
}
