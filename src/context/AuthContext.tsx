import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { ApiUser, RegisterRequest, LoginRequest } from '../lib/types';

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  telephone?: string;
  hasCompletedOnboarding: boolean;
  onboardingStep: 'restaurant' | 'facturation' | 'complete';
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  currentUser: User | null;
  completeOnboarding: () => void;
  updateOnboardingStep: (step: 'restaurant' | 'facturation' | 'complete') => void;
}

export interface RegisterData {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth API functions
const authApi = {
  register: async (data: RegisterRequest) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  login: async (data: LoginRequest) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  logout: async () => {
    await api.post('/auth/logout');
  },
  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
};

// Convert API user to frontend User format
function mapApiUserToUser(apiUser: ApiUser, hasCompletedOnboarding = true): User {
  return {
    id: apiUser.id,
    email: apiUser.email,
    nom: apiUser.last_name || '',
    prenom: apiUser.first_name || '',
    telephone: apiUser.phone,
    hasCompletedOnboarding,
    onboardingStep: hasCompletedOnboarding ? 'complete' : 'restaurant',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [onboardingState, setOnboardingState] = useState<{
    hasCompleted: boolean;
    step: 'restaurant' | 'facturation' | 'complete';
  }>({ hasCompleted: true, step: 'complete' });

  // Check if user is already logged in on mount
  // If 401 occurs, interceptor will try refresh ONCE automatically
  const { data: authData, isLoading } = useQuery({
    queryKey: ['auth-user'],
    queryFn: authApi.getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  // Update currentUser when auth data is fetched
  useEffect(() => {
    if (authData?.user) {
      // Backend returns user as array from getMe, handle both cases
      const apiUser = Array.isArray(authData.user) ? authData.user[0] : authData.user;
      if (apiUser) {
        const user = mapApiUserToUser(apiUser, onboardingState.hasCompleted);
        user.hasCompletedOnboarding = onboardingState.hasCompleted;
        user.onboardingStep = onboardingState.step;
        setCurrentUser(user);
        setIsAuthenticated(true);
      }
    }
  }, [authData]);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      const user = mapApiUserToUser(data.user, onboardingState.hasCompleted);
      user.hasCompletedOnboarding = onboardingState.hasCompleted;
      user.onboardingStep = onboardingState.step;
      setCurrentUser(user);
      setIsAuthenticated(true);
      queryClient.setQueryData(['auth-user'], data);
      // Refetch /me and all user-related data to ensure everything is fresh
      await queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      await queryClient.invalidateQueries({ queryKey: ['my-venues'] });
      await queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      const user = mapApiUserToUser(data.user, false);
      user.hasCompletedOnboarding = false;
      user.onboardingStep = 'restaurant';
      setCurrentUser(user);
      setIsAuthenticated(true);
      setOnboardingState({ hasCompleted: false, step: 'restaurant' });
      queryClient.setQueryData(['auth-user'], data);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      setCurrentUser(null);
      setIsAuthenticated(false);
      queryClient.clear();
    },
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await loginMutation.mutateAsync({ email, password });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      await registerMutation.mutateAsync({
        email: data.email,
        password: data.password,
        firstName: data.prenom,
        lastName: data.nom,
        phone: data.telephone,
        role: 'venue_owner',
      });
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  const completeOnboarding = () => {
    if (currentUser) {
      const updatedUser = { ...currentUser, hasCompletedOnboarding: true, onboardingStep: 'complete' as const };
      setCurrentUser(updatedUser);
      setOnboardingState({ hasCompleted: true, step: 'complete' });
    }
  };

  const updateOnboardingStep = (step: 'restaurant' | 'facturation' | 'complete') => {
    if (currentUser) {
      const updatedUser = { 
        ...currentUser, 
        onboardingStep: step,
        hasCompletedOnboarding: step === 'complete'
      };
      setCurrentUser(updatedUser);
      setOnboardingState({ hasCompleted: step === 'complete', step });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading,
      login, 
      register, 
      logout, 
      currentUser,
      completeOnboarding,
      updateOnboardingStep
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}