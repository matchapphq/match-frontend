import {
  ArrowLeft,
  Star,
  Edit2,
  Calendar,
  BarChart3,
  Eye,
  Loader2,
  CheckCircle2,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/client';
import { Dialog, DialogContent } from '../../../components/ui/dialog';

interface RestaurantDetailProps {
  restaurantId: string | null;
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

interface VenueDetailView {
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  capaciteMax: number;
  note: number;
  totalAvis: number;
  image: string;
  images: string[];
  statut: 'actif' | 'inactif' | 'en_attente';
  matchsDiffuses: number;
  clientsAccueillis: number;
}

const FALLBACK_VENUE_IMAGE = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop';

function extractPhotoUrl(photo: unknown): string | null {
  if (!photo) return null;
  if (typeof photo === 'string') return photo.trim() || null;
  if (typeof photo !== 'object') return null;

  const value = photo as Record<string, unknown>;
  const url = typeof value.url === 'string' ? value.url : null;
  const photoUrl = typeof value.photo_url === 'string' ? value.photo_url : null;
  const selected = url ?? photoUrl;
  return selected?.trim() || null;
}

function mapVenueStatusToUi(status: unknown, isActive: unknown): 'actif' | 'inactif' | 'en_attente' {
  const normalizedStatus = typeof status === 'string' ? status.toLowerCase() : null;
  const active = isActive === true;

  switch (normalizedStatus) {
    case 'approved':
    case 'active':
    case 'verified':
      return active ? 'actif' : 'inactif';
    case 'pending':
      return 'en_attente';
    case 'rejected':
    case 'suspended':
    case 'inactive':
      return 'inactif';
    default:
      return active ? 'actif' : 'en_attente';
  }
}

export function RestaurantDetail({ restaurantId, onBack, onNavigate }: RestaurantDetailProps) {
  const { data: venue, isLoading, error } = useQuery<VenueDetailView | null>({
    queryKey: ['venue-detail', restaurantId],
    queryFn: async () => {
      if (!restaurantId) return null;

      const venueRes = await apiClient.get(`/venues/${restaurantId}`);
      const v = venueRes.data?.venue ?? venueRes.data;
      if (!v) return null;

      let stats: any = null;
      try {
        const analyticsRes = await apiClient.get(`/venues/${restaurantId}/analytics/overview`);
        stats = analyticsRes.data?.overview ?? analyticsRes.data?.analytics ?? null;
      } catch (analyticsError) {
        console.warn('Failed to fetch venue analytics overview:', analyticsError);
      }

      const candidatePhotos = [
        ...(Array.isArray(v.photos) ? v.photos : []),
        ...(Array.isArray(venueRes.data?.photos) ? venueRes.data.photos : []),
      ];
      const primaryPhoto = candidatePhotos.find((p: any) => p?.is_primary) ?? candidatePhotos[0] ?? null;
      const primaryPhotoUrl = extractPhotoUrl(primaryPhoto);
      const allPhotoUrls = candidatePhotos
        .map((photo) => extractPhotoUrl(photo))
        .filter((url): url is string => Boolean(url));
      const uniquePhotoUrls = Array.from(new Set(allPhotoUrls));
      const orderedPhotoUrls = primaryPhotoUrl
        ? [primaryPhotoUrl, ...uniquePhotoUrls.filter((url) => url !== primaryPhotoUrl)]
        : uniquePhotoUrls;
      const fallbackImage = (typeof v.cover_image_url === 'string' && v.cover_image_url)
        || (typeof v.logo_url === 'string' && v.logo_url)
        || FALLBACK_VENUE_IMAGE;
      const images = orderedPhotoUrls.length > 0 ? orderedPhotoUrls : [fallbackImage];
      const ratingAverage = Number(v.average_rating ?? venueRes.data?.rating?.average ?? 0);
      const ratingCount = Number(v.total_reviews ?? venueRes.data?.rating?.count ?? 0);
      const address = [v.street_address, v.city].filter(Boolean).join(', ');

      return {
        nom: v.name || 'Établissement',
        adresse: address || 'Adresse non renseignée',
        telephone: v.phone || 'Non renseigné',
        email: v.email || 'Non renseigné',
        capaciteMax: Number(v.capacity) || 0,
        note: Number.isFinite(ratingAverage) ? ratingAverage : 0,
        totalAvis: Number.isFinite(ratingCount) ? ratingCount : 0,
        image: images[0] || FALLBACK_VENUE_IMAGE,
        images,
        statut: mapVenueStatusToUi(v.status, v.is_active),
        matchsDiffuses: Number(stats?.top_matches?.length ?? 0) || 0,
        clientsAccueillis: Number(stats?.total_reservations ?? v.total_reservations ?? 0) || 0,
      };
    },
    enabled: !!restaurantId,
  });
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#5a03cf]" />
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
        <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#5a03cf] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
            <p className="text-red-500 mb-3">Erreur lors du chargement du lieu</p>
            <button onClick={onBack} className="text-[#5a03cf] hover:underline">
              Retour à mes établissements
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isActive = venue.statut === 'actif';
  const isInactive = venue.statut === 'inactif';
  const statusLabel = isActive ? 'Actif' : isInactive ? 'Inactif' : 'En attente de validation';
  const statusClass = isActive
    ? 'bg-green-100 text-green-800 border border-green-300 shadow-sm'
    : isInactive
      ? 'bg-gray-100 text-gray-700 border border-gray-200'
      : 'bg-orange-50 text-orange-700 border border-orange-200';
  const clientsAccueillis = Number.isFinite(Number(venue.clientsAccueillis))
    ? Number(venue.clientsAccueillis)
    : 0;
  const noteMoyenne = Number.isFinite(Number(venue.note))
    ? Number(venue.note).toFixed(1)
    : '0.0';
  const galleryPhotos = venue.images.length > 0 ? venue.images : [venue.image];
  const visibleGalleryPhotos = galleryPhotos.slice(0, 5);
  const extraPhotosCount = Math.max(0, galleryPhotos.length - visibleGalleryPhotos.length);

  const openPhotoModal = (index: number) => {
    setActivePhotoIndex(index);
    setIsPhotoModalOpen(true);
  };

  const showPreviousPhoto = () => {
    setActivePhotoIndex((previous) => (previous - 1 + galleryPhotos.length) % galleryPhotos.length);
  };

  const showNextPhoto = () => {
    setActivePhotoIndex((previous) => (previous + 1) % galleryPhotos.length);
  };
  const activePhotoUrl = galleryPhotos[activePhotoIndex] || galleryPhotos[0];

  const getGalleryTileClass = (index: number, count: number) => {
    switch (count) {
      case 1:
        return 'col-span-1 row-span-1';
      case 2:
        return 'col-span-2 row-span-2';
      case 3:
        return index === 0 ? 'col-span-2 row-span-2' : 'col-span-2 row-span-1';
      case 4:
        if (index === 0) return 'col-span-2 row-span-2';
        if (index === 3) return 'col-span-2 row-span-1';
        return 'col-span-1 row-span-1';
      default:
        return index === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1';
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#5a03cf] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>

            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${statusClass}`}>
              <CheckCircle2 className="w-4 h-4" />
              {statusLabel}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="rounded-3xl border border-gray-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm p-5 sm:p-6 mb-8">
          <div className="relative mb-6">
            <div
              className={`grid gap-2 rounded-2xl overflow-hidden border border-gray-200/70 dark:border-gray-700/70 bg-gray-100 dark:bg-gray-800 ${
                visibleGalleryPhotos.length === 1 ? 'grid-cols-1 grid-rows-1' : 'grid-cols-4 grid-rows-2'
              }`}
              style={{ height: '18rem' }}
            >
              {visibleGalleryPhotos.map((photo, index) => {
                const isLastVisible = index === visibleGalleryPhotos.length - 1;
                const hasMorePhotos = isLastVisible && extraPhotosCount > 0;
                return (
                  <button
                    key={`${photo}-${index}`}
                    type="button"
                    onClick={() => openPhotoModal(index)}
                    className={`relative overflow-hidden ${getGalleryTileClass(index, visibleGalleryPhotos.length)}`}
                    aria-label={`Ouvrir la photo ${index + 1}`}
                  >
                    <img src={photo} alt={`${venue.nom} - photo ${index + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/10 hover:bg-black/25 transition-colors" />
                    {hasMorePhotos && (
                      <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                        <span className="text-white text-lg">+{extraPhotosCount}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="absolute top-4 left-4 max-w-[85%] sm:max-w-[70%] bg-black/40 backdrop-blur-sm rounded-xl p-3 sm:p-4 pointer-events-none">
              <p className="text-white text-xs sm:text-sm mb-2">Établissement partenaire</p>
              <h1 className="text-xl sm:text-2xl text-white leading-tight">
                {venue.nom}
              </h1>
              <p className="text-xs sm:text-sm text-white/90 truncate">
                {venue.adresse}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => onNavigate?.('modifier-restaurant')}
              className="px-4 py-3 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Modifier le lieu
            </button>
            <button
              type="button"
              className="px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:border-[#5a03cf]/40 hover:text-[#5a03cf] transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Gérer les matchs
            </button>
            <button
              type="button"
              className="px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:border-[#5a03cf]/40 hover:text-[#5a03cf] transition-all flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Statistiques
            </button>
            <button
              type="button"
              className="px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:border-[#5a03cf]/40 hover:text-[#5a03cf] transition-all flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Aperçu public
            </button>
          </div>
        </div>

        <div className="mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[#5a03cf]" />
              <h2 className="text-lg text-gray-900 dark:text-white">Performance</h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl bg-[#5a03cf]/5 border border-[#5a03cf]/10 p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Matchs diffusés</p>
                <p className="text-2xl text-[#5a03cf]">{venue.matchsDiffuses}</p>
              </div>

              <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Clients accueillis</p>
                <p className="text-2xl text-blue-700 dark:text-blue-300">{clientsAccueillis.toLocaleString('fr-FR')}</p>
              </div>

              <div className="rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/40 p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Note moyenne</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl text-orange-700 dark:text-orange-300">{noteMoyenne}</p>
                  <Star className="w-5 h-5 fill-orange-500 text-orange-500" />
                </div>
              </div>

              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/40 p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Nombre d'avis</p>
                <p className="text-2xl text-emerald-700 dark:text-emerald-300">{venue.totalAvis}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg text-gray-900 dark:text-white">Avis clients</h2>
          </div>

          {venue.totalAvis === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/20 flex items-center justify-center">
                <Star className="w-8 h-8 text-[#5a03cf]/40" />
              </div>
              <p className="text-xl text-gray-900 dark:text-white mb-2">Aucun avis pour le moment</p>
              <p className="text-gray-600 dark:text-gray-400">
                Les avis apparaîtront après vos premières réservations confirmées.
              </p>
            </div>
          ) : (
            <div className="p-6">
              {/* Les avis réels s'afficheront ici */}
            </div>
          )}
        </div>

        <Dialog open={isPhotoModalOpen} onOpenChange={setIsPhotoModalOpen}>
          <DialogContent
            className="max-w-6xl w-[96vw] p-0 bg-black/95 border-gray-800 overflow-hidden"
            closeClassName="!top-3 !right-3 !m-0 !w-10 !h-10 !p-0 !inline-flex !items-center !justify-center !leading-none text-red-500 hover:text-red-400 opacity-100 [&_svg]:!w-5 [&_svg]:!h-5 [&_svg]:!m-0"
          >
            <div className="relative bg-black flex items-center justify-center h-[72vh] sm:h-[74vh] md:h-[76vh]">
              <img
                src={activePhotoUrl}
                alt={`${venue.nom} - aperçu`}
                className="w-auto max-w-full h-auto object-contain bg-black"
                style={{ maxHeight: '70vh' }}
              />

              {galleryPhotos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPreviousPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center"
                    aria-label="Photo précédente"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={showNextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center"
                    aria-label="Photo suivante"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 text-white text-sm">
                {activePhotoIndex + 1} / {galleryPhotos.length}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
