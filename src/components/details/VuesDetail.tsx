import { ArrowLeft, Eye } from 'lucide-react';

interface VuesDetailProps {
  onBack: () => void;
}

// Données mockées pour les vues par jour
const vuesData = [
  { id: 1, date: '01/12/2024', vues: 145 },
  { id: 2, date: '02/12/2024', vues: 189 },
  { id: 3, date: '03/12/2024', vues: 156 },
  { id: 4, date: '04/12/2024', vues: 203 },
  { id: 5, date: '05/12/2024', vues: 178 },
  { id: 6, date: '06/12/2024', vues: 198 },
  { id: 7, date: '07/12/2024', vues: 384 },
];

export function VuesDetail({ onBack }: VuesDetailProps) {
  const totalVues = vuesData.reduce((sum, jour) => sum + jour.vues, 0);
  const moyenne = (totalVues / vuesData.length).toFixed(0);
  const maxVues = Math.max(...vuesData.map(d => d.vues));

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
            <Eye className="w-8 h-8 text-[#5a03cf]" />
          </div>
          <div>
            <h1 className="text-gray-900">Statistiques de vues</h1>
            <p className="text-gray-600">Ce mois-ci</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 mb-2">Total vues</p>
          <p className="text-gray-900">{totalVues.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 mb-2">Moyenne par jour</p>
          <p className="text-gray-900">{moyenne}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 mb-2">Pic de vues</p>
          <p className="text-gray-900">{maxVues}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-gray-900">Vues par jour</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-gray-700">Nombre de vues</th>
                <th className="px-6 py-3 text-left text-gray-700">Visualisation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vuesData.map((jour) => (
                <tr 
                  key={jour.id} 
                  onClick={() => alert(`Détails pour le ${jour.date}`)}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 text-gray-900">{jour.date}</td>
                  <td className="px-6 py-4 text-gray-600">{jour.vues}</td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#5a03cf] h-2 rounded-full"
                        style={{ width: `${(jour.vues / maxVues) * 100}%` }}
                      />
                    </div>
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