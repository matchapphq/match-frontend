import { ArrowLeft, Edit, MapPin, Phone, Mail, Users, Save, Zap, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppContext } from '../../../context/AppContext';

interface ModifierRestaurantProps {
  restaurantId: number | null;
  onBack: () => void;
}

export function ModifierRestaurant({ restaurantId, onBack }: ModifierRestaurantProps) {
  const { restaurants, updateRestaurant } = useAppContext();
  const restaurant = restaurants.find(r => r.id === restaurantId);

  const [capaciteMax, setCapaciteMax] = useState(restaurant?.capaciteMax || 50);
  const maxCapacite = 100;
  
  // ✅ NOUVEAU : Booking mode state
  const [bookingMode, setBookingMode] = useState<'INSTANT' | 'REQUEST'>(restaurant?.bookingMode || 'INSTANT');

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
      setBookingMode(restaurant.bookingMode || 'INSTANT');
    }
  }, [restaurant]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (restaurantId) {
      updateRestaurant(restaurantId, {
        ...formData,
        capaciteMax,
        bookingMode, // ✅ NOUVEAU : Include booking mode
      });
      alert('Restaurant modifié avec succès !');
      onBack();
    }
  };

  if (!restaurant) {
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
            <p className="text-gray-500 dark:text-gray-400">Restaurant non trouvé</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
      {/* Header */}
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
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#9cff02] rounded-full animate-pulse" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Modification</span>
            </div>
            
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-full mb-6">
            <Edit className="w-4 h-4 text-[#5a03cf]" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Édition d'établissement</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl mb-4">
            Modifier{' '}
            <span className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
              {restaurant.nom}
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Mettez à jour les informations de votre établissement
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Nom du restaurant */}
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
            <label className="block text-gray-900 dark:text-white mb-3">
              Nom du restaurant
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:border-[#5a03cf]/50 text-gray-900 dark:text-white"
              required
            />
          </div>

          {/* Adresse */}
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
            <label className="flex items-center gap-2 text-gray-900 dark:text-white mb-3">
              <MapPin className="w-4 h-4 text-[#5a03cf]" />
              Adresse complète
            </label>
            <input
              type="text"
              value={formData.adresse}
              onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
              className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:border-[#5a03cf]/50 text-gray-900 dark:text-white"
              required
            />
          </div>

          {/* Contact grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Téléphone */}
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <label className="flex items-center gap-2 text-gray-900 dark:text-white mb-3">
                <Phone className="w-4 h-4 text-[#5a03cf]" />
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:border-[#5a03cf]/50 text-gray-900 dark:text-white"
                required
              />
            </div>

            {/* Email */}
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <label className="flex items-center gap-2 text-gray-900 dark:text-white mb-3">
                <Mail className="w-4 h-4 text-[#5a03cf]" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:border-[#5a03cf]/50 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Horaires */}
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
            <label className="block text-gray-900 dark:text-white mb-3">
              Horaires d'ouverture
            </label>
            <input
              type="text"
              value={formData.horaires}
              onChange={(e) => setFormData({ ...formData, horaires: e.target.value })}
              placeholder="Ex: Lun-Dim: 11h00 - 02h00"
              className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:border-[#5a03cf]/50 text-gray-900 dark:text-white placeholder-gray-500"
              required
            />
          </div>

          {/* Capacité */}
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Users className="w-4 h-4 text-[#5a03cf]" />
                Capacité maximale
              </label>
              <span className="text-2xl bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
                {capaciteMax}
              </span>
            </div>
            
            <input
              type="range"
              min="10"
              max={maxCapacite}
              value={capaciteMax}
              onChange={(e) => setCapaciteMax(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #9cff02 0%, #9cff02 ${(capaciteMax / maxCapacite) * 100}%, #e5e7eb ${(capaciteMax / maxCapacite) * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
              <span>10 places</span>
              <span>Max: {maxCapacite} places</span>
            </div>
          </div>

          {/* ✅ NOUVEAU : Mode de réservation - SECTION COMPLÈTE */}
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-lg text-gray-900 dark:text-white mb-2">
              Mode de réservation
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Choisissez comment gérer les demandes de réservation pour cet établissement
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Option 1 : INSTANT */}
              <div
                onClick={() => setBookingMode('INSTANT')}
                className={`cursor-pointer p-5 rounded-xl border-2 transition-all duration-200 ${
                  bookingMode === 'INSTANT'
                    ? 'border-[#9cff02] bg-[#9cff02]/5 dark:bg-[#9cff02]/10'
                    : 'border-gray-200/50 dark:border-gray-700/50 hover:border-[#9cff02]/30'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      bookingMode === 'INSTANT'
                        ? 'border-[#9cff02] bg-[#9cff02]'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {bookingMode === 'INSTANT' && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <Zap className={`w-5 h-5 ${
                      bookingMode === 'INSTANT' ? 'text-[#9cff02]' : 'text-gray-400'
                    }`} />
                  </div>
                  {bookingMode === 'INSTANT' && (
                    <span className="text-xs px-2 py-1 bg-[#9cff02]/20 text-[#9cff02] dark:text-[#9cff02] rounded-full">
                      Activé
                    </span>
                  )}
                </div>
                
                <h4 className="text-base text-gray-900 dark:text-white mb-2">
                  Confirmation Instantanée
                </h4>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Les réservations sont confirmées automatiquement
                </p>
                
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span className="text-[#9cff02] mt-0.5">✓</span>
                    <span>Confirmation immédiate</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span className="text-[#9cff02] mt-0.5">✓</span>
                    <span>+45% de conversions</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span className="text-[#9cff02] mt-0.5">✓</span>
                    <span>Aucune action requise</span>
                  </div>
                </div>
              </div>
              
              {/* Option 2 : REQUEST */}
              <div
                onClick={() => setBookingMode('REQUEST')}
                className={`cursor-pointer p-5 rounded-xl border-2 transition-all duration-200 ${
                  bookingMode === 'REQUEST'
                    ? 'border-[#5a03cf] bg-[#5a03cf]/5 dark:bg-[#5a03cf]/10'
                    : 'border-gray-200/50 dark:border-gray-700/50 hover:border-[#5a03cf]/30'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      bookingMode === 'REQUEST'
                        ? 'border-[#5a03cf] bg-[#5a03cf]'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {bookingMode === 'REQUEST' && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <Clock className={`w-5 h-5 ${
                      bookingMode === 'REQUEST' ? 'text-[#5a03cf]' : 'text-gray-400'
                    }`} />
                  </div>
                  {bookingMode === 'REQUEST' && (
                    <span className="text-xs px-2 py-1 bg-[#5a03cf]/20 text-[#5a03cf] rounded-full">
                      Activé
                    </span>
                  )}
                </div>
                
                <h4 className="text-base text-gray-900 dark:text-white mb-2">
                  Approbation Manuelle
                </h4>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Vous examinez chaque demande de réservation
                </p>
                
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span className="text-[#5a03cf] mt-0.5">✓</span>
                    <span>Contrôle total</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span className="text-[#5a03cf] mt-0.5">✓</span>
                    <span>Vérification avant confirmation</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span className="text-orange-500 mt-0.5">⚠</span>
                    <span>Nécessite votre intervention</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Info message */}
            <div className={`mt-4 p-4 rounded-xl border ${
              bookingMode === 'INSTANT'
                ? 'bg-[#9cff02]/10 border-[#9cff02]/30'
                : 'bg-[#5a03cf]/10 border-[#5a03cf]/30'
            }`}>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {bookingMode === 'INSTANT' ? (
                  <>
                    <span className="text-[#9cff02]">⚡</span> Mode Instantané actif : 
                    Les clients recevront une confirmation immédiate. Recommandé pour maximiser vos réservations.
                  </>
                ) : (
                  <>
                    <span className="text-[#5a03cf]">⏳</span> Mode Approbation actif : 
                    Vous recevrez une notification pour chaque nouvelle demande. Pensez à répondre rapidement (sous 24h).
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white py-4 rounded-full hover:brightness-110 hover:shadow-xl hover:shadow-[#5a03cf]/30 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Enregistrer les modifications
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-8 py-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 rounded-full hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
