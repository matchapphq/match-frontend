import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { useState } from 'react';
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
import { AppProvider } from './context/AppContext';
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
  const { isAuthenticated, login, register, currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [defaultMatchFilter, setDefaultMatchFilter] = useState<string>('');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('');
  const [authView, setAuthView] = useState<'landing' | 'login' | 'register' | 'referral'>('landing');
  
  // États pour le parcours de souscription
  const [selectedFormule, setSelectedFormule] = useState<'mensuel' | 'annuel'>('mensuel');
  const [nomBarOnboarding, setNomBarOnboarding] = useState<string>('');
  
  // État pour la navigation non authentifiée
  const [unauthPage, setUnauthPage] = useState<'landing' | 'app-presentation' | null>(null);

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
            onBack={() => setCurrentPage('ajouter-restaurant')} 
            onNavigate={setCurrentPage}
            isOnboarding={true}
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
            onBarInfoSubmit={(nom) => setNomBarOnboarding(nom)}
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