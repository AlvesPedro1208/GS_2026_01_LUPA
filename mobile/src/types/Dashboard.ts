export interface DashboardStats {
  areasMonitoradas: number;
  alertasAtivos: number;
  altoRisco: number;
  medioRisco: number;
  baixoRisco: number;
}

export interface RecentAlert {
  id: number;
  title: string;
  community: string;
  time: string;
  risk: string;
  color: string;
}
