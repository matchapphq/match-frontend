import { StatCard } from './StatCard';
import { SideMenu } from './SideMenu';
import { Users, Tv, Calendar, Eye, TrendingUp } from 'lucide-react';
import { PageType } from '../App';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

interface DashboardProps {
  onNavigate: (page: PageType, matchId?: string | number, restaurantId?: string | number, filter?: 'tous' | 'à venir' | 'terminé') => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { getUserMatchs, customerStats, boostsDisponibles } = useAppContext();
  const { currentUser } = useAuth();

  // Filtrer les données pour l'utilisateur connecté
  const matchs = currentUser ? getUserMatchs(currentUser.id) : [];

  const matchsAVenir = matchs.filter(m => m.statut === 'à venir');
  const matchsTermines = matchs.filter(m => m.statut === 'terminé');

  // Statistiques basées sur les données réelles de l'API
  const stats = [
    {
      id: 'clients-detail' as PageType,
      title: 'Clients',
      value: customerStats.customerCount.toString(),
      subtitle: '30 derniers jours',
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
      subtitle: '30 derniers jours',
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
      value: '—',
      subtitle: 'Bientôt disponible',
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

  const handleEditMatch = (e: React.MouseEvent, matchId: string) => {
    e.stopPropagation();
    onNavigate('modifier-match', matchId);
  };

  const handleMatchClick = (matchId: string) => {
    onNavigate('match-detail', matchId);
  };

  const handleBoostClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate('booster');
    setTimeout(() => {
      const boostSection = document.getElementById('boost-top');
      if (boostSection) {
        boostSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="flex min-h-screen gap-8 p-8">
      {/* Zone principale des statistiques */}
      <div className="flex-1">
        <div className="mb-10">
          <h1 className="text-gray-900 mb-3 italic text-6xl" style={{ fontStyle: 'italic', fontWeight: '800' }}>
            <span className="text-[#5a03cf]">Bonjour</span> <span className="text-[#9cff02]">{currentUser?.prenom}</span> 👋
          </h1>
          <p className="text-gray-600 text-xl mb-2">Bienvenue sur votre espace restaurateur Match</p>
          <p className="text-gray-500 text-lg">
            Vos établissements ont accueilli <span className="text-[#5a03cf]" style={{ fontWeight: '700' }}>{customerStats.customerCount} clients</span> ces 30 derniers jours.
          </p>
        </div>

        <h2 className="text-gray-900 mb-6 text-3xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
          Tableau de bord
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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

        {/* Section Prochains Matchs */}
        <div>
          <h2 className="text-gray-900 mb-6 text-3xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
            Vos prochains matchs
          </h2>
          <div className="space-y-3">
            {matchsAVenir.slice(0, 5).map((match) => {
              const percentage = getPercentage(match.reservees, match.total);
              return (
                <div
                  key={match.id}
                  className="bg-white rounded-xl shadow-sm border-2 border-gray-200 p-5 hover:shadow-lg transition-all"
                >
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
                    
                    <div className="flex items-center gap-4">
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
                            background: `conic-gradient(#9cff02 ${percentage}%, transparent ${percentage}%)`,
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
                          className="px-5 py-2.5 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white rounded-full hover:shadow-lg transition-all flex items-center gap-2 italic"
                        >
                          <TrendingUp className="w-4 h-4" />
                          Booster
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Menu latéral à droite avec effet glassmorphism */}
      <div className="w-80">
        <SideMenu onNavigate={onNavigate} />
      </div>
    </div>
  );
}