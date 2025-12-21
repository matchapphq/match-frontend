import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { partnerService, analyticsService } from '../services';
import type { Venue } from '../services/types';

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
  venueId?: string;
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
  venueMatchId?: string;
  matchId?: string;
}

export interface Client {
  id: string;
  nom: string;
  prenom: string;
  match: string;
  date: string;
}

interface AppContextType {
  restaurants: Restaurant[];
  matchs: Match[];
  clients: Client[];
  boostsDisponibles: number;
  isLoading: boolean;
  error: Error | null;
  addRestaurant: (restaurant: Restaurant) => void;
  updateRestaurant: (id: string, restaurant: Partial<Restaurant>) => void;
  deleteRestaurant: (id: string) => void;
  addMatch: (match: Match) => void;
  updateMatch: (id: string, match: Partial<Match>) => void;
  deleteMatch: (id: string) => void;
  useBoost: () => void;
  addBoosts: (count: number) => void;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to convert API Venue to Restaurant format
function venueToRestaurant(venue: Venue): Restaurant {
  return {
    id: venue.id,
    venueId: venue.id,
    nom: venue.name,
    adresse: `${venue.street_address}, ${venue.postal_code} ${venue.city}`,
    telephone: venue.phone || '',
    email: venue.email || '',
    capaciteMax: venue.capacity || 50,
    note: 4.5, // TODO: Get from reviews API
    totalAvis: 0, // TODO: Get from reviews API
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop',
    horaires: venue.opening_hours ? JSON.stringify(venue.opening_hours) : 'Non renseigné',
    tarif: '30€/mois',
  };
}


export function AppProvider({ children }: { children: ReactNode }) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [matchs, setMatchs] = useState<Match[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [boostsDisponibles, setBoostsDisponibles] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch data from API
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch venues from API
      const response = await partnerService.getMyVenues();
      if (response.venues) {
        const apiRestaurants = response.venues.map(venueToRestaurant);
        setRestaurants(apiRestaurants);
      }
      // TODO: Fetch venue matches and convert to Match format
    } catch (err) {
      console.error('Failed to fetch data from API:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Try to load from API on mount
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addRestaurant = (restaurant: Restaurant) => {
    setRestaurants((prev: Restaurant[]) => [...prev, restaurant]);
  };

  const updateRestaurant = (id: string, updatedData: Partial<Restaurant>) => {
    setRestaurants((prev: Restaurant[]) => prev.map((r: Restaurant) => r.id === id ? { ...r, ...updatedData } : r));
  };

  const deleteRestaurant = (id: string) => {
    setRestaurants((prev: Restaurant[]) => prev.filter((r: Restaurant) => r.id !== id));
  };

  const addMatch = (match: Match) => {
    setMatchs((prev: Match[]) => [...prev, match]);
  };

  const updateMatch = (id: string, updatedData: Partial<Match>) => {
    setMatchs((prev: Match[]) => prev.map((m: Match) => m.id === id ? { ...m, ...updatedData } : m));
  };

  const deleteMatch = (id: string) => {
    setMatchs((prev: Match[]) => prev.filter((m: Match) => m.id !== id));
  };

  const useBoost = () => {
    if (boostsDisponibles > 0) {
      setBoostsDisponibles(boostsDisponibles - 1);
    }
  };

  const addBoosts = (count: number) => {
    setBoostsDisponibles(boostsDisponibles + count);
  };

  return (
    <AppContext.Provider value={{
      restaurants,
      matchs,
      clients,
      boostsDisponibles,
      isLoading,
      error,
      addRestaurant,
      updateRestaurant,
      deleteRestaurant,
      addMatch,
      updateMatch,
      deleteMatch,
      useBoost,
      addBoosts,
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
