import { StatCard } from './StatCard';
import { Users, Tv, Calendar, Eye, TrendingUp, Plus } from 'lucide-react';
import { PageType } from '../App';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

interface DashboardProps {
  onNavigate: (page: PageType, matchId?: number, restaurantId?: number, filter?: 'tous' | 'à venir' | 'terminé') => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { getUserMatchs, getUserClients, boostsDisponibles } = useAppContext();
  const { currentUser } = useAuth();
  const [clientFilter, setClientFilter] = useState<'tous' | 'en attente' | 'confirmé'>('tous');
  const [periodFilter, setPeriodFilter] = useState<'7j' | '15j' | '1m' | '3m' | '6m' | '1a'>('7j');

  // Filtrer les données pour l'utilisateur connecté
  const matchs = currentUser ? getUserMatchs(currentUser.id) : [];
  const allClients = currentUser ? getUserClients(currentUser.id) : [];

  // Ajouter des statuts aux clients
  const clientsWithStatus = allClients.map((client, index) => ({
    ...client,
    statut: (index < 2 ? 'en attente' : 'confirmé') as 'confirmé' | 'en attente' | 'refusé',
    email: `${client.prenom.toLowerCase()}.${client.nom.toLowerCase()}@email.fr`,
    telephone: '06 12 34 56 78',
    restaurant: 'Le Sport Bar'
  }));

  const clients = clientFilter === 'tous' 
    ? clientsWithStatus 
    : clientsWithStatus.filter(c => c.statut === clientFilter);

  const matchsAVenir = matchs.filter(m => m.statut === 'à venir');
  const matchsTermines = matchs.filter(m => m.statut === 'terminé');
  const clientsEnAttente = clientsWithStatus.filter(c => c.statut === 'en attente');

  const getPeriodLabel = () => {
    switch(periodFilter) {
      case '7j': return '7 derniers jours';
      case '15j': return '15 derniers jours';
      case '1m': return '30 derniers jours';
      case '3m': return '3 derniers mois';
      case '6m': return '6 derniers mois';
      case '1a': return '1 an';
      default: return '7 derniers jours';
    }
  };

  const stats = [
    {
      id: 'clients-detail' as PageType,
      title: 'Clients',
      value: allClients.length.toString(),
      subtitle: getPeriodLabel(),
      icon: Users,
      color: 'bg-white',
      textColor: 'text-[#5a03cf]',
      iconBg: 'bg-gradient-to-br from-[#5a03cf] to-[#7a23ef]',
      iconColor: 'text-white',
      filter: undefined
    },
    {
      id: 'mes-matchs' as PageType,
      title: 'Matchs diffusés',
      value: matchsTermines.length.toString(),
      subtitle: getPeriodLabel(),
      icon: Tv,
      color: 'bg-gradient-to-br from-[#9cff02]/20 to-[#7cdf00]/20',
      textColor: 'text-[#5a03cf]',
      iconBg: 'bg-gradient-to-br from-[#9cff02] to-[#7cdf00]',
      iconColor: 'text-[#5a03cf]',
      filter: 'terminé' as const
    },
    {
      id: 'mes-matchs' as PageType,
      title: 'Matchs à venir',
      value: matchsAVenir.length.toString(),
      subtitle: 'Déjà programmés',
      icon: Calendar,
      color: 'bg-gradient-to-br from-[#5a03cf]/20 to-[#7a23ef]/20',
      textColor: 'text-[#5a03cf]',
      iconBg: 'bg-gradient-to-br from-[#5a03cf] to-[#7a23ef]',
      iconColor: 'text-white',
      filter: 'à venir' as const
    },
    {
      id: 'vues-detail' as PageType,
      title: 'Vues',
      value: '1 453',
      subtitle: getPeriodLabel(),
      icon: Eye,
      color: 'bg-white',
      textColor: 'text-[#5a03cf]',
      iconBg: 'bg-gradient-to-br from-[#9cff02] to-[#7cdf00]',
      iconColor: 'text-[#5a03cf]',
      filter: undefined
    }
  ];

  const getPercentage = (reservees: number, total: number) => {
    return Math.round((reservees / total) * 100);
  };

  // Fonction pour calculer la couleur du cercle de remplissage (vert → violet)
  const getCircleGradient = (percentage: number) => {
    // L'anneau affiche toujours un dégradé vert → violet sur la portion remplie
    return `conic-gradient(from 0deg, #9cff02 0%, #5a03cf ${percentage}%, transparent ${percentage}%)`;
  };

  const handleEditMatch = (e: React.MouseEvent, matchId: number) => {
    e.stopPropagation();
    onNavigate('modifier-match', matchId);
  };

  const handleMatchClick = (matchId: number) => {
    onNavigate('match-detail', matchId);
  };

  const handleBoostClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate('booster');
  };

  return (
    <div className="min-h-screen p-8">
      {/* En-tête avec salutation centrée */}
      <div className="flex flex-col items-center justify-center mb-12">
        <p className="text-gray-900 text-2xl mb-2" style={{ fontWeight: '600' }}>Bonjour</p>
        <h1 className="text-6xl mb-6 italic bg-gradient-to-r from-[#5a03cf] to-[#9cff02] bg-clip-text text-transparent" style={{ fontWeight: '800' }}>
          {currentUser?.prenom}
        </h1>
      </div>

      {/* Tableau de bord avec bouton programmer et sélecteur de période */}
      <div className="border-2 border-gray-300/60 rounded-3xl p-8 mb-12 bg-white/20 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <h2 className="text-5xl" style={{ fontWeight: '800', color: '#5a03cf' }}>
              Tableau de bord
            </h2>
            
            {/* Menu déroulant pour la période */}
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value as any)}
              className="px-6 py-3 bg-gradient-to-r from-[#5a03cf]/5 via-white/10 to-[#9cff02]/5 backdrop-blur-2xl border-2 border-black/15 rounded-3xl text-gray-700 cursor-pointer hover:border-[#5a03cf] transition-all shadow-xl"
              style={{ fontWeight: '600' }}
            >
              <option value="7j">7 derniers jours</option>
              <option value="15j">15 derniers jours</option>
              <option value="1m">1 mois</option>
              <option value="3m">3 mois</option>
              <option value="6m">6 mois</option>
              <option value="1a">1 an</option>
            </select>
          </div>
          
          {/* Bouton Programmer un match */}
          <button
            onClick={() => onNavigate('programmer-match')}
            className="px-6 py-2.5 bg-gradient-to-r from-[#9cff02] to-[#7cdf00] text-[#5a03cf] rounded-full hover:shadow-2xl transition-all shadow-lg flex items-center gap-2 relative group"
            style={{ fontWeight: '800' }}
          >
            {/* Bordure dégradée au survol */}
            <div className="absolute inset-0 p-[2px] rounded-full bg-gradient-to-r from-[#9cff02] to-[#5a03cf] opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
            <Plus className="w-4 h-4" />
            Programmer un match
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard 
              key={index} 
              {...stat} 
              onClick={() => {
                if (stat.filter) {
                  onNavigate('mes-matchs', undefined, undefined, stat.filter);
                } else {
                  onNavigate(stat.id);
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Section Prochains Matchs */}
      <div className="border-2 border-gray-300/60 rounded-3xl p-8 mb-12 bg-white/20 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-5xl" style={{ fontWeight: '800', color: '#5a03cf' }}>
            Prochains matchs
          </h2>
          <button
            onClick={() => onNavigate('mes-matchs', undefined, undefined, 'à venir')}
            className="px-6 py-2.5 bg-gradient-to-r from-[5a03cf]/5 via-white/10 to-[9cff02]/5 backdrop-blur-2xl border-2 border-black/15 rounded-3xl text-gray-700 hover:border-[#5a03cf] transition-all shadow-xl"
            style={{ fontWeight: '600' }}
          >
            Voir tout
          </button>
        </div>
        <div className="space-y-3">
          {matchsAVenir.slice(0, 3).map((match) => {
            const percentage = getPercentage(match.reservees, match.total);
            return (
              <div key={match.id} className="relative p-[2px] rounded-xl bg-gradient-to-r from-[#9cff02] to-[#5a03cf]">
                <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between gap-6">
                    <button
                      onClick={() => handleMatchClick(match.id)}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      <span className="text-3xl">{match.sport}</span>
                      <div>
                        <p className="text-gray-900 mb-1 italic text-xl" style={{ fontWeight: '600' }}>
                          {match.equipe1} vs {match.equipe2}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {match.date} à {match.heure} • {match.restaurant}
                        </p>
                      </div>
                    </button>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className="text-gray-600 text-sm mb-1">Places</p>
                        <p className="text-gray-900" style={{ fontWeight: '600' }}>
                          {match.reservees}/{match.total}
                        </p>
                      </div>

                      <div className="w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center relative">
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: getCircleGradient(percentage),
                          }}
                        />
                        <div className="absolute inset-1 bg-white rounded-full" />
                        <span className="relative text-gray-900 text-sm z-10" style={{ fontWeight: '600' }}>
                          {percentage}%
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => handleEditMatch(e, match.id)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all text-sm"
                          style={{ fontWeight: '600' }}
                        >
                          Modifier
                        </button>
                        <button 
                          onClick={(e) => handleBoostClick(e)}
                          className="px-5 py-2.5 bg-gradient-to-r from-[#9cff02] to-[#5a03cf] text-white rounded-full hover:shadow-lg transition-all flex items-center gap-2 italic"
                        >
                          <TrendingUp className="w-4 h-4" />
                          Booster
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}