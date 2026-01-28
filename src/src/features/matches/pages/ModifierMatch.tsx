import { ArrowLeft, Calendar, Clock, MapPin, Users, Save, Trophy, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/client';
import { useUpdateScheduledMatch } from '../../../hooks/api/useMatches';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ModifierMatchProps {
  matchId: string | null;
  onBack: () => void;
}

export function ModifierMatch({ matchId, onBack }: ModifierMatchProps) {
  // Fetch venue match data from API
  const { data: venueMatchData, isLoading } = useQuery({
    queryKey: ['venue-match', matchId],
    queryFn: async () => {
      if (!matchId) return null;
      // Fetch all venue matches and find the one we need
      const response = await apiClient.get('/partners/venues/matches');
      const matches = response.data?.data || response.data?.matches || response.data || [];
      return matches.find((vm: any) => vm.id === matchId);
    },
    enabled: !!matchId,
  });

  // Fetch venues for dropdown
  const { data: venuesData } = useQuery({
    queryKey: ['partner-venues'],
    queryFn: async () => {
      const response = await apiClient.get('/partners/venues');
      return response.data?.venues || response.data || [];
    },
  });

  const venues = venuesData || [];
  const updateMutation = useUpdateScheduledMatch();

  // Extract match info from venue match data
  const venueMatch = venueMatchData;
  const matchInfo = venueMatch?.match || venueMatch;
  
  const [formData, setFormData] = useState({
    venueId: '',
    equipe1: '',
    equipe2: '',
    date: '',
    heure: '',
    sport: '⚽',
    sportNom: 'Football',
    competition: '',
  });

  const [placesDisponibles, setPlacesDisponibles] = useState(50);
  const [placesReservees, setPlacesReservees] = useState(0);

  const selectedVenue = venues.find((v: any) => v.id === formData.venueId);
  const maxPlaces = selectedVenue?.capacity || 100;

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

  useEffect(() => {
    if (venueMatch && matchInfo) {
      const league = matchInfo.league || matchInfo.competition?.name || '';
      let dateStr = '';
      let heureStr = '';
      
      try {
        const startTime = matchInfo.scheduled_at || matchInfo.start_time;
        if (startTime) {
          const date = new Date(startTime);
          if (!isNaN(date.getTime())) {
            dateStr = format(date, 'yyyy-MM-dd');
            heureStr = format(date, 'HH:mm');
          }
        }
      } catch (e) {
        console.warn('Error parsing date:', e);
      }
      
      setFormData({
        venueId: venueMatch.venue?.id || venueMatch.venue_id || '',
        equipe1: matchInfo.homeTeam || matchInfo.home_team?.name || 'Équipe A',
        equipe2: matchInfo.awayTeam || matchInfo.away_team?.name || 'Équipe B',
        date: dateStr,
        heure: heureStr,
        sport: getSportEmoji(league),
        sportNom: league || 'Football',
        competition: league,
      });
      setPlacesDisponibles(venueMatch.total_capacity || venueMatch.capacity || 50);
      setPlacesReservees(venueMatch.reserved_seats || venueMatch.reservations_count || 0);
    }
  }, [venueMatch, matchInfo]);

  useEffect(() => {
    // Adjust places if changed venue
    if (placesDisponibles > maxPlaces) {
      setPlacesDisponibles(maxPlaces);
    }
  }, [formData.venueId, maxPlaces, placesDisponibles]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchId || !formData.venueId) {
      toast.error('Données manquantes');
      return;
    }
    
    try {
      await updateMutation.mutateAsync({
        venueId: formData.venueId,
        matchId: matchInfo?.id || matchId,
        capacity: placesDisponibles,
      });
      toast.success('Match modifié avec succès !');
      onBack();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la modification');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#5a03cf]" />
          <p className="text-gray-600 dark:text-gray-400">Chargement du match...</p>
        </div>
      </div>
    );
  }

  if (!venueMatch) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
        <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#5a03cf] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
            <p className="text-gray-500 dark:text-gray-400">Match non trouvé</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#5a03cf] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#9cff02] rounded-full animate-pulse" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Modification de match</span>
            </div>
            
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-full mb-6">
            <span className="text-2xl">{formData.sport}</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">{formData.sportNom}</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl mb-4">
            Modifier le{' '}
            <span className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
              match
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {formData.equipe1} vs {formData.equipe2}
          </p>
        </div>

        {/* Stats actuelles */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-sm">Réservations</span>
            </div>
            <p className="text-2xl text-gray-900 dark:text-white">{placesReservees}</p>
          </div>
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Établissement</span>
            </div>
            <p className="text-xl text-gray-900 dark:text-white line-clamp-1">{selectedVenue?.name || venueMatch?.venue?.name || 'N/A'}</p>
          </div>
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Date</span>
            </div>
            <p className="text-xl text-gray-900 dark:text-white">{formData.date ? new Date(formData.date).toLocaleDateString('fr-FR') : 'N/A'}</p>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Établissement */}
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
            <label className="flex items-center gap-2 text-gray-900 dark:text-white mb-3">
              <MapPin className="w-4 h-4 text-[#5a03cf]" />
              Établissement
            </label>
            <select 
              value={formData.venueId}
              onChange={(e) => setFormData({ ...formData, venueId: e.target.value })}
              className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:border-[#5a03cf]/50 text-gray-900 dark:text-white"
            >
              {venues.map((venue: { id: string; name: string; capacity?: number }) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name} (Capacité: {venue.capacity || 50} places)
                </option>
              ))}
            </select>
          </div>

          {/* Match Info (Read-only) */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <label className="block text-gray-900 dark:text-white mb-3">
                Équipe 1
              </label>
              <div className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white">
                {formData.equipe1}
              </div>
            </div>
            
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <label className="block text-gray-900 dark:text-white mb-3">
                Équipe 2
              </label>
              <div className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white">
                {formData.equipe2}
              </div>
            </div>
          </div>

          {/* Compétition (Read-only) */}
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
            <label className="flex items-center gap-2 text-gray-900 dark:text-white mb-3">
              <Trophy className="w-4 h-4 text-[#5a03cf]" />
              Compétition
            </label>
            <div className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white">
              {formData.competition || 'N/A'}
            </div>
          </div>

          {/* Date et heure (Read-only) */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <label className="flex items-center gap-2 text-gray-900 dark:text-white mb-3">
                <Calendar className="w-4 h-4 text-[#5a03cf]" />
                Date du match
              </label>
              <div className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white">
                {formData.date ? new Date(formData.date).toLocaleDateString('fr-FR') : 'N/A'}
              </div>
            </div>
            
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <label className="flex items-center gap-2 text-gray-900 dark:text-white mb-3">
                <Clock className="w-4 h-4 text-[#5a03cf]" />
                Heure du match
              </label>
              <div className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white">
                {formData.heure || 'N/A'}
              </div>
            </div>
          </div>

          {/* Places disponibles */}
          <div className="bg-gradient-to-br from-[#5a03cf]/5 to-[#9cff02]/5 dark:from-[#5a03cf]/10 dark:to-[#9cff02]/10 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Users className="w-4 h-4 text-[#5a03cf]" />
                Places disponibles
              </label>
              <span className="text-2xl bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
                {placesDisponibles}
              </span>
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-3">
                <p className="text-gray-600 dark:text-gray-400">Déjà réservées</p>
                <p className="text-lg text-[#5a03cf]">{placesReservees}</p>
              </div>
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-3">
                <p className="text-gray-600 dark:text-gray-400">Capacité max</p>
                <p className="text-lg text-[#5a03cf]">{maxPlaces}</p>
              </div>
            </div>
            
            <input
              type="range"
              min={placesReservees}
              max={maxPlaces}
              value={placesDisponibles}
              onChange={(e) => setPlacesDisponibles(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #9cff02 0%, #9cff02 ${(placesDisponibles / maxPlaces) * 100}%, #e5e7eb ${(placesDisponibles / maxPlaces) * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
              <span>Min: {placesReservees}</span>
              <span>Max: {maxPlaces}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white py-4 rounded-full hover:brightness-110 hover:shadow-xl hover:shadow-[#5a03cf]/30 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Enregistrer les modifications
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-8 py-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 rounded-full hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
