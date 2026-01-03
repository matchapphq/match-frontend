// API Service for Match Frontend
// Connects to match-api backend

declare const import_meta_env: { VITE_API_URL?: string } | undefined;
const API_BASE_URL = (typeof import_meta_env !== 'undefined' && import_meta_env?.VITE_API_URL) 
  || (import.meta as any).env?.VITE_API_URL 
  || 'http://localhost:8008/api';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Get base URL without /api suffix for health check
  private getBaseUrlWithoutApi(): string {
    return this.baseUrl.replace(/\/api$/, '');
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      credentials: 'include', // Include cookies for auth
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // ============================================
  // AUTH
  // ============================================

  async login(email: string, password: string) {
    return this.request<{ user: any; token?: string }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  }

  async register(data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) {
    return this.request<{ user: any }>('/auth/register', {
      method: 'POST',
      body: data,
    });
  }

  async logout() {
    return this.request<{ success: boolean }>('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request<{ user: any }>('/users/me');
  }

  async refreshToken() {
    return this.request<{ token: string; refresh_token: string }>('/auth/refresh-token', {
      method: 'POST',
    });
  }

  async getMe() {
    return this.request<{ user: ApiUser }>('/auth/me');
  }

  async updateMe(data: { first_name?: string; last_name?: string; phone?: string }) {
    return this.request<{ msg: string }>('/auth/me', {
      method: 'PUT',
      body: data,
    });
  }

  // ============================================
  // HEALTH CHECK (No auth required)
  // ============================================

  async healthCheck(): Promise<{ status: 'ok' | 'error'; message?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const text = await response.text();
        return { status: 'ok', message: text };
      }
      return { status: 'error', message: 'API not responding' };
    } catch (error: any) {
      return { status: 'error', message: error.message || 'Connection failed' };
    }
  }

  // ============================================
  // PARTNER - VENUES (Restaurants)
  // ============================================

  async getMyVenues() {
    return this.request<{ venues: Venue[] }>('/partners/venues');
  }

  async createVenue(data: CreateVenueData) {
    return this.request<{ checkout_url: string; session_id: string; message: string }>('/partners/venues', {
      method: 'POST',
      body: data,
    });
  }

  async verifyCheckoutAndCreateVenue(sessionId: string) {
    return this.request<{ venue: Venue; subscription: any; message: string; already_exists?: boolean }>('/partners/venues/verify-checkout', {
      method: 'POST',
      body: { session_id: sessionId },
    });
  }

  // ============================================
  // PARTNER - MATCHES
  // ============================================

  async getMyMatches() {
    return this.request<{ data: VenueMatch[] }>('/partners/venues/matches');
  }

  async scheduleMatch(venueId: string, matchId: string, totalCapacity: number) {
    return this.request<{ venueMatch: any }>(`/partners/venues/${venueId}/matches`, {
      method: 'POST',
      body: { match_id: matchId, total_capacity: totalCapacity },
    });
  }

  async cancelMatch(venueId: string, matchId: string) {
    return this.request<{ success: boolean }>(`/partners/venues/${venueId}/matches/${matchId}`, {
      method: 'DELETE',
    });
  }

  // ============================================
  // PARTNER - CLIENTS
  // ============================================

  async getVenueClients(venueId: string) {
    return this.request<{ clients: Client[]; total: number }>(`/partners/venues/${venueId}/clients`);
  }

  async getAllClients(venueIds: string[]) {
    // Fetch clients from all venues
    const results = await Promise.all(
      venueIds.map(id => this.getVenueClients(id).catch(() => ({ clients: [], total: 0 })))
    );
    const allClients = results.flatMap(r => r.clients);
    return { clients: allClients, total: allClients.length };
  }

  // ============================================
  // PARTNER - STATS & ANALYTICS
  // ============================================

  async getCustomerStats() {
    return this.request<CustomerStats>('/partners/stats/customers');
  }

  async getAnalyticsSummary() {
    return this.request<AnalyticsSummary>('/partners/analytics/summary');
  }

  async getVenueAnalytics(venueId: string, params?: { start_date?: string; end_date?: string }) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    return this.request<VenueAnalytics>(`/venues/${venueId}/analytics/overview${queryString}`);
  }

  // ============================================
  // NOTIFICATIONS
  // ============================================

  async getNotifications() {
    return this.request<{ notifications: Notification[] }>('/notifications');
  }

  async markNotificationAsRead(notificationId: string) {
    return this.request<{ success: boolean }>(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request<{ success: boolean }>('/notifications/read-all', {
      method: 'PUT',
    });
  }

  async deleteNotification(notificationId: string) {
    return this.request<{ success: boolean }>(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  }

  // ============================================
  // BILLING
  // ============================================

  async getInvoices() {
    return this.request<{ invoices: Invoice[] }>('/invoices');
  }

  async getTransactions() {
    return this.request<{ transactions: Transaction[] }>('/transactions');
  }

  // ============================================
  // SPORTS & MATCHES (Discovery)
  // ============================================

  async getSports() {
    return this.request<{ sports: Sport[] }>('/sports');
  }

  async getUpcomingMatches(params?: { sport_id?: string; league_id?: string; date?: string }) {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';
    return this.request<{ matches: Match[] }>(`/matches${queryString}`);
  }

  // ============================================
  // ONBOARDING
  // ============================================

  async getOnboardingStatus() {
    return this.request<{ status: OnboardingStatus }>('/onboarding/status');
  }

  async saveOnboardingPreferences(data: { sports?: string[]; categories?: string[]; ambiances?: string[] }) {
    return this.request<{ success: boolean }>('/onboarding/preferences', {
      method: 'POST',
      body: data,
    });
  }

  async getOnboardingSports() {
    return this.request<{ sports: Sport[] }>('/onboarding/sports');
  }

  async getOnboardingCategories() {
    return this.request<{ categories: Category[] }>('/onboarding/categories');
  }

  async getOnboardingAmbiances() {
    return this.request<{ ambiances: Ambiance[] }>('/onboarding/ambiances');
  }

  // ============================================
  // USER PROFILE
  // ============================================

  async getUserProfile() {
    return this.request<{ user: ApiUser }>('/users/me');
  }

  async updateUserProfile(data: Partial<ApiUser>) {
    return this.request<{ msg: string }>('/users/me', {
      method: 'PUT',
      body: data,
    });
  }

  async completeUserOnboarding() {
    return this.request<{ success: boolean }>('/users/me/onboarding-complete', {
      method: 'PUT',
    });
  }

  async updateNotificationPreferences(preferences: NotificationPreferences) {
    return this.request<{ success: boolean }>('/users/me/notification-preferences', {
      method: 'PUT',
      body: preferences,
    });
  }

  // ============================================
  // SUBSCRIPTIONS
  // ============================================

  async getSubscriptionPlans() {
    return this.request<{ plans: SubscriptionPlan[] }>('/subscriptions/plans');
  }

  async createCheckout(planId: string, venueId?: string) {
    return this.request<{ checkout_url: string; session_id: string }>('/subscriptions/create-checkout', {
      method: 'POST',
      body: { plan_id: planId, venue_id: venueId },
    });
  }

  async getPaymentPortal() {
    return this.request<{ portal_url: string }>('/subscriptions/me/update-payment-method', {
      method: 'POST',
    });
  }

  async getMySubscription() {
    return this.request<{ subscription: Subscription | null }>('/subscriptions/me');
  }

  async cancelSubscription() {
    return this.request<{ success: boolean }>('/subscriptions/me/cancel', {
      method: 'POST',
    });
  }

  async upgradeSubscription(planId: string) {
    return this.request<{ success: boolean }>('/subscriptions/me/upgrade', {
      method: 'POST',
      body: { plan_id: planId },
    });
  }

  async getMyInvoices() {
    return this.request<{ invoices: Invoice[] }>('/subscriptions/invoices');
  }

  async getVenuePaymentPortal(venueId: string) {
    return this.request<{ portal_url: string }>(`/partners/venues/${venueId}/payment-portal`, {
      method: 'POST',
    });
  }

  async getVenueSubscription(venueId: string) {
    return this.request<{ subscription: Subscription | null }>(`/partners/venues/${venueId}/subscription`);
  }

  // ============================================
  // RESERVATIONS
  // ============================================

  async getMyReservations() {
    return this.request<{ reservations: Reservation[] }>('/reservations');
  }

  async getReservation(reservationId: string) {
    return this.request<{ reservation: Reservation }>(`/reservations/${reservationId}`);
  }

  async cancelReservation(reservationId: string) {
    return this.request<{ success: boolean }>(`/reservations/${reservationId}/cancel`, {
      method: 'POST',
    });
  }

  async verifyQRCode(qrCode: string) {
    return this.request<{ valid: boolean; reservation?: Reservation }>('/reservations/verify-qr', {
      method: 'POST',
      body: { qr_code: qrCode },
    });
  }

  async checkInReservation(reservationId: string) {
    return this.request<{ success: boolean }>(`/reservations/${reservationId}/check-in`, {
      method: 'POST',
    });
  }

  async getVenueMatchReservations(venueMatchId: string) {
    return this.request<{ reservations: Reservation[] }>(`/reservations/venue-match/${venueMatchId}`);
  }

  // ============================================
  // DISCOVERY
  // ============================================

  async getNearbyVenues(lat: number, lng: number, radius?: number) {
    const params = new URLSearchParams({ lat: lat.toString(), lng: lng.toString() });
    if (radius) params.append('radius', radius.toString());
    return this.request<{ venues: Venue[] }>(`/discovery/nearby?${params}`);
  }

  async getVenueDetails(venueId: string) {
    return this.request<{ venue: Venue }>(`/discovery/venues/${venueId}`);
  }

  async getVenueMenu(venueId: string) {
    return this.request<{ menu: MenuItem[] }>(`/discovery/venues/${venueId}/menu`);
  }

  async getVenueHours(venueId: string) {
    return this.request<{ hours: VenueHours[] }>(`/discovery/venues/${venueId}/hours`);
  }

  async getNearbyMatches(lat: number, lng: number, radius?: number) {
    const params = new URLSearchParams({ lat: lat.toString(), lng: lng.toString() });
    if (radius) params.append('radius', radius.toString());
    return this.request<{ matches: any[] }>(`/discovery/matches-nearby?${params}`);
  }

  async searchVenues(query: string, filters?: { sport_id?: string; date?: string }) {
    return this.request<{ venues: Venue[]; matches: any[] }>('/discovery/search', {
      method: 'POST',
      body: { query, ...filters },
    });
  }

  // ============================================
  // REVIEWS
  // ============================================

  async updateReview(reviewId: string, data: { rating?: number; comment?: string }) {
    return this.request<{ review: Review }>(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteReview(reviewId: string) {
    return this.request<{ success: boolean }>(`/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  }

  async markReviewHelpful(reviewId: string) {
    return this.request<{ success: boolean }>(`/reviews/${reviewId}/helpful`, {
      method: 'POST',
    });
  }
}

// ============================================
// TYPES
// ============================================

export interface Venue {
  id: string;
  name: string;
  owner_id: string;
  street_address: string;
  city: string;
  state_province?: string;
  postal_code: string;
  country: string;
  phone?: string;
  email?: string;
  capacity?: number;
  image_url?: string;
  rating?: number;
  review_count?: number;
  created_at?: string;
}

export interface CreateVenueData {
  name: string;
  street_address: string;
  city: string;
  state_province?: string;
  postal_code: string;
  country: string;
  phone?: string;
  email?: string;
  capacity?: number;
  plan_id?: 'monthly' | 'annual';
}

export interface VenueMatch {
  id: string;
  venue: { id: string; name: string } | null;
  match: {
    id: string;
    homeTeam: string;
    awayTeam: string;
    scheduled_at: string;
    league?: string;
  } | null;
  total_capacity: number;
  reserved_seats: number;
  available_capacity: number;
  status: 'upcoming' | 'live' | 'finished';
}

export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  match_name: string;
  reservation_date: string;
  party_size: number;
  status: string;
}

export interface CustomerStats {
  customerCount: number;
  totalGuests: number;
  totalReservations: number;
  period: string;
}

export interface AnalyticsSummary {
  total_clients: number;
  total_reservations: number;
  total_views: number;
  matches_completed: number;
  matches_upcoming: number;
  average_occupancy: number;
}

export interface VenueAnalytics {
  venue: { id: string; name: string; city: string };
  period: { startDate: string | null; endDate: string | null };
  overview: {
    totalReservations: number;
    totalGuests: number;
    averageOccupancy: number;
    matchesHosted: number;
  };
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'reservation' | 'review' | 'referral' | 'system';
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  metadata?: any;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  venue_id?: string;
  amount: number;
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'pending' | 'paid' | 'overdue' | 'canceled';
  issue_date: string;
  due_date: string;
  paid_date?: string;
  description?: string;
  pdf_url?: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
}

export interface Sport {
  id: string;
  name: string;
  icon?: string;
}

export interface Match {
  id: string;
  home_team: { id: string; name: string };
  away_team: { id: string; name: string };
  league: { id: string; name: string };
  scheduled_at: string;
  status: string;
}

export interface ApiUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'user' | 'venue_owner' | 'admin';
  has_completed_onboarding?: boolean;
  created_at?: string;
}

export interface OnboardingStatus {
  completed: boolean;
  current_step: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Ambiance {
  id: string;
  name: string;
}

export interface NotificationPreferences {
  email_notifications?: boolean;
  push_notifications?: boolean;
  reservation_reminders?: boolean;
  match_alerts?: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
}

export interface Subscription {
  id: string;
  plan: string;
  plan_name?: string; // User-friendly name: "Mensuel" or "Annuel"
  display_price?: string; // Formatted price: "30€/mois" or "300€/an"
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  auto_renew: boolean;
  price: string;
  currency: string;
  canceled_at: string | null;
  plan_details: {
    name: string;
    features: string[];
  } | null;
}

export interface Reservation {
  id: string;
  user_id: string;
  venue_match_id: string;
  party_size: number;
  status: 'pending' | 'confirmed' | 'checked_in' | 'canceled' | 'no_show';
  qr_code?: string;
  created_at: string;
  venue?: { id: string; name: string };
  match?: { home_team: string; away_team: string; scheduled_at: string };
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
}

export interface VenueHours {
  day: string;
  open: string;
  close: string;
}

export interface Review {
  id: string;
  user_id: string;
  venue_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

// Export singleton instance
export const api = new ApiService();
export default api;
