import { useState } from 'react';
import { QRScanner } from '../features/reservations/pages/QRScanner';
import { QrCode } from 'lucide-react';
import { AuthProvider, useAuth } from '../features/authentication/context/AuthContext';
import { AppProvider } from '../context/AppContext';
import { ThemeProvider } from '../features/theme/context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';
import { ToastProvider } from '../context/ToastContext';
import { CompteInfos } from '../components/compte/CompteInfos';
import { CompteFacturation } from '../../components/compte/CompteFacturation';
import { Dashboard } from '../features/dashboard/pages/Dashboard';
import { LandingPage } from '../features/authentication/pages/LandingPage';
import { Login } from '../features/authentication/pages/Login';
import { Register } from '../features/authentication/pages/Register';
import { ListeMatchs } from '../features/matches/pages/ListeMatchs';
import { MatchDetail } from '../features/matches/pages/MatchDetail';
import { MesMatchs } from '../features/matches/pages/MesMatchs';
import { MesRestaurants } from '../features/restaurants/pages/MesRestaurants';
import { RestaurantDetail } from '../features/restaurants/pages/RestaurantDetail';
import { ProgrammerMatch } from '../features/matches/pages/ProgrammerMatch';
import { ModifierMatch } from '../features/matches/pages/ModifierMatch';
import { AjouterRestaurant } from '../features/restaurants/pages/AjouterRestaurant';
import { ModifierRestaurant } from '../features/restaurants/pages/ModifierRestaurant';
import { Booster } from '../features/booster/pages/Booster';
import { AcheterBoosts } from '../pages/acheter-boosts/AcheterBoosts';
import { Parrainage } from '../features/parrainage/pages/Parrainage';
import { MesAvis } from '../features/avis/pages/MesAvis';
import { Compte } from '../features/compte/pages/MonCompte';
import { InfosEtablissement } from '../features/onboarding/pages/InfosEtablissement';
import { Facturation } from '../features/onboarding/pages/Facturation';
import { OnboardingWelcome } from '../features/onboarding/pages/OnboardingWelcome';
import { ConfirmationOnboarding } from '../features/onboarding/pages/ConfirmationOnboarding';
import { PaiementValidation } from '../features/onboarding/pages/PaiementValidation';
import { AppPresentation } from '../pages/app-presentation/AppPresentation';
import { ReferralPage } from '../features/parrainage/pages/ReferralPage';
import { Sidebar } from '../components/layout/Sidebar';
import { CompteNotifications } from '../components/compte/CompteNotifications';
import { CompteSecurite } from '../components/compte/CompteSecurite';
import { CompteDonnees } from '../components/compte/CompteDonnees';
import { CompteAide } from '../components/compte/CompteAide';
import { Reservations } from '../features/reservations/pages/Reservations';
import { NotificationCenter } from '../pages/notification-center/NotificationCenter';
import { NotificationBell } from '../components/layout/NotificationBell';
import { NotificationBanner } from '../components/NotificationBanner';
import { PageType } from '../types';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <LanguageProvider>
            <ToastProvider>
              <AppContent />
            </ToastProvider>
          </LanguageProvider>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const { isAuthenticated, login, register, currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [defaultMatchFilter, setDefaultMatchFilter] = useState<'tous' | 'à venir' | 'terminé'>('à venir');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | null>(null);
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [authView, setAuthView] = useState<'landing' | 'login' | 'register' | 'referral'>('landing');
  
  // États pour le parcours de souscription
  const [selectedFormule, setSelectedFormule] = useState<'mensuel' | 'annuel'>('mensuel');
  const [nomBarOnboarding, setNomBarOnboarding] = useState<string>('');
  
  // État pour la navigation non authentifiée
  const [unauthPage, setUnauthPage] = useState<'landing' | 'app-presentation' | null>(null);

  // Gestion de l'inscription avec redirection vers "ajouter-restaurant"
  const handleRegister = (data: any) => {
    const success = register(data);
    if (success) {
      // L'utilisateur sera redirigé vers l'écran d'onboarding automatiquement
      setCurrentPage('ajouter-restaurant');
    }
    return success;
  };

  // Si l'utilisateur n'est pas authentifié, afficher la landing page, connexion ou inscription
  if (!isAuthenticated) {
    // Afficher la page de présentation de l'app si demandé
    if (unauthPage === 'app-presentation') {
      return (
        <AppPresentation 
          onNavigate={(page) => {
            if (page === 'dashboard') {
              setUnauthPage(null);
              setAuthView('landing');
            }
          }}
          onBack={() => {
            setUnauthPage(null);
            setAuthView('landing');
          }}
        />
      );
    }
    
    if (authView === 'referral') {
      return (
        <ReferralPage 
          onBackToLanding={() => setAuthView('landing')}
          onGoToLogin={() => setAuthView('login')}
        />
      );
    }
    if (authView === 'landing') {
      return (
        <LandingPage 
          onGetStarted={() => setAuthView('login')}
          onReferral={() => setAuthView('referral')}
          onAppPresentation={() => setUnauthPage('app-presentation')}
        />
      );
    }
    if (authView === 'register') {
      return (
        <Register
          onRegister={handleRegister}
          onSwitchToLogin={() => setAuthView('login')}
          onBackToLanding={() => setAuthView('landing')}
        />
      );
    }
    return (
      <Login
        onLogin={login}
        onSwitchToRegister={() => setAuthView('register')}
        onBackToLanding={() => setAuthView('landing')}
      />
    );
  }

  // Si l'utilisateur est authentifié mais n'a pas complété son onboarding
  if (currentUser && !currentUser.hasCompletedOnboarding) {
    // Afficher l'écran d'onboarding approprié selon l'étape
    if (currentPage === 'ajouter-restaurant') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#5a03cf]/10 via-gray-50 to-[#9cff02]/10">
          <AjouterRestaurant 
            onBack={() => {
              // Retour vers l'écran de bienvenue onboarding
              setCurrentPage('dashboard'); // Cela déclenchera l'affichage de OnboardingWelcome
            }} 
            onNavigate={setCurrentPage}
            onFormuleSelected={(formule) => setSelectedFormule(formule)}
            isOnboarding={true}
          />
        </div>
      );
    } else if (currentPage === 'infos-etablissement') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#5a03cf]/10 via-gray-50 to-[#9cff02]/10">
          <InfosEtablissement 
            onBack={() => setCurrentPage('ajouter-restaurant')} 
            onNavigate={setCurrentPage}
            selectedFormule={selectedFormule}
            onBarInfoSubmit={(nom) => setNomBarOnboarding(nom)}
          />
        </div>
      );
    } else if (currentPage === 'paiement-validation') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#5a03cf]/10 via-gray-50 to-[#9cff02]/10">
          <PaiementValidation 
            onBack={() => setCurrentPage('infos-etablissement')} 
            onNavigate={setCurrentPage}
            selectedFormule={selectedFormule}
            nomBar={nomBarOnboarding}
          />
        </div>
      );
    } else if (currentPage === 'confirmation-onboarding') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#5a03cf]/10 via-gray-50 to-[#9cff02]/10">
          <ConfirmationOnboarding 
            onNavigate={setCurrentPage}
            nomBar={nomBarOnboarding}
          />
        </div>
      );
    } else if (currentPage === 'facturation') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#5a03cf]/10 via-gray-50 to-[#9cff02]/10">
          <Facturation 
            onBack={() => {
              // Retour vers l'écran de bienvenue onboarding
              setCurrentPage('dashboard'); // Cela déclenchera l'affichage de OnboardingWelcome
            }} 
            onNavigate={setCurrentPage}
            isOnboarding={true}
          />
        </div>
      );
    } else {
      // Écran de bienvenue avec bouton pour continuer
      // Empêche l'accès au dashboard tant que l'onboarding n'est pas terminé
      return (
        <OnboardingWelcome 
          onContinue={setCurrentPage}
          currentStep={currentUser.onboardingStep}
          userName={currentUser.prenom}
        />
      );
    }
  }

  const handleNavigate = (page: PageType, matchId?: number, restaurantId?: number) => {
    if (matchId !== undefined) {
      setSelectedMatchId(matchId);
    }
    if (restaurantId !== undefined) {
      setSelectedRestaurantId(restaurantId);
    }
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'liste-matchs':
        return <ListeMatchs onBack={() => setCurrentPage('dashboard')} />;
      case 'match-detail':
        return (
          <MatchDetail 
            matchId={selectedMatchId}
            onBack={() => setCurrentPage('mes-matchs')} 
            onEditMatch={() => {
              setCurrentPage('modifier-match');
            }}
            onNavigate={handleNavigate}
          />
        );
      case 'mes-matchs':
        return <MesMatchs onNavigate={handleNavigate} defaultFilter={defaultMatchFilter} />;
      case 'mes-restaurants':
        return <MesRestaurants onNavigate={handleNavigate} />;
      case 'restaurant-detail':
        return <RestaurantDetail restaurantId={selectedRestaurantId} onBack={() => setCurrentPage('mes-restaurants')} />;
      case 'programmer-match':
        return <ProgrammerMatch onBack={() => setCurrentPage('dashboard')} />;
      case 'modifier-match':
        return <ModifierMatch matchId={selectedMatchId} onBack={() => setCurrentPage('mes-matchs')} />;
      case 'ajouter-restaurant':
        return (
          <AjouterRestaurant 
            onBack={() => setCurrentPage('mes-restaurants')} 
            onNavigate={setCurrentPage}
            onFormuleSelected={(formule) => setSelectedFormule(formule)}
          />
        );
      case 'modifier-restaurant':
        return <ModifierRestaurant restaurantId={selectedRestaurantId} onBack={() => setCurrentPage('mes-restaurants')} />;
      case 'booster':
        return <Booster onBack={() => setCurrentPage('dashboard')} onNavigate={setCurrentPage} />;
      case 'acheter-boosts':
        return <AcheterBoosts onBack={() => setCurrentPage('booster')} />;
      case 'parrainage':
        return <Parrainage onBack={() => setCurrentPage('dashboard')} />;
      case 'mes-avis':
        return <MesAvis onBack={() => setCurrentPage('dashboard')} />;
      case 'compte':
        return <Compte onNavigate={setCurrentPage} />;
      case 'compte-infos':
        return <CompteInfos onBack={() => setCurrentPage('compte')} />;
      case 'compte-facturation':
        return <CompteFacturation onBack={() => setCurrentPage('compte')} onNavigate={setCurrentPage} />;
      case 'compte-notifications':
        return <CompteNotifications onBack={() => setCurrentPage('compte')} onNavigate={setCurrentPage} />;
      case 'compte-securite':
        return <CompteSecurite onBack={() => setCurrentPage('compte')} onNavigate={setCurrentPage} />;
      case 'compte-donnees':
        return <CompteDonnees onBack={() => setCurrentPage('compte')} onNavigate={setCurrentPage} />;
      case 'compte-aide':
        return <CompteAide onBack={() => setCurrentPage('compte')} onNavigate={setCurrentPage} />;
      case 'infos-etablissement':
        return (
          <InfosEtablissement 
            onBack={() => setCurrentPage('ajouter-restaurant')} 
            onNavigate={setCurrentPage}
            selectedFormule={selectedFormule}
            onBarInfoSubmit={(nom) => setNomBarOnboarding(nom)}
          />
        );
      case 'facturation':
        return <Facturation onBack={() => setCurrentPage('ajouter-restaurant')} onNavigate={setCurrentPage} />;
      case 'onboarding-welcome':
        return (
          <OnboardingWelcome 
            onContinue={setCurrentPage}
            currentStep={currentUser.onboardingStep}
            userName={currentUser.prenom}
          />
        );
      case 'confirmation-onboarding':
        return (
          <ConfirmationOnboarding 
            onNavigate={setCurrentPage}
            nomBar={nomBarOnboarding}
          />
        );
      case 'paiement-validation':
        return (
          <PaiementValidation 
            onBack={() => setCurrentPage('infos-etablissement')} 
            onNavigate={setCurrentPage}
            selectedFormule={selectedFormule}
            nomBar={nomBarOnboarding}
          />
        );
      case 'app-presentation':
        return <AppPresentation onNavigate={setCurrentPage} onBack={() => setCurrentPage('dashboard')} />;
      case 'referral':
        return (
          <ReferralPage 
            onBackToLanding={() => setAuthView('landing')}
            onGoToLogin={() => setAuthView('login')}
          />
        );
      case 'qr-scanner':
        return (
          <QRScanner 
            onBack={() => setCurrentPage('dashboard')}
            onNavigate={setCurrentPage}
          />
        );
      case 'reservations':
        return <Reservations onNavigate={handleNavigate} matchId={selectedMatchId} />;
      case 'notification-center':
        return <NotificationCenter onNavigate={handleNavigate} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
      <Sidebar onNavigate={setCurrentPage} currentPage={currentPage} />
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {/* Notification Banners - Always visible at the top */}
        <NotificationBanner 
          type="info"
          message="🎉 Nouveau : Le système de réservations est maintenant disponible !"
          action={{
            label: "Découvrir",
            onClick: () => setCurrentPage('reservations')
          }}
        />
        
        {renderPage()}
      </div>
      
      {/* Notification Bell - Fixed top right */}
      {isAuthenticated && (
        <NotificationBell onNavigate={handleNavigate} unreadCount={3} />
      )}
      
      {/* Floating QR Scanner Button - Only on mobile when authenticated */}
      {isAuthenticated && currentPage !== 'qr-scanner' && (
        <button
          onClick={() => setCurrentPage('qr-scanner')}
          className="lg:hidden fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] text-white rounded-full shadow-2xl shadow-[#5a03cf]/40 hover:scale-110 transition-transform duration-300 flex items-center justify-center"
          style={{ 
            bottom: 'max(1.5rem, calc(1.5rem + env(safe-area-inset-bottom)))' 
          }}
        >
          <QrCode className="w-8 h-8" />
        </button>
      )}
    </div>
  );
}