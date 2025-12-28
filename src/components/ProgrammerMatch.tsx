import { ArrowLeft, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

interface ProgrammerMatchProps {
  onBack: () => void;
}

// Existing matches will be fetched from API when available
// For now, this feature is disabled until the API endpoint is ready

export function ProgrammerMatch({ onBack }: ProgrammerMatchProps) {
  const { getUserRestaurants } = useAppContext();
  const { currentUser } = useAuth();
  
  const [placesDisponibles, setPlacesDisponibles] = useState(30);
  const [maxPlaces, setMaxPlaces] = useState(50);
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
    
  // Form fields
  const [equipe1, setEquipe1] = useState('');
  const [equipe2, setEquipe2] = useState('');
  const [date, setDate] = useState('');
  const [heure, setHeure] = useState('');
  const [competition, setCompetition] = useState('Ligue 1');

  // Get user's restaurants only
  const restaurants = currentUser ? getUserRestaurants(currentUser.id).filter(r => !r.isPaid) : [];

  const equipes = [
    'PSG', 'OM', 'Lyon', 'Monaco', 'Nice', 'Lille', 'Lens',
    'Real Madrid', 'Barcelona', 'Bayern', 'Dortmund', 'Liverpool',
    'Manchester City', 'Manchester United', 'Arsenal', 'Chelsea'
  ];

  // Update max places when restaurant changes
  useEffect(() => {
    if (selectedRestaurant) {
      const resto = restaurants.find(r => r.id === selectedRestaurant);
      if (resto) {
        setMaxPlaces(resto.capaciteMax);
        setPlacesDisponibles(Math.min(placesDisponibles, resto.capaciteMax));
      }
    }
  }, [selectedRestaurant]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Match programmé avec succès !');
    onBack();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour au tableau de bord
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] p-3 rounded-xl">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-gray-900 italic text-4xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
              Programmer un match
            </h1>
            <p className="text-gray-600 text-lg">Ajoutez un nouveau match à diffuser</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-2" style={{ fontWeight: '600' }}>
              Établissement
            </label>
            {restaurants.length === 0 ? (
              <p className="text-gray-500 italic">Aucun établissement disponible. Veuillez d'abord ajouter un restaurant.</p>
            ) : (
              <select 
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent"
                value={selectedRestaurant}
                onChange={(e) => setSelectedRestaurant(e.target.value)}
              >
                <option value="">Sélectionnez un établissement</option>
                {restaurants.map((resto) => (
                  <option key={resto.id} value={resto.id}>
                    {resto.nom} ({resto.capaciteMax} places)
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2" style={{ fontWeight: '600' }}>
                Équipe 1
              </label>
              <select 
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent"
                value={equipe1}
                onChange={(e) => setEquipe1(e.target.value)}
                              >
                <option value="">Sélectionnez l&apos;équipe 1</option>
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
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent"
                value={equipe2}
                onChange={(e) => setEquipe2(e.target.value)}
                              >
                <option value="">Sélectionnez l&apos;équipe 2</option>
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
              <label className="block text-gray-700 mb-2">Date du match</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a03cf] disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Heure du match</label>
              <input
                type="time"
                value={heure}
                onChange={(e) => setHeure(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a03cf] disabled:bg-gray-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2" style={{ fontWeight: '600' }}>
              Nombre de places disponibles : {placesDisponibles}
            </label>
            <div className="px-2">
              <input
                type="range"
                min="0"
                max={maxPlaces}
                value={placesDisponibles}
                onChange={(e) => setPlacesDisponibles(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #9cff02 0%, #9cff02 ${(placesDisponibles / maxPlaces) * 100}%, #e5e7eb ${(placesDisponibles / maxPlaces) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>0</span>
                <span className="text-[#5a03cf]" style={{ fontWeight: '600' }}>
                  Max: {maxPlaces} places
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Compétition</label>
            <select 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a03cf] disabled:bg-gray-100"
              value={competition}
              onChange={(e) => setCompetition(e.target.value)}
                          >
              <option>Ligue 1</option>
              <option>Ligue des Champions</option>
              <option>Coupe de France</option>
              <option>Premier League</option>
              <option>La Liga</option>
              <option>NBA</option>
              <option>Six Nations</option>
              <option>Autre</option>
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white py-4 rounded-xl hover:shadow-lg transition-all italic text-lg"
              style={{ fontWeight: '600' }}
            >
              Programmer le match
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