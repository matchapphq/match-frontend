// Données mockées unifiées pour toute l'application

export const STATS = {
  clients30Jours: 247,
  clientsTotal: 1247,
  ageMoyen: 32,
  sportFavori: 'Football',
  moyenneClientsParMatch: 28,
  
  matchsDiffuses30Jours: 18,
  matchsAVenir: 12,
  matchsTotal: 30,
  
  vuesMois: 1453,
  impressions: 12400,
  
  boostsDisponibles: 12,
  matchsBoosted: 3,
  
  tauxRemplissageMoyen: 73,
};

export const RESTAURANTS = [
  {
    id: 1,
    nom: 'Le Sport Bar',
    adresse: '12 Rue de la République, 75001 Paris',
    telephone: '01 23 45 67 89',
    email: 'contact@lesportbar.fr',
    capaciteMax: 50,
    note: 4.5,
    totalAvis: 127,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop',
    horaires: 'Lun-Dim: 11h00 - 02h00',
    tarif: '30€/mois',
  },
  {
    id: 2,
    nom: 'Chez Michel',
    adresse: '45 Avenue des Champs, 69001 Lyon',
    telephone: '04 12 34 56 78',
    email: 'contact@chezmichel.fr',
    capaciteMax: 35,
    note: 4.8,
    totalAvis: 89,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop',
    horaires: 'Mar-Dim: 10h00 - 01h00',
    tarif: '30€/mois',
  },
  {
    id: 3,
    nom: 'La Brasserie du Stade',
    adresse: '78 Boulevard Sport, 13001 Marseille',
    telephone: '04 91 23 45 67',
    email: 'contact@brasseriestade.fr',
    capaciteMax: 60,
    note: 4.3,
    totalAvis: 156,
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=400&fit=crop',
    horaires: 'Lun-Dim: 09h00 - 02h00',
    tarif: '30€/mois',
  },
];

export const MATCHS_A_VENIR = [
  { id: 1, equipe1: 'Monaco', equipe2: 'Nice', date: '10/12/2024', heure: '20:00', reservees: 22, total: 30, sport: '⚽', sportNom: 'Football', restaurant: 'Le Sport Bar' },
  { id: 2, equipe1: 'Lakers', equipe2: 'Warriors', date: '12/12/2024', heure: '02:00', reservees: 18, total: 25, sport: '🏀', sportNom: 'Basketball', restaurant: 'Chez Michel' },
  { id: 3, equipe1: 'PSG', equipe2: 'OM', date: '15/12/2024', heure: '21:00', reservees: 35, total: 40, sport: '⚽', sportNom: 'Football', restaurant: 'Le Sport Bar' },
  { id: 4, equipe1: 'Real Madrid', equipe2: 'Atletico', date: '18/12/2024', heure: '19:30', reservees: 28, total: 35, sport: '⚽', sportNom: 'Football', restaurant: 'La Brasserie du Stade' },
  { id: 5, equipe1: 'Stade Français', equipe2: 'Toulouse', date: '20/12/2024', heure: '15:00', reservees: 15, total: 28, sport: '🏉', sportNom: 'Rugby', restaurant: 'Chez Michel' },
];

export const MATCHS_DIFFUSES = [
  { id: 1, equipe1: 'PSG', equipe2: 'Lyon', date: '28/11/2024', heure: '21:00', spectateurs: 44, places: 50, sport: '⚽', sportNom: 'Football' },
  { id: 2, equipe1: 'Stade Français', equipe2: 'Toulouse', date: '25/11/2024', heure: '15:00', spectateurs: 38, places: 40, sport: '🏉', sportNom: 'Rugby' },
  { id: 3, equipe1: 'Federer', equipe2: 'Nadal', date: '22/11/2024', heure: '14:00', spectateurs: 28, places: 30, sport: '🎾', sportNom: 'Tennis' },
  { id: 4, equipe1: 'Liverpool', equipe2: 'Manchester', date: '20/11/2024', heure: '20:00', spectateurs: 42, places: 45, sport: '⚽', sportNom: 'Football' },
  { id: 5, equipe1: 'France', equipe2: 'Espagne', date: '18/11/2024', heure: '20:30', spectateurs: 48, places: 50, sport: '🤾', sportNom: 'Handball' },
];

export const CLIENTS_RECENTS = [
  { id: 1, nom: 'Dupont', prenom: 'Jean', match: 'PSG vs OM', date: '15/11/2024' },
  { id: 2, nom: 'Martin', prenom: 'Sophie', match: 'France vs Allemagne', date: '18/11/2024' },
  { id: 3, nom: 'Bernard', prenom: 'Luc', match: 'Real Madrid vs Barcelona', date: '22/11/2024' },
  { id: 4, nom: 'Petit', prenom: 'Marie', match: 'Liverpool vs Manchester', date: '25/11/2024' },
  { id: 5, nom: 'Dubois', prenom: 'Pierre', match: 'PSG vs Lyon', date: '28/11/2024' },
  { id: 6, nom: 'Thomas', prenom: 'Emma', match: 'Monaco vs Nice', date: '01/12/2024' },
  { id: 7, nom: 'Robert', prenom: 'Lucas', match: 'Bayern vs Dortmund', date: '03/12/2024' },
  { id: 8, nom: 'Richard', prenom: 'Julie', match: 'PSG vs OM', date: '05/12/2024' },
];
