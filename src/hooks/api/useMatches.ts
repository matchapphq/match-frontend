/**
 * Matches API Hooks
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { matchesAPI } from '../../services/api';

// ============================================================================
// MATCHES QUERY HOOKS
// ============================================================================

export const useMatches = (
  params?: {
    limit?: number;
    offset?: number;
    status?: string;
    league_id?: string;
    scheduled_from?: string;
    scheduled_to?: string;
  },
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['matches', params],
    queryFn: () => matchesAPI.getAll(params).then((res) => res.data),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

export const useUpcomingMatches = (
  params?: { limit?: number; sport_id?: string },
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['matches', 'upcoming', params],
    queryFn: () => matchesAPI.getUpcoming(params).then((res) => res.data),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

export const useUpcomingMatchesNearby = (
  params: {
    lat: number;
    lng: number;
    distance_km?: number;
    limit?: number;
  },
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['matches', 'upcoming-nearby', params],
    queryFn: () => matchesAPI.getUpcomingNearby(params).then((res) => res.data),
    enabled: !!(params.lat && params.lng),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

export const useMatch = (matchId: string, options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['matches', matchId],
    queryFn: () => matchesAPI.getById(matchId).then((res) => res.data),
    enabled: !!matchId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useMatchVenues = (matchId: string, options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['matches', matchId, 'venues'],
    queryFn: () => matchesAPI.getVenues(matchId).then((res) => res.data),
    enabled: !!matchId,
    ...options,
  });
};

export const useMatchLiveUpdates = (matchId: string, options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['matches', matchId, 'live-updates'],
    queryFn: () => matchesAPI.getLiveUpdates(matchId).then((res) => res.data),
    enabled: !!matchId,
    refetchInterval: 30000, // Refetch every 30 seconds for live updates
    ...options,
  });
};
