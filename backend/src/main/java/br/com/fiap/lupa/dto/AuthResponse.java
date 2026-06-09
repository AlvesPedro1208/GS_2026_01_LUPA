package br.com.fiap.lupa.dto;

import br.com.fiap.lupa.domain.Usuario;
import br.com.fiap.lupa.domain.enums.Role;

/** Usuário autenticado retornado por register/login (nunca inclui a senha/hash). */
public record AuthResponse(
        Long id,
        String nome,
        String email,
        Role role
) {
    public static AuthResponse from(Usuario u) {
        return new AuthResponse(u.getId(), u.getNome(), u.getEmail(), u.getRole());
    }
}
