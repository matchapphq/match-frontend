import { ArrowLeft, Star } from 'lucide-react';

interface MesAvisProps {
  onBack: () => void;
}

// Données mockées pour les avis
const avisData = [
  { id: 1, client: 'Jean Dupont', note: 5, commentaire: 'Excellente ambiance pour regarder les matchs !', date: '05/12/2024' },
  { id: 2, client: 'Sophie Martin', note: 4, commentaire: 'Très bon service, écrans de qualité.', date: '03/12/2024' },
  { id: 3, client: 'Luc Bernard', note: 5, commentaire: 'Super expérience, je reviendrai !', date: '01/12/2024' },
  { id: 4, client: 'Marie Petit', note: 4, commentaire: 'Bon restaurant, parfait pour les matchs.', date: '28/11/2024' },
  { id: 5, client: 'Pierre Dubois', note: 5, commentaire: 'Ambiance de folie pendant le match !', date: '25/11/2024' },
];

export function MesAvis({ onBack }: MesAvisProps) {
  const noteMoyenne = (avisData.reduce((sum, avis) => sum + avis.note, 0) / avisData.length).toFixed(1);

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
            <Star className="w-8 h-8 text-[#5a03cf]" />
          </div>
          <div>
            <h1 className="text-gray-900">Mes avis</h1>
            <p className="text-gray-600">Tous les avis clients</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 mb-2">Note moyenne</p>
          <div className="flex items-center gap-2">
            <p className="text-gray-900">{noteMoyenne}</p>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(parseFloat(noteMoyenne))
                      ? 'fill-[#9cff02] text-[#9cff02]'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 mb-2">Total avis</p>
          <p className="text-gray-900">{avisData.length}</p>
        </div>
      </div>

      <div className="space-y-4">
        {avisData.map((avis) => (
          <button key={avis.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-gray-900 mb-1">{avis.client}</p>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= avis.note ? 'fill-[#9cff02] text-[#9cff02]' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-500 text-sm">{avis.date}</p>
            </div>
            <p className="text-gray-700">{avis.commentaire}</p>
          </button>
        ))}
      </div>
    </div>
  );
}