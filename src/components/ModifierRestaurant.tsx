import { ArrowLeft, Edit, MapPin, Phone, Mail, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

interface ModifierRestaurantProps {
  restaurantId: string | null;
  onBack: () => void;
}

export function ModifierRestaurant({ restaurantId, onBack }: ModifierRestaurantProps) {
  const { restaurants, updateRestaurant } = useAppContext();
  const restaurant = restaurants.find(r => r.id === restaurantId);

  const [capaciteMax, setCapaciteMax] = useState(restaurant?.capaciteMax || 50);
  const maxCapacite = 100;

  const [formData, setFormData] = useState({
    nom: restaurant?.nom || '',
    adresse: restaurant?.adresse || '',
    telephone: restaurant?.telephone || '',
    email: restaurant?.email || '',
    horaires: restaurant?.horaires || '',
  });

  useEffect(() => {
    if (restaurant) {
      setFormData({
        nom: restaurant.nom,
        adresse: restaurant.adresse,
        telephone: restaurant.telephone,
        email: restaurant.email,
        horaires: restaurant.horaires,
      });
      setCapaciteMax(restaurant.capaciteMax);
    }
  }, [restaurant]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (restaurantId) {
      updateRestaurant(restaurantId, {
        ...formData,
        capaciteMax,
      });
      alert('Restaurant modifié avec succès !');
      onBack();
    }
  };

  if (!restaurant) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour aux restaurants
        </button>
        <div className="text-center py-12">
          <p className="text-gray-500">Restaurant non trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour aux restaurants
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] p-3 rounded-xl">
            <Edit className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-gray-900 italic text-4xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
              Modifier le restaurant
            </h1>
            <p className="text-gray-600 text-lg">Modifiez les informations de votre établissement</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-2" style={{ fontWeight: '600' }}>
              Nom du restaurant
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2" style={{ fontWeight: '600' }}>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-[#5a03cf]" />
                Adresse complète
              </div>
            </label>
            <input
              type="text"
              value={formData.adresse}
              onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2" style={{ fontWeight: '600' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-[#5a03cf]" />
                  Téléphone
                </div>
              </label>
              <input
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2" style={{ fontWeight: '600' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-[#5a03cf]" />
                  Email
                </div>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-2" style={{ fontWeight: '600' }}>
              Horaires d&apos;ouverture
            </label>
            <input
              type="text"
              value={formData.horaires}
              onChange={(e) => setFormData({ ...formData, horaires: e.target.value })}
              placeholder="Ex: Lun-Dim: 11h00 - 02h00"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2" style={{ fontWeight: '600' }}>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-[#5a03cf]" />
                Capacité maximale : {capaciteMax} places
              </div>
            </label>
            <div className="px-2">
              <input
                type="range"
                min="10"
                max={maxCapacite}
                value={capaciteMax}
                onChange={(e) => setCapaciteMax(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #9cff02 0%, #9cff02 ${(capaciteMax / maxCapacite) * 100}%, #e5e7eb ${(capaciteMax / maxCapacite) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>10</span>
                <span className="text-[#5a03cf]" style={{ fontWeight: '600' }}>
                  Max: {maxCapacite} places
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white py-4 rounded-xl hover:shadow-lg transition-all italic text-lg"
              style={{ fontWeight: '600' }}
            >
              Enregistrer les modifications
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
