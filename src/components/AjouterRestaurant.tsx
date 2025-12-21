import { ArrowLeft, Store, Check, Zap, TrendingUp, Users, Star } from 'lucide-react';
import { PageType } from '../App';

interface AjouterRestaurantProps {
  onBack: () => void;
  onNavigate: (page: PageType) => void;
}

export function AjouterRestaurant({ onBack, onNavigate }: AjouterRestaurantProps) {
  const handleChoisirOffre = (type: 'mensuel' | 'annuel') => {
    onNavigate('facturation');
  };

  const avantages = [
    'Accès illimité aux matchs programmés',
    'Gestion de la jauge de places en temps réel',
    'Visibilité sur l\'application Match',
    'Système de boost pour augmenter votre visibilité',
    'Statistiques détaillées de vos matchs',
    'Support client dédié',
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour aux restaurants
      </button>

      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] rounded-full mb-4">
          <Store className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-gray-900 italic text-4xl mb-4" style={{ fontWeight: '700', color: '#5a03cf' }}>
          Équipez votre restaurant
        </h1>
        <p className="text-gray-600 text-lg">
          Rejoignez Match et attirez plus de clients lors des événements sportifs
        </p>
      </div>

      {/* Avantages */}
      <div className="bg-gradient-to-br from-[#5a03cf]/5 to-[#9cff02]/5 rounded-2xl p-8 mb-8 border-2 border-[#5a03cf]/20">
        <h2 className="text-2xl mb-6 text-center" style={{ fontWeight: '700', color: '#5a03cf' }}>
          Ce que vous obtenez avec Match
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {avantages.map((avantage, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="bg-[#9cff02] p-1 rounded-full flex-shrink-0 mt-1">
                <Check className="w-4 h-4 text-[#5a03cf]" />
              </div>
              <p className="text-gray-700">{avantage}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Offres tarifaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Offre mensuelle */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden hover:border-[#5a03cf] transition-all hover:scale-105">
          <div className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white p-6 text-center">
            <h3 className="text-2xl mb-2" style={{ fontWeight: '700' }}>
              Mensuel
            </h3>
            <div className="mb-2">
              <span className="text-5xl italic" style={{ fontWeight: '700' }}>30€</span>
              <span className="text-xl">/mois</span>
            </div>
            <p className="text-white/80 text-sm">Engagement 1 an</p>
          </div>
          <div className="p-6">
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-gray-700">
                <Check className="w-5 h-5 text-[#9cff02]" />
                Facturation mensuelle
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <Check className="w-5 h-5 text-[#9cff02]" />
                Total : 360€/an
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <Check className="w-5 h-5 text-[#9cff02]" />
                Tous les avantages Match
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <Check className="w-5 h-5 text-[#9cff02]" />
                Sans engagement après 1 an
              </li>
            </ul>
            <button className="w-full bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white py-4 rounded-xl hover:shadow-lg transition-all italic text-lg" style={{ fontWeight: '600' }}
              onClick={() => handleChoisirOffre('mensuel')}
            >
              Choisir cette offre
            </button>
          </div>
        </div>

        {/* Offre annuelle */}
        <div className="bg-white rounded-2xl shadow-xl border-4 border-[#9cff02] overflow-hidden relative hover:scale-105 transition-all">
          <div className="absolute top-4 right-4 bg-[#9cff02] text-[#5a03cf] px-4 py-1 rounded-full text-sm italic" style={{ fontWeight: '700' }}>
            Économisez 60€
          </div>
          <div className="bg-gradient-to-r from-[#9cff02] to-[#7cdf00] text-[#5a03cf] p-6 text-center">
            <h3 className="text-2xl mb-2" style={{ fontWeight: '700' }}>
              Annuel
            </h3>
            <div className="mb-2">
              <span className="text-5xl italic" style={{ fontWeight: '700' }}>300€</span>
              <span className="text-xl">/an</span>
            </div>
            <p className="text-[#5a03cf]/80 text-sm">2 mois offerts !</p>
          </div>
          <div className="p-6">
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-gray-700">
                <Check className="w-5 h-5 text-[#9cff02]" />
                Facturation annuelle
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <Check className="w-5 h-5 text-[#9cff02]" />
                <span>
                  Soit <span style={{ fontWeight: '700', color: '#5a03cf' }}>25€/mois</span>
                </span>
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <Check className="w-5 h-5 text-[#9cff02]" />
                Tous les avantages Match
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <Check className="w-5 h-5 text-[#9cff02]" />
                <span style={{ fontWeight: '700' }}>3 boosts offerts</span>
              </li>
            </ul>
            <button className="w-full bg-gradient-to-r from-[#9cff02] to-[#7cdf00] text-[#5a03cf] py-4 rounded-xl hover:shadow-lg transition-all italic text-lg" style={{ fontWeight: '700' }}
              onClick={() => handleChoisirOffre('annuel')}
            >
              Choisir cette offre
            </button>
          </div>
        </div>
      </div>

      {/* Témoignages */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <h2 className="text-2xl mb-6 text-center" style={{ fontWeight: '700', color: '#5a03cf' }}>
          Ils nous font confiance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { nom: 'Le Sport Bar', ville: 'Paris', avis: '+140% de clients', note: 5 },
            { nom: 'Chez Michel', ville: 'Lyon', avis: 'Excellent retour sur investissement', note: 5 },
            { nom: 'La Brasserie', ville: 'Marseille', avis: 'Application intuitive', note: 4 },
          ].map((temoignage, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-[#5a03cf]/5 to-[#9cff02]/5 rounded-xl p-5 border border-[#5a03cf]/20"
            >
              <div className="flex items-center gap-2 mb-2">
                {[...Array(temoignage.note)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#9cff02] text-[#9cff02]" />
                ))}
              </div>
              <p className="text-gray-700 mb-3 italic">&quot;{temoignage.avis}&quot;</p>
              <p className="text-gray-900" style={{ fontWeight: '600' }}>
                {temoignage.nom}
              </p>
              <p className="text-gray-600 text-sm">{temoignage.ville}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA final */}
      <div className="mt-8 text-center bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] text-white rounded-2xl p-8">
        <h3 className="text-2xl mb-4" style={{ fontWeight: '700' }}>
          Prêt à booster votre activité ?
        </h3>
        <p className="text-white/80 mb-6">
          Rejoignez Match dès aujourd&apos;hui et commencez à attirer plus de clients
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-8 py-4 bg-[#9cff02] text-[#5a03cf] rounded-xl hover:shadow-lg transition-all italic text-lg" style={{ fontWeight: '700' }}>
            Nous contacter
          </button>
          <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-white/20 transition-all border border-white/30">
            En savoir plus
          </button>
        </div>
      </div>
    </div>
  );
}