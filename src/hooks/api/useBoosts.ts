/**
 * Boost API Hooks
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { boostAPI } from '../../services/api';

// ============================================================================
// BOOST QUERY HOOKS
// ============================================================================

export const useBoostPrices = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['boosts', 'prices'],
    queryFn: () => boostAPI.getPrices().then((res) => res.data),
    staleTime: 10 * 60 * 1000, // 10 min cache for static prices
    ...options,
  });
};

export const useAvailableBoosts = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['boosts', 'available'],
    queryFn: () => boostAPI.getAvailable().then((res) => res.data),
    staleTime: 1 * 60 * 1000,
    ...options,
  });
};

export const useBoostStats = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['boosts', 'stats'],
    queryFn: () => boostAPI.getStats().then((res) => res.data),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

export const useBoostSummary = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['boosts', 'summary'],
    queryFn: () => boostAPI.getSummary().then((res) => res.data),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

export const useBoostableMatches = (venueId: string, options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['boosts', 'boostable', venueId],
    queryFn: () => boostAPI.getBoostableMatches(venueId).then((res) => res.data),
    enabled: !!venueId,
    staleTime: 1 * 60 * 1000,
    ...options,
  });
};

export const useBoostPurchaseHistory = (
  params?: { page?: number; limit?: number },
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['boosts', 'purchases', params],
    queryFn: () => boostAPI.getPurchaseHistory(params).then((res) => res.data),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

export const useBoostHistory = (
  params?: { page?: number; limit?: number; status?: string },
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['boosts', 'history', params],
    queryFn: () => boostAPI.getHistory(params).then((res) => res.data),
    staleTime: 1 * 60 * 1000,
    ...options,
  });
};

export const useBoostAnalytics = (boostId: string, options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['boosts', 'analytics', boostId],
    queryFn: () => boostAPI.getAnalytics(boostId).then((res) => res.data),
    enabled: !!boostId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// ============================================================================
// BOOST MUTATION HOOKS
// ============================================================================

export const useCreateBoostCheckout = (
  options?: UseMutationOptions<any, Error, { pack_type: 'single' | 'pack_3' | 'pack_10'; success_url?: string; cancel_url?: string }>
) => {
  return useMutation({
    mutationFn: (data) => boostAPI.createCheckout(data).then((res) => res.data),
    ...options,
  });
};

export const useVerifyBoostPurchase = (options?: UseMutationOptions<any, Error, string>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => boostAPI.verifyPurchase(sessionId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boosts', 'available'] });
      queryClient.invalidateQueries({ queryKey: ['boosts', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['boosts', 'purchases'] });
    },
    ...options,
  });
};

export const useActivateBoost = (
  options?: UseMutationOptions<any, Error, { boost_id: string; venue_match_id: string }>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => boostAPI.activateBoost(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boosts', 'available'] });
      queryClient.invalidateQueries({ queryKey: ['boosts', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['boosts', 'history'] });
      queryClient.invalidateQueries({ queryKey: ['partners', 'venues', 'matches'] });
    },
    ...options,
  });
};

export const useDeactivateBoost = (options?: UseMutationOptions<any, Error, string>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (boostId: string) => boostAPI.deactivateBoost(boostId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boosts', 'available'] });
      queryClient.invalidateQueries({ queryKey: ['boosts', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['boosts', 'history'] });
    },
    ...options,
  });
};
