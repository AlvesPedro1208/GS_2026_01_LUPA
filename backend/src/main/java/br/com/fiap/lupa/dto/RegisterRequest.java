package br.com.fiap.lupa.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Dados de entrada para cadastro de um novo usuário. */
public record RegisterRequest(

        @NotBlank(message = "nome é obrigatório")
        @Size(max = 120)
        String nome,

        @NotBlank(message = "email é obrigatório")
        @Email(message = "email inválido")
        @Size(max = 150)
        String email,

        @NotBlank(message = "senha é obrigatória")
        @Size(min = 6, max = 100, message = "senha deve ter entre 6 e 100 caracteres")
        String senha
) {
}
