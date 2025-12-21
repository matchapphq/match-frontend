/**
 * Reservations Service
 * Handles reservations for both users and venue owners
 */

import api from './api';
import type {
  Reservation,
  ReservationsResponse,
  PaginationParams,
  MessageResponse,
} from './types';

interface GetReservationsParams extends PaginationParams {
  status?: string;
}

export const reservationsService = {
  /**
   * Get current user's reservations
   */
  async getMyReservations(params?: GetReservationsParams): Promise<ReservationsResponse> {
    return api.get('/reservations', params);
  },

  /**
   * Get reservation by ID
   */
  async getById(reservationId: string): Promise<{
    reservation: Reservation;
    venue: { name: string; location: { latitude: number; longitude: number } };
    match: { home_team: unknown; away_team: unknown; scheduled_at: string };
  }> {
    return api.get(`/reservations/${reservationId}`);
  },

  /**
   * Hold a table (15 min temporary hold)
   */
  async holdTable(data: {
    venue_match_id: string;
    party_size: number;
    requires_accessibility?: boolean;
  }): Promise<{
    hold_id: string;
    expires_at: string;
    table: { name: string; capacity: number };
  }> {
    return api.post('/reservations/hold', data);
  },

  /**
   * Confirm reservation from hold
   */
  async confirmReservation(data: {
    hold_id: string;
    special_requests?: string;
  }): Promise<{
    reservation: Reservation;
    qr_code: string;
  }> {
    return api.post('/reservations/confirm', data);
  },

  /**
   * Cancel a reservation
   */
  async cancel(reservationId: string, reason?: string): Promise<{ reservation: Reservation }> {
    return api.post(`/reservations/${reservationId}/cancel`, { reason });
  },

  /**
   * Check-in to a reservation
   */
  async checkIn(reservationId: string, qrCode?: string): Promise<{ reservation: Reservation }> {
    return api.post(`/reservations/${reservationId}/check-in`, { qr_code: qrCode });
  },

  // =============================================
  // VENUE OWNER ENDPOINTS
  // =============================================

  /**
   * Get reservations for a venue match (venue owner dashboard)
   */
  async getVenueMatchReservations(venueMatchId: string): Promise<ReservationsResponse> {
    return api.get(`/reservations/venue-match/${venueMatchId}`);
  },

  /**
   * Verify QR code (venue owner scans user's QR)
   */
  async verifyQR(qrCode: string): Promise<{
    valid: boolean;
    reservation?: Reservation;
    message?: string;
  }> {
    return api.post('/reservations/verify-qr', { qr_code: qrCode });
  },

  // =============================================
  // WAITLIST ENDPOINTS
  // =============================================

  /**
   * Join waitlist when no tables available
   */
  async joinWaitlist(data: {
    venue_match_id: string;
    party_size: number;
  }): Promise<{ waitlist_id: string; position: number }> {
    return api.post('/reservations/waitlist', data);
  },

  /**
   * Get user's waitlist entries
   */
  async getWaitlist(): Promise<{ waitlist: unknown[] }> {
    return api.get('/reservations/waitlist/me');
  },

  /**
   * Leave waitlist
   */
  async leaveWaitlist(waitlistId: string): Promise<MessageResponse> {
    return api.delete(`/reservations/waitlist/${waitlistId}`);
  },
};

export default reservationsService;
