package br.com.fiap.lupa.controller;

import br.com.fiap.lupa.dto.AlertaResponse;
import br.com.fiap.lupa.service.AlertaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alertas")
@Tag(name = "Alertas", description = "Alertas gerados automaticamente a partir das leituras críticas")
public class AlertaController {

    private final AlertaService service;

    public AlertaController(AlertaService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Lista alertas; por padrão apenas os ativos (?ativos=false para todos)")
    public List<AlertaResponse> listar(@RequestParam(defaultValue = "true") boolean ativos) {
        return service.listar(ativos);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca um alerta pelo id")
    public AlertaResponse buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PutMapping("/{id}/resolver")
    @Operation(summary = "Marca um alerta como tratado/resolvido")
    public AlertaResponse resolver(@PathVariable Long id) {
        return service.resolver(id);
    }
}
