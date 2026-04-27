import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../utils/api-constants';
import type { LogoutReason } from '../features/authentication/types/logout';

// Extend axios config to track retry attempts
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const extractBackendError = (error: unknown): string | null => {
  if (!error || typeof error !== 'object') return null;

  const maybeAxiosError = error as AxiosError<{ error?: string; message?: string }>;
  const responseError = maybeAxiosError.response?.data?.error || maybeAxiosError.response?.data?.message;
  if (typeof responseError === 'string' && responseError.trim().length > 0) {
    return responseError.trim();
  }

  if ('message' in (error as object) && typeof (error as { message?: unknown }).message === 'string') {
    const value = (error as { message: string }).message.trim();
    return value.length > 0 ? value : null;
  }

  return null;
};

const resolveLogoutReason = (backendError: string | null): LogoutReason => {
  const normalized = backendError?.trim().toUpperCase() || '';

  if (normalized === 'SESSION_EXPIRED_INACTIVE' || normalized === 'SESSION EXPIRED INACTIVE') {
    return 'session_inactive';
  }
  if (normalized === 'SESSION_HIJACK_DETECTED') {
    return 'session_security';
  }
  if (
    normalized === 'INVALID_SESSION' ||
    normalized === 'SESSION INVALID' ||
    normalized === 'SESSION REVOKED'
  ) {
    return 'session_invalidated';
  }
  if (normalized === 'INVALID_REFRESH_TOKEN') {
    return 'session_expired';
  }

  return 'token_refresh_failed';
};

const dispatchLogoutEvent = (reason: LogoutReason, backendError?: string | null) => {
  window.dispatchEvent(
    new CustomEvent('auth:logout', {
      detail: {
        reason,
        backend_error: backendError || null,
      },
    })
  );
};

// Token refresh state to prevent multiple simultaneous refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
  withCredentials: true, // Include cookies for auth (matches services/api.ts)
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from storage (check local then session)
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with token refresh logic
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    
    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // Don't retry refresh token endpoint itself
      if (originalRequest.url?.includes('/auth/refresh-token')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedRefreshToken = localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
        if (!storedRefreshToken) {
          throw new Error('MISSING_REFRESH_TOKEN');
        }

        // Call refresh token endpoint
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refresh_token: storedRefreshToken },
          { withCredentials: true }
        );

        const newToken = response.data.token;
        const newRefreshToken = response.data.refresh_token;

        if (!newToken) {
          throw new Error('TOKEN_REFRESH_NO_TOKEN');
        }

        // Save new token
        localStorage.setItem('authToken', newToken);
        if (newRefreshToken) {
          localStorage.setItem('refresh_token', newRefreshToken);
        }
        
        // Update authorization header for the original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        // Process queued requests with new token
        processQueue(null, newToken);

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        const backendError = extractBackendError(refreshError);
        const reason: LogoutReason =
          backendError === 'MISSING_REFRESH_TOKEN'
            ? 'missing_refresh_token'
            : resolveLogoutReason(backendError);

        processQueue(new Error(backendError || 'Token refresh failed'), null);
        
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        localStorage.removeItem('refresh_token');
        sessionStorage.removeItem('refresh_token');
        
        // Dispatch a custom event that the auth context can listen to
        dispatchLogoutEvent(reason, backendError);
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
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
