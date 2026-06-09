package br.com.fiap.lupa.controller;

import br.com.fiap.lupa.dto.AgenteRequest;
import br.com.fiap.lupa.dto.AgenteResponse;
import br.com.fiap.lupa.service.AgenteService;
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
@RequestMapping("/api/agentes")
@Tag(name = "Agentes", description = "Gestão dos agentes públicos de campo")
public class AgenteController {

    private final AgenteService service;

    public AgenteController(AgenteService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Lista todos os agentes")
    public List<AgenteResponse> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca um agente pelo id")
    public AgenteResponse buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @Operation(summary = "Cadastra um novo agente")
    public ResponseEntity<AgenteResponse> criar(@Valid @RequestBody AgenteRequest req,
                                                UriComponentsBuilder uriBuilder) {
        AgenteResponse criado = service.criar(req);
        URI location = uriBuilder.path("/api/agentes/{id}").buildAndExpand(criado.id()).toUri();
        return ResponseEntity.created(location).body(criado);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza um agente existente")
    public AgenteResponse atualizar(@PathVariable Long id, @Valid @RequestBody AgenteRequest req) {
        return service.atualizar(id, req);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove um agente")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}
