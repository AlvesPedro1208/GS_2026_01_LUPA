// Base API configuration — prepared for FastAPI integration.
// Android emulator uses 10.0.2.2 to reach the host machine's localhost.
// For physical devices, replace with the server's actual IP or domain.

export const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:8000'   // FastAPI dev server on host machine
  : 'https://api.lupa.gov.br'; // Production URL

// -----------------------------------------------------------------
// Future integration with axios:
//
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
//
// export const apiClient = axios.create({
//   baseURL: API_BASE_URL,
//   headers: { 'Content-Type': 'application/json' },
//   timeout: 10000,
// });
//
// // Attach JWT token to every request automatically
// apiClient.interceptors.request.use(async (config) => {
//   const token = await AsyncStorage.getItem('@lupa:token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });
//
// // Global error handling (401 → force logout, etc.)
// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       await AsyncStorage.removeItem('@lupa:currentUser');
//       await AsyncStorage.removeItem('@lupa:token');
//     }
//     return Promise.reject(error);
//   }
// );
// -----------------------------------------------------------------

// Centralized endpoint map — mirrors FastAPI router structure.
// Updating a path here propagates everywhere in the app.
export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  dashboard: {
    stats: '/dashboard/stats',
    recentAlerts: '/dashboard/alerts/recent',
  },
  occurrences: {
    list: '/occurrences',
    create: '/occurrences',
    byId: (id: string) => `/occurrences/${id}`,
  },
  reports: {
    get: '/reports',
    history: '/reports/history',
  },
  alerts: {
    list: '/alerts',
    byId: (id: string) => `/alerts/${id}`,
    expansionDetail: '/alerts/expansion/latest',
  },
};
