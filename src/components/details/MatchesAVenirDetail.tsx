import { ArrowLeft, Calendar } from 'lucide-react';

interface MatchesAVenirDetailProps {
  onBack: () => void;
}

// Données mockées pour les matchs à venir
const matchsAVenir = [
  { id: 1, equipe1: 'Monaco', equipe2: 'Nice', date: '10/12/2024', heure: '20:00', placesDisponibles: 30 },
  { id: 2, equipe1: 'Bayern', equipe2: 'Dortmund', date: '12/12/2024', heure: '18:45', placesDisponibles: 25 },
  { id: 3, equipe1: 'PSG', equipe2: 'OM', date: '15/12/2024', heure: '21:00', placesDisponibles: 40 },
  { id: 4, equipe1: 'Real Madrid', equipe2: 'Atletico', date: '18/12/2024', heure: '19:30', placesDisponibles: 35 },
  { id: 5, equipe1: 'Inter', equipe2: 'Milan', date: '20/12/2024', heure: '20:45', placesDisponibles: 28 },
];

export function MatchesAVenirDetail({ onBack }: MatchesAVenirDetailProps) {
  const totalPlaces = matchsAVenir.reduce((sum, match) => sum + match.placesDisponibles, 0);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour au tableau de bord
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-[#5a03cf] p-3 rounded-lg">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-gray-900">Matchs à venir</h1>
            <p className="text-gray-600">Déjà programmés</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 mb-2">Total matchs programmés</p>
          <p className="text-gray-900">{matchsAVenir.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 mb-2">Total places disponibles</p>
          <p className="text-gray-900">{totalPlaces}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-gray-900">Liste des matchs programmés</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Match</th>
                <th className="px-6 py-3 text-left text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-gray-700">Heure</th>
                <th className="px-6 py-3 text-left text-gray-700">Places disponibles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {matchsAVenir.map((match) => (
                <tr 
                  key={match.id} 
                  onClick={() => alert(`Détails du match : ${match.equipe1} vs ${match.equipe2}`)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-gray-900">
                    {match.equipe1} vs {match.equipe2}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{match.date}</td>
                  <td className="px-6 py-4 text-gray-600">{match.heure}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#9cff02] text-[#5a03cf]">
                      {match.placesDisponibles}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
