/**
 * Reservations Hook
 * 
 * Custom hooks for reservation-related API calls
 */

import { useApiCall, useApiMutation, getAuthToken } from './useApi';
import * as ReservationsService from '../services/reservations.service';
import type { Reservation, ReservationStats } from '../services/reservations.service';

// ==================== Get Reservations ====================

export function useMyReservations(params?: {
  status?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}) {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => ReservationsService.getMyReservations(params, authToken),
    [JSON.stringify(params), authToken]
  );
}

export function useReservationDetails(reservationId: string) {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => ReservationsService.getReservationDetails(reservationId, authToken),
    [reservationId, authToken]
  );
}

export function useVenueReservations(venueId: string, params?: {
  status?: string;
  date_from?: string;
  date_to?: string;
  match_id?: string;
  limit?: number;
  offset?: number;
}) {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => ReservationsService.getVenueReservations(venueId, params, authToken),
    [venueId, JSON.stringify(params), authToken]
  );
}

export function useVenueReservationStats(venueId: string, params?: {
  date_from?: string;
  date_to?: string;
}) {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => ReservationsService.getVenueReservationStats(venueId, params, authToken),
    [venueId, JSON.stringify(params), authToken]
  );
}

export function useVenueMatchReservations(venueMatchId: string) {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => ReservationsService.getVenueMatchReservations(venueMatchId, authToken),
    [venueMatchId, authToken]
  );
}

// ==================== Mutations ====================

export function useCreateReservation() {
  const authToken = getAuthToken();
  
  return useApiMutation<Reservation, {
    venue_match_id: string;
    number_of_people: number;
    special_requests?: string;
  }>(
    (data) => ReservationsService.createReservation(data, authToken)
  );
}

export function useCancelReservation() {
  const authToken = getAuthToken();
  
  return useApiMutation<Reservation, string>(
    (reservationId) => ReservationsService.cancelReservation(reservationId, authToken)
  );
}

export function useUpdateReservationStatus() {
  const authToken = getAuthToken();
  
  return useApiMutation<Reservation, {
    reservationId: string;
    status: 'CONFIRMED' | 'CANCELLED';
  }>(
    ({ reservationId, status }) => ReservationsService.updateReservationStatus(reservationId, status, authToken)
  );
}

export function useMarkReservationNoShow() {
  const authToken = getAuthToken();
  
  return useApiMutation<Reservation, string>(
    (reservationId) => ReservationsService.markReservationNoShow(reservationId, authToken)
  );
}

export function useVerifyQRCode() {
  const authToken = getAuthToken();
  
  return useApiMutation<{
    valid: boolean;
    reservation?: Reservation;
    message?: string;
  }, string>(
    (qrCode) => ReservationsService.verifyQRCode(qrCode, authToken)
  );
}

export function useCheckInReservation() {
  const authToken = getAuthToken();
  
  return useApiMutation<Reservation, string>(
    (reservationId) => ReservationsService.checkInReservation(reservationId, authToken)
  );
}
