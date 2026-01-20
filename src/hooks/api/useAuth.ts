/**
 * React Query Hooks for Match Platform
 * 
 * Custom hooks using TanStack Query for data fetching, caching, and mutations
 * These hooks will replace mock data imports when APIs are ready
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { authAPI } from '../services/api';

// ============================================================================
// AUTHENTICATION HOOKS
// ============================================================================

export const useLogin = (options?: UseMutationOptions<any, Error, { email: string; password: string }>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authAPI.login(email, password).then((res) => res.data),
    onSuccess: (data) => {
      // Store tokens
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('refreshToken', data.refresh_token);
      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
    ...options,
  });
};

export const useRegister = (options?: UseMutationOptions<any, Error, any>) => {
  return useMutation({
    mutationFn: (data: {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
      role: 'user' | 'venue_owner' | 'admin';
    }) => authAPI.register(data).then((res) => res.data),
    onSuccess: (data) => {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('refreshToken', data.refresh_token);
    },
    ...options,
  });
};

export const useLogout = (options?: UseMutationOptions<any, Error, void>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authAPI.logout().then((res) => res.data),
    onSuccess: () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      queryClient.clear();
    },
    ...options,
  });
};

export const useCurrentUser = (options?: UseQueryOptions<any, Error>) => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authAPI.getMe().then((res) => res.data.user),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

export const useUpdateUser = (options?: UseMutationOptions<any, Error, any>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      first_name?: string;
      last_name?: string;
      phone?: string;
      avatar_url?: string;
    }) => authAPI.updateMe(data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
    ...options,
  });
};

export const useDeleteAccount = (options?: UseMutationOptions<any, Error, void>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authAPI.deleteAccount().then((res) => res.data),
    onSuccess: () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      queryClient.clear();
    },
    ...options,
  });
};
