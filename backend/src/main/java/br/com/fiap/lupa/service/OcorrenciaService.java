package br.com.fiap.lupa.service;

import br.com.fiap.lupa.domain.Agente;
import br.com.fiap.lupa.domain.Comunidade;
import br.com.fiap.lupa.domain.Ocorrencia;
import br.com.fiap.lupa.domain.enums.StatusOcorrencia;
import br.com.fiap.lupa.dto.OcorrenciaRequest;
import br.com.fiap.lupa.dto.OcorrenciaResponse;
import br.com.fiap.lupa.exception.ResourceNotFoundException;
import br.com.fiap.lupa.repository.OcorrenciaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OcorrenciaService {

    private final OcorrenciaRepository repository;
    private final ComunidadeService comunidadeService;
    private final AgenteService agenteService;

    public OcorrenciaService(OcorrenciaRepository repository,
                             ComunidadeService comunidadeService,
                             AgenteService agenteService) {
        this.repository = repository;
        this.comunidadeService = comunidadeService;
        this.agenteService = agenteService;
    }

    @Transactional(readOnly = true)
    public List<OcorrenciaResponse> listar() {
        return repository.findAll().stream().map(OcorrenciaResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<OcorrenciaResponse> listarPorComunidade(Long comunidadeId) {
        comunidadeService.buscarEntidade(comunidadeId);
        return repository.findByComunidadeIdOrderByCriadoEmDesc(comunidadeId)
                .stream().map(OcorrenciaResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public OcorrenciaResponse buscarPorId(Long id) {
        return OcorrenciaResponse.from(buscarEntidade(id));
    }

    @Transactional
    public OcorrenciaResponse criar(OcorrenciaRequest req) {
        Comunidade comunidade = comunidadeService.buscarEntidade(req.comunidadeId());
        Agente agente = agenteService.buscarEntidade(req.agenteId());

        Ocorrencia o = Ocorrencia.builder()
                .comunidade(comunidade)
                .agente(agente)
                .tipo(req.tipo())
                .descricao(req.descricao())
                .latitude(req.latitude())
                .longitude(req.longitude())
                .fotoUrl(req.fotoUrl())
                .status(StatusOcorrencia.ABERTA)
                .build();
        return OcorrenciaResponse.from(repository.save(o));
    }

    @Transactional
    public OcorrenciaResponse atualizarStatus(Long id, StatusOcorrencia novoStatus) {
        Ocorrencia o = buscarEntidade(id);
        o.setStatus(novoStatus);
        return OcorrenciaResponse.from(repository.save(o));
    }

    @Transactional
    public void excluir(Long id) {
        repository.delete(buscarEntidade(id));
    }

    @Transactional(readOnly = true)
    public Ocorrencia buscarEntidade(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ocorrência", id));
    }
}
