import { Calendar, Eye, Plus, Zap, Edit, TrendingUp, Users, Clock, ChevronRight, Filter, Loader2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import { PageType } from '../../../types';
import { useAuth } from '../../authentication/context/AuthContext';
import { usePartnerMatches } from '../../../hooks/api/useMatches';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MesMatchsProps {
  onNavigate?: (page: PageType, matchId?: number) => void;
  defaultFilter?: 'tous' | 'à venir' | 'terminé';
}

export function MesMatchs({ onNavigate, defaultFilter = 'à venir' }: MesMatchsProps) {
  const { currentUser } = useAuth();
  const [filtre, setFiltre] = useState<'tous' | 'à venir' | 'terminé'>(defaultFilter);
  
  // Fetch matches from API
  const { data: matchesData, isLoading } = usePartnerMatches();
  
  // Sport emoji mapping based on league name
  const getSportEmoji = (league: string): string => {
    const leagueLower = (league || '').toLowerCase();
    if (leagueLower.includes('nfl') || leagueLower.includes('american football')) return '🏈';
    if (leagueLower.includes('nba') || leagueLower.includes('basketball')) return '🏀';
    if (leagueLower.includes('nhl') || leagueLower.includes('hockey')) return '🏒';
    if (leagueLower.includes('mlb') || leagueLower.includes('baseball')) return '⚾';
    if (leagueLower.includes('tennis') || leagueLower.includes('atp') || leagueLower.includes('wta')) return '🎾';
    if (leagueLower.includes('golf') || leagueLower.includes('pga')) return '⛳';
    if (leagueLower.includes('rugby')) return '🏉';
    if (leagueLower.includes('cricket')) return '🏏';
    if (leagueLower.includes('f1') || leagueLower.includes('formula')) return '🏎️';
    if (leagueLower.includes('mma') || leagueLower.includes('ufc')) return '🥊';
    if (leagueLower.includes('boxing')) return '🥊';
    // Default to football/soccer for Premier League, La Liga, Serie A, Bundesliga, Ligue 1, etc.
    return '⚽';
  };
  
  // Transform API data to match expected format
  const matchs = useMemo(() => {
    let matches: any[] = [];
    if (Array.isArray(matchesData)) {
      matches = matchesData;
    } else if (matchesData?.matches && Array.isArray(matchesData.matches)) {
      matches = matchesData.matches;
    } else if (matchesData?.data && Array.isArray(matchesData.data)) {
      matches = matchesData.data;
    }
    
    return matches.map((vm: any) => {
      const match = vm.match || vm;
      let dateStr = '';
      let heureStr = '';
      let isFinished = vm.status === 'finished';
      
      try {
        // Use scheduled_at from the actual API response
        const startTime = match.scheduled_at || match.start_time || vm.scheduled_at;
        if (startTime) {
          const date = new Date(startTime);
          if (!isNaN(date.getTime())) {
            dateStr = format(date, 'dd/MM/yyyy', { locale: fr });
            heureStr = format(date, 'HH:mm', { locale: fr });
            // Use status from API if available, otherwise check date
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
      
      // Get team names - API uses homeTeam/awayTeam as strings
      const equipe1 = match.homeTeam || match.home_team?.name || match.home_team || 'Équipe A';
      const equipe2 = match.awayTeam || match.away_team?.name || match.away_team || 'Équipe B';
      const league = match.league || match.competition?.name || '';
      
      return {
        id: vm.id || match.id,
        equipe1,
        equipe2,
        date: dateStr,
        heure: heureStr,
        sport: getSportEmoji(league),
        sportNom: league || 'Football',
        competition: league,
        total: vm.total_capacity || vm.capacity || 50,
        reservees: vm.reserved_seats || vm.reservations_count || 0,
        statut: isFinished ? 'terminé' : 'à venir',
        venueId: vm.venue?.id || vm.venue_id,
        matchId: match.id,
      };
    });
  }, [matchesData]);
  
  // Helper function to check if match is finished
  const isMatchFinished = (date: string, heure: string, statut: string) => {
    if (statut === 'terminé') return true;
    if (!date || !heure) return false;
    try {
      const dateParts = date.split('/');
      const timeParts = heure.split(':');
      if (dateParts.length < 3 || timeParts.length < 2) return false;
      
      const day = parseInt(dateParts[0] || '0');
      const month = parseInt(dateParts[1] || '0') - 1;
      const year = parseInt(dateParts[2] || '0');
      const hours = parseInt(timeParts[0] || '0');
      const minutes = parseInt(timeParts[1] || '0');
      
      const matchDate = new Date(year, month, day, hours, minutes);
      return matchDate < new Date();
    } catch {
      return false;
    }
  };

  const handleProgrammerMatch = () => {
    if (onNavigate) {
      onNavigate('programmer-match');
    }
  };

  const handleMatchClick = (matchId: number) => {
    if (onNavigate) {
      onNavigate('match-detail', matchId);
    }
  };

  const handleEditMatch = (e: React.MouseEvent, matchId: number) => {
    e.stopPropagation();
    if (onNavigate) {
      onNavigate('modifier-match', matchId);
    }
  };

  const handleBoostClick = (e: React.MouseEvent, matchId: number) => {
    e.stopPropagation();
    if (onNavigate) {
      onNavigate('booster');
    }
  };

  const getDemandesEnAttente = (matchId: number) => {
    const random = [0, 0, 0, 1, 2, 3];
    return random[matchId % random.length] || 0;
  };

  // Calculate match statistics based on real-time 48h rule
  const totalMatchs = matchs.length;
  const matchsAVenir = matchs.filter(m => !isMatchFinished(m.date, m.heure, m.statut)).length;
  const matchsTermines = matchs.filter(m => isMatchFinished(m.date, m.heure, m.statut)).length;
  const moyenneRemplissage = matchs.length > 0
    ? Math.round(matchs.reduce((acc, m) => acc + (m.reservees / m.total) * 100, 0) / matchs.length)
    : 0;

  // Filter matches based on 48h rule
  const matchsFiltres = filtre === 'tous' 
    ? matchs 
    : filtre === 'terminé'
      ? matchs.filter(m => isMatchFinished(m.date, m.heure, m.statut))
      : matchs.filter(m => !isMatchFinished(m.date, m.heure, m.statut));

  const getPercentage = (reservees: number, total: number) => {
    return Math.round((reservees / total) * 100);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto pb-24 lg:pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl text-gray-900 dark:text-white mb-1">Mes matchs</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Gérez tous vos événements sportifs</p>
          </div>
          <button
            onClick={handleProgrammerMatch}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] text-white rounded-xl hover:shadow-xl hover:shadow-[#5a03cf]/30 transition-all flex items-center justify-center gap-2 group text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" />
            Programmer un match
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#5a03cf]/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-[#5a03cf]" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl text-gray-900 dark:text-white mb-1">{totalMatchs}</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total matchs</div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl text-gray-900 dark:text-white mb-1">{matchsAVenir}</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">À venir</div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl text-gray-900 dark:text-white mb-1">{matchsTermines}</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Terminés</div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl text-gray-900 dark:text-white mb-1">{moyenneRemplissage}%</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Taux de remplissage</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <Filter className="w-4 h-4" />
            Filtrer :
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-1 shadow-sm">
            {(['tous', 'à venir', 'terminé'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setFiltre(filter)}
                className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm transition-all duration-200 capitalize ${
                  filtre === filter
                    ? 'bg-[#5a03cf] text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="sm:ml-auto text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-right">
            {matchsFiltres.length} match{matchsFiltres.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Matches List */}
        {matchsFiltres.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-8 sm:p-16">
            <div className="text-center max-w-md mx-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg sm:text-xl text-gray-900 dark:text-white mb-2">Aucun match {filtre !== 'tous' ? filtre : ''}</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6">
                {filtre === 'à venir' 
                  ? 'Programmez votre premier match pour commencer à accueillir des clients.'
                  : 'Aucun match trouvé avec ce filtre.'}
              </p>
              {filtre === 'à venir' && (
                <button
                  onClick={handleProgrammerMatch}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] text-white rounded-xl hover:shadow-xl hover:shadow-[#5a03cf]/30 transition-all inline-flex items-center gap-2 text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Programmer un match
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {matchsFiltres.map((match) => {
              const percentage = getPercentage(match.reservees, match.total);
              const placesRestantes = match.total - match.reservees;
              const demandesEnAttente = getDemandesEnAttente(match.id);

              return (
                <div
                  key={match.id}
                  className="group bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-[#5a03cf]/30 hover:shadow-xl hover:shadow-[#5a03cf]/5 transition-all duration-300 p-4 sm:p-6"
                >
                  <div 
                    onClick={() => handleMatchClick(match.id)}
                    className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 cursor-pointer"
                  >
                    {/* Sport Icon */}
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#5a03cf]/10 to-[#7a23ef]/10 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl sm:text-3xl">
                      {match.sport}
                    </div>

                    {/* Match Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-base sm:text-lg text-gray-900 dark:text-white group-hover:text-[#5a03cf] transition-colors">
                          {match.equipe1} vs {match.equipe2}
                        </h3>
                        {demandesEnAttente > 0 && (
                          <span className="px-2 sm:px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-xs flex items-center gap-1 whitespace-nowrap">
                            <Clock className="w-3 h-3" />
                            {demandesEnAttente} en attente
                          </span>
                        )}
                        {isMatchFinished(match.date, match.heure, match.statut) && (
                          <span className="px-2 sm:px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                            Terminé
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <span>{match.date}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{match.heure}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline">{match.sportNom}</span>
                      </div>
                    </div>

                    {/* Stats - Responsive Layout */}
                    <div className="flex items-center gap-3 sm:gap-6 justify-between sm:justify-start">
                      <div className="text-left sm:text-center">
                        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Places disponibles</div>
                        <div className="text-lg sm:text-xl text-gray-900 dark:text-white">{placesRestantes}/{match.total}</div>
                      </div>

                      {/* Progress Circle */}
                      <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                        <svg className="w-12 h-12 sm:w-16 sm:h-16 transform -rotate-90">
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            className="sm:hidden"
                            stroke="#f3f4f6"
                            strokeWidth="5"
                            fill="none"
                          />
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            className="sm:hidden dark:stroke-gray-700"
                            stroke="currentColor"
                            strokeWidth="5"
                            fill="none"
                            strokeDasharray={`${(percentage / 100) * 2 * Math.PI * 20} ${2 * Math.PI * 20}`}
                            strokeLinecap="round"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            className="hidden sm:block"
                            stroke="#f3f4f6"
                            strokeWidth="6"
                            fill="none"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            className="hidden sm:block dark:stroke-gray-700"
                            stroke="url(#gradient)"
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={`${(percentage / 100) * 2 * Math.PI * 28} ${2 * Math.PI * 28}`}
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#5a03cf" />
                              <stop offset="100%" stopColor="#7a23ef" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs sm:text-sm text-gray-900 dark:text-white">{percentage}%</span>
                        </div>
                      </div>

                      {/* Actions */}
                      {!isMatchFinished(match.date, match.heure, match.statut) ? (
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onNavigate) {
                                onNavigate('reservations', match.id);
                              }
                            }}
                            className="p-2 sm:p-2.5 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg transition-colors"
                            title="Voir les réservations"
                          >
                            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                          </button>
                          <button
                            onClick={(e) => handleEditMatch(e, match.id)}
                            className="p-2 sm:p-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
                          </button>
                          <button
                            onClick={(e) => handleBoostClick(e, match.id)}
                            className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-br from-[#9cff02] to-[#7cdf00] text-[#5a03cf] rounded-lg hover:shadow-lg transition-all flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                          >
                            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Boost</span>
                          </button>
                        </div>
                      ) : (
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 dark:text-gray-500 group-hover:text-[#5a03cf] group-hover:translate-x-1 transition-all" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
