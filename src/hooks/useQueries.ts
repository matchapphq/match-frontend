import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

// Query keys for cache management
export const queryKeys = {
  venues: ['venues'] as const,
  matches: ['matches'] as const,
  clients: (venueIds: string[]) => ['clients', ...venueIds] as const,
  analytics: ['analytics'] as const,
  customerStats: ['customerStats'] as const,
  notifications: ['notifications'] as const,
};

// Stale time: 30 seconds - data is considered fresh for this duration
const STALE_TIME = 30 * 1000;

// Cache time: 5 minutes - data stays in cache for this duration
const CACHE_TIME = 5 * 60 * 1000;

// Venues query
export function useVenuesQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.venues,
    queryFn: async () => {
      const response = await api.getMyVenues();
      return response?.venues || [];
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled,
  });
}

// Matches query
export function useMatchesQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.matches,
    queryFn: async () => {
      const response = await api.getMyMatches();
      return response?.data || [];
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled,
  });
}

// Clients query - depends on venue IDs
export function useClientsQuery(venueIds: string[], enabled = true) {
  return useQuery({
    queryKey: queryKeys.clients(venueIds),
    queryFn: async () => {
      if (venueIds.length === 0) return [];
      const response = await api.getAllClients(venueIds);
      return response?.clients || [];
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled: enabled && venueIds.length > 0,
  });
}

// Analytics summary query
export function useAnalyticsQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.analytics,
    queryFn: async () => {
      const response = await api.getAnalyticsSummary();
      return response || {
        total_clients: 0,
        total_reservations: 0,
        total_views: 0,
        matches_completed: 0,
        matches_upcoming: 0,
        average_occupancy: 0,
      };
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled,
  });
}

// Customer stats query
export function useCustomerStatsQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.customerStats,
    queryFn: async () => {
      const response = await api.getCustomerStats();
      return response || {
        customerCount: 0,
        totalGuests: 0,
        totalReservations: 0,
        period: 'last_30_days',
      };
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled,
  });
}

// Notifications query
export function useNotificationsQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: async () => {
      const response = await api.getNotifications();
      return response?.notifications || [];
    },
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    enabled,
  });
}

// Hook to invalidate all queries (for force refresh)
export function useInvalidateAllQueries() {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.venues });
    queryClient.invalidateQueries({ queryKey: queryKeys.matches });
    queryClient.invalidateQueries({ queryKey: ['clients'] });
    queryClient.invalidateQueries({ queryKey: queryKeys.analytics });
    queryClient.invalidateQueries({ queryKey: queryKeys.customerStats });
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
  };
}
