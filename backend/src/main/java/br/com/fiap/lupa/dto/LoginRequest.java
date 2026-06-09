package br.com.fiap.lupa.dto;

import jakarta.validation.constraints.NotBlank;

/** Credenciais de login. */
public record LoginRequest(

        @NotBlank(message = "email é obrigatório")
        String email,

        @NotBlank(message = "senha é obrigatória")
        String senha
) {
}
