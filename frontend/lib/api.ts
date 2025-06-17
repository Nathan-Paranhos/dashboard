import axios from 'axios';

// Função para obter o token do localStorage de forma segura no cliente
const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

export const setAccessToken = (token: string | null) => {
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
  }
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Permite o envio de cookies (necessário para o refresh token)
});

// Interceptor para adicionar o token de acesso a todas as requisições
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com a renovação de token
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Se o erro for 401 e não for uma tentativa de renovação de token
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tenta obter um novo access token usando o refresh token (que está no cookie)
        const { data } = await api.post('/auth/refresh-token');
        const newAccessToken = data.accessToken;
        
        setAccessToken(newAccessToken);
        
        // Atualiza o header da requisição original e a reenvia
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return api(originalRequest);

      } catch (refreshError) {
        // Se a renovação falhar, o usuário precisa fazer login novamente
        setAccessToken(null);
        console.error('Session expired. Please log in again.');
        // Exemplo: window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
