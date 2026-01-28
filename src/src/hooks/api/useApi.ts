/**
 * Custom hook for API calls
 * 
 * Centralizes API logic with loading states, error handling, and caching
 * Following 100% seamless approach with snake_case
 */

import { useState, useEffect, useCallback } from 'react';

// Helper to get auth token
export const getAuthToken = (): string => {
  return localStorage.getItem('access_token') || '';
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('access_token', token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

// Generic API call hook
export function useApiCall<T>(
  apiFunction: () => Promise<T>,
  dependencies: any[] = [],
  options?: {
    immediate?: boolean; // Call immediately on mount
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(options?.immediate !== false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction();
      setData(result);
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Une erreur est survenue');
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    if (options?.immediate !== false) {
      execute();
    }
  }, [execute]);

  return { data, loading, error, refetch: execute };
}

// Mutation hook (for POST, PUT, DELETE)
export function useApiMutation<TData, TVariables = void>(
  apiFunction: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: Error, variables: TVariables) => void;
  }
) {
  const [data, setData] = useState<TData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (variables: TVariables) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(variables);
      setData(result);
      options?.onSuccess?.(result, variables);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Une erreur est survenue');
      setError(error);
      options?.onError?.(error, variables);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  return { mutate, data, loading, error };
}

// Cache system
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  duration: number = CACHE_DURATION
): Promise<T> {
  const cached = cache.get(key);
  
  if (cached && Date.now() - cached.timestamp < duration) {
    return Promise.resolve(cached.data);
  }

  return fetcher().then((data) => {
    cache.set(key, { data, timestamp: Date.now() });
    return data;
  });
}

export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

// Retry logic
export async function retryRequest<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error('Request failed');
      
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }

  throw lastError!;
}
