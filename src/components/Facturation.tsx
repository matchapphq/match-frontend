import { ArrowLeft, CreditCard, Building, MapPin, Lock } from 'lucide-react';
import { useState } from 'react';
import { PageType } from '../App';
import { useAuth } from '../context/AuthContext';

interface FacturationProps {
  onBack: () => void;
  onNavigate: (page: PageType) => void;
  isOnboarding?: boolean;
}

export function Facturation({ onBack, onNavigate, isOnboarding = false }: FacturationProps) {
  const { completeOnboarding } = useAuth();
  const [formData, setFormData] = useState({
    nomRestaurant: '',
    adresse: '',
    siret: '',
    nomCarte: '',
    numeroCarte: '',
    dateExpiration: '',
    cvv: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Si c'est le parcours d'onboarding, on finalise l'inscription
    if (isOnboarding) {
      completeOnboarding();
      setTimeout(() => {
        onNavigate('dashboard');
      }, 1000);
    } else {
      alert('Paiement validé !');
      onNavigate('mes-restaurants');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour aux offres
      </button>

      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] rounded-full mb-4">
          <CreditCard className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-gray-900 italic text-4xl mb-4" style={{ fontWeight: '700', color: '#5a03cf' }}>
          Finaliser votre commande
        </h1>
        <p className="text-gray-600 text-lg">
          Complétez vos informations pour équiper votre restaurant
        </p>
      </div>

      {/* Récapitulatif */}
      <div className="bg-gradient-to-r from-[#5a03cf]/10 to-[#9cff02]/10 rounded-xl p-6 mb-8 border-2 border-[#5a03cf]/20">
        <h2 className="text-xl mb-4" style={{ fontWeight: '700', color: '#5a03cf' }}>
          Récapitulatif de votre commande
        </h2>
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-700">Offre sélectionnée</span>
          <span className="text-gray-900" style={{ fontWeight: '600' }}>Abonnement annuel</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-700">Prix</span>
          <span className="text-gray-900" style={{ fontWeight: '600' }}>300€/an</span>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-[#5a03cf]/20">
          <span className="text-gray-900" style={{ fontWeight: '700' }}>Total TTC</span>
          <span className="text-[#5a03cf] text-2xl italic" style={{ fontWeight: '700' }}>300€</span>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <h3 className="text-xl mb-4" style={{ fontWeight: '700', color: '#5a03cf' }}>
              Informations du restaurant
            </h3>
          </div>

          <div>
            <label className="block text-gray-700 mb-2" style={{ fontWeight: '600' }}>
              <div className="flex items-center gap-2 mb-2">
                <Building className="w-4 h-4 text-[#5a03cf]" />
                Nom du restaurant
              </div>
            </label>
            <input
              type="text"
              value={formData.nomRestaurant}
              onChange={(e) => setFormData({ ...formData, nomRestaurant: e.target.value })}
              placeholder="Le Sport Bar"
              required
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
              placeholder="12 Rue de la République, 75001 Paris"
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2" style={{ fontWeight: '600' }}>
              SIRET
            </label>
            <input
              type="text"
              value={formData.siret}
              onChange={(e) => setFormData({ ...formData, siret: e.target.value })}
              placeholder="123 456 789 00012"
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent"
            />
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-xl mb-4" style={{ fontWeight: '700', color: '#5a03cf' }}>
              Informations de paiement
            </h3>
          </div>

          <div>
            <label className="block text-gray-700 mb-2" style={{ fontWeight: '600' }}>
              Nom sur la carte
            </label>
            <input
              type="text"
              value={formData.nomCarte}
              onChange={(e) => setFormData({ ...formData, nomCarte: e.target.value })}
              placeholder="Jean Restaurateur"
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2" style={{ fontWeight: '600' }}>
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-[#5a03cf]" />
                Numéro de carte
              </div>
            </label>
            <input
              type="text"
              value={formData.numeroCarte}
              onChange={(e) => setFormData({ ...formData, numeroCarte: e.target.value })}
              placeholder="1234 5678 9012 3456"
              required
              maxLength={19}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2" style={{ fontWeight: '600' }}>
                Date d&apos;expiration
              </label>
              <input
                type="text"
                value={formData.dateExpiration}
                onChange={(e) => setFormData({ ...formData, dateExpiration: e.target.value })}
                placeholder="MM/AA"
                required
                maxLength={5}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2" style={{ fontWeight: '600' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-[#5a03cf]" />
                  CVV
                </div>
              </label>
              <input
                type="text"
                value={formData.cvv}
                onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                placeholder="123"
                required
                maxLength={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent"
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-[#5a03cf] mt-0.5" />
              <div>
                <p className="text-gray-900 text-sm" style={{ fontWeight: '600' }}>
                  Paiement 100% sécurisé
                </p>
                <p className="text-gray-600 text-sm">
                  Vos informations de paiement sont cryptées et sécurisées
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white py-4 rounded-xl hover:shadow-lg transition-all italic text-lg"
              style={{ fontWeight: '600' }}
            >
              Valider le paiement - 300€
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