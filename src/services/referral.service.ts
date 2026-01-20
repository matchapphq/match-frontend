/**
 * Referral Service
 * 
 * API calls related to referral/parrainage system
 * Used in: Parrainage, ReferralPage
 */

import { API_ENDPOINTS } from '../utils/api-constants';
import { apiGet, apiPost } from '../utils/api-helpers';

// ==================== Types ====================

export interface ReferralCode {
  code: string;
  total_referrals: number;
  successful_conversions: number;
  pending_conversions: number;
  total_boosts_earned: number;
  created_at: string;
}

export interface ReferralStats {
  total_invites: number;
  pending_conversions: number;
  successful_conversions: number;
  total_boosts_earned: number;
  available_boosts: number;
  used_boosts: number;
  conversion_rate: number;
}

export interface ReferralHistory {
  id: string;
  referred_user_email: string;
  referred_user_name?: string;
  status: 'PENDING' | 'CONVERTED' | 'EXPIRED';
  boosts_earned: number;
  invited_at: string;
  converted_at?: string;
}

export interface ReferralBoost {
  id: string;
  source: 'REFERRAL' | 'PROMOTION' | 'REWARD';
  amount: number;
  used: boolean;
  used_at?: string;
  expires_at?: string;
  created_at: string;
}

// ==================== Referral Code ====================

/**
 * Get current user's referral code
 */
export async function getMyReferralCode(authToken: string): Promise<ReferralCode> {
  return apiGet<ReferralCode>(API_ENDPOINTS.REFERRAL_CODE, undefined, authToken);
}

/**
 * Validate a referral code
 */
export async function validateReferralCode(code: string, authToken?: string): Promise<{
  valid: boolean;
  message: string;
  referrer_name?: string;
}> {
  return apiPost<{
    valid: boolean;
    message: string;
    referrer_name?: string;
  }>(API_ENDPOINTS.REFERRAL_VALIDATE, { code }, authToken);
}

// ==================== Referral Stats ====================

/**
 * Get referral statistics
 */
export async function getReferralStats(authToken: string): Promise<ReferralStats> {
  return apiGet<ReferralStats>(API_ENDPOINTS.REFERRAL_STATS, undefined, authToken);
}

/**
 * Get referral history
 */
export async function getReferralHistory(params?: {
  status?: 'PENDING' | 'CONVERTED' | 'EXPIRED';
  limit?: number;
  offset?: number;
}, authToken?: string): Promise<ReferralHistory[]> {
  return apiGet<ReferralHistory[]>(API_ENDPOINTS.REFERRAL_HISTORY, params, authToken);
}

// ==================== Referral Registration ====================

/**
 * Register with a referral code (during signup)
 */
export async function registerWithReferral(data: {
  email: string;
  password: string;
  name: string;
  referral_code: string;
}, authToken?: string): Promise<{
  success: boolean;
  user_id: string;
  message: string;
}> {
  return apiPost<{
    success: boolean;
    user_id: string;
    message: string;
  }>(API_ENDPOINTS.REFERRAL_REGISTER, data, authToken);
}

/**
 * Convert a referral (when referred user completes action)
 */
export async function convertReferral(data: {
  referred_user_id: string;
}, authToken: string): Promise<{
  success: boolean;
  boosts_awarded: number;
  message: string;
}> {
  return apiPost<{
    success: boolean;
    boosts_awarded: number;
    message: string;
  }>(API_ENDPOINTS.REFERRAL_CONVERT, data, authToken);
}

// ==================== Referral Boosts ====================

/**
 * Get referral boosts (earned from referrals)
 */
export async function getReferralBoosts(authToken: string): Promise<ReferralBoost[]> {
  return apiGet<ReferralBoost[]>(API_ENDPOINTS.REFERRAL_BOOSTS, undefined, authToken);
}

/**
 * Use a referral boost
 */
export async function useReferralBoost(boostId: string, data: {
  venue_match_id: string;
}, authToken: string): Promise<{
  success: boolean;
  message: string;
  boost_expires_at: string;
}> {
  return apiPost<{
    success: boolean;
    message: string;
    boost_expires_at: string;
  }>(API_ENDPOINTS.REFERRAL_BOOST_USE(boostId), data, authToken);
}
