import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';
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
  isLoggingOut: boolean;
  apiStatus: 'checking' | 'online' | 'offline';
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (idToken: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  currentUser: User | null;
  completeOnboarding: () => Promise<void>;
  updateOnboardingStep: (step: 'restaurant' | 'facturation' | 'complete') => void;
  checkApiHealth: () => Promise<boolean>;
  refreshUserData: () => Promise<void>;
}

type ForcedLogoutReason =
  | 'session_invalidated'
  | 'session_inactive'
  | 'session_expired'
  | 'session_security'
  | 'missing_refresh_token'
  | 'token_refresh_failed';

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

type GooglePhoneCountry = 'FR' | 'US';
const GOOGLE_PHONE_COUNTRY_ORDER: GooglePhoneCountry[] = ['FR', 'US'];

function getCountryDialCode(country: GooglePhoneCountry): string {
  return country === 'US' ? '+1' : '+33';
}

function CountryFlag({ country, className = 'h-4 w-6 rounded-[2px] shadow-sm' }: { country: GooglePhoneCountry; className?: string }) {
  if (country === 'FR') {
    return (
      <svg aria-hidden="true" className={className} viewBox="0 0 3 2">
        <rect width="1" height="2" x="0" y="0" fill="#0055A4" />
        <rect width="1" height="2" x="1" y="0" fill="#FFFFFF" />
        <rect width="1" height="2" x="2" y="0" fill="#EF4135" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 3 2">
      <rect width="3" height="2" fill="#B22234" />
      <rect width="3" height="0.285" y="0.285" fill="#FFFFFF" />
      <rect width="3" height="0.285" y="0.855" fill="#FFFFFF" />
      <rect width="3" height="0.285" y="1.425" fill="#FFFFFF" />
      <rect width="1.2" height="1.1" x="0" y="0" fill="#3C3B6E" />
    </svg>
  );
}

function formatFrenchPhoneInput(value: string): string {
  let digits = value.replace(/\D/g, '');

  if (digits.startsWith('0033')) {
    digits = `0${digits.slice(4)}`;
  } else if (digits.startsWith('33')) {
    digits = `0${digits.slice(2)}`;
  }

  if (digits.length > 0 && !digits.startsWith('0')) {
    digits = `0${digits}`;
  }

  digits = digits.slice(0, 10);
  return digits.replace(/(\d{2})(?=\d)/g, '$1 ').trim();
}

function normalizeFrenchPhone(value: string): string | null {
  let digits = value.replace(/\D/g, '');

  if (digits.startsWith('0033')) {
    digits = `0${digits.slice(4)}`;
  } else if (digits.startsWith('33')) {
    digits = `0${digits.slice(2)}`;
  }

  if (digits.length === 9 && /^[1-9]\d{8}$/.test(digits)) {
    digits = `0${digits}`;
  }

  if (!/^0[1-9]\d{8}$/.test(digits)) {
    return null;
  }

  return `+33${digits.slice(1)}`;
}

function formatUsPhoneInput(value: string): string {
  let digits = value.replace(/\D/g, '');

  if (digits.startsWith('001')) {
    digits = digits.slice(3);
  } else if (digits.startsWith('1') && digits.length > 10) {
    digits = digits.slice(1);
  }

  digits = digits.slice(0, 10);

  if (digits.length <= 3) {
    return digits;
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function normalizeUsPhone(value: string): string | null {
  let digits = value.replace(/\D/g, '');

  if (digits.startsWith('001')) {
    digits = digits.slice(3);
  } else if (digits.startsWith('1') && digits.length === 11) {
    digits = digits.slice(1);
  }

  if (!/^\d{10}$/.test(digits)) {
    return null;
  }

  return `+1${digits}`;
}

function formatPhoneInput(value: string, country: GooglePhoneCountry): string {
  return country === 'US' ? formatUsPhoneInput(value) : formatFrenchPhoneInput(value);
}

function normalizePhone(value: string, country: GooglePhoneCountry): string | null {
  return country === 'US' ? normalizeUsPhone(value) : normalizeFrenchPhone(value);
}

function getPhonePlaceholder(country: GooglePhoneCountry): string {
  return country === 'US' ? '(201) 555-0123' : '06 12 34 56 78';
}

function getPhoneFormatHint(country: GooglePhoneCountry): string {
  return country === 'US'
    ? 'Format US (ex: (201) 555-0123)'
    : 'Format FR (ex: 06 12 34 56 78)';
}

function getPhoneErrorMessage(country: GooglePhoneCountry): string {
  return country === 'US'
    ? 'Numéro invalide. Format attendu: (201) 555-0123'
    : 'Numéro invalide. Format attendu: 06 12 34 56 78';
}

function getForcedLogoutNotice(reason: ForcedLogoutReason, backendError?: string | null): ForcedLogoutNotice {
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
        message: backendError
          ? `Votre session a été interrompue (${backendError}). Veuillez vous reconnecter.`
          : 'Votre session a été interrompue. Veuillez vous reconnecter.',
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
  const [showGooglePhoneModal, setShowGooglePhoneModal] = useState(false);
  const [googlePhoneCountry, setGooglePhoneCountry] = useState<GooglePhoneCountry>('FR');
  const [isGoogleCountryMenuOpen, setIsGoogleCountryMenuOpen] = useState(false);
  const [googlePhoneInput, setGooglePhoneInput] = useState('');
  const [googlePhoneError, setGooglePhoneError] = useState('');
  const [isSavingGooglePhone, setIsSavingGooglePhone] = useState(false);
  const [forcedLogoutNotice, setForcedLogoutNotice] = useState<ForcedLogoutNotice | null>(null);
  const googleCountryPickerRef = useRef<HTMLDivElement | null>(null);

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

      console.warn('Force logout triggered:', reason, backendError);
      setIsAuthenticated(false);
      setCurrentUser(null);
      clearAuthTokens();
      setForcedLogoutNotice(getForcedLogoutNotice(reason, backendError));
    };

    window.addEventListener('auth:logout', handleForceLogout as EventListener);
    
    return () => {
      window.removeEventListener('auth:logout', handleForceLogout as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!isGoogleCountryMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (googleCountryPickerRef.current && !googleCountryPickerRef.current.contains(event.target as Node)) {
        setIsGoogleCountryMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isGoogleCountryMenuOpen]);

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

  const closeGooglePhoneModal = () => {
    setShowGooglePhoneModal(false);
    setGooglePhoneCountry('FR');
    setIsGoogleCountryMenuOpen(false);
    setGooglePhoneInput('');
    setGooglePhoneError('');
  };

  const closeForcedLogoutModal = () => {
    setForcedLogoutNotice(null);
  };

  const changeGooglePhoneCountry = (nextCountry: GooglePhoneCountry) => {
    if (nextCountry !== googlePhoneCountry) {
      setGooglePhoneCountry(nextCountry);
      setGooglePhoneInput('');
      if (googlePhoneError) {
        setGooglePhoneError('');
      }
    }
    setIsGoogleCountryMenuOpen(false);
  };

  const saveGooglePhone = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedPhone = normalizePhone(googlePhoneInput, googlePhoneCountry);

    if (!normalizedPhone) {
      setGooglePhoneError(getPhoneErrorMessage(googlePhoneCountry));
      return;
    }

    try {
      setGooglePhoneError('');
      setIsSavingGooglePhone(true);
      await api.updateUserProfile({ phone: normalizedPhone });

      const updatedProfile = await api.getUserProfile();
      if (updatedProfile.user) {
        setCurrentUser(apiUserToUser(updatedProfile.user));
      } else {
        setCurrentUser((prev) => (prev ? { ...prev, telephone: normalizedPhone } : prev));
      }
      closeGooglePhoneModal();
    } catch (error) {
      console.warn('Failed to save phone number after Google login', error);
      setGooglePhoneError('Impossible d’enregistrer ce numéro pour le moment.');
    } finally {
      setIsSavingGooglePhone(false);
    }
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

  const loginWithGoogle = async (idToken: string): Promise<{ success: boolean; error?: string }> => {
    if (apiStatus === 'offline') {
      return { success: false, error: 'API hors ligne. Impossible d\'utiliser Google.' };
    }

    try {
      const response = await api.googleLogin(idToken);
      persistAuthTokens(response.token, response.refresh_token);

      if (response.user) {
        let user: User = {
          id: response.user.id,
          email: response.user.email,
          nom: response.user.last_name || '',
          prenom: response.user.first_name || '',
          role: response.user.role,
          hasCompletedOnboarding: false,
          onboardingStep: 'restaurant',
        };

        try {
          const profileResponse = await api.getUserProfile();
          if (profileResponse.user) {
            user = apiUserToUser(profileResponse.user);
          }
        } catch {
          // Keep partial user payload from auth endpoint
        }

        setCurrentUser(user);
        setIsAuthenticated(true);

        if (!user.telephone) {
          setGooglePhoneCountry('FR');
          setIsGoogleCountryMenuOpen(false);
          setGooglePhoneInput('');
          setGooglePhoneError('');
          setShowGooglePhoneModal(true);
        }

        return { success: true };
      }

      return { success: false, error: 'Google login failed' };
    } catch (error: any) {
      console.error('Google login error:', error);
      return { success: false, error: error.message || 'Connexion Google impossible' };
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
      loginWithGoogle,
      register, 
      logout, 
      currentUser,
      completeOnboarding,
      updateOnboardingStep,
      checkApiHealth,
      refreshUserData,
    }}>
      {children}
      {showGooglePhoneModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeGooglePhoneModal}
          />
          <div className="relative w-full max-w-md bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/60 dark:border-gray-700/60 shadow-2xl">
            <h2 className="text-xl text-gray-900 dark:text-white mb-2">Complétez votre compte</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
              Ajoutez votre numéro de téléphone pour finaliser votre connexion Google.
            </p>

            <form onSubmit={saveGooglePhone} className="space-y-4">
              {googlePhoneError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                  <p className="text-sm text-red-600 dark:text-red-400">{googlePhoneError}</p>
                </div>
              )}

              <div>
                <label htmlFor="google-phone" className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                  Téléphone
                </label>
                <div className="flex bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus-within:ring-2 focus-within:ring-[#5a03cf] focus-within:border-transparent transition-all">
                  <div
                    ref={googleCountryPickerRef}
                    className="relative flex items-center px-2.5 border-r border-gray-200 dark:border-gray-700 rounded-l-xl"
                  >
                    <button
                      type="button"
                      onClick={() => setIsGoogleCountryMenuOpen((prev) => !prev)}
                      className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-colors"
                      aria-haspopup="listbox"
                      aria-expanded={isGoogleCountryMenuOpen}
                    >
                      <CountryFlag country={googlePhoneCountry} />
                      <span className="min-w-[32px] text-left font-medium">{getCountryDialCode(googlePhoneCountry)}</span>
                      <svg
                        aria-hidden="true"
                        className={`h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform ${isGoogleCountryMenuOpen ? 'rotate-180' : ''}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.12l3.71-3.9a.75.75 0 1 1 1.08 1.04l-4.25 4.47a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {isGoogleCountryMenuOpen && (
                      <div className="absolute left-0 top-[calc(100%+0.35rem)] z-20 min-w-[170px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900">
                        {GOOGLE_PHONE_COUNTRY_ORDER.map((country) => (
                          <button
                            key={country}
                            type="button"
                            onClick={() => changeGooglePhoneCountry(country)}
                            className={`flex w-full items-center gap-2 px-3 py-2.5 text-sm transition-colors ${
                              country === googlePhoneCountry
                                ? 'bg-[#5a03cf]/10 text-[#5a03cf] dark:bg-[#5a03cf]/20 dark:text-[#c8a4ff]'
                                : 'text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800'
                            }`}
                          >
                            <CountryFlag country={country} />
                            <span className="font-medium">{getCountryDialCode(country)}</span>
                            <span className="text-xs opacity-80">{country === 'FR' ? 'France' : 'USA'}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <input
                    id="google-phone"
                    name="google-phone"
                    type="tel"
                    value={googlePhoneInput}
                    onChange={(event) => {
                      setGooglePhoneInput(formatPhoneInput(event.target.value, googlePhoneCountry));
                      if (googlePhoneError) {
                        setGooglePhoneError('');
                      }
                    }}
                    className="w-full px-4 py-3 bg-transparent text-gray-900 dark:text-white rounded-r-xl focus:outline-none"
                    placeholder={getPhonePlaceholder(googlePhoneCountry)}
                    autoComplete="tel-national"
                    inputMode="numeric"
                    maxLength={14}
                    autoFocus
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {getPhoneFormatHint(googlePhoneCountry)}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeGooglePhoneModal}
                  className="px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  disabled={isSavingGooglePhone}
                >
                  Plus tard
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-[#5a03cf] text-white rounded-xl hover:bg-[#4a02af] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isSavingGooglePhone}
                >
                  {isSavingGooglePhone ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
      {forcedLogoutNotice && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            onClick={closeForcedLogoutModal}
          />
          <div className="relative w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/70 dark:border-gray-700/70 shadow-2xl">
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
