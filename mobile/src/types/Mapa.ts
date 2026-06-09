import { NivelRisco } from '../utils/riskCalculator';

// Core monitored area — mirrors the future PostgreSQL/PostGIS table `areas_monitoradas`
export interface AreaMonitorada {
  id: string;
  nome: string;
  latitude: number;
  longitude: number;
  quantidadeOcorrencias: number;
  nivelRisco: NivelRisco; // always computed by calcularNivelRisco(), never stored manually
}

// Raw shape received from the API before risk calculation
export interface AreaMonitoradaRaw {
  id: string;
  nome: string;
  latitude: number;
  longitude: number;
  quantidadeOcorrencias: number;
}

// Future: polygon geometry from PostGIS (ST_AsGeoJSON)
export interface PoligonoArea {
  areaId: string;
  coordenadas: Array<{ latitude: number; longitude: number }>;
  // Future fields: crescimento_mensal, data_deteccao, fonte_imagem
}

export interface MapaRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}
