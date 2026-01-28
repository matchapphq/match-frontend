import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { API_ENDPOINTS } from '../../utils/api-constants';

// Types
export interface Reservation {
  id: string;
  venue_id: string;
  venue_match_id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'declined' | 'cancelled' | 'checked_in' | 'no_show';
  party_size: number;
  special_requests?: string;
  created_at: string;
  updated_at: string;
  checked_in_at?: string;
  // User info
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
  // Match info
  venue_match?: {
    id: string;
    match: {
      id: string;
      home_team: { name: string; logo_url?: string };
      away_team: { name: string; logo_url?: string };
      start_time: string;
      competition?: { name: string };
    };
  };
}

export interface ReservationStats {
  total: number;
  pending: number;
  confirmed: number;
  declined: number;
  checked_in: number;
  no_show: number;
  total_guests: number;
}

export interface CustomerStats {
  total_customers: number;
  average_age?: number;
  favorite_sport?: string;
  average_per_match: number;
  recent_customers: Array<{
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    last_visit: string;
    total_reservations: number;
  }>;
}

// Hook to fetch reservations for a venue
export function useVenueReservations(venueId: string | null, options?: {
  status?: string;
  startDate?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: ['venue-reservations', venueId, options],
    queryFn: async () => {
      if (!venueId) return { reservations: [], stats: null };
      
      const params = new URLSearchParams();
      if (options?.status) params.append('status', options.status);
      if (options?.startDate) params.append('start_date', options.startDate);
      if (options?.endDate) params.append('end_date', options.endDate);
      
      const url = `${API_ENDPOINTS.PARTNERS_VENUE_RESERVATIONS(venueId)}${params.toString() ? `?${params}` : ''}`;
      const response = await apiClient.get(url);
      return response.data;
    },
    enabled: !!venueId,
  });
}

// Hook to fetch reservation stats for a venue
export function useReservationStats(venueId: string | null) {
  return useQuery({
    queryKey: ['reservation-stats', venueId],
    queryFn: async () => {
      if (!venueId) return null;
      const response = await apiClient.get(API_ENDPOINTS.PARTNERS_VENUE_RESERVATIONS_STATS(venueId));
      return response.data as ReservationStats;
    },
    enabled: !!venueId,
  });
}

// Hook to update reservation status
export function useUpdateReservationStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ reservationId, status }: { reservationId: string; status: string }) => {
      const response = await apiClient.patch(
        API_ENDPOINTS.PARTNERS_RESERVATION_STATUS(reservationId),
        { status }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venue-reservations'] });
      queryClient.invalidateQueries({ queryKey: ['reservation-stats'] });
    },
  });
}

// Hook to mark reservation as no-show
export function useMarkNoShow() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reservationId: string) => {
      const response = await apiClient.post(
        API_ENDPOINTS.PARTNERS_RESERVATION_NO_SHOW(reservationId)
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venue-reservations'] });
      queryClient.invalidateQueries({ queryKey: ['reservation-stats'] });
    },
  });
}

// Hook to verify QR code
export function useVerifyQR() {
  return useMutation({
    mutationFn: async (qrCode: string) => {
      const response = await apiClient.post(API_ENDPOINTS.RESERVATIONS_VERIFY_QR, {
        qr_code: qrCode,
      });
      return response.data;
    },
  });
}

// Hook to check-in a reservation
export function useCheckIn() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reservationId: string) => {
      const response = await apiClient.post(
        API_ENDPOINTS.RESERVATION_CHECK_IN(reservationId)
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venue-reservations'] });
      queryClient.invalidateQueries({ queryKey: ['reservation-stats'] });
    },
  });
}

// Hook to fetch customer stats
export function useCustomerStats() {
  return useQuery({
    queryKey: ['customer-stats'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.PARTNERS_STATS_CUSTOMERS);
      return response.data as CustomerStats;
    },
  });
}

// Hook to fetch all reservations across all venues (for partners with multiple venues)
export function useAllReservations(venueIds: string[]) {
  return useQuery({
    queryKey: ['all-reservations', venueIds],
    queryFn: async () => {
      if (venueIds.length === 0) return [];
      
      // Fetch reservations for all venues in parallel
      const promises = venueIds.map(venueId =>
        apiClient.get(API_ENDPOINTS.PARTNERS_VENUE_RESERVATIONS(venueId))
          .then(res => res.data.reservations || [])
          .catch(() => [])
      );
      
      const results = await Promise.all(promises);
      return results.flat();
    },
    enabled: venueIds.length > 0,
  });
}
