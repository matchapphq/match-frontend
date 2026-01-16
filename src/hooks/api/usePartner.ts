/**
 * Partner/Venue Owner API Hooks
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { partnerAPI } from '../../services/api';

// ============================================================================
// PARTNER VENUES HOOKS
// ============================================================================

export const usePartnerVenues = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['partners', 'venues'],
    queryFn: () => partnerAPI.getVenues().then((res) => res.data),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

export const useCreatePartnerVenue = (options?: UseMutationOptions<any, Error, any>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      street_address: string;
      city: string;
      postal_code: string;
      country: string;
      latitude: number;
      longitude: number;
    }) => partnerAPI.createVenue(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners', 'venues'] });
    },
    ...options,
  });
};

export const useVerifyCheckout = (options?: UseMutationOptions<any, Error, string>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) =>
      partnerAPI.verifyCheckout(sessionId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners', 'venues'] });
    },
    ...options,
  });
};

export const usePartnerVenueMatches = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['partners', 'venues', 'matches'],
    queryFn: () => partnerAPI.getVenueMatches().then((res) => res.data),
    staleTime: 1 * 60 * 1000,
    ...options,
  });
};

export const useScheduleMatch = (
  options?: UseMutationOptions<
    any,
    Error,
    {
      venueId: string;
      data: { match_id: string; total_seats: number };
    }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ venueId, data }: { venueId: string; data: { match_id: string; total_seats: number } }) =>
      partnerAPI.scheduleMatch(venueId, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners', 'venues', 'matches'] });
    },
    ...options,
  });
};

export const useCancelMatch = (
  options?: UseMutationOptions<
    any,
    Error,
    {
      venueId: string;
      matchId: string;
    }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ venueId, matchId }: { venueId: string; matchId: string }) =>
      partnerAPI.cancelMatch(venueId, matchId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners', 'venues', 'matches'] });
    },
    ...options,
  });
};

export const useVenueClients = (venueId: string, options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['partners', 'venues', venueId, 'clients'],
    queryFn: () => partnerAPI.getVenueClients(venueId).then((res) => res.data),
    enabled: !!venueId,
    ...options,
  });
};

export const useVenueSubscription = (venueId: string, options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['partners', 'venues', venueId, 'subscription'],
    queryFn: () => partnerAPI.getVenueSubscription(venueId).then((res) => res.data),
    enabled: !!venueId,
    ...options,
  });
};

export const usePaymentPortalURL = (options?: UseMutationOptions<any, Error, string>) => {
  return useMutation({
    mutationFn: (venueId: string) =>
      partnerAPI.getPaymentPortalURL(venueId).then((res) => res.data),
    ...options,
  });
};

export const usePartnerCustomerStats = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['partners', 'stats', 'customers'],
    queryFn: () => partnerAPI.getCustomerStats().then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const usePartnerAnalyticsSummary = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['partners', 'analytics', 'summary'],
    queryFn: () => partnerAPI.getAnalyticsSummary().then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const usePartnerAnalyticsDashboard = (
  params?: { start_date?: string; end_date?: string },
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['partners', 'analytics', 'dashboard', params],
    queryFn: () => partnerAPI.getAnalyticsDashboard(params).then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// ============================================================================
// VENUE RESERVATIONS HOOKS
// ============================================================================

export const useVenueReservations = (
  venueId: string,
  params?: { page?: number; limit?: number; status?: string },
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['partners', 'venues', venueId, 'reservations', params],
    queryFn: () => partnerAPI.getVenueReservations(venueId, params).then((res) => res.data),
    enabled: !!venueId,
    staleTime: 1 * 60 * 1000,
    ...options,
  });
};

export const useVenueReservationStats = (
  venueId: string,
  params?: { from?: string; to?: string },
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['partners', 'venues', venueId, 'reservations', 'stats', params],
    queryFn: () => partnerAPI.getReservationStats(venueId, params).then((res) => res.data),
    enabled: !!venueId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useVenueMatchesCalendar = (
  venueId: string,
  params?: { month?: string; status?: string },
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['partners', 'venues', venueId, 'matches', 'calendar', params],
    queryFn: () => partnerAPI.getMatchesCalendar(venueId, params).then((res) => res.data),
    enabled: !!venueId,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

// ============================================================================
// RESERVATION MANAGEMENT MUTATIONS
// ============================================================================

export const usePartnerUpdateReservationStatus = (
  options?: UseMutationOptions<any, Error, { reservationId: string; status: 'CONFIRMED' | 'DECLINED' }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reservationId, status }) =>
      partnerAPI.updateReservationStatus(reservationId, status).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners', 'venues'] });
    },
    ...options,
  });
};

export const useUpdateReservation = (
  options?: UseMutationOptions<
    any,
    Error,
    {
      reservationId: string;
      data: {
        status?: string;
        table_number?: string;
        notes?: string;
        party_size?: number;
        special_requests?: string;
      };
    }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reservationId, data }) =>
      partnerAPI.updateReservation(reservationId, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners', 'venues'] });
    },
    ...options,
  });
};

export const useMarkNoShow = (
  options?: UseMutationOptions<any, Error, { reservationId: string; reason?: string }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reservationId, reason }) =>
      partnerAPI.markNoShow(reservationId, reason).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners', 'venues'] });
    },
    ...options,
  });
};

// ============================================================================
// WAITLIST HOOKS
// ============================================================================

export const useVenueMatchWaitlist = (
  venueId: string,
  matchId: string,
  params?: { status?: string },
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['partners', 'venues', venueId, 'matches', matchId, 'waitlist', params],
    queryFn: () => partnerAPI.getVenueMatchWaitlist(venueId, matchId, params).then((res) => res.data),
    enabled: !!venueId && !!matchId,
    staleTime: 1 * 60 * 1000,
    ...options,
  });
};

export const useNotifyWaitlistCustomer = (
  options?: UseMutationOptions<any, Error, { entryId: string; message?: string; expiry_minutes?: number }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ entryId, ...data }) =>
      partnerAPI.notifyWaitlistCustomer(entryId, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners', 'venues'] });
    },
    ...options,
  });
};
