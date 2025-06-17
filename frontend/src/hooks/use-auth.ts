import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { api } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Verifica se há um token válido no localStorage ao carregar o hook
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Verifica se o token é válido
          const decodedToken = jwtDecode<{ exp: number }>(token);
          const isExpired = decodedToken.exp * 1000 < Date.now();
          
          if (isExpired) {
            // Tenta renovar o token se estiver expirado
            await refreshToken();
          } else {
            // Se o token for válido, busca os dados do usuário
            await fetchUser(token);
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        logout();
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  // Função para fazer login
  const login = async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      // Armazena o token no localStorage
      localStorage.setItem('token', token);
      
      // Define o token padrão para as requisições futuras
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      return user;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao fazer login';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw new Error(errorMessage);
    }
  };

  // Função para fazer logout
  const logout = useCallback(() => {
    // Remove o token do localStorage
    localStorage.removeItem('token');
    
    // Remove o token das requisições futuras
    delete api.defaults.headers.common['Authorization'];
    
    // Atualiza o estado
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    
    // Redireciona para a página de login
    router.push('/login');
  }, [router]);

  // Função para renovar o token
  const refreshToken = async () => {
    try {
      const response = await api.post('/auth/refresh-token');
      const { token, user } = response.data;
      
      // Atualiza o token no localStorage
      localStorage.setItem('token', token);
      
      // Atualiza o token nas requisições futuras
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setState(prev => ({
        ...prev,
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      }));
      
      return token;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      logout();
      throw error;
    }
  };

  // Função para buscar os dados do usuário
  const fetchUser = async (token: string) => {
    try {
      const response = await api.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const user = response.data;
      
      setState(prev => ({
        ...prev,
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      }));
      
      return user;
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      logout();
      throw error;
    }
  };

  // Função para atualizar os dados do usuário
  const updateUser = async (userData: Partial<User>) => {
    try {
      const response = await api.put('/auth/me', userData);
      const updatedUser = response.data;
      
      setState(prev => ({
        ...prev,
        user: updatedUser,
      }));
      
      return updatedUser;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erro ao atualizar perfil';
      setState(prev => ({
        ...prev,
        error: errorMessage,
      }));
      throw new Error(errorMessage);
    }
  };

  return {
    ...state,
    login,
    logout,
    refreshToken,
    updateUser,
  };
}
