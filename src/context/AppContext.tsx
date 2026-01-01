import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import api, { Venue, VenueMatch, Client as ApiClient, Notification as ApiNotification } from '../services/api';
import { useAuth } from './AuthContext';

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

interface AppContextType {
  restaurants: Restaurant[];
  matchs: Match[];
  clients: Client[];
  boostsDisponibles: number;
  notifications: Notification[];
  stats: Stats;
  loading: boolean;
  error: string | null;
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
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to convert API Venue to Restaurant format
function venueToRestaurant(venue: Venue, index: number, userId: string): Restaurant {
  return {
    id: index + 1, // Keep numeric ID for backward compatibility
    nom: venue.name,
    adresse: `${venue.street_address}, ${venue.postal_code} ${venue.city}`,
    telephone: venue.phone || '',
    email: venue.email || '',
    capaciteMax: venue.capacity || 50,
    note: venue.rating || 4.5,
    totalAvis: venue.review_count || 0,
    image: venue.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop',
    horaires: 'Lun-Dim: 11h00 - 02h00',
    tarif: '30€/mois',
    userId: userId,
  };
}

// Helper to convert API VenueMatch to Match format
function venueMatchToMatch(vm: VenueMatch, index: number, userId: string): Match {
  const scheduledAt = vm.match?.scheduled_at ? new Date(vm.match.scheduled_at) : new Date();
  const dateStr = scheduledAt.toLocaleDateString('fr-FR');
  const heureStr = scheduledAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  
  return {
    id: index + 1,
    equipe1: vm.match?.homeTeam || 'TBD',
    equipe2: vm.match?.awayTeam || 'TBD',
    date: dateStr,
    heure: heureStr,
    reservees: vm.reserved_seats,
    total: vm.total_capacity,
    sport: '⚽',
    sportNom: vm.match?.league || 'Football',
    restaurant: vm.venue?.name || '',
    statut: vm.status === 'finished' ? 'terminé' : 'à venir',
    restaurantId: 1,
    userId: userId,
  };
}

// Helper to convert API Client to local Client format
function apiClientToClient(c: ApiClient, index: number, userId: string): Client {
  return {
    id: index + 1,
    nom: c.last_name,
    prenom: c.first_name,
    match: c.match_name,
    date: new Date(c.reservation_date).toLocaleDateString('fr-FR'),
    userId: userId,
    statut: c.status === 'confirmed' ? 'confirmé' : c.status === 'pending' ? 'en attente' : 'refusé',
    email: c.email,
  };
}

// Helper to convert API Notification to local format
function apiNotificationToNotification(n: ApiNotification, index: number, userId: string): Notification {
  return {
    id: index + 1,
    userId: userId,
    type: n.type === 'reservation' ? 'reservation' : n.type === 'review' ? 'avis' : 'parrainage',
    title: n.title,
    message: n.message,
    date: new Date(n.created_at).toLocaleDateString('fr-FR'),
    read: n.read,
    reservationId: n.metadata?.reservation_id ? parseInt(n.metadata.reservation_id) : undefined,
  };
}

// Fallback mock data (used when API is unavailable)
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

const initialStats: Stats = {
  clients30Jours: 0,
  clientsTotal: 0,
  ageMoyen: 0,
  sportFavori: '-',
  moyenneClientsParMatch: 0,
  matchsDiffuses30Jours: 0,
  matchsAVenir: 0,
  matchsTotal: 0,
  vuesMois: 0,
  impressions: 0,
  boostsDisponibles: 12,
  matchsBoosted: 0,
  tauxRemplissageMoyen: 0,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const { currentUser, isAuthenticated } = useAuth();
  const [restaurants, setRestaurants] = useState<Restaurant[]>(initialRestaurants);
  const [matchs, setMatchs] = useState<Match[]>(initialMatchs);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [boostsDisponibles, setBoostsDisponibles] = useState(12);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [stats, setStats] = useState<Stats>(initialStats);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiAvailable, setApiAvailable] = useState(true);
  
  // Get userId - use actual user ID if authenticated, otherwise fallback to 'user-demo'
  const userId = currentUser?.id || 'user-demo';

  // Fetch all data from API
  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch venues - API already filters by authenticated user
      const venuesRes = await api.getMyVenues();
      console.log('Venues response:', venuesRes);
      
      // Mark API as available once we get a response
      setApiAvailable(true);
      
      // Handle venues - set even if empty to clear mock data
      const venues = venuesRes?.venues || [];
      const restaurantData = venues.map((v: Venue, i: number) => venueToRestaurant(v, i, userId));
      setRestaurants(restaurantData);

      // Fetch matches
      const matchesRes = await api.getMyMatches().catch(() => ({ data: [] }));
      console.log('Matches response:', matchesRes);
      const matchesData = matchesRes?.data || [];
      const matchData = matchesData.map((m: VenueMatch, i: number) => venueMatchToMatch(m, i, userId));
      setMatchs(matchData);

      // Fetch clients from all venues
      if (venues.length > 0) {
        const venueIds = venues.map((v: Venue) => v.id);
        const clientsRes = await api.getAllClients(venueIds).catch(() => ({ clients: [], total: 0 }));
        console.log('Clients response:', clientsRes);
        const clientsData = clientsRes?.clients || [];
        const clientData = clientsData.map((c: ApiClient, i: number) => apiClientToClient(c, i, userId));
        setClients(clientData);
      } else {
        setClients([]);
      }

      // Fetch analytics summary
      const analyticsRes = await api.getAnalyticsSummary().catch(() => ({
        total_clients: 0,
        total_reservations: 0,
        total_views: 0,
        matches_completed: 0,
        matches_upcoming: 0,
        average_occupancy: 0,
      }));

      // Fetch customer stats
      const customerStatsRes = await api.getCustomerStats().catch(() => ({
        customerCount: 0,
        totalGuests: 0,
        totalReservations: 0,
        period: 'last_30_days',
      }));

      // Update stats
      setStats((prev: Stats) => ({
        ...prev,
        clients30Jours: customerStatsRes.customerCount,
        clientsTotal: analyticsRes.total_clients,
        matchsDiffuses30Jours: analyticsRes.matches_completed,
        matchsAVenir: analyticsRes.matches_upcoming,
        matchsTotal: analyticsRes.matches_completed + analyticsRes.matches_upcoming,
        vuesMois: analyticsRes.total_views,
        tauxRemplissageMoyen: analyticsRes.average_occupancy,
        moyenneClientsParMatch: analyticsRes.matches_completed > 0
          ? Math.round(analyticsRes.total_reservations / analyticsRes.matches_completed)
          : 0,
      }));

      // Fetch notifications
      const notificationsRes = await api.getNotifications().catch(() => ({ notifications: [] }));
      const notificationsData = notificationsRes?.notifications || [];
      const notificationData = notificationsData.map((n: ApiNotification, i: number) => apiNotificationToNotification(n, i, userId));
      setNotifications(notificationData);
      
    } catch (err: any) {
      console.error('API error:', err);
      setApiAvailable(false);
      // Keep using initial mock data
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Initial data fetch when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [refreshData, isAuthenticated]);

  // Fonctions pour filtrer par utilisateur
  // Note: When API is available, data is already user-specific, so we return all.
  // We still filter for backward compatibility with mock data.
  const getUserRestaurants = (requestedUserId: string) => {
    // If using API data, return all (already filtered by API)
    // If using mock data, filter by userId
    if (apiAvailable && currentUser) {
      return restaurants;
    }
    return restaurants.filter(r => r.userId === requestedUserId);
  };
  
  const getUserMatchs = (requestedUserId: string) => {
    if (apiAvailable && currentUser) {
      return matchs;
    }
    return matchs.filter(m => m.userId === requestedUserId);
  };
  
  const getUserClients = (requestedUserId: string) => {
    if (apiAvailable && currentUser) {
      return clients;
    }
    return clients.filter(c => c.userId === requestedUserId);
  };

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

  const markAllAsRead = async (userId: string) => {
    try {
      if (apiAvailable) {
        await api.markAllNotificationsAsRead();
      }
    } catch (err) {
      console.warn('Failed to mark notifications as read via API');
    }
    setNotifications(notifications.map(n => n.userId === userId ? { ...n, read: true } : n));
  };

  return (
    <AppContext.Provider value={{
      restaurants,
      matchs,
      clients,
      boostsDisponibles,
      notifications,
      stats,
      loading,
      error,
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
      refreshData,
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