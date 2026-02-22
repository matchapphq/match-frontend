/**
 * Centralized Mock Data for Match Platform
 * 
 * This file contains all mock data used throughout the application.
 * When implementing real APIs, replace imports from this file with actual API calls.
 * 
 * Structure:
 * - User Data (mockUser)
 * - Restaurant Data (mockRestaurants)
 * - Match Data (mockMatchs, mockMatchInfo, mockAvailableMatches)
 * - Reservation Data (mockReservations, mockReservationsByMatch)
 * - Client Data (mockClients)
 * - Review Data (mockAvis)
 * - Notification Data (mockNotifications)
 * - Sports Data (mockSports)
 * - Statistics (mockStats)
 * - Boost Data (mockBoosts)
 * - Referral Data (mockVenueOwnerReferralCode, mockUserReferralCode, mockVenueOwnerReferralStats, mockUserReferralStats, mockReferredUsers, mockReferralHistory)
 * - Reminder Templates & History (mockReminderTemplates, mockReminderHistory)
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  onboardingCompleted: boolean;
  restaurants: number[];
}

export interface Restaurant {
  id: number;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  capaciteMax: number;
  note: number;
  totalAvis: number;
  image: string;
  horaires: string;
  tarif: string;
  userId: string;
  matchsOrganises?: number;
  booking_mode?: 'instant' | 'request';  // ⭐ NEW: Booking mode setting
}

export interface Match {
  id: number;
  equipe1: string;
  equipe2: string;
  date: string;
  heure: string;
  reservees: number;
  total: number;
  sport: string;
  sportNom: string;
  restaurant: string;
  statut: 'à venir' | 'terminé';
  restaurantId: number;
  userId: string;
  competition?: string;
}

export interface AvailableMatch {
  id: string;
  sport: string;
  team1: string;
  team2: string;
  league: string;
  date: string;
  time: string;
  venue?: string;
}

export interface Reservation {
  id: number;
  matchId: number;
  matchNom: string;
  clientNom: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  nombrePlaces: number;
  places: number;
  dateReservation: string;
  statut: 'confirmée' | 'en attente' | 'annulée' | 'refusé' | 'confirmé';
  restaurant?: string;
}

export interface Client {
  id: number;
  nom: string;
  prenom: string;
  match: string;
  date: string;
  userId: string;
  statut?: 'confirmé' | 'en attente' | 'refusé';
  email?: string;
  telephone?: string;
  restaurant?: string;
  matchId?: number;
  personnes?: number;  // Number of people for the reservation
  createdAt?: string;  // When the reservation was created (DD/MM/YYYY HH:mm)
}

export interface Avis {
  id: number;
  client: string;
  note: number;
  commentaire: string;
  date: string;
}

export interface Notification {
  id: number;
  userId: string;
  type: 'reservation' | 'avis' | 'parrainage';
  title: string;
  message: string;
  date: string;
  read: boolean;
  reservationId?: number;
}

export interface Sport {
  id: string;
  name: string;
  emoji: string;
}

export interface Stats {
  clients30Jours: number;
  clientsTotal: number;
  ageMoyen: number;
  sportFavori: string;
  moyenneClientsParMatch: number;
  matchsDiffuses30Jours: number;
  matchsAVenir: number;
  matchsTotal: number;
  vuesMois: number;
  impressions: number;
  boostsDisponibles: number;
  matchsBoosted: number;
  tauxRemplissageMoyen: number;
}

// ============================================================================
// BOOST (Mock Data)
// ============================================================================

export interface Boost {
  id: number;
  nom: string;
  description: string;
  prix: number;
  duree: string;
  avantages: string[];
  popularite?: number;
}

export const mockBoosts: Boost[] = [
  {
    id: 1,
    nom: 'Boost Visibilité',
    description: 'Apparaissez en premier dans les résultats de recherche',
    prix: 49,
    duree: '7 jours',
    avantages: ['Top des résultats', '+300% de vues', 'Badge "Recommandé"'],
    popularite: 85,
  },
  {
    id: 2,
    nom: 'Boost Premium',
    description: 'Visibilité maximale + mise en avant sur la page d\'accueil',
    prix: 99,
    duree: '7 jours',
    avantages: [
      'Top des résultats',
      '+500% de vues',
      'Page d\'accueil',
      'Réseaux sociaux',
    ],
    popularite: 95,
  },
  {
    id: 3,
    nom: 'Boost Événement',
    description: 'Mise en avant pour un match spécifique',
    prix: 29,
    duree: '1 match',
    avantages: ['Badge "Match à venir"', 'Notification push'],
    popularite: 70,
  },
];

// ============================================================================
// REFERRALS (PARRAINAGE) - Mock Data
// ============================================================================

export interface ReferralCode {
  referral_code: string;
  referral_link: string;
  created_at: string;
}

export interface ReferralStats {
  total_invited: number;
  total_signed_up: number;
  total_converted: number;
  total_rewards_earned: number;
  rewards_value?: number;
  conversion_rate: number;
}

export interface ReferredUser {
  id: string;
  name: string; // Anonymized (e.g., "Marc D.")
  status: 'invited' | 'signed_up' | 'converted';
  reward_earned?: string;
  created_at: string;
  converted_at?: string;
}

export interface ReferralHistory {
  referred_users: ReferredUser[];
  total: number;
}

// Mock referral code for venue owner
export const mockVenueOwnerReferralCode: ReferralCode = {
  referral_code: 'MATCH-RESTO-A7B9C2',
  referral_link: 'https://match.app/signup?ref=MATCH-RESTO-A7B9C2',
  created_at: '2026-01-01T10:00:00Z',
};

// Mock referral code for regular user
export const mockUserReferralCode: ReferralCode = {
  referral_code: 'MATCH-USER-X9K2M5',
  referral_link: 'https://match.app/signup?ref=MATCH-USER-X9K2M5',
  created_at: '2026-01-10T10:00:00Z',
};

// Mock referral stats for venue owner
export const mockVenueOwnerReferralStats: ReferralStats = {
  total_invited: 12,
  total_signed_up: 8,
  total_converted: 5,
  total_rewards_earned: 5,
  rewards_value: 1500,
  conversion_rate: 62,
};

// Mock referral stats for regular user
export const mockUserReferralStats: ReferralStats = {
  total_invited: 15,
  total_signed_up: 10,
  total_converted: 8,
  total_rewards_earned: 8,
  conversion_rate: 80,
};

// Mock referred users (anonymized names)
export const mockReferredUsers: ReferredUser[] = [
  {
    id: '1',
    name: 'Marc D.',
    status: 'converted',
    reward_earned: '1 boost',
    created_at: '2026-01-20T10:00:00Z',
    converted_at: '2026-01-22T15:30:00Z',
  },
  {
    id: '2',
    name: 'Sophie M.',
    status: 'converted',
    reward_earned: '1 boost',
    created_at: '2026-01-27T14:00:00Z',
    converted_at: '2026-01-29T09:15:00Z',
  },
  {
    id: '3',
    name: 'Thomas L.',
    status: 'signed_up',
    created_at: '2026-02-01T16:30:00Z',
  },
  {
    id: '4',
    name: 'Julie P.',
    status: 'converted',
    reward_earned: '1 boost',
    created_at: '2026-02-03T11:00:00Z',
    converted_at: '2026-02-05T18:45:00Z',
  },
  {
    id: '5',
    name: 'Alexandre B.',
    status: 'signed_up',
    created_at: '2026-01-11T09:00:00Z',
  },
];

export const mockReferralHistory: ReferralHistory = {
  referred_users: mockReferredUsers,
  total: mockReferredUsers.length,
};

// ============================================================================
// USER DATA
// ============================================================================

export const mockUser: User = {
  id: 'user-demo',
  email: 'demo@match.com',
  nom: 'Démo',
  prenom: 'Utilisateur',
  telephone: '06 12 34 56 78',
  onboardingCompleted: true,
  restaurants: [1, 2, 3],
};

// ============================================================================
// RESTAURANT DATA
// ============================================================================

export const mockRestaurants: Restaurant[] = [
  {
    id: 1,
    nom: 'Le Sport Bar',
    adresse: '12 Rue de la République, 75001 Paris',
    telephone: '01 23 45 67 89',
    email: 'contact@lesportbar.fr',
    capaciteMax: 50,
    note: 4.5,
    totalAvis: 127,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop',
    horaires: 'Lun-Dim: 11h00 - 02h00',
    tarif: '30€/mois',
    userId: 'user-demo',
    matchsOrganises: 12,
    booking_mode: 'instant',  // ⭐ NEW: Booking mode setting
  },
  {
    id: 2,
    nom: 'Chez Michel',
    adresse: '45 Avenue des Champs, 69001 Lyon',
    telephone: '04 12 34 56 78',
    email: 'contact@chezmichel.fr',
    capaciteMax: 35,
    note: 4.8,
    totalAvis: 89,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop',
    horaires: 'Mar-Dim: 10h00 - 01h00',
    tarif: '30€/mois',
    userId: 'user-demo',
    matchsOrganises: 8,
    booking_mode: 'request',  // ⭐ NEW: Booking mode setting
  },
  {
    id: 3,
    nom: 'La Brasserie du Stade',
    adresse: '78 Boulevard Sport, 13001 Marseille',
    telephone: '04 91 23 45 67',
    email: 'contact@brasseriestade.fr',
    capaciteMax: 60,
    note: 4.3,
    totalAvis: 156,
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=400&fit=crop',
    horaires: 'Lun-Dim: 09h00 - 02h00',
    tarif: '30€/mois',
    userId: 'user-demo',
    matchsOrganises: 10,
    booking_mode: 'instant',  // ⭐ NEW: Booking mode setting
  },
];

// ============================================================================
// MATCH DATA
// ============================================================================

export const mockMatchs: Match[] = [
  // À venir
  { id: 1, equipe1: 'Monaco', equipe2: 'Nice', date: '10/02/2026', heure: '20:00', reservees: 22, total: 30, sport: '⚽', sportNom: 'Football', restaurant: 'Le Sport Bar', statut: 'à venir', restaurantId: 1, userId: 'user-demo' },
  { id: 2, equipe1: 'Lakers', equipe2: 'Warriors', date: '12/02/2026', heure: '02:00', reservees: 18, total: 25, sport: '🏀', sportNom: 'Basketball', restaurant: 'Chez Michel', statut: 'à venir', restaurantId: 2, userId: 'user-demo' },
  { id: 3, equipe1: 'PSG', equipe2: 'OM', date: '15/02/2026', heure: '21:00', reservees: 35, total: 40, sport: '⚽', sportNom: 'Football', restaurant: 'Le Sport Bar', statut: 'à venir', restaurantId: 1, userId: 'user-demo', competition: 'Ligue 1' },
  { id: 4, equipe1: 'Real Madrid', equipe2: 'Atletico', date: '18/02/2026', heure: '19:30', reservees: 28, total: 35, sport: '⚽', sportNom: 'Football', restaurant: 'La Brasserie du Stade', statut: 'à venir', restaurantId: 3, userId: 'user-demo' },
  { id: 5, equipe1: 'Stade Français', equipe2: 'Toulouse', date: '20/02/2026', heure: '15:00', reservees: 15, total: 28, sport: '🏉', sportNom: 'Rugby', restaurant: 'Chez Michel', statut: 'à venir', restaurantId: 2, userId: 'user-demo' },
  
  // Terminés
  { id: 6, equipe1: 'PSG', equipe2: 'Lyon', date: '28/01/2026', heure: '21:00', reservees: 44, total: 50, sport: '⚽', sportNom: 'Football', restaurant: 'Le Sport Bar', statut: 'terminé', restaurantId: 1, userId: 'user-demo' },
  { id: 7, equipe1: 'Stade Français', equipe2: 'Toulouse', date: '27/01/2026', heure: '15:00', reservees: 38, total: 40, sport: '🏉', sportNom: 'Rugby', restaurant: 'Chez Michel', statut: 'terminé', restaurantId: 2, userId: 'user-demo' },
  { id: 8, equipe1: 'Federer', equipe2: 'Nadal', date: '26/01/2026', heure: '14:00', reservees: 28, total: 30, sport: '🎾', sportNom: 'Tennis', restaurant: 'Le Sport Bar', statut: 'terminé', restaurantId: 1, userId: 'user-demo' },
  { id: 9, equipe1: 'Liverpool', equipe2: 'Manchester', date: '05/02/2026', heure: '20:00', reservees: 42, total: 45, sport: '⚽', sportNom: 'Football', restaurant: 'La Brasserie du Stade', statut: 'terminé', restaurantId: 3, userId: 'user-demo' },
  { id: 10, equipe1: 'France', equipe2: 'Espagne', date: '04/02/2026', heure: '20:30', reservees: 48, total: 50, sport: '🤾', sportNom: 'Handball', restaurant: 'Le Sport Bar', statut: 'terminé', restaurantId: 1, userId: 'user-demo' },
  { id: 11, equipe1: 'Bayern', equipe2: 'Dortmund', date: '03/02/2026', heure: '18:45', reservees: 32, total: 35, sport: '⚽', sportNom: 'Football', restaurant: 'Chez Michel', statut: 'terminé', restaurantId: 2, userId: 'user-demo' },
  { id: 12, equipe1: 'Barcelone', equipe2: 'Real Madrid', date: '02/02/2026', heure: '21:00', reservees: 56, total: 60, sport: '⚽', sportNom: 'Football', restaurant: 'La Brasserie du Stade', statut: 'terminé', restaurantId: 3, userId: 'user-demo' },
  { id: 13, equipe1: 'Arsenal', equipe2: 'Chelsea', date: '01/02/2026', heure: '17:30', reservees: 29, total: 30, sport: '⚽', sportNom: 'Football', restaurant: 'Le Sport Bar', statut: 'terminé', restaurantId: 1, userId: 'user-demo' },
  { id: 14, equipe1: 'Milan AC', equipe2: 'Inter', date: '31/01/2026', heure: '20:45', reservees: 38, total: 40, sport: '⚽', sportNom: 'Football', restaurant: 'Chez Michel', statut: 'terminé', restaurantId: 2, userId: 'user-demo' },
  { id: 15, equipe1: 'Juventus', equipe2: 'Napoli', date: '30/01/2026', heure: '19:00', reservees: 52, total: 60, sport: '⚽', sportNom: 'Football', restaurant: 'La Brasserie du Stade', statut: 'terminé', restaurantId: 3, userId: 'user-demo' },
  { id: 16, equipe1: 'Monaco', equipe2: 'Marseille', date: '29/01/2026', heure: '21:00', reservees: 41, total: 50, sport: '⚽', sportNom: 'Football', restaurant: 'Le Sport Bar', statut: 'terminé', restaurantId: 1, userId: 'user-demo' },
  { id: 17, equipe1: 'Lens', equipe2: 'Lille', date: '28/01/2026', heure: '15:00', reservees: 26, total: 35, sport: '⚽', sportNom: 'Football', restaurant: 'Chez Michel', statut: 'terminé', restaurantId: 2, userId: 'user-demo' },
  { id: 18, equipe1: 'Nice', equipe2: 'Lyon', date: '27/01/2026', heure: '20:00', reservees: 55, total: 60, sport: '⚽', sportNom: 'Football', restaurant: 'La Brasserie du Stade', statut: 'terminé', restaurantId: 3, userId: 'user-demo' },
];

// Match detail info (for MatchDetail page)
export const mockMatchInfo = {
  equipe1: 'PSG',
  equipe2: 'OM',
  sport: '⚽',
  sportNom: 'Football',
  date: '15/02/2026',
  heure: '21:00',
  competition: 'Ligue 1',
  restaurant: 'Le Sport Bar',
  places: 40,
  reservees: 35,
};

// Available matches for programming (ProgrammerMatch page)
export const mockAvailableMatches: AvailableMatch[] = [
  // Football
  { id: '1', sport: 'football', team1: 'PSG', team2: 'OM', league: 'Ligue 1', date: '2026-01-15', time: '21:00', venue: 'Parc des Princes' },
  { id: '2', sport: 'football', team1: 'Lyon', team2: 'Monaco', league: 'Ligue 1', date: '2026-01-16', time: '20:45' },
  { id: '3', sport: 'football', team1: 'Real Madrid', team2: 'Barcelona', league: 'La Liga', date: '2026-01-17', time: '21:00' },
  { id: '4', sport: 'football', team1: 'Manchester City', team2: 'Liverpool', league: 'Premier League', date: '2026-01-18', time: '17:30' },
  { id: '5', sport: 'football', team1: 'Bayern Munich', team2: 'Dortmund', league: 'Bundesliga', date: '2026-01-19', time: '18:30' },
  { id: '6', sport: 'football', team1: 'Nice', team2: 'Lens', league: 'Ligue 1', date: '2026-01-20', time: '19:00' },
  
  // Basketball
  { id: '7', sport: 'basketball', team1: 'Lakers', team2: 'Warriors', league: 'NBA', date: '2026-01-15', time: '02:00' },
  { id: '8', sport: 'basketball', team1: 'Celtics', team2: 'Heat', league: 'NBA', date: '2026-01-16', time: '01:30' },
  { id: '9', sport: 'basketball', team1: 'ASVEL', team2: 'Monaco', league: 'Betclic Elite', date: '2026-01-17', time: '20:30' },
  
  // Rugby
  { id: '10', sport: 'rugby', team1: 'Toulouse', team2: 'La Rochelle', league: 'Top 14', date: '2026-01-18', time: '21:05' },
  { id: '11', sport: 'rugby', team1: 'Racing 92', team2: 'Stade Français', league: 'Top 14', date: '2026-01-19', time: '16:00' },
  
  // Tennis
  { id: '12', sport: 'tennis', team1: 'Djokovic', team2: 'Nadal', league: 'Australian Open', date: '2026-01-20', time: '09:00' },
  { id: '13', sport: 'tennis', team1: 'Alcaraz', team2: 'Sinner', league: 'Australian Open', date: '2026-01-21', time: '08:30' },
  
  // Handball
  { id: '14', sport: 'handball', team1: 'PSG Handball', team2: 'Montpellier', league: 'Liqui Moly StarLigue', date: '2026-01-22', time: '20:45' },
  
  // Volleyball
  { id: '15', sport: 'volleyball', team1: 'Tours', team2: 'Chaumont', league: 'Ligue A', date: '2026-01-23', time: '20:00' },
];

// All matches list (ListeMatchs page)
export const mockAllMatches = [
  { id: 1, equipe1: 'Monaco', equipe2: 'Nice', date: '10/12/2024', heure: '20:00', statut: 'à venir', places: 30 },
  { id: 2, equipe1: 'Bayern', equipe2: 'Dortmund', date: '12/12/2024', heure: '18:45', statut: 'à venir', places: 25 },
  { id: 3, equipe1: 'PSG', equipe2: 'OM', date: '15/12/2024', heure: '21:00', statut: 'à venir', places: 40 },
  { id: 4, equipe1: 'Real Madrid', equipe2: 'Atletico', date: '18/12/2024', heure: '19:30', statut: 'à venir', places: 35 },
  { id: 5, equipe1: 'PSG', equipe2: 'Lyon', date: '28/11/2024', heure: '21:00', statut: 'terminé', places: 50 },
  { id: 6, equipe1: 'Stade Français', equipe2: 'Toulouse', date: '25/11/2024', heure: '15:00', statut: 'terminé', places: 40 },
  { id: 7, equipe1: 'Federer', equipe2: 'Nadal', date: '22/11/2024', heure: '14:00', statut: 'terminé', places: 30 },
];

// ============================================================================
// RESERVATION DATA
// ============================================================================

// Match detail reservations (MatchDetail page)
export const mockMatchDetailReservations: Reservation[] = [
  { id: 1, matchId: 3, matchNom: 'PSG vs OM', clientNom: 'Jean Dupont', nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@email.fr', telephone: '06 12 34 56 78', places: 2, nombrePlaces: 2, dateReservation: '10/12/2024', statut: 'confirmé' },
  { id: 2, matchId: 3, matchNom: 'PSG vs OM', clientNom: 'Sophie Martin', nom: 'Martin', prenom: 'Sophie', email: 'sophie.martin@email.fr', telephone: '06 23 45 67 89', places: 1, nombrePlaces: 1, dateReservation: '11/12/2024', statut: 'confirmé' },
  { id: 3, matchId: 3, matchNom: 'PSG vs OM', clientNom: 'Luc Bernard', nom: 'Bernard', prenom: 'Luc', email: 'luc.bernard@email.fr', telephone: '06 34 56 78 90', places: 4, nombrePlaces: 4, dateReservation: '12/12/2024', statut: 'confirmé' },
  { id: 4, matchId: 3, matchNom: 'PSG vs OM', clientNom: 'Marie Petit', nom: 'Petit', prenom: 'Marie', email: 'marie.petit@email.fr', telephone: '06 45 67 89 01', places: 3, nombrePlaces: 3, dateReservation: '12/12/2024', statut: 'confirmé' },
  { id: 5, matchId: 3, matchNom: 'PSG vs OM', clientNom: 'Thomas Moreau', nom: 'Moreau', prenom: 'Thomas', email: 'thomas.moreau@email.fr', telephone: '06 56 78 90 12', places: 2, nombrePlaces: 2, dateReservation: '13/12/2024', statut: 'en attente' },
  { id: 6, matchId: 3, matchNom: 'PSG vs OM', clientNom: 'Julie Laurent', nom: 'Laurent', prenom: 'Julie', email: 'julie.laurent@email.fr', telephone: '06 67 89 01 23', places: 5, nombrePlaces: 5, dateReservation: '13/12/2024', statut: 'en attente' },
  { id: 7, matchId: 3, matchNom: 'PSG vs OM', clientNom: 'Pierre Simon', nom: 'Simon', prenom: 'Pierre', email: 'pierre.simon@email.fr', telephone: '06 78 90 12 34', places: 2, nombrePlaces: 2, dateReservation: '14/12/2024', statut: 'en attente' },
  { id: 8, matchId: 3, matchNom: 'PSG vs OM', clientNom: 'Claire Rousseau', nom: 'Rousseau', prenom: 'Claire', email: 'claire.rousseau@email.fr', telephone: '06 89 01 23 45', places: 1, nombrePlaces: 1, dateReservation: '09/12/2024', statut: 'refusé' },
];

// All reservations (Reservations page)
export const mockReservations: Reservation[] = [
  // Match 1: PSG vs OM
  { 
    id: 1, 
    matchId: 1, 
    matchNom: 'PSG vs OM',
    clientNom: 'Jean Dupont',
    prenom: 'Jean',
    nom: 'Dupont',
    email: 'jean.dupont@email.fr',
    telephone: '06 12 34 56 78',
    nombrePlaces: 2,
    places: 2,
    dateReservation: '10/12/2024',
    statut: 'confirmée',
    restaurant: 'Le Sport Bar'
  },
  { 
    id: 2, 
    matchId: 1, 
    matchNom: 'PSG vs OM',
    clientNom: 'Sophie Martin',
    prenom: 'Sophie',
    nom: 'Martin',
    email: 'sophie.martin@email.fr',
    telephone: '06 23 45 67 89',
    nombrePlaces: 4,
    places: 4,
    dateReservation: '11/12/2024',
    statut: 'confirmée',
    restaurant: 'Le Sport Bar'
  },
  { 
    id: 3, 
    matchId: 1, 
    matchNom: 'PSG vs OM',
    clientNom: 'Luc Bernard',
    prenom: 'Luc',
    nom: 'Bernard',
    email: 'luc.bernard@email.fr',
    telephone: '06 34 56 78 90',
    nombrePlaces: 1,
    places: 1,
    dateReservation: '12/12/2024',
    statut: 'en attente',
    restaurant: 'Le Sport Bar'
  },
  
  // Match 2: Real Madrid vs Barcelona
  { 
    id: 4, 
    matchId: 2, 
    matchNom: 'Real Madrid vs Barcelona',
    clientNom: 'Marie Petit',
    prenom: 'Marie',
    nom: 'Petit',
    email: 'marie.petit@email.fr',
    telephone: '06 45 67 89 01',
    nombrePlaces: 3,
    places: 3,
    dateReservation: '10/12/2024',
    statut: 'confirmée',
    restaurant: 'Chez Michel'
  },
  { 
    id: 5, 
    matchId: 2, 
    matchNom: 'Real Madrid vs Barcelona',
    clientNom: 'Pierre Dubois',
    prenom: 'Pierre',
    nom: 'Dubois',
    email: 'pierre.dubois@email.fr',
    telephone: '06 56 78 90 12',
    nombrePlaces: 2,
    places: 2,
    dateReservation: '11/12/2024',
    statut: 'en attente',
    restaurant: 'Chez Michel'
  },
  
  // Match 3: Liverpool vs Manchester
  { 
    id: 6, 
    matchId: 3, 
    matchNom: 'Liverpool vs Manchester',
    clientNom: 'Emma Thomas',
    prenom: 'Emma',
    nom: 'Thomas',
    email: 'emma.thomas@email.fr',
    telephone: '06 67 89 01 23',
    nombrePlaces: 5,
    places: 5,
    dateReservation: '09/12/2024',
    statut: 'confirmée',
    restaurant: 'La Brasserie du Stade'
  },
  { 
    id: 7, 
    matchId: 3, 
    matchNom: 'Liverpool vs Manchester',
    clientNom: 'Lucas Robert',
    prenom: 'Lucas',
    nom: 'Robert',
    email: 'lucas.robert@email.fr',
    telephone: '06 78 90 12 34',
    nombrePlaces: 2,
    places: 2,
    dateReservation: '10/12/2024',
    statut: 'confirmée',
    restaurant: 'La Brasserie du Stade'
  },
  { 
    id: 8, 
    matchId: 3, 
    matchNom: 'Liverpool vs Manchester',
    clientNom: 'Julie Richard',
    prenom: 'Julie',
    nom: 'Richard',
    email: 'julie.richard@email.fr',
    telephone: '06 89 01 23 45',
    nombrePlaces: 1,
    places: 1,
    dateReservation: '11/12/2024',
    statut: 'annulée',
    restaurant: 'La Brasserie du Stade'
  },
  
  // Match 4: Bayern vs Dortmund
  { 
    id: 9, 
    matchId: 4, 
    matchNom: 'Bayern vs Dortmund',
    clientNom: 'Antoine Moreau',
    prenom: 'Antoine',
    nom: 'Moreau',
    email: 'antoine.moreau@email.fr',
    telephone: '06 90 12 34 56',
    nombrePlaces: 4,
    places: 4,
    dateReservation: '08/12/2024',
    statut: 'confirmée',
    restaurant: 'Le Sport Bar'
  },
  { 
    id: 10, 
    matchId: 4, 
    matchNom: 'Bayern vs Dortmund',
    clientNom: 'Camille Laurent',
    prenom: 'Camille',
    nom: 'Laurent',
    email: 'camille.laurent@email.fr',
    telephone: '06 01 23 45 67',
    nombrePlaces: 2,
    places: 2,
    dateReservation: '09/12/2024',
    statut: 'en attente',
    restaurant: 'Le Sport Bar'
  },
];

// Matches with reservations (for Reservations page)
export const mockMatchesWithReservations = [
  {
    id: 1,
    equipe1: 'PSG',
    equipe2: 'OM',
    date: '15/12/2024',
    heure: '21:00',
    sport: '⚽',
    sportNom: 'Football',
    placesTotal: 40,
    placesReservees: 35,
    restaurant: 'Le Sport Bar'
  },
  {
    id: 2,
    equipe1: 'Real Madrid',
    equipe2: 'Barcelona',
    date: '17/12/2024',
    heure: '21:00',
    sport: '⚽',
    sportNom: 'Football',
    placesTotal: 35,
    placesReservees: 28,
    restaurant: 'Chez Michel'
  },
  {
    id: 3,
    equipe1: 'Liverpool',
    equipe2: 'Manchester',
    date: '18/12/2024',
    heure: '20:00',
    sport: '⚽',
    sportNom: 'Football',
    placesTotal: 45,
    placesReservees: 42,
    restaurant: 'La Brasserie du Stade'
  },
  {
    id: 4,
    equipe1: 'Bayern',
    equipe2: 'Dortmund',
    date: '20/12/2024',
    heure: '18:45',
    sport: '⚽',
    sportNom: 'Football',
    placesTotal: 35,
    placesReservees: 32,
    restaurant: 'Le Sport Bar'
  }
];

// ============================================================================
// CLIENT DATA
// ============================================================================

export const mockClients: Client[] = [
  // Match 1: Monaco vs Nice (id: 1) - Le Sport Bar
  { 
    id: 1, 
    nom: 'Dupont', 
    prenom: 'Jean', 
    match: 'Monaco vs Nice', 
    date: '10/02/2026', 
    userId: 'user-demo',
    statut: 'confirmé',
    email: 'jean.dupont@email.fr',
    telephone: '06 12 34 56 78',
    restaurant: 'Le Sport Bar',
    matchId: 1,
    personnes: 2,
    createdAt: '26/01/2026 09:15'
  },
  { 
    id: 2, 
    nom: 'Martin', 
    prenom: 'Sophie', 
    match: 'Monaco vs Nice', 
    date: '10/02/2026', 
    userId: 'user-demo',
    statut: 'en attente',
    email: 'sophie.martin@email.fr',
    telephone: '06 23 45 67 89',
    restaurant: 'Le Sport Bar',
    matchId: 1,
    personnes: 4,
    createdAt: '26/01/2026 14:30'
  },
  
  // Match 2: Lakers vs Warriors (id: 2) - Chez Michel
  { 
    id: 3, 
    nom: 'Bernard', 
    prenom: 'Luc', 
    match: 'Lakers vs Warriors', 
    date: '12/02/2026', 
    userId: 'user-demo',
    statut: 'confirmé',
    email: 'luc.bernard@email.fr',
    telephone: '06 34 56 78 90',
    restaurant: 'Chez Michel',
    matchId: 2,
    personnes: 3,
    createdAt: '27/01/2026 10:45'
  },
  { 
    id: 4, 
    nom: 'Petit', 
    prenom: 'Marie', 
    match: 'Lakers vs Warriors', 
    date: '12/02/2026', 
    userId: 'user-demo',
    statut: 'en attente',
    email: 'marie.petit@email.fr',
    telephone: '06 45 67 89 01',
    restaurant: 'Chez Michel',
    matchId: 2,
    personnes: 2,
    createdAt: '27/01/2026 16:20'
  },
  
  // Match 3: PSG vs OM (id: 3) - Le Sport Bar
  { 
    id: 5, 
    nom: 'Dubois', 
    prenom: 'Pierre', 
    match: 'PSG vs OM', 
    date: '15/02/2026', 
    userId: 'user-demo',
    statut: 'confirmé',
    email: 'pierre.dubois@email.fr',
    telephone: '06 56 78 90 12',
    restaurant: 'Le Sport Bar',
    matchId: 3,
    personnes: 5,
    createdAt: '28/01/2026 08:30'
  },
  { 
    id: 6, 
    nom: 'Thomas', 
    prenom: 'Emma', 
    match: 'PSG vs OM', 
    date: '15/02/2026', 
    userId: 'user-demo',
    statut: 'confirmé',
    email: 'emma.thomas@email.fr',
    telephone: '06 67 89 01 23',
    restaurant: 'Le Sport Bar',
    matchId: 3,
    personnes: 2,
    createdAt: '28/01/2026 11:15'
  },
  { 
    id: 7, 
    nom: 'Robert', 
    prenom: 'Lucas', 
    match: 'PSG vs OM', 
    date: '15/02/2026', 
    userId: 'user-demo',
    statut: 'en attente',
    email: 'lucas.robert@email.fr',
    telephone: '06 78 90 12 34',
    restaurant: 'Le Sport Bar',
    matchId: 3,
    personnes: 3,
    createdAt: '29/01/2026 13:45'
  },
  { 
    id: 8, 
    nom: 'Richard', 
    prenom: 'Julie', 
    match: 'PSG vs OM', 
    date: '15/02/2026', 
    userId: 'user-demo',
    statut: 'refusé',
    email: 'julie.richard@email.fr',
    telephone: '06 89 01 23 45',
    restaurant: 'Le Sport Bar',
    matchId: 3,
    personnes: 1,
    createdAt: '29/01/2026 17:00'
  },
  
  // Match 4: Real Madrid vs Atletico (id: 4) - La Brasserie du Stade
  { 
    id: 9, 
    nom: 'Moreau', 
    prenom: 'Antoine', 
    match: 'Real Madrid vs Atletico', 
    date: '18/02/2026', 
    userId: 'user-demo',
    statut: 'confirmé',
    email: 'antoine.moreau@email.fr',
    telephone: '06 90 12 34 56',
    restaurant: 'La Brasserie du Stade',
    matchId: 4,
    personnes: 4,
    createdAt: '30/01/2026 09:00'
  },
  { 
    id: 10, 
    nom: 'Laurent', 
    prenom: 'Camille', 
    match: 'Real Madrid vs Atletico', 
    date: '18/02/2026', 
    userId: 'user-demo',
    statut: 'en attente',
    email: 'camille.laurent@email.fr',
    telephone: '06 01 23 45 67',
    restaurant: 'La Brasserie du Stade',
    matchId: 4,
    personnes: 2,
    createdAt: '30/01/2026 15:30'
  },
  
  // Match 5: Stade Français vs Toulouse (id: 5) - Chez Michel
  { 
    id: 11, 
    nom: 'Simon', 
    prenom: 'Maxime', 
    match: 'Stade Français vs Toulouse', 
    date: '20/02/2026', 
    userId: 'user-demo',
    statut: 'confirmé',
    email: 'maxime.simon@email.fr',
    telephone: '06 11 22 33 44',
    restaurant: 'Chez Michel',
    matchId: 5,
    personnes: 3,
    createdAt: '31/01/2026 10:20'
  },
  { 
    id: 12, 
    nom: 'Rousseau', 
    prenom: 'Claire', 
    match: 'Stade Français vs Toulouse', 
    date: '20/02/2026', 
    userId: 'user-demo',
    statut: 'en attente',
    email: 'claire.rousseau@email.fr',
    telephone: '06 22 33 44 55',
    restaurant: 'Chez Michel',
    matchId: 5,
    personnes: 2,
    createdAt: '01/02/2026 08:45'
  },
  
  // Match 6: PSG vs Lyon (id: 6, terminé) - Le Sport Bar
  { 
    id: 13, 
    nom: 'Mercier', 
    prenom: 'Nicolas', 
    match: 'PSG vs Lyon', 
    date: '28/01/2026', 
    userId: 'user-demo',
    statut: 'confirmé',
    email: 'nicolas.mercier@email.fr',
    telephone: '06 33 44 55 66',
    restaurant: 'Le Sport Bar',
    matchId: 6,
    personnes: 6,
    createdAt: '01/02/2026 14:10'
  },
  { 
    id: 14, 
    nom: 'Blanc', 
    prenom: 'Isabelle', 
    match: 'PSG vs Lyon', 
    date: '28/01/2026', 
    userId: 'user-demo',
    statut: 'confirmé',
    email: 'isabelle.blanc@email.fr',
    telephone: '06 44 55 66 77',
    restaurant: 'Le Sport Bar',
    matchId: 6,
    personnes: 4,
    createdAt: '02/02/2026 11:30'
  },
  
  // Match 7: Stade Français vs Toulouse (id: 7, terminé) - Chez Michel
  { 
    id: 15, 
    nom: 'Garcia', 
    prenom: 'Vincent', 
    match: 'Stade Français vs Toulouse', 
    date: '27/01/2026', 
    userId: 'user-demo',
    statut: 'confirmé',
    email: 'vincent.garcia@email.fr',
    telephone: '06 55 66 77 88',
    restaurant: 'Chez Michel',
    matchId: 7,
    personnes: 5,
    createdAt: '03/02/2026 09:50'
  },
  
  // Match 8: Federer vs Nadal (id: 8, terminé) - Le Sport Bar
  { 
    id: 16, 
    nom: 'Lefebvre', 
    prenom: 'Mathieu', 
    match: 'Federer vs Nadal', 
    date: '26/01/2026', 
    userId: 'user-demo',
    statut: 'confirmé',
    email: 'mathieu.lefebvre@email.fr',
    telephone: '06 66 77 88 99',
    restaurant: 'Le Sport Bar',
    matchId: 8,
    personnes: 2,
    createdAt: '03/02/2026 16:25'
  },
  
  // Additional clients for upcoming matches
  { 
    id: 17, 
    nom: 'Fournier', 
    prenom: 'Amélie', 
    match: 'Real Madrid vs Atletico', 
    date: '18/02/2026', 
    userId: 'user-demo',
    statut: 'confirmé',
    email: 'amelie.fournier@email.fr',
    telephone: '06 77 88 99 00',
    restaurant: 'La Brasserie du Stade',
    matchId: 4,
    personnes: 3,
    createdAt: '04/02/2026 10:15'
  },
  { 
    id: 18, 
    nom: 'Girard', 
    prenom: 'Sébastien', 
    match: 'PSG vs OM', 
    date: '15/02/2026', 
    userId: 'user-demo',
    statut: 'en attente',
    email: 'sebastien.girard@email.fr',
    telephone: '06 88 99 00 11',
    restaurant: 'Le Sport Bar',
    matchId: 3,
    personnes: 4,
    createdAt: '05/02/2026 13:40'
  },
  { 
    id: 19, 
    nom: 'Bonnet', 
    prenom: 'Élodie', 
    match: 'Monaco vs Nice', 
    date: '10/02/2026', 
    userId: 'user-demo',
    statut: 'confirmé',
    email: 'elodie.bonnet@email.fr',
    telephone: '06 99 00 11 22',
    restaurant: 'Le Sport Bar',
    matchId: 1,
    personnes: 2,
    createdAt: '06/02/2026 08:20'
  },
  { 
    id: 20, 
    nom: 'Perrin', 
    prenom: 'Alexandre', 
    match: 'Lakers vs Warriors', 
    date: '12/02/2026', 
    userId: 'user-demo',
    statut: 'refusé',
    email: 'alexandre.perrin@email.fr',
    telephone: '06 10 20 30 40',
    restaurant: 'Chez Michel',
    matchId: 2,
    personnes: 1,
    createdAt: '07/02/2026 15:55'
  },
];

// ============================================================================
// REVIEW DATA
// ============================================================================

export const mockAvis: Avis[] = [
  { id: 1, client: 'Jean Dupont', note: 5, commentaire: 'Excellente ambiance pour regarder les matchs !', date: '05/02/2026' },
  { id: 2, client: 'Sophie Martin', note: 4, commentaire: 'Très bon service, écrans de qualité.', date: '03/02/2026' },
  { id: 3, client: 'Luc Bernard', note: 5, commentaire: 'Super expérience, je reviendrai !', date: '01/02/2026' },
  { id: 4, client: 'Marie Petit', note: 4, commentaire: 'Bon restaurant, parfait pour les matchs.', date: '28/01/2026' },
  { id: 5, client: 'Pierre Dubois', note: 5, commentaire: 'Ambiance de folie pendant le match !', date: '27/01/2026' },
];

// ============================================================================
// NOTIFICATION DATA
// ============================================================================

export const mockNotifications: Notification[] = [
  { id: 1, userId: 'user-demo', type: 'reservation', title: 'Nouvelle réservation', message: 'Une nouvelle réservation a été faite pour le match PSG vs OM.', date: '26/01/2026', read: false, reservationId: 1 },
  { id: 2, userId: 'user-demo', type: 'avis', title: 'Nouvel avis', message: 'Un nouvel avis a été laissé pour votre restaurant Le Sport Bar.', date: '28/01/2026', read: false },
  { id: 3, userId: 'user-demo', type: 'parrainage', title: 'Nouveau parrainage', message: 'Vous avez un nouveau parrainage pour votre restaurant Chez Michel.', date: '01/02/2026', read: false },
];

// ============================================================================
// SPORTS DATA
// ============================================================================

export const mockSports: Sport[] = [
  { id: 'football', name: 'Football', emoji: '⚽' },
  { id: 'basketball', name: 'Basketball', emoji: '🏀' },
  { id: 'rugby', name: 'Rugby', emoji: '🏉' },
  { id: 'tennis', name: 'Tennis', emoji: '🎾' },
  { id: 'handball', name: 'Handball', emoji: '🤾' },
  { id: 'volleyball', name: 'Volleyball', emoji: '🏐' },
];

// ============================================================================
// STATISTICS
// ============================================================================

export const mockStats: Stats = {
  clients30Jours: 0,
  clientsTotal: 0,
  ageMoyen: 0,
  sportFavori: '-',
  moyenneClientsParMatch: 0,
  matchsDiffuses30Jours: 18,
  matchsAVenir: 12,
  matchsTotal: 30,
  vuesMois: 1453,
  impressions: 12400,
  boostsDisponibles: 12,
  matchsBoosted: 3,
  tauxRemplissageMoyen: 73,
};

// ============================================================================
// HELPER FUNCTIONS (for pages that use specific filters)
// ============================================================================

export const getMatchById = (matchId: number): Match | undefined => {
  return mockMatchs.find(m => m.id === matchId);
};

export const getReservationsByMatchId = (matchId: number): Reservation[] => {
  return mockReservations.filter(r => r.matchId === matchId);
};

export const getMatchsByUserId = (userId: string): Match[] => {
  return mockMatchs.filter(m => m.userId === userId);
};

export const getRestaurantsByUserId = (userId: string): Restaurant[] => {
  return mockRestaurants.filter(r => r.userId === userId);
};

export const getClientsByUserId = (userId: string): Client[] => {
  return mockClients.filter(c => c.userId === userId);
};

// ============================================================================
// REMINDER TEMPLATES & HISTORY (Mock Data)
// ============================================================================

export interface ReminderTemplate {
  id: number;
  name: string;
  message: string;
  restaurantId: number | 'all';  // 'all' for global templates
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReminderHistoryEntry {
  id: number;
  matchId: number;
  matchName: string;
  recipientCount: number;
  method: 'email' | 'sms' | 'whatsapp';
  templateName: string;
  message: string;
  sentAt: string;
  sentBy: string;
  restaurantId: number;
  status: 'success' | 'partial' | 'failed';
}

// Default reminder templates
export const mockReminderTemplates: ReminderTemplate[] = [
  {
    id: 1,
    name: 'Rappel Standard',
    message: 'Bonjour {prenom}, rappel pour votre réservation de {personnes} place(s) pour le match {match} le {date} à {heure}. À bientôt !',
    restaurantId: 'all',
    isDefault: true,
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z'
  },
  {
    id: 2,
    name: 'Match Demain',
    message: 'Bonjour {prenom}, votre match {match} a lieu demain à {heure}. Votre réservation de {personnes} place(s) est confirmée. À demain !',
    restaurantId: 'all',
    isDefault: true,
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z'
  },
  {
    id: 3,
    name: 'Remerciement',
    message: 'Bonjour {prenom}, merci pour votre réservation pour le match {match}. Nous vous attendons le {date} à {heure} !',
    restaurantId: 'all',
    isDefault: true,
    createdAt: '2025-12-01T10:00:00Z',
    updatedAt: '2025-12-01T10:00:00Z'
  },
  {
    id: 4,
    name: 'Le Sport Bar - Match Important',
    message: 'Bonjour {prenom}, grand match au Sport Bar ! {match} le {date} à {heure}. Votre table de {personnes} place(s) vous attend. Ambiance garantie ! 🍺⚽',
    restaurantId: 1,
    isDefault: false,
    createdAt: '2026-01-10T14:30:00Z',
    updatedAt: '2026-01-10T14:30:00Z'
  },
  {
    id: 5,
    name: 'Chez Michel - Bienvenue',
    message: 'Salut {prenom} ! Chez Michel, on vous attend pour le match {match} ({date}, {heure}). {personnes} place(s) réservées. Menu spécial match disponible ! 🍕',
    restaurantId: 2,
    isDefault: false,
    createdAt: '2026-01-12T09:15:00Z',
    updatedAt: '2026-01-12T09:15:00Z'
  }
];

// Reminder history
export const mockReminderHistory: ReminderHistoryEntry[] = [
  {
    id: 1,
    matchId: 3,
    matchName: 'PSG vs OM',
    recipientCount: 5,
    method: 'whatsapp',
    templateName: 'Le Sport Bar - Match Important',
    message: 'Bonjour, grand match au Sport Bar ! PSG vs OM le 15/12/2024 à 21:00...',
    sentAt: '2026-01-20T18:30:00Z',
    sentBy: 'demo@match.com',
    restaurantId: 1,
    status: 'success'
  },
  {
    id: 2,
    matchId: 1,
    matchName: 'Monaco vs Nice',
    recipientCount: 3,
    method: 'email',
    templateName: 'Rappel Standard',
    message: 'Bonjour, rappel pour votre réservation pour le match Monaco vs Nice...',
    sentAt: '2026-01-19T10:15:00Z',
    sentBy: 'demo@match.com',
    restaurantId: 1,
    status: 'success'
  },
  {
    id: 3,
    matchId: 2,
    matchName: 'Lakers vs Warriors',
    recipientCount: 2,
    method: 'sms',
    templateName: 'Chez Michel - Bienvenue',
    message: 'Salut ! Chez Michel, on vous attend pour le match Lakers vs Warriors...',
    sentAt: '2026-01-18T16:45:00Z',
    sentBy: 'demo@match.com',
    restaurantId: 2,
    status: 'success'
  },
  {
    id: 4,
    matchId: 4,
    matchName: 'Real Madrid vs Atletico',
    recipientCount: 4,
    method: 'email',
    templateName: 'Match Demain',
    message: 'Bonjour, votre match Real Madrid vs Atletico a lieu demain à 19:30...',
    sentAt: '2026-01-17T20:00:00Z',
    sentBy: 'demo@match.com',
    restaurantId: 3,
    status: 'success'
  },
  {
    id: 5,
    matchId: 6,
    matchName: 'PSG vs Lyon',
    recipientCount: 8,
    method: 'whatsapp',
    templateName: 'Rappel Standard',
    message: 'Bonjour, rappel pour votre réservation pour le match PSG vs Lyon...',
    sentAt: '2026-01-15T14:20:00Z',
    sentBy: 'demo@match.com',
    restaurantId: 1,
    status: 'success'
  }
];
