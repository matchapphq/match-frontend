import { useEffect, useCallback, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../features/authentication/context/AuthContext';
import { AppProvider } from '../context/AppContext';
import { ThemeProvider } from '../features/theme/context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';
import { ToastProvider } from '../context/ToastContext';
import apiClient from '../api/client';
import { SeoManager } from '../components/seo/SeoManager';
import {
  getCheckoutState,
  clearCheckoutState,
  isReturningFromStripe,
  cleanCheckoutUrl,
  CheckoutState,
  savePendingPaymentVenueId,
} from '../utils/checkout-state';

// Route guards & layout
import { RequireAuth } from '../components/routing/RequireAuth';
import { RequireOnboarding } from '../components/routing/RequireOnboarding';
import { RequirePaymentMethod } from '../components/routing/RequirePaymentMethod';
import { PublicOnly } from '../components/routing/PublicOnly';
import { AuthenticatedLayout } from '../components/routing/AuthenticatedLayout';

// Route-adapted page components (bridge old props → React Router)
import {
  LandingPage,
  Login,
  Register,
  ForgotPassword,
  ReferralPage,
  AppPresentation,
  Terms,
  Privacy,
  Cgv,
  OnboardingWelcome,
  OnboardingInfosEtablissement,
  OnboardingFacturation,
  OnboardingConfirmationOnboarding,
  OnboardingPaymentRequired,
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
                <SeoManager />
                <ScrollToTop />
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
 * Resets window scroll position on route changes.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

/**
 * Handles Stripe checkout returns by reading URL params
 * and verifying the payment before redirecting.
 */
function StripeReturnHandler() {
  const { isAuthenticated, refreshUserData } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const handledReturnSessionIds = useRef<Set<string>>(new Set());

  const handlePaymentSetupReturn = useCallback(async (
    checkoutState: CheckoutState | null,
    options?: { autoContinue?: boolean },
  ) => {
    if (checkoutState?.venueId) {
      savePendingPaymentVenueId(checkoutState.venueId);
    }
    cleanCheckoutUrl();
    clearCheckoutState();
    await refreshUserData();
    await queryClient.invalidateQueries({ queryKey: ['partner-venues'] });
    await queryClient.invalidateQueries({ queryKey: ['billing-payment-method'] });

    const params = new URLSearchParams();
    if (checkoutState?.venueId) {
      params.set('venue', checkoutState.venueId);
    }
    if (options?.autoContinue) {
      params.set('autocontinue', '1');
    }
    const query = params.toString();
    navigate(`/onboarding/payment-required${query ? `?${query}` : ''}`, { replace: true });
  }, [navigate, queryClient, refreshUserData]);

  const verifyCheckout = useCallback(async (
    stripeSessionId: string,
    checkoutState: CheckoutState | null,
    checkoutType: 'venue' | 'boost' | null,
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
        navigate('/boost?success=true', { replace: true });
        return;
      }

      if (checkoutState?.type === 'payment-setup') {
        await handlePaymentSetupReturn(checkoutState, { autoContinue: true });
        return;
      }

      console.warn('Ignoring legacy checkout return session', stripeSessionId, checkoutState);
      cleanCheckoutUrl();
      clearCheckoutState();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Error verifying payment:', err);
      clearCheckoutState();
      navigate('/', { replace: true });
    } finally {
      setProcessing(false);
    }
  }, [processing, refreshUserData, queryClient, navigate, handlePaymentSetupReturn]);

  useEffect(() => {
    const stripeReturn = isReturningFromStripe();
    const checkoutState = getCheckoutState();

    if (stripeReturn.canceled) {
      if (checkoutState?.type === 'payment-setup') {
        void handlePaymentSetupReturn(checkoutState);
        return;
      }

      cleanCheckoutUrl();
      clearCheckoutState();
      if (checkoutState?.type === 'add-venue') {
        navigate('/my-venues', { replace: true });
      }
      return;
    }

    if (stripeReturn.success && stripeReturn.sessionId && isAuthenticated && !processing) {
      if (handledReturnSessionIds.current.has(stripeReturn.sessionId)) {
        return;
      }
      handledReturnSessionIds.current.add(stripeReturn.sessionId);
      verifyCheckout(stripeReturn.sessionId, checkoutState, stripeReturn.type);
      return;
    }
  }, [isAuthenticated, processing, verifyCheckout, navigate, handlePaymentSetupReturn]);

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
      <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />
      <Route path="/forgot-password" element={<PublicOnly><ForgotPassword /></PublicOnly>} />
      <Route path="/public-referral" element={<PublicOnly><ReferralPage /></PublicOnly>} />
      <Route path="/presentation" element={<AppPresentation />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms-of-sale" element={<Cgv />} />

      {/* ── Onboarding routes (auth required, onboarding NOT complete) ── */}
      <Route path="/onboarding" element={<RequireAuth><OnboardingWelcome /></RequireAuth>} />
      <Route path="/onboarding/add-venue" element={<RequireAuth><Navigate to="/onboarding/info" replace /></RequireAuth>} />
      <Route path="/onboarding/info" element={<RequireAuth><OnboardingInfosEtablissement /></RequireAuth>} />
      <Route path="/onboarding/billing" element={<RequireAuth><OnboardingFacturation /></RequireAuth>} />
      <Route path="/onboarding/confirmation" element={<RequireAuth><OnboardingConfirmationOnboarding /></RequireAuth>} />
      <Route path="/onboarding/payment-required" element={<RequireAuth><OnboardingPaymentRequired /></RequireAuth>} />

      {/* ── Authenticated routes (with sidebar layout) ── */}
      <Route element={<RequireAuth><RequirePaymentMethod><RequireOnboarding><AuthenticatedLayout /></RequireOnboarding></RequirePaymentMethod></RequireAuth>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/matches" element={<ListeMatchs />} />
        <Route path="/matches/schedule" element={<ProgrammerMatch />} />
        <Route path="/my-matches" element={<MesMatchs />} />
        <Route path="/my-matches/:id" element={<MatchDetail />} />
        <Route path="/my-matches/:id/edit" element={<ModifierMatch />} />
        <Route path="/my-venues" element={<MesRestaurants />} />
        <Route path="/my-venues/add" element={<AjouterRestaurant />} />
        <Route path="/my-venues/add/info" element={<InfosEtablissement />} />
        <Route path="/my-venues/add/billing" element={<Facturation />} />
        <Route path="/my-venues/add/confirmation" element={<ConfirmationOnboarding />} />
        <Route path="/my-venues/:id" element={<RestaurantDetail />} />
        <Route path="/my-venues/:id/edit" element={<ModifierRestaurant />} />
        <Route path="/boost" element={<Booster />} />
        <Route path="/boost/purchase" element={<AcheterBoosts />} />
        <Route path="/referral" element={<Parrainage />} />
        <Route path="/my-reviews" element={<MesAvis />} />
        <Route path="/account" element={<Compte />} />
        <Route path="/account/info" element={<CompteInfos />} />
        <Route path="/account/billing" element={<CompteFacturation />} />
        <Route path="/account/notifications" element={<CompteNotifications />} />
        <Route path="/account/security" element={<CompteSecurite />} />
        <Route path="/account/data" element={<CompteDonnees />} />
        <Route path="/account/help" element={<CompteAide />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/notifications" element={<NotificationCenter />} />
        <Route path="/qr-scanner" element={<QRScanner />} />
      </Route>

      {/* ── Catch-all → redirect to landing ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
