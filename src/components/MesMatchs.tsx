import { Calendar, Eye, Plus, Zap, Edit, TrendingUp, Users, Clock, ChevronRight, Filter } from 'lucide-react';
import { useState } from 'react';
import { PageType } from '../App';
import { useAuth } from '../context/AuthContext';
import { usePartnerVenueMatches } from '../hooks/api';

interface MesMatchsProps {
  onNavigate?: (page: PageType, matchId?: number) => void;
  defaultFilter?: 'tous' | 'à venir' | 'terminé';
}

export function MesMatchs({ onNavigate, defaultFilter = 'à venir' }: MesMatchsProps) {
  const { currentUser } = useAuth();
  const [filtre, setFiltre] = useState<'tous' | 'à venir' | 'terminé'>(defaultFilter);

  // Fetch matches from API
  const { data: matchesData, isLoading, error } = usePartnerVenueMatches();
  
  // Return loading UI immediately - before any data processing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5a03cf] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  // Log errors for debugging
  if (error) console.error('Matches error:', error);
  
  // Transform API data to match component expectations (safe - loading is done)
  const normalizeMatchesResponse = (() => {
    if (Array.isArray(matchesData?.data)) return matchesData.data;
    if (Array.isArray(matchesData?.matches)) return matchesData.matches;
    if (Array.isArray(matchesData)) return matchesData;
    return [];
  })();

  const matchs = normalizeMatchesResponse.map((m: any) => {
    const scheduledAt = m.match?.scheduled_at || m.scheduled_at || m.match?.scheduledAt;
    const matchDate = scheduledAt ? new Date(scheduledAt) : null;
    const now = new Date();
    const statut = matchDate && matchDate < now && (m.status === 'finished' || m.status === 'live' || true)
      ? 'terminé'
      : (m.status === 'finished' ? 'terminé' : 'à venir');

    const equipe1 = m.match?.homeTeam || m.match?.home_team || m.equipe1 || 'Équipe 1';
    const equipe2 = m.match?.awayTeam || m.match?.away_team || m.equipe2 || 'Équipe 2';
    const sportNom = typeof m.match?.league === 'string'
      ? m.match.league
      : m.match?.league?.name || m.league?.name || 'Compétition';
    const sport = m.match?.sport?.emoji || m.match?.sport_emoji || '⚽';

    const reservees = m.reserved_seats ?? m.reservations_count ?? m.reservees ?? 0;
    const total = m.total_capacity ?? m.total_seats ?? m.total ?? 0;
    const available = m.available_capacity ?? m.available_seats ?? total - reservees;

    return {
      id: m.id,
      equipe1,
      equipe2,
      sport,
      sportNom,
      date: matchDate ? matchDate.toLocaleDateString('fr-FR') : 'Date à confirmer',
      heure: matchDate ? matchDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '20:00',
      statut,
      reservees,
      total: total || (reservees + available),
      vues: m.views_count || m.vues || 0,
      placesDisponibles: Math.max(available, 0),
      reservations: reservees,
      competition: sportNom,
      boosted: m.is_boosted || m.boosted || false,
    };
  });

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

  const totalMatchs = matchs.length;
  const matchsAVenir = matchs.filter(m => m.statut === 'à venir').length;
  const matchsTermines = matchs.filter(m => m.statut === 'terminé').length;
  const moyenneRemplissage = matchs.length > 0
    ? Math.round(matchs.reduce((acc, m) => acc + (m.reservees / m.total) * 100, 0) / matchs.length)
    : 0;

  const matchsFiltres = filtre === 'tous' 
    ? matchs 
    : matchs.filter(m => m.statut === filtre);

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
                        {match.statut === 'terminé' && (
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
                      {match.statut === 'à venir' ? (
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