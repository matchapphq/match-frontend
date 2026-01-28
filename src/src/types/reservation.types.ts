/**
 * Reservation-related types
 */

export interface Reservation {
  id: number;
  clientNom: string;
  clientPrenom: string;
  clientEmail: string;
  clientTelephone: string;
  matchId: number;
  matchTitre: string;
  restaurantNom: string;
  nombrePersonnes: number;
  dateReservation: string;
  statut: ReservationStatus;
  qrCode?: string;
}

export type ReservationStatus = 'confirmée' | 'en attente' | 'annulée';

export interface Client {
  id: number;
  nom: string;
  prenom: string;
  match: string;
  date: string;
  email?: string;
  telephone?: string;
}
