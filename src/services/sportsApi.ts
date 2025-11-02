import InMemoryDatabase from '../lib/inMemoryDatabase';

const db = InMemoryDatabase.getInstance();

export interface Sport {
  id: string;
  api_id: string;
  name: string;
  slug: string;
}

export interface League {
  id: string;
  api_id: string;
  sport_id: string;
  name: string;
  country: string | null;
  logo_url: string | null;
  season: string | null;
}

export interface Team {
  id: string;
  api_id: string;
  sport_id: string;
  name: string;
  logo_url: string | null;
  country: string | null;
}

export interface Match {
  id: string;
  api_id: string;
  sport_id: string;
  league_id: string;
  home_team_id: string;
  away_team_id: string;
  match_date: string;
  status: string;
  home_score: number;
  away_score: number;
  venue_name: string | null;
  home_team?: Team;
  away_team?: Team;
  league?: League;
  sport?: Sport;
}

export const sportsApi = {
  async getSports(): Promise<Sport[]> {
    try {
      return await db.getSports();
    } catch (error) {
      console.error('Error getting sports:', error);
      throw error;
    }
  },

  async getLeagues(sportId?: string): Promise<League[]> {
    try {
      return await db.getLeagues(sportId);
    } catch (error) {
      console.error('Error getting leagues:', error);
      throw error;
    }
  },

  async getTeams(sportId?: string): Promise<Team[]> {
    try {
      return await db.getTeams(sportId);
    } catch (error) {
      console.error('Error getting teams:', error);
      throw error;
    }
  },

  async getMatches(filters?: {
    sportId?: string;
    leagueId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<Match[]> {
    try {
      return await db.getMatches(filters) as Match[];
    } catch (error) {
      console.error('Error getting matches:', error);
      throw error;
    }
  },

  async getUpcomingMatches(limit: number = 50): Promise<Match[]> {
    try {
      return await db.getUpcomingMatches(limit) as Match[];
    } catch (error) {
      console.error('Error getting upcoming matches:', error);
      throw error;
    }
  },
};
