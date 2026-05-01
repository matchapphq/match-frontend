import { Calendar, TrendingUp, Users, Eye, Zap, ArrowUpRight, Plus, MoreVertical, ArrowDownRight, Loader2, AlertCircle } from 'lucide-react';
import { PageType } from '../../../types';
import { useState, useMemo } from 'react';
import { useAuth } from '../../authentication/context/AuthContext';
import { ParrainageWidget } from '../../../components/ParrainageWidget';
import { usePartnerMatches } from '../../../hooks/api/useMatches';
import { useCustomerStats } from '../../../hooks/api/useReservations';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DashboardProps {
  onNavigate: (page: PageType, matchId?: number | string, restaurantId?: number, filter?: 'tous' | 'à venir' | 'terminé') => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { currentUser } = useAuth();
  const [periodFilter, setPeriodFilter] = useState<'7j' | '30j' | '90j'>('30j');

  // Convert period filter to numeric days
  const periodDays = periodFilter === '7j' ? 7 : periodFilter === '90j' ? 90 : 30;

  // Fetch matches from API
  const { data: matchesData } = usePartnerMatches();
  
  // Fetch customer stats with period filter
  const { data: customerStatsData } = useCustomerStats(periodDays as 7 | 30 | 90);

  // Fetch analytics summary from backend (no placeholder stats)
  const { data: analyticsSummary, isError: analyticsError } = useQuery({
    queryKey: ['partner-analytics-summary', periodDays],
    queryFn: async () => {
      const response = await apiClient.get(`/partners/analytics/summary?period=${periodDays}`);
      return response.data as {
        total_clients: number;
        total_reservations: number;
        total_views: number;
        matches_completed: number;
        matches_upcoming: number;
        average_occupancy: number;
        trends?: {
          clients?: number;
          reservations?: number;
          matches?: number;
          views?: number;
        };
      };
    },
  });

  // Fetch recent activity from backend (no hardcoded feed)
  const { data: recentActivityData, isLoading: recentActivityLoading, isError: recentActivityError } = useQuery({
    queryKey: ['partner-recent-activity'],
    queryFn: async () => {
      const response = await apiClient.get('/partners/activity?limit=10');
      return (response.data?.activity || []) as Array<{
        type: 'reservation' | 'review';
        id: string;
        created_at: string;
        venue_name?: string;
        user_name?: string;
        details?: {
          status?: string;
          party_size?: number;
          match?: string | null;
          rating?: number;
          title?: string | null;
        };
      }>;
    },
  });

  // totalGuests = sum of party_size (actual number of people, not just reservations)
  const totalClients = customerStatsData?.totalGuests || 0;
  
  // Sport emoji mapping
  const getSportEmoji = (league: string): string => {
    const leagueLower = (league || '').toLowerCase();
    if (leagueLower.includes('nfl') || leagueLower.includes('american football')) return '🏈';
    if (leagueLower.includes('nba') || leagueLower.includes('basketball')) return '🏀';
    if (leagueLower.includes('nhl') || leagueLower.includes('hockey')) return '🏒';
    if (leagueLower.includes('mlb') || leagueLower.includes('baseball')) return '⚾';
    if (leagueLower.includes('tennis')) return '🎾';
    if (leagueLower.includes('golf')) return '⛳';
    if (leagueLower.includes('rugby')) return '🏉';
    if (leagueLower.includes('cricket')) return '🏏';
    if (leagueLower.includes('f1') || leagueLower.includes('formula')) return '🏎️';
    if (leagueLower.includes('mma') || leagueLower.includes('ufc')) return '🥊';
    if (leagueLower.includes('boxing')) return '🥊';
    return '⚽';
  };
  
  // Transform matches data
  const matchs = useMemo(() => {
    let matches: any[] = [];
    if (Array.isArray(matchesData)) {
      matches = matchesData;
    } else if (matchesData?.matches) {
      matches = matchesData.matches;
    } else if (matchesData?.data) {
      matches = matchesData.data;
    }
    
    return matches.map((vm: any) => {
      const match = vm.match || vm;
      let dateStr = '';
      let heureStr = '';
      let isFinished = vm.status === 'finished';
      
      try {
        const startTime = match.scheduled_at || match.start_time || vm.scheduled_at;
        if (startTime) {
          const date = new Date(startTime);
          if (!isNaN(date.getTime())) {
            dateStr = format(date, 'dd/MM/yyyy', { locale: fr });
            heureStr = format(date, 'HH:mm', { locale: fr });
            if (vm.status) {
              isFinished = vm.status === 'finished';
            } else {
              isFinished = date < new Date();
            }
          }
        }
      } catch (e) {
        console.warn('Error parsing match date:', e);
      }
      
      const equipe1 = match.homeTeam || match.home_team?.name || 'Équipe A';
      const equipe2 = match.awayTeam || match.away_team?.name || 'Équipe B';
      const league = match.league || match.competition?.name || '';
      
      return {
        id: vm.id || match.id,
        equipe1,
        equipe2,
        date: dateStr,
        heure: heureStr,
        sport: getSportEmoji(league),
        sportNom: league || 'Football',
        total: vm.total_capacity || vm.capacity || 50,
        reservees: vm.reserved_seats || vm.reservations_count || 0,
        statut: isFinished ? 'terminé' : 'à venir',
      };
    });
  }, [matchesData]);

  const matchsAVenir = matchs.filter((m: any) => m.statut === 'à venir');
  const matchsTermines = matchs.filter((m: any) => m.statut === 'terminé');

  const stats = [
    {
      id: 'clients-detail' as PageType,
      title: 'Total clients',
      value: String(analyticsSummary?.total_clients ?? totalClients ?? 0),
      trend: analyticsSummary?.trends?.clients,
      icon: Users,
      color: 'purple' as const,
    },
    {
      id: 'mes-matchs' as PageType,
      title: 'Matchs diffusés',
      value: String(analyticsSummary?.matches_completed ?? matchsTermines.length),
      trend: analyticsSummary?.trends?.matches,
      icon: Eye,
      color: 'blue' as const,
      filter: 'terminé' as const,
    },
    {
      id: 'mes-matchs' as PageType,
      title: 'Matchs à venir',
      value: String(analyticsSummary?.matches_upcoming ?? matchsAVenir.length),
      trend: analyticsSummary?.trends?.matches,
      icon: Calendar,
      color: 'green' as const,
      filter: 'à venir' as const,
    },
    {
      id: 'vues-detail' as PageType,
      title: 'Vues totales',
      value: String(analyticsSummary?.total_views ?? 0),
      trend: analyticsSummary?.trends?.views,
      icon: Eye,
      color: 'orange' as const,
    },
  ];

  const upcomingMatches = matchsAVenir.slice(0, 4);

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
                className={`px-4 py-1.5 rounded-md text-sm transition-all duration-200 ${
                  periodFilter === period
                    ? 'bg-[#5a03cf] text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        {analyticsError && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-200">
            <AlertCircle className="h-4 w-4" />
            Certaines statistiques ne sont pas disponibles depuis le back pour le moment.
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <button
              key={index}
              onClick={() => onNavigate(stat.id, undefined, undefined, stat.filter)}
              className="group relative bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-[#5a03cf]/30 hover:shadow-xl hover:shadow-[#5a03cf]/5 transition-all duration-300 text-left"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  stat.color === 'purple' ? 'bg-[#5a03cf]/10' :
                  stat.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20' :
                  stat.color === 'green' ? 'bg-green-50 dark:bg-green-900/20' :
                  'bg-orange-50 dark:bg-orange-900/20'
                }`}>
                  <stat.icon className={`w-6 h-6 ${
                    stat.color === 'purple' ? 'text-[#5a03cf]' :
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
                  {typeof stat.trend === 'number' ? (
                    stat.trend >= 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">
                        <TrendingUp className="w-3 h-3" />
                        +{stat.trend}%
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
                        <ArrowDownRight className="w-3 h-3" />
                        {stat.trend}%
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                      Donnée indisponible
                    </span>
                  )}
                  {typeof stat.trend === 'number' && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">vs période précédente</span>
                  )}
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
                          <div className="text-sm text-gray-900 dark:text-white mb-1">{match.equipe1} vs {match.equipe2}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {match.date} • {match.heure}
                          </div>
                        </div>
                        <MoreVertical className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400" />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg p-2">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-600 dark:text-gray-400">Réservations</span>
                            <span className="text-gray-900 dark:text-white">{match.reservees || 0}/{match.total || 50}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div 
                              className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${((match.reservees || 0) / (match.total || 50)) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Sport</div>
                          <div className="text-sm text-gray-900 dark:text-white">{match.sportNom}</div>
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
              {recentActivityError && (
                <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-800/40 dark:bg-amber-900/20 dark:text-amber-200">
                  Impossible de charger l'activité récente depuis le back.
                </div>
              )}
              <div className="space-y-4">
                {recentActivityLoading ? (
                  <div className="flex items-center justify-center py-6 text-gray-500 dark:text-gray-400">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Chargement...
                  </div>
                ) : (recentActivityData || []).length === 0 ? (
                  <div className="text-sm text-gray-500 dark:text-gray-400 py-2">
                    Aucune activité récente.
                  </div>
                ) : (recentActivityData || []).map((activity) => (
                  <div 
                    key={activity.id}
                    className={`flex gap-3 ${activity.type === 'reservation' ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 -mx-2 px-2 py-2 rounded-lg transition-colors' : ''}`}
                    onClick={() => activity.type === 'reservation' && onNavigate('reservations')}
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.type === 'reservation' ? 'bg-green-500' : 'bg-purple-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white mb-1">
                        {activity.type === 'reservation'
                          ? `${activity.user_name || 'Client'} a réservé${activity.details?.match ? ` • ${activity.details.match}` : ''}`
                          : `${activity.user_name || 'Client'} a laissé un avis${activity.details?.rating ? ` (${activity.details.rating}/5)` : ''}`
                        }
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {format(new Date(activity.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                        {activity.venue_name ? ` • ${activity.venue_name}` : ''}
                      </p>
                    </div>
                    {activity.type === 'reservation' && (
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
