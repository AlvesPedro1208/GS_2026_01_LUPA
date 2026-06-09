import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { User } from '../types/User';
import { LoginCredentials, RegisterCredentials } from '../types/Auth';

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  loginAsVisitor: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on app start
  useEffect(() => {
    authService.getCurrentUser()
      .then(setUser)
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const loggedUser = await authService.login(credentials);
    setUser(loggedUser);
  }, []);

  const register = useCallback(async (data: RegisterCredentials) => {
    const newUser = await authService.register(data);
    setUser(newUser);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const loginAsVisitor = useCallback(async () => {
    const visitor = await authService.loginAsVisitor();
    setUser(visitor);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, loginAsVisitor }}>
      {children}
    </AuthContext.Provider>
  );
};
