/**
 * Users Service
 * 
 * API calls related to user management
 * Used in: Compte, Login, Register
 */

import { API_ENDPOINTS } from '../utils/api-constants';
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '../utils/api-helpers';

// ==================== Types ====================

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar_url?: string;
  role: 'USER' | 'PARTNER' | 'ADMIN';
  is_email_verified: boolean;
  is_phone_verified: boolean;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  email_reservations: boolean;
  email_marketing: boolean;
  email_reminders: boolean;
  sms_reservations: boolean;
  sms_reminders: boolean;
  push_reservations: boolean;
  push_marketing: boolean;
}

export interface UserAddress {
  id: string;
  user_id: string;
  label: string; // 'home', 'work', etc.
  address_line1: string;
  address_line2?: string;
  city: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
}

// ==================== Authentication ====================

/**
 * Login user
 */
export async function login(data: {
  email: string;
  password: string;
}): Promise<{
  access_token: string;
  refresh_token: string;
  user: User;
}> {
  return apiPost(API_ENDPOINTS.AUTH_LOGIN, data);
}

/**
 * Register new user
 */
export async function register(data: {
  email: string;
  password: string;
  name: string;
  phone?: string;
  referral_code?: string;
}): Promise<{
  access_token: string;
  refresh_token: string;
  user: User;
}> {
  return apiPost(API_ENDPOINTS.AUTH_REGISTER, data);
}

/**
 * Logout user
 */
export async function logout(authToken: string): Promise<void> {
  return apiPost(API_ENDPOINTS.AUTH_LOGOUT, {}, authToken);
}

/**
 * Refresh auth token
 */
export async function refreshToken(refreshToken: string): Promise<{
  access_token: string;
  refresh_token: string;
}> {
  return apiPost(API_ENDPOINTS.AUTH_REFRESH_TOKEN, { refresh_token: refreshToken });
}

/**
 * Get current authenticated user
 */
export async function getAuthenticatedUser(authToken: string): Promise<User> {
  return apiGet<User>(API_ENDPOINTS.AUTH_ME, undefined, authToken);
}

// ==================== User Profile ====================

/**
 * Get current user profile
 */
export async function getMyProfile(authToken: string): Promise<User> {
  return apiGet<User>(API_ENDPOINTS.USERS_ME, undefined, authToken);
}

/**
 * Update user profile
 */
export async function updateProfile(data: Partial<User>, authToken: string): Promise<User> {
  return apiPatch<User>(API_ENDPOINTS.USERS_ME, data, authToken);
}

// ==================== Notification Preferences ====================

/**
 * Get notification preferences
 */
export async function getNotificationPreferences(authToken: string): Promise<NotificationPreferences> {
  return apiGet<NotificationPreferences>(API_ENDPOINTS.USERS_ME_NOTIFICATION_PREFS, undefined, authToken);
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(data: Partial<NotificationPreferences>, authToken: string): Promise<NotificationPreferences> {
  return apiPut<NotificationPreferences>(API_ENDPOINTS.USERS_ME_NOTIFICATION_PREFS, data, authToken);
}

// ==================== Onboarding ====================

/**
 * Mark onboarding as complete
 */
export async function completeOnboarding(authToken: string): Promise<{
  success: boolean;
  message: string;
}> {
  return apiPost<{
    success: boolean;
    message: string;
  }>(API_ENDPOINTS.USERS_ME_ONBOARDING_COMPLETE, {}, authToken);
}

/**
 * Complete full onboarding process
 */
export async function completeFullOnboarding(data: {
  venue_data: any;
  subscription_data: any;
}, authToken: string): Promise<{
  success: boolean;
  venue_id: string;
  subscription_id: string;
}> {
  return apiPost<{
    success: boolean;
    venue_id: string;
    subscription_id: string;
  }>(API_ENDPOINTS.ONBOARDING_COMPLETE, data, authToken);
}

// ==================== User Addresses ====================

/**
 * Get user addresses
 */
export async function getMyAddresses(authToken: string): Promise<UserAddress[]> {
  return apiGet<UserAddress[]>(API_ENDPOINTS.USERS_ME_ADDRESSES, undefined, authToken);
}

/**
 * Add a new address
 */
export async function addAddress(data: Partial<UserAddress>, authToken: string): Promise<UserAddress> {
  return apiPost<UserAddress>(API_ENDPOINTS.USERS_ME_ADDRESSES, data, authToken);
}

/**
 * Update an address
 */
export async function updateAddress(addressId: string, data: Partial<UserAddress>, authToken: string): Promise<UserAddress> {
  return apiPut<UserAddress>(API_ENDPOINTS.USERS_ADDRESS(addressId), data, authToken);
}

/**
 * Delete an address
 */
export async function deleteAddress(addressId: string, authToken: string): Promise<void> {
  return apiDelete(API_ENDPOINTS.USERS_ADDRESS(addressId), authToken);
}

// ==================== Favorite Venues ====================

/**
 * Get favorite venues
 */
export async function getFavoriteVenues(authToken: string): Promise<any[]> {
  return apiGet(API_ENDPOINTS.USERS_ME_FAVORITE_VENUES, undefined, authToken);
}

/**
 * Add venue to favorites
 */
export async function addFavoriteVenue(venueId: string, authToken: string): Promise<void> {
  return apiPost(API_ENDPOINTS.VENUE_FAVORITE(venueId), {}, authToken);
}

/**
 * Remove venue from favorites
 */
export async function removeFavoriteVenue(venueId: string, authToken: string): Promise<void> {
  return apiDelete(API_ENDPOINTS.VENUE_FAVORITE(venueId), authToken);
}
