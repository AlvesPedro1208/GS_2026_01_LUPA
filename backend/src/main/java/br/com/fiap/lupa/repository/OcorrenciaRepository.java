package br.com.fiap.lupa.repository;

import br.com.fiap.lupa.domain.Ocorrencia;
import br.com.fiap.lupa.domain.enums.StatusOcorrencia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OcorrenciaRepository extends JpaRepository<Ocorrencia, Long> {

    List<Ocorrencia> findByComunidadeIdOrderByCriadoEmDesc(Long comunidadeId);

    List<Ocorrencia> findByStatusOrderByCriadoEmDesc(StatusOcorrencia status);
}
