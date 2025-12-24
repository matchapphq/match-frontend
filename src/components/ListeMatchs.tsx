import { ArrowLeft, List, Calendar, Eye } from 'lucide-react';
import { useState } from 'react';

interface ListeMatchsProps {
  onBack: () => void;
}

// Données mockées combinant passé et futur
const tousLesMatchs = [
  { id: 1, equipe1: 'Monaco', equipe2: 'Nice', date: '10/12/2024', heure: '20:00', statut: 'à venir', places: 30 },
  { id: 2, equipe1: 'Bayern', equipe2: 'Dortmund', date: '12/12/2024', heure: '18:45', statut: 'à venir', places: 25 },
  { id: 3, equipe1: 'PSG', equipe2: 'Lyon', date: '28/11/2024', heure: '21:00', statut: 'terminé', spectateurs: 44 },
  { id: 4, equipe1: 'Liverpool', equipe2: 'Manchester', date: '25/11/2024', heure: '20:00', statut: 'terminé', spectateurs: 38 },
  { id: 5, equipe1: 'Real Madrid', equipe2: 'Barcelona', date: '22/11/2024', heure: '21:00', statut: 'terminé', spectateurs: 58 },
  { id: 6, equipe1: 'PSG', equipe2: 'OM', date: '15/12/2024', heure: '21:00', statut: 'à venir', places: 40 },
];

export function ListeMatchs({ onBack }: ListeMatchsProps) {
  const [filtre, setFiltre] = useState<'tous' | 'à venir' | 'terminé'>('tous');

  const matchsFiltres = filtre === 'tous' 
    ? tousLesMatchs 
    : tousLesMatchs.filter(m => m.statut === filtre);

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
            <List className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-gray-900">Liste de mes matchs</h1>
            <p className="text-gray-600">Tous vos matchs programmés et passés</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFiltre('tous')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filtre === 'tous'
              ? 'bg-[#5a03cf] text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Tous
        </button>
        <button
          onClick={() => setFiltre('à venir')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            filtre === 'à venir'
              ? 'bg-[#5a03cf] text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          À venir
        </button>
        <button
          onClick={() => setFiltre('terminé')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            filtre === 'terminé'
              ? 'bg-[#5a03cf] text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Eye className="w-4 h-4" />
          Terminés
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Match</th>
                <th className="px-6 py-3 text-left text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-gray-700">Heure</th>
                <th className="px-6 py-3 text-left text-gray-700">Statut</th>
                <th className="px-6 py-3 text-left text-gray-700">Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {matchsFiltres.map((match) => (
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
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                        match.statut === 'à venir'
                          ? 'bg-[#9cff02] text-[#5a03cf]'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {match.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {match.statut === 'à venir'
                      ? `${match.places} places`
                      : `${match.spectateurs} spectateurs`}
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