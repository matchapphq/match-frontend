// API Response Types

export interface ApiUser {
  id: string;
  email: string;
  role: 'user' | 'venue_owner' | 'admin';
  first_name?: string;
  last_name?: string;
  phone?: string;
  created_at?: string;
}

export interface Venue {
  id: string;
  name: string;
  owner_id: string;
  street_address: string;
  city: string;
  state_province?: string;
  postal_code: string;
  country: string;
  latitude?: number;
  longitude?: number;
  type: string;
  status: 'pending' | 'active' | 'inactive';
  is_active: boolean;
  capacity?: number;
  rating?: number;
  total_reviews?: number;
  image_url?: string;
  phone?: string;
  email?: string;
  opening_hours?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Match {
  id: string;
  sport_id?: string;
  league_id?: string;
  home_team_id?: string;
  away_team_id?: string;
  home_team_name?: string;
  away_team_name?: string;
  match_date?: string;
  match_time?: string;
  scheduled_at?: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  sport_name?: string;
  sport_emoji?: string;
  league_name?: string;
  created_at?: string;
  // Nested relations from backend
  homeTeam?: {
    id: string;
    name: string;
    logo_url?: string;
  };
  awayTeam?: {
    id: string;
    name: string;
    logo_url?: string;
  };
  league?: {
    id: string;
    name: string;
    sport_id?: string;
  };
}

export interface VenueMatch {
  id: string;
  venue_id: string;
  match_id: string;
  total_seats?: number;
  available_seats?: number;
  total_capacity?: number;
  available_capacity?: number;
  is_active: boolean;
  is_featured?: boolean;
  allows_reservations?: boolean;
  venue?: Venue;
  match?: Match;
  created_at?: string;
}

export interface Reservation {
  id: string;
  venue_match_id: string;
  user_id: string;
  seats_reserved: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at?: string;
}

export interface AnalyticsOverview {
  totalReservations: number;
  totalGuests: number;
  uniqueUsers: number;
  upcomingMatches: number;
  completedMatches: number;
  averageOccupancy: number;
  totalCapacity: number;
}

// Partner-specific types
export interface PartnerVenueMatch {
  id: string;
  venue_id: string;
  match_id: string;
  total_capacity: number;
  available_capacity: number;
  is_active: boolean;
  venue: Venue;
  match: Match;
  reservations_count?: number;
}

export interface Review {
  id: string;
  venue_id: string;
  user_id: string;
  rating: number;
  comment?: string;
  user_name?: string;
  created_at?: string;
}

// Request Types
export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: 'venue_owner';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateVenueRequest {
  name: string;
  street_address: string;
  city: string;
  state_province?: string;
  postal_code: string;
  country: string;
  phone?: string;
  email?: string;
  capacity?: number;
  type?: string;
}

export interface ScheduleMatchRequest {
  match_id: string;
  total_seats: number;
}

// Response Types
export interface AuthResponse {
  user: ApiUser;
}

export interface VenuesResponse {
  venues: Venue[];
}

export interface MatchesResponse {
  matches: Match[];
}

export interface VenueMatchesResponse {
  venueMatches: VenueMatch[];
}
