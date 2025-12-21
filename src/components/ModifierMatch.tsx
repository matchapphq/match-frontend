import { ArrowLeft, Edit } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

interface ModifierMatchProps {
  matchId: string | null;
  onBack: () => void;
}

export function ModifierMatch({ matchId, onBack }: ModifierMatchProps) {
  const { matchs, restaurants, updateMatch } = useAppContext();
  const match = matchs.find(m => m.id === matchId);

  const [formData, setFormData] = useState({
    restaurantId: match?.restaurantId || '1',
    equipe1: match?.equipe1 || '',
    equipe2: match?.equipe2 || '',
    date: match?.date || '',
    heure: match?.heure || '',
    sport: match?.sport || '⚽',
    sportNom: match?.sportNom || 'Football',
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
      <div className="p-8 max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour aux matchs
        </button>
        <div className="text-center py-12">
          <p className="text-gray-500">Match non trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour aux matchs
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-gradient-to-br from-[#9cff02] to-[#7cdf00] p-3 rounded-xl">
            <Edit className="w-8 h-8 text-[#5a03cf]" />
          </div>
          <div>
            <h1 className="text-gray-900 italic text-4xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
              Modifier le match
            </h1>
            <p className="text-gray-600 text-lg">Modifiez les informations de votre match</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-2" style={{ fontWeight: '600' }}>
              Établissement
            </label>
            <select 
              value={formData.restaurantId}
              onChange={(e) => setFormData({ ...formData, restaurantId: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent"
            >
              {restaurants.map((resto) => (
                <option key={resto.id} value={resto.id}>
                  {resto.nom} (Capacité: {resto.capaciteMax} places)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2" style={{ fontWeight: '600' }}>
                Équipe 1
              </label>
              <select 
                value={formData.equipe1}
                onChange={(e) => setFormData({ ...formData, equipe1: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent"
              >
                {equipes.map((equipe) => (
                  <option key={equipe} value={equipe}>
                    {equipe}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2" style={{ fontWeight: '600' }}>
                Équipe 2
              </label>
              <select 
                value={formData.equipe2}
                onChange={(e) => setFormData({ ...formData, equipe2: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent"
              >
                {equipes.map((equipe) => (
                  <option key={equipe} value={equipe}>
                    {equipe}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2" style={{ fontWeight: '600' }}>
                Date du match
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2" style={{ fontWeight: '600' }}>
                Heure du match
              </label>
              <input
                type="time"
                value={formData.heure}
                onChange={(e) => setFormData({ ...formData, heure: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2" style={{ fontWeight: '600' }}>
              Nombre de places disponibles : {placesDisponibles}
            </label>
            <div className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">
                Places déjà réservées : <span className="text-[#5a03cf]" style={{ fontWeight: '600' }}>{placesReservees}</span>
              </p>
              <p className="text-sm text-gray-600">
                Maximum du restaurant : <span className="text-[#5a03cf]" style={{ fontWeight: '600' }}>{maxPlaces} places</span>
              </p>
            </div>
            <div className="px-2">
              <input
                type="range"
                min={placesReservees}
                max={maxPlaces}
                value={placesDisponibles}
                onChange={(e) => setPlacesDisponibles(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #9cff02 0%, #9cff02 ${(placesDisponibles / maxPlaces) * 100}%, #e5e7eb ${(placesDisponibles / maxPlaces) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Min: {placesReservees}</span>
                <span className="text-[#5a03cf]" style={{ fontWeight: '600' }}>
                  Max: {maxPlaces} places
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white py-4 rounded-xl hover:shadow-lg transition-all italic text-lg"
              style={{ fontWeight: '600' }}
            >
              Enregistrer les modifications
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
