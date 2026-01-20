/**
 * Reviews Service
 * 
 * API calls related to reviews management
 * Used in: MesAvis, VenueDetail
 */

import { API_ENDPOINTS } from '../utils/api-constants';
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api-helpers';

// ==================== Types ====================

export interface Review {
  id: string;
  venue_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  reservation_id: string;
  rating: number; // 1-5
  comment?: string;
  atmosphere_rating?: number;
  service_rating?: number;
  food_rating?: number;
  ambiance_rating?: number;
  helpful_count: number;
  is_verified: boolean; // Verified reservation
  response?: {
    text: string;
    responded_at: string;
    responder_name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  recent_reviews: Review[];
}

// ==================== Get Reviews ====================

/**
 * Get reviews for a venue
 */
export async function getVenueReviews(venueId: string, params?: {
  rating?: number;
  sort_by?: 'recent' | 'rating_high' | 'rating_low' | 'helpful';
  limit?: number;
  offset?: number;
}, authToken?: string): Promise<Review[]> {
  return apiGet<Review[]>(API_ENDPOINTS.VENUE_REVIEWS(venueId), params, authToken);
}

// ==================== Create/Update Review ====================

/**
 * Create a review
 */
export async function createReview(venueId: string, data: {
  reservation_id: string;
  rating: number;
  comment?: string;
  atmosphere_rating?: number;
  service_rating?: number;
  food_rating?: number;
  ambiance_rating?: number;
}, authToken: string): Promise<Review> {
  return apiPost<Review>(API_ENDPOINTS.VENUE_REVIEWS(venueId), data, authToken);
}

/**
 * Update a review
 */
export async function updateReview(reviewId: string, data: Partial<Review>, authToken: string): Promise<Review> {
  return apiPut<Review>(API_ENDPOINTS.REVIEW_UPDATE(reviewId), data, authToken);
}

/**
 * Delete a review
 */
export async function deleteReview(reviewId: string, authToken: string): Promise<void> {
  return apiDelete(API_ENDPOINTS.REVIEW_DELETE(reviewId), authToken);
}

// ==================== Helpful ====================

/**
 * Mark a review as helpful
 */
export async function markReviewHelpful(reviewId: string, authToken: string): Promise<{
  success: boolean;
  helpful_count: number;
}> {
  return apiPost<{
    success: boolean;
    helpful_count: number;
  }>(API_ENDPOINTS.REVIEW_HELPFUL(reviewId), {}, authToken);
}
