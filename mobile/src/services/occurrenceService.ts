import { Colors } from '../styles/colors';
import { OccurrenceType, OccurrencePayload, SubmitResult } from '../types/Occurrence';
import { lupaApi, ComunidadeDTO, TIPO_OCORRENCIA_MAP } from './lupaApi';

export const occurrenceService = {
  getTypes(): OccurrenceType[] {
    return [
      { id: 'agua', label: 'Falta de água', icon: '💧', color: '#1976D2' },
      { id: 'energia', label: 'Falta de energia', icon: '⚡', color: '#F57F17' },
      { id: 'esgoto', label: 'Esgoto', icon: '🚽', color: '#6D4C41' },
      { id: 'deslizamento', label: 'Deslizamento', icon: '⛰️', color: Colors.riskHigh },
      { id: 'enchente', label: 'Enchente', icon: '🌊', color: '#0288D1' },
      { id: 'lixo', label: 'Coleta de lixo', icon: '🗑️', color: '#558B2F' },
      { id: 'outro', label: 'Outro', icon: '···', color: Colors.textSecondary },
    ];
  },

  /**
   * Busca as comunidades reais do backend para o seletor da tela de registro.
   * Em caso de falha (backend offline), retorna lista vazia — a tela trata o fallback.
   */
  async getComunidades(): Promise<ComunidadeDTO[]> {
    try {
      return await lupaApi.getComunidades();
    } catch (e) {
      console.log('[occurrenceService] getComunidades falhou, usando fallback:', e);
      return [];
    }
  },

  /**
   * Envia a ocorrência. Tenta persistir no backend real (POST /api/ocorrencias);
   * se o backend estiver indisponível, cai no fallback local para nunca quebrar a UX.
   */
  async submit(payload: OccurrencePayload): Promise<SubmitResult> {
    const tipo = TIPO_OCORRENCIA_MAP[payload.typeId] ?? 'OUTRO';

    // Sem comunidade selecionada (ex.: backend offline) -> fallback local.
    if (!payload.comunidadeId) {
      await new Promise((r) => setTimeout(r, 600));
      console.log('[occurrenceService] sem comunidadeId, salvo localmente (mock):', payload);
      return { persisted: false };
    }

    try {
      // Resolve um agente válido existente no backend (associação obrigatória).
      let agenteId = 1;
      try {
        const agentes = await lupaApi.getAgentes();
        if (agentes.length > 0) agenteId = agentes[0].id;
      } catch {
        /* mantém o default */
      }

      await lupaApi.createOcorrencia({
        comunidadeId: payload.comunidadeId,
        agenteId,
        tipo,
        descricao: payload.description,
        latitude: payload.latitude,
        longitude: payload.longitude,
        fotoUrl: payload.hasPhoto ? 'mock://foto-ocorrencia.jpg' : undefined,
      });
      return { persisted: true };
    } catch (e) {
      // Fallback: backend fora do ar não pode derrubar o app.
      await new Promise((r) => setTimeout(r, 600));
      console.log('[occurrenceService] backend indisponível, salvo localmente (mock):', e);
      return { persisted: false };
    }
  },
};
