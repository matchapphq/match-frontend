import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { Match, MatchesResponse, VenueMatch, ScheduleMatchRequest } from '../lib/types';

// Matches API functions
const matchesApi = {
  getAllMatches: async (): Promise<MatchesResponse> => {
    const response = await api.get('/matches');
    return response.data;
  },

  getUpcomingMatches: async (): Promise<MatchesResponse> => {
    const response = await api.get('/matches/upcoming-nearby');
    return response.data;
  },

  getMatchDetails: async (matchId: string): Promise<{ match: Match }> => {
    const response = await api.get(`/matches/${matchId}`);
    return response.data;
  },

  scheduleMatchAtVenue: async (venueId: string, data: ScheduleMatchRequest): Promise<{ venueMatch: VenueMatch }> => {
    const response = await api.post(`/partners/venues/${venueId}/matches`, data);
    return response.data;
  },

  cancelMatchAtVenue: async (venueId: string, matchId: string): Promise<void> => {
    await api.delete(`/partners/venues/${venueId}/matches/${matchId}`);
  },

  getVenueScheduledMatches: async (venueId: string): Promise<{ venueMatches: VenueMatch[] }> => {
    const response = await api.get(`/venues/${venueId}/matches`);
    return response.data;
  },
};

// Hooks
export function useAllMatches() {
  return useQuery({
    queryKey: ['matches'],
    queryFn: matchesApi.getAllMatches,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpcomingMatches() {
  return useQuery({
    queryKey: ['matches', 'upcoming'],
    queryFn: matchesApi.getUpcomingMatches,
    staleTime: 2 * 60 * 1000,
  });
}

export function useMatchDetails(matchId: string | undefined) {
  return useQuery({
    queryKey: ['match', matchId],
    queryFn: () => matchesApi.getMatchDetails(matchId!),
    enabled: !!matchId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useScheduleMatch(venueId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ScheduleMatchRequest) => matchesApi.scheduleMatchAtVenue(venueId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venue-matches', venueId] });
      queryClient.invalidateQueries({ queryKey: ['my-venues'] });
    },
  });
}

export function useCancelMatch(venueId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (matchId: string) => matchesApi.cancelMatchAtVenue(venueId, matchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venue-matches', venueId] });
      queryClient.invalidateQueries({ queryKey: ['my-venues'] });
    },
  });
}

export function useVenueScheduledMatches(venueId: string | undefined) {
  return useQuery({
    queryKey: ['venue-matches', venueId],
    queryFn: () => matchesApi.getVenueScheduledMatches(venueId!),
    enabled: !!venueId,
    staleTime: 2 * 60 * 1000,
  });
}
