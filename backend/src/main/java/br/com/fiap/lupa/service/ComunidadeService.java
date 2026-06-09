package br.com.fiap.lupa.service;

import br.com.fiap.lupa.domain.Comunidade;
import br.com.fiap.lupa.dto.ComunidadeRequest;
import br.com.fiap.lupa.dto.ComunidadeResponse;
import br.com.fiap.lupa.exception.BusinessException;
import br.com.fiap.lupa.exception.ResourceNotFoundException;
import br.com.fiap.lupa.repository.ComunidadeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ComunidadeService {

    private final ComunidadeRepository repository;

    public ComunidadeService(ComunidadeRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<ComunidadeResponse> listar() {
        return repository.findAll().stream().map(ComunidadeResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public ComunidadeResponse buscarPorId(Long id) {
        return ComunidadeResponse.from(buscarEntidade(id));
    }

    @Transactional
    public ComunidadeResponse criar(ComunidadeRequest req) {
        if (repository.existsBySetorIgnoreCase(req.setor())) {
            throw new BusinessException("Já existe uma comunidade com o setor '%s'".formatted(req.setor()));
        }
        Comunidade c = Comunidade.builder()
                .nome(req.nome())
                .setor(req.setor())
                .cidade(req.cidade())
                .latitude(req.latitude())
                .longitude(req.longitude())
                .populacaoEstimada(req.populacaoEstimada())
                .areaRisco(req.areaRisco())
                .build();
        return ComunidadeResponse.from(repository.save(c));
    }

    @Transactional
    public ComunidadeResponse atualizar(Long id, ComunidadeRequest req) {
        Comunidade c = buscarEntidade(id);
        repository.findBySetorIgnoreCase(req.setor())
                .filter(outra -> !outra.getId().equals(id))
                .ifPresent(outra -> {
                    throw new BusinessException("Já existe outra comunidade com o setor '%s'".formatted(req.setor()));
                });
        c.setNome(req.nome());
        c.setSetor(req.setor());
        c.setCidade(req.cidade());
        c.setLatitude(req.latitude());
        c.setLongitude(req.longitude());
        c.setPopulacaoEstimada(req.populacaoEstimada());
        c.setAreaRisco(req.areaRisco());
        return ComunidadeResponse.from(repository.save(c));
    }

    @Transactional
    public void excluir(Long id) {
        Comunidade c = buscarEntidade(id);
        repository.delete(c);
    }

    /** Uso interno por outros serviços. */
    @Transactional(readOnly = true)
    public Comunidade buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comunidade", id));
    }
}
