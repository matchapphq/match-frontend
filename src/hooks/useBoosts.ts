/**
 * Boosts Hook
 * 
 * Custom hooks for boost-related API calls
 */

import { useApiCall, useApiMutation, getAuthToken } from './useApi';
import * as BoostsService from '../services/boosts.service';
import type { BoostPrice, BoostSummary, BoostHistory, BoostableMatch } from '../services/boosts.service';

// ==================== Get Boosts ====================

export function useBoostPrices() {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => BoostsService.getBoostPrices(authToken),
    [authToken]
  );
}

export function useBoostSummary() {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => BoostsService.getBoostSummary(authToken),
    [authToken]
  );
}

export function useAvailableBoosts() {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => BoostsService.getAvailableBoosts(authToken),
    [authToken]
  );
}

export function useBoostStats() {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => BoostsService.getBoostStats(authToken),
    [authToken]
  );
}

export function useBoostHistory(params?: {
  status?: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}) {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => BoostsService.getBoostHistory(params, authToken),
    [JSON.stringify(params), authToken]
  );
}

export function useBoostAnalytics(boostId: string) {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => BoostsService.getBoostAnalytics(boostId, authToken),
    [boostId, authToken],
    { immediate: !!boostId }
  );
}

export function useBoostableMatches(venueId: string) {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => BoostsService.getBoostableMatches(venueId, authToken),
    [venueId, authToken]
  );
}

// ==================== Mutations ====================

export function useCreateBoostCheckout() {
  const authToken = getAuthToken();
  
  return useApiMutation<
    { checkout_url: string; session_id: string },
    {
      pack_type: 'single' | 'pack_3' | 'pack_10';
      quantity: number;
      amount: number;
    }
  >(
    (data) => BoostsService.createBoostCheckout(data, authToken)
  );
}

export function useVerifyBoostPurchase() {
  const authToken = getAuthToken();
  
  return useApiMutation<
    { success: boolean; boosts_added: number; message: string },
    string
  >(
    (sessionId) => BoostsService.verifyBoostPurchase(sessionId, authToken)
  );
}

export function useActivateBoost() {
  const authToken = getAuthToken();
  
  return useApiMutation<
    {
      success: boolean;
      boost_id: string;
      expires_at: string;
      remaining_boosts: number;
    },
    {
      venue_match_id: string;
      duration_hours?: number;
    }
  >(
    (data) => BoostsService.activateBoost(data, authToken)
  );
}

export function useDeactivateBoost() {
  const authToken = getAuthToken();
  
  return useApiMutation<
    {
      success: boolean;
      message: string;
      remaining_boosts: number;
    },
    {
      boost_id: string;
      refund?: boolean;
    }
  >(
    (data) => BoostsService.deactivateBoost(data, authToken)
  );
}
