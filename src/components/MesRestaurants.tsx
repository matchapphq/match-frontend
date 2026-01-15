import { Plus, MapPin, Star, Users, Edit, Building2, TrendingUp, Eye, MoreVertical, ChevronRight } from 'lucide-react';
import { PageType } from '../App';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

interface MesRestaurantsProps {
  onNavigate?: (page: PageType, matchId?: number, restaurantId?: number) => void;
}

export function MesRestaurants({ onNavigate }: MesRestaurantsProps) {
  const { getUserRestaurants } = useAppContext();
  const { currentUser } = useAuth();

  const restaurants = currentUser ? getUserRestaurants(currentUser.id) : [];

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

  const totalRestaurants = restaurants.length;
  const noteMoyenne = restaurants.length > 0
    ? (restaurants.reduce((acc, r) => acc + r.note, 0) / restaurants.length).toFixed(1)
    : '0.0';
  const totalCapacite = restaurants.reduce((acc, r) => acc + r.capaciteMax, 0);
  const totalMatchs = restaurants.reduce((acc, r) => acc + (r.matchsOrganises || 0), 0);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto pb-24 lg:pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl text-gray-900 dark:text-white mb-1">Mes établissements</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Gérez vos lieux et maximisez vos réservations</p>
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
            <div className="text-sm text-gray-600 dark:text-gray-400">Établissement{totalRestaurants > 1 ? 's' : ''}</div>
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
                  <img
                    src={restaurant.image}
                    alt={restaurant.nom}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Edit Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditRestaurant(e, restaurant.id);
                    }}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-800 hover:scale-110"
                  >
                    <Edit className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </button>

                  {/* Status Badge */}
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full backdrop-blur-sm">
                      Actif
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div 
                  onClick={() => handleRestaurantClick(restaurant.id)}
                  className="p-6 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg text-gray-900 dark:text-white group-hover:text-[#5a03cf] transition-colors">
                      {restaurant.nom}
                    </h3>
                    <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-[#5a03cf] group-hover:translate-x-1 transition-all" />
                  </div>

                  <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="line-clamp-2">{restaurant.adresse}</p>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                        <span className="text-sm text-gray-900 dark:text-white">{restaurant.note}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Note</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm text-gray-900 dark:text-white">{restaurant.capaciteMax}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Capacité</p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">{restaurant.matchsOrganises || 0} matchs</span>
                      <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        +12%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Card */}
            <button 
              onClick={handleAddRestaurant}
              className="group bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl hover:border-[#5a03cf] hover:shadow-xl hover:shadow-[#5a03cf]/10 transition-all duration-300 min-h-[400px] flex flex-col items-center justify-center p-8"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-900 dark:text-white mb-1">Ajouter un établissement</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Créez un nouveau lieu pour organiser vos matchs
              </p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}