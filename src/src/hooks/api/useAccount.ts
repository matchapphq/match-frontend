import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { API_ENDPOINTS } from '../../utils/api-constants';

// Types
export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
}

export interface NotificationPreferences {
  email_reservations: boolean;
  email_marketing: boolean;
  email_updates: boolean;
  push_reservations: boolean;
  push_marketing: boolean;
  push_updates: boolean;
  sms_reservations: boolean;
}

export interface SubscriptionInfo {
  id: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  plan_name: string;
  plan_type: 'mensuel' | 'annuel';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  amount: number;
  currency: string;
}

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: 'paid' | 'open' | 'draft' | 'void';
  created_at: string;
  paid_at?: string;
  pdf_url?: string;
  description?: string;
}

export interface UpdatePasswordData {
  current_password: string;
  new_password: string;
}

// ==================== Hooks ====================

/**
 * Get current user profile
 */
export function useUserProfile() {
  return useQuery<UserProfile>({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.USERS_ME);
      return response.data;
    },
  });
}

/**
 * Update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation<UserProfile, Error, UpdateProfileData>({
    mutationFn: async (data) => {
      const response = await apiClient.put(API_ENDPOINTS.USERS_ME, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
  });
}

/**
 * Get notification preferences
 */
export function useNotificationPreferences() {
  return useQuery<NotificationPreferences>({
    queryKey: ['notification-preferences'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.USERS_ME_NOTIFICATION_PREFS);
      return response.data;
    },
  });
}

/**
 * Update notification preferences
 */
export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();
  
  return useMutation<NotificationPreferences, Error, Partial<NotificationPreferences>>({
    mutationFn: async (data) => {
      const response = await apiClient.put(API_ENDPOINTS.USERS_ME_NOTIFICATION_PREFS, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-preferences'] });
    },
  });
}

/**
 * Get current subscription info
 */
export function useSubscription() {
  return useQuery<SubscriptionInfo>({
    queryKey: ['subscription'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.SUBSCRIPTIONS_ME);
      return response.data;
    },
  });
}

/**
 * Get invoices/billing history
 */
export function useInvoices() {
  return useQuery<Invoice[]>({
    queryKey: ['invoices'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.SUBSCRIPTIONS_INVOICES);
      return response.data.invoices || response.data;
    },
  });
}

/**
 * Get Stripe payment portal URL
 */
export function usePaymentPortal() {
  return useMutation<{ url: string }, Error, void>({
    mutationFn: async () => {
      const response = await apiClient.post(API_ENDPOINTS.SUBSCRIPTIONS_UPDATE_PAYMENT);
      return response.data;
    },
  });
}

/**
 * Update password
 */
export function useUpdatePassword() {
  return useMutation<{ success: boolean }, Error, UpdatePasswordData>({
    mutationFn: async (data) => {
      const response = await apiClient.put('/auth/update-password', data);
      return response.data;
    },
  });
}

/**
 * Cancel subscription
 */
export function useCancelSubscription() {
  const queryClient = useQueryClient();
  
  return useMutation<{ success: boolean }, Error, void>({
    mutationFn: async () => {
      const response = await apiClient.post(API_ENDPOINTS.SUBSCRIPTIONS_CANCEL);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
    },
  });
}
