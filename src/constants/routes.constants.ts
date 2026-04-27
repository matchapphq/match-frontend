/**
 * Application routes constants
 */

export const ROUTES = {
  // Public routes
  LANDING: 'landing',
  LOGIN: 'login',
  REGISTER: 'register',
  
  // Dashboard
  DASHBOARD: 'dashboard',
  
  // Matches
  LISTE_MATCHS: 'liste-matchs',
  MATCH_DETAIL: 'match-detail',
  MES_MATCHS: 'mes-matchs',
  PROGRAMMER_MATCH: 'programmer-match',
  MODIFIER_MATCH: 'modifier-match',
  
  // Restaurants
  MES_RESTAURANTS: 'mes-restaurants',
  RESTAURANT_DETAIL: 'restaurant-detail',
  AJOUTER_RESTAURANT: 'ajouter-restaurant',
  MODIFIER_RESTAURANT: 'modifier-restaurant',
  
  // Features
  BOOSTER: 'booster',
  PARRAINAGE: 'parrainage',
  MES_AVIS: 'mes-avis',
  RESERVATIONS: 'reservations',
  QR_SCANNER: 'qr-scanner',
  
  // Account
  COMPTE: 'compte',
  COMPTE_INFOS: 'compte-infos',
  COMPTE_FACTURATION: 'compte-facturation',
  COMPTE_NOTIFICATIONS: 'compte-notifications',
  COMPTE_SECURITE: 'compte-securite',
  COMPTE_DONNEES: 'compte-donnees',
  COMPTE_AIDE: 'compte-aide',
  
  // Onboarding
  INFOS_ETABLISSEMENT: 'infos-etablissement',
  FACTURATION: 'facturation',
  ONBOARDING_WELCOME: 'onboarding-welcome',
  CONFIRMATION_ONBOARDING: 'confirmation-onboarding',
  PAIEMENT_VALIDATION: 'paiement-validation',
  
  // Other
  APP_PRESENTATION: 'app-presentation',
  REFERRAL: 'referral',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey];
