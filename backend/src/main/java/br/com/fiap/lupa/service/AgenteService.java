package br.com.fiap.lupa.service;

import br.com.fiap.lupa.domain.Agente;
import br.com.fiap.lupa.dto.AgenteRequest;
import br.com.fiap.lupa.dto.AgenteResponse;
import br.com.fiap.lupa.exception.BusinessException;
import br.com.fiap.lupa.exception.ResourceNotFoundException;
import br.com.fiap.lupa.repository.AgenteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AgenteService {

    private final AgenteRepository repository;

    public AgenteService(AgenteRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<AgenteResponse> listar() {
        return repository.findAll().stream().map(AgenteResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public AgenteResponse buscarPorId(Long id) {
        return AgenteResponse.from(buscarEntidade(id));
    }

    @Transactional
    public AgenteResponse criar(AgenteRequest req) {
        if (repository.existsByMatricula(req.matricula())) {
            throw new BusinessException("Já existe um agente com a matrícula '%s'".formatted(req.matricula()));
        }
        if (repository.existsByEmail(req.email())) {
            throw new BusinessException("Já existe um agente com o e-mail '%s'".formatted(req.email()));
        }
        Agente a = Agente.builder()
                .nome(req.nome())
                .matricula(req.matricula())
                .email(req.email())
                .orgao(req.orgao())
                .build();
        return AgenteResponse.from(repository.save(a));
    }

    @Transactional
    public AgenteResponse atualizar(Long id, AgenteRequest req) {
        Agente a = buscarEntidade(id);
        if (!a.getMatricula().equals(req.matricula()) && repository.existsByMatricula(req.matricula())) {
            throw new BusinessException("Já existe um agente com a matrícula '%s'".formatted(req.matricula()));
        }
        if (!a.getEmail().equals(req.email()) && repository.existsByEmail(req.email())) {
            throw new BusinessException("Já existe um agente com o e-mail '%s'".formatted(req.email()));
        }
        a.setNome(req.nome());
        a.setMatricula(req.matricula());
        a.setEmail(req.email());
        a.setOrgao(req.orgao());
        return AgenteResponse.from(repository.save(a));
    }

    @Transactional
    public void excluir(Long id) {
        repository.delete(buscarEntidade(id));
    }

    @Transactional(readOnly = true)
    public Agente buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agente", id));
    }
}
