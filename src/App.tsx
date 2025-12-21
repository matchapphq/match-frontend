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
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [defaultMatchFilter, setDefaultMatchFilter] = useState<string>('');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('');

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
        return <AjouterRestaurant onBack={() => setCurrentPage('mes-restaurants')} />;
      case 'facturation':
        return <Facturation onBack={() => setCurrentPage('dashboard')} />;
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