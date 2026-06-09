import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/User';
import { LoginCredentials, RegisterCredentials } from '../types/Auth';
import { lupaApi, ApiHttpError, AuthUserDTO } from './lupaApi';

const CURRENT_USER_KEY = '@lupa:currentUser';
const USERS_DB_KEY = '@lupa:usersDB';

// Pre-seeded demo account so the app works out of the box (fallback offline).
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

/** Converte o usuário retornado pela API real no modelo do app. */
function toUser(dto: AuthUserDTO): User {
  return { id: String(dto.id), nome: dto.nome, email: dto.email, tipoConta: 'agente' };
}

async function persistSession(user: User): Promise<void> {
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export const authService = {
  /**
   * Login: tenta autenticar na API real (senha verificada contra hash BCrypt).
   * - Se o backend responder (online): confia na resposta — credenciais inválidas
   *   (401) viram erro amigável; não há fallback silencioso.
   * - Se o backend estiver inacessível (rede/timeout): cai no fallback local (mock),
   *   para o app continuar utilizável offline.
   */
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const dto = await lupaApi.login(credentials);
      const user = toUser(dto);
      await persistSession(user);
      return user;
    } catch (e) {
      if (e instanceof ApiHttpError) {
        if (e.status === 401) throw new Error('Email ou senha incorretos.');
        throw new Error('Não foi possível entrar. Tente novamente.');
      }
      // Backend inacessível -> fallback local
      return loginLocal(credentials);
    }
  },

  /**
   * Cadastro: tenta criar no backend real (senha salva como hash BCrypt).
   * 409 = e-mail já existe; 400 = validação. Sem backend, cai no mock local.
   */
  async register(data: RegisterCredentials): Promise<User> {
    try {
      const dto = await lupaApi.register(data);
      const user = toUser(dto);
      await persistSession(user);
      return user;
    } catch (e) {
      if (e instanceof ApiHttpError) {
        if (e.status === 409) throw new Error('Este email já está cadastrado.');
        if (e.status === 400) throw new Error('Dados inválidos. A senha deve ter ao menos 6 caracteres.');
        throw new Error('Não foi possível cadastrar. Tente novamente.');
      }
      // Backend inacessível -> fallback local
      return registerLocal(data);
    }
  },

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  },

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
    await persistSession(visitor);
    return visitor;
  },
};

// ----------------- Fallback local (offline / mock) -----------------
async function loginLocal(credentials: LoginCredentials): Promise<User> {
  const users = await getUsersDB();
  const found = users.find(
    (u) => u.email === credentials.email && u.senha === credentials.senha
  );
  if (!found) throw new Error('Email ou senha incorretos.');
  const { senha: _omit, ...user } = found;
  await persistSession(user);
  return user;
}

async function registerLocal(data: RegisterCredentials): Promise<User> {
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
  const { senha: _omit, ...user } = newUser;
  await persistSession(user);
  return user;
}
