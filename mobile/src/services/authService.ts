import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/User';
import { LoginCredentials, RegisterCredentials } from '../types/Auth';

const CURRENT_USER_KEY = '@lupa:currentUser';
const USERS_DB_KEY = '@lupa:usersDB';

// Pre-seeded demo account so the app works out of the box.
const DEMO_USER: User & { senha: string } = {
  id: '1',
  nome: 'João Silva',
  email: 'joao@prefeitura.gov.br',
  senha: 'senha123',
  tipoConta: 'agente',
};

async function getUsersDB(): Promise<Array<User & { senha: string }>> {
  const json = await AsyncStorage.getItem(USERS_DB_KEY);
  return json ? JSON.parse(json) : [DEMO_USER];
}

async function saveUsersDB(users: Array<User & { senha: string }>): Promise<void> {
  await AsyncStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
}

export const authService = {
  // TODO: replace body with → apiClient.post(endpoints.auth.login, credentials)
  async login(credentials: LoginCredentials): Promise<User> {
    const users = await getUsersDB();
    const found = users.find(
      (u) => u.email === credentials.email && u.senha === credentials.senha
    );
    if (!found) throw new Error('Email ou senha incorretos.');

    const { senha: _, ...user } = found;
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  // TODO: replace body with → apiClient.post(endpoints.auth.register, data)
  async register(data: RegisterCredentials): Promise<User> {
    const users = await getUsersDB();
    if (users.some((u) => u.email === data.email)) {
      throw new Error('Este email já está cadastrado.');
    }

    const newUser: User & { senha: string } = {
      id: Date.now().toString(),
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      tipoConta: 'agente',
    };

    await saveUsersDB([...users, newUser]);
    const { senha: _, ...user } = newUser;
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  },

  // TODO: replace body with → apiClient.post(endpoints.auth.logout)
  async logout(): Promise<void> {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  },

  // TODO: replace body with → apiClient.get(endpoints.auth.me)
  async getCurrentUser(): Promise<User | null> {
    const json = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return json ? JSON.parse(json) : null;
  },

  async loginAsVisitor(): Promise<User> {
    const visitor: User = {
      id: `visitor-${Date.now()}`,
      nome: 'Visitante',
      email: '',
      tipoConta: 'visitante',
    };
    // Visitor session is stored so the app survives a hot-reload,
    // but is not persisted to the users database.
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(visitor));
    return visitor;
  },
};
