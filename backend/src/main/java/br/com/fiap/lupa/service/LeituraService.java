package br.com.fiap.lupa.service;

import br.com.fiap.lupa.domain.Alerta;
import br.com.fiap.lupa.domain.Comunidade;
import br.com.fiap.lupa.domain.Leitura;
import br.com.fiap.lupa.domain.enums.StatusLeitura;
import br.com.fiap.lupa.dto.LeituraRequest;
import br.com.fiap.lupa.dto.LeituraResponse;
import br.com.fiap.lupa.exception.ResourceNotFoundException;
import br.com.fiap.lupa.repository.AlertaRepository;
import br.com.fiap.lupa.repository.LeituraRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LeituraService {

    private final LeituraRepository leituraRepository;
    private final AlertaRepository alertaRepository;
    private final ComunidadeService comunidadeService;
    private final ClassificadorLeitura classificador;

    public LeituraService(LeituraRepository leituraRepository,
                          AlertaRepository alertaRepository,
                          ComunidadeService comunidadeService,
                          ClassificadorLeitura classificador) {
        this.leituraRepository = leituraRepository;
        this.alertaRepository = alertaRepository;
        this.comunidadeService = comunidadeService;
        this.classificador = classificador;
    }

    @Transactional(readOnly = true)
    public List<LeituraResponse> listar() {
        return leituraRepository.findAll().stream().map(LeituraResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<LeituraResponse> listarPorComunidade(Long comunidadeId) {
        comunidadeService.buscarEntidade(comunidadeId); // valida existência
        return leituraRepository.findByComunidadeIdOrderByRegistradoEmDesc(comunidadeId)
                .stream().map(LeituraResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public LeituraResponse buscarPorId(Long id) {
        return LeituraResponse.from(buscarEntidade(id));
    }

    /**
     * Registra uma leitura vinda do IoT: classifica o status segundo os limiares
     * e, se houver qualquer alerta ativo (status RISCO ou CRITICO), gera um
     * {@link Alerta} associado.
     */
    @Transactional
    public LeituraResponse registrar(LeituraRequest req) {
        Comunidade comunidade = comunidadeService.buscarEntidade(req.comunidadeId());

        ClassificadorLeitura.Resultado resultado =
                classificador.classificar(req.temperatura(), req.umidade(), req.qualidadeAr());

        Leitura leitura = Leitura.builder()
                .comunidade(comunidade)
                .temperatura(req.temperatura())
                .umidade(req.umidade())
                .qualidadeAr(req.qualidadeAr())
                .status(resultado.status())
                .build();
        leitura = leituraRepository.save(leitura);

        if (resultado.status() != StatusLeitura.OK) {
            Alerta alerta = Alerta.builder()
                    .comunidade(comunidade)
                    .leitura(leitura)
                    .nivel(resultado.status())
                    .mensagem(String.join(" | ", resultado.motivos()))
                    .resolvido(false)
                    .build();
            alertaRepository.save(alerta);
        }

        return LeituraResponse.from(leitura);
    }

    @Transactional(readOnly = true)
    public Leitura buscarEntidade(Long id) {
        return leituraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leitura", id));
    }
}
