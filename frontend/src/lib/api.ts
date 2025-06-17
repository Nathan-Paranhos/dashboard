import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Criar instância do axios
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptar requisições para adicionar o token de autenticação
api.interceptors.request.use(
  (config) => {
    // Verificar se o token está disponível no localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptar respostas para lidar com erros de autenticação
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    const router = useRouter();
    
    // Se o erro for 401 (não autorizado) e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Tentar renovar o token
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
        const { token, user } = response.data;
        
        // Atualizar tokens e cabeçalhos
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Repetir a requisição original com o novo token
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return api(originalRequest);
      } catch (error) {
        // Se houver erro ao renovar o token, fazer logout
        const { logout } = useAuth();
        logout();
        router.push('/login');
        return Promise.reject(error);
      }
    }
    
    // Se for um erro 403 (proibido), redirecionar para a página de permissão negada
    if (error.response?.status === 403) {
      router.push('/unauthorized');
    }
    
    return Promise.reject(error);
  }
);

export default api;
