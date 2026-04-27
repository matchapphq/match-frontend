/**
 * Review/Avis-related types
 */

export interface Avis {
  id: number;
  clientNom: string;
  clientPrenom: string;
  restaurantNom: string;
  note: number;
  commentaire: string;
  date: string;
  reponse?: string;
  dateReponse?: string;
}

export interface AvisFormData {
  note: number;
  commentaire: string;
}

export interface AvisStats {
  moyenneNotes: number;
  totalAvis: number;
  repartitionNotes: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}
