import { ArrowLeft, Store, Check, Zap, TrendingUp, Users, Star, Sparkles, ArrowRight, Calendar } from 'lucide-react';
import { PageType } from '../App';
import { useAuth } from '../context/AuthContext';
import logoMatch from 'figma:asset/c263754cf7a254d8319da5c6945751d81a6f5a94.png';

interface AjouterRestaurantProps {
  onBack: () => void;
  onNavigate: (page: PageType) => void;
  isOnboarding?: boolean;
}

export function AjouterRestaurant({ onBack, onNavigate, isOnboarding = false }: AjouterRestaurantProps) {
  const { updateOnboardingStep } = useAuth();

  const handleChoisirOffre = (type: 'mensuel' | 'annuel') => {
    // Si c'est le parcours d'onboarding, on met à jour l'étape
    if (isOnboarding) {
      updateOnboardingStep('facturation');
    }
    onNavigate('facturation');
  };

  const avantages = [
    { text: 'Accès illimité aux matchs programmés', icon: Calendar },
    { text: 'Gestion de la jauge de places en temps réel', icon: Users },
    { text: 'Visibilité sur l\'application Match', icon: TrendingUp },
    { text: 'Système de boost pour augmenter votre visibilité', icon: Zap },
    { text: 'Statistiques détaillées de vos matchs', icon: Star },
    { text: 'Support client dédié', icon: Check },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Éléments décoratifs animés */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#9cff02]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#5a03cf]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#5a03cf]/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 p-8 max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-[#5a03cf] mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Retour
        </button>

        {/* En-tête avec logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src={logoMatch} 
              alt="Match" 
              className="h-16"
            />
          </div>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#9cff02] to-[#5a03cf] rounded-3xl mb-4 shadow-xl">
            <Store className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl text-[#5a03cf] mb-3 italic" style={{ fontWeight: '800' }}>
            Équipez votre restaurant
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Rejoignez Match et attirez plus de clients lors des événements sportifs
          </p>
        </div>

        {/* Offres tarifaires - Remonté en haut */}
        <div className="mb-8">
          <h2 className="text-2xl text-center text-[#5a03cf] mb-6 italic" style={{ fontWeight: '700' }}>
            Choisissez votre formule
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {/* Offre mensuelle */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-200 overflow-hidden hover:border-[#5a03cf] transition-all hover:scale-105 hover:shadow-3xl group">
              <div className="bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] text-white p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-white/5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl mb-2 italic" style={{ fontWeight: '800' }}>
                    Mensuel
                  </h3>
                  <div className="mb-2">
                    <span className="text-5xl italic" style={{ fontWeight: '800' }}>30€</span>
                    <span className="text-xl">/mois</span>
                  </div>
                  <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                    <p className="text-white text-sm">Engagement 1 an</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3 text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-[#9cff02] flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-[#5a03cf]" />
                    </div>
                    Facturation mensuelle
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-[#9cff02] flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-[#5a03cf]" />
                    </div>
                    Total : 360€/an
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-[#9cff02] flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-[#5a03cf]" />
                    </div>
                    Tous les avantages Match
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-[#9cff02] flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-[#5a03cf]" />
                    </div>
                    Sans engagement après 1 an
                  </li>
                </ul>
                <button 
                  className="w-full bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white py-3 rounded-xl hover:shadow-xl transition-all italic text-lg group/btn" 
                  style={{ fontWeight: '700' }}
                  onClick={() => handleChoisirOffre('mensuel')}
                >
                  <span className="flex items-center justify-center gap-2">
                    Choisir cette offre
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            </div>

            {/* Offre annuelle - Recommandée */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border-4 border-[#9cff02] overflow-hidden relative hover:scale-105 transition-all hover:shadow-3xl group">
              <div className="absolute -top-3 -right-3 z-20">
                <div className="bg-gradient-to-r from-[#9cff02] to-[#7cdf00] text-[#5a03cf] px-5 py-1.5 rounded-full text-sm italic shadow-xl border-2 border-white" style={{ fontWeight: '800' }}>
                  ⭐ Économisez 60€
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#9cff02] to-[#7cdf00] text-[#5a03cf] p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl mb-2 italic" style={{ fontWeight: '800' }}>
                    Annuel
                  </h3>
                  <div className="mb-2">
                    <span className="text-5xl italic" style={{ fontWeight: '800' }}>300€</span>
                    <span className="text-xl">/an</span>
                  </div>
                  <div className="inline-block bg-[#5a03cf]/20 backdrop-blur-sm px-3 py-1 rounded-full border border-[#5a03cf]/30">
                    <p className="text-[#5a03cf] text-sm" style={{ fontWeight: '700' }}>🎉 2 mois offerts !</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3 text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-[#9cff02] flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-[#5a03cf]" />
                    </div>
                    Facturation annuelle
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-[#9cff02] flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-[#5a03cf]" />
                    </div>
                    <span>
                      Soit <span style={{ fontWeight: '800', color: '#5a03cf' }}>25€/mois</span>
                    </span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-[#9cff02] flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-[#5a03cf]" />
                    </div>
                    Tous les avantages Match
                  </li>
                  <li className="flex items-center gap-3 text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-[#9cff02] flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-[#5a03cf]" />
                    </div>
                    <span style={{ fontWeight: '700' }}>🎁 3 boosts offerts</span>
                  </li>
                </ul>
                <button 
                  className="w-full bg-gradient-to-r from-[#9cff02] to-[#7cdf00] text-[#5a03cf] py-3 rounded-xl hover:shadow-xl transition-all italic text-lg group/btn" 
                  style={{ fontWeight: '800' }}
                  onClick={() => handleChoisirOffre('annuel')}
                >
                  <span className="flex items-center justify-center gap-2">
                    Choisir cette offre
                    <Sparkles className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Avantages - Style moderne - Déplacé après la tarification */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 mb-8 border border-gray-200">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Sparkles className="w-7 h-7 text-[#9cff02]" />
            <h2 className="text-3xl text-[#5a03cf] italic" style={{ fontWeight: '700' }}>
              Ce que vous obtenez avec Match
            </h2>
            <Sparkles className="w-7 h-7 text-[#9cff02]" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {avantages.map((avantage, index) => {
              const Icon = avantage.icon;
              return (
                <div key={index} className="bg-gradient-to-br from-[#5a03cf]/5 to-[#9cff02]/5 rounded-2xl p-5 border-2 border-[#5a03cf]/20 hover:border-[#9cff02] transition-all group hover:scale-105">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#9cff02] to-[#5a03cf] flex items-center justify-center flex-shrink-0 group-hover:rotate-6 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-gray-700 pt-2">{avantage.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Témoignages */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 p-8 md:p-10">
          <h2 className="text-3xl mb-8 text-center text-[#5a03cf] italic" style={{ fontWeight: '700' }}>
            Ils nous font confiance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { nom: 'Le Sport Bar', ville: 'Paris', avis: '+140% de clients lors des matchs', note: 5 },
              { nom: 'Chez Michel', ville: 'Lyon', avis: 'Excellent retour sur investissement', note: 5 },
              { nom: 'La Brasserie', ville: 'Marseille', avis: 'Application intuitive et efficace', note: 5 },
            ].map((temoignage, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#5a03cf]/5 to-[#9cff02]/5 rounded-2xl p-6 border-2 border-[#5a03cf]/20 hover:border-[#9cff02] transition-all hover:scale-105"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(temoignage.note)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#9cff02] text-[#9cff02]" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic text-lg">&quot;{temoignage.avis}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9cff02] to-[#5a03cf] flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-900" style={{ fontWeight: '700' }}>
                      {temoignage.nom}
                    </p>
                    <p className="text-gray-600 text-sm">{temoignage.ville}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA final */}
        <div className="mt-8 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] text-white rounded-3xl p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-32 h-32 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-10 left-10 w-48 h-48 border-2 border-white rounded-full"></div>
          </div>
          <div className="relative z-10 text-center">
            <h3 className="text-4xl mb-4 italic" style={{ fontWeight: '800' }}>
              Prêt à booster votre activité ? 🚀
            </h3>
            <p className="text-white/90 mb-8 text-lg max-w-2xl mx-auto">
              Rejoignez Match dès aujourd'hui et commencez à attirer plus de clients lors des événements sportifs
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="px-10 py-4 bg-[#9cff02] text-[#5a03cf] rounded-xl hover:shadow-xl transition-all italic text-lg group" style={{ fontWeight: '800' }}>
                <span className="flex items-center gap-2">
                  Nous contacter
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button className="px-10 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl hover:bg-white/20 transition-all border-2 border-white/30 text-lg">
                En savoir plus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}