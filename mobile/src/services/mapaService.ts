import { AreaMonitorada, AreaMonitoradaRaw, PoligonoArea } from '../types/Mapa';
import { calcularNivelRisco } from '../utils/riskCalculator';
import { endpoints } from './api';

// Mock data: monitored hillside communities in Santos-SP.
// In production these rows come from:
//   SELECT id, nome, ST_Y(geom) AS latitude, ST_X(geom) AS longitude,
//          quantidade_ocorrencias FROM areas_monitoradas;
const AREAS_MOCK: AreaMonitoradaRaw[] = [
  { id: '1', nome: 'Morro do Pacheco',       latitude: -23.9344, longitude: -46.3331, quantidadeOcorrencias: 45 },
  { id: '2', nome: 'Morro José Menino',       latitude: -23.9705, longitude: -46.3494, quantidadeOcorrencias: 22 },
  { id: '3', nome: 'Morro Santa Terezinha',   latitude: -23.9450, longitude: -46.3650, quantidadeOcorrencias: 38 },
  { id: '4', nome: 'Morro Nova Cintra',       latitude: -23.9550, longitude: -46.3820, quantidadeOcorrencias: 15 },
  { id: '5', nome: 'Morro Chico de Paula',    latitude: -23.9600, longitude: -46.3450, quantidadeOcorrencias: 6  },
  { id: '6', nome: 'Dique Zona Noroeste',     latitude: -23.9150, longitude: -46.3700, quantidadeOcorrencias: 8  },
  { id: '7', nome: 'Morro São Bento',         latitude: -23.9400, longitude: -46.3150, quantidadeOcorrencias: 31 },
  { id: '8', nome: 'Comunidade Aparecida',    latitude: -23.9830, longitude: -46.3580, quantidadeOcorrencias: 13 },
];

// Enriches raw data with the computed risk level
function enrich(raw: AreaMonitoradaRaw): AreaMonitorada {
  return { ...raw, nivelRisco: calcularNivelRisco(raw.quantidadeOcorrencias) };
}

export const mapaService = {
  // TODO: replace with → apiClient.get(endpoints.areas.list)
  async getAreasMonitoradas(): Promise<AreaMonitorada[]> {
    return AREAS_MOCK.map(enrich);
  },

  // TODO: replace with → apiClient.get(endpoints.areas.byId(id))
  async getAreaById(id: string): Promise<AreaMonitorada | null> {
    const raw = AREAS_MOCK.find((a) => a.id === id);
    return raw ? enrich(raw) : null;
  },

  // TODO: replace with → apiClient.get(endpoints.occurrences.list + `?areaId=${areaId}`)
  async getOcorrenciasPorArea(areaId: string): Promise<number> {
    return AREAS_MOCK.find((a) => a.id === areaId)?.quantidadeOcorrencias ?? 0;
  },

  /**
   * Called when a new occurrence is registered for an area.
   * Future: this triggers a PATCH /areas/{areaId}/occurrences on the FastAPI backend,
   * which recalculates risk and stores the updated value in PostgreSQL.
   */
  async incrementarOcorrencia(areaId: string): Promise<AreaMonitorada | null> {
    // TODO: replace with → apiClient.patch(endpoints.areas.byId(areaId) + '/occurrences')
    const raw = AREAS_MOCK.find((a) => a.id === areaId);
    if (!raw) return null;
    raw.quantidadeOcorrencias += 1;
    return enrich(raw);
  },

  /**
   * Future: loads community polygon geometries from PostGIS for map overlay rendering.
   * SQL: SELECT id, ST_AsGeoJSON(geometry) AS geojson FROM areas_monitoradas
   * where geometry is a GEOMETRY(POLYGON, 4326) column.
   */
  async getPoligonosAreas(): Promise<PoligonoArea[]> {
    // TODO: replace with → apiClient.get(endpoints.areas.polygons)
    // Parse GeoJSON: response.features.map(f => ({ areaId: f.id, coordenadas: f.geometry.coordinates[0] }))
    return [];
  },
};
