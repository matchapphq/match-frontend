import { ArrowLeft, Star } from 'lucide-react';
import { useVenueReviews } from '../hooks/api';

interface MesAvisProps {
  onBack: () => void;
}

export function MesAvis({ onBack }: MesAvisProps) {
  const { data: reviewsData, isLoading } = useVenueReviews('all'); // Get reviews for all venues
  
  // Transform API data to component format
  const avisData = (reviewsData?.reviews || []).map((r: any) => ({
    id: r.id,
    client: r.user?.first_name ? `${r.user.first_name} ${r.user.last_name || ''}`.trim() : 'Client',
    note: r.rating || 0,
    commentaire: r.comment || '',
    date: r.created_at ? new Date(r.created_at).toLocaleDateString('fr-FR') : 'N/A',
  }));

  const noteMoyenne = avisData.length > 0 
    ? (avisData.reduce((sum: number, avis: any) => sum + avis.note, 0) / avisData.length).toFixed(1)
    : '0.0';

  if (isLoading) {
    return (
      <div className="p-8 max-w-6xl mx-auto flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5a03cf]"></div>
      </div>
    );
  }

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