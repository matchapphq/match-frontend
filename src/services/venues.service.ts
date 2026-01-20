/**
 * Venues Service
 * 
 * API calls related to venues management
 * Used in: MesRestaurants, AjouterRestaurant, ModifierRestaurant, InfosEtablissement
 */

import { API_ENDPOINTS } from '../utils/api-constants';
import { apiGet, apiPost, apiPut, apiPatch, apiDelete, apiUpload } from '../utils/api-helpers';

// ==================== Types ====================

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  phone: string;
  email?: string;
  description?: string;
  capacity?: number;
  booking_mode: 'INSTANT' | 'REQUEST';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VenuePhoto {
  id: string;
  venue_id: string;
  url: string;
  is_primary: boolean;
  order: number;
  created_at: string;
}

export interface OpeningHours {
  id: string;
  venue_id: string;
  day_of_week: number; // 0=Monday, 6=Sunday
  opening_time: string; // HH:mm
  closing_time: string; // HH:mm
  is_closed: boolean;
}

export interface VenueAmenity {
  id: string;
  name: string;
  icon?: string;
}

// ==================== Partner Venues ====================

/**
 * Get all venues for the current partner
 */
export async function getMyVenues(authToken: string): Promise<Venue[]> {
  return apiGet<Venue[]>(API_ENDPOINTS.PARTNERS_VENUES, undefined, authToken);
}

/**
 * Create a new venue
 */
export async function createVenue(data: Partial<Venue>, authToken: string): Promise<Venue> {
  return apiPost<Venue>(API_ENDPOINTS.PARTNERS_VENUES, data, authToken);
}

/**
 * Update a venue
 */
export async function updateVenue(venueId: string, data: Partial<Venue>, authToken: string): Promise<Venue> {
  return apiPut<Venue>(API_ENDPOINTS.VENUE_DETAILS(venueId), data, authToken);
}

/**
 * Delete a venue
 */
export async function deleteVenue(venueId: string, authToken: string): Promise<void> {
  return apiDelete(API_ENDPOINTS.VENUE_DETAILS(venueId), authToken);
}

/**
 * Get venue details
 */
export async function getVenueDetails(venueId: string, authToken?: string): Promise<Venue> {
  return apiGet<Venue>(API_ENDPOINTS.VENUE_DETAILS(venueId), undefined, authToken);
}

// ==================== Venue Photos ====================

/**
 * Get all photos for a venue
 */
export async function getVenuePhotos(venueId: string, authToken?: string): Promise<VenuePhoto[]> {
  return apiGet<VenuePhoto[]>(API_ENDPOINTS.VENUE_PHOTOS(venueId), undefined, authToken);
}

/**
 * Upload a photo to a venue
 */
export async function uploadVenuePhoto(venueId: string, file: File, authToken: string): Promise<VenuePhoto> {
  const formData = new FormData();
  formData.append('photo', file);
  return apiUpload<VenuePhoto>(API_ENDPOINTS.VENUE_PHOTOS(venueId), formData, authToken);
}

/**
 * Delete a venue photo
 */
export async function deleteVenuePhoto(venueId: string, photoId: string, authToken: string): Promise<void> {
  return apiDelete(API_ENDPOINTS.VENUE_PHOTO(venueId, photoId), authToken);
}

/**
 * Set a photo as primary
 */
export async function setPhotoPrimary(venueId: string, photoId: string, authToken: string): Promise<VenuePhoto> {
  return apiPatch<VenuePhoto>(API_ENDPOINTS.VENUE_PHOTO_PRIMARY(venueId, photoId), {}, authToken);
}

// ==================== Opening Hours ====================

/**
 * Get opening hours for a venue
 */
export async function getOpeningHours(venueId: string, authToken?: string): Promise<OpeningHours[]> {
  return apiGet<OpeningHours[]>(API_ENDPOINTS.VENUE_OPENING_HOURS(venueId), undefined, authToken);
}

/**
 * Update opening hours for a venue
 */
export async function updateOpeningHours(venueId: string, hours: Partial<OpeningHours>[], authToken: string): Promise<OpeningHours[]> {
  return apiPut<OpeningHours[]>(API_ENDPOINTS.VENUE_OPENING_HOURS(venueId), { hours }, authToken);
}

// ==================== Amenities ====================

/**
 * Get all available amenities
 */
export async function getAllAmenities(authToken?: string): Promise<VenueAmenity[]> {
  return apiGet<VenueAmenity[]>(API_ENDPOINTS.AMENITIES, undefined, authToken);
}

/**
 * Get amenities for a specific venue
 */
export async function getVenueAmenities(venueId: string, authToken?: string): Promise<VenueAmenity[]> {
  return apiGet<VenueAmenity[]>(API_ENDPOINTS.VENUE_AMENITIES(venueId), undefined, authToken);
}

/**
 * Update amenities for a venue
 */
export async function updateVenueAmenities(venueId: string, amenityIds: string[], authToken: string): Promise<VenueAmenity[]> {
  return apiPut<VenueAmenity[]>(API_ENDPOINTS.VENUE_AMENITIES(venueId), { amenity_ids: amenityIds }, authToken);
}

// ==================== Booking Mode ====================

/**
 * Update booking mode for a venue
 */
export async function updateBookingMode(venueId: string, bookingMode: 'INSTANT' | 'REQUEST', authToken: string): Promise<Venue> {
  return apiPatch<Venue>(API_ENDPOINTS.VENUE_BOOKING_MODE(venueId), { booking_mode: bookingMode }, authToken);
}

// ==================== Venue Subscription ====================

/**
 * Get subscription details for a venue
 */
export async function getVenueSubscription(venueId: string, authToken: string): Promise<any> {
  return apiGet(API_ENDPOINTS.PARTNERS_VENUE_SUBSCRIPTION(venueId), undefined, authToken);
}

/**
 * Get payment portal URL for a venue
 */
export async function getVenuePaymentPortal(venueId: string, authToken: string): Promise<{ portal_url: string }> {
  return apiPost<{ portal_url: string }>(API_ENDPOINTS.PARTNERS_VENUE_PAYMENT_PORTAL(venueId), {}, authToken);
}

// ==================== Search & Discovery ====================

/**
 * Search venues
 */
export async function searchVenues(params: {
  query?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  limit?: number;
  offset?: number;
}, authToken?: string): Promise<Venue[]> {
  return apiGet<Venue[]>(API_ENDPOINTS.VENUES, params, authToken);
}

/**
 * Get nearby venues
 */
export async function getNearbyVenues(latitude: number, longitude: number, radius: number = 5000, authToken?: string): Promise<Venue[]> {
  return apiGet<Venue[]>(API_ENDPOINTS.VENUES_NEARBY, { latitude, longitude, radius }, authToken);
}
