/**
 * Route adapter components that bridge old prop-based page APIs
 * to React Router's URL-based navigation.
 *
 * Each adapter wraps the original page component, providing the
 * onNavigate / onBack / etc. props via useNavigate + useParams.
 *
 * These are used in App.tsx route definitions instead of the raw pages.
 */

import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/authentication/context/AuthContext';
import { useAppNavigate, resolvePagePath } from '../../hooks/useAppNavigate';
import type { PageType } from '../../types';

// ─── Auth pages ───────────────────────────────────────────────
import { LandingPage as RawLandingPage } from '../../features/authentication/pages/LandingPage';
import { Login as RawLogin } from '../../features/authentication/pages/Login';
import { Register as RawRegister } from '../../features/authentication/pages/Register';
import { ReferralPage as RawReferralPage } from '../../features/parrainage/pages/ReferralPage';
import { AppPresentation as RawAppPresentation } from '../../pages/app-presentation/AppPresentation';

// ─── Onboarding pages ─────────────────────────────────────────
import { OnboardingWelcome as RawOnboardingWelcome } from '../../features/onboarding/pages/OnboardingWelcome';
import { AjouterRestaurant as RawAjouterRestaurant } from '../../features/restaurants/pages/AjouterRestaurant';
import { InfosEtablissement as RawInfosEtablissement } from '../../features/onboarding/pages/InfosEtablissement';
import { Facturation as RawFacturation } from '../../features/onboarding/pages/Facturation';
import { PaiementValidation as RawPaiementValidation } from '../../features/onboarding/pages/PaiementValidation';
import { ConfirmationOnboarding as RawConfirmationOnboarding } from '../../features/onboarding/pages/ConfirmationOnboarding';

// ─── Dashboard & Matches ──────────────────────────────────────
import { Dashboard as RawDashboard } from '../../features/dashboard/pages/Dashboard';
import { ListeMatchs as RawListeMatchs } from '../../features/matches/pages/ListeMatchs';
import { MesMatchs as RawMesMatchs } from '../../features/matches/pages/MesMatchs';
import { MatchDetail as RawMatchDetail } from '../../features/matches/pages/MatchDetail';
import { ModifierMatch as RawModifierMatch } from '../../features/matches/pages/ModifierMatch';
import { ProgrammerMatch as RawProgrammerMatch } from '../../features/matches/pages/ProgrammerMatch';

// ─── Restaurants ──────────────────────────────────────────────
import { MesRestaurants as RawMesRestaurants } from '../../features/restaurants/pages/MesRestaurants';
import { RestaurantDetail as RawRestaurantDetail } from '../../features/restaurants/pages/RestaurantDetail';
import { ModifierRestaurant as RawModifierRestaurant } from '../../features/restaurants/pages/ModifierRestaurant';

// ─── Other pages ──────────────────────────────────────────────
import { Booster as RawBooster } from '../../features/booster/pages/Booster';
import { AcheterBoosts as RawAcheterBoosts } from '../../pages/acheter-boosts/AcheterBoosts';
import { Parrainage as RawParrainage } from '../../features/parrainage/pages/Parrainage';
import { MesAvis as RawMesAvis } from '../../features/avis/pages/MesAvis';
import { Compte as RawCompte } from '../../features/compte/pages/MonCompte';
import { CompteInfos as RawCompteInfos } from '../compte/CompteInfos';
import { CompteFacturation as RawCompteFacturation } from '../../../components/compte/CompteFacturation';
import { CompteNotifications as RawCompteNotifications } from '../compte/CompteNotifications';
import { CompteSecurite as RawCompteSecurite } from '../compte/CompteSecurite';
import { CompteDonnees as RawCompteDonnees } from '../compte/CompteDonnees';
import { CompteAide as RawCompteAide } from '../compte/CompteAide';
import { Reservations as RawReservations } from '../../features/reservations/pages/Reservations';
import { NotificationCenter as RawNotificationCenter } from '../../pages/notification-center/NotificationCenter';
import { QRScanner as RawQRScanner } from '../../features/reservations/pages/QRScanner';

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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PUBLIC / AUTH
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function LandingPage() {
  const navigate = useNavigate();
  return (
    <RawLandingPage
      onGetStarted={() => navigate('/connexion')}
      onReferral={() => navigate('/parrainage-public')}
      onAppPresentation={() => navigate('/presentation')}
    />
  );
}

export function Login() {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    const result = await login(email, password);
    return result.success;
  };

  const handleGoogleLogin = async (idToken: string): Promise<boolean> => {
    const result = await loginWithGoogle(idToken);
    return result.success;
  };

  return (
    <RawLogin
      onLogin={handleLogin}
      onGoogleLogin={handleGoogleLogin}
      onSwitchToRegister={() => navigate('/inscription')}
      onBackToLanding={() => navigate('/')}
    />
  );
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
      onSwitchToLogin={() => navigate('/connexion')}
      onBackToLanding={() => navigate('/')}
    />
  );
}

export function ReferralPage() {
  const navigate = useNavigate();
  return (
    <RawReferralPage
      onBackToLanding={() => navigate('/')}
      onGoToLogin={() => navigate('/connexion')}
    />
  );
}

export function AppPresentation() {
  const onNavigate = useOnNavigate();
  const goBack = useGoBack('/');
  return <RawAppPresentation onNavigate={onNavigate} onBack={goBack} />;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ONBOARDING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function OnboardingWelcome() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const onContinue = (page: PageType) => {
    if (page === 'ajouter-restaurant') navigate('/onboarding/ajouter-restaurant');
    else if (page === 'facturation') navigate('/onboarding/facturation');
    else navigate('/tableau-de-bord');
  };
  return (
    <RawOnboardingWelcome
      onContinue={onContinue}
      currentStep={currentUser?.onboardingStep || 'restaurant'}
      userName={currentUser?.prenom || ''}
    />
  );
}

export function OnboardingAjouterRestaurant() {
  const navigate = useNavigate();
  const onNavigate = (page: PageType) => {
    if (page === 'infos-etablissement') navigate('/onboarding/infos');
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
  const onNavigate = (page: PageType) => {
    if (page === 'paiement-validation') navigate('/onboarding/paiement');
    else navigate(resolvePagePath(page));
  };
  return (
    <RawInfosEtablissement
      onBack={() => navigate('/onboarding/ajouter-restaurant')}
      onNavigate={onNavigate}
    />
  );
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

export function OnboardingPaiementValidation() {
  const navigate = useNavigate();
  return (
    <RawPaiementValidation
      onBack={() => navigate('/onboarding/infos')}
      onNavigate={(page) => {
        if (page === 'confirmation-onboarding') navigate('/onboarding/confirmation');
        else navigate(resolvePagePath(page));
      }}
    />
  );
}

export function OnboardingConfirmationOnboarding() {
  const navigate = useNavigate();
  return (
    <RawConfirmationOnboarding
      onNavigate={(page) => {
        if (page === 'dashboard') navigate('/tableau-de-bord');
        else navigate(resolvePagePath(page));
      }}
    />
  );
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
  return <RawDashboard onNavigate={onNavigate} />;
}

export function ListeMatchs() {
  const goBack = useGoBack('/tableau-de-bord');
  return <RawListeMatchs onBack={goBack} />;
}

export function MesMatchs() {
  const onNavigate = useOnNavigate();
  return <RawMesMatchs onNavigate={onNavigate} />;
}

export function MatchDetail() {
  const { id } = useParams<{ id: string }>();
  const goBack = useGoBack('/mes-matchs');
  const navigate = useNavigate();
  const onNavigate = useOnNavigate();
  return (
    <RawMatchDetail
      matchId={id ? Number(id) : null}
      onBack={goBack}
      onEditMatch={() => navigate(`/mes-matchs/${id}/modifier`)}
      onNavigate={onNavigate}
    />
  );
}

export function ModifierMatch() {
  const { id } = useParams<{ id: string }>();
  const goBack = useGoBack('/mes-matchs');
  return <RawModifierMatch matchId={id ?? null} onBack={goBack} />;
}

export function ProgrammerMatch() {
  const goBack = useGoBack('/tableau-de-bord');
  return <RawProgrammerMatch onBack={goBack} />;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RESTAURANTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function MesRestaurants() {
  const onNavigate = useOnNavigate();
  return <RawMesRestaurants onNavigate={onNavigate} />;
}

export function AjouterRestaurant() {
  const navigate = useNavigate();
  return (
    <RawAjouterRestaurant
      onBack={() => navigate('/mes-restaurants')}
      onNavigate={(page) => {
        if (page === 'infos-etablissement') navigate('/mes-restaurants/ajouter/infos');
        else navigate(resolvePagePath(page));
      }}
    />
  );
}

export function InfosEtablissement() {
  const navigate = useNavigate();
  return (
    <RawInfosEtablissement
      onBack={() => navigate('/mes-restaurants/ajouter')}
      onNavigate={(page) => {
        if (page === 'paiement-validation') navigate('/mes-restaurants/ajouter/paiement');
        else navigate(resolvePagePath(page));
      }}
      isAddingVenue={true}
    />
  );
}

export function Facturation() {
  const navigate = useNavigate();
  return (
    <RawFacturation
      onBack={() => navigate('/mes-restaurants/ajouter')}
      onNavigate={(page) => navigate(resolvePagePath(page))}
    />
  );
}

export function PaiementValidation() {
  const navigate = useNavigate();
  return (
    <RawPaiementValidation
      onBack={() => navigate('/mes-restaurants/ajouter/infos')}
      onNavigate={(page) => {
        if (page === 'confirmation-onboarding') navigate('/mes-restaurants/ajouter/confirmation');
        else navigate(resolvePagePath(page));
      }}
      isAddingVenue={true}
    />
  );
}

export function ConfirmationOnboarding() {
  const navigate = useNavigate();
  return (
    <RawConfirmationOnboarding
      onNavigate={(page) => {
        if (page === 'dashboard') navigate('/tableau-de-bord');
        else if (page === 'mes-restaurants') navigate('/mes-restaurants');
        else navigate(resolvePagePath(page));
      }}
      isAddingVenue={true}
    />
  );
}

export function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const goBack = useGoBack('/mes-restaurants');
  return <RawRestaurantDetail restaurantId={id ? Number(id) : null} onBack={goBack} />;
}

export function ModifierRestaurant() {
  const { id } = useParams<{ id: string }>();
  const goBack = useGoBack('/mes-restaurants');
  return <RawModifierRestaurant restaurantId={id ? Number(id) : null} onBack={goBack} />;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// OTHER PAGES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function Booster() {
  const goBack = useGoBack('/tableau-de-bord');
  const onNavigate = useOnNavigate();
  const [searchParams] = useSearchParams();
  const purchaseSuccess = searchParams.get('success') === 'true';
  const purchasedCount = Number(searchParams.get('count')) || 0;
  return <RawBooster onBack={goBack} onNavigate={onNavigate} purchaseSuccess={purchaseSuccess} purchasedCount={purchasedCount} />;
}

export function AcheterBoosts() {
  const goBack = useGoBack('/booster');
  return <RawAcheterBoosts onBack={goBack} />;
}

export function Parrainage() {
  const goBack = useGoBack('/tableau-de-bord');
  return <RawParrainage onBack={goBack} />;
}

export function MesAvis() {
  const goBack = useGoBack('/tableau-de-bord');
  return <RawMesAvis onBack={goBack} />;
}

export function Compte() {
  const onNavigate = useOnNavigate();
  return <RawCompte onNavigate={onNavigate} />;
}

export function CompteInfos() {
  const goBack = useGoBack('/compte');
  return <RawCompteInfos onBack={goBack} />;
}

export function CompteFacturation() {
  const goBack = useGoBack('/compte');
  const onNavigate = useOnNavigate();
  return <RawCompteFacturation onBack={goBack} onNavigate={onNavigate} />;
}

export function CompteNotifications() {
  const goBack = useGoBack('/compte');
  const onNavigate = useOnNavigate();
  return <RawCompteNotifications onBack={goBack} onNavigate={onNavigate} />;
}

export function CompteSecurite() {
  const goBack = useGoBack('/compte');
  const onNavigate = useOnNavigate();
  return <RawCompteSecurite onBack={goBack} onNavigate={onNavigate} />;
}

export function CompteDonnees() {
  const goBack = useGoBack('/compte');
  const onNavigate = useOnNavigate();
  return <RawCompteDonnees onBack={goBack} onNavigate={onNavigate} />;
}

export function CompteAide() {
  const goBack = useGoBack('/compte');
  const onNavigate = useOnNavigate();
  return <RawCompteAide onBack={goBack} onNavigate={onNavigate} />;
}

export function Reservations() {
  const onNavigate = useOnNavigate();
  const [searchParams] = useSearchParams();
  const matchId = searchParams.get('matchId') || undefined;
  return <RawReservations onNavigate={onNavigate} matchId={matchId} />;
}

export function NotificationCenter() {
  const onNavigate = useOnNavigate();
  return <RawNotificationCenter onNavigate={onNavigate} />;
}

export function QRScanner() {
  const goBack = useGoBack('/tableau-de-bord');
  const onNavigate = useOnNavigate();
  return <RawQRScanner onBack={goBack} onNavigate={onNavigate} />;
}
