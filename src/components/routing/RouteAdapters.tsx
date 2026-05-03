/**
 * Route adapter components that bridge old prop-based page APIs
 * to React Router's URL-based navigation.
 *
 * Each adapter wraps the original page component, providing the
 * onNavigate / onBack / etc. props via useNavigate + useParams.
 *
 * These are used in App.tsx route definitions instead of the raw pages.
 */

import { lazy, Suspense } from 'react';
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/authentication/context/AuthContext';
import { useAppNavigate, resolvePagePath } from '../../hooks/useAppNavigate';
import type { PageType } from '../../types';

// ─── Auth pages ───────────────────────────────────────────────
import { LandingPage as RawLandingPage } from '../../features/authentication/pages/LandingPage';
import { Login as RawLogin } from '../../features/authentication/pages/Login';
import { Register as RawRegister } from '../../features/authentication/pages/Register';
import { ForgotPassword as RawForgotPassword } from '../../features/authentication/pages/ForgotPassword';
import { ReferralPage as RawReferralPage } from '../../features/parrainage/pages/ReferralPage';
import { AppPresentation as RawAppPresentation } from '../../features/presentation/pages/AppPresentation';
import { Terms as RawTerms } from '../../features/legal/pages/Terms';
import { Privacy as RawPrivacy } from '../../features/legal/pages/Privacy';
import { Cgv as RawCgv } from '../../features/legal/pages/Cgv';

// ─── Onboarding pages ─────────────────────────────────────────
import { OnboardingWelcome as RawOnboardingWelcome } from '../../features/onboarding/pages/OnboardingWelcome';
import { AjouterRestaurant as RawAjouterRestaurant } from '../../features/restaurants/pages/AjouterRestaurant';
import { InfosEtablissement as RawInfosEtablissement } from '../../features/onboarding/pages/InfosEtablissement';
import { ConfigurerHorairesLieu as RawConfigurerHorairesLieu } from '../../features/onboarding/pages/ConfigurerHorairesLieu';
import { Facturation as RawFacturation } from '../../features/onboarding/pages/Facturation';
import { ConfirmationOnboarding as RawConfirmationOnboarding } from '../../features/onboarding/pages/ConfirmationOnboarding';
import { PaymentRequired as RawPaymentRequired } from '../../features/onboarding/pages/PaymentRequired';

// ─── Dashboard & Matches (lazy) ───────────────────────────────
const RawDashboard = lazy(() => import('../../features/dashboard/pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const RawListeMatchs = lazy(() => import('../../features/matches/pages/ListeMatchs').then((m) => ({ default: m.ListeMatchs })));
const RawMesMatchs = lazy(() => import('../../features/matches/pages/MesMatchs').then((m) => ({ default: m.MesMatchs })));
const RawMatchDetail = lazy(() => import('../../features/matches/pages/MatchDetail').then((m) => ({ default: m.MatchDetail })));
const RawModifierMatch = lazy(() => import('../../features/matches/pages/ModifierMatch').then((m) => ({ default: m.ModifierMatch })));
const RawProgrammerMatch = lazy(() => import('../../features/matches/pages/ProgrammerMatch').then((m) => ({ default: m.ProgrammerMatch })));

// ─── Restaurants (lazy) ───────────────────────────────────────
const RawMesRestaurants = lazy(() => import('../../features/restaurants/pages/MesRestaurants').then((m) => ({ default: m.MesRestaurants })));
const RawRestaurantDetail = lazy(() => import('../../features/restaurants/pages/RestaurantDetail').then((m) => ({ default: m.RestaurantDetail })));
const RawModifierRestaurant = lazy(() => import('../../features/restaurants/pages/ModifierRestaurant').then((m) => ({ default: m.ModifierRestaurant })));

// ─── Other pages (lazy) ───────────────────────────────────────
const RawBoostMaintenance = lazy(() => import('../../features/booster/pages/BoostMaintenance').then((m) => ({ default: m.BoostMaintenance })));
const RawReferralMaintenance = lazy(() => import('../../features/parrainage/pages/ReferralMaintenance').then((m) => ({ default: m.ReferralMaintenance })));
const RawMesAvis = lazy(() => import('../../features/avis/pages/MesAvis').then((m) => ({ default: m.MesAvis })));
const RawCompte = lazy(() => import('../../features/compte/pages/MonCompte').then((m) => ({ default: m.Compte })));
const RawCompteInfos = lazy(() => import('../compte/CompteInfos').then((m) => ({ default: m.CompteInfos })));
const RawCompteFacturation = lazy(() => import('../compte/CompteFacturation').then((m) => ({ default: m.CompteFacturation })));
const RawCompteNotifications = lazy(() => import('../compte/CompteNotifications').then((m) => ({ default: m.CompteNotifications })));
const RawCompteSecurite = lazy(() => import('../compte/CompteSecurite').then((m) => ({ default: m.CompteSecurite })));
const RawCompteDonnees = lazy(() => import('../compte/CompteDonnees').then((m) => ({ default: m.CompteDonnees })));
const RawCompteAide = lazy(() => import('../compte/CompteAide').then((m) => ({ default: m.CompteAide })));
const RawReservations = lazy(() => import('../../features/reservations/pages/Reservations').then((m) => ({ default: m.Reservations })));
const RawNotificationCenter = lazy(() => import('../../features/notifications/pages/NotificationCenter').then((m) => ({ default: m.NotificationCenter })));
const RawQRScanner = lazy(() => import('../../features/reservations/pages/QRScanner').then((m) => ({ default: m.QRScanner })));

// ─── Helpers ──────────────────────────────────────────────────

/** Standard onNavigate prop adapter: resolves PageType → URL and navigates */
function useOnNavigate() {
  const { navigateTo } = useAppNavigate();
  return (page: PageType, matchId?: number | string, restaurantId?: number) => {
    navigateTo(page, { matchId: matchId ?? null, restaurantId: restaurantId ?? null });
  };
}

function useGoBack(fallback?: string) {
  const navigate = useNavigate();
  return () => navigate(fallback ?? -1 as any);
}

function RouteChunk({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#5a03cf] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PUBLIC / AUTH
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function LandingPage() {
  const navigate = useNavigate();
  return (
    <RawLandingPage
      onGetStarted={() => navigate('/login')}
      onAppPresentation={() => navigate('/presentation')}
    />
  );
}

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    const result = await login(email, password);
    return result.success;
  };

  return (
    <RawLogin
      onLogin={handleLogin}
      onSwitchToRegister={() => navigate('/register')}
      onForgotPassword={() => navigate('/forgot-password')}
      onBackToLanding={() => navigate('/')}
    />
  );
}

export function ForgotPassword() {
  const navigate = useNavigate();
  return <RawForgotPassword onBackToLogin={() => navigate('/login')} />;
}

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (formData: any): Promise<boolean> => {
    const result = await register(formData);
    return result.success;
  };

  return (
    <RawRegister
      onRegister={handleRegister}
      onSwitchToLogin={() => navigate('/login')}
      onBackToLanding={() => navigate('/')}
    />
  );
}

export function ReferralPage() {
  const navigate = useNavigate();
  return (
    <RawReferralPage
      onBackToLanding={() => navigate('/')}
      onGoToLogin={() => navigate('/login')}
    />
  );
}

export function AppPresentation() {
  return <RawAppPresentation />;
}

export function Terms() {
  return <RawTerms />;
}

export function Privacy() {
  return <RawPrivacy />;
}

export function Cgv() {
  return <RawCgv />;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ONBOARDING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function OnboardingWelcome() {
  const navigate = useNavigate();
  const { currentUser, skipOnboardingPaymentSetup } = useAuth();
  const onContinue = (page: PageType) => {
    if (page === 'ajouter-restaurant') navigate('/onboarding/info');
    else if (page === 'facturation') {
      navigate(currentUser?.hasPaymentMethod ? '/onboarding/billing' : '/onboarding/payment-required');
    }
    else navigate('/dashboard');
  };
  const onSkipPaymentSetup = async () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    await skipOnboardingPaymentSetup();
    navigate('/onboarding', { replace: true });
  };
  return (
    <RawOnboardingWelcome
      onContinue={onContinue}
      onSkipPaymentSetup={onSkipPaymentSetup}
      currentStep={currentUser?.onboardingStep || 'restaurant'}
      userName={currentUser?.prenom || ''}
    />
  );
}

export function OnboardingAjouterRestaurant() {
  const navigate = useNavigate();
  const onNavigate = (page: PageType) => {
    if (page === 'infos-etablissement') navigate('/onboarding/info');
    else navigate(resolvePagePath(page));
  };
  return (
    <RawAjouterRestaurant
      onBack={() => navigate('/onboarding')}
      onNavigate={onNavigate}
      isOnboarding={true}
    />
  );
}

export function OnboardingInfosEtablissement() {
  const navigate = useNavigate();
  return (
    <RawInfosEtablissement
      onBack={() => navigate('/onboarding')}
    />
  );
}

export function OnboardingConfigurerHorairesLieu() {
  return <RawConfigurerHorairesLieu isOnboarding={true} />;
}

export function OnboardingFacturation() {
  const navigate = useNavigate();
  return (
    <RawFacturation
      onBack={() => navigate('/onboarding')}
      onNavigate={(page) => navigate(resolvePagePath(page))}
      isOnboarding={true}
    />
  );
}

export function OnboardingConfirmationOnboarding() {
  const navigate = useNavigate();
  return (
    <RawConfirmationOnboarding
      onNavigate={(page) => {
        if (page === 'dashboard') navigate('/dashboard');
        else navigate(resolvePagePath(page));
      }}
    />
  );
}

export function OnboardingPaymentRequired() {
  return <RawPaymentRequired />;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DASHBOARD & MATCHES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function Dashboard() {
  const { navigateTo } = useAppNavigate();
  const navigate = useNavigate();
  const onNavigate = (page: PageType, matchId?: number | string, restaurantId?: number, filter?: string) => {
    const path = resolvePagePath(page, { matchId: matchId ?? null, restaurantId: restaurantId ?? null });
    if (filter) {
      navigate(`${path}?filter=${encodeURIComponent(filter)}`);
    } else {
      navigate(path);
    }
  };
  return <RouteChunk><RawDashboard onNavigate={onNavigate} /></RouteChunk>;
}

export function ListeMatchs() {
  const goBack = useGoBack('/dashboard');
  return <RouteChunk><RawListeMatchs onBack={goBack} /></RouteChunk>;
}

export function MesMatchs() {
  const onNavigate = useOnNavigate();
  return <RouteChunk><RawMesMatchs onNavigate={onNavigate} /></RouteChunk>;
}

export function MatchDetail() {
  const { id } = useParams<{ id: string }>();
  const goBack = useGoBack('/my-matches');
  const navigate = useNavigate();
  const onNavigate = useOnNavigate();
  return (
    <RouteChunk><RawMatchDetail
      matchId={id ? Number(id) : null}
      onBack={goBack}
      onEditMatch={() => navigate(`/my-matches/${id}/edit`)}
      onNavigate={onNavigate}
    /></RouteChunk>
  );
}

export function ModifierMatch() {
  const { id } = useParams<{ id: string }>();
  const goBack = useGoBack('/my-matches');
  return <RouteChunk><RawModifierMatch matchId={id ?? null} onBack={goBack} /></RouteChunk>;
}

export function ProgrammerMatch() {
  const navigate = useNavigate();
  const goBack = () => {
    const historyState = window.history.state as { idx?: number } | null;
    if (typeof historyState?.idx === 'number' && historyState.idx > 0) {
      navigate(-1);
      return;
    }
    navigate('/dashboard');
  };
  return <RouteChunk><RawProgrammerMatch onBack={goBack} /></RouteChunk>;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RESTAURANTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function MesRestaurants() {
  const onNavigate = useOnNavigate();
  return <RouteChunk><RawMesRestaurants onNavigate={onNavigate} /></RouteChunk>;
}

export function AjouterRestaurant() {
  const navigate = useNavigate();
  return (
    <RawAjouterRestaurant
      onBack={() => navigate('/my-venues')}
      onNavigate={(page) => {
        if (page === 'infos-etablissement') navigate('/my-venues/add/info');
        else navigate(resolvePagePath(page));
      }}
    />
  );
}

export function InfosEtablissement() {
  const navigate = useNavigate();
  return (
    <RawInfosEtablissement
      onBack={() => navigate('/my-venues')}
      isAddingVenue={true}
    />
  );
}

export function ConfigurerHorairesLieu() {
  return <RawConfigurerHorairesLieu />;
}

export function Facturation() {
  const navigate = useNavigate();
  return (
    <RawFacturation
      onBack={() => navigate('/my-venues/add')}
      onNavigate={(page: PageType) => navigate(resolvePagePath(page))}
    />
  );
}

export function ConfirmationOnboarding() {
  const navigate = useNavigate();
  return (
    <RawConfirmationOnboarding
      onNavigate={(page) => {
        if (page === 'dashboard') navigate('/dashboard');
        else if (page === 'mes-restaurants') navigate('/my-venues');
        else navigate(resolvePagePath(page));
      }}
      isAddingVenue={true}
    />
  );
}

export function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const goBack = useGoBack('/my-venues');
  const navigate = useNavigate();

  const onNavigate = (page: string) => {
    if (page === 'modifier-restaurant' && id) {
      navigate(resolvePagePath('modifier-restaurant', { restaurantId: id }));
      return;
    }

    if (page === 'mes-matchs') {
      navigate(resolvePagePath('mes-matchs'));
      return;
    }

    if (page === 'dashboard') {
      navigate(resolvePagePath('dashboard'));
    }
  };

  return <RouteChunk><RawRestaurantDetail restaurantId={id ?? null} onBack={goBack} onNavigate={onNavigate} /></RouteChunk>;
}

export function ModifierRestaurant() {
  const { id } = useParams<{ id: string }>();
  const goBack = useGoBack(id ? `/my-venues/${id}` : '/my-venues');
  return <RouteChunk><RawModifierRestaurant restaurantId={id ?? null} onBack={goBack} /></RouteChunk>;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// OTHER PAGES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function Booster() {
  const goBack = useGoBack('/dashboard');
  return <RouteChunk><RawBoostMaintenance onBack={goBack} /></RouteChunk>;
}

export function AcheterBoosts() {
  const goBack = useGoBack('/boost');
  return <RouteChunk><RawBoostMaintenance onBack={goBack} /></RouteChunk>;
}

export function Parrainage() {
  const goBack = useGoBack('/dashboard');
  return <RouteChunk><RawReferralMaintenance onBack={goBack} /></RouteChunk>;
}

export function MesAvis() {
  const goBack = useGoBack('/dashboard');
  return <RouteChunk><RawMesAvis onBack={goBack} /></RouteChunk>;
}

export function Compte() {
  const onNavigate = useOnNavigate();
  return <RouteChunk><RawCompte onNavigate={onNavigate} /></RouteChunk>;
}

export function CompteInfos() {
  const goBack = useGoBack('/account');
  return <RouteChunk><RawCompteInfos onBack={goBack} /></RouteChunk>;
}

export function CompteFacturation() {
  const goBack = useGoBack('/account');
  const onNavigate = useOnNavigate();
  return <RouteChunk><RawCompteFacturation onBack={goBack} onNavigate={onNavigate} /></RouteChunk>;
}

export function CompteNotifications() {
  const goBack = useGoBack('/account');
  const onNavigate = useOnNavigate();
  return <RouteChunk><RawCompteNotifications onBack={goBack} onNavigate={onNavigate} /></RouteChunk>;
}

export function CompteSecurite() {
  const goBack = useGoBack('/account');
  const onNavigate = useOnNavigate();
  return <RouteChunk><RawCompteSecurite onBack={goBack} onNavigate={onNavigate} /></RouteChunk>;
}

export function CompteDonnees() {
  const goBack = useGoBack('/account');
  const onNavigate = useOnNavigate();
  return <RouteChunk><RawCompteDonnees onBack={goBack} onNavigate={onNavigate} /></RouteChunk>;
}

export function CompteAide() {
  const goBack = useGoBack('/account');
  const onNavigate = useOnNavigate();
  return <RouteChunk><RawCompteAide onBack={goBack} onNavigate={onNavigate} /></RouteChunk>;
}

export function Reservations() {
  const onNavigate = useOnNavigate();
  const [searchParams] = useSearchParams();
  const matchId = searchParams.get('matchId') || undefined;
  return <RouteChunk><RawReservations onNavigate={onNavigate} matchId={matchId} /></RouteChunk>;
}

export function NotificationCenter() {
  const onNavigate = useOnNavigate();
  return <RouteChunk><RawNotificationCenter onNavigate={onNavigate} /></RouteChunk>;
}

export function QRScanner() {
  const goBack = useGoBack('/dashboard');
  const onNavigate = useOnNavigate();
  return <RouteChunk><RawQRScanner onBack={goBack} onNavigate={onNavigate} /></RouteChunk>;
}
