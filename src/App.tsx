import { useState } from 'react';
import { QRScanner } from './components/QRScanner';
import { QrCode } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { CompteInfos } from './components/compte/CompteInfos';
import { CompteFacturation } from './components/compte/CompteFacturation';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { ListeMatchs } from './components/ListeMatchs';
import { MatchDetail } from './components/MatchDetail';
import { MesMatchs } from './components/MesMatchs';
import { MesRestaurants } from './components/MesRestaurants';
import { RestaurantDetail } from './components/RestaurantDetail';
import { ProgrammerMatch } from './components/ProgrammerMatch';
import { ModifierMatch } from './components/ModifierMatch';
import { AjouterRestaurant } from './components/AjouterRestaurant';
import { ModifierRestaurant } from './components/ModifierRestaurant';
import { Booster } from './components/Booster';
import { AcheterBoosts } from './components/AcheterBoosts';
import Parrainage from './pages/Parrainage';
import { MesAvis } from './components/MesAvis';
import { Compte } from './components/Compte';
import { InfosEtablissement } from './components/InfosEtablissement';
import { Facturation } from './components/Facturation';
import { OnboardingWelcome } from './components/OnboardingWelcome';
import { ConfirmationOnboarding } from './components/ConfirmationOnboarding';
import { PaiementValidation } from './components/PaiementValidation';
import { AppPresentation } from './components/AppPresentation';
import { ReferralPage } from './components/ReferralPage';
import { Sidebar } from './components/Sidebar';
import { CompteNotifications } from './components/compte/CompteNotifications';
import { CompteSecurite } from './components/compte/CompteSecurite';
import { CompteDonnees } from './components/compte/CompteDonnees';
import { CompteAide } from './components/compte/CompteAide';
import { Reservations } from './components/Reservations';

export type PageType = 
  | 'dashboard'
  | 'liste-matchs'
  | 'match-detail'
  | 'mes-matchs'
  | 'mes-restaurants'
  | 'restaurant-detail'
  | 'programmer-match'
  | 'modifier-match'
  | 'ajouter-restaurant'
  | 'modifier-restaurant'
  | 'booster'
  | 'acheter-boosts'
  | 'parrainage'
  | 'mes-avis'
  | 'compte'
  | 'compte-infos'
  | 'compte-facturation'
  | 'compte-notifications'
  | 'compte-securite'
  | 'compte-donnees'
  | 'compte-aide'
  | 'infos-etablissement'
  | 'facturation'
  | 'onboarding-welcome'
  | 'confirmation-onboarding'
  | 'paiement-validation'
  | 'app-presentation'
  | 'referral'
  | 'qr-scanner'
  | 'reservations';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <LanguageProvider>
            <AppContent />
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
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
      <Sidebar onNavigate={setCurrentPage} currentPage={currentPage} />
      <div className="lg:ml-64 flex flex-col min-h-screen">
        {renderPage()}
      </div>
      
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