/**
 * Boost API Hooks
 * 
 * Hooks for purchasing, activating, and managing boosts
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { boostAPI } from '../../services/api';

// ============================================================================
// BOOST QUERY HOOKS
// ============================================================================

/**
 * Get boost prices for all pack types
 */
export const useBoostPrices = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['boosts', 'prices'],
    queryFn: () => boostAPI.getPrices().then((res) => res.data),
    staleTime: 10 * 60 * 1000, // 10 minutes - prices don't change often
    ...options,
  });
};

/**
 * Get available boosts for current user
 */
export const useAvailableBoosts = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['boosts', 'available'],
    queryFn: () => boostAPI.getAvailable().then((res) => res.data),
    staleTime: 1 * 60 * 1000, // 1 minute
    ...options,
  });
};

/**
 * Get boost stats for current user
 */
export const useBoostStats = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['boosts', 'stats'],
    queryFn: () => boostAPI.getStats().then((res) => res.data),
    staleTime: 1 * 60 * 1000,
    ...options,
  });
};

/**
 * Get boost summary (available count, used count, etc.)
 */
export const useBoostSummary = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['boosts', 'summary'],
    queryFn: () => boostAPI.getSummary().then((res) => res.data),
    staleTime: 1 * 60 * 1000,
    ...options,
  });
};

/**
 * Get boostable matches for a venue
 */
export const useBoostableMatches = (venueId: string, options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['boosts', 'boostable', venueId],
    queryFn: () => boostAPI.getBoostableMatches(venueId).then((res) => res.data),
    enabled: !!venueId,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

/**
 * Get boost purchase history
 */
export const useBoostPurchases = (
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

/**
 * Get boost history (all boosts with their status)
 */
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

/**
 * Get analytics for a specific boost
 */
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

/**
 * Create checkout session for boost purchase
 */
export const useCreateBoostCheckout = (
  options?: UseMutationOptions<
    any,
    Error,
    {
      pack_type: 'single' | 'pack_3' | 'pack_10';
      success_url?: string;
      cancel_url?: string;
    }
  >
) => {
  return useMutation({
    mutationFn: (data: {
      pack_type: 'single' | 'pack_3' | 'pack_10';
      success_url?: string;
      cancel_url?: string;
    }) => boostAPI.createCheckout(data).then((res) => res.data),
    ...options,
  });
};

/**
 * Verify boost purchase after Stripe checkout
 */
export const useVerifyBoostPurchase = (options?: UseMutationOptions<any, Error, string>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) =>
      boostAPI.verifyPurchase(sessionId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boosts', 'available'] });
      queryClient.invalidateQueries({ queryKey: ['boosts', 'summary'] });
      queryClient.invalidateQueries({ queryKey: ['boosts', 'purchases'] });
    },
    ...options,
  });
};

/**
 * Activate a boost on a venue match
 */
export const useActivateBoost = (
  options?: UseMutationOptions<
    any,
    Error,
    {
      boost_id: string;
      venue_match_id: string;
    }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { boost_id: string; venue_match_id: string }) =>
      boostAPI.activateBoost(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boosts', 'available'] });
      queryClient.invalidateQueries({ queryKey: ['boosts', 'summary'] });
      queryClient.invalidateQueries({ queryKey: ['boosts', 'history'] });
      queryClient.invalidateQueries({ queryKey: ['partners', 'venues', 'matches'] });
    },
    ...options,
  });
};

/**
 * Deactivate a boost
 */
export const useDeactivateBoost = (options?: UseMutationOptions<any, Error, string>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (boostId: string) =>
      boostAPI.deactivateBoost(boostId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boosts', 'available'] });
      queryClient.invalidateQueries({ queryKey: ['boosts', 'summary'] });
      queryClient.invalidateQueries({ queryKey: ['boosts', 'history'] });
      queryClient.invalidateQueries({ queryKey: ['partners', 'venues', 'matches'] });
    },
    ...options,
  });
};
