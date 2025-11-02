import InMemoryDatabase, { Reservation } from '../lib/inMemoryDatabase';

type ReservationInsert = Partial<Reservation>;

const db = InMemoryDatabase.getInstance();

export interface ReservationWithDetails extends Reservation {
  venue_match?: {
    id: string;
    venue: {
      id: string;
      name: string;
      address: string | null;
      city: string | null;
    };
    match: {
      id: string;
      match_date: string;
      status: string;
      home_team: { name: string; logo_url: string | null };
      away_team: { name: string; logo_url: string | null };
      league: { name: string };
      sport: { name: string };
    };
  };
}

export const reservationService = {
  async createReservation(reservation: ReservationInsert): Promise<Reservation> {
    try {
      return await db.createReservation(reservation);
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  },

  async getMyReservations(userId: string): Promise<ReservationWithDetails[]> {
    try {
      return await db.getMyReservations(userId) as ReservationWithDetails[];
    } catch (error) {
      console.error('Error getting my reservations:', error);
      throw error;
    }
  },

  async getVenueReservations(venueId: string): Promise<ReservationWithDetails[]> {
    try {
      return await db.getVenueReservations(venueId) as ReservationWithDetails[];
    } catch (error) {
      console.error('Error getting venue reservations:', error);
      throw error;
    }
  },

  async updateReservationStatus(
    reservationId: string,
    status: 'pending' | 'confirmed' | 'declined' | 'cancelled' | 'completed'
  ): Promise<Reservation> {
    try {
      return await db.updateReservationStatus(reservationId, status);
    } catch (error) {
      console.error('Error updating reservation status:', error);
      throw error;
    }
  },

  async cancelReservation(reservationId: string): Promise<void> {
    try {
      await db.updateReservationStatus(reservationId, 'cancelled');
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      throw error;
    }
  },

  async getUpcomingReservations(userId: string): Promise<ReservationWithDetails[]> {
    try {
      return await db.getUpcomingReservations(userId) as ReservationWithDetails[];
    } catch (error) {
      console.error('Error getting upcoming reservations:', error);
      throw error;
    }
  },
};
