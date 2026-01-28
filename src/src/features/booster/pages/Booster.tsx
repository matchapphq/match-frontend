import { TrendingUp, Zap, Eye, Users, Target, Gift, Sparkles, ChevronRight, CheckCircle2, ArrowUpRight, ShoppingCart, Loader2, X } from 'lucide-react';
import { PageType } from '../../../types';
import { useState, useMemo, useEffect } from 'react';
import { useBoostSummary, useBoostHistory, useBoostableMatches, useActivateBoost } from '../../../hooks/api/useBoosts';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

interface BoosterProps {
  onBack: () => void;
  onNavigate?: (page: PageType) => void;
  purchaseSuccess?: boolean;
  purchasedCount?: number;
}

export function Booster({ onBack, onNavigate, purchaseSuccess, purchasedCount }: BoosterProps) {
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [showMatchSelector, setShowMatchSelector] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(purchaseSuccess || false);
  
  // Handle purchase success prop changes
  useEffect(() => {
    if (purchaseSuccess) {
      setShowSuccessBanner(true);
      // Auto-hide after 8 seconds
      const timer = setTimeout(() => {
        setShowSuccessBanner(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [purchaseSuccess]);
  
  // Fetch boost summary (available boosts, stats)
  const { data: summaryData, isLoading: summaryLoading } = useBoostSummary();
  
  // Fetch boost history
  const { data: historyData, isLoading: historyLoading } = useBoostHistory();
  
  // Fetch venues for boostable matches
  const { data: venuesData } = useQuery({
    queryKey: ['partner-venues'],
    queryFn: async () => {
      const response = await apiClient.get('/partners/venues');
      return response.data.venues || [];
    },
  });
  
  const firstVenueId = venuesData?.[0]?.id || null;
  
  // Fetch boostable matches
  const { data: boostableMatches, isLoading: matchesLoading } = useBoostableMatches(firstVenueId);
  
  // Activate boost mutation
  const activateBoostMutation = useActivateBoost();
  
  // Calculate stats from history
  const boostsDisponibles = summaryData?.available_boosts || 0;
  
  // Transform history data
  const matchsBoostes = useMemo(() => {
    if (!historyData || !Array.isArray(historyData)) return [];
    return historyData.map((boost: any) => {
      let dateStr = '';
      let heureStr = '';
      try {
        if (boost.match?.scheduled_at || boost.activated_at) {
          const date = new Date(boost.match?.scheduled_at || boost.activated_at);
          dateStr = format(date, 'dd/MM/yyyy', { locale: fr });
          heureStr = format(date, 'HH:mm', { locale: fr });
        }
      } catch (e) {}
      
      return {
        id: boost.id,
        equipe1: boost.match?.home_team || boost.match?.homeTeam || 'Équipe A',
        equipe2: boost.match?.away_team || boost.match?.awayTeam || 'Équipe B',
        date: dateStr,
        heure: heureStr,
        vuesGagnees: boost.views_generated || 0,
        reservations: boost.reservations_generated || 0,
        status: boost.status,
      };
    });
  }, [historyData]);
  
  const totalVuesGagnees = summaryData?.total_views_generated || matchsBoostes.reduce((acc, m) => acc + m.vuesGagnees, 0);
  const totalReservations = summaryData?.total_reservations_generated || matchsBoostes.reduce((acc, m) => acc + m.reservations, 0);

  const handleParrainer = () => {
    if (onNavigate) {
      onNavigate('parrainage');
    }
  };

  const handleBoosterMatch = () => {
    alert('Sélectionnez un match à booster');
  };

  const handleAcheterBoosts = () => {
    if (onNavigate) {
      onNavigate('acheter-boosts');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto pb-24 lg:pb-8">
        {/* Success Banner */}
        {showSuccessBanner && (
          <div className="mb-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden animate-in slide-in-from-top duration-300">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Achat réussi !</h3>
                  <p className="text-white/90 text-sm">
                    {purchasedCount ? `${purchasedCount} boost${purchasedCount > 1 ? 's' : ''} ajouté${purchasedCount > 1 ? 's' : ''} à votre compte` : 'Vos boosts ont été ajoutés à votre compte'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSuccessBanner(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#9cff02] to-[#7cdf00] rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-[#5a03cf]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl text-gray-900 dark:text-gray-100">Booster mes matchs</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Maximisez votre visibilité et vos réservations</p>
            </div>
          </div>
        </div>

        {/* Hero Card */}
        <div className="relative bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 mb-6 sm:mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40" />
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm mb-3 sm:mb-4">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                Boosts disponibles
              </div>
              <div className="text-5xl sm:text-6xl lg:text-7xl mb-3 sm:mb-4 text-white">{boostsDisponibles}</div>
              <p className="text-white/90 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6">
                Utilisez vos boosts pour mettre en avant vos matchs et attirer plus de clients
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <button
                  onClick={handleBoosterMatch}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-[#5a03cf] rounded-xl hover:bg-gray-50 transition-all shadow-xl flex items-center justify-center gap-2 group text-sm sm:text-base"
                >
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                  Booster un match
                </button>
                <button
                  onClick={handleParrainer}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#9cff02] text-[#5a03cf] rounded-xl hover:bg-[#8cef00] transition-all shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
                  Gagner des boosts
                </button>
                <button
                  onClick={handleAcheterBoosts}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#5a03cf] text-white rounded-xl hover:bg-[#7a23ef] transition-all shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                  Acheter des boosts
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
                <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-white mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl text-white mb-1">+{totalVuesGagnees}</div>
                <div className="text-white/80 text-xs sm:text-sm">Vues générées</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl text-white mb-1">+{totalReservations}</div>
                <div className="text-white/80 text-xs sm:text-sm">Réservations</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 col-span-2">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl text-white mb-1">{matchsBoostes.length}</div>
                <div className="text-white/80 text-xs sm:text-sm">Matchs boostés ce mois</div>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl text-gray-900 dark:text-white mb-4 sm:mb-6">Comment fonctionne le boost ?</h2>
            <div className="space-y-4">
              <div className="flex gap-3 sm:gap-4">
                <div className="w-10 h-10 bg-[#5a03cf]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-[#5a03cf]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base text-gray-900 dark:text-white mb-1">Priorité sur la carte</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Votre restaurant apparaît en priorité sur la carte de l'application pour ce match
                  </p>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base text-gray-900 dark:text-white mb-1">Notifications ciblées</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Envoi de notifications ultra personnalisées aux utilisateurs les plus susceptibles de venir
                  </p>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4">
                <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base text-gray-900 dark:text-white mb-1">Badge "Événement boosté"</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Un badge spécial met en avant votre établissement auprès des utilisateurs
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 sm:p-4 bg-gradient-to-r from-[#9cff02]/10 to-[#5a03cf]/10 rounded-xl border border-[#5a03cf]/20">
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 text-center">
                <span className="text-[#5a03cf]">1 boost = 1 match</span> • Chaque boost est unique et dédié à un match spécifique
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 sm:p-8">
            <h2 className="text-lg sm:text-xl text-gray-900 dark:text-white mb-4 sm:mb-6">Comment obtenir des boosts ?</h2>
            
            <div className="bg-gradient-to-br from-[#9cff02]/20 to-[#5a03cf]/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#9cff02]/30 mb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-[#5a03cf]" />
                    <h3 className="text-base sm:text-lg text-gray-900 dark:text-white">Parrainage</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Parrainez un restaurant et gagnez des boosts
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl sm:text-3xl text-[#5a03cf] mb-1">+5</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">boosts</div>
                </div>
              </div>
              <button
                onClick={handleParrainer}
                className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] text-white rounded-xl hover:shadow-xl hover:shadow-[#5a03cf]/30 transition-all flex items-center justify-center gap-2 group text-sm sm:text-base"
              >
                Parrainer maintenant
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>

            <div className="bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#5a03cf]/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-[#5a03cf]" />
                    <h3 className="text-base sm:text-lg text-gray-900 dark:text-white">Acheter des boosts</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Choisissez parmi nos packs et boostez immédiatement
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg sm:text-xl text-[#5a03cf] mb-1">dès 30€</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">par boost</div>
                </div>
              </div>
              <button
                onClick={handleAcheterBoosts}
                className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-white dark:bg-gray-800 text-[#5a03cf] border-2 border-[#5a03cf]/20 hover:border-[#5a03cf] rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 group text-sm sm:text-base"
              >
                Voir les packs
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Historique */}
        <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg text-gray-900 dark:text-white mb-1">Historique des boosts</h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Performance de vos matchs boostés</p>
              </div>
              <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-xs sm:text-sm self-start sm:self-auto">
                {matchsBoostes.length} boost{matchsBoostes.length > 1 ? 's' : ''} utilisé{matchsBoostes.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            {matchsBoostes.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2">Aucun boost utilisé</p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Boostez votre premier match pour maximiser sa visibilité
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {matchsBoostes.map((match) => (
                  <div
                    key={match.id}
                    className="group bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl p-4 sm:p-5 transition-all border border-transparent hover:border-[#5a03cf]/20"
                  >
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#9cff02] to-[#7cdf00] rounded-lg flex items-center justify-center">
                            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#5a03cf]" />
                          </div>
                          <h3 className="text-sm sm:text-base text-gray-900 dark:text-white">{match.equipe1} vs {match.equipe2}</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          {match.date} à {match.heure}
                        </p>
                      </div>
                      <span className="px-2 sm:px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs flex items-center gap-1 whitespace-nowrap">
                        <CheckCircle2 className="w-3 h-3" />
                        Boosté
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-2.5 sm:p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">Vues</span>
                        </div>
                        <div className="text-base sm:text-lg text-gray-900 dark:text-white">+{match.vuesGagnees}</div>
                      </div>
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-2.5 sm:p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">Réservations</span>
                        </div>
                        <div className="text-base sm:text-lg text-gray-900 dark:text-white">+{match.reservations}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
