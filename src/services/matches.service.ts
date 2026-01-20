/**
 * Matches Service
 * 
 * API calls related to matches management
 * Used in: ListeMatchs, MesMatchs, MatchDetail, ProgrammerMatch, ModifierMatch
 */

import { API_ENDPOINTS } from '../utils/api-constants';
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '../utils/api-helpers';

// ==================== Types ====================

export interface Match {
  id: string;
  sport_id: string;
  league_id: string;
  home_team_id: string;
  away_team_id: string;
  home_team_name: string;
  away_team_name: string;
  home_team_logo?: string;
  away_team_logo?: string;
  match_date: string;
  match_time: string;
  status: 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'CANCELLED';
  venue?: string;
  competition?: string;
  created_at: string;
  updated_at: string;
}

export interface VenueMatch {
  id: string;
  venue_id: string;
  match_id: string;
  max_capacity: number;
  price_per_person?: number;
  booking_mode: 'INSTANT' | 'REQUEST';
  is_active: boolean;
  boost_active: boolean;
  boost_expires_at?: string;
  reservations_count: number;
  available_spots: number;
  created_at: string;
  updated_at: string;
  match?: Match;
}

export interface MatchStats {
  total_reservations: number;
  confirmed_reservations: number;
  pending_reservations: number;
  cancelled_reservations: number;
  no_shows: number;
  revenue: number;
}

// ==================== Public Matches ====================

/**
 * Get all upcoming matches
 */
export async function getUpcomingMatches(params?: {
  sport_id?: string;
  league_id?: string;
  team_id?: string;
  limit?: number;
  offset?: number;
}, authToken?: string): Promise<Match[]> {
  return apiGet<Match[]>(API_ENDPOINTS.MATCHES_UPCOMING, params, authToken);
}

/**
 * Get match details
 */
export async function getMatchDetails(matchId: string, authToken?: string): Promise<Match> {
  return apiGet<Match>(API_ENDPOINTS.MATCH_DETAILS(matchId), undefined, authToken);
}

/**
 * Get venues showing a specific match
 */
export async function getMatchVenues(matchId: string, params?: {
  latitude?: number;
  longitude?: number;
  radius?: number;
}, authToken?: string): Promise<VenueMatch[]> {
  return apiGet<VenueMatch[]>(API_ENDPOINTS.MATCH_VENUES(matchId), params, authToken);
}

/**
 * Search matches
 */
export async function searchMatches(params: {
  query?: string;
  sport_id?: string;
  league_id?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}, authToken?: string): Promise<Match[]> {
  return apiGet<Match[]>(API_ENDPOINTS.MATCHES, params, authToken);
}

// ==================== Partner Matches ====================

/**
 * Get all matches for partner venues
 */
export async function getMyMatches(params?: {
  venue_id?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}, authToken?: string): Promise<VenueMatch[]> {
  return apiGet<VenueMatch[]>(API_ENDPOINTS.PARTNERS_VENUES_MATCHES, params, authToken);
}

/**
 * Get matches for a specific venue
 */
export async function getVenueMatches(venueId: string, params?: {
  status?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}, authToken?: string): Promise<VenueMatch[]> {
  return apiGet<VenueMatch[]>(API_ENDPOINTS.PARTNERS_VENUE_MATCHES(venueId), params, authToken);
}

/**
 * Get matches calendar for a venue
 */
export async function getVenueMatchesCalendar(venueId: string, params: {
  year: number;
  month: number;
}, authToken: string): Promise<VenueMatch[]> {
  return apiGet<VenueMatch[]>(API_ENDPOINTS.PARTNERS_VENUE_MATCHES_CALENDAR(venueId), params, authToken);
}

/**
 * Create a venue match (programmer un match)
 */
export async function createVenueMatch(venueId: string, data: {
  match_id: string;
  max_capacity: number;
  price_per_person?: number;
  booking_mode?: 'INSTANT' | 'REQUEST';
}, authToken: string): Promise<VenueMatch> {
  return apiPost<VenueMatch>(API_ENDPOINTS.PARTNERS_VENUE_MATCHES(venueId), data, authToken);
}

/**
 * Update a venue match
 */
export async function updateVenueMatch(venueId: string, matchId: string, data: Partial<VenueMatch>, authToken: string): Promise<VenueMatch> {
  return apiPut<VenueMatch>(API_ENDPOINTS.PARTNERS_VENUE_MATCH(venueId, matchId), data, authToken);
}

/**
 * Delete a venue match
 */
export async function deleteVenueMatch(venueId: string, matchId: string, authToken: string): Promise<void> {
  return apiDelete(API_ENDPOINTS.PARTNERS_VENUE_MATCH(venueId, matchId), authToken);
}

/**
 * Get venue match details
 */
export async function getVenueMatchDetails(venueId: string, matchId: string, authToken: string): Promise<VenueMatch> {
  return apiGet<VenueMatch>(API_ENDPOINTS.PARTNERS_VENUE_MATCH(venueId, matchId), undefined, authToken);
}

// ==================== Sports & Leagues ====================

/**
 * Get all sports
 */
export async function getAllSports(authToken?: string): Promise<any[]> {
  return apiGet(API_ENDPOINTS.SPORTS, undefined, authToken);
}

/**
 * Get sport details
 */
export async function getSportDetails(sportId: string, authToken?: string): Promise<any> {
  return apiGet(API_ENDPOINTS.SPORT_DETAILS(sportId), undefined, authToken);
}

/**
 * Get leagues for a sport
 */
export async function getSportLeagues(sportId: string, authToken?: string): Promise<any[]> {
  return apiGet(API_ENDPOINTS.SPORT_LEAGUES(sportId), undefined, authToken);
}

/**
 * Get league details
 */
export async function getLeagueDetails(leagueId: string, authToken?: string): Promise<any> {
  return apiGet(API_ENDPOINTS.LEAGUE_DETAILS(leagueId), undefined, authToken);
}

/**
 * Get teams in a league
 */
export async function getLeagueTeams(leagueId: string, authToken?: string): Promise<any[]> {
  return apiGet(API_ENDPOINTS.LEAGUE_TEAMS(leagueId), undefined, authToken);
}

/**
 * Get team details
 */
export async function getTeamDetails(teamId: string, authToken?: string): Promise<any> {
  return apiGet(API_ENDPOINTS.TEAM_DETAILS(teamId), undefined, authToken);
}

// ==================== Live Updates ====================

/**
 * Get live updates for a match
 */
export async function getMatchLiveUpdates(matchId: string, authToken?: string): Promise<any> {
  return apiGet(API_ENDPOINTS.MATCH_LIVE_UPDATES(matchId), undefined, authToken);
}
