/**
 * Global TypeScript types and interfaces
 * Export all shared types from this file
 */

// Common types
export type { PageType, ApiResponse, AppError } from './common.types';

// Restaurant types
export type { 
  Restaurant, 
  RestaurantFormData, 
  FormuleType, 
  Formule 
} from './restaurant.types';

// Match types
export type { 
  Match, 
  MatchAVenir, 
  MatchDiffuse, 
  MatchFormData, 
  MatchStatus, 
  SportType 
} from './match.types';

// User types
export type { 
  User, 
  OnboardingStep, 
  LoginCredentials, 
  RegisterData, 
  UserProfile 
} from './user.types';

// Reservation types
export type { 
  Reservation, 
  ReservationStatus, 
  Client 
} from './reservation.types';

// Stats types
export type { 
  Stats, 
  ChartData, 
  PerformanceMetrics 
} from './stats.types';

// Avis types
export type { 
  Avis, 
  AvisFormData, 
  AvisStats 
} from './avis.types';
