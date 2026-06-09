package br.com.fiap.lupa.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** Metadados da documentação OpenAPI/Swagger da API LUPA. */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI lupaOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("LUPA API")
                        .description("API REST do projeto LUPA — Leitura Urbana e Planejamento de "
                                + "Assentamentos. Monitora comunidades, leituras de sensores IoT, "
                                + "ocorrências de campo e alertas. FIAP Global Solution 2026/1 — equipe GateMinds.")
                        .version("v1")
                        .contact(new Contact().name("GateMinds").email("gateminds@fiap.com.br"))
                        .license(new License().name("Uso acadêmico — FIAP")));
    }
}
