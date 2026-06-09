/**
 * Cliente HTTP da API real do LUPA (backend Spring Boot — Partes 1 e 2).
 * Usa `fetch` (nativo do React Native, sem dependências extras) e um timeout
 * para que o app caia no fallback mockado caso o backend esteja indisponível.
 *
 * Endpoints reais (ver backend/README.md):
 *   GET  /api/comunidades
 *   GET  /api/agentes
 *   GET  /api/alertas?ativos=true
 *   POST /api/ocorrencias
 */
import { LUPA_API_BASE_URL, LUPA_API_TIMEOUT } from '../config/apiConfig';

/** Erro HTTP com status (resposta recebida do backend). Distingue de falha de rede. */
export class ApiHttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiHttpError';
  }
}

/** Usuário autenticado retornado por /api/auth/*. */
export interface AuthUserDTO {
  id: number;
  nome: string;
  email: string;
  role: 'AGENTE' | 'GESTOR';
}

// ---------- Tipos espelhando as respostas do backend ----------
export interface ComunidadeDTO {
  id: number;
  nome: string;
  setor: string;
  cidade?: string;
  latitude?: number;
  longitude?: number;
  populacaoEstimada?: number;
  areaRisco: boolean;
  criadoEm: string;
}

export interface AgenteDTO {
  id: number;
  nome: string;
  matricula: string;
  email: string;
  orgao?: string;
  criadoEm: string;
}

export interface AlertaDTO {
  id: number;
  comunidadeId: number;
  comunidadeNome: string;
  leituraId: number;
  nivel: 'RISCO' | 'CRITICO';
  mensagem: string;
  resolvido: boolean;
  criadoEm: string;
}

export interface OcorrenciaRequestDTO {
  comunidadeId: number;
  agenteId: number;
  tipo: string;
  descricao: string;
  latitude?: number;
  longitude?: number;
  fotoUrl?: string;
}

export interface OcorrenciaDTO {
  id: number;
  comunidadeId: number;
  comunidadeNome: string;
  agenteId: number;
  agenteNome: string;
  tipo: string;
  descricao: string;
  latitude?: number;
  longitude?: number;
  fotoUrl?: string;
  status: string;
  criadoEm: string;
}

/**
 * Mapeia o tipo de ocorrência do app (id curto) para o enum TipoOcorrencia do backend.
 */
export const TIPO_OCORRENCIA_MAP: Record<string, string> = {
  agua: 'FALTA_AGUA',
  energia: 'FALTA_ENERGIA',
  esgoto: 'ESGOTO_A_CEU_ABERTO',
  deslizamento: 'RISCO_DESLIZAMENTO',
  enchente: 'ENCHENTE',
  lixo: 'LIXO_ACUMULADO',
  outro: 'OUTRO',
};

// ---------- Núcleo HTTP ----------
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LUPA_API_TIMEOUT);
  try {
    const response = await fetch(`${LUPA_API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      signal: controller.signal,
      ...init,
    });
    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new ApiHttpError(response.status, `HTTP ${response.status} em ${path}${body ? ` - ${body}` : ''}`);
    }
    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
  } finally {
    clearTimeout(timeout);
  }
}

export const lupaApi = {
  baseUrl: LUPA_API_BASE_URL,

  getComunidades: () => request<ComunidadeDTO[]>('/api/comunidades'),

  getAgentes: () => request<AgenteDTO[]>('/api/agentes'),

  getAlertas: (ativos = true) => request<AlertaDTO[]>(`/api/alertas?ativos=${ativos}`),

  createOcorrencia: (body: OcorrenciaRequestDTO) =>
    request<OcorrenciaDTO>('/api/ocorrencias', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  register: (body: { nome: string; email: string; senha: string }) =>
    request<AuthUserDTO>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; senha: string }) =>
    request<AuthUserDTO>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  /** Checagem leve de conectividade com o backend. */
  async isOnline(): Promise<boolean> {
    try {
      await request('/api/comunidades');
      return true;
    } catch {
      return false;
    }
  },
};
