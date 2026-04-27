/**
 * Application configuration constants
 */

// Pricing
export const PRICING = {
  MONTHLY: 30,
  ANNUAL: 300,
  CURRENCY: 'EUR',
} as const;

// Capacity limits
export const LIMITS = {
  MAX_RESTAURANT_CAPACITY: 500,
  MIN_RESTAURANT_CAPACITY: 1,
  MAX_RESTAURANTS_PER_USER: 10,
  MAX_MATCHES_PER_MONTH: 100,
} as const;

// Time formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  API: 'YYYY-MM-DD',
  TIME: 'HH:mm',
} as const;

// Sports available
export const SPORTS = {
  FOOTBALL: { emoji: '⚽', name: 'Football' },
  BASKETBALL: { emoji: '🏀', name: 'Basketball' },
  RUGBY: { emoji: '🏉', name: 'Rugby' },
  TENNIS: { emoji: '🎾', name: 'Tennis' },
  HANDBALL: { emoji: '🤾', name: 'Handball' },
} as const;

// Reservation status
export const RESERVATION_STATUS = {
  CONFIRMED: 'confirmée',
  PENDING: 'en attente',
  CANCELLED: 'annulée',
} as const;

// Match status
export const MATCH_STATUS = {
  UPCOMING: 'à venir',
  ONGOING: 'en cours',
  FINISHED: 'terminé',
  CANCELLED: 'annulé',
} as const;

// Notification types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'match-theme',
  AUTH_TOKEN: 'match-auth-token',
  USER: 'match-user',
  SELECTED_RESTAURANT: 'match-selected-restaurant',
} as const;
