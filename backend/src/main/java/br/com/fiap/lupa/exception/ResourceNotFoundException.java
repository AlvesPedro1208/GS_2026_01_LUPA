package br.com.fiap.lupa.exception;

/** Lançada quando um recurso solicitado não existe (resulta em HTTP 404). */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String recurso, Long id) {
        super("%s não encontrado(a) para o id %d".formatted(recurso, id));
    }

    public ResourceNotFoundException(String mensagem) {
        super(mensagem);
    }
}
