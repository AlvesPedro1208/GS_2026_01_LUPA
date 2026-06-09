export type NivelRisco = 'baixo' | 'medio' | 'alto';

// Thresholds — change here to update rules everywhere in the app
const THRESHOLD_MEDIO = 10;
const THRESHOLD_ALTO = 30;

/**
 * Calculates risk level from occurrence count.
 * Future: may incorporate additional factors (proximity to slopes,
 * rainfall index, historical trend) once FastAPI returns richer data.
 */
export function calcularNivelRisco(quantidadeOcorrencias: number): NivelRisco {
  if (quantidadeOcorrencias >= THRESHOLD_ALTO) return 'alto';
  if (quantidadeOcorrencias >= THRESHOLD_MEDIO) return 'medio';
  return 'baixo';
}

export const RISCO_CORES: Record<NivelRisco, string> = {
  baixo: '#4CAF50',
  medio: '#FB8C00',
  alto: '#E53935',
};

export const RISCO_LABEL: Record<NivelRisco, string> = {
  baixo: 'Baixo',
  medio: 'Médio',
  alto: 'Alto',
};

export const RISCO_EMOJI: Record<NivelRisco, string> = {
  baixo: '🟢',
  medio: '🟡',
  alto: '🔴',
};
