import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { API_ENDPOINTS } from '../../utils/api-constants';

// Types
export interface Review {
  id: string;
  venue_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at?: string;
  reply?: {
    id: string;
    content: string;
    created_at: string;
  };
  helpful_count: number;
  is_verified: boolean;
}

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  average_rating: number;
  rating_distribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
}

export interface ReplyToReviewData {
  content: string;
}

// ==================== Hooks ====================

/**
 * Get reviews for a venue
 */
export function useVenueReviews(venueId: string, options?: { page?: number; limit?: number }) {
  const { page = 1, limit = 20 } = options || {};
  
  return useQuery<ReviewsResponse>({
    queryKey: ['venue-reviews', venueId, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', String(limit));
      
      const response = await apiClient.get(`${API_ENDPOINTS.VENUE_REVIEWS(venueId)}?${params.toString()}`);
      return response.data;
    },
    enabled: !!venueId,
  });
}

/**
 * Get all reviews for all user's venues (partner view)
 */
export function useAllVenueReviews(venueIds: string[], options?: { page?: number; limit?: number }) {
  const { page = 1, limit = 50 } = options || {};
  
  return useQuery<{ reviews: Review[]; total: number; average_rating: number }>({
    queryKey: ['all-venue-reviews', venueIds, page, limit],
    queryFn: async () => {
      // Fetch reviews from all venues and combine
      const allReviews: Review[] = [];
      let totalRating = 0;
      let ratingCount = 0;
      
      for (const venueId of venueIds) {
        try {
          const response = await apiClient.get(`${API_ENDPOINTS.VENUE_REVIEWS(venueId)}?page=1&limit=100`);
          const venueReviews = response.data.reviews || [];
          allReviews.push(...venueReviews);
          
          if (response.data.average_rating) {
            totalRating += response.data.average_rating * venueReviews.length;
            ratingCount += venueReviews.length;
          }
        } catch (error) {
          console.error(`Failed to fetch reviews for venue ${venueId}:`, error);
        }
      }
      
      // Sort by created_at desc
      allReviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      return {
        reviews: allReviews.slice((page - 1) * limit, page * limit),
        total: allReviews.length,
        average_rating: ratingCount > 0 ? totalRating / ratingCount : 0,
      };
    },
    enabled: venueIds.length > 0,
  });
}

/**
 * Reply to a review
 */
export function useReplyToReview() {
  const queryClient = useQueryClient();
  
  return useMutation<{ success: boolean }, Error, { reviewId: string; content: string }>({
    mutationFn: async ({ reviewId, content }) => {
      const response = await apiClient.post(`/reviews/${reviewId}/reply`, { content });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venue-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['all-venue-reviews'] });
    },
  });
}

/**
 * Mark a review as helpful
 */
export function useMarkReviewHelpful() {
  const queryClient = useQueryClient();
  
  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: async (reviewId) => {
      const response = await apiClient.post(API_ENDPOINTS.REVIEW_HELPFUL(reviewId));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venue-reviews'] });
    },
  });
}
