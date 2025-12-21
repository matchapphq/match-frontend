/**
 * Reviews Service
 * Handles venue reviews
 */

import api from './api';
import type {
  Review,
  ReviewsResponse,
  PaginationParams,
  MessageResponse,
} from './types';

interface GetReviewsParams extends PaginationParams {
  sort?: 'recent' | 'rating' | 'helpful';
}

interface CreateReviewData {
  rating: number;
  title: string;
  content: string;
  atmosphere_rating?: number;
  food_rating?: number;
  service_rating?: number;
  value_rating?: number;
}

export const reviewsService = {
  /**
   * Get reviews for a venue
   */
  async getByVenue(venueId: string, params?: GetReviewsParams): Promise<ReviewsResponse> {
    return api.get(`/venues/${venueId}/reviews`, params);
  },

  /**
   * Create a review for a venue
   */
  async create(venueId: string, data: CreateReviewData): Promise<{ review: Review }> {
    return api.post(`/venues/${venueId}/reviews`, data);
  },

  /**
   * Update a review
   */
  async update(reviewId: string, data: Partial<CreateReviewData>): Promise<{ review: Review }> {
    return api.put(`/reviews/${reviewId}`, data);
  },

  /**
   * Delete a review
   */
  async delete(reviewId: string): Promise<MessageResponse> {
    return api.delete(`/reviews/${reviewId}`);
  },

  /**
   * Mark review as helpful/unhelpful
   */
  async markHelpful(reviewId: string, isHelpful: boolean): Promise<{
    helpful_count: number;
    unhelpful_count: number;
  }> {
    return api.post(`/reviews/${reviewId}/helpful`, { is_helpful: isHelpful });
  },
};

export default reviewsService;
