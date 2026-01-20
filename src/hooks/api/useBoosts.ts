/**
 * Boosts API Hooks
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { boostsAPI } from '../../services/api';

// ============================================================================
// BOOSTS HOOKS
// ============================================================================

export const useBoostPrices = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['boosts', 'prices'],
    queryFn: () => boostsAPI.getPrices().then((res) => res.data),
    staleTime: 60 * 60 * 1000, // 1 hour
    ...options,
  });
};

export const useAvailableBoosts = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['boosts', 'available'],
    queryFn: () => boostsAPI.getAvailable().then((res) => res.data),
    staleTime: 1 * 60 * 1000,
    ...options,
  });
};

export const useBoostStats = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['boosts', 'stats'],
    queryFn: () => boostsAPI.getStats().then((res) => res.data),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

export const useBoostSummary = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['boosts', 'summary'],
    queryFn: () => boostsAPI.getSummary().then((res) => res.data),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

export const useBoostableMatches = (venueId: string, options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['boosts', 'boostable', venueId],
    queryFn: () => boostsAPI.getBoostableMatches(venueId).then((res) => res.data),
    enabled: !!venueId,
    staleTime: 1 * 60 * 1000,
    ...options,
  });
};

export const useBoostHistory = (
  params?: { page?: number; limit?: number; status?: string },
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['boosts', 'history', params],
    queryFn: () => boostsAPI.getHistory(params).then((res) => res.data),
    staleTime: 1 * 60 * 1000,
    ...options,
  });
};

export const useBoostPurchases = (
  params?: { page?: number; limit?: number },
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['boosts', 'purchases', params],
    queryFn: () => boostsAPI.getPurchases(params).then((res) => res.data),
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

export const useBoostAnalytics = (boostId: string, options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['boosts', 'analytics', boostId],
    queryFn: () => boostsAPI.getAnalytics(boostId).then((res) => res.data),
    enabled: !!boostId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useCreateBoostCheckout = (options?: UseMutationOptions<any, Error, any>) => {
  return useMutation({
    mutationFn: (data: {
      pack_type: 'single' | 'pack_3' | 'pack_10';
      success_url?: string;
      cancel_url?: string;
    }) => boostsAPI.createCheckout(data).then((res) => res.data),
    ...options,
  });
};

export const useVerifyBoostPurchase = (options?: UseMutationOptions<any, Error, string>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) =>
      boostsAPI.verifyPurchase(sessionId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boosts'] });
    },
    ...options,
  });
};

export const useActivateBoost = (options?: UseMutationOptions<any, Error, any>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { boost_id: string; venue_match_id: string }) =>
      boostsAPI.activate(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boosts'] });
    },
    ...options,
  });
};

export const useDeactivateBoost = (options?: UseMutationOptions<any, Error, string>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (boostId: string) => boostsAPI.deactivate(boostId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boosts'] });
    },
    ...options,
  });
};
