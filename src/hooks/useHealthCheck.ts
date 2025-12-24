import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health');
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export function useHealthCheck() {
  return useQuery({
    queryKey: ['health-check'],
    queryFn: checkHealth,
    retry: 2,
    retryDelay: 1000,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Recheck every minute
  });
}
