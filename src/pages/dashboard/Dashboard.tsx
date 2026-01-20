import { Calendar, TrendingUp, Users, Eye, MapPin, Zap, Clock, ArrowUpRight, ArrowDownRight, Star, MessageSquare, CheckCircle, Plus, MoreVertical, QrCode, Loader2 } from 'lucide-react';
import { PageType } from '../../App';
import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ParrainageWidget } from '../../components/ParrainageWidget';
import { NotificationBanner } from '../../components/NotificationBanner';
import { useToast } from '../../context/ToastContext';
import { usePartnerDashboard, usePartnerVenues, usePartnerVenueMatches } from '../../hooks/api';
import { useBoostSummary } from '../../hooks/api';

// Check if we're using API or mock data
const USE_API = import.meta.env.VITE_USE_API === 'true';

interface DashboardProps {
  onNavigate: (page: PageType, matchId?: number, restaurantId?: number, filter?: 'tous' | 'à venir' | 'terminé') => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { getUserMatchs, getUserClients, boostsDisponibles } = useAppContext();
  const { currentUser } = useAuth();
  const [periodFilter, setPeriodFilter] = useState<'7j' | '30j' | '90j'>('30j');
  const toast = useToast();

  // API hooks (only used when USE_API is true)
  const { data: dashboardData, isLoading: isDashboardLoading } = usePartnerDashboard(
    undefined,
    { enabled: USE_API }
  );
  const { data: venuesData, isLoading: isVenuesLoading } = usePartnerVenues(
    { enabled: USE_API }
  );
  const { data: venueMatchesData, isLoading: isMatchesLoading } = usePartnerVenueMatches(
    { enabled: USE_API }
  );
  const { data: boostSummaryData } = useBoostSummary(
    { enabled: USE_API }
  );

  // Use API data or fall back to mock data
  const matchs = USE_API 
    ? (venueMatchesData?.data || []).map((vm: any) => ({
        id: vm.id,
        equipes: vm.match ? `${vm.match.homeTeam} vs ${vm.match.awayTeam}` : 'Match inconnu',
        date: vm.match?.scheduled_at || new Date().toISOString(),
        heure: vm.match?.scheduled_at ? new Date(vm.match.scheduled_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '20:00',
        statut: vm.status === 'upcoming' ? 'à venir' : vm.status === 'live' ? 'en cours' : 'terminé',
        reservations: vm.reserved_seats || 0,
        placesDisponibles: vm.total_capacity || 50,
        vues: 0,
      }))
    : (currentUser ? getUserMatchs(currentUser.id) : []);
  
  const allClients = USE_API
    ? [] // Will be loaded separately if needed
    : (currentUser ? getUserClients(currentUser.id) : []);

  const isLoading = USE_API && (isDashboardLoading || isVenuesLoading || isMatchesLoading);

  const matchsAVenir = matchs.filter(m => m.statut === 'à venir');
  const matchsTermines = matchs.filter(m => m.statut === 'terminé');

  const stats = [
    {
      id: 'clients-detail' as PageType,
      title: 'Total clients',
      value: allClients.length.toString(),
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: Users,
      color: 'purple' as const,
    },
    {
      id: 'mes-matchs' as PageType,
      title: 'Matchs diffusés',
      value: matchsTermines.length.toString(),
      change: '+8.2%',
      changeType: 'increase' as const,
      icon: Eye,
      color: 'blue' as const,
      filter: 'terminé' as const,
    },
    {
      id: 'mes-matchs' as PageType,
      title: 'Matchs à venir',
      value: matchsAVenir.length.toString(),
      change: '+5.1%',
      changeType: 'increase' as const,
      icon: Calendar,
      color: 'green' as const,
      filter: 'à venir' as const,
    },
    {
      id: 'vues-detail' as PageType,
      title: 'Vues totales',
      value: '1,453',
      change: '+23.4%',
      changeType: 'increase' as const,
      icon: Eye,
      color: 'orange' as const,
    },
  ];

  const recentActivity = [
    { type: 'booking', text: 'Nouvelle réservation pour PSG vs OM', time: 'Il y a 2h', match: 'PSG vs OM', matchId: 1, clickable: true },
    { type: 'view', text: '45 nouvelles vues sur Real Madrid vs Barcelona', time: 'Il y a 3h', match: 'Real Madrid vs Barcelona', matchId: 2, clickable: false },
    { type: 'match', text: 'Match diffusé: Manchester United vs Liverpool', time: 'Il y a 5h', match: 'Manchester United vs Liverpool', matchId: 3, clickable: false },
    { type: 'booking', text: '3 réservations pour Bayern vs Dortmund', time: 'Hier', match: 'Bayern vs Dortmund', matchId: 4, clickable: true },
  ];

  const upcomingMatches = matchsAVenir.slice(0, 4);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#5a03cf] mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto pb-24 lg:pb-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl mb-1 text-gray-900 dark:text-white">
            Bonjour, <span className="text-[#5a03cf]">{currentUser?.prenom}</span> 👋
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Voici un aperçu de votre activité aujourd'hui</p>
        </div>

        {/* Quick Actions Bar */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => onNavigate('programmer-match')}
            className="group relative overflow-hidden bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] text-white rounded-2xl p-6 hover:shadow-2xl hover:shadow-[#5a03cf]/30 transition-all duration-300"
          >
            <div className="relative z-10 flex items-center justify-between">
              <div className="text-left">
                <div className="text-sm opacity-90 mb-1">Action rapide</div>
                <div className="text-xl">Programmer un match</div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-6 h-6" />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={() => onNavigate('booster')}
            className="group relative overflow-hidden bg-gradient-to-br from-[#9cff02] to-[#7cdf00] text-[#5a03cf] rounded-2xl p-6 hover:shadow-2xl hover:shadow-[#9cff02]/30 transition-all duration-300"
          >
            <div className="relative z-10 flex items-center justify-between">
              <div className="text-left">
                <div className="text-sm opacity-90 mb-1">Booster</div>
                <div className="text-xl">Activer un boost</div>
              </div>
              <div className="w-12 h-12 bg-[#5a03cf]/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Period Filter */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg text-gray-900 dark:text-white">Statistiques</h2>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-1 shadow-sm">
            {(['7j', '30j', '90j'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setPeriodFilter(period)}
                className={`px-4 py-1.5 rounded-md text-sm transition-all duration-200 ${periodFilter === period
                    ? 'bg-[#5a03cf] text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <button
              key={index}
              onClick={() => onNavigate(stat.id, undefined, undefined, stat.filter)}
              className="group relative bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-[#5a03cf]/30 hover:shadow-xl hover:shadow-[#5a03cf]/5 transition-all duration-300 text-left"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color === 'purple' ? 'bg-[#5a03cf]/10' :
                    stat.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20' :
                      stat.color === 'green' ? 'bg-green-50 dark:bg-green-900/20' :
                        'bg-orange-50 dark:bg-orange-900/20'
                  }`}>
                  <stat.icon className={`w-6 h-6 ${stat.color === 'purple' ? 'text-[#5a03cf]' :
                      stat.color === 'blue' ? 'text-blue-600' :
                        stat.color === 'green' ? 'text-green-600' :
                          'text-orange-600'
                    }`} />
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-[#5a03cf] transition-colors" />
              </div>

              <div className="space-y-2">
                <div className="text-3xl text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</div>
                <div className="flex items-center gap-2">
                  {stat.changeType === 'increase' ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                      <TrendingUp className="w-3 h-3" />
                      {stat.change}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
                      <ArrowDownRight className="w-3 h-3" />
                      {stat.change}
                    </span>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400">vs période précédente</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Upcoming Matches - 2/3 width */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-lg text-gray-900 dark:text-white">Matchs à venir</h2>
                <button
                  onClick={() => onNavigate('mes-matchs', undefined, undefined, 'à venir')}
                  className="text-sm text-[#5a03cf] hover:underline"
                >
                  Voir tout
                </button>
              </div>
            </div>

            <div className="p-6">
              {upcomingMatches.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Aucun match programmé</p>
                  <button
                    onClick={() => onNavigate('programmer-match')}
                    className="px-6 py-2.5 bg-[#5a03cf] text-white rounded-xl hover:bg-[#4a02af] transition-colors shadow-lg shadow-[#5a03cf]/20"
                  >
                    Programmer un match
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingMatches.map((match) => (
                    <button
                      key={match.id}
                      onClick={() => onNavigate('match-detail', match.id)}
                      className="w-full group bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl p-4 transition-all duration-200 text-left border border-transparent hover:border-[#5a03cf]/20"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <div className="text-sm text-gray-900 dark:text-white mb-1">{match.equipes}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {new Date(match.date).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long'
                            })} • {match.heure}
                          </div>
                        </div>
                        <MoreVertical className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400" />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg p-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-600 dark:text-gray-400">Réservations</span>
                            <span className="text-gray-900 dark:text-white">{match.reservations || 0}/{match.placesDisponibles || 50}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div
                              className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${((match.reservations || 0) / (match.placesDisponibles || 50)) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Vues</div>
                          <div className="text-sm text-gray-900 dark:text-white">{match.vues || 0}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity - 1/3 width */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg text-gray-900 dark:text-white">Activité récente</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${activity.clickable ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 -mx-2 px-2 py-2 rounded-lg transition-colors' : ''}`}
                    onClick={() => activity.clickable && onNavigate('reservations', activity.matchId)}
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${activity.type === 'booking' ? 'bg-green-500' :
                        activity.type === 'view' ? 'bg-blue-500' :
                          'bg-purple-500'
                      }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white mb-1">{activity.text}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                    </div>
                    {activity.clickable && (
                      <ArrowUpRight className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-1" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Parrainage Widget */}
        <ParrainageWidget onNavigate={onNavigate} />
      </div>
    </div>
  );
}
