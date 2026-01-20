/**
 * API Index - Centralized exports
 * 
 * Import everything you need from this single file
 * 
 * Example:
 * import { useMyVenues, getMyVenues, mapVenueToRestaurant } from './api';
 */

// ==================== Hooks ====================
export * from '../hooks';

// ==================== Services ====================
export * from '../services';

// ==================== Utilities ====================
export * from '../utils/api-constants';
export * from '../utils/api-helpers';
export * from '../utils/data-mappers';

// ==================== Types ====================
// Re-export commonly used types
export type { Venue, VenuePhoto, OpeningHours, VenueAmenity } from '../services/venues.service';
export type { Match, VenueMatch } from '../services/matches.service';
export type { Reservation, ReservationStats } from '../services/reservations.service';
export type { BoostPrice, BoostSummary, BoostHistory } from '../services/boosts.service';
export type { ReferralCode, ReferralStats, ReferralHistory } from '../services/referral.service';
export type { SubscriptionPlan, Subscription, Invoice } from '../services/subscriptions.service';
export type { User, NotificationPreferences } from '../services/users.service';
export type { Notification } from '../services/notifications.service';
export type { Review } from '../services/reviews.service';
