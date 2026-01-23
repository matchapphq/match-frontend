import { ArrowLeft, Calendar, ChevronRight, MapPin, Check, Search, Trophy, Clock, Users } from 'lucide-react';
import { useState } from 'react';
import { mockSports, mockAvailableMatches, mockRestaurants } from '../../../data/mockData';

interface ProgrammerMatchProps {
  onBack: () => void;
}

interface Sport {
  id: string;
  name: string;
  emoji: string;
}

interface Match {
  id: string;
  sport: string;
  team1: string;
  team2: string;
  league: string;
  date: string;
  time: string;
  venue?: string;
};

const SPORTS = mockSports;
const MOCK_MATCHES = mockAvailableMatches;

export function ProgrammerMatch({ onBack }: ProgrammerMatchProps) {
  const [step, setStep] = useState<'sport' | 'date' | 'search' | 'configure'>('sport');
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [placesDisponibles, setPlacesDisponibles] = useState(30);
  const maxPlaces = 50;

  const restaurants = mockRestaurants.map(r => ({ id: r.id, nom: r.nom }));

  const handleSportSelect = (sportId: string) => {
    setSelectedSport(sportId);
    setStep('date');
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setStep('search');
  };

  const filteredMatches = MOCK_MATCHES.filter(
    (match) =>
      match.sport === selectedSport &&
      match.date === selectedDate &&
      (searchQuery === '' ||
        match.team1.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.team2.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.league.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleMatchSelect = (match: Match) => {
    setSelectedMatch(match);
    setStep('configure');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Match programmé avec succès !');
    onBack();
  };

  const handleBackToSport = () => {
    setStep('sport');
    setSelectedSport(null);
    setSelectedDate(null);
    setSearchQuery('');
    setSelectedMatch(null);
  };

  const handleBackToDate = () => {
    setStep('date');
    setSelectedDate(null);
    setSearchQuery('');
    setSelectedMatch(null);
  };

  const handleBackToSearch = () => {
    setStep('search');
    setSelectedMatch(null);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={step === 'sport' ? onBack : step === 'date' ? handleBackToSport : step === 'search' ? handleBackToDate : handleBackToSearch}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#5a03cf] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              {step === 'sport' ? 'Retour' : step === 'date' ? 'Changer de sport' : step === 'search' ? 'Changer de date' : 'Retour à la recherche'}
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#9cff02] rounded-full animate-pulse" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {step === 'sport' ? 'Sélection du sport' : step === 'date' ? 'Sélection de la date' : step === 'search' ? 'Recherche de match' : 'Configuration'}
              </span>
            </div>
            
            <div className="w-32"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Étape 1 : Sélection du sport */}
        {step === 'sport' && (
          <div>
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-4">
                Programmer un{' '}
                <span className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
                  match
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Commencez par sélectionner le sport
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {SPORTS.map((sport) => (
                <button
                  key={sport.id}
                  onClick={() => handleSportSelect(sport.id)}
                  className="group relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 hover:border-[#5a03cf]/50 transition-all duration-300 hover:scale-105"
                >
                  <div className="text-center">
                    <div className="text-5xl mb-4">{sport.emoji}</div>
                    <h3 className="text-lg text-gray-900 dark:text-white">
                      {sport.name}
                    </h3>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#5a03cf]/0 to-[#9cff02]/0 group-hover:from-[#5a03cf]/5 group-hover:to-[#9cff02]/5 rounded-2xl transition-all duration-300" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Étape 2 : Sélection de la date */}
        {step === 'date' && (
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-full mb-6">
                <span className="text-3xl">
                  {SPORTS.find((s) => s.id === selectedSport)?.emoji}
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {SPORTS.find((s) => s.id === selectedSport)?.name}
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl mb-4">
                Sélectionner une{' '}
                <span className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
                  date
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Choisissez la date du match que vous souhaitez diffuser
              </p>

              {/* Calendrier */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={selectedDate || ''}
                    onChange={(e) => handleDateSelect(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl focus:outline-none focus:border-[#5a03cf]/50 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Étape 3 : Recherche de match */}
        {step === 'search' && (
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-full mb-6">
                <span className="text-3xl">
                  {SPORTS.find((s) => s.id === selectedSport)?.emoji}
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {SPORTS.find((s) => s.id === selectedSport)?.name}
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl mb-4">
                Rechercher un{' '}
                <span className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
                  match
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Trouvez le match que vous souhaitez diffuser
              </p>

              {/* Barre de recherche */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par équipe ou compétition..."
                    className="w-full pl-12 pr-4 py-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl focus:outline-none focus:border-[#5a03cf]/50 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Résultats de recherche */}
            <div className="max-w-4xl mx-auto space-y-4">
              {filteredMatches.length === 0 ? (
                <div className="text-center py-12 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
                  <p className="text-gray-500 dark:text-gray-400">
                    Aucun match trouvé. Essayez une autre recherche.
                  </p>
                </div>
              ) : (
                filteredMatches.map((match) => (
                  <button
                    key={match.id}
                    onClick={() => handleMatchSelect(match)}
                    className="w-full text-left bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:border-[#5a03cf]/50 transition-all duration-300 hover:scale-[1.01]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* Équipes */}
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xl text-gray-900 dark:text-white">
                            {match.team1}
                          </span>
                          <span className="text-gray-400">vs</span>
                          <span className="text-xl text-gray-900 dark:text-white">
                            {match.team2}
                          </span>
                        </div>
                        
                        {/* Info complémentaires */}
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                            <Trophy className="w-4 h-4" />
                            <span>{match.league}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(match.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{match.time}</span>
                          </div>
                          {match.venue && (
                            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                              <MapPin className="w-4 h-4" />
                              <span>{match.venue}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <ArrowLeft className="w-5 h-5 text-[#5a03cf] rotate-180" />
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Étape 4 : Configuration finale */}
        {step === 'configure' && selectedMatch && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl mb-4">
                Configuration du{' '}
                <span className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
                  match
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Finalisez les détails de diffusion
              </p>
            </div>

            {/* Récapitulatif du match sélectionné */}
            <div className="max-w-3xl mx-auto mb-8">
              <div className="bg-gradient-to-br from-[#5a03cf]/5 to-[#9cff02]/5 dark:from-[#5a03cf]/10 dark:to-[#9cff02]/10 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Match sélectionné</span>
                  <span className="text-3xl">{SPORTS.find((s) => s.id === selectedMatch.sport)?.emoji}</span>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl text-gray-900 dark:text-white">
                    {selectedMatch.team1}
                  </span>
                  <span className="text-gray-400">vs</span>
                  <span className="text-2xl text-gray-900 dark:text-white">
                    {selectedMatch.team2}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Trophy className="w-4 h-4 text-[#5a03cf]" />
                    <span>{selectedMatch.league}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Calendar className="w-4 h-4 text-[#5a03cf]" />
                    <span>{new Date(selectedMatch.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Clock className="w-4 h-4 text-[#5a03cf]" />
                    <span>{selectedMatch.time}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaire de configuration */}
            <div className="max-w-3xl mx-auto">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Établissement */}
                <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                  <label className="block text-gray-900 dark:text-white mb-3">
                    Établissement
                  </label>
                  <select className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:border-[#5a03cf]/50 text-gray-900 dark:text-white">
                    <option key="select-resto" value="">Sélectionnez un établissement</option>
                    {restaurants.map((resto) => (
                      <option key={resto.id} value={resto.id}>
                        {resto.nom}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Places disponibles */}
                <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-gray-900 dark:text-white">
                      Places disponibles
                    </label>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#5a03cf]" />
                      <span className="text-2xl bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
                        {placesDisponibles}
                      </span>
                    </div>
                  </div>
                  
                  <input
                    type="range"
                    min="0"
                    max={maxPlaces}
                    value={placesDisponibles}
                    onChange={(e) => setPlacesDisponibles(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #9cff02 0%, #9cff02 ${(placesDisponibles / maxPlaces) * 100}%, #e5e7eb ${(placesDisponibles / maxPlaces) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <span>0</span>
                    <span>Max: {maxPlaces} places</span>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white py-4 rounded-full hover:brightness-110 hover:shadow-xl hover:shadow-[#5a03cf]/30 transition-all duration-200"
                  >
                    Programmer le match
                  </button>
                  <button
                    type="button"
                    onClick={handleBackToSearch}
                    className="px-8 py-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 rounded-full hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
