import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { useState, useEffect } from 'react';
import api from './services/api';
import { ClientsDetail } from './components/details/ClientsDetail';
import { MatchesDiffusesDetail } from './components/details/MatchesDiffusesDetail';
import { MatchesAVenirDetail } from './components/details/MatchesAVenirDetail';
import { VuesDetail } from './components/details/VuesDetail';
import { ProgrammerMatch } from './components/ProgrammerMatch';
import { ModifierMatch } from './components/ModifierMatch';
import { MesAvis } from './components/MesAvis';
import { ListeMatchs } from './components/ListeMatchs';
import { MesMatchs } from './components/MesMatchs';
import { MesRestaurants } from './components/MesRestaurants';
import { ModifierRestaurant } from './components/ModifierRestaurant';
import { Compte } from './components/Compte';
import { Booster } from './components/Booster';
import { Parrainage } from './components/Parrainage';
import { RestaurantDetail } from './components/RestaurantDetail';
import { AjouterRestaurant } from './components/AjouterRestaurant';
import { Facturation } from './components/Facturation';
import { MatchDetail } from './components/MatchDetail';
import { CompteInfos } from './components/compte/CompteInfos';
import { CompteParametres } from './components/compte/CompteParametres';
import { CompteNotifications } from './components/compte/CompteNotifications';
import { CompteSecurite } from './components/compte/CompteSecurite';
import { CompteAide } from './components/compte/CompteAide';
import { CompteFacturation } from './components/compte/CompteFacturation';
import { AppProvider, useAppContext } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { OnboardingWelcome } from './components/OnboardingWelcome';
import { LandingPage } from './components/LandingPage';
import { ReferralPage } from './components/ReferralPage';
import { Footer } from './components/Footer';
import { MesLieux } from './components/MesLieux';
import { CompteDonnees } from './components/compte/CompteDonnees';
import { InfosEtablissement } from './components/InfosEtablissement';
import { PaiementValidation } from './components/PaiementValidation';
import { ConfirmationOnboarding } from './components/ConfirmationOnboarding';
import { AppPresentation } from './components/AppPresentation';

export type PageType = 
  | 'dashboard'
  | 'clients-detail'
  | 'matchs-diffuses-detail'
  | 'matchs-avenir-detail'
  | 'vues-detail'
  | 'programmer-match'
  | 'modifier-match'
  | 'mes-avis'
  | 'liste-matchs'
  | 'mes-matchs'
  | 'mes-restaurants'
  | 'modifier-restaurant'
  | 'compte'
  | 'booster'
  | 'parrainage'
  | 'restaurant-detail'
  | 'ajouter-restaurant'
  | 'infos-etablissement'
  | 'paiement-validation'
  | 'confirmation-onboarding'
  | 'facturation'
  | 'match-detail'
  | 'compte-infos'
  | 'compte-parametres'
  | 'compte-notifications'
  | 'compte-securite'
  | 'compte-aide'
  | 'compte-facturation'
  | 'mes-lieux'
  | 'compte-donnees'
  | 'app-presentation';

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

function AppContent() {
  const { isAuthenticated, login, register, currentUser, completeOnboarding } = useAuth();
  const { refreshData } = useAppContext();
  
  // Check if returning from successful checkout - show confirmation immediately
  const getInitialPage = (): PageType => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('checkout') === 'success') {
      return 'confirmation-onboarding';
    }
    return 'dashboard';
  };
  
  const [currentPage, setCurrentPage] = useState<PageType>(getInitialPage);
  const [defaultMatchFilter, setDefaultMatchFilter] = useState<'tous' | 'à venir' | 'terminé'>('à venir');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('');
  const [authView, setAuthView] = useState<'landing' | 'login' | 'register' | 'referral'>('landing');
  
  // États pour le parcours de souscription
  const [selectedFormule, setSelectedFormule] = useState<'mensuel' | 'annuel'>('mensuel');
  const [nomBarOnboarding, setNomBarOnboarding] = useState<string>('');
  const [venueIdOnboarding, setVenueIdOnboarding] = useState<string>('');
  
  // État pour la navigation non authentifiée
  const [unauthPage, setUnauthPage] = useState<'landing' | 'app-presentation' | null>(null);
  
  // État pour le message de succès checkout
  const [checkoutStatus, setCheckoutStatus] = useState<'success' | 'cancel' | null>(null);
  
  // Flag to track if we're processing checkout return
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('checkout') === 'success';
  });

  // Handle Stripe checkout redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const checkoutResult = params.get('checkout');
    const sessionId = params.get('session_id');
    
    const verifyAndCreateVenue = async (sessionId: string) => {
      try {
        console.log('Verifying checkout session:', sessionId);
        const result = await api.verifyCheckoutAndCreateVenue(sessionId);
        console.log('Venue creation result:', result);
        
        if (result.venue) {
          setNomBarOnboarding(result.venue.name);
        }
        
        // Refresh data to fetch the newly created venue
        await refreshData();
        
        setCheckoutStatus('success');
        completeOnboarding();
        setCurrentPage('confirmation-onboarding');
      } catch (error: any) {
        console.error('Error verifying checkout:', error);
        // Still complete onboarding even if verification fails (webhook might handle it)
        await refreshData(); // Try to refresh anyway
        setCheckoutStatus('success');
        completeOnboarding();
        setCurrentPage('confirmation-onboarding');
      }
    };
    
    if (checkoutResult === 'success') {
      if (sessionId) {
        // Verify checkout and create venue
        verifyAndCreateVenue(sessionId);
      } else {
        // No session_id, just complete onboarding
        setCheckoutStatus('success');
        completeOnboarding();
        setCurrentPage('confirmation-onboarding');
      }
      // Clear URL params
      window.history.replaceState({}, '', window.location.pathname);
      // Clear status after 5 seconds
      setTimeout(() => setCheckoutStatus(null), 5000);
    } else if (checkoutResult === 'cancel') {
      setCheckoutStatus('cancel');
      // Stay on facturation page to retry payment
      setCurrentPage('facturation');
      window.history.replaceState({}, '', window.location.pathname);
      setTimeout(() => setCheckoutStatus(null), 5000);
    }
  }, [completeOnboarding]);

  // Gestion de l'inscription avec redirection vers "ajouter-restaurant"
  const handleRegister = async (data: any) => {
    const result = await register(data);
    if (result.success) {
      // L'utilisateur sera redirigé vers l'écran d'onboarding automatiquement
      setCurrentPage('ajouter-restaurant');
    }
    return result;
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
    // PRIORITY: Show confirmation screen immediately after payment (before any other onboarding screens)
    if (currentPage === 'confirmation-onboarding' || isProcessingCheckout) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#5a03cf]/10 via-gray-50 to-[#9cff02]/10">
          <ConfirmationOnboarding 
            onNavigate={setCurrentPage}
            nomBar={nomBarOnboarding}
          />
        </div>
      );
    }
    
    // Afficher l'écran d'onboarding approprié selon l'étape
    if (currentPage === 'ajouter-restaurant') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#5a03cf]/10 via-gray-50 to-[#9cff02]/10">
          <AjouterRestaurant 
            onBack={() => setCurrentPage('dashboard')} 
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
            onBarInfoSubmit={(nom, venueId) => {
              setNomBarOnboarding(nom);
              setVenueIdOnboarding(venueId);
            }}
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
    } else if (currentPage === 'facturation') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#5a03cf]/10 via-gray-50 to-[#9cff02]/10">
          <Facturation 
            onBack={() => setCurrentPage('infos-etablissement')} 
            onNavigate={setCurrentPage}
            isOnboarding={true}
            venueId={venueIdOnboarding}
          />
        </div>
      );
    } else {
      // Écran de bienvenue avec bouton pour continuer
      return (
        <OnboardingWelcome 
          onContinue={setCurrentPage}
          currentStep={currentUser.onboardingStep}
          userName={currentUser.prenom}
        />
      );
    }
  }

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'clients-detail':
        return <ClientsDetail onBack={() => setCurrentPage('dashboard')} />;
      case 'matchs-diffuses-detail':
        return <MatchesDiffusesDetail onBack={() => setCurrentPage('dashboard')} />;
      case 'matchs-avenir-detail':
        return <MatchesAVenirDetail onBack={() => setCurrentPage('dashboard')} />;
      case 'vues-detail':
        return <VuesDetail onBack={() => setCurrentPage('dashboard')} />;
      case 'programmer-match':
        return <ProgrammerMatch onBack={() => setCurrentPage('dashboard')} />;
      case 'modifier-match':
        return <ModifierMatch onBack={() => setCurrentPage('dashboard')} />;
      case 'mes-avis':
        return <MesAvis onBack={() => setCurrentPage('dashboard')} />;
      case 'liste-matchs':
        return <ListeMatchs onBack={() => setCurrentPage('dashboard')} />;
      case 'mes-matchs':
        return <MesMatchs onNavigate={handleNavigate} defaultFilter={defaultMatchFilter} />;
      case 'mes-restaurants':
        return <MesRestaurants onNavigate={setCurrentPage} />;
      case 'modifier-restaurant':
        return <ModifierRestaurant restaurantId={selectedRestaurantId} onBack={() => setCurrentPage('mes-restaurants')} />;
      case 'compte':
        return <Compte onNavigate={setCurrentPage} />;
      case 'booster':
        return <Booster onBack={() => setCurrentPage('dashboard')} onNavigate={setCurrentPage} />;
      case 'parrainage':
        return <Parrainage />;
      case 'restaurant-detail':
        return <RestaurantDetail onBack={() => setCurrentPage('mes-restaurants')} />;
      case 'ajouter-restaurant':
        return (
          <AjouterRestaurant 
            onBack={() => setCurrentPage('mes-restaurants')} 
            onNavigate={setCurrentPage}
            onFormuleSelected={(formule) => setSelectedFormule(formule)}
          />
        );
      case 'infos-etablissement':
        return (
          <InfosEtablissement 
            onBack={() => setCurrentPage('ajouter-restaurant')} 
            onNavigate={setCurrentPage}
            selectedFormule={selectedFormule}
            onBarInfoSubmit={(nom, venueId) => {
              setNomBarOnboarding(nom);
              setVenueIdOnboarding(venueId);
            }}
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
      case 'confirmation-onboarding':
        return (
          <ConfirmationOnboarding 
            onNavigate={setCurrentPage}
            nomBar={nomBarOnboarding}
          />
        );
      case 'facturation':
        return <Facturation onBack={() => setCurrentPage('ajouter-restaurant')} onNavigate={setCurrentPage} />;
      case 'match-detail':
        return (
          <MatchDetail 
            onBack={() => setCurrentPage('mes-matchs')} 
            onEditMatch={() => {
              setCurrentPage('modifier-match');
            }}
          />
        );
      case 'compte-infos':
        return <CompteInfos onBack={() => setCurrentPage('compte')} />;
      case 'compte-parametres':
        return <CompteParametres onBack={() => setCurrentPage('compte')} />;
      case 'compte-notifications':
        return <CompteNotifications onBack={() => setCurrentPage('compte')} />;
      case 'compte-securite':
        return <CompteSecurite onBack={() => setCurrentPage('compte')} />;
      case 'compte-aide':
        return <CompteAide onBack={() => setCurrentPage('compte')} />;
      case 'compte-facturation':
        return <CompteFacturation onNavigate={setCurrentPage} onBack={() => setCurrentPage('compte')} />;
      case 'mes-lieux':
        return <MesLieux onNavigate={setCurrentPage} onBack={() => setCurrentPage('compte')} />;
      case 'compte-donnees':
        return <CompteDonnees onNavigate={setCurrentPage} onBack={() => setCurrentPage('compte')} />;
      case 'app-presentation':
        return <AppPresentation onNavigate={setCurrentPage} onBack={() => setCurrentPage('dashboard')} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5a03cf]/10 via-gray-50 to-[#9cff02]/10 flex flex-col">
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />
      <div className="flex-1">
        {renderPage()}
      </div>
      <Footer />
    </div>
  );
}