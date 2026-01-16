import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';

// User interface matching backend snake_case format
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  role: 'user' | 'venue_owner' | 'admin';
  onboarding_complete: boolean;
  created_at: string;
  // Legacy support for frontend components that use French names
  nom?: string;
  prenom?: string;
  hasCompletedOnboarding?: boolean;
  onboardingStep?: 'restaurant' | 'facturation' | 'complete';
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  currentUser: User | null;
  completeOnboarding: () => void;
  updateOnboardingStep: (step: 'restaurant' | 'facturation' | 'complete') => void;
  refreshUser: () => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role?: 'user' | 'venue_owner';
  // Legacy support
  nom?: string;
  prenom?: string;
  telephone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to normalize user data for legacy component support
const normalizeUser = (apiUser: any): User => {
  return {
    ...apiUser,
    // Map backend fields to legacy frontend fields
    nom: apiUser.last_name,
    prenom: apiUser.first_name,
    hasCompletedOnboarding: apiUser.onboarding_complete ?? true,
    onboardingStep: apiUser.onboarding_complete ? 'complete' : 'restaurant',
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Check for existing auth token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await authAPI.getMe();
          const user = normalizeUser(response.data.user);
          setCurrentUser(user);
          setIsAuthenticated(true);
        } catch (error) {
          // Token invalid or expired
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login(email, password);
      const { user, token, refresh_token } = response.data;
      
      // Store tokens
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refresh_token);
      
      // Set user state
      const normalizedUser = normalizeUser(user);
      setCurrentUser(normalizedUser);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      // Map legacy field names to backend format
      const registerData = {
        email: data.email,
        password: data.password,
        first_name: data.first_name || data.prenom || '',
        last_name: data.last_name || data.nom || '',
        role: data.role || 'venue_owner' as const,
      };

      const response = await authAPI.register(registerData);
      const { user, token, refresh_token } = response.data;
      
      // Store tokens
      localStorage.setItem('authToken', token);
      localStorage.setItem('refreshToken', refresh_token);
      
      // Set user state with onboarding not complete
      const normalizedUser = normalizeUser({
        ...user,
        onboarding_complete: false,
      });
      setCurrentUser(normalizedUser);
      setIsAuthenticated(true);
      
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authAPI.logout();
    } catch (error) {
      // Ignore logout API errors
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await authAPI.getMe();
      const user = normalizeUser(response.data.user);
      setCurrentUser(user);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const completeOnboarding = () => {
    if (currentUser) {
      const updatedUser = { 
        ...currentUser, 
        hasCompletedOnboarding: true, 
        onboarding_complete: true,
        onboardingStep: 'complete' as const 
      };
      setCurrentUser(updatedUser);
      
      // Also update on backend
      authAPI.updateMe({ onboarding_complete: true } as any).catch(console.error);
    }
  };

  const updateOnboardingStep = (step: 'restaurant' | 'facturation' | 'complete') => {
    if (currentUser) {
      const updatedUser = { 
        ...currentUser, 
        onboardingStep: step,
        hasCompletedOnboarding: step === 'complete',
        onboarding_complete: step === 'complete',
      };
      setCurrentUser(updatedUser);
    }
  };

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#5a03cf]/10 via-gray-50 to-[#9cff02]/10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5a03cf]"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading,
      login, 
      register, 
      logout, 
      currentUser,
      completeOnboarding,
      updateOnboardingStep,
      refreshUser,
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