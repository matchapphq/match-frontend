import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import api, { ApiUser } from '../../../services/api';
import type { LogoutReason as ForcedLogoutReason } from '../types/logout';

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  telephone?: string;
  avatar?: string;
  role?: 'user' | 'venue_owner' | 'admin';
  hasCompletedOnboarding: boolean;
  hasPaymentMethod: boolean;
  onboardingStep: 'restaurant' | 'facturation' | 'complete';
  onboardingApiStep?: ApiUser['onboarding_step'];
}

type LocalOnboardingStep = User['onboardingStep'];

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isLoggingOut: boolean;
  apiStatus: 'checking' | 'online' | 'offline';
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  currentUser: User | null;
  completeOnboarding: () => Promise<void>;
  skipOnboardingPaymentSetup: () => Promise<void>;
  updateOnboardingStep: (step: LocalOnboardingStep) => Promise<void>;
  checkApiHealth: () => Promise<boolean>;
  refreshUserData: () => Promise<void>;
}

type ForcedLogoutNotice = {
  title: string;
  message: string;
};

export interface RegisterData {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
  referralCode?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapApiOnboardingStepToLocal(apiUser: ApiUser): LocalOnboardingStep {
  switch (apiUser.onboarding_step) {
    case 'done':
    case 'paiement_method_skipped':
      return 'complete';
    case 'paiement_method':
      return 'facturation';
    case 'first_venue':
      return 'restaurant';
    default:
      return apiUser.has_completed_onboarding ? 'complete' : 'restaurant';
  }
}

function mapLocalOnboardingStepToApi(step: LocalOnboardingStep): NonNullable<ApiUser['onboarding_step']> {
  switch (step) {
    case 'complete':
      return 'done';
    case 'facturation':
      return 'paiement_method';
    case 'restaurant':
    default:
      return 'first_venue';
  }
}

// Convert API user to local user format
function apiUserToUser(apiUser: ApiUser): User {
  const onboardingStep = mapApiOnboardingStepToLocal(apiUser);

  return {
    id: apiUser.id,
    email: apiUser.email,
    nom: apiUser.last_name,
    prenom: apiUser.first_name,
    telephone: apiUser.phone,
    avatar: apiUser.avatar,
    role: apiUser.role,
    hasCompletedOnboarding: onboardingStep === 'complete' || (apiUser.has_completed_onboarding ?? false),
    hasPaymentMethod: apiUser.has_payment_method ?? false,
    onboardingStep,
    onboardingApiStep: apiUser.onboarding_step ?? null,
  };
}

function getForcedLogoutNotice(reason: ForcedLogoutReason): ForcedLogoutNotice {
  switch (reason) {
    case 'session_invalidated':
      return {
        title: 'Session invalidée',
        message: 'Cette session a été révoquée depuis un autre appareil. Veuillez vous reconnecter.',
      };
    case 'session_inactive':
      return {
        title: 'Session expirée (inactivité)',
        message: 'Votre session a expiré après une période d’inactivité. Reconnectez-vous pour continuer.',
      };
    case 'session_expired':
      return {
        title: 'Session expirée',
        message: 'Votre session a expiré. Veuillez vous reconnecter.',
      };
    case 'session_security':
      return {
        title: 'Déconnexion de sécurité',
        message: 'Une anomalie de session a été détectée. Par sécurité, vous avez été déconnecté.',
      };
    case 'missing_refresh_token':
      return {
        title: 'Session indisponible',
        message: 'Les informations de session sont incomplètes sur cet appareil. Veuillez vous reconnecter.',
      };
    case 'token_refresh_failed':
    default:
      return {
        title: 'Session interrompue',
        message: 'Votre session a été interrompue. Veuillez vous reconnecter.',
      };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false); // Prevent double init in StrictMode
  const [forcedLogoutNotice, setForcedLogoutNotice] = useState<ForcedLogoutNotice | null>(null);

  const persistAuthTokens = (token?: string, refreshToken?: string) => {
    if (token) {
      localStorage.setItem('authToken', token);
    }
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  };

  const clearAuthTokens = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('refresh_token');
  };

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

  // Listen for logout events from API client (forced logout/session invalidation)
  useEffect(() => {
    const handleForceLogout = (rawEvent: Event) => {
      const event = rawEvent as CustomEvent<{ reason?: ForcedLogoutReason; backend_error?: string | null }>;
      const reason = event.detail?.reason ?? 'token_refresh_failed';
      const backendError = event.detail?.backend_error ?? null;

      if (backendError) {
        console.warn('Force logout triggered:', reason, backendError);
      } else {
        console.warn('Force logout triggered:', reason);
      }
      setIsAuthenticated(false);
      setCurrentUser(null);
      clearAuthTokens();
      setForcedLogoutNotice(getForcedLogoutNotice(reason));
    };

    window.addEventListener('auth:logout', handleForceLogout as EventListener);
    
    return () => {
      window.removeEventListener('auth:logout', handleForceLogout as EventListener);
    };
  }, []);

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

  const closeForcedLogoutModal = () => {
    setForcedLogoutNotice(null);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (apiStatus === 'offline') {
      return { success: false, error: 'API hors ligne. Impossible de se connecter.' };
    }

    try {
      const response = await api.login(email, password);
      persistAuthTokens(response.token, response.refresh_token);
      
      if (response.user) {
        let user: User = {
          id: response.user.id,
          email: response.user.email,
          nom: '',
          prenom: '',
          avatar: response.user.avatar,
          role: response.user.role,
          hasCompletedOnboarding: false,
          hasPaymentMethod: false,
          onboardingStep: 'restaurant',
          onboardingApiStep: null,
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
        referralCode: data.referralCode?.trim() || undefined,
        role: 'venue_owner',
      });
      persistAuthTokens(response.token, response.refresh_token);

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

  const updateOnboardingStep = async (step: LocalOnboardingStep) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      onboardingStep: step,
      hasCompletedOnboarding: step === 'complete',
      onboardingApiStep: mapLocalOnboardingStepToApi(step),
    };
    setCurrentUser(updatedUser);

    if (apiStatus !== 'online') return;

    try {
      await api.updateUserProfile({
        onboarding_step: mapLocalOnboardingStepToApi(step),
      });
    } catch (error) {
      console.warn('Failed to persist onboarding step:', error);
    }
  };

  const completeOnboarding = async () => {
    await updateOnboardingStep('complete');
  };

  const skipOnboardingPaymentSetup = async () => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      onboardingStep: 'complete' as const,
      hasCompletedOnboarding: true,
      onboardingApiStep: 'paiement_method_skipped' as const,
    };
    setCurrentUser(updatedUser);

    if (apiStatus !== 'online') return;

    try {
      await api.updateUserProfile({
        onboarding_step: 'paiement_method_skipped',
      });
    } catch (error) {
      console.warn('Failed to persist skipped payment onboarding step:', error);
    }
  };

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      try {
        if (apiStatus === 'online') {
          await api.logout();
        }
      } catch (error) {
        console.warn('Logout API call failed:', error);
      }

      setIsAuthenticated(false);
      setCurrentUser(null);
      clearAuthTokens();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading,
      isLoggingOut,
      apiStatus,
      login,
      register,
      logout,
      currentUser,
      completeOnboarding,
      skipOnboardingPaymentSetup,
      updateOnboardingStep,
      checkApiHealth,
      refreshUserData,
    }}>
      {children}
      {forcedLogoutNotice && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            onClick={closeForcedLogoutModal}
          />
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-[0_18px_45px_-20px_rgba(0,0,0,0.45)]">
            <h2 className="text-xl text-gray-900 dark:text-white mb-2">{forcedLogoutNotice.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
              {forcedLogoutNotice.message}
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeForcedLogoutModal}
                className="px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
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
