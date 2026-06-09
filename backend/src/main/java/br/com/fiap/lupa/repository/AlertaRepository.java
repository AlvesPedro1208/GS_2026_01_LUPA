package br.com.fiap.lupa.repository;

import br.com.fiap.lupa.domain.Alerta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertaRepository extends JpaRepository<Alerta, Long> {

    List<Alerta> findByResolvidoFalseOrderByCriadoEmDesc();

    List<Alerta> findByComunidadeIdOrderByCriadoEmDesc(Long comunidadeId);
}
