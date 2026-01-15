/**
 * Venue API Hooks
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { venueAPI } from '../../services/api';

// ============================================================================
// VENUE QUERY HOOKS
// ============================================================================

export const useVenues = (
  params?: {
    limit?: number;
    offset?: number;
    city?: string;
    type?: string;
    search?: string;
    lat?: number;
    lng?: number;
    distance_km?: number;
  },
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['venues', params],
    queryFn: () => venueAPI.getAll(params).then((res) => res.data),
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

export const useNearbyVenues = (
  params: {
    lat: number;
    lng: number;
    distance_km?: number;
    limit?: number;
  },
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['venues', 'nearby', params],
    queryFn: () => venueAPI.getNearby(params).then((res) => res.data),
    enabled: !!(params.lat && params.lng),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

export const useVenue = (venueId: string, options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['venues', venueId],
    queryFn: () => venueAPI.getById(venueId).then((res) => res.data),
    enabled: !!venueId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useVenuePhotos = (venueId: string, options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['venues', venueId, 'photos'],
    queryFn: () => venueAPI.getPhotos(venueId).then((res) => res.data),
    enabled: !!venueId,
    ...options,
  });
};

export const useVenueReviews = (
  venueId: string,
  params?: { limit?: number; offset?: number },
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['venues', venueId, 'reviews', params],
    queryFn: () => venueAPI.getReviews(venueId, params).then((res) => res.data),
    enabled: !!venueId,
    ...options,
  });
};

export const useVenueMatches = (
  venueId: string,
  params?: { status?: string; limit?: number },
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['venues', venueId, 'matches', params],
    queryFn: () => venueAPI.getMatches(venueId, params).then((res) => res.data),
    enabled: !!venueId,
    ...options,
  });
};

export const useVenueAvailability = (
  venueId: string,
  params?: { date?: string; match_id?: string },
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['venues', venueId, 'availability', params],
    queryFn: () => venueAPI.getAvailability(venueId, params).then((res) => res.data),
    enabled: !!venueId,
    ...options,
  });
};

// ============================================================================
// VENUE MUTATION HOOKS
// ============================================================================

export const useCreateVenue = (options?: UseMutationOptions<any, Error, any>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      description?: string;
      type: string;
      street_address: string;
      city: string;
      postal_code: string;
      country: string;
      latitude: number;
      longitude: number;
      phone?: string;
      capacity?: number;
    }) => venueAPI.create(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
    },
    ...options,
  });
};

export const useUpdateVenue = (options?: UseMutationOptions<any, Error, { venueId: string; data: any }>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ venueId, data }: { venueId: string; data: any }) =>
      venueAPI.update(venueId, data).then((res) => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['venues', variables.venueId] });
      queryClient.invalidateQueries({ queryKey: ['venues'] });
    },
    ...options,
  });
};

export const useDeleteVenue = (options?: UseMutationOptions<any, Error, string>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (venueId: string) => venueAPI.delete(venueId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
    },
    ...options,
  });
};

// ============================================================================
// BOOKING MODE HOOKS
// ============================================================================

/**
 * 🆕 Update venue booking mode
 * @param venueId - ID of the venue
 * @param bookingMode - 'INSTANT' or 'REQUEST'
 */
export const useUpdateBookingMode = (
  options?: UseMutationOptions<
    any,
    Error,
    {
      venueId: string;
      bookingMode: 'INSTANT' | 'REQUEST';
    }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ venueId, bookingMode }: { venueId: string; bookingMode: 'INSTANT' | 'REQUEST' }) =>
      venueAPI.updateBookingMode(venueId, bookingMode).then((res) => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['venues', variables.venueId] });
      queryClient.invalidateQueries({ queryKey: ['venues'] });
    },
    ...options,
  });
};

// ============================================================================
// VENUE FAVORITES HOOKS
// ============================================================================

export const useAddVenueToFavorites = (options?: UseMutationOptions<any, Error, { venueId: string; note?: string }>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ venueId, note }: { venueId: string; note?: string }) =>
      venueAPI.addToFavorites(venueId, note).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'me', 'favorites'] });
    },
    ...options,
  });
};

export const useRemoveVenueFromFavorites = (options?: UseMutationOptions<any, Error, string>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (venueId: string) => venueAPI.removeFromFavorites(venueId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', 'me', 'favorites'] });
    },
    ...options,
  });
};

export const useCheckVenueFavorite = (venueId: string, options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['venues', venueId, 'favorite'],
    queryFn: () => venueAPI.checkIsFavorite(venueId).then((res) => res.data),
    enabled: !!venueId,
    ...options,
  });
};