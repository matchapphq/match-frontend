import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { API_ENDPOINTS } from '../../utils/api-constants';

// Types
export interface BoostSummary {
  available_boosts: number;
  total_boosts_used: number;
  active_boosts: number;
  total_views_generated: number;
  total_reservations_generated: number;
}

export interface BoostPack {
  id: string;
  name: string;
  quantity: number;
  price: number;
  unit_price: number;
  discount_percent: number;
  currency: string;
  is_popular?: boolean;
  badge?: string;
}

export interface BoostHistory {
  id: string;
  venue_match_id: string;
  activated_at: string;
  expires_at: string;
  status: 'active' | 'expired' | 'used';
  views_generated: number;
  reservations_generated: number;
  match?: {
    id: string;
    home_team: string;
    away_team: string;
    scheduled_at: string;
  };
}

export interface BoostableMatch {
  venue_match_id: string;
  match_id: string;
  home_team: string;
  away_team: string;
  scheduled_at: string;
  is_boosted: boolean;
  can_boost: boolean;
}

// Hook to fetch boost summary (available boosts, stats)
export function useBoostSummary() {
  return useQuery({
    queryKey: ['boost-summary'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.BOOSTS_SUMMARY);
      return response.data as BoostSummary;
    },
  });
}

// Hook to fetch available boost count
export function useAvailableBoosts() {
  return useQuery({
    queryKey: ['available-boosts'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.BOOSTS_AVAILABLE);
      return response.data;
    },
  });
}

// Hook to fetch boost prices/packs
export function useBoostPrices() {
  return useQuery({
    queryKey: ['boost-prices'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.BOOSTS_PRICES);
      return response.data.packs || response.data as BoostPack[];
    },
  });
}

// Hook to fetch boost history
export function useBoostHistory() {
  return useQuery({
    queryKey: ['boost-history'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.BOOSTS_HISTORY);
      return response.data.boosts || response.data as BoostHistory[];
    },
  });
}

// Hook to fetch boostable matches for a venue
export function useBoostableMatches(venueId: string | null) {
  return useQuery({
    queryKey: ['boostable-matches', venueId],
    queryFn: async () => {
      if (!venueId) return [];
      const response = await apiClient.get(API_ENDPOINTS.BOOSTS_BOOSTABLE(venueId));
      return response.data.matches || response.data as BoostableMatch[];
    },
    enabled: !!venueId,
  });
}

// Hook to activate a boost on a match
export function useActivateBoost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ venueMatchId }: { venueMatchId: string }) => {
      const response = await apiClient.post(API_ENDPOINTS.BOOSTS_ACTIVATE, {
        venue_match_id: venueMatchId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boost-summary'] });
      queryClient.invalidateQueries({ queryKey: ['available-boosts'] });
      queryClient.invalidateQueries({ queryKey: ['boost-history'] });
      queryClient.invalidateQueries({ queryKey: ['boostable-matches'] });
      queryClient.invalidateQueries({ queryKey: ['partner-matches'] });
    },
  });
}

// Hook to deactivate a boost
export function useDeactivateBoost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ boostId }: { boostId: string }) => {
      const response = await apiClient.post(API_ENDPOINTS.BOOSTS_DEACTIVATE, {
        boost_id: boostId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boost-summary'] });
      queryClient.invalidateQueries({ queryKey: ['boost-history'] });
      queryClient.invalidateQueries({ queryKey: ['partner-matches'] });
    },
  });
}

// Hook to create boost checkout session
export function useBoostCheckout() {
  return useMutation({
    mutationFn: async ({ packType, quantity, amount }: { 
      packType: string; 
      quantity: number; 
      amount: number;
    }) => {
      const response = await apiClient.post(API_ENDPOINTS.BOOSTS_CHECKOUT, {
        pack_type: packType,
        quantity,
        amount,
      });
      return response.data;
    },
  });
}

// Hook to verify boost purchase
export function useVerifyBoostPurchase() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ sessionId }: { sessionId: string }) => {
      const response = await apiClient.post(API_ENDPOINTS.BOOSTS_VERIFY, {
        session_id: sessionId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boost-summary'] });
      queryClient.invalidateQueries({ queryKey: ['available-boosts'] });
    },
  });
}
