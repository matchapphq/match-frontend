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
  avatar?: string;
  avatar_url?: string;
  role: string;
  has_payment_method?: boolean;
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
  email_modifications: boolean;
  email_cancellations: boolean;
  email_match_reminders: boolean;
  push_reservations: boolean;
  push_updates: boolean;
  sms_new_reservations: boolean;
  sms_cancellations: boolean;
}

export interface PrivacyPreferences {
  analytics_consent: boolean;
  marketing_consent: boolean;
  legal_updates_email: boolean;
  account_deletion_grace_days: number;
}

export interface Invoice {
  id: string;
  invoice_number?: string;
  number?: string;
  subscription_id?: string;
  stripe_subscription_id?: string | null;
  amount?: number | string;
  subtotal?: number | string;
  tax?: number | string;
  total?: number | string;
  currency?: string;
  venue_id?: string;
  status: 'paid' | 'open' | 'draft' | 'void' | 'pending' | 'overdue' | 'canceled';
  issue_date?: string;
  due_date?: string;
  created_at: string;
  paid_at?: string;
  paid_date?: string;
  pdf_url?: string;
  description?: string;
}

export interface UpdatePasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface UserSession {
  id: string;
  device: string;
  location?: {
    city?: string | null;
    region?: string | null;
    country?: string | null;
  };
  created_at: string;
  updated_at: string;
  is_current: boolean;
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
      return response.data?.user ?? response.data;
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
 * Get privacy preferences
 */
export function usePrivacyPreferences() {
  return useQuery<PrivacyPreferences>({
    queryKey: ['privacy-preferences'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.USERS_ME_PRIVACY_PREFS);
      return response.data;
    },
    refetchOnMount: 'always',
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
}

/**
 * Update privacy preferences
 */
export function useUpdatePrivacyPreferences() {
  const queryClient = useQueryClient();

  return useMutation<PrivacyPreferences, Error, Partial<PrivacyPreferences>>({
    mutationFn: async (data) => {
      const response = await apiClient.put(API_ENDPOINTS.USERS_ME_PRIVACY_PREFS, data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['privacy-preferences'], data);
    },
  });
}

export function useVenueInvoices(venueId?: string) {
  return useQuery<Invoice[]>({
    queryKey: ['venue-invoices', venueId],
    enabled: Boolean(venueId),
    queryFn: async () => {
      if (!venueId) return [];
      const response = await apiClient.get(API_ENDPOINTS.PARTNERS_VENUE_INVOICES(venueId));
      return response.data?.invoices || response.data || [];
    },
  });
}

export function useVenuePaymentPortal() {
  return useMutation<{ portal_url: string }, Error, string>({
    mutationFn: async (venueId) => {
      const response = await apiClient.post(API_ENDPOINTS.PARTNERS_VENUE_PAYMENT_PORTAL(venueId));
      return response.data;
    },
  });
}

/**
 * Update password
 */
export function useUpdatePassword() {
  return useMutation<{ message: string }, Error, UpdatePasswordData>({
    mutationFn: async (data) => {
      const response = await apiClient.put(API_ENDPOINTS.USERS_ME_PASSWORD, data);
      return response.data;
    },
  });
}

/**
 * Get active user sessions
 */
export function useSessions() {
  return useQuery<UserSession[]>({
    queryKey: ['user-sessions'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.USERS_ME_SESSIONS);
      return response.data?.sessions || [];
    },
  });
}

/**
 * Revoke a single session
 */
export function useRevokeSession() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: async (sessionId) => {
      const response = await apiClient.delete(API_ENDPOINTS.USERS_ME_SESSION(sessionId));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-sessions'] });
    },
  });
}

/**
 * Revoke all other sessions
 */
export function useRevokeOtherSessions() {
  const queryClient = useQueryClient();

  return useMutation<{ message: string; revoked: number; kept_session_id: string | null }, Error, void>({
    mutationFn: async () => {
      const response = await apiClient.delete(API_ENDPOINTS.USERS_ME_SESSIONS_OTHERS);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-sessions'] });
    },
  });
}
