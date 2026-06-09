package br.com.fiap.lupa.controller;

import br.com.fiap.lupa.dto.AuthResponse;
import br.com.fiap.lupa.dto.LoginRequest;
import br.com.fiap.lupa.dto.RegisterRequest;
import br.com.fiap.lupa.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticação", description = "Cadastro e login de usuários (senha com hash BCrypt)")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/register")
    @Operation(summary = "Cadastra um novo usuário (senha armazenada como hash BCrypt)")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.register(req));
    }

    @PostMapping("/login")
    @Operation(summary = "Autentica o usuário e retorna o perfil (401 se inválido)")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        return service.login(req);
    }
}
