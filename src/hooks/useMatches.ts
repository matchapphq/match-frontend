/**
 * Matches Hook
 * 
 * Custom hooks for match-related API calls
 */

import { useApiCall, useApiMutation, getAuthToken } from './useApi';
import * as MatchesService from '../services/matches.service';
import type { Match, VenueMatch } from '../services/matches.service';

// ==================== Get Matches ====================

export function useUpcomingMatches(params?: {
  sport_id?: string;
  league_id?: string;
  team_id?: string;
  limit?: number;
  offset?: number;
}) {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => MatchesService.getUpcomingMatches(params, authToken),
    [JSON.stringify(params), authToken]
  );
}

export function useMatchDetails(matchId: string) {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => MatchesService.getMatchDetails(matchId, authToken),
    [matchId, authToken]
  );
}

export function useMatchVenues(matchId: string, params?: {
  latitude?: number;
  longitude?: number;
  radius?: number;
}) {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => MatchesService.getMatchVenues(matchId, params, authToken),
    [matchId, JSON.stringify(params), authToken]
  );
}

export function useMyMatches(params?: {
  venue_id?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}) {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => MatchesService.getMyMatches(params, authToken),
    [JSON.stringify(params), authToken]
  );
}

export function useVenueMatches(venueId: string, params?: {
  status?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}) {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => MatchesService.getVenueMatches(venueId, params, authToken),
    [venueId, JSON.stringify(params), authToken]
  );
}

export function useVenueMatchDetails(venueId: string, matchId: string) {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => MatchesService.getVenueMatchDetails(venueId, matchId, authToken),
    [venueId, matchId, authToken]
  );
}

export function useAllSports() {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => MatchesService.getAllSports(authToken),
    [authToken]
  );
}

export function useSportLeagues(sportId: string) {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => MatchesService.getSportLeagues(sportId, authToken),
    [sportId, authToken],
    { immediate: !!sportId }
  );
}

export function useLeagueTeams(leagueId: string) {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => MatchesService.getLeagueTeams(leagueId, authToken),
    [leagueId, authToken],
    { immediate: !!leagueId }
  );
}

// ==================== Mutations ====================

export function useCreateVenueMatch(venueId: string) {
  const authToken = getAuthToken();
  
  return useApiMutation<VenueMatch, {
    match_id: string;
    max_capacity: number;
    price_per_person?: number;
    booking_mode?: 'INSTANT' | 'REQUEST';
  }>(
    (data) => MatchesService.createVenueMatch(venueId, data, authToken)
  );
}

export function useUpdateVenueMatch(venueId: string, matchId: string) {
  const authToken = getAuthToken();
  
  return useApiMutation<VenueMatch, Partial<VenueMatch>>(
    (data) => MatchesService.updateVenueMatch(venueId, matchId, data, authToken)
  );
}

export function useDeleteVenueMatch(venueId: string) {
  const authToken = getAuthToken();
  
  return useApiMutation<void, string>(
    (matchId) => MatchesService.deleteVenueMatch(venueId, matchId, authToken)
  );
}
