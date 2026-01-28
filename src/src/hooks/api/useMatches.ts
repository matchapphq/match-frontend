import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { API_ENDPOINTS } from '../../utils/api-constants';

// Types
export interface VenueMatch {
  id: string;
  venue_id: string;
  match_id: string;
  capacity: number;
  reservations_count: number;
  price?: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  created_at: string;
  match?: Match;
}

export interface Match {
  id: string;
  home_team: {
    id: string;
    name: string;
    logo_url?: string;
  };
  away_team: {
    id: string;
    name: string;
    logo_url?: string;
  };
  start_time: string;
  status: string;
  competition?: {
    id: string;
    name: string;
  };
  sport?: {
    id: string;
    name: string;
    emoji?: string;
  };
}

export interface UpcomingMatch extends Match {
  venue_count?: number;
}

// Hook to fetch partner's scheduled matches across all venues
export function usePartnerMatches() {
  return useQuery({
    queryKey: ['partner-matches'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.PARTNERS_VENUES_MATCHES);
      return response.data;
    },
  });
}

// Hook to fetch upcoming matches (public matches available to schedule)
export function useUpcomingMatches(options?: {
  sport_id?: string;
  date?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['upcoming-matches', options],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.sport_id) params.append('sport_id', options.sport_id);
      if (options?.date) params.append('date', options.date);
      if (options?.search) params.append('search', options.search);
      
      const url = `${API_ENDPOINTS.MATCHES_UPCOMING}${params.toString() ? `?${params}` : ''}`;
      const response = await apiClient.get(url);
      return response.data;
    },
  });
}

// Hook to fetch all public matches
export function useMatches(options?: {
  sport_id?: string;
  from_date?: string;
  to_date?: string;
}) {
  return useQuery({
    queryKey: ['matches', options],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (options?.sport_id) params.append('sport_id', options.sport_id);
      if (options?.from_date) params.append('from_date', options.from_date);
      if (options?.to_date) params.append('to_date', options.to_date);
      
      const url = `${API_ENDPOINTS.MATCHES}${params.toString() ? `?${params}` : ''}`;
      const response = await apiClient.get(url);
      return response.data;
    },
  });
}

// Hook to fetch a single match details
export function useMatchDetails(matchId: string | null) {
  return useQuery({
    queryKey: ['match', matchId],
    queryFn: async () => {
      if (!matchId) return null;
      const response = await apiClient.get(API_ENDPOINTS.MATCH_DETAILS(matchId));
      return response.data;
    },
    enabled: !!matchId,
  });
}

// Hook to schedule a match at a venue
export function useScheduleMatch() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ venueId, matchId, capacity, price }: {
      venueId: string;
      matchId: string;
      capacity: number;
      price?: number;
    }) => {
      const response = await apiClient.post(
        `/partners/venues/${venueId}/matches`,
        { match_id: matchId, capacity, price }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner-matches'] });
    },
  });
}

// Hook to update a scheduled match
export function useUpdateScheduledMatch() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ venueId, matchId, capacity, price }: {
      venueId: string;
      matchId: string;
      capacity?: number;
      price?: number;
    }) => {
      const response = await apiClient.put(
        API_ENDPOINTS.PARTNERS_VENUE_MATCH(venueId, matchId),
        { capacity, price }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner-matches'] });
    },
  });
}

// Hook to cancel/delete a scheduled match
export function useCancelScheduledMatch() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ venueId, matchId }: { venueId: string; matchId: string }) => {
      const response = await apiClient.delete(
        API_ENDPOINTS.PARTNERS_VENUE_MATCH(venueId, matchId)
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner-matches'] });
    },
  });
}

// Hook to fetch sports list
export function useSports() {
  return useQuery({
    queryKey: ['sports'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.SPORTS);
      return response.data;
    },
  });
}

// Hook to fetch reservations for a specific venue-match
export function useVenueMatchReservations(venueMatchId: string | null) {
  return useQuery({
    queryKey: ['venue-match-reservations', venueMatchId],
    queryFn: async () => {
      if (!venueMatchId) return null;
      const response = await apiClient.get(API_ENDPOINTS.RESERVATIONS_VENUE_MATCH(venueMatchId));
      return response.data;
    },
    enabled: !!venueMatchId,
  });
}
