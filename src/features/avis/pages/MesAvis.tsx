import { useMemo } from 'react';
import { ArrowLeft, Star, Loader2 } from 'lucide-react';
import { useAllVenueReviews, Review } from '../../../hooks/api/useReviews';
import { usePartnerVenues } from '../../../hooks/api/useVenues';

interface MesAvisProps {
  onBack: () => void;
}

export function MesAvis({ onBack }: MesAvisProps) {
  // Fetch partner's venues
  const { data: venues, isLoading: isLoadingVenues } = usePartnerVenues();
  
  // Get venue IDs from fetched venues
  const venueIds = useMemo(() => {
    return venues?.map(v => v.id) || [];
  }, [venues]);
  
  const { data: reviewsData, isLoading: isLoadingReviews } = useAllVenueReviews(venueIds);
  
  const isLoading = isLoadingVenues || isLoadingReviews;
  
  // Transform API reviews to display format
  const avisData = useMemo(() => {
    if (!reviewsData?.reviews) return [];
    return reviewsData.reviews.map((review: Review) => ({
      id: review.id,
      client: review.user_name,
      note: review.rating,
      commentaire: review.comment,
      date: new Date(review.created_at).toLocaleDateString('fr-FR'),
    }));
  }, [reviewsData]);
  
  const noteMoyenne = reviewsData?.average_rating?.toFixed(1) || 
    (avisData.length > 0 
      ? (avisData.reduce((sum, avis) => sum + avis.note, 0) / avisData.length).toFixed(1) 
      : '0.0');

  if (isLoading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#5a03cf]" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
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
            <h1 className="text-gray-900 dark:text-white">Mes avis</h1>
            <p className="text-gray-600 dark:text-gray-400">Tous les avis clients</p>
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
