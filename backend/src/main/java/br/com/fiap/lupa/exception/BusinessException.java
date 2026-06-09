package br.com.fiap.lupa.exception;

/** Lançada quando uma regra de negócio é violada (resulta em HTTP 409). */
public class BusinessException extends RuntimeException {

    public BusinessException(String mensagem) {
        super(mensagem);
    }
}
