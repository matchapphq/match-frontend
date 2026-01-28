import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { API_ENDPOINTS } from '../../utils/api-constants';

// Types
export interface Venue {
  id: string;
  name: string;
  description?: string;
  street_address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  photos?: string[];
  subscription_status?: string;
}

/**
 * Get all venues for the current partner/user
 */
export function usePartnerVenues() {
  return useQuery<Venue[]>({
    queryKey: ['partner-venues'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.PARTNERS_VENUES);
      return response.data.venues || response.data;
    },
  });
}
