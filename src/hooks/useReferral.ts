/**
 * Referral Hook
 * 
 * Custom hooks for referral/parrainage API calls
 */

import { useApiCall, useApiMutation, getAuthToken } from './useApi';
import * as ReferralService from '../services/referral.service';
import type { ReferralCode, ReferralStats, ReferralHistory, ReferralBoost } from '../services/referral.service';

// ==================== Get Referral Data ====================

export function useMyReferralCode() {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => ReferralService.getMyReferralCode(authToken),
    [authToken]
  );
}

export function useReferralStats() {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => ReferralService.getReferralStats(authToken),
    [authToken]
  );
}

export function useReferralHistory(params?: {
  status?: 'PENDING' | 'CONVERTED' | 'EXPIRED';
  limit?: number;
  offset?: number;
}) {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => ReferralService.getReferralHistory(params, authToken),
    [JSON.stringify(params), authToken]
  );
}

export function useReferralBoosts() {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => ReferralService.getReferralBoosts(authToken),
    [authToken]
  );
}

// ==================== Mutations ====================

export function useValidateReferralCode() {
  const authToken = getAuthToken();
  
  return useApiMutation<
    {
      valid: boolean;
      message: string;
      referrer_name?: string;
    },
    string
  >(
    (code) => ReferralService.validateReferralCode(code, authToken)
  );
}

export function useUseReferralBoost() {
  const authToken = getAuthToken();
  
  return useApiMutation<
    {
      success: boolean;
      message: string;
      boost_expires_at: string;
    },
    {
      boostId: string;
      venue_match_id: string;
    }
  >(
    ({ boostId, venue_match_id }) => ReferralService.useReferralBoost(boostId, { venue_match_id }, authToken)
  );
}
