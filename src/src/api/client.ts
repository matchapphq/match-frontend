import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL } from '../utils/api-constants';

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from storage (adapt key as needed)
    const token = localStorage.getItem('authToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized (e.g., token expired)
    if (error.response?.status === 401) {
        // TODO: Implement token refresh or logout logic
        // For now, we might want to just reject
        console.warn('Unauthorized access - redirecting to login?');
        // localStorage.removeItem('authToken');
        // window.location.href = '/login'; 
    }

    // Standardize error message
    const errorMessage = (error.response?.data as any)?.message || 
                         (error.response?.data as any)?.error || 
                         error.message || 
                         'An unexpected error occurred';
                         
    return Promise.reject(new Error(errorMessage));
  }
);

export default apiClient;
