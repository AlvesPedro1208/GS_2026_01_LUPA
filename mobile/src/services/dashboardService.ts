import { Colors } from '../styles/colors';
import { DashboardStats, RecentAlert } from '../types/Dashboard';
import { mapaService } from './mapaService';

// TODO: replace each method body with → apiClient.get(endpoints.dashboard.*)

export const dashboardService = {
  // Stats are computed live from mapaService so that registering an occurrence
  // and calling mapaService.incrementarOcorrencia() automatically updates the dashboard.
  async getStats(): Promise<DashboardStats> {
    const areas = await mapaService.getAreasMonitoradas();
    const alto = areas.filter((a) => a.nivelRisco === 'alto').length;
    const medio = areas.filter((a) => a.nivelRisco === 'medio').length;
    const baixo = areas.filter((a) => a.nivelRisco === 'baixo').length;

    return {
      areasMonitoradas: areas.length,
      alertasAtivos: alto + medio,
      altoRisco: alto,
      medioRisco: medio,
      baixoRisco: baixo,
    };
  },

  async getRecentAlerts(): Promise<RecentAlert[]> {
    return [
      { id: 1, title: 'Nova expansão detectada', community: 'Vila Esperança', time: '2h', risk: 'Alto', color: Colors.riskHigh },
      { id: 2, title: 'Deslizamento de terra',   community: 'Comunidade Sol',  time: '5h', risk: 'Alto', color: Colors.riskHigh },
      { id: 3, title: 'Ocupação irregular',       community: 'Favela Nova',     time: '1d', risk: 'Médio', color: Colors.riskMedium },
      { id: 4, title: 'Falta de esgoto',          community: 'Bairro Esperança',time: '2d', risk: 'Baixo', color: Colors.riskLow },
    ];
  },
};
