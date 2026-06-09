package br.com.fiap.lupa.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Configuração de segurança mínima: expõe o codificador BCrypt usado para
 * gerar e validar os hashes de senha. (Sem filtro completo do Spring Security;
 * a API permanece aberta para o protótipo, com a autenticação tratada na camada
 * de serviço.)
 */
@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        // strength 10 (padrão) — fator de custo do BCrypt.
        return new BCryptPasswordEncoder();
    }
}
