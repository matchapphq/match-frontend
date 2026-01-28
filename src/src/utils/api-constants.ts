/**
 * API Constants for Match Platform
 * 
 * This file contains all API endpoints and base configuration
 * Following 100% seamless approach (snake_case everywhere)
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8008/api';

/**
 * API Endpoints
 * Use functions for dynamic routes (with parameters)
 */
export const API_ENDPOINTS = {
  // ==================== Auth ====================
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_ME: '/auth/me',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_REFRESH_TOKEN: '/auth/refresh-token',
  
  // ==================== Users ====================
  USERS_ME: '/users/me',
  USERS_ME_NOTIFICATION_PREFS: '/users/me/notification-preferences',
  USERS_ME_ONBOARDING_COMPLETE: '/users/me/onboarding-complete',
  USERS_ME_ADDRESSES: '/users/me/addresses',
  USERS_ME_FAVORITE_VENUES: '/users/me/favorite-venues',
  USERS_ADDRESS: (addressId: string) => `/users/me/addresses/${addressId}`,
  
  // ==================== Onboarding ====================
  ONBOARDING_COMPLETE: '/onboarding/complete',
  
  // ==================== Partners ====================
  PARTNERS_VENUES: '/partners/venues',
  PARTNERS_VENUES_VERIFY_CHECKOUT: '/partners/venues/verify-checkout',
  PARTNERS_VENUES_MATCHES: '/partners/venues/matches',
  PARTNERS_ANALYTICS_DASHBOARD: '/partners/analytics/dashboard',
  PARTNERS_ANALYTICS_SUMMARY: '/partners/analytics/summary',
  PARTNERS_STATS_CUSTOMERS: '/partners/stats/customers',
  
  PARTNERS_VENUE_RESERVATIONS: (venueId: string) => `/partners/venues/${venueId}/reservations`,
  PARTNERS_VENUE_RESERVATIONS_STATS: (venueId: string) => `/partners/venues/${venueId}/reservations/stats`,
  PARTNERS_VENUE_MATCHES: (venueId: string) => `/partners/venues/${venueId}/matches`,
  PARTNERS_VENUE_MATCHES_CALENDAR: (venueId: string) => `/partners/venues/${venueId}/matches/calendar`,
  PARTNERS_VENUE_MATCH: (venueId: string, matchId: string) => `/partners/venues/${venueId}/matches/${matchId}`,
  PARTNERS_VENUE_CLIENTS: (venueId: string) => `/partners/venues/${venueId}/clients`,
  PARTNERS_VENUE_SUBSCRIPTION: (venueId: string) => `/partners/venues/${venueId}/subscription`,
  PARTNERS_VENUE_PAYMENT_PORTAL: (venueId: string) => `/partners/venues/${venueId}/payment-portal`,
  
  PARTNERS_RESERVATION_UPDATE: (reservationId: string) => `/partners/reservations/${reservationId}`,
  PARTNERS_RESERVATION_STATUS: (reservationId: string) => `/partners/reservations/${reservationId}/status`,
  PARTNERS_RESERVATION_NO_SHOW: (reservationId: string) => `/partners/reservations/${reservationId}/mark-no-show`,
  
  PARTNERS_WAITLIST: (venueId: string, matchId: string) => `/partners/venues/${venueId}/matches/${matchId}/waitlist`,
  PARTNERS_WAITLIST_NOTIFY: (entryId: string) => `/partners/waitlist/${entryId}/notify`,
  
  // ==================== Venues ====================
  VENUES: '/venues',
  VENUES_NEARBY: '/venues/nearby',
  
  VENUE_DETAILS: (venueId: string) => `/venues/${venueId}`,
  VENUE_PHOTOS: (venueId: string) => `/venues/${venueId}/photos`,
  VENUE_PHOTO: (venueId: string, photoId: string) => `/venues/${venueId}/photos/${photoId}`,
  VENUE_PHOTO_PRIMARY: (venueId: string, photoId: string) => `/venues/${venueId}/photos/${photoId}/primary`,
  VENUE_OPENING_HOURS: (venueId: string) => `/venues/${venueId}/opening-hours`,
  VENUE_OPENING_HOURS_EXCEPTIONS: (venueId: string) => `/venues/${venueId}/opening-hours/exceptions`,
  VENUE_OPENING_HOURS_EXCEPTION: (venueId: string, exceptionId: string) => `/venues/${venueId}/opening-hours/exceptions/${exceptionId}`,
  VENUE_AMENITIES: (venueId: string) => `/venues/${venueId}/amenities`,
  VENUE_MENU: (venueId: string) => `/venues/${venueId}/menu`,
  VENUE_REVIEWS: (venueId: string) => `/venues/${venueId}/reviews`,
  VENUE_MATCHES: (venueId: string) => `/venues/${venueId}/matches`,
  VENUE_AVAILABILITY: (venueId: string) => `/venues/${venueId}/availability`,
  VENUE_BOOKING_MODE: (venueId: string) => `/venues/${venueId}/booking-mode`,
  VENUE_FAVORITE: (venueId: string) => `/venues/${venueId}/favorite`,
  
  // Amenities
  AMENITIES: '/amenities',
  
  // ==================== Sports ====================
  SPORTS: '/sports',
  SPORT_DETAILS: (sportId: string) => `/sports/${sportId}`,
  SPORT_LEAGUES: (sportId: string) => `/sports/${sportId}/leagues`,
  SPORTS_FIXTURES: '/sports/fixture',
  
  // ==================== Leagues ====================
  LEAGUE_DETAILS: (leagueId: string) => `/leagues/${leagueId}`,
  LEAGUE_TEAMS: (leagueId: string) => `/leagues/${leagueId}/teams`,
  
  // ==================== Teams ====================
  TEAM_DETAILS: (teamId: string) => `/teams/${teamId}`,
  
  // ==================== Matches ====================
  MATCHES: '/matches',
  MATCHES_UPCOMING: '/matches/upcoming',
  MATCHES_UPCOMING_NEARBY: '/matches/upcoming-nearby',
  
  MATCH_DETAILS: (matchId: string) => `/matches/${matchId}`,
  MATCH_VENUES: (matchId: string) => `/matches/${matchId}/venues`,
  MATCH_LIVE_UPDATES: (matchId: string) => `/matches/${matchId}/live-updates`,
  
  // ==================== Reservations ====================
  RESERVATIONS: '/reservations',
  RESERVATIONS_VERIFY_QR: '/reservations/verify-qr',
  
  RESERVATION_DETAILS: (reservationId: string) => `/reservations/${reservationId}`,
  RESERVATION_CANCEL: (reservationId: string) => `/reservations/${reservationId}/cancel`,
  RESERVATION_CHECK_IN: (reservationId: string) => `/reservations/${reservationId}/check-in`,
  RESERVATIONS_VENUE_MATCH: (venueMatchId: string) => `/reservations/venue-match/${venueMatchId}`,
  
  // ==================== Reviews ====================
  REVIEW_UPDATE: (reviewId: string) => `/reviews/${reviewId}`,
  REVIEW_DELETE: (reviewId: string) => `/reviews/${reviewId}`,
  REVIEW_HELPFUL: (reviewId: string) => `/reviews/${reviewId}/helpful`,
  
  // ==================== Notifications ====================
  NOTIFICATIONS: '/notifications',
  NOTIFICATIONS_UNREAD_COUNT: '/notifications/unread-count',
  NOTIFICATIONS_NEW: '/notifications/new',
  NOTIFICATIONS_READ_ALL: '/notifications/read-all',
  
  NOTIFICATION_READ: (notificationId: string) => `/notifications/${notificationId}/read`,
  NOTIFICATION_DELETE: (notificationId: string) => `/notifications/${notificationId}`,
  
  // ==================== Subscriptions ====================
  SUBSCRIPTIONS_PLANS: '/subscriptions/plans',
  SUBSCRIPTIONS_CREATE_CHECKOUT: '/subscriptions/create-checkout',
  SUBSCRIPTIONS_ME: '/subscriptions/me',
  SUBSCRIPTIONS_UPDATE_PAYMENT: '/subscriptions/me/update-payment-method',
  SUBSCRIPTIONS_CANCEL: '/subscriptions/me/cancel',
  SUBSCRIPTIONS_UPGRADE: '/subscriptions/me/upgrade',
  SUBSCRIPTIONS_INVOICES: '/subscriptions/invoices',
  SUBSCRIPTIONS_MOCK: '/subscriptions/mock',
  
  // ==================== Invoices ====================
  INVOICES: '/invoices',
  INVOICE_DETAILS: (invoiceId: string) => `/invoices/${invoiceId}`,
  INVOICE_PDF: (invoiceId: string) => `/invoices/${invoiceId}/pdf`,
  
  // ==================== Transactions ====================
  TRANSACTIONS: '/transactions',
  TRANSACTION_DETAILS: (transactionId: string) => `/transactions/${transactionId}`,
  
  // ==================== Boosts ====================
  BOOSTS_PRICES: '/boosts/prices',
  BOOSTS_AVAILABLE: '/boosts/available',
  BOOSTS_STATS: '/boosts/stats',
  BOOSTS_SUMMARY: '/boosts/summary',
  BOOSTS_ACTIVATE: '/boosts/activate',
  BOOSTS_DEACTIVATE: '/boosts/deactivate',
  BOOSTS_HISTORY: '/boosts/history',
  BOOSTS_PURCHASES: '/boosts/purchases',
  BOOSTS_CHECKOUT: '/boosts/purchase/create-checkout',
  BOOSTS_VERIFY: '/boosts/purchase/verify',
  BOOSTS_ANALYTICS: (boostId: string) => `/boosts/analytics/${boostId}`,
  BOOSTS_BOOSTABLE: (venueId: string) => `/boosts/boostable/${venueId}`,
  
  // ==================== Referral ====================
  REFERRAL_CODE: '/referral/code',
  REFERRAL_STATS: '/referral/stats',
  REFERRAL_HISTORY: '/referral/history',
  REFERRAL_VALIDATE: '/referral/validate',
  REFERRAL_REGISTER: '/referral/register',
  REFERRAL_CONVERT: '/referral/convert',
  REFERRAL_BOOSTS: '/referral/boosts',
  REFERRAL_BOOST_USE: (boostId: string) => `/referral/boosts/${boostId}/use`,
  
  // ==================== Fidelity ====================
  FIDELITY_SUMMARY: '/fidelity/summary',
  FIDELITY_POINTS_HISTORY: '/fidelity/points-history',
  FIDELITY_BADGES: '/fidelity/badges',
  FIDELITY_CHALLENGES: '/fidelity/challenges',
  FIDELITY_LEVELS: '/fidelity/levels',
  
  // ==================== Discovery ====================
  DISCOVERY_NEARBY: '/discovery/nearby',
  DISCOVERY_VENUE: (venueId: string) => `/discovery/venues/${venueId}`,
  DISCOVERY_VENUE_MENU: (venueId: string) => `/discovery/venues/${venueId}/menu`,
  DISCOVERY_VENUE_HOURS: (venueId: string) => `/discovery/venues/${venueId}/hours`,
  DISCOVERY_MATCHES_NEARBY: '/discovery/matches-nearby',
  DISCOVERY_SEARCH: '/discovery/search',
  
  // ==================== Health ====================
  HEALTH: '/health',
} as const;

/**
 * Build full URL with query parameters
 * 
 * @param endpoint - API endpoint path
 * @param params - Query parameters (snake_case)
 * @returns Full URL with query string
 * 
 * @example
 * buildUrl('/matches', { status: 'upcoming', limit: 20 })
 * // Returns: 'https://api.example.com/api/matches?status=upcoming&limit=20'
 */
export function buildUrl(endpoint: string, params?: Record<string, any>): string {
  let url = `${API_BASE_URL}${endpoint}`;
  
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }
  
  return url;
}

/**
 * Build URL with path parameters only
 * 
 * @param endpoint - API endpoint path
 * @returns Full URL
 * 
 * @example
 * buildPath('/venues/123')
 * // Returns: 'https://api.example.com/api/venues/123'
 */
export function buildPath(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}
