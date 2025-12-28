import { ArrowRight, Zap, Users, TrendingUp, Star, Check, Sparkles, Calendar, BarChart3, Quote, DollarSign, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import logoMatch from 'figma:asset/c263754cf7a254d8319da5c6945751d81a6f5a94.png';
import { useState, useEffect } from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
  onReferral?: () => void;
}

export function LandingPage({ onGetStarted, onReferral }: LandingPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const avantages = [
    {
      icon: Calendar,
      titre: 'Matchs illimités',
      description: 'Diffusez autant de matchs que vous voulez dans votre établissement'
    },
    {
      icon: Users,
      titre: 'Plus de clients',
      description: 'Attirez en moyenne +140% de clients lors des événements sportifs'
    },
    {
      icon: TrendingUp,
      titre: 'Visibilité maximale',
      description: 'Soyez visible par des milliers de fans à la recherche d\'un lieu'
    },
    {
      icon: Zap,
      titre: 'Système de boost',
      description: 'Mettez en avant vos matchs pour encore plus de visibilité'
    },
    {
      icon: BarChart3,
      titre: 'Statistiques détaillées',
      description: 'Analysez vos performances et optimisez votre activité'
    },
    {
      icon: Star,
      titre: 'Support dédié',
      description: 'Une équipe à votre écoute 7j/7 pour vous accompagner'
    }
  ];

  const temoignages = [
    {
      nom: 'Marc Leblanc',
      restaurant: 'Le Sport Bar - Paris',
      avatar: '🏆',
      note: 5,
      texte: 'Match a complètement transformé notre activité. Nous sommes complets à chaque match important !'
    },
    {
      nom: 'Sophie Martin',
      restaurant: 'Chez Michel - Lyon',
      avatar: '⚽',
      note: 5,
      texte: 'Un investissement qui se rentabilise dès le premier mois. L\'application est intuitive et efficace.'
    },
    {
      nom: 'Thomas Durand',
      restaurant: 'La Brasserie - Marseille',
      avatar: '🎯',
      note: 5,
      texte: 'Le système de boost nous permet de nous démarquer. Nos réservations ont explosé !'
    }
  ];

  const stats = [
    { nombre: '2,500+', label: 'Restaurants partenaires' },
    { nombre: '150K+', label: 'Clients satisfaits' },
    { nombre: '10K+', label: 'Matchs diffusés/mois' },
    { nombre: '+140%', label: 'Affluence moyenne' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5a03cf]/5 via-white to-[#9cff02]/5 relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#9cff02]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#5a03cf]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Header */}
      <header className="relative z-10 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center bg-gray-900/20 backdrop-blur-md border border-gray-400/30 rounded-2xl px-6 py-4 shadow-lg">
            {/* Bouton parrainage à gauche */}
            <Button
              variant="outline"
              className="border-2 border-[#9cff02] text-gray-900 hover:bg-[#9cff02] hover:text-[#5a03cf] transition-all"
              onClick={onReferral}
            >
              <span className="hidden sm:inline">Parrainer un lieu</span>
              <span className="sm:hidden">Parrainer</span>
            </Button>

            {/* Logo centré en violet */}
            <img 
              src={logoMatch} 
              alt="Match" 
              className="h-10 md:h-12 absolute left-1/2 transform -translate-x-1/2"
              style={{ filter: 'brightness(0) saturate(100%) invert(13%) sepia(91%) saturate(6297%) hue-rotate(268deg) brightness(83%) contrast(122%)' }}
            />

            {/* Bouton connexion à droite */}
            <Button
              onClick={onGetStarted}
              variant="outline"
              className="border-2 border-[#5a03cf] text-[#5a03cf] hover:bg-[#5a03cf] hover:text-white transition-all"
            >
              Je me connecte
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Carousel Section */}
      <section className="relative z-10 px-6 md:px-8 py-4 md:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative min-h-[400px]">
            {/* Slide 1 - Hero principal */}
            <div
              className={`transition-opacity duration-700 ${currentSlide === 0 ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'}`}
            >
              <div className="text-center px-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl text-[#5a03cf] mb-4 italic leading-tight" style={{ fontWeight: '800' }}>
                  Transformez chaque match<br />en opportunité
                </h1>

                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Rejoignez des milliers de restaurateurs qui ont fait de Match leur allié pour attirer plus de clients lors des événements sportifs
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                  <Button
                    onClick={onGetStarted}
                    className="bg-gradient-to-r from-[#9cff02] to-[#5a03cf] hover:opacity-90 text-white shadow-2xl hover:shadow-3xl transition-all h-14 px-8 group"
                  >
                    <span className="flex items-center gap-2" style={{ fontWeight: '700' }}>
                      Rejoindre Match
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-14 px-8 border-2 border-gray-300 hover:border-[#5a03cf] hover:text-[#5a03cf]"
                  >
                    Voir la démo
                  </Button>
                </div>
              </div>
            </div>

            {/* Slide 2 - Témoignage */}
            <div
              className={`transition-opacity duration-700 ${currentSlide === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'}`}
            >
              <div className="text-center px-4 flex flex-col items-center justify-center min-h-[350px]">
                <Quote className="w-14 h-14 text-[#9cff02] mb-6" />
                <p className="text-2xl md:text-3xl text-gray-800 mb-6 italic max-w-3xl leading-relaxed" style={{ fontWeight: '700' }}>
                  &quot;Depuis que nous utilisons Match, notre chiffre d'affaires a augmenté de 45% les soirs de match. C'est devenu indispensable pour notre restaurant.&quot;
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#9cff02] to-[#5a03cf] flex items-center justify-center text-3xl">
                    ⚽
                  </div>
                  <div className="text-left">
                    <div className="text-xl text-gray-900 mb-1" style={{ fontWeight: '800' }}>
                      Jean-Marc Bellot
                    </div>
                    <div className="text-gray-600">
                      Le Stadium - Lille
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#9cff02] text-[#9cff02]" />
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-[#9cff02] to-[#5a03cf] hover:opacity-90 text-white shadow-2xl hover:shadow-3xl transition-all h-12 px-8 group mt-4"
                >
                  <span className="flex items-center gap-2" style={{ fontWeight: '700' }}>
                    Rejoindre Match
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </div>
            </div>

            {/* Slide 3 - ROI / Chiffres rentabilité */}
            <div
              className={`transition-opacity duration-700 ${currentSlide === 2 ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'}`}
            >
              <div className="text-center px-4 flex flex-col items-center justify-center min-h-[350px]">
                <h2 className="text-3xl md:text-4xl text-[#5a03cf] mb-3 italic" style={{ fontWeight: '800' }}>
                  Un investissement rentable
                </h2>
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
                  Les chiffres qui prouvent que Match booste votre activité
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border-2 border-[#9cff02]">
                    <TrendingUp className="w-12 h-12 text-[#9cff02] mx-auto mb-3" />
                    <div className="text-4xl text-[#5a03cf] mb-2 italic" style={{ fontWeight: '800' }}>
                      +45%
                    </div>
                    <div className="text-gray-700" style={{ fontWeight: '600' }}>
                      de CA en moyenne
                    </div>
                    <p className="text-gray-600 text-sm mt-2">
                      les soirs de match
                    </p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border-2 border-[#5a03cf]">
                    <DollarSign className="w-12 h-12 text-[#5a03cf] mx-auto mb-3" />
                    <div className="text-4xl text-[#5a03cf] mb-2 italic" style={{ fontWeight: '800' }}>
                      ROI 1200%
                    </div>
                    <div className="text-gray-700" style={{ fontWeight: '600' }}>
                      Retour sur investissement
                    </div>
                    <p className="text-gray-600 text-sm mt-2">
                      dès le premier mois
                    </p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border-2 border-[#9cff02]">
                    <Users className="w-12 h-12 text-[#9cff02] mx-auto mb-3" />
                    <div className="text-4xl text-[#5a03cf] mb-2 italic" style={{ fontWeight: '800' }}>
                      +140%
                    </div>
                    <div className="text-gray-700" style={{ fontWeight: '600' }}>
                      de clients supplémentaires
                    </div>
                    <p className="text-gray-600 text-sm mt-2">
                      lors des événements
                    </p>
                  </div>
                </div>

                <Button
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-[#9cff02] to-[#5a03cf] hover:opacity-90 text-white shadow-2xl hover:shadow-3xl transition-all h-14 px-8 group"
                >
                  <span className="flex items-center gap-2" style={{ fontWeight: '700' }}>
                    Rejoindre Match
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </div>
            </div>

            {/* Navigation dots */}
            <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center gap-3">
              {Array.from({ length: totalSlides }, (_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentSlide === index ? 'bg-[#5a03cf] w-7' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Aller au slide ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="relative z-10 px-6 md:px-8 py-8 md:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl text-[#5a03cf] mb-4 italic" style={{ fontWeight: '800' }}>
              Pourquoi choisir Match ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une solution complète pour gérer vos événements sportifs et booster votre chiffre d'affaires
            </p>
          </div>

          {/* Défilement horizontal des avantages */}
          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
              {avantages.map((avantage, index) => {
                const Icon = avantage.icon;
                return (
                  <div
                    key={index}
                    className="min-w-[300px] md:min-w-[350px] snap-center bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border-2 border-[#9cff02] hover:border-[#5a03cf] transition-all group flex items-center gap-6"
                  >
                    <div className="w-16 h-16 min-w-[64px] rounded-2xl bg-gradient-to-br from-[#9cff02] to-[#5a03cf] flex items-center justify-center group-hover:rotate-6 transition-transform">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg text-[#5a03cf] mb-2" style={{ fontWeight: '700' }}>
                        {avantage.titre}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {avantage.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Gradient pour indiquer le scroll */}
            <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-white/50 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="relative z-10 px-6 md:px-8 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl text-[#5a03cf] mb-4 italic" style={{ fontWeight: '800' }}>
              Ils nous font confiance
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez ce que nos partenaires pensent de Match
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {temoignages.map((temoignage, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border-2 border-gray-200 hover:border-[#5a03cf] transition-all hover:scale-105"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(temoignage.note)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#9cff02] text-[#9cff02]" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic text-lg leading-relaxed">
                  &quot;{temoignage.texte}&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#9cff02] to-[#5a03cf] flex items-center justify-center text-2xl">
                    {temoignage.avatar}
                  </div>
                  <div>
                    <div className="text-gray-900" style={{ fontWeight: '700' }}>
                      {temoignage.nom}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {temoignage.restaurant}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section className="relative z-10 px-6 md:px-8 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl text-[#5a03cf] mb-4 italic" style={{ fontWeight: '800' }}>
              Une tarification simple et transparente
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choisissez la formule qui vous convient le mieux
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Mensuel */}
            <div 
              onClick={onGetStarted}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-200 overflow-hidden hover:border-[#5a03cf] transition-all hover:scale-105 cursor-pointer"
            >
              <div className="bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] text-white p-8 text-center">
                <h3 className="text-2xl mb-3 italic" style={{ fontWeight: '800' }}>
                  Mensuel
                </h3>
                <div className="mb-3">
                  <span className="text-6xl italic" style={{ fontWeight: '800' }}>30€</span>
                  <span className="text-2xl">/mois</span>
                </div>
                <p className="text-white/80">Engagement 1 an</p>
              </div>
              <div className="p-8">
                <ul className="space-y-4 mb-8">
                  {['Matchs illimités', 'Gestion des réservations', 'Support client', 'Statistiques détaillées'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-[#9cff02]" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] hover:opacity-90 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onGetStarted();
                  }}
                >
                  Choisir cette offre
                </Button>
              </div>
            </div>

            {/* Annuel */}
            <div 
              onClick={onGetStarted}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border-4 border-[#9cff02] overflow-hidden relative hover:scale-105 transition-all cursor-pointer"
            >
              <div className="absolute -top-3 -right-3 z-20">
                <div className="bg-gradient-to-r from-[#9cff02] to-[#7cdf00] text-[#5a03cf] px-6 py-2 rounded-full text-sm shadow-xl border-2 border-white" style={{ fontWeight: '800' }}>
                  ⭐ Économisez 60€
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#9cff02] to-[#7cdf00] text-[#5a03cf] p-8 text-center">
                <h3 className="text-2xl mb-3 italic" style={{ fontWeight: '800' }}>
                  Annuel
                </h3>
                <div className="mb-3 flex items-center justify-center gap-3">
                  <span className="text-3xl italic line-through opacity-50" style={{ fontWeight: '600' }}>30€</span>
                  <span className="text-6xl italic" style={{ fontWeight: '800' }}>25€</span>
                  <span className="text-2xl">/mois</span>
                </div>
                <p className="text-[#5a03cf]/80 text-lg mb-2" style={{ fontWeight: '700' }}>
                  Soit 300€/an au lieu de 360€
                </p>
                <p className="text-[#5a03cf]/70" style={{ fontWeight: '600' }}>
                  2 mois offerts !
                </p>
              </div>
              <div className="p-8">
                <ul className="space-y-4 mb-8">
                  {['Matchs illimités', 'Gestion des réservations', 'Support client', 'Statistiques détaillées'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-[#9cff02]" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-gradient-to-r from-[#9cff02] to-[#7cdf00] hover:opacity-90 text-[#5a03cf]"
                  style={{ fontWeight: '800' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onGetStarted();
                  }}
                >
                  Choisir cette offre - Meilleur choix ! 🎯
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative z-10 px-6 md:px-8 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] rounded-3xl p-12 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 right-10 w-32 h-32 border-2 border-white rounded-full"></div>
              <div className="absolute bottom-10 left-10 w-48 h-48 border-2 border-white rounded-full"></div>
            </div>
            <div className="relative z-10 text-center text-white">
              <h2 className="text-4xl md:text-5xl mb-6 italic" style={{ fontWeight: '800' }}>
                Prêt à transformer votre restaurant ? 🚀
              </h2>
              <p className="text-xl md:text-2xl mb-10 text-white/90 leading-relaxed">
                Rejoignez Match dès aujourd'hui et commencez à attirer plus de clients lors des événements sportifs
              </p>
              <Button
                onClick={onGetStarted}
                className="bg-[#9cff02] hover:bg-[#8cef00] text-[#5a03cf] shadow-xl hover:shadow-2xl transition-all h-16 px-12 text-xl group"
              >
                <span className="flex items-center gap-3" style={{ fontWeight: '800' }}>
                  Créer mon compte gratuitement
                  <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 md:px-8 py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p>© 2024 Match - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}
