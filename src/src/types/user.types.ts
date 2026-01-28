/**
 * User-related types
 */

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  telephone?: string;
  avatar?: string;
  hasCompletedOnboarding: boolean;
  onboardingStep: OnboardingStep;
  createdAt?: Date;
}

export type OnboardingStep = 'restaurant' | 'facturation' | 'complete';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  telephone?: string;
  avatar?: string;
}
