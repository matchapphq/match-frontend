import { useState, useEffect, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

interface UseApiOptions {
  immediate?: boolean;
}

/**
 * Generic hook for API calls with loading and error states
 */
export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = { immediate: true }
): UseApiState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: options.immediate ?? true,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const data = await apiCall();
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({ data: null, isLoading: false, error: error as Error });
    }
  }, [apiCall]);

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [execute, options.immediate]);

  return { ...state, refetch: execute };
}

/**
 * Hook for mutations (POST, PUT, DELETE)
 */
export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>
) {
  const [state, setState] = useState<{
    data: TData | null;
    isLoading: boolean;
    error: Error | null;
  }>({
    data: null,
    isLoading: false,
    error: null,
  });

  const mutate = useCallback(
    async (variables: TVariables): Promise<TData> => {
      setState({ data: null, isLoading: true, error: null });
      try {
        const data = await mutationFn(variables);
        setState({ data, isLoading: false, error: null });
        return data;
      } catch (error) {
        setState({ data: null, isLoading: false, error: error as Error });
        throw error;
      }
    },
    [mutationFn]
  );

  return { ...state, mutate };
}
