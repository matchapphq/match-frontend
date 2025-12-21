import { Dashboard } from './components/Dashboard';
import { Header } from './components/Header';
import { useState } from 'react';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import { BillingHistory } from './components/BillingHistory';

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
  | 'billing-history'
  | 'match-detail'
  | 'compte-infos'
  | 'compte-parametres'
  | 'compte-notifications'
  | 'compte-securite'
  | 'compte-aide';

type AuthPage = 'login' | 'register';

function AuthenticatedApp() {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [defaultMatchFilter, setDefaultMatchFilter] = useState<'tous' | 'à venir' | 'terminé'>('tous');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('');
  const [selectedMatchId, setSelectedMatchId] = useState<string>('');

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5a03cf] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

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
        return <ModifierMatch matchId={selectedMatchId} onBack={() => setCurrentPage('mes-matchs')} />;
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
        return <Facturation onBack={() => setCurrentPage('dashboard')} />;
      case 'billing-history':
        return <BillingHistory onBack={() => setCurrentPage('compte')} />;
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
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Header onNavigate={setCurrentPage} currentPage={currentPage} />
        {renderPage()}
      </div>
    </AppProvider>
  );
}

export default function App() {
  const [authPage, setAuthPage] = useState<AuthPage>('login');

  return (
    <AuthProvider>
      <AppContent 
        authPage={authPage} 
        onAuthPageChange={setAuthPage} 
      />
    </AuthProvider>
  );
}

function AppContent({ 
  authPage, 
  onAuthPageChange 
}: { 
  authPage: AuthPage; 
  onAuthPageChange: (page: AuthPage) => void;
}) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5a03cf] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (authPage === 'register') {
      return (
        <Register 
          onSuccess={() => {}} 
          onLoginClick={() => onAuthPageChange('login')} 
        />
      );
    }
    return (
      <Login 
        onSuccess={() => {}} 
        onRegisterClick={() => onAuthPageChange('register')} 
      />
    );
  }

  return <AuthenticatedApp />;
}