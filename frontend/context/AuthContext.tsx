'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api, { setAccessToken } from '../lib/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'vendedor';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (accessToken: string, userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        // Tenta obter um novo token de acesso silenciosamente ao carregar a página
        const { data } = await api.post('/auth/refresh-token');
        if (data.accessToken) {
          const response = await api.get('/auth/verify'); // Verifica o novo token e obtém os dados do usuário
          login(data.accessToken, response.data.user);
        }
      } catch (error) {
        console.log('No active session');
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = (accessToken: string, userData: User) => {
    setAccessToken(accessToken);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    }
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
    // Opcional: redirecionar para a página de login
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
