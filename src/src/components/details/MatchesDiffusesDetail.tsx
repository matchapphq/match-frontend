import { ArrowLeft, Tv } from 'lucide-react';

interface MatchesDiffusesDetailProps {
  onBack: () => void;
}

// Données mockées pour les matchs diffusés
const matchsData = [
  { id: 1, equipe1: 'PSG', equipe2: 'OM', date: '15/11/2024', spectateurs: 42 },
  { id: 2, equipe1: 'France', equipe2: 'Allemagne', date: '18/11/2024', spectateurs: 65 },
  { id: 3, equipe1: 'Real Madrid', equipe2: 'Barcelona', date: '22/11/2024', spectateurs: 58 },
  { id: 4, equipe1: 'Liverpool', equipe2: 'Manchester', date: '25/11/2024', spectateurs: 38 },
  { id: 5, equipe1: 'PSG', equipe2: 'Lyon', date: '28/11/2024', spectateurs: 44 },
];

export function MatchesDiffusesDetail({ onBack }: MatchesDiffusesDetailProps) {
  const totalSpectateurs = matchsData.reduce((sum, match) => sum + match.spectateurs, 0);
  const moyenne = (totalSpectateurs / matchsData.length).toFixed(1);

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
          <div className="bg-[#9cff02] p-3 rounded-lg">
            <Tv className="w-8 h-8 text-[#5a03cf]" />
          </div>
          <div>
            <h1 className="text-gray-900">Matchs diffusés</h1>
            <p className="text-gray-600">30 derniers jours</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 mb-2">Total matchs</p>
          <p className="text-gray-900">{matchsData.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 mb-2">Total spectateurs</p>
          <p className="text-gray-900">{totalSpectateurs}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 mb-2">Moyenne par match</p>
          <p className="text-gray-900">{moyenne} personnes</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-gray-900">Liste des matchs diffusés</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Match</th>
                <th className="px-6 py-3 text-left text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-gray-700">Spectateurs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {matchsData.map((match) => (
                <tr 
                  key={match.id} 
                  onClick={() => alert(`Détails du match : ${match.equipe1} vs ${match.equipe2}`)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-gray-900">
                    {match.equipe1} vs {match.equipe2}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{match.date}</td>
                  <td className="px-6 py-4 text-gray-600">{match.spectateurs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
