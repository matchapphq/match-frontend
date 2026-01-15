/**
 * Reservations API Hooks
 * 
 * Updated to match new simplified booking flow:
 * - Single POST /api/reservations endpoint (backend decides PENDING vs CONFIRMED)
 * - PATCH /api/partners/reservations/:id/status for venue owners
 * - Status types: 'PENDING' | 'CONFIRMED' | 'DECLINED' | 'CANCELED_BY_USER' | 'CANCELED_BY_VENUE' | 'NO_SHOW'
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { reservationsAPI, partnerAPI } from '../../services/api';

// ============================================================================
// RESERVATIONS QUERY HOOKS
// ============================================================================

export const useReservations = (
  params?: { status?: string; limit?: number; offset?: number },
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['reservations', params],
    queryFn: () => reservationsAPI.getAll(params).then((res) => res.data),
    staleTime: 1 * 60 * 1000, // 1 minute
    ...options,
  });
};

export const useReservation = (reservationId: string, options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['reservations', reservationId],
    queryFn: () => reservationsAPI.getById(reservationId).then((res) => res.data),
    enabled: !!reservationId,
    staleTime: 1 * 60 * 1000,
    ...options,
  });
};

export const useReservationsByVenueMatch = (venueMatchId: string, options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['reservations', 'venue-match', venueMatchId],
    queryFn: () => reservationsAPI.getByVenueMatch(venueMatchId).then((res) => res.data),
    enabled: !!venueMatchId,
    staleTime: 1 * 60 * 1000,
    ...options,
  });
};

// ============================================================================
// RESERVATIONS MUTATION HOOKS
// ============================================================================

/**
 * 🆕 Simplified reservation creation
 * Backend determines status based on venue.booking_mode:
 * - INSTANT mode → status = 'CONFIRMED', QR generated immediately
 * - REQUEST mode → status = 'PENDING', QR generated after approval
 */
export const useCreateReservation = (
  options?: UseMutationOptions<
    any,
    Error,
    {
      venue_match_id: string;
      party_size: number;
      requires_accessibility?: boolean;
      special_requests?: string;
    }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      venue_match_id: string;
      party_size: number;
      requires_accessibility?: boolean;
      special_requests?: string;
    }) => reservationsAPI.create(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
    ...options,
  });
};

export const useCancelReservation = (
  options?: UseMutationOptions<
    any,
    Error,
    {
      reservationId: string;
      reason?: string;
    }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reservationId, reason }: { reservationId: string; reason?: string }) =>
      reservationsAPI.cancel(reservationId, reason).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
    ...options,
  });
};

export const useVerifyQR = (options?: UseMutationOptions<any, Error, string>) => {
  return useMutation({
    mutationFn: (qrCode: string) => reservationsAPI.verifyQR(qrCode).then((res) => res.data),
    ...options,
  });
};

export const useCheckInReservation = (options?: UseMutationOptions<any, Error, string>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reservationId: string) =>
      reservationsAPI.checkIn(reservationId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
    ...options,
  });
};

// ============================================================================
// BOOKING MODE - VENUE OWNER ACTIONS
// ============================================================================

/**
 * 🆕 Update reservation status (venue owner only)
 * Used to confirm or decline PENDING reservations
 * 
 * @param reservationId - ID of the reservation
 * @param status - 'CONFIRMED' or 'DECLINED'
 */
export const useUpdateReservationStatus = (
  options?: UseMutationOptions<
    any,
    Error,
    {
      reservationId: string;
      status: 'CONFIRMED' | 'DECLINED';
    }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reservationId, status }: { reservationId: string; status: 'CONFIRMED' | 'DECLINED' }) =>
      partnerAPI.updateReservationStatus(reservationId, status).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['reservations', 'pending'] });
    },
    ...options,
  });
};

// Convenience hooks for approve/decline
export const useConfirmReservation = (options?: UseMutationOptions<any, Error, string>) => {
  const updateStatus = useUpdateReservationStatus();
  
  return useMutation({
    mutationFn: (reservationId: string) =>
      updateStatus.mutateAsync({ reservationId, status: 'CONFIRMED' }),
    ...options,
  });
};

export const useDeclineReservation = (options?: UseMutationOptions<any, Error, string>) => {
  const updateStatus = useUpdateReservationStatus();
  
  return useMutation({
    mutationFn: (reservationId: string) =>
      updateStatus.mutateAsync({ reservationId, status: 'DECLINED' }),
    ...options,
  });
};

// ============================================================================
// WAITLIST HOOKS
// ============================================================================

export const useJoinWaitlist = (
  options?: UseMutationOptions<
    any,
    Error,
    {
      venue_match_id: string;
      party_size: number;
    }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { venue_match_id: string; party_size: number }) =>
      reservationsAPI.joinWaitlist(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
    },
    ...options,
  });
};

export const useMyWaitlist = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['waitlist', 'me'],
    queryFn: () => reservationsAPI.getMyWaitlist().then((res) => res.data),
    ...options,
  });
};

export const useLeaveWaitlist = (options?: UseMutationOptions<any, Error, string>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (waitlistId: string) =>
      reservationsAPI.leaveWaitlist(waitlistId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waitlist'] });
    },
    ...options,
  });
};
