package br.com.fiap.lupa.controller;

import br.com.fiap.lupa.dto.OcorrenciaRequest;
import br.com.fiap.lupa.dto.OcorrenciaResponse;
import br.com.fiap.lupa.dto.OcorrenciaStatusRequest;
import br.com.fiap.lupa.service.OcorrenciaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/ocorrencias")
@Tag(name = "Ocorrências", description = "Registro de ocorrências de campo pelos agentes")
public class OcorrenciaController {

    private final OcorrenciaService service;

    public OcorrenciaController(OcorrenciaService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Lista ocorrências; opcionalmente filtra por comunidade (?comunidadeId=)")
    public List<OcorrenciaResponse> listar(@RequestParam(required = false) Long comunidadeId) {
        return (comunidadeId == null)
                ? service.listar()
                : service.listarPorComunidade(comunidadeId);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca uma ocorrência pelo id")
    public OcorrenciaResponse buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @Operation(summary = "Registra uma nova ocorrência de campo")
    public ResponseEntity<OcorrenciaResponse> criar(@Valid @RequestBody OcorrenciaRequest req,
                                                    UriComponentsBuilder uriBuilder) {
        OcorrenciaResponse criada = service.criar(req);
        URI location = uriBuilder.path("/api/ocorrencias/{id}").buildAndExpand(criada.id()).toUri();
        return ResponseEntity.created(location).body(criada);
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Atualiza o status de uma ocorrência (ABERTA/EM_ANALISE/RESOLVIDA)")
    public OcorrenciaResponse atualizarStatus(@PathVariable Long id,
                                              @Valid @RequestBody OcorrenciaStatusRequest req) {
        return service.atualizarStatus(id, req.status());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove uma ocorrência")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}
