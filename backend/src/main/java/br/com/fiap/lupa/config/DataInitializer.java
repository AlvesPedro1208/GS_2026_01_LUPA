package br.com.fiap.lupa.config;

import br.com.fiap.lupa.domain.Usuario;
import br.com.fiap.lupa.domain.enums.Role;
import br.com.fiap.lupa.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Cria o usuário de demonstração no primeiro start (se ainda não existir),
 * com a senha devidamente hasheada via BCrypt. As credenciais batem com a
 * conta demo do app mobile: joao@prefeitura.gov.br / senha123.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private static final String DEMO_EMAIL = "joao@prefeitura.gov.br";
    private static final String DEMO_SENHA = "senha123";

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepository.existsByEmailIgnoreCase(DEMO_EMAIL)) {
            return;
        }
        Usuario demo = Usuario.builder()
                .nome("João Silva")
                .email(DEMO_EMAIL)
                .senhaHash(passwordEncoder.encode(DEMO_SENHA))
                .role(Role.AGENTE)
                .build();
        usuarioRepository.save(demo);
        log.info("Usuário de demonstração criado: {}", DEMO_EMAIL);
    }
}
