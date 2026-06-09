package br.com.fiap.lupa.repository;

import br.com.fiap.lupa.domain.Leitura;
import br.com.fiap.lupa.domain.enums.StatusLeitura;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeituraRepository extends JpaRepository<Leitura, Long> {

    List<Leitura> findByComunidadeIdOrderByRegistradoEmDesc(Long comunidadeId);

    List<Leitura> findByStatusOrderByRegistradoEmDesc(StatusLeitura status);
}
