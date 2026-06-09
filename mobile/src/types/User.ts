export type TipoConta = 'visitante' | 'agente';

export interface User {
  id: string;
  nome: string;
  email: string;
  tipoConta: TipoConta;
}
