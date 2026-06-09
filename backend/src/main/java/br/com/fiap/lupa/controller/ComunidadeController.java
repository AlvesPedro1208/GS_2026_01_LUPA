package br.com.fiap.lupa.controller;

import br.com.fiap.lupa.dto.ComunidadeRequest;
import br.com.fiap.lupa.dto.ComunidadeResponse;
import br.com.fiap.lupa.service.ComunidadeService;
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
@RequestMapping("/api/comunidades")
@Tag(name = "Comunidades", description = "Gestão das comunidades/assentamentos monitorados")
public class ComunidadeController {

    private final ComunidadeService service;

    public ComunidadeController(ComunidadeService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Lista todas as comunidades")
    public List<ComunidadeResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca uma comunidade pelo id")
    public ComunidadeResponse buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @Operation(summary = "Cadastra uma nova comunidade")
    public ResponseEntity<ComunidadeResponse> criar(@Valid @RequestBody ComunidadeRequest req,
                                                     UriComponentsBuilder uriBuilder) {
        ComunidadeResponse criada = service.criar(req);
        URI location = uriBuilder.path("/api/comunidades/{id}").buildAndExpand(criada.id()).toUri();
        return ResponseEntity.created(location).body(criada);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza uma comunidade existente")
    public ComunidadeResponse atualizar(@PathVariable Long id, @Valid @RequestBody ComunidadeRequest req) {
        return service.atualizar(id, req);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove uma comunidade")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}
