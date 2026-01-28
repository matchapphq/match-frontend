import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import api, { ApiUser } from '../../../services/api';

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  telephone?: string;
  role?: 'user' | 'venue_owner' | 'admin';
  hasCompletedOnboarding: boolean;
  onboardingStep: 'restaurant' | 'facturation' | 'complete';
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  apiStatus: 'checking' | 'online' | 'offline';
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  currentUser: User | null;
  completeOnboarding: () => Promise<void>;
  updateOnboardingStep: (step: 'restaurant' | 'facturation' | 'complete') => void;
  checkApiHealth: () => Promise<boolean>;
  refreshUserData: () => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Convert API user to local user format
function apiUserToUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    email: apiUser.email,
    nom: apiUser.last_name,
    prenom: apiUser.first_name,
    telephone: apiUser.phone,
    role: apiUser.role,
    hasCompletedOnboarding: apiUser.has_completed_onboarding ?? false,
    onboardingStep: apiUser.has_completed_onboarding ? 'complete' : 'restaurant',
  };
}

// Fallback mock user for demo mode when API is offline
const mockUser: User = {
  id: 'user-demo',
  email: 'demo@match.com',
  nom: 'Demo',
  prenom: 'Restaurateur',
  telephone: '01 23 45 67 89',
  hasCompletedOnboarding: true,
  onboardingStep: 'complete'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false); // Prevent double init in StrictMode

  // Check API health
  const checkApiHealth = useCallback(async (): Promise<boolean> => {
    setApiStatus('checking');
    try {
      const result = await api.healthCheck();
      const isOnline = result.status === 'ok';
      setApiStatus(isOnline ? 'online' : 'offline');
      return isOnline;
    } catch {
      setApiStatus('offline');
      return false;
    }
  }, []);

  // Try to restore session on mount
  useEffect(() => {
    // Prevent double initialization in React StrictMode
    if (hasInitialized) return;
    
    const initAuth = async () => {
      setIsLoading(true);
      setHasInitialized(true);
      
      // First check API health
      const isApiOnline = await checkApiHealth();
      
      if (isApiOnline) {
        try {
          // Try to get current user (will work if cookies are valid)
          const response = await api.getUserProfile();
          if (response.user) {
            const user = apiUserToUser(response.user);
            setCurrentUser(user);
            setIsAuthenticated(true);
          }
        } catch {
          // Not authenticated or session expired
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, [checkApiHealth, hasInitialized]);

  const refreshUserData = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await api.getUserProfile();
      if (response.user) {
        const user = apiUserToUser(response.user);
        setCurrentUser(user);
      }
    } catch (error) {
      console.warn('Failed to refresh user data', error);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Check if API is online first
    if (apiStatus === 'offline') {
      // Fallback to demo mode
      if (email === 'demo@match.com' && password === 'demo123') {
        setIsAuthenticated(true);
        setCurrentUser(mockUser);
        return { success: true };
      }
      return { success: false, error: 'API hors ligne. Utilisez demo@match.com / demo123 pour le mode démo.' };
    }

    try {
      const response = await api.login(email, password);
      
      if (response.user) {
        let user: User = {
          id: response.user.id,
          email: response.user.email,
          nom: '',
          prenom: '',
          role: response.user.role,
          hasCompletedOnboarding: false,
          onboardingStep: 'restaurant',
        };

        // Fetch full user profile after login
        try {
          const profileResponse = await api.getUserProfile();
          if (profileResponse.user) {
            user = apiUserToUser(profileResponse.user);
          }
        } catch {
          // Use basic user info from login response
        }

        setCurrentUser(user);
        setIsAuthenticated(true);
        return { success: true };
      }
      
      return { success: false, error: 'Login failed' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Email ou mot de passe incorrect' };
    }
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    if (apiStatus === 'offline') {
      return { success: false, error: 'API hors ligne. Impossible de créer un compte.' };
    }

    try {
      const response = await api.register({
        email: data.email,
        password: data.password,
        firstName: data.prenom,
        lastName: data.nom,
        phone: data.telephone,
      });

      if (response.user) {
        setCurrentUser(apiUserToUser(response.user));
        setIsAuthenticated(true);
        return { success: true };
      }

      return { success: false, error: 'Registration failed' };
    } catch (error: any) {
      console.error('Register error:', error);
      return { success: false, error: error.message || 'Erreur lors de l\'inscription' };
    }
  };

  const completeOnboarding = async () => {
    if (currentUser) {
      try {
        if (apiStatus === 'online') {
          await api.completeUserOnboarding();
        }
      } catch (error) {
        console.warn('Failed to complete onboarding via API:', error);
      }
      
      const updatedUser = { ...currentUser, hasCompletedOnboarding: true, onboardingStep: 'complete' as const };
      setCurrentUser(updatedUser);
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
    }
  };

  const logout = async () => {
    try {
      if (apiStatus === 'online') {
        await api.logout();
      }
    } catch (error) {
      console.warn('Logout API call failed:', error);
    }
    
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading,
      apiStatus,
      login, 
      register, 
      logout, 
      currentUser,
      completeOnboarding,
      updateOnboardingStep,
      checkApiHealth,
      refreshUserData,
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
