export type RiskLevel = 'Alto' | 'Médio' | 'Baixo';

export interface AlertItem {
  id: number;
  title: string;
  community: string;
  time: string;
  risk: RiskLevel;
  color: string;
  icon: string;
}

export interface ExpansionAlert {
  community: string;
  findings: string[];
  riskLevel: RiskLevel;
}
