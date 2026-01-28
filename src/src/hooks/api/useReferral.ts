import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { API_ENDPOINTS } from '../../utils/api-constants';

// Types
export interface ReferralCode {
  referral_code: string;
  referral_link: string;
  created_at?: string;
}

export interface ReferralStats {
  total_invited: number;
  total_signed_up: number;
  total_converted: number;
  total_rewards_earned: number;
  pending_referrals: number;
}

export interface ReferredUser {
  id: string;
  name: string;
  status: 'signed_up' | 'converted';
  created_at: string;
  converted_at?: string;
}

export interface ReferralHistory {
  referred_users: ReferredUser[];
  total: number;
  page: number;
  limit: number;
}

export interface ValidateCodeResponse {
  valid: boolean;
  referrer_name?: string;
  message?: string;
}

// ==================== Hooks ====================

/**
 * Get the current user's referral code
 */
export function useReferralCode() {
  return useQuery<ReferralCode>({
    queryKey: ['referral-code'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.REFERRAL_CODE);
      return response.data;
    },
  });
}

/**
 * Get referral statistics
 */
export function useReferralStats() {
  return useQuery<ReferralStats>({
    queryKey: ['referral-stats'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.REFERRAL_STATS);
      return response.data;
    },
  });
}

/**
 * Get referral history with optional filtering
 */
export function useReferralHistory(options?: { status?: string; page?: number; limit?: number }) {
  const { status = 'all', page = 1, limit = 20 } = options || {};
  
  return useQuery<ReferralHistory>({
    queryKey: ['referral-history', status, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status !== 'all') params.append('status', status);
      params.append('page', String(page));
      params.append('limit', String(limit));
      
      const response = await apiClient.get(`${API_ENDPOINTS.REFERRAL_HISTORY}?${params.toString()}`);
      return response.data;
    },
  });
}

/**
 * Validate a referral code (for signup flow)
 */
export function useValidateReferralCode() {
  return useMutation<ValidateCodeResponse, Error, string>({
    mutationFn: async (referralCode: string) => {
      const response = await apiClient.post(API_ENDPOINTS.REFERRAL_VALIDATE, {
        referral_code: referralCode,
      });
      return response.data;
    },
  });
}

/**
 * Register a referral when user signs up with a code
 */
export function useRegisterReferral() {
  return useMutation<{ success: boolean; referral_id?: string }, Error, { referral_code: string; referred_user_id: string }>({
    mutationFn: async ({ referral_code, referred_user_id }) => {
      const response = await apiClient.post(API_ENDPOINTS.REFERRAL_REGISTER, {
        referral_code,
        referred_user_id,
      });
      return response.data;
    },
  });
}
