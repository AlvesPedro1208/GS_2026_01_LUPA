import { Colors } from '../styles/colors';
import { AlertItem, ExpansionAlert } from '../types/Alert';

// TODO: replace each method body with → apiClient.get(endpoints.alerts.*)

export const alertService = {
  async getAll(): Promise<AlertItem[]> {
    return [
      { id: 1, title: '🛰 Expansão urbana detectada por satélite', community: 'Vila Esperança', time: '2h', risk: 'Alto', color: Colors.riskHigh, icon: 'warning' },
      { id: 2, title: '⛰ Risco de deslizamento identificado', community: 'Comunidade Sol', time: '5h', risk: 'Alto', color: Colors.riskHigh, icon: 'alert-circle' },
      { id: 3, title: '🏘 Ocupação irregular em APP', community: 'Favela Nova', time: '1d', risk: 'Médio', color: Colors.riskMedium, icon: 'home' },
      { id: 4, title: '💧 Anomalia hídrica detectada', community: 'Bairro Esperança', time: '2d', risk: 'Baixo', color: Colors.riskLow, icon: 'water' },
      { id: 5, title: '🌊 Risco de inundação por NDWI', community: 'Jardim Rio Azul', time: '3d', risk: 'Médio', color: Colors.riskMedium, icon: 'warning' },
      { id: 6, title: '⚠ Construção em área de encosta', community: 'Serra Alta', time: '4d', risk: 'Alto', color: Colors.riskHigh, icon: 'alert-circle' },
    ];
  },

  async getExpansionDetail(): Promise<ExpansionAlert> {
    return {
      community: 'Vila Esperança',
      findings: [
        '18 novas construções identificadas (NDVI Sentinel-2)',
        'Aproximação crítica de encosta instável',
        'Área sujeita a deslizamento (índice CBERS-6)',
        'Variação de 12% de cobertura vegetal',
      ],
      riskLevel: 'Alto',
    };
  },

  // TODO: replace with → apiClient.post(endpoints.alerts.byId(id) + '/analyze')
  async sendForAnalysis(alertId: number): Promise<void> {
    await new Promise((r) => setTimeout(r, 600));
    console.log('[alertService] Sent for analysis (mock):', alertId);
  },
};
