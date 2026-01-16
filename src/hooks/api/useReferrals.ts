/**
 * Referrals (Parrainage) API Hooks
 * 
 * Système de parrainage:
 * - 1 parrainage = 1 boost
 * - Noms anonymisés (ex: "Marc D.")
 * - Code format: MATCH-RESTO-ABC123 ou MATCH-USER-XYZ789
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { referralsAPI } from '../../services/api';

// ============================================================================
// REFERRALS QUERY HOOKS
// ============================================================================

/**
 * Get user's referral code and link
 */
export const useMyReferralCode = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['referrals', 'my-code'],
    queryFn: () => referralsAPI.getMyCode().then((res) => res.data),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

/**
 * Get referral statistics
 */
export const useReferralStats = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['referrals', 'stats'],
    queryFn: () => referralsAPI.getStats().then((res) => res.data),
    staleTime: 1 * 60 * 1000, // 1 minute
    ...options,
  });
};

/**
 * Get referral history (referred users)
 */
export const useReferralHistory = (
  params?: { limit?: number; offset?: number; status?: string },
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['referrals', 'history', params],
    queryFn: () => referralsAPI.getHistory(params).then((res) => res.data),
    staleTime: 1 * 60 * 1000,
    ...options,
  });
};

// ============================================================================
// REFERRALS MUTATION HOOKS
// ============================================================================

/**
 * Validate a referral code
 * Used during signup to check if code is valid
 */
export const useValidateReferralCode = (options?: UseMutationOptions<any, Error, string>) => {
  return useMutation({
    mutationFn: (code: string) => referralsAPI.validate(code).then((res) => res.data),
    ...options,
  });
};

/**
 * Claim a referral reward
 */
export const useClaimReferralReward = (options?: UseMutationOptions<any, Error, string>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (referralId: string) => referralsAPI.claimReward(referralId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referrals', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['referrals', 'history'] });
    },
    ...options,
  });
};
