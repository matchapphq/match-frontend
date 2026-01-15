/**
 * Common types used across the application
 */

/**
 * Page navigation types
 */
export type PageType = 
  | 'dashboard'
  | 'liste-matchs'
  | 'match-detail'
  | 'mes-matchs'
  | 'mes-restaurants'
  | 'restaurant-detail'
  | 'programmer-match'
  | 'modifier-match'
  | 'ajouter-restaurant'
  | 'modifier-restaurant'
  | 'booster'
  | 'parrainage'
  | 'mes-avis'
  | 'compte'
  | 'compte-infos'
  | 'compte-facturation'
  | 'compte-notifications'
  | 'compte-securite'
  | 'compte-donnees'
  | 'compte-aide'
  | 'infos-etablissement'
  | 'facturation'
  | 'onboarding-welcome'
  | 'confirmation-onboarding'
  | 'paiement-validation'
  | 'app-presentation'
  | 'referral'
  | 'qr-scanner'
  | 'reservations';

/**
 * Generic API response type
 */
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

/**
 * Generic error type
 */
export interface AppError {
  message: string;
  code?: string;
  details?: unknown;
}
