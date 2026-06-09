package br.com.fiap.lupa.controller;

import br.com.fiap.lupa.dto.LeituraRequest;
import br.com.fiap.lupa.dto.LeituraResponse;
import br.com.fiap.lupa.service.LeituraService;
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
@RequestMapping("/api/leituras")
@Tag(name = "Leituras", description = "Ingestão e consulta das leituras dos sensores IoT")
public class LeituraController {

    private final LeituraService service;

    public LeituraController(LeituraService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Lista leituras; opcionalmente filtra por comunidade (?comunidadeId=)")
    public List<LeituraResponse> listar(@RequestParam(required = false) Long comunidadeId) {
        return (comunidadeId == null)
                ? service.listar()
                : service.listarPorComunidade(comunidadeId);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca uma leitura pelo id")
    public LeituraResponse buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @Operation(summary = "Registra uma leitura de sensores (IoT). O status é calculado e, "
            + "se houver alerta, um registro de alerta é gerado automaticamente.")
    public ResponseEntity<LeituraResponse> registrar(@Valid @RequestBody LeituraRequest req,
                                                      UriComponentsBuilder uriBuilder) {
        LeituraResponse criada = service.registrar(req);
        URI location = uriBuilder.path("/api/leituras/{id}").buildAndExpand(criada.id()).toUri();
        return ResponseEntity.created(location).body(criada);
    }
}
