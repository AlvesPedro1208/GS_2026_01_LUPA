package br.com.fiap.lupa.service;

import br.com.fiap.lupa.domain.Usuario;
import br.com.fiap.lupa.domain.enums.Role;
import br.com.fiap.lupa.dto.AuthResponse;
import br.com.fiap.lupa.dto.LoginRequest;
import br.com.fiap.lupa.dto.RegisterRequest;
import br.com.fiap.lupa.exception.BusinessException;
import br.com.fiap.lupa.exception.UnauthorizedException;
import br.com.fiap.lupa.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Cadastra um novo usuário, armazenando apenas o hash BCrypt da senha.
     */
    @Transactional
    public AuthResponse register(RegisterRequest req) {
        String email = req.email().trim().toLowerCase();
        if (repository.existsByEmailIgnoreCase(email)) {
            throw new BusinessException("Este e-mail já está cadastrado.");
        }

        Usuario usuario = Usuario.builder()
                .nome(req.nome().trim())
                .email(email)
                .senhaHash(passwordEncoder.encode(req.senha()))
                .role(Role.AGENTE)
                .build();

        return AuthResponse.from(repository.save(usuario));
    }

    /**
     * Autentica o usuário comparando a senha informada com o hash armazenado.
     * Mensagem genérica em caso de falha para não revelar se o e-mail existe.
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest req) {
        String email = req.email().trim().toLowerCase();
        Usuario usuario = repository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new UnauthorizedException("E-mail ou senha inválidos."));

        if (!passwordEncoder.matches(req.senha(), usuario.getSenhaHash())) {
            throw new UnauthorizedException("E-mail ou senha inválidos.");
        }

        return AuthResponse.from(usuario);
    }
}
