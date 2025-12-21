/**
 * Matches Service
 * Handles sports matches, leagues, teams, and sports data
 */

import api from './api';
import type {
  Match,
  Team,
  League,
  Sport,
  VenueMatch,
  PaginationParams,
} from './types';

interface GetMatchesParams extends PaginationParams {
  status?: string;
  league_id?: string;
  home_team_id?: string;
  away_team_id?: string;
  scheduled_from?: string;
  scheduled_to?: string;
}

export const matchesService = {
  /**
   * Get all matches with filters
   */
  async getAll(params?: GetMatchesParams): Promise<{ matches: Match[]; total: number }> {
    return api.get('/matches', params);
  },

  /**
   * Get match details by ID
   */
  async getById(matchId: string): Promise<{
    match: Match;
    venues: VenueMatch[];
    teams: { home: Team; away: Team };
  }> {
    return api.get(`/matches/${matchId}`);
  },

  /**
   * Get nearby matches for the current user
   */
  async getNearby(params?: { distance_km?: number; limit?: number }): Promise<{ matches: Match[] }> {
    return api.get('/matches/nearby', params);
  },
};

export const sportsService = {
  /**
   * Get all sports
   */
  async getAll(params?: PaginationParams & { is_active?: boolean }): Promise<{ sports: Sport[]; total: number }> {
    return api.get('/sports', params);
  },

  /**
   * Get sport by ID
   */
  async getById(sportId: string): Promise<{ sport: Sport }> {
    return api.get(`/sports/${sportId}`);
  },

  /**
   * Get leagues for a sport
   */
  async getLeagues(sportId: string, params?: { country?: string; is_active?: boolean }): Promise<{ leagues: League[] }> {
    return api.get(`/sports/${sportId}/leagues`, params);
  },
};

export const leaguesService = {
  /**
   * Get league by ID
   */
  async getById(leagueId: string): Promise<{ league: League; teams: Team[] }> {
    return api.get(`/leagues/${leagueId}`);
  },

  /**
   * Get teams in a league
   */
  async getTeams(leagueId: string, params?: PaginationParams): Promise<{ teams: Team[]; total: number }> {
    return api.get(`/leagues/${leagueId}/teams`, params);
  },
};

export const teamsService = {
  /**
   * Get team by ID
   */
  async getById(teamId: string): Promise<{ team: Team }> {
    return api.get(`/teams/${teamId}`);
  },
};

/**
 * Venue Matches Service
 * Handles match broadcasting at venues
 */
export const venueMatchesService = {
  /**
   * Get matches at a venue
   */
  async getByVenue(venueId: string, params?: PaginationParams & { status?: string }): Promise<{
    matches: VenueMatch[];
    total: number;
  }> {
    return api.get(`/venues/${venueId}/matches`, params);
  },

  /**
   * Add a match to venue for broadcasting
   */
  async create(venueId: string, data: {
    match_id: string;
    total_seats: number;
    allows_reservations?: boolean;
    estimated_crowd_level?: string;
    notes?: string;
  }): Promise<{ venueMatch: VenueMatch }> {
    return api.post(`/venues/${venueId}/matches`, data);
  },

  /**
   * Update venue match details
   */
  async update(venueId: string, venueMatchId: string, data: {
    total_seats?: number;
    available_seats?: number;
    allows_reservations?: boolean;
    is_active?: boolean;
    is_featured?: boolean;
    estimated_crowd_level?: string;
    notes?: string;
  }): Promise<{ venueMatch: VenueMatch }> {
    return api.put(`/venues/${venueId}/matches/${venueMatchId}`, data);
  },

  /**
   * Remove match from venue
   */
  async delete(venueId: string, venueMatchId: string): Promise<{ message: string }> {
    return api.delete(`/venues/${venueId}/matches/${venueMatchId}`);
  },
};

export default matchesService;
