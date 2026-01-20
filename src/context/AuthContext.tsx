import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';

export interface User {
  id: string;
  email: string;
  password?: string;
  nom: string;
  prenom: string;
  first_name?: string;
  last_name?: string;
  telephone?: string;
  phone?: string;
  avatar_url?: string;
  role?: 'user' | 'venue_owner' | 'admin';
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
  refreshUser: () => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Données de démonstration - utilisateur test avec onboarding complété
const mockUser: User = {
  id: 'user-demo',
  email: 'demo@match.com',
  password: 'demo123',
  nom: 'Demo',
  prenom: 'Restaurateur',
  telephone: '01 23 45 67 89',
  hasCompletedOnboarding: true,
  onboardingStep: 'complete'
};

// Check if we're using API or mock data
const USE_API = import.meta.env.VITE_USE_API === 'true';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([mockUser]);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token && USE_API) {
        try {
          const response = await authAPI.getMe();
          const apiUser = response.data.user;
          const user: User = {
            id: apiUser.id,
            email: apiUser.email,
            nom: apiUser.last_name || '',
            prenom: apiUser.first_name || '',
            first_name: apiUser.first_name,
            last_name: apiUser.last_name,
            telephone: apiUser.phone,
            phone: apiUser.phone,
            avatar_url: apiUser.avatar_url,
            role: apiUser.role,
            hasCompletedOnboarding: apiUser.onboarding_complete ?? true,
            onboardingStep: apiUser.onboarding_complete ? 'complete' : 'restaurant',
          };
          setCurrentUser(user);
          setIsAuthenticated(true);
        } catch (error) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (USE_API) {
      try {
        const response = await authAPI.login(email, password);
        const { token, refresh_token, user: apiUser } = response.data;
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('refreshToken', refresh_token);
        
        const user: User = {
          id: apiUser.id,
          email: apiUser.email,
          nom: apiUser.last_name || '',
          prenom: apiUser.first_name || '',
          first_name: apiUser.first_name,
          last_name: apiUser.last_name,
          telephone: apiUser.phone,
          phone: apiUser.phone,
          avatar_url: apiUser.avatar_url,
          role: apiUser.role,
          hasCompletedOnboarding: apiUser.onboarding_complete ?? true,
          onboardingStep: apiUser.onboarding_complete ? 'complete' : 'restaurant',
        };
        
        setCurrentUser(user);
        setIsAuthenticated(true);
        return true;
      } catch (error) {
        console.error('Login error:', error);
        return false;
      }
    } else {
      // Mock login for development
      const user = registeredUsers.find(u => u.email === email && u.password === password);
      if (user) {
        setIsAuthenticated(true);
        setCurrentUser(user);
        return true;
      }
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    if (USE_API) {
      try {
        const response = await authAPI.register({
          email: data.email,
          password: data.password,
          first_name: data.prenom,
          last_name: data.nom,
          role: 'venue_owner',
        });
        
        const { token, refresh_token, user: apiUser } = response.data;
        
        localStorage.setItem('authToken', token);
        localStorage.setItem('refreshToken', refresh_token);
        
        const user: User = {
          id: apiUser.id,
          email: apiUser.email,
          nom: apiUser.last_name || data.nom,
          prenom: apiUser.first_name || data.prenom,
          first_name: apiUser.first_name,
          last_name: apiUser.last_name,
          telephone: data.telephone,
          phone: apiUser.phone,
          role: apiUser.role,
          hasCompletedOnboarding: false,
          onboardingStep: 'restaurant',
        };
        
        setCurrentUser(user);
        setIsAuthenticated(true);
        return true;
      } catch (error) {
        console.error('Register error:', error);
        return false;
      }
    } else {
      // Mock registration for development
      try {
        const existingUser = registeredUsers.find(u => u.email === data.email);
        if (existingUser) {
          return false;
        }

        const newUser: User = {
          id: `user-${Date.now()}`,
          email: data.email,
          password: data.password,
          nom: data.nom,
          prenom: data.prenom,
          telephone: data.telephone,
          hasCompletedOnboarding: false,
          onboardingStep: 'restaurant',
        };

        setRegisteredUsers([...registeredUsers, newUser]);
        setIsAuthenticated(true);
        setCurrentUser(newUser);
        return true;
      } catch (error) {
        return false;
      }
    }
  };

  const completeOnboarding = () => {
    if (currentUser) {
      const updatedUser = { ...currentUser, hasCompletedOnboarding: true, onboardingStep: 'complete' as const };
      setCurrentUser(updatedUser);
      setRegisteredUsers(registeredUsers.map(u => u.id === currentUser.id ? updatedUser : u));
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
      setRegisteredUsers(registeredUsers.map(u => u.id === currentUser.id ? updatedUser : u));
    }
  };

  const logout = () => {
    if (USE_API) {
      authAPI.logout().catch(console.error);
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const refreshUser = async () => {
    if (USE_API) {
      try {
        const response = await authAPI.getMe();
        const apiUser = response.data.user;
        const user: User = {
          id: apiUser.id,
          email: apiUser.email,
          nom: apiUser.last_name || '',
          prenom: apiUser.first_name || '',
          first_name: apiUser.first_name,
          last_name: apiUser.last_name,
          telephone: apiUser.phone,
          phone: apiUser.phone,
          avatar_url: apiUser.avatar_url,
          role: apiUser.role,
          hasCompletedOnboarding: apiUser.onboarding_complete ?? true,
          onboardingStep: apiUser.onboarding_complete ? 'complete' : 'restaurant',
        };
        setCurrentUser(user);
      } catch (error) {
        console.error('Refresh user error:', error);
      }
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