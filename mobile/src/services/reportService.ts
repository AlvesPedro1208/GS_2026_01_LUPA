import { Colors } from '../styles/colors';
import { ReportMetric, HistoryRow, ReportPeriod } from '../types/Report';

// TODO: replace each method body with → apiClient.get(endpoints.reports.*)

export const reportService = {
  async getMetrics(_period: ReportPeriod): Promise<ReportMetric[]> {
    return [
      { id: '1', label: 'Comunidades monitoradas', value: 142, icon: 'people-outline', color: Colors.primaryDark },
      { id: '2', label: 'Novas ocupações', value: 18, icon: 'home-outline', color: Colors.riskHigh },
      { id: '3', label: 'Áreas críticas', value: 12, icon: 'warning-outline', color: Colors.riskMedium },
      { id: '4', label: 'Ocorrências registradas', value: 287, icon: 'clipboard-outline', color: Colors.info },
    ];
  },

  async getHistory(): Promise<HistoryRow[]> {
    return [
      { month: 'Junho 2025', communities: 138, occurrences: 264, critical: 11 },
      { month: 'Maio 2025', communities: 132, occurrences: 231, critical: 9 },
      { month: 'Abril 2025', communities: 128, occurrences: 198, critical: 8 },
      { month: 'Março 2025', communities: 125, occurrences: 185, critical: 7 },
      { month: 'Fevereiro 2025', communities: 120, occurrences: 170, critical: 6 },
    ];
  },

  getPeriods(): ReportPeriod[] {
    return ['Relatório Mensal', 'Relatório Semanal', 'Relatório Anual'];
  },

  // TODO: replace with → apiClient.post('/reports/export', { period })
  async exportPDF(_period: ReportPeriod): Promise<string> {
    await new Promise((r) => setTimeout(r, 800));
    return 'Documentos/LUPA/relatorio-2025-06.pdf';
  },

  // TODO: replace with → apiClient.post('/reports/share', { period })
  async share(_period: ReportPeriod): Promise<string> {
    await new Promise((r) => setTimeout(r, 500));
    return 'https://lupa.gov.br/relatorio/2025-06';
  },
};
