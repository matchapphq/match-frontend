import { v4 as uuidv4 } from 'uuid';

// Types matching the original database schema
export interface Sport {
  id: string;
  api_id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface League {
  id: string;
  api_id: string;
  sport_id: string;
  name: string;
  country: string | null;
  logo_url: string | null;
  season: string | null;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  api_id: string;
  sport_id: string;
  name: string;
  logo_url: string | null;
  country: string | null;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  api_id: string;
  sport_id: string;
  league_id: string;
  home_team_id: string;
  away_team_id: string;
  match_date: string;
  status: string;
  home_score: number;
  away_score: number;
  venue_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  role: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Venue {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  image_url: string | null;
  capacity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VenueMatch {
  id: string;
  venue_id: string;
  match_id: string;
  available_seats: number;
  price_per_seat: number | null;
  minimum_spend: number | null;
  created_at: string;
}

export interface Reservation {
  id: string;
  venue_match_id: string;
  customer_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  party_size: number;
  status: string;
  special_requests: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  related_id: string | null;
  created_at: string;
}

// User for authentication
export interface User {
  id: string;
  email: string;
  password: string; // In a real app, this would be hashed
  created_at: string;
}

// In-memory database singleton
class InMemoryDatabase {
  private static instance: InMemoryDatabase;
  
  // Tables (public for seeding, but should be treated as read-only outside this class)
  public sports: Map<string, Sport> = new Map();
  public leagues: Map<string, League> = new Map();
  public teams: Map<string, Team> = new Map();
  public matches: Map<string, Match> = new Map();
  public userProfiles: Map<string, UserProfile> = new Map();
  public venues: Map<string, Venue> = new Map();
  public venueMatches: Map<string, VenueMatch> = new Map();
  public reservations: Map<string, Reservation> = new Map();
  public notifications: Map<string, Notification> = new Map();
  public users: Map<string, User> = new Map();
  
  // Current authenticated user
  private currentUser: User | null = null;
  private currentSession: any | null = null;

  private constructor() {
    this.initializeSeedData();
  }

  static getInstance(): InMemoryDatabase {
    if (!InMemoryDatabase.instance) {
      InMemoryDatabase.instance = new InMemoryDatabase();
    }
    return InMemoryDatabase.instance;
  }

  // Helper methods for generating IDs and timestamps
  private generateId(): string {
    return uuidv4();
  }

  private getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  // Authentication methods
  async signUp(email: string, password: string): Promise<{ user: User; session: any }> {
    if (this.getUserByEmail(email)) {
      throw new Error('User already exists');
    }

    const user: User = {
      id: this.generateId(),
      email,
      password, // In production, this should be hashed
      created_at: this.getCurrentTimestamp(),
    };

    this.users.set(user.id, user);
    this.currentUser = user;
    this.currentSession = { user, access_token: 'mock-token' };

    return { user, session: this.currentSession };
  }

  async signIn(email: string, password: string): Promise<{ user: User; session: any }> {
    const user = this.getUserByEmail(email);
    
    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }

    this.currentUser = user;
    this.currentSession = { user, access_token: 'mock-token' };

    return { user, session: this.currentSession };
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
    this.currentSession = null;
  }

  getSession(): { data: { session: any } } {
    return { data: { session: this.currentSession } };
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  private getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.email === email);
  }

  // CRUD operations for Sports
  async getSports(): Promise<Sport[]> {
    return Array.from(this.sports.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  async createSport(data: Partial<Sport>): Promise<Sport> {
    const sport: Sport = {
      id: this.generateId(),
      api_id: data.api_id || '',
      name: data.name || '',
      slug: data.slug || '',
      created_at: this.getCurrentTimestamp(),
      updated_at: this.getCurrentTimestamp(),
      ...data,
    };
    this.sports.set(sport.id, sport);
    return sport;
  }

  // CRUD operations for Leagues
  async getLeagues(sportId?: string): Promise<League[]> {
    let leagues = Array.from(this.leagues.values());
    if (sportId) {
      leagues = leagues.filter(l => l.sport_id === sportId);
    }
    return leagues.sort((a, b) => a.name.localeCompare(b.name));
  }

  async createLeague(data: Partial<League>): Promise<League> {
    const league: League = {
      id: this.generateId(),
      api_id: data.api_id || '',
      sport_id: data.sport_id || '',
      name: data.name || '',
      country: data.country || null,
      logo_url: data.logo_url || null,
      season: data.season || null,
      created_at: this.getCurrentTimestamp(),
      updated_at: this.getCurrentTimestamp(),
      ...data,
    };
    this.leagues.set(league.id, league);
    return league;
  }

  // CRUD operations for Teams
  async getTeams(sportId?: string): Promise<Team[]> {
    let teams = Array.from(this.teams.values());
    if (sportId) {
      teams = teams.filter(t => t.sport_id === sportId);
    }
    return teams.sort((a, b) => a.name.localeCompare(b.name));
  }

  async createTeam(data: Partial<Team>): Promise<Team> {
    const team: Team = {
      id: this.generateId(),
      api_id: data.api_id || '',
      sport_id: data.sport_id || '',
      name: data.name || '',
      logo_url: data.logo_url || null,
      country: data.country || null,
      created_at: this.getCurrentTimestamp(),
      updated_at: this.getCurrentTimestamp(),
      ...data,
    };
    this.teams.set(team.id, team);
    return team;
  }

  // CRUD operations for Matches
  async getMatches(filters?: {
    sportId?: string;
    leagueId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<(Match & { home_team?: Team; away_team?: Team; league?: League; sport?: Sport })[]> {
    let matches = Array.from(this.matches.values());
    
    if (filters?.sportId) {
      matches = matches.filter(m => m.sport_id === filters.sportId);
    }
    if (filters?.leagueId) {
      matches = matches.filter(m => m.league_id === filters.leagueId);
    }
    if (filters?.status) {
      matches = matches.filter(m => m.status === filters.status);
    }
    if (filters?.startDate) {
      matches = matches.filter(m => m.match_date >= filters.startDate!);
    }
    if (filters?.endDate) {
      matches = matches.filter(m => m.match_date <= filters.endDate!);
    }

    // Add related data
    return matches.map(match => ({
      ...match,
      home_team: this.teams.get(match.home_team_id),
      away_team: this.teams.get(match.away_team_id),
      league: this.leagues.get(match.league_id),
      sport: this.sports.get(match.sport_id),
    })).sort((a, b) => a.match_date.localeCompare(b.match_date));
  }

  async getUpcomingMatches(limit: number = 50): Promise<(Match & { home_team?: Team; away_team?: Team; league?: League; sport?: Sport })[]> {
    const now = new Date().toISOString();
    const matches = Array.from(this.matches.values())
      .filter(m => m.match_date >= now && m.status === 'scheduled')
      .sort((a, b) => a.match_date.localeCompare(b.match_date))
      .slice(0, limit);

    return matches.map(match => ({
      ...match,
      home_team: this.teams.get(match.home_team_id),
      away_team: this.teams.get(match.away_team_id),
      league: this.leagues.get(match.league_id),
      sport: this.sports.get(match.sport_id),
    }));
  }

  async createMatch(data: Partial<Match>): Promise<Match> {
    const match: Match = {
      id: this.generateId(),
      api_id: data.api_id || '',
      sport_id: data.sport_id || '',
      league_id: data.league_id || '',
      home_team_id: data.home_team_id || '',
      away_team_id: data.away_team_id || '',
      match_date: data.match_date || this.getCurrentTimestamp(),
      status: data.status || 'scheduled',
      home_score: data.home_score || 0,
      away_score: data.away_score || 0,
      venue_name: data.venue_name || null,
      created_at: this.getCurrentTimestamp(),
      updated_at: this.getCurrentTimestamp(),
      ...data,
    };
    this.matches.set(match.id, match);
    return match;
  }

  // CRUD operations for UserProfiles
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    return this.userProfiles.get(userId) || null;
  }

  async createUserProfile(data: Partial<UserProfile>): Promise<UserProfile> {
    const profile: UserProfile = {
      id: data.id || this.generateId(),
      role: data.role || 'customer',
      full_name: data.full_name || null,
      phone: data.phone || null,
      avatar_url: data.avatar_url || null,
      created_at: this.getCurrentTimestamp(),
      updated_at: this.getCurrentTimestamp(),
      ...data,
    };
    this.userProfiles.set(profile.id, profile);
    return profile;
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const profile = this.userProfiles.get(userId);
    if (!profile) {
      throw new Error('Profile not found');
    }
    
    const updatedProfile = {
      ...profile,
      ...updates,
      updated_at: this.getCurrentTimestamp(),
    };
    
    this.userProfiles.set(userId, updatedProfile);
    return updatedProfile;
  }

  // CRUD operations for Venues
  async getVenues(ownerId?: string): Promise<Venue[]> {
    let venues = Array.from(this.venues.values());
    if (ownerId) {
      venues = venues.filter(v => v.owner_id === ownerId);
    }
    return venues.sort((a, b) => b.created_at.localeCompare(a.created_at));
  }

  async getAllActiveVenues(): Promise<Venue[]> {
    return Array.from(this.venues.values())
      .filter(v => v.is_active)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getVenueById(id: string): Promise<Venue | null> {
    return this.venues.get(id) || null;
  }

  async getVenueWithMatches(id: string): Promise<any> {
    const venue = this.venues.get(id);
    if (!venue) return null;

    const venueMatches = Array.from(this.venueMatches.values())
      .filter(vm => vm.venue_id === id)
      .map(vm => {
        const match = this.matches.get(vm.match_id);
        if (!match) return null;

        const homeTeam = this.teams.get(match.home_team_id);
        const awayTeam = this.teams.get(match.away_team_id);
        const league = this.leagues.get(match.league_id);
        const sport = this.sports.get(match.sport_id);

        return {
          id: vm.id,
          match_id: vm.match_id,
          available_seats: vm.available_seats,
          price_per_seat: vm.price_per_seat,
          minimum_spend: vm.minimum_spend,
          match: {
            id: match.id,
            match_date: match.match_date,
            status: match.status,
            home_score: match.home_score,
            away_score: match.away_score,
            home_team: homeTeam ? { name: homeTeam.name, logo_url: homeTeam.logo_url } : null,
            away_team: awayTeam ? { name: awayTeam.name, logo_url: awayTeam.logo_url } : null,
            league: league ? { name: league.name, logo_url: league.logo_url } : null,
            sport: sport ? { name: sport.name } : null,
          },
        };
      })
      .filter(Boolean);

    return { ...venue, venue_matches: venueMatches };
  }

  async createVenue(data: Partial<Venue>): Promise<Venue> {
    const venue: Venue = {
      id: this.generateId(),
      owner_id: data.owner_id || '',
      name: data.name || '',
      description: data.description || null,
      address: data.address || null,
      city: data.city || null,
      country: data.country || null,
      phone: data.phone || null,
      email: data.email || null,
      image_url: data.image_url || null,
      capacity: data.capacity || 100,
      is_active: data.is_active !== undefined ? data.is_active : true,
      created_at: this.getCurrentTimestamp(),
      updated_at: this.getCurrentTimestamp(),
      ...data,
    };
    this.venues.set(venue.id, venue);
    return venue;
  }

  async updateVenue(id: string, updates: Partial<Venue>): Promise<Venue> {
    const venue = this.venues.get(id);
    if (!venue) {
      throw new Error('Venue not found');
    }
    
    const updatedVenue = {
      ...venue,
      ...updates,
      updated_at: this.getCurrentTimestamp(),
    };
    
    this.venues.set(id, updatedVenue);
    return updatedVenue;
  }

  async deleteVenue(id: string): Promise<void> {
    this.venues.delete(id);
  }

  // CRUD operations for VenueMatches
  async createVenueMatch(data: Partial<VenueMatch>): Promise<VenueMatch> {
    const venueMatch: VenueMatch = {
      id: this.generateId(),
      venue_id: data.venue_id || '',
      match_id: data.match_id || '',
      available_seats: data.available_seats || 0,
      price_per_seat: data.price_per_seat || null,
      minimum_spend: data.minimum_spend || null,
      created_at: this.getCurrentTimestamp(),
      ...data,
    };
    this.venueMatches.set(venueMatch.id, venueMatch);
    return venueMatch;
  }

  async deleteVenueMatch(id: string): Promise<void> {
    this.venueMatches.delete(id);
  }

  async getVenuesByMatch(matchId: string): Promise<Venue[]> {
    const venueMatchList = Array.from(this.venueMatches.values())
      .filter(vm => vm.match_id === matchId);
    
    return venueMatchList
      .map(vm => this.venues.get(vm.venue_id))
      .filter(Boolean) as Venue[];
  }

  // CRUD operations for Reservations
  async createReservation(data: Partial<Reservation>): Promise<Reservation> {
    const reservation: Reservation = {
      id: this.generateId(),
      venue_match_id: data.venue_match_id || '',
      customer_id: data.customer_id || null,
      customer_name: data.customer_name || '',
      customer_email: data.customer_email || '',
      customer_phone: data.customer_phone || null,
      party_size: data.party_size || 1,
      status: data.status || 'pending',
      special_requests: data.special_requests || null,
      created_at: this.getCurrentTimestamp(),
      updated_at: this.getCurrentTimestamp(),
      ...data,
    };
    this.reservations.set(reservation.id, reservation);
    return reservation;
  }

  async getMyReservations(userId: string): Promise<any[]> {
    const reservations = Array.from(this.reservations.values())
      .filter(r => r.customer_id === userId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));

    return this.enrichReservationsWithDetails(reservations);
  }

  async getVenueReservations(venueId: string): Promise<any[]> {
    const venueMatchIds = Array.from(this.venueMatches.values())
      .filter(vm => this.venues.get(vm.venue_id)?.id === venueId)
      .map(vm => vm.id);

    const reservations = Array.from(this.reservations.values())
      .filter(r => venueMatchIds.includes(r.venue_match_id))
      .sort((a, b) => b.created_at.localeCompare(a.created_at));

    return this.enrichReservationsWithDetails(reservations);
  }

  async getUpcomingReservations(userId: string): Promise<any[]> {
    const reservations = Array.from(this.reservations.values())
      .filter(r => r.customer_id === userId && ['pending', 'confirmed'].includes(r.status));

    const enriched = this.enrichReservationsWithDetails(reservations);
    
    // Filter for upcoming matches
    const now = new Date();
    return enriched.filter(r => {
      const matchDate = new Date(r.venue_match?.match?.match_date || '');
      return matchDate > now;
    });
  }

  private enrichReservationsWithDetails(reservations: Reservation[]): any[] {
    return reservations.map(reservation => {
      const venueMatch = this.venueMatches.get(reservation.venue_match_id);
      if (!venueMatch) return { ...reservation, venue_match: null };

      const venue = this.venues.get(venueMatch.venue_id);
      const match = this.matches.get(venueMatch.match_id);
      if (!match) return { ...reservation, venue_match: null };

      const homeTeam = this.teams.get(match.home_team_id);
      const awayTeam = this.teams.get(match.away_team_id);
      const league = this.leagues.get(match.league_id);
      const sport = this.sports.get(match.sport_id);

      return {
        ...reservation,
        venue_match: {
          id: venueMatch.id,
          venue: venue ? {
            id: venue.id,
            name: venue.name,
            address: venue.address,
            city: venue.city,
          } : null,
          match: {
            id: match.id,
            match_date: match.match_date,
            status: match.status,
            home_team: homeTeam ? { name: homeTeam.name, logo_url: homeTeam.logo_url } : null,
            away_team: awayTeam ? { name: awayTeam.name, logo_url: awayTeam.logo_url } : null,
            league: league ? { name: league.name } : null,
            sport: sport ? { name: sport.name } : null,
          },
        },
      };
    });
  }

  async updateReservationStatus(id: string, status: string): Promise<Reservation> {
    const reservation = this.reservations.get(id);
    if (!reservation) {
      throw new Error('Reservation not found');
    }
    
    const updatedReservation = {
      ...reservation,
      status,
      updated_at: this.getCurrentTimestamp(),
    };
    
    this.reservations.set(id, updatedReservation);
    return updatedReservation;
  }

  // Initialize with seed data
  private initializeSeedData() {
    import('./seedData').then(({ initializeSeedData }) => {
      initializeSeedData(this);
    });
  }

  // Export the instance getter
  static get db() {
    return this.getInstance();
  }
}

export default InMemoryDatabase;
