/**
 * Data Mappers
 * 
 * Utility functions to map between backend data (snake_case) and UI data (camelCase)
 * Only use these mappers when UI components expect different format
 */

import type { Venue } from '../services/venues.service';
import type { Match, VenueMatch } from '../services/matches.service';
import type { Reservation } from '../services/reservations.service';
import type { Restaurant, Match as UIMatch, Client } from '../context/AppContext';

/**
 * Map Venue (backend) to Restaurant (UI)
 */
export function mapVenueToRestaurant(venue: Venue, additionalData?: {
  note?: number;
  totalAvis?: number;
  image?: string;
  matchsOrganises?: number;
}): Restaurant {
  return {
    id: Number(venue.id) || Math.floor(Math.random() * 1000000),
    nom: venue.name,
    adresse: `${venue.address}, ${venue.city} ${venue.postal_code}`,
    telephone: venue.phone,
    email: venue.email || '',
    capaciteMax: venue.capacity || 50,
    note: additionalData?.note || 4.5,
    totalAvis: additionalData?.totalAvis || 0,
    image: additionalData?.image || '',
    horaires: 'Lun-Dim: 11h00 - 02h00', // TODO: Format from opening_hours
    tarif: '30€/mois',
    userId: 'current-user',
    bookingMode: venue.booking_mode,
    matchsOrganises: additionalData?.matchsOrganises || 0,
  };
}

/**
 * Map multiple Venues to Restaurants
 */
export function mapVenuesToRestaurants(venues: Venue[]): Restaurant[] {
  return venues.map(v => mapVenueToRestaurant(v));
}

/**
 * Map VenueMatch (backend) to UIMatch (UI)
 */
export function mapVenueMatchToUIMatch(venueMatch: VenueMatch, venueId?: string): UIMatch {
  const match = venueMatch.match;
  
  return {
    id: Number(venueMatch.id) || Math.floor(Math.random() * 1000000),
    equipe1: match?.home_team_name || 'Équipe 1',
    equipe2: match?.away_team_name || 'Équipe 2',
    date: match?.match_date ? new Date(match.match_date).toLocaleDateString('fr-FR') : '',
    heure: match?.match_time || '',
    reservees: venueMatch.reservations_count || 0,
    total: venueMatch.max_capacity || 0,
    sport: match?.sport_id || 'football',
    sportNom: 'Football', // TODO: Get from sport details
    restaurant: '', // TODO: Get venue name
    statut: match?.status === 'SCHEDULED' ? 'à venir' : 'terminé',
    restaurantId: venueId ? Number(venueId) : 0,
    userId: 'current-user',
  };
}

/**
 * Map multiple VenueMatches to UIMatches
 */
export function mapVenueMatchesToUIMatches(venueMatches: VenueMatch[], venueId?: string): UIMatch[] {
  return venueMatches.map(vm => mapVenueMatchToUIMatch(vm, venueId));
}

/**
 * Map Reservation (backend) to Client (UI)
 */
export function mapReservationToClient(reservation: Reservation): Client {
  return {
    id: Number(reservation.id) || Math.floor(Math.random() * 1000000),
    nom: reservation.user_name.split(' ').pop() || reservation.user_name,
    prenom: reservation.user_name.split(' ')[0] || '',
    match: '', // TODO: Get match name from venue_match_id
    date: new Date(reservation.created_at).toLocaleDateString('fr-FR'),
    userId: 'current-user',
    statut: mapReservationStatus(reservation.status),
    email: reservation.user_email,
    telephone: reservation.user_phone,
    restaurant: '',
    matchId: 0,
  };
}

/**
 * Map multiple Reservations to Clients
 */
export function mapReservationsToClients(reservations: Reservation[]): Client[] {
  return reservations.map(r => mapReservationToClient(r));
}

/**
 * Map reservation status (backend) to client status (UI)
 */
export function mapReservationStatus(status: string): 'confirmé' | 'en attente' | 'refusé' {
  switch (status) {
    case 'CONFIRMED':
    case 'CHECKED_IN':
      return 'confirmé';
    case 'PENDING':
      return 'en attente';
    case 'CANCELLED':
    case 'NO_SHOW':
      return 'refusé';
    default:
      return 'en attente';
  }
}

/**
 * Map UI reservation status to backend status
 */
export function mapUIStatusToBackendStatus(status: 'confirmé' | 'en attente' | 'refusé'): 'CONFIRMED' | 'PENDING' | 'CANCELLED' {
  switch (status) {
    case 'confirmé':
      return 'CONFIRMED';
    case 'en attente':
      return 'PENDING';
    case 'refusé':
      return 'CANCELLED';
  }
}

/**
 * Format opening hours for display
 */
export function formatOpeningHours(hours: any[]): string {
  if (!hours || hours.length === 0) {
    return 'Horaires non définis';
  }
  
  // Simple format for now
  // TODO: Implement proper formatting based on days
  return 'Lun-Dim: 11h00 - 02h00';
}

/**
 * Get primary photo URL from venue photos
 */
export function getPrimaryPhotoUrl(photos: any[]): string {
  if (!photos || photos.length === 0) {
    return '';
  }
  
  const primary = photos.find(p => p.is_primary);
  return primary?.url || photos[0]?.url || '';
}

/**
 * Calculate average rating from reviews
 */
export function calculateAverageRating(reviews: any[]): number {
  if (!reviews || reviews.length === 0) {
    return 0;
  }
  
  const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

/**
 * Format price per person
 */
export function formatPrice(price?: number): string {
  if (!price || price === 0) {
    return 'Gratuit';
  }
  
  return `${price}€`;
}

/**
 * Format date from ISO string to French format
 */
export function formatDate(isoDate: string): string {
  try {
    return new Date(isoDate).toLocaleDateString('fr-FR');
  } catch {
    return '';
  }
}

/**
 * Format datetime from ISO string to French format with time
 */
export function formatDateTime(isoDate: string): string {
  try {
    return new Date(isoDate).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

/**
 * Format time from ISO string to HH:mm
 */
export function formatTime(isoDate: string): string {
  try {
    return new Date(isoDate).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

/**
 * Get sport icon/emoji
 */
export function getSportIcon(sportId: string): string {
  const icons: Record<string, string> = {
    football: '⚽',
    basketball: '🏀',
    tennis: '🎾',
    rugby: '🏉',
    handball: '🤾',
    volleyball: '🏐',
  };
  
  return icons[sportId.toLowerCase()] || '🏆';
}

/**
 * Get match status badge color
 */
export function getMatchStatusColor(status: string): string {
  switch (status) {
    case 'SCHEDULED':
      return 'blue';
    case 'LIVE':
      return 'green';
    case 'FINISHED':
      return 'gray';
    case 'CANCELLED':
      return 'red';
    default:
      return 'gray';
  }
}

/**
 * Get reservation status badge color
 */
export function getReservationStatusColor(status: string): string {
  switch (status) {
    case 'CONFIRMED':
    case 'CHECKED_IN':
      return 'green';
    case 'PENDING':
      return 'orange';
    case 'CANCELLED':
    case 'NO_SHOW':
      return 'red';
    default:
      return 'gray';
  }
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Format large numbers with K, M suffixes
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Get relative time string (e.g., "Il y a 2h")
 */
export function getRelativeTime(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins}min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return formatDate(isoDate);
  } catch {
    return '';
  }
}
