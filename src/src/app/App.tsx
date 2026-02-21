import { useEffect, useCallback, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../features/authentication/context/AuthContext';
import { AppProvider } from '../context/AppContext';
import { ThemeProvider } from '../features/theme/context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';
import { ToastProvider } from '../context/ToastContext';
import apiClient from '../api/client';
import {
  getCheckoutState,
  clearCheckoutState,
  isReturningFromStripe,
  cleanCheckoutUrl,
  CheckoutState
} from '../utils/checkout-state';

// Route guards & layout
import { RequireAuth } from '../components/routing/RequireAuth';
import { RequireOnboarding } from '../components/routing/RequireOnboarding';
import { PublicOnly } from '../components/routing/PublicOnly';
import { AuthenticatedLayout } from '../components/routing/AuthenticatedLayout';

// Route-adapted page components (bridge old props → React Router)
import {
  LandingPage,
  Login,
  Register,
  ReferralPage,
  AppPresentation,
  OnboardingWelcome,
  OnboardingAjouterRestaurant,
  OnboardingInfosEtablissement,
  OnboardingFacturation,
  OnboardingPaiementValidation,
  OnboardingConfirmationOnboarding,
  Dashboard,
  ListeMatchs,
  MesMatchs,
  MatchDetail,
  ModifierMatch,
  ProgrammerMatch,
  MesRestaurants,
  AjouterRestaurant,
  InfosEtablissement,
  Facturation,
  PaiementValidation,
  ConfirmationOnboarding,
  RestaurantDetail,
  ModifierRestaurant,
  Booster,
  AcheterBoosts,
  Parrainage,
  MesAvis,
  Compte,
  CompteInfos,
  CompteFacturation,
  CompteNotifications,
  CompteSecurite,
  CompteDonnees,
  CompteAide,
  Reservations,
  NotificationCenter,
  QRScanner,
} from '../components/routing/RouteAdapters';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <LanguageProvider>
              <ToastProvider>
                <StripeReturnHandler />
                <AppRoutes />
              </ToastProvider>
            </LanguageProvider>
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

/**
 * Handles Stripe checkout returns by reading URL params
 * and verifying the payment before redirecting.
 */
function StripeReturnHandler() {
  const { isAuthenticated, completeOnboarding, refreshUserData } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const verifyCheckout = useCallback(async (
    stripeSessionId: string,
    checkoutState: CheckoutState | null,
    checkoutType: 'venue' | 'boost' | null
  ) => {
    if (processing) return;
    setProcessing(true);

    try {
      if (checkoutType === 'boost') {
        await apiClient.post('/boosts/purchase/verify', { session_id: stripeSessionId });
        clearCheckoutState();
        await queryClient.invalidateQueries({ queryKey: ['boost-summary'] });
        await queryClient.invalidateQueries({ queryKey: ['available-boosts'] });
        await queryClient.invalidateQueries({ queryKey: ['boost-history'] });
        navigate('/booster?success=true', { replace: true });
        return;
      }

      await apiClient.post('/partners/venues/verify-checkout', { session_id: stripeSessionId });
      await refreshUserData();
      clearCheckoutState();

      if (checkoutState?.type === 'add-venue') {
        navigate('/onboarding/confirmation', { replace: true });
      } else {
        await completeOnboarding();
        navigate('/onboarding/confirmation', { replace: true });
      }
    } catch (err) {
      console.error('Error verifying payment:', err);
      clearCheckoutState();
      navigate('/', { replace: true });
    } finally {
      setProcessing(false);
    }
  }, [processing, refreshUserData, completeOnboarding, queryClient, navigate]);

  useEffect(() => {
    const stripeReturn = isReturningFromStripe();
    const checkoutState = getCheckoutState();

    if (stripeReturn.canceled) {
      cleanCheckoutUrl();
      clearCheckoutState();
      if (checkoutState?.type === 'add-venue') {
        navigate('/mes-restaurants', { replace: true });
      }
      return;
    }

    if (stripeReturn.success && stripeReturn.sessionId && isAuthenticated && !processing) {
      verifyCheckout(stripeReturn.sessionId, checkoutState, stripeReturn.type);
    }
  }, [isAuthenticated, processing, verifyCheckout, navigate]);

  return null;
}

/**
 * All application routes.
 * Public routes are wrapped with PublicOnly (redirect auth'd users).
 * Protected routes are wrapped with RequireAuth + RequireOnboarding.
 */
function AppRoutes() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#5a03cf] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* ── Public routes ── */}
      <Route path="/" element={<PublicOnly><LandingPage /></PublicOnly>} />
      <Route path="/connexion" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/inscription" element={<PublicOnly><Register /></PublicOnly>} />
      <Route path="/parrainage-public" element={<PublicOnly><ReferralPage /></PublicOnly>} />
      <Route path="/presentation" element={<AppPresentation />} />

      {/* ── Onboarding routes (auth required, onboarding NOT complete) ── */}
      <Route path="/onboarding" element={<RequireAuth><OnboardingWelcome /></RequireAuth>} />
      <Route path="/onboarding/ajouter-restaurant" element={<RequireAuth><OnboardingAjouterRestaurant /></RequireAuth>} />
      <Route path="/onboarding/infos" element={<RequireAuth><OnboardingInfosEtablissement /></RequireAuth>} />
      <Route path="/onboarding/facturation" element={<RequireAuth><OnboardingFacturation /></RequireAuth>} />
      <Route path="/onboarding/paiement" element={<RequireAuth><OnboardingPaiementValidation /></RequireAuth>} />
      <Route path="/onboarding/confirmation" element={<RequireAuth><OnboardingConfirmationOnboarding /></RequireAuth>} />

      {/* ── Authenticated routes (with sidebar layout) ── */}
      <Route element={<RequireAuth><RequireOnboarding><AuthenticatedLayout /></RequireOnboarding></RequireAuth>}>
        <Route path="/tableau-de-bord" element={<Dashboard />} />
        <Route path="/matchs" element={<ListeMatchs />} />
        <Route path="/matchs/programmer" element={<ProgrammerMatch />} />
        <Route path="/mes-matchs" element={<MesMatchs />} />
        <Route path="/mes-matchs/:id" element={<MatchDetail />} />
        <Route path="/mes-matchs/:id/modifier" element={<ModifierMatch />} />
        <Route path="/mes-restaurants" element={<MesRestaurants />} />
        <Route path="/mes-restaurants/ajouter" element={<AjouterRestaurant />} />
        <Route path="/mes-restaurants/ajouter/infos" element={<InfosEtablissement />} />
        <Route path="/mes-restaurants/ajouter/facturation" element={<Facturation />} />
        <Route path="/mes-restaurants/ajouter/paiement" element={<PaiementValidation />} />
        <Route path="/mes-restaurants/ajouter/confirmation" element={<ConfirmationOnboarding />} />
        <Route path="/mes-restaurants/:id" element={<RestaurantDetail />} />
        <Route path="/mes-restaurants/:id/modifier" element={<ModifierRestaurant />} />
        <Route path="/booster" element={<Booster />} />
        <Route path="/booster/acheter" element={<AcheterBoosts />} />
        <Route path="/parrainage" element={<Parrainage />} />
        <Route path="/mes-avis" element={<MesAvis />} />
        <Route path="/compte" element={<Compte />} />
        <Route path="/compte/infos" element={<CompteInfos />} />
        <Route path="/compte/facturation" element={<CompteFacturation />} />
        <Route path="/compte/notifications" element={<CompteNotifications />} />
        <Route path="/compte/securite" element={<CompteSecurite />} />
        <Route path="/compte/donnees" element={<CompteDonnees />} />
        <Route path="/compte/aide" element={<CompteAide />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/notifications" element={<NotificationCenter />} />
        <Route path="/qr-scanner" element={<QRScanner />} />
      </Route>

      {/* ── Catch-all → redirect to landing ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
