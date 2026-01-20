/**
 * Auth Hook
 * 
 * Custom hooks for authentication API calls
 */

import { useApiCall, useApiMutation, getAuthToken, setAuthToken, clearAuthToken } from './useApi';
import * as UsersService from '../services/users.service';
import type { User, NotificationPreferences } from '../services/users.service';

// ==================== Auth ====================

export function useAuthenticatedUser() {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => UsersService.getAuthenticatedUser(authToken),
    [authToken],
    { immediate: !!authToken }
  );
}

export function useMyProfile() {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => UsersService.getMyProfile(authToken),
    [authToken],
    { immediate: !!authToken }
  );
}

export function useNotificationPreferences() {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => UsersService.getNotificationPreferences(authToken),
    [authToken]
  );
}

export function useMyAddresses() {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => UsersService.getMyAddresses(authToken),
    [authToken]
  );
}

export function useFavoriteVenues() {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => UsersService.getFavoriteVenues(authToken),
    [authToken]
  );
}

// ==================== Mutations ====================

export function useLogin() {
  return useApiMutation<
    {
      access_token: string;
      refresh_token: string;
      user: User;
    },
    {
      email: string;
      password: string;
    }
  >(
    (credentials) => UsersService.login(credentials),
    {
      onSuccess: ({ access_token, refresh_token }) => {
        setAuthToken(access_token);
        localStorage.setItem('refresh_token', refresh_token);
      },
    }
  );
}

export function useRegister() {
  return useApiMutation<
    {
      access_token: string;
      refresh_token: string;
      user: User;
    },
    {
      email: string;
      password: string;
      name: string;
      phone?: string;
      referral_code?: string;
    }
  >(
    (data) => UsersService.register(data),
    {
      onSuccess: ({ access_token, refresh_token }) => {
        setAuthToken(access_token);
        localStorage.setItem('refresh_token', refresh_token);
      },
    }
  );
}

export function useLogout() {
  const authToken = getAuthToken();
  
  return useApiMutation<void, void>(
    () => UsersService.logout(authToken),
    {
      onSuccess: () => {
        clearAuthToken();
      },
    }
  );
}

export function useUpdateProfile() {
  const authToken = getAuthToken();
  
  return useApiMutation<User, Partial<User>>(
    (data) => UsersService.updateProfile(data, authToken)
  );
}

export function useUpdateNotificationPreferences() {
  const authToken = getAuthToken();
  
  return useApiMutation<NotificationPreferences, Partial<NotificationPreferences>>(
    (data) => UsersService.updateNotificationPreferences(data, authToken)
  );
}

export function useCompleteOnboarding() {
  const authToken = getAuthToken();
  
  return useApiMutation<
    { success: boolean; message: string },
    void
  >(
    () => UsersService.completeOnboarding(authToken)
  );
}
