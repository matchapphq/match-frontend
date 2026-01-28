import { ArrowLeft, Edit, Calendar, Clock, MapPin, Users, Save, Trophy } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

interface ModifierMatchProps {
  matchId: number | null;
  onBack: () => void;
}

export function ModifierMatch({ matchId, onBack }: ModifierMatchProps) {
  const { matchs, restaurants, updateMatch } = useAppContext();
  const match = matchs.find(m => m.id === matchId);

  const [formData, setFormData] = useState({
    restaurantId: match?.restaurantId || 1,
    equipe1: match?.equipe1 || '',
    equipe2: match?.equipe2 || '',
    date: match?.date || '',
    heure: match?.heure || '',
    sport: match?.sport || '⚽',
    sportNom: match?.sportNom || 'Football',
    competition: match?.competition || 'Ligue 1',
  });

  const [placesDisponibles, setPlacesDisponibles] = useState(match?.total || 30);
  const [placesReservees] = useState(match?.reservees || 0);

  const selectedRestaurant = restaurants.find(r => r.id === formData.restaurantId);
  const maxPlaces = selectedRestaurant?.capaciteMax || 50;

  useEffect(() => {
    if (match) {
      setFormData({
        restaurantId: match.restaurantId,
        equipe1: match.equipe1,
        equipe2: match.equipe2,
        date: match.date,
        heure: match.heure,
        sport: match.sport,
        sportNom: match.sportNom,
        competition: match.competition || 'Ligue 1',
      });
      setPlacesDisponibles(match.total);
    }
  }, [match]);

  useEffect(() => {
    // Ajuster les places si on change de restaurant
    if (placesDisponibles > maxPlaces) {
      setPlacesDisponibles(maxPlaces);
    }
  }, [formData.restaurantId, maxPlaces, placesDisponibles]);

  const equipes = [
    'PSG', 'OM', 'Lyon', 'Monaco', 'Nice', 'Lille', 'Lens',
    'Real Madrid', 'Barcelona', 'Bayern', 'Dortmund', 'Liverpool',
    'Manchester City', 'Manchester United', 'Arsenal', 'Chelsea'
  ];

  const competitions = [
    'Ligue 1',
    'Ligue 2',
    'Ligue des Champions',
    'Europa League',
    'Coupe de France',
    'Premier League',
    'La Liga',
    'Serie A',
    'Bundesliga',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (matchId) {
      const selectedRestaurant = restaurants.find(r => r.id === formData.restaurantId);
      updateMatch(matchId, {
        ...formData,
        total: placesDisponibles,
        restaurant: selectedRestaurant?.nom || '',
      });
      alert('Match modifié avec succès !');
      onBack();
    }
  };

  if (!match) {
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
            <span className="text-2xl">{match.sport}</span>
            <span className="text-sm text-gray-700 dark:text-gray-300">{match.sportNom}</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl mb-4">
            Modifier le{' '}
            <span className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
              match
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {match.equipe1} vs {match.equipe2}
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
            <p className="text-xl text-gray-900 dark:text-white line-clamp-1">{match.restaurant}</p>
          </div>
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Date</span>
            </div>
            <p className="text-xl text-gray-900 dark:text-white">{new Date(match.date).toLocaleDateString('fr-FR')}</p>
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
              value={formData.restaurantId}
              onChange={(e) => setFormData({ ...formData, restaurantId: Number(e.target.value) })}
              className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:border-[#5a03cf]/50 text-gray-900 dark:text-white"
            >
              {restaurants.map((resto) => (
                <option key={resto.id} value={resto.id}>
                  {resto.nom} (Capacité: {resto.capaciteMax} places)
                </option>
              ))}
            </select>
          </div>

          {/* Équipes */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <label className="block text-gray-900 dark:text-white mb-3">
                Équipe 1
              </label>
              <select 
                value={formData.equipe1}
                onChange={(e) => setFormData({ ...formData, equipe1: e.target.value })}
                className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:border-[#5a03cf]/50 text-gray-900 dark:text-white"
              >
                {equipes.map((equipe) => (
                  <option key={equipe} value={equipe}>
                    {equipe}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <label className="block text-gray-900 dark:text-white mb-3">
                Équipe 2
              </label>
              <select 
                value={formData.equipe2}
                onChange={(e) => setFormData({ ...formData, equipe2: e.target.value })}
                className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:border-[#5a03cf]/50 text-gray-900 dark:text-white"
              >
                {equipes.map((equipe) => (
                  <option key={equipe} value={equipe}>
                    {equipe}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Compétition */}
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
            <label className="flex items-center gap-2 text-gray-900 dark:text-white mb-3">
              <Trophy className="w-4 h-4 text-[#5a03cf]" />
              Compétition
            </label>
            <select 
              value={formData.competition}
              onChange={(e) => setFormData({ ...formData, competition: e.target.value })}
              className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:border-[#5a03cf]/50 text-gray-900 dark:text-white"
            >
              {competitions.map((comp) => (
                <option key={comp} value={comp}>
                  {comp}
                </option>
              ))}
            </select>
          </div>

          {/* Date et heure */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <label className="flex items-center gap-2 text-gray-900 dark:text-white mb-3">
                <Calendar className="w-4 h-4 text-[#5a03cf]" />
                Date du match
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:border-[#5a03cf]/50 text-gray-900 dark:text-white"
              />
            </div>
            
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <label className="flex items-center gap-2 text-gray-900 dark:text-white mb-3">
                <Clock className="w-4 h-4 text-[#5a03cf]" />
                Heure du match
              </label>
              <input
                type="time"
                value={formData.heure}
                onChange={(e) => setFormData({ ...formData, heure: e.target.value })}
                className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:border-[#5a03cf]/50 text-gray-900 dark:text-white"
              />
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
