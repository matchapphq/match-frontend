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

// ==================== Utilities ====================
export * from '../utils/api-constants';
export * from '../utils/api-helpers';
export * from '../utils/data-mappers';

// ==================== Service Types ====================
export type {
  Venue,
  Match,
  VenueMatch,
  Reservation,
  SubscriptionPlan,
  Subscription,
  Invoice,
  NotificationPreferences,
  Notification,
  Review,
  ApiUser,
} from '../services/api';
