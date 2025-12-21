/**
 * Services Index
 * Export all API services for easy importing
 */

export { default as api } from './api';
export { authService } from './auth.service';
export { venuesService, partnerService } from './venues.service';
export { matchesService, sportsService, leaguesService, teamsService, venueMatchesService } from './matches.service';
export { analyticsService } from './analytics.service';
export { reservationsService } from './reservations.service';
export { billingService } from './billing.service';
export { subscriptionsService } from './subscriptions.service';
export { notificationsService } from './notifications.service';
export { reviewsService } from './reviews.service';

// Re-export types
export * from './types';
