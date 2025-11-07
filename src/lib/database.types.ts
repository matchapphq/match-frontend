export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      sports: {
        Row: {
          id: string
          api_id: string
          name: string
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          api_id: string
          name: string
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          api_id?: string
          name?: string
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
      leagues: {
        Row: {
          id: string
          api_id: string
          sport_id: string
          name: string
          country: string | null
          logo_url: string | null
          season: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          api_id: string
          sport_id: string
          name: string
          country?: string | null
          logo_url?: string | null
          season?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          api_id?: string
          sport_id?: string
          name?: string
          country?: string | null
          logo_url?: string | null
          season?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          api_id: string
          sport_id: string
          name: string
          logo_url: string | null
          country: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          api_id: string
          sport_id: string
          name: string
          logo_url?: string | null
          country?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          api_id?: string
          sport_id?: string
          name?: string
          logo_url?: string | null
          country?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          api_id: string
          sport_id: string
          league_id: string
          home_team_id: string
          away_team_id: string
          match_date: string
          status: string
          home_score: number
          away_score: number
          venue_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          api_id: string
          sport_id: string
          league_id: string
          home_team_id: string
          away_team_id: string
          match_date: string
          status?: string
          home_score?: number
          away_score?: number
          venue_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          api_id?: string
          sport_id?: string
          league_id?: string
          home_team_id?: string
          away_team_id?: string
          match_date?: string
          status?: string
          home_score?: number
          away_score?: number
          venue_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          role: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      venues: {
        Row: {
          id: string
          owner_id: string
          name: string
          description: string | null
          address: string | null
          city: string | null
          country: string | null
          phone: string | null
          email: string | null
          image_url: string | null
          capacity: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          description?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          phone?: string | null
          email?: string | null
          image_url?: string | null
          capacity?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          description?: string | null
          address?: string | null
          city?: string | null
          country?: string | null
          phone?: string | null
          email?: string | null
          image_url?: string | null
          capacity?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      venue_matches: {
        Row: {
          id: string
          venue_id: string
          match_id: string
          available_seats: number
          price_per_seat: number | null
          minimum_spend: number | null
          created_at: string
        }
        Insert: {
          id?: string
          venue_id: string
          match_id: string
          available_seats?: number
          price_per_seat?: number | null
          minimum_spend?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          venue_id?: string
          match_id?: string
          available_seats?: number
          price_per_seat?: number | null
          minimum_spend?: number | null
          created_at?: string
        }
      }
      reservations: {
        Row: {
          id: string
          venue_match_id: string
          customer_id: string | null
          customer_name: string
          customer_email: string
          customer_phone: string | null
          party_size: number
          status: string
          special_requests: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          venue_match_id: string
          customer_id?: string | null
          customer_name: string
          customer_email: string
          customer_phone?: string | null
          party_size?: number
          status?: string
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          venue_match_id?: string
          customer_id?: string | null
          customer_name?: string
          customer_email?: string
          customer_phone?: string | null
          party_size?: number
          status?: string
          special_requests?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          is_read: boolean
          related_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          is_read?: boolean
          related_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          is_read?: boolean
          related_id?: string | null
          created_at?: string
        }
      }
    }
  }
}
