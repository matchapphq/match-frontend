import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { Venue, VenuesResponse, CreateVenueRequest, AnalyticsOverview, Review } from '../lib/types';

// Venues API functions
const venuesApi = {
  getMyVenues: async (): Promise<VenuesResponse> => {
    const response = await api.get('/partners/venues');
    return response.data;
  },

  createVenue: async (data: CreateVenueRequest): Promise<{ venue: Venue }> => {
    const response = await api.post('/partners/venues', data);
    return response.data;
  },

  getVenueAnalytics: async (venueId: string): Promise<AnalyticsOverview> => {
    const response = await api.get(`/venues/${venueId}/analytics/overview`);
    return response.data;
  },

  getVenueReviews: async (venueId: string): Promise<{ reviews: Review[] }> => {
    const response = await api.get(`/reviews?venue_id=${venueId}`);
    return response.data;
  },
};

// Hooks
export function useMyVenues() {
  return useQuery({
    queryKey: ['my-venues'],
    queryFn: venuesApi.getMyVenues,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useCreateVenue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: venuesApi.createVenue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-venues'] });
    },
  });
}

export function useVenueAnalytics(venueId: string | undefined) {
  return useQuery({
    queryKey: ['venue-analytics', venueId],
    queryFn: () => venuesApi.getVenueAnalytics(venueId!),
    enabled: !!venueId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useVenueReviews(venueId: string | undefined) {
  return useQuery({
    queryKey: ['venue-reviews', venueId],
    queryFn: () => venuesApi.getVenueReviews(venueId!),
    enabled: !!venueId,
    staleTime: 5 * 60 * 1000,
  });
}
