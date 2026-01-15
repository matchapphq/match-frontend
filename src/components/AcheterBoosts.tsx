import { Zap, Sparkles, Check, ShoppingCart, TrendingUp, Gift, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface AcheterBoostsProps {
  onBack: () => void;
}

type PackType = 'single' | 'pack_3' | 'pack_10';

interface BoostPack {
  id: PackType;
  name: string;
  quantity: number;
  price: number;
  unitPrice: number;
  discount: number;
  badge?: string;
  popular?: boolean;
}

const boostPacks: BoostPack[] = [
  {
    id: 'single',
    name: '1 Boost',
    quantity: 1,
    price: 30,
    unitPrice: 30,
    discount: 0,
  },
  {
    id: 'pack_3',
    name: 'Pack 3 Boosts',
    quantity: 3,
    price: 75,
    unitPrice: 25,
    discount: 17,
    badge: 'Économisez 17%',
    popular: true,
  },
  {
    id: 'pack_10',
    name: 'Pack 10 Boosts',
    quantity: 10,
    price: 200,
    unitPrice: 20,
    discount: 33,
    badge: 'Meilleure offre',
  },
];

const benefits = [
  'Priorité sur la carte de l\'application',
  'Notifications push ciblées aux utilisateurs',
  'Badge "Événement sponsorisé"',
  'Analytics détaillées de performance',
  'Support prioritaire',
];

export function AcheterBoosts({ onBack }: AcheterBoostsProps) {
  const [selectedPack, setSelectedPack] = useState<PackType>('pack_3');

  const handlePurchase = () => {
    const pack = boostPacks.find(p => p.id === selectedPack);
    if (pack) {
      // TODO: Intégrer Stripe Checkout
      console.log('Achat du pack:', pack);
      alert(`Redirection vers le paiement pour ${pack.name} - ${pack.price}€`);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto pb-24 lg:pb-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={onBack}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-4 flex items-center gap-2 transition-colors"
          >
            ← Retour
          </button>
          
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#9cff02] to-[#7cdf00] rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-[#5a03cf]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl text-gray-900 dark:text-gray-100">Acheter des boosts</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Boostez vos matchs et maximisez votre visibilité</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left: Pack Selection */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl text-gray-900 dark:text-white mb-6">Choisissez votre pack</h2>
              
              <div className="space-y-4">
                {boostPacks.map((pack) => (
                  <button
                    key={pack.id}
                    onClick={() => setSelectedPack(pack.id)}
                    className={`w-full text-left transition-all rounded-xl sm:rounded-2xl border-2 p-5 sm:p-6 relative overflow-hidden group ${
                      selectedPack === pack.id
                        ? 'border-[#5a03cf] bg-gradient-to-br from-[#5a03cf]/5 to-[#9cff02]/5'
                        : 'border-gray-200 dark:border-gray-700 hover:border-[#5a03cf]/50 bg-white dark:bg-gray-800'
                    }`}
                  >
                    {/* Badge */}
                    {pack.badge && (
                      <div className="absolute top-0 right-0">
                        <div className={`px-3 py-1 text-xs rounded-bl-xl ${
                          pack.popular
                            ? 'bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white'
                            : 'bg-gradient-to-r from-[#9cff02] to-[#7cdf00] text-[#5a03cf]'
                        }`}>
                          {pack.badge}
                        </div>
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            selectedPack === pack.id
                              ? 'bg-gradient-to-br from-[#9cff02] to-[#7cdf00]'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            <Zap className={`w-6 h-6 ${
                              selectedPack === pack.id ? 'text-[#5a03cf]' : 'text-gray-400 dark:text-gray-500'
                            }`} />
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg text-gray-900 dark:text-white mb-1">{pack.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                              {pack.quantity} boost{pack.quantity > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-3xl sm:text-4xl text-gray-900 dark:text-white">{pack.price}€</span>
                          {pack.discount > 0 && (
                            <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                              {pack.quantity * 30}€
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          {pack.unitPrice}€ par boost
                          {pack.discount > 0 && (
                            <span className="text-[#5a03cf] ml-2">(-{pack.discount}%)</span>
                          )}
                        </p>
                      </div>

                      {/* Radio indicator */}
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        selectedPack === pack.id
                          ? 'border-[#5a03cf] bg-[#5a03cf]'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {selectedPack === pack.id && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#5a03cf]/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#5a03cf]" />
                </div>
                <h2 className="text-lg sm:text-xl text-gray-900 dark:text-white">Avec chaque boost</h2>
              </div>

              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#9cff02]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#5a03cf]" />
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Alternative */}
            <div className="bg-gradient-to-br from-[#9cff02]/20 to-[#5a03cf]/20 rounded-2xl border border-[#9cff02]/30 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Gift className="w-6 h-6 text-[#5a03cf]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg text-gray-900 dark:text-white mb-2">Gagnez des boosts gratuitement</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Parrainez d'autres restaurateurs et recevez 1 boost gratuit par parrainage converti
                  </p>
                  <button className="text-sm text-[#5a03cf] hover:text-[#7a23ef] flex items-center gap-1 transition-colors">
                    En savoir plus
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Summary & Checkout */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 sticky top-6">
              <h2 className="text-lg text-gray-900 dark:text-white mb-6">Récapitulatif</h2>

              {/* Selected Pack Summary */}
              {(() => {
                const pack = boostPacks.find(p => p.id === selectedPack);
                if (!pack) return null;

                return (
                  <>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#9cff02] to-[#7cdf00] rounded-lg flex items-center justify-center">
                          <Zap className="w-5 h-5 text-[#5a03cf]" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">{pack.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{pack.quantity} boost{pack.quantity > 1 ? 's' : ''}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Prix unitaire</span>
                          <span className="text-gray-900 dark:text-white">{pack.unitPrice}€</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Quantité</span>
                          <span className="text-gray-900 dark:text-white">×{pack.quantity}</span>
                        </div>
                        {pack.discount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Réduction</span>
                            <span className="text-green-600 dark:text-green-400">-{pack.discount}%</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total TTC</span>
                        <div className="text-right">
                          <span className="text-3xl text-gray-900 dark:text-white">{pack.price}€</span>
                        </div>
                      </div>
                      {pack.discount > 0 && (
                        <p className="text-xs text-green-600 dark:text-green-400 text-right">
                          Vous économisez {pack.quantity * 30 - pack.price}€
                        </p>
                      )}
                    </div>

                    {/* Purchase Button */}
                    <button
                      onClick={handlePurchase}
                      className="w-full px-6 py-4 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] text-white rounded-xl hover:shadow-xl hover:shadow-[#5a03cf]/30 transition-all flex items-center justify-center gap-2 group text-base mb-4"
                    >
                      <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Procéder au paiement
                    </button>

                    {/* Security note */}
                    <div className="text-xs text-center text-gray-500 dark:text-gray-400 space-y-1">
                      <p>🔒 Paiement 100% sécurisé par Stripe</p>
                      <p>Aucun engagement • Utilisation immédiate</p>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Stats */}
            <div className="mt-6 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5" />
                <h3 className="text-base">Impact moyen d'un boost</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-2xl mb-1">+150%</div>
                  <div className="text-sm text-white/80">Vues supplémentaires</div>
                </div>
                <div>
                  <div className="text-2xl mb-1">+8</div>
                  <div className="text-sm text-white/80">Réservations moyennes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
