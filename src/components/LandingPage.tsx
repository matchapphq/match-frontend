import { ArrowRight, Zap, Users, TrendingUp, Star, Check, Sparkles, Calendar, BarChart3, Quote, DollarSign, Share2, ChevronDown, Smartphone } from 'lucide-react';
import { Button } from './ui/button';
import logoMatch from 'figma:asset/c263754cf7a254d8319da5c6945751d81a6f5a94.png';
import patternBg from 'figma:asset/20e2f150b2f5f4be01b1aec94edb580bb26d8dcf.png';
import { useState, useEffect, useRef } from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
  onReferral?: () => void;
  onAppPresentation?: () => void;
  onNavigateLegal?: (page:
    | 'confidentialite'
    | 'cookies'
    | 'conditions'
    | 'ventes-remboursements'
    | 'mentions-legales'
    | 'plan-du-site'
  ) => void;
}

export function LandingPage({ onGetStarted, onReferral, onAppPresentation, onNavigateLegal }: LandingPageProps) {
  const footerRef = useRef<HTMLElement | null>(null);
  const [dockAboveFooter, setDockAboveFooter] = useState(false);


  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Dès que le footer est visible, on dock le bouton au-dessus
        setDockAboveFooter(entry.isIntersecting);
      },
      {
        // un peu de marge pour anticiper (ajuste si besoin)
        root: null,
        threshold: 0.01,
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);


  const avantages = [
    {
      chiffre: '+5K',
      label: 'utilisateurs sur l\'application'
    },
    {
      chiffre: '+100',
      label: 'établissements partenaires'
    },
    {
      chiffre: '+10',
      label: 'villes où Match est présent'
    }
  ];

  const casUsage = [
    {
      titre: 'Publier ses matchs à l\'avance',
      description: 'Les établissements annoncent leurs matchs pour apparaître auprès des fans qui organisent leur soirée.',
      icone: Calendar
    },
    {
      titre: 'Mettre en avant les matchs clés',
      description: 'Les restaurateurs peuvent booster certains matchs pour gagner en visibilité lors des grands événements.',
      icone: Zap
    },
    {
      titre: 'Suivre l\'intérêt des fans',
      description: 'Les statistiques permettent de voir quels matchs génèrent le plus d\'attention.',
      icone: BarChart3
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
      {/* Pattern de fond avec éclairs */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.08]"
        style={{
          backgroundImage: `url(${patternBg})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '400px',
          filter: 'hue-rotate(230deg) saturate(2.5) brightness(0.6)',
        }}
      ></div>

      {/* Éléments décoratifs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#9cff02]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#5a03cf]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Header sticky */}
      <header className="fixed top-0 left-0 right-0 z-50 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center bg-gradient-to-r from-[#5a03cf]/5 via-white/10 to-[#9cff02]/5 backdrop-blur-2xl border-2 border-black/15 rounded-3xl px-6 py-4 shadow-2xl">
            {/* Bouton parrainage à gauche */}
            <div className="relative p-[2px] rounded-full bg-gradient-to-r from-[#9cff02] to-[#5a03cf]">
              <button
                onClick={onReferral}
                className="px-4 py-2 bg-white backdrop-blur-xl rounded-full text-gray-900 hover:bg-white/90 hover:text-[#5a03cf] transition-all text-sm"
                style={{ fontWeight: '600' }}
              >
                <span className="hidden sm:inline">Parrainer un lieu</span>
                <span className="sm:hidden">Parrainer</span>
              </button>
            </div>

            {/* Logo centré en violet */}
            <img 
              src={logoMatch} 
              alt="Match" 
              className="h-12 absolute left-1/2 transform -translate-x-1/2"
              style={{ filter: 'brightness(0) saturate(100%) invert(13%) sepia(91%) saturate(6297%) hue-rotate(268deg) brightness(83%) contrast(122%)' }}
            />

            {/* Bouton connexion à droite */}
            <div className="relative p-[2px] rounded-full bg-gradient-to-r from-[#9cff02] to-[#5a03cf]">
              <button
                onClick={onGetStarted}
                className="px-4 py-2 bg-white backdrop-blur-xl rounded-full text-gray-900 hover:bg-white/90 hover:text-[#5a03cf] transition-all text-sm"
                style={{ fontWeight: '600' }}
              >
                Je me connecte
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 md:px-8 py-2 md:py-4 mb-2 mt-32">{/* mt-32 pour compenser le header fixe */}
        <div className="max-w-6xl mx-auto">
          {/* Wrapper avec bordure dégradée et fond blanc */}
          <div className="relative p-[3px] rounded-3xl bg-gradient-to-r from-[#9cff02] to-[#5a03cf] overflow-hidden shadow-2xl">
            {/* Image de fond avec flou */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1742415105376-43d3a5fd03fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXAlMjB3b3JsZCUyMGdlb2dyYXBoeXxlbnwxfHx8fDE3NjcwODkwNjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Carte du monde"
                className="w-full h-full object-cover opacity-100"
                style={{ filter: 'blur(3px)' }}
              />
              {/* Overlay dégradé pour adoucir */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/40 to-white/50"></div>
            </div>
            
            <div className="relative bg-white/15 backdrop-blur-md rounded-3xl p-4 md:p-6">
              <div className="relative py-6 md:py-8">
                <div className="text-center px-4 w-full">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-3 italic leading-tight drop-shadow-md" style={{ fontWeight: '800' }}>
                    Donnez plus de visibilité à vos matchs<br /><span style={{ color: '#90d436' }}>et attirez plus de clients</span>
                  </h1>

                  <p className="text-lg md:text-xl text-gray-800 mb-6 max-w-2xl mx-auto leading-relaxed drop-shadow-md" style={{ fontWeight: '600' }}>
                    Rejoignez des milliers de fans qui n'attendent que vous pour les meilleures soirées matchs possible ⚡️
                  </p>

                  <div className="flex justify-center">
                    <div className="relative p-[2px] rounded-full bg-gradient-to-r from-[#9cff02] to-[#5a03cf]">
                      <button
                        onClick={onGetStarted}
                        className="bg-white/90 backdrop-blur-xl rounded-full px-10 h-14 text-base text-gray-900 hover:bg-white hover:text-[#5a03cf] transition-all shadow-xl hover:shadow-2xl group flex items-center gap-3"
                        style={{ fontWeight: '700' }}
                      >
                        Découvrir Match pour mon restaurant
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section id="avantages" className="relative z-10 px-6 md:px-8 py-8 md:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Flèche indicatrice de scroll */}
          <div className="flex justify-center mb-12 -mt-4">
            <button 
              onClick={() => {
                document.getElementById('avantages-content')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="animate-bounce hover:scale-110 transition-transform cursor-pointer bg-gradient-to-r from-[#9cff02] to-[#5a03cf] p-3 rounded-full shadow-xl"
            >
              <ChevronDown className="w-12 h-12 text-white" strokeWidth={3} />
            </button>
          </div>
          
          <div id="avantages-content" className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl text-[#5a03cf] mb-4 italic" style={{ fontWeight: '800' }}>
              Pourquoi les restaurateurs utilisent Match ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une plateforme déjà utilisée par des fans et des établissements partout en France
            </p>
          </div>

          {/* Grid des statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {avantages.map((avantage, index) => {
              return (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border-2 border-[#9cff02] hover:border-[#5a03cf] transition-all group hover:scale-105 text-center"
                >
                  <div className="mb-4">
                    <h3 
                      className="text-6xl md:text-7xl italic mb-2 bg-gradient-to-r from-[#9cff02] to-[#5a03cf] bg-clip-text text-transparent" 
                      style={{ fontWeight: '800' }}
                    >
                      {avantage.chiffre}
                    </h3>
                  </div>
                  <p className="text-gray-700 text-lg" style={{ fontWeight: '600' }}>
                    {avantage.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cas d'utilisation */}
      <section className="relative z-10 px-6 md:px-8 py-12 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl text-[#5a03cf] mb-4 italic" style={{ fontWeight: '800' }}>
              Comment les restaurateurs utilisent Match
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des usages simples pour rendre les matchs visibles et attirer plus de fans.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
            {casUsage.map((cas, index) => {
              const IconeComponent = cas.icone;
              return (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl border-2 border-gray-200 hover:border-[#5a03cf] transition-all hover:scale-105"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#9cff02] to-[#5a03cf] flex items-center justify-center flex-shrink-0">
                      <IconeComponent className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 text-2xl mb-3 italic" style={{ fontWeight: '700' }}>
                        {cas.titre}
                      </h3>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {cas.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative z-10 px-6 md:px-8 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Wrapper avec bordure dégradée */}
          <div className="relative p-[3px] rounded-3xl bg-gradient-to-r from-[#9cff02] to-[#5a03cf] overflow-hidden shadow-lg">
            {/* Conteneur principal avec fond blanc */}
            <div className="relative bg-white rounded-3xl p-12 md:p-16 overflow-hidden">
              {/* Éléments décoratifs doux */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 right-10 w-32 h-32 border border-[#5a03cf]/30 rounded-full"></div>
                <div className="absolute bottom-10 left-10 w-48 h-48 border border-[#9cff02]/30 rounded-full"></div>
              </div>

              {/* Contenu */}
              <div className="relative z-10 text-center">
                <h2 className="text-3xl md:text-4xl mb-4 italic text-[#5a03cf]/90" style={{ fontWeight: '700' }}>
                  Prêt à attirer plus de fans les soirs de match ?
                </h2>
                
                <p className="text-lg md:text-xl mb-8 text-gray-700/80 leading-relaxed max-w-2xl mx-auto">
                  Publiez vos matchs en quelques minutes et gagnez en visibilité.
                </p>

                {/* Bouton avec style liquid glass */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative p-[1.5px] rounded-full bg-gradient-to-r from-[#9cff02]/40 to-[#5a03cf]/40">
                    <button
                      onClick={onGetStarted}
                      className="bg-white/90 backdrop-blur-xl rounded-full px-10 py-4 text-gray-900 hover:bg-white hover:shadow-xl transition-all group flex items-center gap-3"
                      style={{ fontWeight: '600' }}
                    >
                      Créer mon compte restaurateur
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                  
                  {/* Pricing discret */}
                  <p className="text-sm text-gray-500/80">
                    30 € / mois – sans engagement
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        ref={footerRef}
        className="relative z-10 px-6 md:px-8 py-12 border-t border-gray-300/60 bg-white/20 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-gray-700 mb-4" style={{ fontWeight: '600' }}>
              Copyright © 2025 Match SAS • Tous droits réservés.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-gray-600">
              <button
                onClick={() => onNavigateLegal?.('confidentialite')}
                className="hover:text-[#5a03cf] transition-colors"
              >
                Engagement de confidentialité
              </button>
              <span className="hidden md:inline text-gray-400">•</span>
              <button
                onClick={() => onNavigateLegal?.('cookies')}
                className="hover:text-[#5a03cf] transition-colors"
              >
                Utilisation des cookies
              </button>
              <span className="hidden md:inline text-gray-400">•</span>
              <button
                onClick={() => onNavigateLegal?.('conditions')}
                className="hover:text-[#5a03cf] transition-colors"
              >
                Conditions d'utilisation
              </button>
              <span className="hidden md:inline text-gray-400">•</span>
              <button
                onClick={() => onNavigateLegal?.('ventes-remboursements')}
                className="hover:text-[#5a03cf] transition-colors"
              >
                Ventes et remboursements
              </button>
              <span className="hidden md:inline text-gray-400">•</span>
              <button
                onClick={() => onNavigateLegal?.('mentions-legales')}
                className="hover:text-[#5a03cf] transition-colors"
              >
                Mentions légales
              </button>
              <span className="hidden md:inline text-gray-400">•</span>
              <button
                onClick={() => onNavigateLegal?.('plan-du-site')}
                className="hover:text-[#5a03cf] transition-colors"
              >
                Plan du site
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Bouton flottant installation app */}
      <div
        className={
          dockAboveFooter
            ? "absolute right-6 z-50" 
            : "fixed bottom-6 right-6 z-50"
        }
        style={
          dockAboveFooter
            ? { bottom: 180 }
            : undefined
        }
      >
        <div className="relative p-[2px] rounded-2xl bg-gradient-to-r from-[#9cff02] to-[#5a03cf] shadow-2xl">
          <button
            onClick={() => {
              window.scrollTo({ top: 0 });
              if (onAppPresentation) {
                onAppPresentation();
              } else {
                alert("Installation de l'application Match");
              }
            }}
            className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3 hover:bg-white/95 transition-all group cursor-pointer"
          >
            <div className="bg-gradient-to-r from-[#9cff02] to-[#5a03cf] p-2 rounded-full">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-500">Cliquez ici pour</p>
              <p className="text-sm text-gray-900" style={{ fontWeight: '700' }}>
                Installer l'application
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}