export interface OccurrenceType {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface OccurrencePayload {
  typeId: string;
  /** Id da comunidade (backend). Opcional para suportar o modo offline/mock. */
  comunidadeId?: number;
  description: string;
  hasPhoto: boolean;
  latitude?: number;
  longitude?: number;
}

/** Resultado do envio de uma ocorrência. */
export interface SubmitResult {
  /** true = persistida no backend real; false = salva apenas localmente (fallback). */
  persisted: boolean;
}
