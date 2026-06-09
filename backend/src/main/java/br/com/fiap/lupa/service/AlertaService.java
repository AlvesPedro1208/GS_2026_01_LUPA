package br.com.fiap.lupa.service;

import br.com.fiap.lupa.domain.Alerta;
import br.com.fiap.lupa.dto.AlertaResponse;
import br.com.fiap.lupa.exception.ResourceNotFoundException;
import br.com.fiap.lupa.repository.AlertaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AlertaService {

    private final AlertaRepository repository;

    public AlertaService(AlertaRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<AlertaResponse> listar(boolean apenasAtivos) {
        List<Alerta> alertas = apenasAtivos
                ? repository.findByResolvidoFalseOrderByCriadoEmDesc()
                : repository.findAll();
        return alertas.stream().map(AlertaResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public AlertaResponse buscarPorId(Long id) {
        return AlertaResponse.from(buscarEntidade(id));
    }

    /** Marca um alerta como tratado/baixado por um gestor. */
    @Transactional
    public AlertaResponse resolver(Long id) {
        Alerta a = buscarEntidade(id);
        a.setResolvido(true);
        return AlertaResponse.from(repository.save(a));
    }

    private Alerta buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alerta", id));
    }
}
