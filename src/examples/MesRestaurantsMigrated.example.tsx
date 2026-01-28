/**
 * EXEMPLE DE PAGE MIGRÉE
 * 
 * MesRestaurants.tsx avec API réelle au lieu de mock data
 * 
 * Changements principaux :
 * 1. Import des hooks au lieu de mockData
 * 2. Gestion des états loading/error
 * 3. Utilisation des vrais appels API
 * 4. Mapping des données backend → UI
 */

import { Plus, MapPin, Star, Users, Edit, Building2, TrendingUp, Eye, MoreVertical, ChevronRight } from 'lucide-react';
import { PageType } from '../App';
import { useMyVenues } from '../hooks'; // ✅ Hook API au lieu de Context
import { useState, useMemo } from 'react';

interface MesRestaurantsProps {
  onNavigate?: (page: PageType, matchId?: number, restaurantId?: number) => void;
}

export function MesRestaurants({ onNavigate }: MesRestaurantsProps) {
  // ✅ AVANT : const { getUserRestaurants } = useAppContext();
  // ✅ APRÈS : Hook API avec gestion auto du loading/error
  const { data: venues, loading, error, refetch } = useMyVenues();
  
  // États locaux
  const [retrying, setRetrying] = useState(false);

  // ✅ Mapper les données backend (snake_case) vers format UI (camelCase)
  const restaurants = useMemo(() => {
    if (!venues) return [];
    
    return venues.map(venue => ({
      id: Number(venue.id),
      nom: venue.name,
      adresse: `${venue.address}, ${venue.city} ${venue.postal_code}`,
      telephone: venue.phone,
      email: venue.email || '',
      capaciteMax: venue.capacity || 50,
      note: 4.5, // TODO: Calculer depuis les reviews
      totalAvis: 0, // TODO: Compter les reviews
      image: '', // TODO: Récupérer depuis venue.photos[0]
      horaires: 'Lun-Dim: 11h00 - 02h00', // TODO: Formater depuis venue.opening_hours
      tarif: '30€/mois',
      userId: 'current-user',
      bookingMode: venue.booking_mode,
      matchsOrganises: 0, // TODO: Compter depuis venue_matches
    }));
  }, [venues]);

  // ✅ Calculer les stats depuis les vraies données
  const totalRestaurants = restaurants.length;
  const noteMoyenne = restaurants.length > 0
    ? (restaurants.reduce((acc, r) => acc + r.note, 0) / restaurants.length).toFixed(1)
    : '0.0';
  const totalCapacite = restaurants.reduce((acc, r) => acc + r.capaciteMax, 0);
  const totalMatchs = restaurants.reduce((acc, r) => acc + (r.matchsOrganises || 0), 0);

  // Handlers
  const handleAddRestaurant = () => {
    if (onNavigate) {
      onNavigate('ajouter-restaurant');
    }
  };

  const handleRestaurantClick = (id: number) => {
    if (onNavigate) {
      onNavigate('restaurant-detail', undefined, id);
    }
  };

  const handleEditRestaurant = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (onNavigate) {
      onNavigate('modifier-restaurant', undefined, id);
    }
  };

  const handleViewStats = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (onNavigate) {
      onNavigate('restaurant-detail', undefined, id);
    }
  };

  const handleRetry = async () => {
    setRetrying(true);
    try {
      await refetch();
    } finally {
      setRetrying(false);
    }
  };

  // ✅ Gestion de l'état de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto pb-24 lg:pb-8">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-2" />
              <div className="h-4 w-96 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
            <div className="h-12 w-40 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
          </div>

          {/* Stats Skeleton */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="h-12 w-12 bg-gray-200 dark:bg-gray-800 rounded-xl mb-4 animate-pulse" />
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-800 rounded mb-2 animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Grid Skeleton */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="h-48 bg-gray-200 dark:bg-gray-800 animate-pulse" />
                <div className="p-6">
                  <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded mb-3 animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded mb-2 animate-pulse" />
                  <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ✅ Gestion de l'état d'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-10 h-10 text-red-600 dark:text-red-500" />
          </div>
          <h2 className="text-2xl text-gray-900 dark:text-white mb-2">
            Erreur de chargement
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error.message || 'Impossible de charger vos établissements'}
          </p>
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="px-6 py-3 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] text-white rounded-xl hover:shadow-xl hover:shadow-[#5a03cf]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {retrying ? 'Chargement...' : 'Réessayer'}
          </button>
        </div>
      </div>
    );
  }

  // ✅ Rendu normal avec les vraies données
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto pb-24 lg:pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl text-gray-900 dark:text-white mb-1">
              Mes établissements
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Gérez vos lieux et maximisez vos réservations
            </p>
          </div>
          <button
            onClick={handleAddRestaurant}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] text-white rounded-xl hover:shadow-xl hover:shadow-[#5a03cf]/30 transition-all flex items-center justify-center gap-2 group text-sm sm:text-base whitespace-nowrap"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="hidden sm:inline">Ajouter un lieu</span>
            <span className="sm:hidden">Ajouter</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-[#5a03cf]/10 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[#5a03cf]" />
              </div>
            </div>
            <div className="text-3xl text-gray-900 dark:text-white mb-1">{totalRestaurants}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Établissement{totalRestaurants > 1 ? 's' : ''}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-orange-500" />
              </div>
            </div>
            <div className="text-3xl text-gray-900 dark:text-white mb-1">{noteMoyenne}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Note moyenne</div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl text-gray-900 dark:text-white mb-1">{totalCapacite}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Capacité totale</div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl text-gray-900 dark:text-white mb-1">{totalMatchs}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Matchs organisés</div>
          </div>
        </div>

        {/* Restaurants Grid */}
        {restaurants.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-16">
            <div className="text-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Building2 className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl text-gray-900 dark:text-white mb-2">Aucun établissement</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Commencez par ajouter votre premier établissement pour profiter de toutes les fonctionnalités Match.
              </p>
              <button
                onClick={handleAddRestaurant}
                className="px-8 py-3 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] text-white rounded-xl hover:shadow-xl hover:shadow-[#5a03cf]/30 transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Ajouter mon premier lieu
              </button>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-[#5a03cf]/30 hover:shadow-xl hover:shadow-[#5a03cf]/5 transition-all duration-300 relative"
              >
                {/* Image */}
                <div 
                  onClick={() => handleRestaurantClick(restaurant.id)}
                  className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer"
                >
                  {restaurant.image ? (
                    <>
                      <img
                        src={restaurant.image}
                        alt={restaurant.nom}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                    </div>
                  )}
                  
                  {/* Edit Button */}
                  <button
                    onClick={(e) => handleEditRestaurant(e, restaurant.id)}
                    className="absolute top-3 right-3 w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-700"
                  >
                    <Edit className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg text-gray-900 dark:text-white mb-1 line-clamp-1">
                        {restaurant.nom}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span className="line-clamp-1">{restaurant.adresse}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                      <span className="text-sm text-gray-900 dark:text-white">{restaurant.note}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        ({restaurant.totalAvis})
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {restaurant.capaciteMax}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={(e) => handleViewStats(e, restaurant.id)}
                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl transition-colors flex items-center justify-center gap-2 group/btn"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Voir les statistiques</span>
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
