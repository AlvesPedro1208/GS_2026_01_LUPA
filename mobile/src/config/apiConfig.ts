import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Endereço do backend LUPA (Spring Boot) — Partes 1 e 2 do projeto.
 *
 * O host é detectado automaticamente a partir do servidor Metro do Expo:
 *  - Celular físico (Expo Go) -> IP da máquina na rede (mesmo do Metro)
 *  - Simulador iOS            -> localhost
 *  - Emulador Android         -> 10.0.2.2 (alias do host)
 *
 * Se precisar forçar um endereço (ex.: backend em outra máquina), preencha MANUAL_HOST.
 */
const MANUAL_HOST: string | null = null;
const PORT = 8080;

function deriveHost(): string {
  if (MANUAL_HOST) return MANUAL_HOST;

  // hostUri do Metro, ex.: "192.168.1.71:8081" (device) ou "localhost:8081" (simulador)
  const hostUri =
    Constants.expoConfig?.hostUri ??
    // @ts-ignore — fallback para versões/formatos antigos do manifesto
    (Constants.manifest2?.extra?.expoGo?.debuggerHost as string | undefined) ??
    '';
  const host = hostUri.split(':')[0];

  if (host && host !== 'localhost' && host !== '127.0.0.1') {
    return host; // IP real da máquina (celular físico na mesma rede)
  }

  // Simulador/emulador: Android precisa do alias 10.0.2.2 para alcançar o host.
  if (Platform.OS === 'android') return '10.0.2.2';
  return 'localhost';
}

export const LUPA_API_BASE_URL = `http://${deriveHost()}:${PORT}`;

/** Tempo máximo (ms) de espera por uma resposta do backend antes de cair no fallback. */
export const LUPA_API_TIMEOUT = 6000;
