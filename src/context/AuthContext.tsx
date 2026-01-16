import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  telephone?: string;
  hasCompletedOnboarding: boolean;
  onboardingStep: 'restaurant' | 'facturation' | 'complete';
  role?: string;
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
  error: string | null;
}

export interface RegisterData {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
  referralCode?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check for existing auth token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await authAPI.getMe();
          const userData = response.data.user || response.data;
          
          if (userData && userData.id) {
            setCurrentUser({
              id: userData.id,
              email: userData.email || '',
              nom: userData.last_name || userData.nom || '',
              prenom: userData.first_name || userData.prenom || '',
              telephone: userData.phone || userData.telephone,
              hasCompletedOnboarding: userData.onboarding_completed ?? true,
              onboardingStep: userData.onboarding_completed ? 'complete' : 'restaurant',
              role: userData.role,
            });
            setIsAuthenticated(true);
          } else {
            // Invalid user data, clear tokens
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
          }
        } catch (err: any) {
          console.error('Auth check failed:', err);
          // Only clear tokens if it's a 401 error (unauthorized)
          // Keep tokens for network errors to allow retry
          if (err.response?.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
          } else {
            // For other errors (network, etc.), try to use cached user data
            const cachedUser = localStorage.getItem('cachedUser');
            if (cachedUser) {
              try {
                const userData = JSON.parse(cachedUser);
                setCurrentUser(userData);
                setIsAuthenticated(true);
              } catch {
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
              }
            }
          }
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    try {
      const response = await authAPI.login(email, password);
      const data = response.data;
      
      // Handle different API response formats
      const token = data.token || data.access_token;
      const refresh_token = data.refresh_token;
      const user = data.user || data;
      
      if (!token) {
        setError('Erreur de connexion: token non reçu');
        return false;
      }
      
      localStorage.setItem('authToken', token);
      if (refresh_token) {
        localStorage.setItem('refreshToken', refresh_token);
      }

      const userData: User = {
        id: user.id || '',
        email: user.email || email,
        nom: user.last_name || user.nom || '',
        prenom: user.first_name || user.prenom || '',
        telephone: user.phone || user.telephone,
        hasCompletedOnboarding: user.onboarding_completed ?? true,
        onboardingStep: user.onboarding_completed ? 'complete' : 'restaurant',
        role: user.role,
      };
      
      // Cache user data for offline/network error recovery
      localStorage.setItem('cachedUser', JSON.stringify(userData));
      
      setCurrentUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (err: any) {
      console.error('Login error:', err);
      const message = err.response?.data?.error || err.response?.data?.message || 'Email ou mot de passe incorrect';
      setError(message);
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setError(null);
    try {
      const response = await authAPI.register({
        email: data.email,
        password: data.password,
        first_name: data.prenom,
        last_name: data.nom,
        role: 'venue_owner',
      });
      
      const responseData = response.data;
      const token = responseData.token || responseData.access_token;
      const refresh_token = responseData.refresh_token;
      const user = responseData.user || responseData;
      
      if (!token) {
        setError('Erreur d\'inscription: token non reçu');
        return false;
      }
      
      localStorage.setItem('authToken', token);
      if (refresh_token) {
        localStorage.setItem('refreshToken', refresh_token);
      }

      const userData: User = {
        id: user.id || '',
        email: user.email || data.email,
        nom: user.last_name || data.nom,
        prenom: user.first_name || data.prenom,
        telephone: data.telephone,
        hasCompletedOnboarding: false,
        onboardingStep: 'restaurant',
        role: user.role,
      };
      
      // Cache user data
      localStorage.setItem('cachedUser', JSON.stringify(userData));
      
      setCurrentUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (err: any) {
      console.error('Register error:', err);
      const message = err.response?.data?.error || err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription';
      setError(message);
      return false;
    }
  };

  const completeOnboarding = () => {
    if (currentUser) {
      const updatedUser = { ...currentUser, hasCompletedOnboarding: true, onboardingStep: 'complete' as const };
      setCurrentUser(updatedUser);
      localStorage.setItem('cachedUser', JSON.stringify(updatedUser));
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
      localStorage.setItem('cachedUser', JSON.stringify(updatedUser));
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      // Continue with local logout even if API call fails
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('cachedUser');
    setIsAuthenticated(false);
    setCurrentUser(null);
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
      updateOnboardingStep,
      error,
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