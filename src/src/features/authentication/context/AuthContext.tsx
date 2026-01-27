import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '../../../api/client';

export interface User {
  id: string;
  email: string;
  nom: string; // mapped from last_name
  prenom: string; // mapped from first_name
  telephone?: string; // mapped from phone
  hasCompletedOnboarding: boolean; // based on API logic or mapped
  onboardingStep: 'restaurant' | 'facturation' | 'complete'; // based on user state
  role?: string;
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
  onboardingCompleted?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from local storage
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await apiClient.get('/auth/me');
          const apiUser = response.data.user;
          const user: User = {
            id: apiUser.id,
            email: apiUser.email,
            nom: apiUser.last_name || '',
            prenom: apiUser.first_name || '',
            telephone: apiUser.phone,
            hasCompletedOnboarding: apiUser.onboarding_completed || false, // Assuming this field exists or logic
            onboardingStep: apiUser.onboarding_completed ? 'complete' : 'restaurant', // Simplified logic
            role: apiUser.role
          };
          setCurrentUser(user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to restore session:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, refresh_token, user: apiUser } = response.data;
      
      localStorage.setItem('authToken', token);
      if (refresh_token) localStorage.setItem('refreshToken', refresh_token);

      const user: User = {
        id: apiUser.id,
        email: apiUser.email,
        nom: apiUser.last_name || '',
        prenom: apiUser.first_name || '',
        telephone: apiUser.phone,
        hasCompletedOnboarding: apiUser.onboarding_completed || false,
        onboardingStep: apiUser.onboarding_completed ? 'complete' : 'restaurant',
        role: apiUser.role
      };

      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      const payload = {
        email: data.email,
        password: data.password,
        first_name: data.prenom,
        last_name: data.nom,
        phone: data.telephone,
        role: 'venue_owner' // Default for this frontend
      };

      const response = await apiClient.post('/auth/register', payload);
      const { token, refresh_token, user: apiUser } = response.data;

      localStorage.setItem('authToken', token);
      if (refresh_token) localStorage.setItem('refreshToken', refresh_token);

      const user: User = {
        id: apiUser.id,
        email: apiUser.email,
        nom: apiUser.last_name || '',
        prenom: apiUser.first_name || '',
        telephone: apiUser.phone,
        hasCompletedOnboarding: false,
        onboardingStep: 'restaurant',
        role: apiUser.role
      };

      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const completeOnboarding = async () => {
    if (currentUser) {
      try {
        await apiClient.put('/users/me/onboarding-complete');
        const updatedUser = { ...currentUser, hasCompletedOnboarding: true, onboardingStep: 'complete' as const };
        setCurrentUser(updatedUser);
      } catch (error) {
        console.error('Failed to complete onboarding:', error);
      }
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
      // Persist state locally or via API if there's a specific endpoint for steps
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
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