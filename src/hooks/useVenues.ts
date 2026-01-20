/**
 * Venues Hook
 * 
 * Custom hooks for venue-related API calls
 */

import { useApiCall, useApiMutation, getAuthToken } from './useApi';
import * as VenuesService from '../services/venues.service';
import type { Venue, VenuePhoto, OpeningHours, VenueAmenity } from '../services/venues.service';

// ==================== Get Venues ====================

export function useMyVenues() {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => VenuesService.getMyVenues(authToken),
    [authToken]
  );
}

export function useVenueDetails(venueId: string) {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => VenuesService.getVenueDetails(venueId, authToken),
    [venueId, authToken]
  );
}

export function useVenuePhotos(venueId: string) {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => VenuesService.getVenuePhotos(venueId, authToken),
    [venueId, authToken]
  );
}

export function useOpeningHours(venueId: string) {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => VenuesService.getOpeningHours(venueId, authToken),
    [venueId, authToken]
  );
}

export function useVenueAmenities(venueId: string) {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => VenuesService.getVenueAmenities(venueId, authToken),
    [venueId, authToken]
  );
}

export function useAllAmenities() {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => VenuesService.getAllAmenities(authToken),
    [authToken]
  );
}

// ==================== Mutations ====================

export function useCreateVenue() {
  const authToken = getAuthToken();
  
  return useApiMutation<Venue, Partial<Venue>>(
    (data) => VenuesService.createVenue(data, authToken)
  );
}

export function useUpdateVenue(venueId: string) {
  const authToken = getAuthToken();
  
  return useApiMutation<Venue, Partial<Venue>>(
    (data) => VenuesService.updateVenue(venueId, data, authToken)
  );
}

export function useDeleteVenue() {
  const authToken = getAuthToken();
  
  return useApiMutation<void, string>(
    (venueId) => VenuesService.deleteVenue(venueId, authToken)
  );
}

export function useUploadVenuePhoto(venueId: string) {
  const authToken = getAuthToken();
  
  return useApiMutation<VenuePhoto, File>(
    (file) => VenuesService.uploadVenuePhoto(venueId, file, authToken)
  );
}

export function useUpdateOpeningHours(venueId: string) {
  const authToken = getAuthToken();
  
  return useApiMutation<OpeningHours[], Partial<OpeningHours>[]>(
    (hours) => VenuesService.updateOpeningHours(venueId, hours, authToken)
  );
}

export function useUpdateVenueAmenities(venueId: string) {
  const authToken = getAuthToken();
  
  return useApiMutation<VenueAmenity[], string[]>(
    (amenityIds) => VenuesService.updateVenueAmenities(venueId, amenityIds, authToken)
  );
}

export function useUpdateBookingMode(venueId: string) {
  const authToken = getAuthToken();
  
  return useApiMutation<Venue, 'INSTANT' | 'REQUEST'>(
    (bookingMode) => VenuesService.updateBookingMode(venueId, bookingMode, authToken)
  );
}
