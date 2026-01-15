/**
 * Statistics-related types
 */

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

export interface ChartData {
  name: string;
  value: number;
  label?: string;
}

export interface PerformanceMetrics {
  vues: number;
  reservations: number;
  tauxConversion: number;
  periode: string;
}
