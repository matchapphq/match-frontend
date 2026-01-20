/**
 * Reservations Service
 * 
 * API calls related to reservations management
 * Used in: Reservations, QRScanner, MatchDetail
 */

import { API_ENDPOINTS } from '../utils/api-constants';
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '../utils/api-helpers';

// ==================== Types ====================

export interface Reservation {
  id: string;
  venue_match_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  number_of_people: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'NO_SHOW' | 'CHECKED_IN';
  special_requests?: string;
  total_price?: number;
  booking_reference: string;
  qr_code?: string;
  checked_in_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ReservationStats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  no_shows: number;
  checked_in: number;
}

export interface WaitlistEntry {
  id: string;
  venue_match_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  number_of_people: number;
  status: 'WAITING' | 'NOTIFIED' | 'CONVERTED' | 'EXPIRED';
  notified_at?: string;
  created_at: string;
}

// ==================== User Reservations ====================

/**
 * Get all reservations for current user
 */
export async function getMyReservations(params?: {
  status?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}, authToken?: string): Promise<Reservation[]> {
  return apiGet<Reservation[]>(API_ENDPOINTS.RESERVATIONS, params, authToken);
}

/**
 * Get reservation details
 */
export async function getReservationDetails(reservationId: string, authToken: string): Promise<Reservation> {
  return apiGet<Reservation>(API_ENDPOINTS.RESERVATION_DETAILS(reservationId), undefined, authToken);
}

/**
 * Create a new reservation
 */
export async function createReservation(data: {
  venue_match_id: string;
  number_of_people: number;
  special_requests?: string;
}, authToken: string): Promise<Reservation> {
  return apiPost<Reservation>(API_ENDPOINTS.RESERVATIONS, data, authToken);
}

/**
 * Cancel a reservation
 */
export async function cancelReservation(reservationId: string, authToken: string): Promise<Reservation> {
  return apiPost<Reservation>(API_ENDPOINTS.RESERVATION_CANCEL(reservationId), {}, authToken);
}

// ==================== Partner Reservations ====================

/**
 * Get reservations for a specific venue
 */
export async function getVenueReservations(venueId: string, params?: {
  status?: string;
  date_from?: string;
  date_to?: string;
  match_id?: string;
  limit?: number;
  offset?: number;
}, authToken?: string): Promise<Reservation[]> {
  return apiGet<Reservation[]>(API_ENDPOINTS.PARTNERS_VENUE_RESERVATIONS(venueId), params, authToken);
}

/**
 * Get reservation statistics for a venue
 */
export async function getVenueReservationStats(venueId: string, params?: {
  date_from?: string;
  date_to?: string;
}, authToken?: string): Promise<ReservationStats> {
  return apiGet<ReservationStats>(API_ENDPOINTS.PARTNERS_VENUE_RESERVATIONS_STATS(venueId), params, authToken);
}

/**
 * Update reservation status (Partner)
 */
export async function updateReservationStatus(reservationId: string, status: 'CONFIRMED' | 'CANCELLED', authToken: string): Promise<Reservation> {
  return apiPatch<Reservation>(API_ENDPOINTS.PARTNERS_RESERVATION_STATUS(reservationId), { status }, authToken);
}

/**
 * Mark reservation as no-show
 */
export async function markReservationNoShow(reservationId: string, authToken: string): Promise<Reservation> {
  return apiPost<Reservation>(API_ENDPOINTS.PARTNERS_RESERVATION_NO_SHOW(reservationId), {}, authToken);
}

/**
 * Update reservation details (Partner)
 */
export async function updateReservation(reservationId: string, data: Partial<Reservation>, authToken: string): Promise<Reservation> {
  return apiPut<Reservation>(API_ENDPOINTS.PARTNERS_RESERVATION_UPDATE(reservationId), data, authToken);
}

/**
 * Get reservations for a specific venue match
 */
export async function getVenueMatchReservations(venueMatchId: string, authToken: string): Promise<Reservation[]> {
  return apiGet<Reservation[]>(API_ENDPOINTS.RESERVATIONS_VENUE_MATCH(venueMatchId), undefined, authToken);
}

// ==================== QR Code ====================

/**
 * Verify QR code and check-in
 */
export async function verifyQRCode(qrCode: string, authToken: string): Promise<{
  valid: boolean;
  reservation?: Reservation;
  message?: string;
}> {
  return apiPost(API_ENDPOINTS.RESERVATIONS_VERIFY_QR, { qr_code: qrCode }, authToken);
}

/**
 * Check-in a reservation
 */
export async function checkInReservation(reservationId: string, authToken: string): Promise<Reservation> {
  return apiPost<Reservation>(API_ENDPOINTS.RESERVATION_CHECK_IN(reservationId), {}, authToken);
}

// ==================== Waitlist ====================

/**
 * Get waitlist for a venue match
 */
export async function getVenueMatchWaitlist(venueId: string, matchId: string, authToken: string): Promise<WaitlistEntry[]> {
  return apiGet<WaitlistEntry[]>(API_ENDPOINTS.PARTNERS_WAITLIST(venueId, matchId), undefined, authToken);
}

/**
 * Notify waitlist entry (spot available)
 */
export async function notifyWaitlistEntry(entryId: string, authToken: string): Promise<WaitlistEntry> {
  return apiPost<WaitlistEntry>(API_ENDPOINTS.PARTNERS_WAITLIST_NOTIFY(entryId), {}, authToken);
}

/**
 * Add to waitlist
 */
export async function addToWaitlist(venueId: string, matchId: string, data: {
  number_of_people: number;
}, authToken: string): Promise<WaitlistEntry> {
  return apiPost<WaitlistEntry>(API_ENDPOINTS.PARTNERS_WAITLIST(venueId, matchId), data, authToken);
}
