import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { Venue, Match as ApiMatch, AnalyticsOverview } from '../lib/types';
import { useAuth } from './AuthContext';

export interface Restaurant {
  id: string;
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
  userId: string;
}

export interface Match {
  id: string;
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
  restaurantId: string;
  userId: string;
}

export interface Client {
  id: string;
  nom: string;
  prenom: string;
  match: string;
  date: string;
  userId: string;
}

interface AppContextType {
  restaurants: Restaurant[];
  matchs: Match[];
  clients: Client[];
  boostsDisponibles: number;
  isLoading: boolean;
  addRestaurant: (restaurant: Omit<Restaurant, 'id'>) => Promise<void>;
  updateRestaurant: (id: string, restaurant: Partial<Restaurant>) => void;
  deleteRestaurant: (id: string) => void;
  addMatch: (match: Omit<Match, 'id'>) => void;
  updateMatch: (id: string, match: Partial<Match>) => void;
  deleteMatch: (id: string) => void;
  useBoost: () => void;
  addBoosts: (count: number) => void;
  getUserRestaurants: (userId: string) => Restaurant[];
  getUserMatchs: (userId: string) => Match[];
  getUserClients: (userId: string) => Client[];
  refetchVenues: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// API functions
const appApi = {
  getMyVenues: async (): Promise<{ venues: Venue[] }> => {
    const response = await api.get('/partners/venues');
    return response.data;
  },
  createVenue: async (data: any): Promise<{ venue: Venue }> => {
    const response = await api.post('/partners/venues', data);
    return response.data;
  },
  getMatches: async (): Promise<{ data: ApiMatch[], count: number }> => {
    const response = await api.get('/matches');
    return response.data;
  },
  getVenueAnalytics: async (venueId: string): Promise<{ overview: AnalyticsOverview }> => {
    const response = await api.get(`/venues/${venueId}/analytics/overview`);
    return response.data;
  },
  getVenueReservations: async (venueMatchId: string): Promise<{ reservations: any[], stats: any }> => {
    const response = await api.get(`/reservations/venue/${venueMatchId}`);
    return response.data;
  },
};

// Convert API Venue to frontend Restaurant format
function mapVenueToRestaurant(venue: Venue, userId: string): Restaurant {
  return {
    id: venue.id,
    nom: venue.name,
    adresse: `${venue.street_address}, ${venue.postal_code} ${venue.city}`,
    telephone: venue.phone || '',
    email: venue.email || '',
    capaciteMax: venue.capacity || 50,
    note: venue.rating || 4.5,
    totalAvis: venue.total_reviews || 0,
    image: venue.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop',
    horaires: venue.opening_hours || 'Lun-Dim: 11h00 - 02h00',
    tarif: '30€/mois',
    userId: userId,
  };
}

// Fallback mock data when API is not available
const fallbackRestaurants: Restaurant[] = [
  {
    id: '1',
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
    userId: '',
  },
];

const fallbackMatchs: Match[] = [
  { id: '1', equipe1: 'Monaco', equipe2: 'Nice', date: '10/12/2024', heure: '20:00', reservees: 22, total: 30, sport: '⚽', sportNom: 'Football', restaurant: 'Le Sport Bar', statut: 'à venir', restaurantId: '1', userId: '' },
  { id: '2', equipe1: 'Lakers', equipe2: 'Warriors', date: '12/12/2024', heure: '02:00', reservees: 18, total: 25, sport: '🏀', sportNom: 'Basketball', restaurant: 'Chez Michel', statut: 'à venir', restaurantId: '2', userId: '' },
  { id: '3', equipe1: 'PSG', equipe2: 'OM', date: '15/12/2024', heure: '21:00', reservees: 35, total: 40, sport: '⚽', sportNom: 'Football', restaurant: 'Le Sport Bar', statut: 'à venir', restaurantId: '1', userId: '' },
  { id: '4', equipe1: 'Real Madrid', equipe2: 'Atletico', date: '18/12/2024', heure: '19:30', reservees: 28, total: 35, sport: '⚽', sportNom: 'Football', restaurant: 'La Brasserie du Stade', statut: 'à venir', restaurantId: '3', userId: '' },
  { id: '5', equipe1: 'Stade Français', equipe2: 'Toulouse', date: '20/12/2024', heure: '15:00', reservees: 15, total: 28, sport: '🏉', sportNom: 'Rugby', restaurant: 'Chez Michel', statut: 'à venir', restaurantId: '2', userId: '' },
  { id: '6', equipe1: 'PSG', equipe2: 'Lyon', date: '28/11/2024', heure: '21:00', reservees: 44, total: 50, sport: '⚽', sportNom: 'Football', restaurant: 'Le Sport Bar', statut: 'terminé', restaurantId: '1', userId: '' },
  { id: '7', equipe1: 'Liverpool', equipe2: 'Manchester', date: '20/11/2024', heure: '20:00', reservees: 42, total: 45, sport: '⚽', sportNom: 'Football', restaurant: 'La Brasserie du Stade', statut: 'terminé', restaurantId: '3', userId: '' },
  { id: '8', equipe1: 'Bayern', equipe2: 'Dortmund', date: '15/11/2024', heure: '18:45', reservees: 32, total: 35, sport: '⚽', sportNom: 'Football', restaurant: 'Chez Michel', statut: 'terminé', restaurantId: '2', userId: '' },
];

const fallbackClients: Client[] = [
  { id: '1', nom: 'Dupont', prenom: 'Jean', match: 'PSG vs OM', date: '15/11/2024', userId: '' },
  { id: '2', nom: 'Martin', prenom: 'Sophie', match: 'France vs Allemagne', date: '18/11/2024', userId: '' },
  { id: '3', nom: 'Bernard', prenom: 'Luc', match: 'Real Madrid vs Barcelona', date: '22/11/2024', userId: '' },
  { id: '4', nom: 'Petit', prenom: 'Marie', match: 'Liverpool vs Manchester', date: '25/11/2024', userId: '' },
  { id: '5', nom: 'Dubois', prenom: 'Pierre', match: 'PSG vs Lyon', date: '28/11/2024', userId: '' },
  { id: '6', nom: 'Thomas', prenom: 'Emma', match: 'Monaco vs Nice', date: '01/12/2024', userId: '' },
  { id: '7', nom: 'Robert', prenom: 'Lucas', match: 'Bayern vs Dortmund', date: '03/12/2024', userId: '' },
  { id: '8', nom: 'Richard', prenom: 'Julie', match: 'PSG vs OM', date: '05/12/2024', userId: '' },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { currentUser, isAuthenticated } = useAuth();
  const [localRestaurants, setLocalRestaurants] = useState<Restaurant[]>([]);
  const [localMatchs, setLocalMatchs] = useState<Match[]>([]);
  const [clients] = useState<Client[]>(fallbackClients);
  const [boostsDisponibles, setBoostsDisponibles] = useState(12);

  // Fetch venues from API
  const { data: venuesData, isLoading: venuesLoading, refetch: refetchVenues } = useQuery({
    queryKey: ['my-venues'],
    queryFn: appApi.getMyVenues,
    enabled: isAuthenticated,
    retry: 1,
    staleTime: 2 * 60 * 1000,
  });

  // Fetch matches from API
  const { data: matchesData, isLoading: matchesLoading } = useQuery({
    queryKey: ['matches'],
    queryFn: appApi.getMatches,
    enabled: isAuthenticated,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  // Create venue mutation
  const createVenueMutation = useMutation({
    mutationFn: appApi.createVenue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-venues'] });
    },
  });

  // Update restaurants when API data changes
  useEffect(() => {
    if (venuesData?.venues && currentUser) {
      const mappedRestaurants = venuesData.venues.map(v => mapVenueToRestaurant(v, currentUser.id));
      setLocalRestaurants(mappedRestaurants);
    } else if (!isAuthenticated || !currentUser) {
      // Use fallback data when not authenticated
      setLocalRestaurants(fallbackRestaurants.map(r => ({ ...r, userId: currentUser?.id || '' })));
    }
  }, [venuesData, currentUser, isAuthenticated]);

  // Update matches when API data changes
  useEffect(() => {
    if (matchesData?.data && currentUser) {
      // Map API matches to frontend format
      const mappedMatches: Match[] = matchesData.data.map((m: ApiMatch) => {
        // Parse scheduled_at for date and time
        let dateStr = '';
        let timeStr = '20:00';
        if (m.scheduled_at) {
          const scheduledDate = new Date(m.scheduled_at);
          dateStr = scheduledDate.toLocaleDateString('fr-FR');
          timeStr = scheduledDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        }
        
        // Get team names from nested relations or direct fields
        const homeTeam = m.homeTeam?.name || m.home_team_name || 'Équipe A';
        const awayTeam = m.awayTeam?.name || m.away_team_name || 'Équipe B';
        
        // Determine status
        const isCompleted = m.status === 'completed';
        
        return {
          id: m.id,
          equipe1: homeTeam,
          equipe2: awayTeam,
          date: dateStr || m.match_date || '',
          heure: timeStr || m.match_time || '20:00',
          reservees: 0, // TODO: Need backend endpoint for venue match reservations
          total: 30, // TODO: Need backend endpoint for venue match capacity
          sport: m.sport_emoji || '⚽',
          sportNom: m.league?.name || m.sport_name || 'Football',
          restaurant: '', // TODO: Need venue info from venue matches
          statut: isCompleted ? 'terminé' : 'à venir',
          restaurantId: '', // TODO: Need venue match data
          userId: currentUser.id,
        };
      });
      setLocalMatchs(mappedMatches.length > 0 ? mappedMatches : fallbackMatchs.map(m => ({ ...m, userId: currentUser.id })));
    } else if (currentUser) {
      setLocalMatchs(fallbackMatchs.map(m => ({ ...m, userId: currentUser.id })));
    }
  }, [matchesData, currentUser]);

  // Combine API data with local state
  const restaurants = localRestaurants;
  const matchs = localMatchs;
  const isLoading = venuesLoading || matchesLoading;

  // Filter functions
  const getUserRestaurants = (userId: string) => restaurants.filter(r => r.userId === userId || r.userId === '');
  const getUserMatchs = (userId: string) => matchs.filter(m => m.userId === userId || m.userId === '');
  const getUserClients = (userId: string) => clients.filter(c => c.userId === userId || c.userId === '');

  const addRestaurant = async (restaurant: Omit<Restaurant, 'id'>) => {
    try {
      await createVenueMutation.mutateAsync({
        name: restaurant.nom,
        street_address: restaurant.adresse.split(',')[0] || restaurant.adresse,
        city: restaurant.adresse.split(',')[1]?.trim().split(' ').slice(1).join(' ') || 'Paris',
        postal_code: restaurant.adresse.split(',')[1]?.trim().split(' ')[0] || '75001',
        country: 'France',
        phone: restaurant.telephone,
        email: restaurant.email,
        capacity: restaurant.capaciteMax,
      });
    } catch (error) {
      console.error('Error creating venue:', error);
      // Fallback to local state
      const newRestaurant: Restaurant = {
        ...restaurant,
        id: `local-${Date.now()}`,
      };
      setLocalRestaurants(prev => [...prev, newRestaurant]);
    }
  };

  const updateRestaurant = (id: string, updatedData: Partial<Restaurant>) => {
    setLocalRestaurants(prev => prev.map(r => r.id === id ? { ...r, ...updatedData } : r));
  };

  const deleteRestaurant = (id: string) => {
    setLocalRestaurants(prev => prev.filter(r => r.id !== id));
  };

  const addMatch = (match: Omit<Match, 'id'>) => {
    const newMatch: Match = {
      ...match,
      id: `local-${Date.now()}`,
    };
    setLocalMatchs(prev => [...prev, newMatch]);
  };

  const updateMatch = (id: string, updatedData: Partial<Match>) => {
    setLocalMatchs(prev => prev.map(m => m.id === id ? { ...m, ...updatedData } : m));
  };

  const deleteMatch = (id: string) => {
    setLocalMatchs(prev => prev.filter(m => m.id !== id));
  };

  const useBoost = () => {
    if (boostsDisponibles > 0) {
      setBoostsDisponibles(prev => prev - 1);
    }
  };

  const addBoosts = (count: number) => {
    setBoostsDisponibles(prev => prev + count);
  };

  return (
    <AppContext.Provider value={{
      restaurants,
      matchs,
      clients,
      boostsDisponibles,
      isLoading,
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
      refetchVenues,
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