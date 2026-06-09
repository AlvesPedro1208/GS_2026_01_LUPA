package br.com.fiap.lupa.dto;

import jakarta.validation.constraints.*;

/** Dados de entrada para criar/atualizar um agente de campo. */
public record AgenteRequest(

        @NotBlank(message = "nome é obrigatório")
        @Size(max = 120)
        String nome,

        @NotBlank(message = "matricula é obrigatória")
        @Size(max = 30)
        String matricula,

        @NotBlank(message = "email é obrigatório")
        @Email(message = "email inválido")
        @Size(max = 150)
        String email,

        @Size(max = 80)
        String orgao
) {
}
