/**
 * Venues Service
 * Handles venue CRUD operations for venue owners
 */

import api from './api';
import type {
  Venue,
  VenuesResponse,
  CreateVenueRequest,
  UpdateVenueRequest,
  VenuePhoto,
  MessageResponse,
  PaginationParams,
} from './types';

interface GetVenuesParams extends PaginationParams {
  city?: string;
  type?: string;
  search?: string;
  is_verified?: boolean;
}

export const venuesService = {
  /**
   * Get all venues (public)
   */
  async getAll(params?: GetVenuesParams): Promise<VenuesResponse> {
    return api.get<VenuesResponse>('/venues', params);
  },

  /**
   * Get venue details by ID
   */
  async getById(venueId: string): Promise<Venue> {
    return api.get<Venue>(`/venues/${venueId}`);
  },

  /**
   * Create a new venue (requires subscription)
   */
  async create(data: CreateVenueRequest): Promise<Venue> {
    return api.post<Venue>('/venues', data);
  },

  /**
   * Update a venue (owner only)
   */
  async update(venueId: string, data: UpdateVenueRequest): Promise<Venue> {
    return api.put<Venue>(`/venues/${venueId}`, data);
  },

  /**
   * Delete a venue (soft delete, owner only)
   */
  async delete(venueId: string): Promise<MessageResponse> {
    return api.delete<MessageResponse>(`/venues/${venueId}`);
  },

  /**
   * Get venue photos
   */
  async getPhotos(venueId: string): Promise<{ photos: VenuePhoto[] }> {
    return api.get<{ photos: VenuePhoto[] }>(`/venues/${venueId}/photos`);
  },

  /**
   * Get venue stats (owner only)
   */
  async getStats(venueId: string): Promise<{
    total_reviews: number;
    average_rating: number;
    total_reservations: number;
    upcoming_matches: number;
  }> {
    return api.get(`/venues/${venueId}/stats`);
  },

  /**
   * Get matches at a venue
   */
  async getMatches(venueId: string, params?: PaginationParams & { status?: string }): Promise<{
    matches: unknown[];
    total: number;
  }> {
    return api.get(`/venues/${venueId}/matches`, params);
  },

  /**
   * Get venue availability
   */
  async getAvailability(venueId: string): Promise<unknown> {
    return api.get(`/venues/${venueId}/availability`);
  },
};

/**
 * Partner Service
 * Specific endpoints for venue owners (partners)
 */
export const partnerService = {
  /**
   * Get all venues owned by the current user
   */
  async getMyVenues(): Promise<{ venues: Venue[] }> {
    return api.get<{ venues: Venue[] }>('/partners/venues');
  },

  /**
   * Create a new venue
   */
  async createVenue(data: CreateVenueRequest): Promise<{ venue: Venue }> {
    return api.post<{ venue: Venue }>('/partners/venues', data);
  },

  /**
   * Schedule a match at a venue (broadcast)
   */
  async scheduleMatch(venueId: string, data: {
    match_id: string;
    total_seats: number;
    allows_reservations?: boolean;
    estimated_crowd_level?: string;
    notes?: string;
  }): Promise<{ venueMatch: unknown }> {
    return api.post(`/partners/venues/${venueId}/matches`, data);
  },

  /**
   * Cancel a scheduled match at a venue
   */
  async cancelMatch(venueId: string, matchId: string): Promise<{ success: boolean }> {
    return api.delete(`/partners/venues/${venueId}/matches/${matchId}`);
  },
};

export default venuesService;
