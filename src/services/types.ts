/**
 * TypeScript types for Match API responses
 * These types match the backend API contracts
 */

// ============================================
// AUTH TYPES
// ============================================

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'user' | 'venue_owner' | 'admin';
  phone?: string;
  avatar_url?: string;
  bio?: string;
  language?: string;
  timezone?: string;
  onboarding_complete?: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refresh_token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: 'user' | 'venue_owner' | 'admin';
}

// ============================================
// VENUE TYPES
// ============================================

export type VenueType = 
  | 'sports_bar'
  | 'pub'
  | 'restaurant'
  | 'club'
  | 'hotel_bar'
  | 'brewery'
  | 'other';

export type VenueStatus = 'pending' | 'active' | 'suspended' | 'closed';

export interface Venue {
  id: string;
  owner_id: string;
  subscription_id: string;
  name: string;
  description?: string;
  type: VenueType;
  street_address: string;
  city: string;
  state_province?: string;
  postal_code: string;
  country: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  opening_hours?: Record<string, string>;
  capacity?: number;
  has_terrace?: boolean;
  has_wifi?: boolean;
  has_parking?: boolean;
  has_wheelchair_access?: boolean;
  menu?: Record<string, unknown>;
  status: VenueStatus;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateVenueRequest {
  name: string;
  description?: string;
  type: VenueType;
  street_address: string;
  city: string;
  state_province?: string;
  postal_code: string;
  country: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  opening_hours?: Record<string, string>;
  capacity?: number;
  has_terrace?: boolean;
  has_wifi?: boolean;
  has_parking?: boolean;
  has_wheelchair_access?: boolean;
}

export interface UpdateVenueRequest extends Partial<CreateVenueRequest> {}

export interface VenuesResponse {
  venues: Venue[];
  total: number;
  limit: number;
  offset: number;
}

export interface VenuePhoto {
  id: string;
  venue_id: string;
  url: string;
  alt_text?: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

// ============================================
// MATCH TYPES
// ============================================

export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'cancelled' | 'postponed';

export interface Team {
  id: string;
  name: string;
  short_name?: string;
  logo_url?: string;
  country?: string;
}

export interface Match {
  id: string;
  league_id: string;
  home_team_id: string;
  away_team_id: string;
  scheduled_at: string;
  status: MatchStatus;
  home_score?: number;
  away_score?: number;
  created_at: string;
  updated_at: string;
  // Joined data
  home_team?: Team;
  away_team?: Team;
  league?: League;
}

export interface League {
  id: string;
  sport_id: string;
  name: string;
  country?: string;
  logo_url?: string;
  is_active: boolean;
}

export interface Sport {
  id: string;
  name: string;
  icon?: string;
  is_active: boolean;
}

// ============================================
// VENUE MATCH TYPES (Broadcasting)
// ============================================

export interface VenueMatch {
  id: string;
  venue_id: string;
  match_id: string;
  total_seats: number;
  available_seats: number;
  allows_reservations: boolean;
  is_active: boolean;
  is_featured: boolean;
  estimated_crowd_level?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  match?: Match;
  venue?: Venue;
}

export interface ScheduleMatchRequest {
  match_id: string;
  total_seats: number;
  allows_reservations?: boolean;
  estimated_crowd_level?: string;
  notes?: string;
}

// ============================================
// RESERVATION TYPES
// ============================================

export type ReservationStatus = 
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export interface Reservation {
  id: string;
  user_id: string;
  venue_match_id: string;
  table_id?: string;
  party_size: number;
  status: ReservationStatus;
  qr_code?: string;
  special_requests?: string;
  checked_in_at?: string;
  created_at: string;
  updated_at: string;
  // Joined data
  venue_match?: VenueMatch;
  user?: User;
}

export interface ReservationsResponse {
  reservations: Reservation[];
  total: number;
}

// ============================================
// REVIEW TYPES
// ============================================

export interface Review {
  id: string;
  user_id: string;
  venue_id: string;
  rating: number;
  title: string;
  content: string;
  atmosphere_rating?: number;
  food_rating?: number;
  service_rating?: number;
  value_rating?: number;
  helpful_count: number;
  created_at: string;
  updated_at: string;
  // Joined data
  user?: User;
}

export interface ReviewsResponse {
  reviews: Review[];
  total: number;
  average_rating: number;
}

// ============================================
// ANALYTICS TYPES
// ============================================

export interface AnalyticsOverview {
  total_reservations: number;
  total_check_ins: number;
  average_party_size: number;
  occupancy_rate: number;
  upcoming_matches: number;
  total_reviews: number;
  average_rating: number;
}

export interface AnalyticsOverviewResponse {
  venue: {
    id: string;
    name: string;
    city: string;
  };
  period: {
    startDate: string | null;
    endDate: string | null;
  };
  overview: AnalyticsOverview;
}

export interface TrendDataPoint {
  date: string;
  count: number;
  value?: number;
}

export interface AnalyticsTrendsResponse {
  venue: {
    id: string;
    name: string;
  };
  period: {
    startDate: string | null;
    endDate: string | null;
    groupBy: 'day' | 'week' | 'month';
  };
  trends: TrendDataPoint[];
}

// ============================================
// SUBSCRIPTION TYPES
// ============================================

export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'cancelled' | 'unpaid';
export type SubscriptionPlan = 'basic' | 'pro' | 'enterprise';

export interface Subscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionPlanDetails {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: {
    max_monthly_reservations: number;
    venue_promotion_slots: number;
    advanced_analytics: boolean;
    priority_support: boolean;
  };
}

export interface SubscriptionPlansResponse {
  plans: {
    basic: SubscriptionPlanDetails;
    pro: SubscriptionPlanDetails;
    enterprise: SubscriptionPlanDetails;
  };
}

export interface SubscriptionResponse {
  subscription: Subscription;
  next_billing_date: string;
  payment_method?: {
    card_brand: string;
    card_last_four: string;
    card_exp_month: number;
    card_exp_year: number;
  };
}

// ============================================
// BILLING TYPES
// ============================================

export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';

export interface Invoice {
  id: string;
  user_id: string;
  subscription_id: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  paid_at?: string;
  created_at: string;
}

export interface InvoicesResponse {
  invoices: Invoice[];
  total: number;
}

export type TransactionType = 'payment' | 'refund' | 'adjustment';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Transaction {
  id: string;
  user_id: string;
  invoice_id?: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  description?: string;
  created_at: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  total: number;
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export type NotificationType = 
  | 'reservation_new'
  | 'reservation_cancelled'
  | 'reservation_reminder'
  | 'review_new'
  | 'match_reminder'
  | 'subscription_reminder'
  | 'system';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unread_count: number;
}

// ============================================
// COMMON TYPES
// ============================================

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface MessageResponse {
  message: string;
}
