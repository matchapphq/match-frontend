/**
 * Reviews, Notifications, Subscriptions, and Other API Hooks
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { reviewsAPI, notificationsAPI, subscriptionsAPI, sportsAPI, analyticsAPI } from '../../services/api';

// ============================================================================
// REVIEWS HOOKS
// ============================================================================

export const useCreateReview = (
  options?: UseMutationOptions<
    any,
    Error,
    {
      venueId: string;
      data: {
        rating: number;
        title: string;
        content: string;
        atmosphere_rating?: number;
        food_rating?: number;
        service_rating?: number;
        value_rating?: number;
      };
    }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ venueId, data }: any) =>
      reviewsAPI.create(venueId, data).then((res) => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['venues', variables.venueId, 'reviews'] });
    },
    ...options,
  });
};

export const useUpdateReview = (
  options?: UseMutationOptions<
    any,
    Error,
    {
      reviewId: string;
      data: any;
    }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: string; data: any }) =>
      reviewsAPI.update(reviewId, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    ...options,
  });
};

export const useDeleteReview = (options?: UseMutationOptions<any, Error, string>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => reviewsAPI.delete(reviewId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    ...options,
  });
};

export const useMarkReviewHelpful = (
  options?: UseMutationOptions<
    any,
    Error,
    {
      reviewId: string;
      isHelpful: boolean;
    }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, isHelpful }: { reviewId: string; isHelpful: boolean }) =>
      reviewsAPI.markHelpful(reviewId, isHelpful).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
    ...options,
  });
};

// ============================================================================
// NOTIFICATIONS HOOKS
// ============================================================================

export const useNotifications = (
  params?: {
    is_read?: boolean;
    type?: string;
    limit?: number;
    offset?: number;
  },
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationsAPI.getAll(params).then((res) => res.data),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
    ...options,
  });
};

export const useMarkNotificationAsRead = (options?: UseMutationOptions<any, Error, string>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationsAPI.markAsRead(notificationId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    ...options,
  });
};

export const useMarkAllNotificationsAsRead = (options?: UseMutationOptions<any, Error, void>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsAPI.markAllAsRead().then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    ...options,
  });
};

export const useDeleteNotification = (options?: UseMutationOptions<any, Error, string>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationsAPI.delete(notificationId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    ...options,
  });
};

// ============================================================================
// SUBSCRIPTIONS HOOKS (Venue Owners)
// ============================================================================

export const useSubscriptionPlans = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['subscriptions', 'plans'],
    queryFn: () => subscriptionsAPI.getPlans().then((res) => res.data),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

export const useCreateCheckout = (
  options?: UseMutationOptions<
    any,
    Error,
    {
      plan: 'basic' | 'pro' | 'enterprise';
      billing_period?: 'monthly' | 'yearly';
    }
  >
) => {
  return useMutation({
    mutationFn: (data: { plan: 'basic' | 'pro' | 'enterprise'; billing_period?: 'monthly' | 'yearly' }) =>
      subscriptionsAPI.createCheckout(data).then((res) => res.data),
    ...options,
  });
};

export const useMySubscription = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['subscriptions', 'me'],
    queryFn: () => subscriptionsAPI.getMySubscription().then((res) => res.data),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useUpdatePaymentMethod = (options?: UseMutationOptions<any, Error, string>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (stripePaymentMethodId: string) =>
      subscriptionsAPI.updatePaymentMethod(stripePaymentMethodId).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions', 'me'] });
    },
    ...options,
  });
};

export const useCancelSubscription = (options?: UseMutationOptions<any, Error, void>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => subscriptionsAPI.cancel().then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions', 'me'] });
    },
    ...options,
  });
};

export const useUpgradeSubscription = (
  options?: UseMutationOptions<any, Error, 'basic' | 'pro' | 'enterprise'>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (plan: 'basic' | 'pro' | 'enterprise') =>
      subscriptionsAPI.upgrade(plan).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions', 'me'] });
    },
    ...options,
  });
};

// ============================================================================
// SPORTS HOOKS
// ============================================================================

export const useSports = (
  params?: { limit?: number; offset?: number },
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['sports', params],
    queryFn: () => sportsAPI.getAll(params).then((res) => res.data),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

export const useSport = (sportId: string, options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['sports', sportId],
    queryFn: () => sportsAPI.getById(sportId).then((res) => res.data),
    enabled: !!sportId,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

export const useLeagues = (sportId: string, options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['sports', sportId, 'leagues'],
    queryFn: () => sportsAPI.getLeagues(sportId).then((res) => res.data),
    enabled: !!sportId,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

// ============================================================================
// ANALYTICS HOOKS (Venue Owners)
// ============================================================================

export const useVenueAnalyticsOverview = (
  venueId: string,
  params?: { from?: string; to?: string },
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['analytics', venueId, 'overview', params],
    queryFn: () => analyticsAPI.getOverview(venueId, params).then((res) => res.data),
    enabled: !!venueId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useVenueAnalyticsReservations = (
  venueId: string,
  params?: { from?: string; to?: string; group_by?: string },
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['analytics', venueId, 'reservations', params],
    queryFn: () => analyticsAPI.getReservations(venueId, params).then((res) => res.data),
    enabled: !!venueId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const useVenueAnalyticsRevenue = (
  venueId: string,
  params?: { from?: string; to?: string },
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['analytics', venueId, 'revenue', params],
    queryFn: () => analyticsAPI.getRevenue(venueId, params).then((res) => res.data),
    enabled: !!venueId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};
