/**
 * Boosts Service
 * 
 * API calls related to boosts management
 * Used in: Booster, AcheterBoosts
 */

import { API_ENDPOINTS } from '../utils/api-constants';
import { apiGet, apiPost } from '../utils/api-helpers';

// ==================== Types ====================

export interface BoostPrice {
  pack_type: 'single' | 'pack_3' | 'pack_10';
  quantity: number;
  unit_price: number;
  total_price: number;
  discount_percentage?: number;
}

export interface BoostSummary {
  available_boosts: number;
  active_boosts: number;
  total_purchased: number;
  total_spent: number;
}

export interface BoostStats {
  boost_id: string;
  venue_match_id: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number; // Click-through rate
  conversion_rate: number;
  started_at: string;
  expires_at: string;
}

export interface ActiveBoost {
  id: string;
  venue_match_id: string;
  venue_name: string;
  match_date: string;
  match_teams: string;
  started_at: string;
  expires_at: string;
  impressions: number;
  clicks: number;
  conversions: number;
}

export interface BoostPurchase {
  id: string;
  pack_type: 'single' | 'pack_3' | 'pack_10';
  quantity: number;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  stripe_session_id?: string;
  created_at: string;
}

export interface BoostHistory {
  id: string;
  venue_match_id: string;
  venue_name: string;
  match_teams: string;
  match_date: string;
  started_at: string;
  expires_at: string;
  impressions: number;
  clicks: number;
  conversions: number;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
}

export interface BoostableMatch {
  venue_match_id: string;
  match_id: string;
  match_date: string;
  match_time: string;
  home_team: string;
  away_team: string;
  venue_name: string;
  can_boost: boolean;
  boost_active: boolean;
  reason?: string;
}

// ==================== Boost Prices ====================

/**
 * Get boost prices
 */
export async function getBoostPrices(authToken?: string): Promise<BoostPrice[]> {
  return apiGet<BoostPrice[]>(API_ENDPOINTS.BOOSTS_PRICES, undefined, authToken);
}

// ==================== Boost Summary ====================

/**
 * Get boost summary (available, active, etc.)
 */
export async function getBoostSummary(authToken: string): Promise<BoostSummary> {
  return apiGet<BoostSummary>(API_ENDPOINTS.BOOSTS_SUMMARY, undefined, authToken);
}

/**
 * Get available boosts count
 */
export async function getAvailableBoosts(authToken: string): Promise<{ available_boosts: number }> {
  return apiGet<{ available_boosts: number }>(API_ENDPOINTS.BOOSTS_AVAILABLE, undefined, authToken);
}

/**
 * Get boost statistics
 */
export async function getBoostStats(authToken: string): Promise<BoostStats[]> {
  return apiGet<BoostStats[]>(API_ENDPOINTS.BOOSTS_STATS, undefined, authToken);
}

// ==================== Purchase Boosts ====================

/**
 * Create Stripe checkout session for boost purchase
 */
export async function createBoostCheckout(data: {
  pack_type: 'single' | 'pack_3' | 'pack_10';
  quantity: number;
  amount: number;
}, authToken: string): Promise<{ checkout_url: string; session_id: string }> {
  return apiPost<{ checkout_url: string; session_id: string }>(
    API_ENDPOINTS.BOOSTS_CHECKOUT,
    data,
    authToken
  );
}

/**
 * Verify boost purchase after Stripe redirect
 */
export async function verifyBoostPurchase(sessionId: string, authToken: string): Promise<{
  success: boolean;
  boosts_added: number;
  message: string;
}> {
  return apiPost<{ success: boolean; boosts_added: number; message: string }>(
    API_ENDPOINTS.BOOSTS_VERIFY,
    { session_id: sessionId },
    authToken
  );
}

/**
 * Get boost purchase history
 */
export async function getBoostPurchases(params?: {
  limit?: number;
  offset?: number;
}, authToken?: string): Promise<BoostPurchase[]> {
  return apiGet<BoostPurchase[]>(API_ENDPOINTS.BOOSTS_PURCHASES, params, authToken);
}

// ==================== Activate/Deactivate Boosts ====================

/**
 * Activate a boost for a venue match
 */
export async function activateBoost(data: {
  venue_match_id: string;
  duration_hours?: number; // default 24h
}, authToken: string): Promise<{
  success: boolean;
  boost_id: string;
  expires_at: string;
  remaining_boosts: number;
}> {
  return apiPost<{
    success: boolean;
    boost_id: string;
    expires_at: string;
    remaining_boosts: number;
  }>(API_ENDPOINTS.BOOSTS_ACTIVATE, data, authToken);
}

/**
 * Deactivate an active boost
 */
export async function deactivateBoost(data: {
  boost_id: string;
  refund?: boolean; // Refund boost to available pool
}, authToken: string): Promise<{
  success: boolean;
  message: string;
  remaining_boosts: number;
}> {
  return apiPost<{
    success: boolean;
    message: string;
    remaining_boosts: number;
  }>(API_ENDPOINTS.BOOSTS_DEACTIVATE, data, authToken);
}

// ==================== Boost History & Analytics ====================

/**
 * Get boost history
 */
export async function getBoostHistory(params?: {
  status?: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}, authToken?: string): Promise<BoostHistory[]> {
  return apiGet<BoostHistory[]>(API_ENDPOINTS.BOOSTS_HISTORY, params, authToken);
}

/**
 * Get analytics for a specific boost
 */
export async function getBoostAnalytics(boostId: string, authToken: string): Promise<BoostStats> {
  return apiGet<BoostStats>(API_ENDPOINTS.BOOSTS_ANALYTICS(boostId), undefined, authToken);
}

// ==================== Boostable Matches ====================

/**
 * Get matches that can be boosted for a venue
 */
export async function getBoostableMatches(venueId: string, authToken: string): Promise<BoostableMatch[]> {
  return apiGet<BoostableMatch[]>(API_ENDPOINTS.BOOSTS_BOOSTABLE(venueId), undefined, authToken);
}
