import axios from 'axios';

// Use environment variable for API URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://match-api:8008/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token if needed
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Track if we've already tried refreshing (one shot per session)
let hasTriedRefresh = false;
let isRefreshing = false;
let refreshSubscribers: ((success: boolean) => void)[] = [];

const onRefreshComplete = (success: boolean) => {
  refreshSubscribers.forEach(callback => callback(success));
  refreshSubscribers = [];
};

// Response interceptor - refresh token ONCE on first 401, then no more
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and haven't tried refresh yet
    if (error.response?.status === 401 && !hasTriedRefresh && !originalRequest._isRetry) {
      
      if (isRefreshing) {
        // Wait for ongoing refresh to complete
        return new Promise((resolve, reject) => {
          refreshSubscribers.push((success) => {
            if (success) {
              originalRequest._isRetry = true;
              resolve(api(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      isRefreshing = true;
      hasTriedRefresh = true; // Mark as tried - won't refresh again this session
      originalRequest._isRetry = true;

      try {
        await api.post('/auth/refresh-token');
        isRefreshing = false;
        onRefreshComplete(true);
        return api(originalRequest);
      } catch {
        isRefreshing = false;
        onRefreshComplete(false);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// Reset refresh state (call on logout or page unload if needed)
export const resetRefreshState = () => {
  hasTriedRefresh = false;
};

export default api;
