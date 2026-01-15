import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone?: string;
  hasCompletedOnboarding: boolean; // Nouveau : indique si l'utilisateur a finalisé son inscription
  onboardingStep: 'restaurant' | 'facturation' | 'complete'; // Étape actuelle de l'onboarding
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (data: RegisterData) => boolean;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([mockUser]);

  const login = (email: string, password: string): boolean => {
    // Vérification dans la liste des utilisateurs enregistrés
    const user = registeredUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const register = (data: RegisterData): boolean => {
    try {
      // Vérifier si l'email existe déjà
      const existingUser = registeredUsers.find(u => u.email === data.email);
      if (existingUser) {
        return false;
      }

      // Créer le nouvel utilisateur avec un ID unique et onboarding non complété
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: data.email,
        password: data.password,
        nom: data.nom,
        prenom: data.prenom,
        telephone: data.telephone,
        hasCompletedOnboarding: false,
        onboardingStep: 'restaurant' // Première étape : ajouter un restaurant
      };

      // Ajouter à la liste des utilisateurs
      setRegisteredUsers([...registeredUsers, newUser]);

      // Connexion automatique après inscription
      setIsAuthenticated(true);
      setCurrentUser(newUser);
      
      return true;
    } catch (error) {
      return false;
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
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
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