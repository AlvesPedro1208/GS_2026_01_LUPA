export type ReportPeriod = 'Relatório Mensal' | 'Relatório Semanal' | 'Relatório Anual';

export interface ReportMetric {
  id: string;
  label: string;
  value: number;
  icon: string;
  color: string;
}

export interface HistoryRow {
  month: string;
  communities: number;
  occurrences: number;
  critical: number;
}
