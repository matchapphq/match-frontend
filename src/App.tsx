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
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { OnboardingWelcome } from './components/OnboardingWelcome';

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
  | 'facturation'
  | 'match-detail'
  | 'compte-infos'
  | 'compte-parametres'
  | 'compte-notifications'
  | 'compte-securite'
  | 'compte-aide';

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
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  // Gestion de l'inscription avec redirection vers "ajouter-restaurant"
  const handleRegister = async (data: any): Promise<boolean> => {
    const success = await register(data);
    if (success) {
      // L'utilisateur sera redirigé vers l'écran d'onboarding automatiquement
      setCurrentPage('ajouter-restaurant');
    }
    return success;
  };

  // Si l'utilisateur n'est pas authentifié, afficher la page de connexion ou d'inscription
  if (!isAuthenticated) {
    if (authView === 'register') {
      return (
        <Register
          onRegister={handleRegister}
          onSwitchToLogin={() => setAuthView('login')}
        />
      );
    }
    return (
      <Login
        onLogin={login}
        onSwitchToRegister={() => setAuthView('register')}
      />
    );
  }

  // Si l'utilisateur est authentifié mais n'a pas complété son onboarding
  if (currentUser && !currentUser.hasCompletedOnboarding) {
    // Afficher l'écran d'onboarding approprié selon l'étape
    if (currentPage === 'ajouter-restaurant') {
      return (
        <div className="min-h-screen bg-gray-50">
          <AjouterRestaurant 
            onBack={() => setCurrentPage('dashboard')} 
            onNavigate={setCurrentPage}
            isOnboarding={true}
          />
        </div>
      );
    } else if (currentPage === 'facturation') {
      return (
        <div className="min-h-screen bg-gray-50">
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
        return <AjouterRestaurant onBack={() => setCurrentPage('mes-restaurants')} onNavigate={setCurrentPage} />;
      case 'facturation':
        return <Facturation onBack={() => setCurrentPage('ajouter-restaurant')} onNavigate={setCurrentPage} />;
      case 'match-detail':
        return <MatchDetail onBack={() => setCurrentPage('mes-matchs')} />;
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
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={setCurrentPage} currentPage={currentPage} />
      {renderPage()}
    </div>
  );
}