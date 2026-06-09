package br.com.fiap.lupa.exception;

/** Lançada quando as credenciais de login são inválidas (resulta em HTTP 401). */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String mensagem) {
        super(mensagem);
    }
}
