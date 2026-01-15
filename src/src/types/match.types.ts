/**
 * Match-related types
 */

export interface Match {
  id: number;
  equipe1: string;
  equipe2: string;
  date: string;
  heure: string;
  sport: string;
  sportNom: string;
  restaurant?: string;
  reservees?: number;
  total?: number;
  spectateurs?: number;
  places?: number;
}

export interface MatchAVenir extends Match {
  reservees: number;
  total: number;
  restaurant: string;
}

export interface MatchDiffuse extends Match {
  spectateurs: number;
  places: number;
}

export interface MatchFormData {
  equipe1: string;
  equipe2: string;
  date: string;
  heure: string;
  sport: string;
  sportNom: string;
  capacite: number;
  restaurantId: number;
}

export type MatchStatus = 'à venir' | 'en cours' | 'terminé' | 'annulé';

export type SportType = 'Football' | 'Basketball' | 'Rugby' | 'Tennis' | 'Handball';
