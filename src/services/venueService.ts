import InMemoryDatabase, { Venue } from '../lib/inMemoryDatabase';

type VenueInsert = Partial<Venue>;
type VenueUpdate = Partial<Venue>;

const db = InMemoryDatabase.getInstance();

export interface VenueWithMatches extends Venue {
  venue_matches?: Array<{
    id: string;
    match_id: string;
    available_seats: number;
    match: {
      id: string;
      match_date: string;
      status: string;
      home_team: { name: string; logo_url: string | null };
      away_team: { name: string; logo_url: string | null };
      league: { name: string; logo_url: string | null };
      sport: { name: string };
    };
  }>;
}

export const venueService = {
  async getMyVenues(userId: string): Promise<Venue[]> {
    try {
      return await db.getVenues(userId);
    } catch (error) {
      console.error('Error getting venues:', error);
      throw error;
    }
  },

  async getAllVenues(): Promise<Venue[]> {
    try {
      return await db.getAllActiveVenues();
    } catch (error) {
      console.error('Error getting all venues:', error);
      throw error;
    }
  },

  async getVenueById(id: string): Promise<VenueWithMatches | null> {
    try {
      return await db.getVenueWithMatches(id);
    } catch (error) {
      console.error('Error getting venue by id:', error);
      throw error;
    }
  },

  async createVenue(venue: VenueInsert): Promise<Venue> {
    try {
      return await db.createVenue(venue);
    } catch (error) {
      console.error('Error creating venue:', error);
      throw error;
    }
  },

  async updateVenue(id: string, updates: VenueUpdate): Promise<Venue> {
    try {
      return await db.updateVenue(id, updates);
    } catch (error) {
      console.error('Error updating venue:', error);
      throw error;
    }
  },

  async deleteVenue(id: string): Promise<void> {
    try {
      await db.deleteVenue(id);
    } catch (error) {
      console.error('Error deleting venue:', error);
      throw error;
    }
  },

  async addMatchToVenue(
    venueId: string,
    matchId: string,
    availableSeats: number,
    pricePerSeat?: number,
    minimumSpend?: number
  ) {
    try {
      return await db.createVenueMatch({
        venue_id: venueId,
        match_id: matchId,
        available_seats: availableSeats,
        price_per_seat: pricePerSeat,
        minimum_spend: minimumSpend,
      });
    } catch (error) {
      console.error('Error adding match to venue:', error);
      throw error;
    }
  },

  async removeMatchFromVenue(venueMatchId: string): Promise<void> {
    try {
      await db.deleteVenueMatch(venueMatchId);
    } catch (error) {
      console.error('Error removing match from venue:', error);
      throw error;
    }
  },

  async getVenuesByMatch(matchId: string): Promise<VenueWithMatches[]> {
    try {
      return await db.getVenuesByMatch(matchId) as VenueWithMatches[];
    } catch (error) {
      console.error('Error getting venues by match:', error);
      throw error;
    }
  },
};
