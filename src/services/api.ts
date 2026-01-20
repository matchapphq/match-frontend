/**
 * API Service Layer for Match Platform
 * 
 * Centralized Axios configuration and API endpoints
 * Base URL should be configured via environment variables
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// ============================================================================
// API CONFIGURATION
// ============================================================================

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_TIMEOUT = 30000; // 30 seconds

// ============================================================================
// AXIOS INSTANCE
// ============================================================================

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================================
// REQUEST INTERCEPTOR (Add auth token)
// ============================================================================

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ============================================================================
// RESPONSE INTERCEPTOR (Handle errors globally)
// ============================================================================

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refresh_token: refreshToken,
          });

          const { token } = response.data;
          localStorage.setItem('authToken', token);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }

          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

// ============================================================================
// AUTHENTICATION API
// ============================================================================

export const authAPI = {
  register: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role: 'user' | 'venue_owner' | 'admin';
  }) => api.post('/auth/register', data),

  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  logout: () => api.post('/auth/logout'),

  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh-token', { refresh_token: refreshToken }),

  getMe: () => api.get('/auth/me'),

  updateMe: (data: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    avatar_url?: string;
  }) => api.put('/auth/me', data),

  deleteAccount: () => api.delete('/auth/me'),
};

// ============================================================================
// USER API
// ============================================================================

export const userAPI = {
  getMe: () => api.get('/users/me'),

  updateMe: (data: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    avatar_url?: string;
    bio?: string;
  }) => api.put('/users/me', data),

  deleteAccount: () => api.delete('/users/me'),

  updateNotificationPreferences: (data: {
    email_notifications?: boolean;
    push_notifications?: boolean;
    sms_notifications?: boolean;
    match_notifications?: boolean;
    reservation_reminders?: boolean;
  }) => api.put('/users/me/notification-preferences', data),

  completeOnboarding: () => api.put('/users/me/onboarding-complete'),

  getAddresses: () => api.get('/users/me/addresses'),

  addAddress: (data: {
    street_address: string;
    city: string;
    state_province?: string;
    postal_code: string;
    country: string;
    is_default?: boolean;
  }) => api.post('/users/me/addresses', data),

  updateAddress: (
    addressId: string,
    data: {
      street_address?: string;
      city?: string;
      postal_code?: string;
      is_default?: boolean;
    }
  ) => api.put(`/users/me/addresses/${addressId}`, data),

  deleteAddress: (addressId: string) => api.delete(`/users/me/addresses/${addressId}`),

  getFavoriteVenues: () => api.get('/users/me/favorite-venues'),

  getUser: (userId: string) => api.get(`/users/${userId}`),
};

// ============================================================================
// ONBOARDING API
// ============================================================================

export const onboardingAPI = {
  complete: (data: {
    sports: string[];
    ambiances: string[];
    venue_types: string[];
    budget?: string;
    food_drinks_preferences?: string[];
  }) => api.post('/onboarding/complete', data),
};

// ============================================================================
// VENUE API
// ============================================================================

export const venueAPI = {
  getAll: (params?: {
    limit?: number;
    offset?: number;
    city?: string;
    type?: string;
    search?: string;
    lat?: number;
    lng?: number;
    distance_km?: number;
  }) => api.get('/venues', { params }),

  getNearby: (params: {
    lat: number;
    lng: number;
    distance_km?: number;
    limit?: number;
  }) => api.get('/venues/nearby', { params }),

  getById: (venueId: string) => api.get(`/venues/${venueId}`),

  getPhotos: (venueId: string) => api.get(`/venues/${venueId}/photos`),

  getReviews: (venueId: string, params?: { limit?: number; offset?: number }) =>
    api.get(`/venues/${venueId}/reviews`, { params }),

  getMatches: (venueId: string, params?: { status?: string; limit?: number }) =>
    api.get(`/venues/${venueId}/matches`, { params }),

  getAvailability: (venueId: string, params?: { date?: string; match_id?: string }) =>
    api.get(`/venues/${venueId}/availability`, { params }),

  create: (data: {
    name: string;
    description?: string;
    type: string;
    street_address: string;
    city: string;
    postal_code: string;
    country: string;
    latitude: number;
    longitude: number;
    phone?: string;
    capacity?: number;
  }) => api.post('/venues', data),

  update: (
    venueId: string,
    data: {
      name?: string;
      description?: string;
      phone?: string;
      opening_hours?: object;
      capacity?: number;
    }
  ) => api.put(`/venues/${venueId}`, data),

  delete: (venueId: string) => api.delete(`/venues/${venueId}`),

  // 🆕 Booking Mode - Dedicated endpoint
  updateBookingMode: (venueId: string, bookingMode: 'INSTANT' | 'REQUEST') =>
    api.put(`/venues/${venueId}/booking-mode`, { booking_mode: bookingMode }),

  addToFavorites: (venueId: string, note?: string) =>
    api.post(`/venues/${venueId}/favorite`, { note }),

  removeFromFavorites: (venueId: string) => api.delete(`/venues/${venueId}/favorite`),

  updateFavoriteNote: (venueId: string, note: string) =>
    api.patch(`/venues/${venueId}/favorite`, { note }),

  checkIsFavorite: (venueId: string) => api.get(`/venues/${venueId}/favorite`),
};

// ============================================================================
// SPORTS API
// ============================================================================

export const sportsAPI = {
  getAll: (params?: { limit?: number; offset?: number }) =>
    api.get('/sports', { params }),

  getById: (sportId: string) => api.get(`/sports/${sportId}`),

  getLeagues: (sportId: string) => api.get(`/sports/${sportId}/leagues`),
};

// ============================================================================
// LEAGUES API
// ============================================================================

export const leaguesAPI = {
  getById: (leagueId: string) => api.get(`/leagues/${leagueId}`),

  getTeams: (leagueId: string) => api.get(`/leagues/${leagueId}/teams`),
};

// ============================================================================
// TEAMS API
// ============================================================================

export const teamsAPI = {
  getById: (teamId: string) => api.get(`/teams/${teamId}`),
};

// ============================================================================
// MATCHES API
// ============================================================================

export const matchesAPI = {
  getAll: (params?: {
    limit?: number;
    offset?: number;
    status?: string;
    league_id?: string;
    scheduled_from?: string;
    scheduled_to?: string;
  }) => api.get('/matches', { params }),

  getUpcoming: (params?: { limit?: number; sport_id?: string }) =>
    api.get('/matches/upcoming', { params }),

  getUpcomingNearby: (params: {
    lat: number;
    lng: number;
    distance_km?: number;
    limit?: number;
  }) => api.get('/matches/upcoming-nearby', { params }),

  getById: (matchId: string) => api.get(`/matches/${matchId}`),

  getVenues: (matchId: string) => api.get(`/matches/${matchId}/venues`),

  getLiveUpdates: (matchId: string) => api.get(`/matches/${matchId}/live-updates`),
};

// ============================================================================
// DISCOVERY API
// ============================================================================

export const discoveryAPI = {
  getNearby: (params: { lat: number; lng: number; distance_km?: number }) =>
    api.get('/discovery/nearby', { params }),

  getVenueDetails: (venueId: string) => api.get(`/discovery/venues/${venueId}`),

  getVenueMenu: (venueId: string) => api.get(`/discovery/venues/${venueId}/menu`),

  getVenueHours: (venueId: string) => api.get(`/discovery/venues/${venueId}/hours`),

  getMatchesNearby: (params: { lat: number; lng: number; distance_km?: number }) =>
    api.get('/discovery/matches-nearby', { params }),

  search: (data: {
    query: string;
    lat?: number;
    lng?: number;
    filters?: {
      type?: string;
      sport?: string;
    };
  }) => api.post('/discovery/search', data),
};

// ============================================================================
// SEATS API
// ============================================================================

export const seatsAPI = {
  getSeats: (venueId: string, params?: { match_id?: string }) =>
    api.get(`/venues/${venueId}/seats`, { params }),

  reserveSeats: (
    venueId: string,
    data: {
      seat_ids: string[];
      match_id: string;
    }
  ) => api.post(`/venues/${venueId}/seats/reserve`, data),

  getPricing: (venueId: string, params?: { match_id?: string }) =>
    api.get(`/venues/${venueId}/seats/pricing`, { params }),
};

// ============================================================================
// RESERVATIONS API
// ============================================================================

export const reservationsAPI = {
  getAll: (params?: { status?: string; limit?: number; offset?: number }) =>
    api.get('/reservations', { params }),

  getById: (reservationId: string) => api.get(`/reservations/${reservationId}`),

  // 🆕 Simplified reservation creation (replaces hold + confirm)
  // Backend determines PENDING vs CONFIRMED based on venue.booking_mode
  create: (data: {
    venue_match_id: string;
    party_size: number;
    requires_accessibility?: boolean;
    special_requests?: string;
  }) => api.post('/reservations', data),

  cancel: (reservationId: string, reason?: string) =>
    api.post(`/reservations/${reservationId}/cancel`, { reason }),

  verifyQR: (qrCode: string) => api.post('/reservations/verify-qr', { qr_code: qrCode }),

  checkIn: (reservationId: string) => api.post(`/reservations/${reservationId}/check-in`),

  getByVenueMatch: (venueMatchId: string) =>
    api.get(`/reservations/venue-match/${venueMatchId}`),

  // Waitlist
  joinWaitlist: (data: { venue_match_id: string; party_size: number }) =>
    api.post('/reservations/waitlist', data),

  getMyWaitlist: () => api.get('/reservations/waitlist/me'),

  leaveWaitlist: (waitlistId: string) =>
    api.delete(`/reservations/waitlist/${waitlistId}`),
};

// ============================================================================
// REVIEWS API
// ============================================================================

export const reviewsAPI = {
  create: (
    venueId: string,
    data: {
      rating: number;
      title: string;
      content: string;
      atmosphere_rating?: number;
      food_rating?: number;
      service_rating?: number;
      value_rating?: number;
    }
  ) => api.post(`/venues/${venueId}/reviews`, data),

  getByVenue: (
    venueId: string,
    params?: { limit?: number; offset?: number; sort?: string }
  ) => api.get(`/venues/${venueId}/reviews`, { params }),

  update: (
    reviewId: string,
    data: {
      rating?: number;
      title?: string;
      content?: string;
      atmosphere_rating?: number;
      food_rating?: number;
      service_rating?: number;
      value_rating?: number;
    }
  ) => api.put(`/reviews/${reviewId}`, data),

  delete: (reviewId: string) => api.delete(`/reviews/${reviewId}`),

  markHelpful: (reviewId: string, isHelpful: boolean) =>
    api.post(`/reviews/${reviewId}/helpful`, { is_helpful: isHelpful }),
};

// ============================================================================
// NOTIFICATIONS API
// ============================================================================

export const notificationsAPI = {
  getAll: (params?: {
    is_read?: boolean;
    type?: string;
    limit?: number;
    offset?: number;
  }) => api.get('/notifications', { params }),

  markAsRead: (notificationId: string) =>
    api.put(`/notifications/${notificationId}/read`),

  markAllAsRead: () => api.put('/notifications/read-all'),

  delete: (notificationId: string) => api.delete(`/notifications/${notificationId}`),
};

// ============================================================================
// MESSAGING API
// ============================================================================

export const messagingAPI = {
  createOrGetConversation: (data: { participant_id: string; subject?: string }) =>
    api.post('/conversations', data),

  getConversations: (params?: { limit?: number; offset?: number }) =>
    api.get('/conversations', { params }),

  getMessages: (conversationId: string, params?: { limit?: number; offset?: number }) =>
    api.get(`/conversations/${conversationId}/messages`, { params }),

  sendMessage: (
    conversationId: string,
    data: {
      type: 'text' | 'image' | 'file';
      content: string;
      file?: File;
    }
  ) => {
    const formData = new FormData();
    formData.append('type', data.type);
    formData.append('content', data.content);
    if (data.file) {
      formData.append('file', data.file);
    }
    return api.post(`/conversations/${conversationId}/messages`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  editMessage: (messageId: string, content: string) =>
    api.put(`/messages/${messageId}`, { content }),

  deleteMessage: (messageId: string) => api.delete(`/messages/${messageId}`),

  archiveConversation: (conversationId: string) =>
    api.put(`/conversations/${conversationId}/archive`),
};

// ============================================================================
// SUBSCRIPTIONS API (Venue Owners)
// ============================================================================

export const subscriptionsAPI = {
  getPlans: () => api.get('/subscriptions/plans'),

  createCheckout: (data: {
    plan: 'basic' | 'pro' | 'enterprise';
    billing_period?: 'monthly' | 'yearly';
  }) => api.post('/subscriptions/create-checkout', data),

  getMySubscription: () => api.get('/subscriptions/me'),

  updatePaymentMethod: (stripePaymentMethodId: string) =>
    api.post('/subscriptions/me/update-payment-method', {
      stripe_payment_method_id: stripePaymentMethodId,
    }),

  cancel: () => api.post('/subscriptions/me/cancel'),

  upgrade: (plan: 'basic' | 'pro' | 'enterprise') =>
    api.post('/subscriptions/me/upgrade', { plan }),

  getInvoices: (params?: { status?: string; limit?: number; offset?: number }) =>
    api.get('/subscriptions/invoices', { params }),
};

// ============================================================================
// INVOICES API (Venue Owners)
// ============================================================================

export const invoicesAPI = {
  getAll: (params?: { status?: string; limit?: number; offset?: number }) =>
    api.get('/invoices', { params }),

  getById: (invoiceId: string) => api.get(`/invoices/${invoiceId}`),

  downloadPDF: (invoiceId: string) => api.get(`/invoices/${invoiceId}/pdf`),
};

// ============================================================================
// TRANSACTIONS API (Venue Owners)
// ============================================================================

export const transactionsAPI = {
  getAll: (params?: {
    type?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }) => api.get('/transactions', { params }),

  getById: (transactionId: string) => api.get(`/transactions/${transactionId}`),
};

// ============================================================================
// ANALYTICS API (Venue Owners)
// ============================================================================

export const analyticsAPI = {
  getOverview: (venueId: string, params?: { from?: string; to?: string }) =>
    api.get(`/venues/${venueId}/analytics/overview`, { params }),

  getReservations: (
    venueId: string,
    params?: { from?: string; to?: string; group_by?: string }
  ) => api.get(`/venues/${venueId}/analytics/reservations`, { params }),

  getRevenue: (venueId: string, params?: { from?: string; to?: string }) =>
    api.get(`/venues/${venueId}/analytics/revenue`, { params }),
};

// ============================================================================
// PARTNER API (Venue Owners Dashboard)
// ============================================================================

export const partnerAPI = {
  // Venues
  getVenues: () => api.get('/partners/venues'),

  createVenue: (data: {
    name: string;
    street_address: string;
    city: string;
    postal_code: string;
    country: string;
    latitude: number;
    longitude: number;
  }) => api.post('/partners/venues', data),

  verifyCheckout: (sessionId: string) =>
    api.post('/partners/venues/verify-checkout', { session_id: sessionId }),

  // Venue Matches
  getVenueMatches: () => api.get('/partners/venues/matches'),

  scheduleMatch: (
    venueId: string,
    data: { match_id: string; total_capacity: number }
  ) => api.post(`/partners/venues/${venueId}/matches`, data),

  updateVenueMatch: (
    venueId: string,
    matchId: string,
    data: {
      total_capacity?: number;
      available_capacity?: number;
      is_active?: boolean;
      is_featured?: boolean;
      allows_reservations?: boolean;
      max_group_size?: number;
      notes?: string;
    }
  ) => api.put(`/partners/venues/${venueId}/matches/${matchId}`, data),

  cancelMatch: (venueId: string, matchId: string) =>
    api.delete(`/partners/venues/${venueId}/matches/${matchId}`),

  getMatchCalendar: (venueId: string, params?: { month?: string; status?: string }) =>
    api.get(`/partners/venues/${venueId}/matches/calendar`, { params }),

  // Reservations
  getVenueReservations: (
    venueId: string,
    params?: { page?: number; limit?: number; status?: string }
  ) => api.get(`/partners/venues/${venueId}/reservations`, { params }),

  getVenueReservationStats: (
    venueId: string,
    params?: { from?: string; to?: string }
  ) => api.get(`/partners/venues/${venueId}/reservations/stats`, { params }),

  updateReservationStatus: (
    reservationId: string,
    status: 'CONFIRMED' | 'DECLINED'
  ) => api.patch(`/partners/reservations/${reservationId}/status`, { status }),

  updateReservation: (
    reservationId: string,
    data: {
      status?: string;
      table_number?: string;
      notes?: string;
      party_size?: number;
      special_requests?: string;
    }
  ) => api.patch(`/partners/reservations/${reservationId}`, data),

  markNoShow: (reservationId: string, reason?: string) =>
    api.post(`/partners/reservations/${reservationId}/mark-no-show`, { reason }),

  // Clients
  getVenueClients: (venueId: string) =>
    api.get(`/partners/venues/${venueId}/clients`),

  // Subscription
  getVenueSubscription: (venueId: string) =>
    api.get(`/partners/venues/${venueId}/subscription`),

  getPaymentPortalURL: (venueId: string) =>
    api.post(`/partners/venues/${venueId}/payment-portal`),

  // Stats & Analytics
  getCustomerStats: () => api.get('/partners/stats/customers'),

  getAnalyticsSummary: () => api.get('/partners/analytics/summary'),

  getDashboard: (params?: { start_date?: string; end_date?: string }) =>
    api.get('/partners/analytics/dashboard', { params }),

  // Waitlist
  getWaitlist: (venueId: string, matchId: string, params?: { status?: string }) =>
    api.get(`/partners/venues/${venueId}/matches/${matchId}/waitlist`, { params }),

  notifyWaitlistCustomer: (
    entryId: string,
    data?: { message?: string; expiry_minutes?: number }
  ) => api.post(`/partners/waitlist/${entryId}/notify`, data),
};

// ============================================================================
// BOOSTS API
// ============================================================================

export const boostsAPI = {
  getPrices: () => api.get('/boosts/prices'),

  getAvailable: () => api.get('/boosts/available'),

  getStats: () => api.get('/boosts/stats'),

  getSummary: () => api.get('/boosts/summary'),

  createCheckout: (data: {
    pack_type: 'single' | 'pack_3' | 'pack_10';
    success_url?: string;
    cancel_url?: string;
  }) => api.post('/boosts/purchase/create-checkout', data),

  verifyPurchase: (sessionId: string) =>
    api.post('/boosts/purchase/verify', { session_id: sessionId }),

  getBoostableMatches: (venueId: string) =>
    api.get(`/boosts/boostable/${venueId}`),

  getPurchases: (params?: { page?: number; limit?: number }) =>
    api.get('/boosts/purchases', { params }),

  activate: (data: { boost_id: string; venue_match_id: string }) =>
    api.post('/boosts/activate', data),

  deactivate: (boostId: string) =>
    api.post('/boosts/deactivate', { boost_id: boostId }),

  getHistory: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/boosts/history', { params }),

  getAnalytics: (boostId: string) => api.get(`/boosts/analytics/${boostId}`),
};

// ============================================================================
// COUPONS API
// ============================================================================

export const couponsAPI = {
  validate: (code: string, venueId?: string) =>
    api.get('/coupons/validate', { params: { code, venue_id: venueId } }),
};

// ============================================================================
// REFERRALS API (PARRAINAGE)
// ============================================================================

export const referralsAPI = {
  getMyCode: () => api.get('/referrals/my-code'),

  validate: (code: string) => api.post('/referrals/validate', { code }),

  getStats: () => api.get('/referrals/stats'),

  getHistory: (params?: { limit?: number; offset?: number; status?: string }) =>
    api.get('/referrals/history', { params }),

  claimReward: (referralId: string) => api.post('/referrals/rewards/claim', { referral_id: referralId }),
};

// ============================================================================
// WEBHOOKS API
// ============================================================================

export const webhooksAPI = {
  create: (data: {
    url: string;
    events: string[];
    secret?: string;
  }) => api.post('/webhooks', data),

  getAll: () => api.get('/webhooks'),

  get: (webhookId: string) => api.get(`/webhooks/${webhookId}`),

  update: (
    webhookId: string,
    data: {
      url?: string;
      events?: string[];
      secret?: string;
    }
  ) => api.put(`/webhooks/${webhookId}`, data),

  delete: (webhookId: string) => api.delete(`/webhooks/${webhookId}`),
};

// ============================================================================
// HEALTH CHECK
// ============================================================================

export const healthAPI = {
  check: () => api.get('/health'),
};

export default api;