import { Plus, MapPin, Star, Users, Edit } from 'lucide-react';
import { PageType } from '../App';
import { useAppContext } from '../context/AppContext';

interface MesRestaurantsProps {
  onNavigate?: (page: PageType, matchId?: number, restaurantId?: number) => void;
}

export function MesRestaurants({ onNavigate }: MesRestaurantsProps) {
  const { restaurants } = useAppContext();

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

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-2 italic text-4xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
            Mes restaurants
          </h1>
          <p className="text-gray-600 text-lg">Gérez vos établissements</p>
        </div>
        <button
          onClick={handleAddRestaurant}
          className="px-6 py-3 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white rounded-full hover:shadow-lg transition-all flex items-center gap-2 italic"
        >
          <Plus className="w-5 h-5" />
          Ajouter un restaurant
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="bg-white rounded-xl shadow-lg border-2 border-transparent hover:border-[#9cff02] overflow-hidden transition-all hover:scale-105 relative group"
          >
            <button
              onClick={handleRestaurantClick}
              className="w-full text-left"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={restaurant.image}
                  alt={restaurant.nom}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-gray-900 mb-2 italic">{restaurant.nom}</h3>
                <div className="flex items-start gap-2 text-gray-600 text-sm mb-3">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>{restaurant.adresse}</p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-[#9cff02] text-[#9cff02]" />
                    <span className="text-gray-900">{restaurant.note}</span>
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
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#9cff02] hover:text-[#5a03cf]"
            >
              <Edit className="w-5 h-5" />
            </button>
          </div>
        ))}

        {/* Carte d'ajout */}
        <button 
          onClick={handleAddRestaurant}
          className="bg-gradient-to-br from-[#5a03cf]/5 to-[#9cff02]/5 border-2 border-dashed border-[#5a03cf]/30 rounded-xl p-8 flex flex-col items-center justify-center gap-4 hover:border-[#9cff02] transition-all min-h-[320px]"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] flex items-center justify-center">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-700 italic">Ajouter un restaurant</p>
        </button>
      </div>
    </div>
  );
}