import { Plus, MapPin, Star, Users, Edit, Building2 } from 'lucide-react';
import { PageType } from '../App';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

interface MesRestaurantsProps {
  onNavigate?: (page: PageType, matchId?: number, restaurantId?: number) => void;
}

export function MesRestaurants({ onNavigate }: MesRestaurantsProps) {
  const { getUserRestaurants } = useAppContext();
  const { currentUser } = useAuth();

  // Filtrer les restaurants pour l'utilisateur connecté
  const restaurants = currentUser ? getUserRestaurants(currentUser.id) : [];

  const handleAddRestaurant = () => {
    if (onNavigate) {
      onNavigate('ajouter-restaurant');
    }
  };

  const handleRestaurantClick = () => {
    if (onNavigate) {
      onNavigate('restaurant-detail');
    }
  };

  const handleEditRestaurant = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (onNavigate) {
      onNavigate('modifier-restaurant', undefined, id);
    }
  };

  // Calculs dynamiques
  const totalRestaurants = restaurants.length;
  const noteMoyenne = restaurants.length > 0
    ? (restaurants.reduce((acc, r) => acc + r.note, 0) / restaurants.length).toFixed(1)
    : '0.0';

  const stats = [
    { label: 'Nombre de lieu(x)', value: totalRestaurants.toString(), icon: Building2, gradient: 'from-[#5a03cf] to-[#7a23ef]' },
    { label: 'Note moyenne de mes établissements', value: noteMoyenne, icon: Star, gradient: 'from-[#9cff02] to-[#7cdf00]' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Bloc principal avec bordure dégradée et liquid glass */}
      <div className="relative p-[3px] rounded-3xl bg-gradient-to-r from-[#9cff02] to-[#5a03cf] mb-8">
        <div className="backdrop-blur-xl bg-white/80 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
          {/* En-tête avec titre et bouton */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-gray-900 italic text-5xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
              Mes lieux
            </h1>
            <button
              onClick={handleAddRestaurant}
              className="px-6 py-3 bg-gradient-to-r from-[#9cff02] to-[#7cdf00] text-[#5a03cf] rounded-full hover:shadow-lg transition-all flex items-center gap-2 italic"
              style={{ fontWeight: '700' }}
            >
              <Plus className="w-5 h-5" />
              Ajouter un restaurant
            </button>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.map((stat, index) => {
              return (
                <div
                  key={index}
                  className="relative p-[2px] rounded-2xl bg-gradient-to-r from-[#9cff02] to-[#5a03cf]"
                >
                  <div className="bg-white rounded-2xl p-6 h-full flex flex-col justify-center">
                    <p className="text-6xl italic bg-gradient-to-r from-[#9cff02] to-[#5a03cf] bg-clip-text text-transparent mb-2" style={{ fontWeight: '800' }}>
                      {stat.value}
                    </p>
                    <p className="text-gray-600 text-sm" style={{ fontWeight: '500' }}>
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="relative p-[3px] rounded-2xl bg-gradient-to-r from-[#9cff02] to-[#5a03cf] hover:shadow-lg transition-all group"
          >
            <div className="bg-white rounded-2xl overflow-hidden h-full">
              <button
                onClick={handleRestaurantClick}
                className="w-full text-left"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.nom}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-gray-900 mb-2 italic text-xl" style={{ fontWeight: '700' }}>{restaurant.nom}</h3>
                  <div className="flex items-start gap-2 text-gray-600 text-sm mb-3">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>{restaurant.adresse}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-[#9cff02] text-[#9cff02]" />
                      <span className="text-gray-900" style={{ fontWeight: '600' }}>{restaurant.note}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{restaurant.capaciteMax} places</span>
                    </div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={(e) => handleEditRestaurant(e, restaurant.id)}
                className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#9cff02] hover:text-[#5a03cf]"
              >
                <Edit className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {/* Carte d'ajout avec bordure dégradée */}
        <button 
          onClick={handleAddRestaurant}
          className="relative p-[3px] rounded-2xl bg-gradient-to-r from-[#9cff02] to-[#5a03cf] hover:shadow-lg transition-all min-h-[320px]"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl h-full p-8 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#9cff02] to-[#5a03cf] flex items-center justify-center">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-700 italic" style={{ fontWeight: '600' }}>Ajouter un restaurant</p>
          </div>
        </button>
      </div>
    </div>
  );
}