/**
 * Restaurant-related types
 */

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
}

export interface RestaurantFormData {
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  capaciteMax: number;
  horaires?: string;
}

export type FormuleType = 'mensuel' | 'annuel';

export interface Formule {
  type: FormuleType;
  prix: number;
  label: string;
}
