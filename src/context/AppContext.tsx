import React, { createContext, useContext, useState, ReactNode } from 'react';

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
  userId: string; // Lien avec l'utilisateur propriétaire
  bookingMode?: 'INSTANT' | 'REQUEST'; // ✅ NOUVEAU : Mode de réservation
}

export interface Match {
  id: number;
  equipe1: string;
  equipe2: string;
  date: string;
  heure: string;
  reservees: number;
  total: number;
  sport: string;
  sportNom: string;
  restaurant: string;
  statut: 'à venir' | 'terminé';
  restaurantId: number;
  userId: string; // Lien avec l'utilisateur propriétaire
}

export interface Client {
  id: number;
  nom: string;
  prenom: string;
  match: string;
  date: string;
  userId: string; // Lien avec l'utilisateur propriétaire
  statut?: 'confirmé' | 'en attente' | 'refusé';
  email?: string;
  telephone?: string;
  restaurant?: string;
  matchId?: number;
}

export interface Notification {
  id: number;
  userId: string;
  type: 'reservation' | 'avis' | 'parrainage';
  title: string;
  message: string;
  date: string;
  read: boolean;
  reservationId?: number;
}

interface AppContextType {
  restaurants: Restaurant[];
  matchs: Match[];
  clients: Client[];
  boostsDisponibles: number;
  notifications: Notification[];
  addRestaurant: (restaurant: Restaurant) => void;
  updateRestaurant: (id: number, restaurant: Partial<Restaurant>) => void;
  deleteRestaurant: (id: number) => void;
  addMatch: (match: Match) => void;
  updateMatch: (id: number, match: Partial<Match>) => void;
  deleteMatch: (id: number) => void;
  useBoost: () => void;
  addBoosts: (count: number) => void;
  getUserRestaurants: (userId: string) => Restaurant[];
  getUserMatchs: (userId: string) => Match[];
  getUserClients: (userId: string) => Client[];
  handleReservationAction: (reservationId: number, action: 'acceptée' | 'refusée') => void;
  updateClient: (id: number, client: Partial<Client>) => void;
  markAllAsRead: (userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialRestaurants: Restaurant[] = [
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
    userId: 'user-demo', // Associé à l'utilisateur démo
    bookingMode: 'INSTANT', // ✅ NOUVEAU : Mode de réservation
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
    userId: 'user-demo',
    bookingMode: 'REQUEST', // ✅ NOUVEAU : Mode de réservation
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
    userId: 'user-demo',
    bookingMode: 'INSTANT', // ✅ NOUVEAU : Mode de réservation
  },
];

const initialMatchs: Match[] = [
  { id: 1, equipe1: 'Monaco', equipe2: 'Nice', date: '10/12/2024', heure: '20:00', reservees: 22, total: 30, sport: '⚽', sportNom: 'Football', restaurant: 'Le Sport Bar', statut: 'à venir', restaurantId: 1, userId: 'user-demo' },
  { id: 2, equipe1: 'Lakers', equipe2: 'Warriors', date: '12/12/2024', heure: '02:00', reservees: 18, total: 25, sport: '🏀', sportNom: 'Basketball', restaurant: 'Chez Michel', statut: 'à venir', restaurantId: 2, userId: 'user-demo' },
  { id: 3, equipe1: 'PSG', equipe2: 'OM', date: '15/12/2024', heure: '21:00', reservees: 35, total: 40, sport: '⚽', sportNom: 'Football', restaurant: 'Le Sport Bar', statut: 'à venir', restaurantId: 1, userId: 'user-demo' },
  { id: 4, equipe1: 'Real Madrid', equipe2: 'Atletico', date: '18/12/2024', heure: '19:30', reservees: 28, total: 35, sport: '⚽', sportNom: 'Football', restaurant: 'La Brasserie du Stade', statut: 'à venir', restaurantId: 3, userId: 'user-demo' },
  { id: 5, equipe1: 'Stade Français', equipe2: 'Toulouse', date: '20/12/2024', heure: '15:00', reservees: 15, total: 28, sport: '🏉', sportNom: 'Rugby', restaurant: 'Chez Michel', statut: 'à venir', restaurantId: 2, userId: 'user-demo' },
  { id: 6, equipe1: 'PSG', equipe2: 'Lyon', date: '28/11/2024', heure: '21:00', reservees: 44, total: 50, sport: '⚽', sportNom: 'Football', restaurant: 'Le Sport Bar', statut: 'terminé', restaurantId: 1, userId: 'user-demo' },
  { id: 7, equipe1: 'Stade Français', equipe2: 'Toulouse', date: '25/11/2024', heure: '15:00', reservees: 38, total: 40, sport: '🏉', sportNom: 'Rugby', restaurant: 'Chez Michel', statut: 'terminé', restaurantId: 2, userId: 'user-demo' },
  { id: 8, equipe1: 'Federer', equipe2: 'Nadal', date: '22/11/2024', heure: '14:00', reservees: 28, total: 30, sport: '🎾', sportNom: 'Tennis', restaurant: 'Le Sport Bar', statut: 'terminé', restaurantId: 1, userId: 'user-demo' },
  { id: 9, equipe1: 'Liverpool', equipe2: 'Manchester', date: '20/11/2024', heure: '20:00', reservees: 42, total: 45, sport: '⚽', sportNom: 'Football', restaurant: 'La Brasserie du Stade', statut: 'terminé', restaurantId: 3, userId: 'user-demo' },
  { id: 10, equipe1: 'France', equipe2: 'Espagne', date: '18/11/2024', heure: '20:30', reservees: 48, total: 50, sport: '🤾', sportNom: 'Handball', restaurant: 'Le Sport Bar', statut: 'terminé', restaurantId: 1, userId: 'user-demo' },
  { id: 11, equipe1: 'Bayern', equipe2: 'Dortmund', date: '15/11/2024', heure: '18:45', reservees: 32, total: 35, sport: '⚽', sportNom: 'Football', restaurant: 'Chez Michel', statut: 'terminé', restaurantId: 2, userId: 'user-demo' },
  { id: 12, equipe1: 'Barcelone', equipe2: 'Real Madrid', date: '12/11/2024', heure: '21:00', reservees: 56, total: 60, sport: '⚽', sportNom: 'Football', restaurant: 'La Brasserie du Stade', statut: 'terminé', restaurantId: 3, userId: 'user-demo' },
  { id: 13, equipe1: 'Arsenal', equipe2: 'Chelsea', date: '10/11/2024', heure: '17:30', reservees: 29, total: 30, sport: '⚽', sportNom: 'Football', restaurant: 'Le Sport Bar', statut: 'terminé', restaurantId: 1, userId: 'user-demo' },
  { id: 14, equipe1: 'Milan AC', equipe2: 'Inter', date: '08/11/2024', heure: '20:45', reservees: 38, total: 40, sport: '⚽', sportNom: 'Football', restaurant: 'Chez Michel', statut: 'terminé', restaurantId: 2, userId: 'user-demo' },
  { id: 15, equipe1: 'Juventus', equipe2: 'Napoli', date: '05/11/2024', heure: '19:00', reservees: 52, total: 60, sport: '⚽', sportNom: 'Football', restaurant: 'La Brasserie du Stade', statut: 'terminé', restaurantId: 3, userId: 'user-demo' },
  { id: 16, equipe1: 'Monaco', equipe2: 'Marseille', date: '03/11/2024', heure: '21:00', reservees: 41, total: 50, sport: '⚽', sportNom: 'Football', restaurant: 'Le Sport Bar', statut: 'terminé', restaurantId: 1, userId: 'user-demo' },
  { id: 17, equipe1: 'Lens', equipe2: 'Lille', date: '01/11/2024', heure: '15:00', reservees: 26, total: 35, sport: '⚽', sportNom: 'Football', restaurant: 'Chez Michel', statut: 'terminé', restaurantId: 2, userId: 'user-demo' },
  { id: 18, equipe1: 'Nice', equipe2: 'Lyon', date: '29/10/2024', heure: '20:00', reservees: 55, total: 60, sport: '⚽', sportNom: 'Football', restaurant: 'La Brasserie du Stade', statut: 'terminé', restaurantId: 3, userId: 'user-demo' },
];

const initialClients: Client[] = [
  { id: 1, nom: 'Dupont', prenom: 'Jean', match: 'PSG vs OM', date: '15/11/2024', userId: 'user-demo' },
  { id: 2, nom: 'Martin', prenom: 'Sophie', match: 'France vs Allemagne', date: '18/11/2024', userId: 'user-demo' },
  { id: 3, nom: 'Bernard', prenom: 'Luc', match: 'Real Madrid vs Barcelona', date: '22/11/2024', userId: 'user-demo' },
  { id: 4, nom: 'Petit', prenom: 'Marie', match: 'Liverpool vs Manchester', date: '25/11/2024', userId: 'user-demo' },
  { id: 5, nom: 'Dubois', prenom: 'Pierre', match: 'PSG vs Lyon', date: '28/11/2024', userId: 'user-demo' },
  { id: 6, nom: 'Thomas', prenom: 'Emma', match: 'Monaco vs Nice', date: '01/12/2024', userId: 'user-demo' },
  { id: 7, nom: 'Robert', prenom: 'Lucas', match: 'Bayern vs Dortmund', date: '03/12/2024', userId: 'user-demo' },
  { id: 8, nom: 'Richard', prenom: 'Julie', match: 'PSG vs OM', date: '05/12/2024', userId: 'user-demo' },
];

const initialNotifications: Notification[] = [
  { id: 1, userId: 'user-demo', type: 'reservation', title: 'Nouvelle réservation', message: 'Une nouvelle réservation a été faite pour le match PSG vs OM.', date: '15/11/2024', read: false, reservationId: 1 },
  { id: 2, userId: 'user-demo', type: 'avis', title: 'Nouvel avis', message: 'Un nouvel avis a été laissé pour votre restaurant Le Sport Bar.', date: '18/11/2024', read: false },
  { id: 3, userId: 'user-demo', type: 'parrainage', title: 'Nouveau parrainage', message: 'Vous avez un nouveau parrainage pour votre restaurant Chez Michel.', date: '22/11/2024', read: false },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants);
  const [matchs, setMatchs] = useState<Match[]>(initialMatchs);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [boostsDisponibles, setBoostsDisponibles] = useState(12);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  // Fonctions pour filtrer par utilisateur
  const getUserRestaurants = (userId: string) => restaurants.filter(r => r.userId === userId);
  const getUserMatchs = (userId: string) => matchs.filter(m => m.userId === userId);
  const getUserClients = (userId: string) => clients.filter(c => c.userId === userId);

  const addRestaurant = (restaurant: Restaurant) => {
    setRestaurants([...restaurants, restaurant]);
  };

  const updateRestaurant = (id: number, updatedData: Partial<Restaurant>) => {
    setRestaurants(restaurants.map(r => r.id === id ? { ...r, ...updatedData } : r));
  };

  const deleteRestaurant = (id: number) => {
    setRestaurants(restaurants.filter(r => r.id !== id));
  };

  const addMatch = (match: Match) => {
    setMatchs([...matchs, match]);
  };

  const updateMatch = (id: number, updatedData: Partial<Match>) => {
    setMatchs(matchs.map(m => m.id === id ? { ...m, ...updatedData } : m));
  };

  const deleteMatch = (id: number) => {
    setMatchs(matchs.filter(m => m.id !== id));
  };

  const useBoost = () => {
    if (boostsDisponibles > 0) {
      setBoostsDisponibles(boostsDisponibles - 1);
    }
  };

  const addBoosts = (count: number) => {
    setBoostsDisponibles(boostsDisponibles + count);
  };

  const handleReservationAction = (reservationId: number, action: 'acceptée' | 'refusée') => {
    const updatedClients = clients.map(client => {
      if (client.id === reservationId) {
        return { ...client, statut: action === 'acceptée' ? 'confirmé' : 'refusé' };
      }
      return client;
    });
    setClients(updatedClients);
  };

  const updateClient = (id: number, client: Partial<Client>) => {
    setClients(clients.map(c => c.id === id ? { ...c, ...client } : c));
  };

  const markAllAsRead = (userId: string) => {
    setNotifications(notifications.map(n => n.userId === userId ? { ...n, read: true } : n));
  };

  return (
    <AppContext.Provider value={{
      restaurants,
      matchs,
      clients,
      boostsDisponibles,
      notifications,
      addRestaurant,
      updateRestaurant,
      deleteRestaurant,
      addMatch,
      updateMatch,
      deleteMatch,
      useBoost,
      addBoosts,
      getUserRestaurants,
      getUserMatchs,
      getUserClients,
      handleReservationAction,
      updateClient,
      markAllAsRead,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}