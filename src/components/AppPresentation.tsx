import { Check, MapPin, Search, Sparkles, Star, Smartphone, Navigation, Users } from 'lucide-react';
import { PageType } from '../App';
import logoMatch from 'figma:asset/c263754cf7a254d8319da5c6945751d81a6f5a94.png';
import patternBg from 'figma:asset/20e2f150b2f5f4be01b1aec94edb580bb26d8dcf.png';

interface AppPresentationProps {
  onNavigate: (page: PageType) => void;
  onBack?: () => void;
}

export function AppPresentation({ onNavigate, onBack }: AppPresentationProps) {
  const handleInstallApp = () => {
    // Simuler l'installation de l'app
    alert('Redirection vers l\'App Store / Google Play');
  };

  const scrollToHowItWorks = () => {
    const element = document.getElementById('comment-ca-marche');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5a03cf]/10 via-gray-50 to-[#9cff02]/10 relative overflow-hidden">
      {/* Pattern de fond avec éclairs */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.05]"
        style={{
          backgroundImage: `url(${patternBg})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '400px',
        }}
      ></div>

      <div className="relative z-10">
        {/* Header simple avec logo */}
        <header className="py-6 px-6 md:px-12">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <img src={logoMatch} alt="Match" className="h-10 md:h-12" />
            {onBack && (
              <button
                onClick={onBack}
                className="px-6 py-2.5 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl text-gray-700 hover:bg-white/90 transition-all"
                style={{ fontWeight: '600' }}
              >
                Retour
              </button>
            )}
          </div>
        </header>

        {/* 1️⃣ Hero principal */}
        <section className="py-16 md:py-24 px-6 md:px-12">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl italic mb-6" style={{ fontWeight: '700' }}>
              <span className="bg-gradient-to-r from-[#5a03cf] to-[#9cff02] bg-clip-text text-transparent">
                Vivez chaque match
              </span>
              <br />
              au meilleur endroit ⚡
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Découvrez les bars et restaurants qui diffusent vos matchs préférés, en temps réel.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleInstallApp}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white rounded-xl hover:brightness-105 hover:scale-[1.02] transition-all shadow-lg text-lg"
                style={{ fontWeight: '600' }}
              >
                📲 Installer l'application
              </button>

              <button
                onClick={scrollToHowItWorks}
                className="w-full sm:w-auto px-8 py-4 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-xl text-gray-700 hover:bg-white/90 transition-all text-lg"
                style={{ fontWeight: '600' }}
              >
                Découvrir comment ça marche
              </button>
            </div>
          </div>
        </section>

        {/* 2️⃣ Bloc "Pourquoi Match ?" */}
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl italic text-center mb-12" style={{ fontWeight: '700', color: '#5a03cf' }}>
              Pourquoi Match ?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Carte 1 */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 hover:scale-[1.02] transition-transform">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 flex items-center justify-center mb-4">
                  <Search className="w-7 h-7 text-[#5a03cf]" />
                </div>
                <h3 className="text-xl mb-3" style={{ fontWeight: '600' }}>
                  Trouvez où regarder votre match
                </h3>
                <p className="text-gray-600">
                  Tous les bars qui diffusent votre match, au même endroit
                </p>
              </div>

              {/* Carte 2 */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 hover:scale-[1.02] transition-transform">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-7 h-7 text-[#5a03cf]" />
                </div>
                <h3 className="text-xl mb-3" style={{ fontWeight: '600' }}>
                  Infos en temps réel
                </h3>
                <p className="text-gray-600">
                  Programmation à jour, places disponibles, ambiance live
                </p>
              </div>

              {/* Carte 3 */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 hover:scale-[1.02] transition-transform">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 flex items-center justify-center mb-4">
                  <Users className="w-7 h-7 text-[#5a03cf]" />
                </div>
                <h3 className="text-xl mb-3" style={{ fontWeight: '600' }}>
                  Ambiance garantie
                </h3>
                <p className="text-gray-600">
                  Des lieux sélectionnés pour vivre le match à fond
                </p>
              </div>

              {/* Carte 4 */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 hover:scale-[1.02] transition-transform">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 flex items-center justify-center mb-4">
                  <Star className="w-7 h-7 text-[#5a03cf]" />
                </div>
                <h3 className="text-xl mb-3" style={{ fontWeight: '600' }}>
                  Lieux recommandés
                </h3>
                <p className="text-gray-600">
                  Avis et notations pour choisir le meilleur spot
                </p>
              </div>

              {/* Carte 5 */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 hover:scale-[1.02] transition-transform">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 flex items-center justify-center mb-4">
                  <MapPin className="w-7 h-7 text-[#5a03cf]" />
                </div>
                <h3 className="text-xl mb-3" style={{ fontWeight: '600' }}>
                  Autour de vous
                </h3>
                <p className="text-gray-600">
                  Géolocalisation pour trouver les bars les plus proches
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3️⃣ Bloc "Comment ça marche ?" */}
        <section id="comment-ca-marche" className="py-16 px-6 md:px-12 scroll-mt-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl italic text-center mb-16" style={{ fontWeight: '700', color: '#5a03cf' }}>
              Comment ça marche ?
            </h2>

            <div className="space-y-8">
              {/* Étape 1 */}
              <div className="flex items-start gap-6 bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#5a03cf] to-[#9cff02] flex items-center justify-center flex-shrink-0 text-white text-2xl" style={{ fontWeight: '700' }}>
                  1
                </div>
                <div>
                  <h3 className="text-2xl mb-2" style={{ fontWeight: '600' }}>
                    📲 Téléchargez l'app
                  </h3>
                  <p className="text-lg text-gray-600">
                    Disponible gratuitement sur iOS et Android
                  </p>
                </div>
              </div>

              {/* Étape 2 */}
              <div className="flex items-start gap-6 bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#5a03cf] to-[#9cff02] flex items-center justify-center flex-shrink-0 text-white text-2xl" style={{ fontWeight: '700' }}>
                  2
                </div>
                <div>
                  <h3 className="text-2xl mb-2" style={{ fontWeight: '600' }}>
                    ⚽ Choisissez votre match
                  </h3>
                  <p className="text-lg text-gray-600">
                    Parcourez les matchs du jour ou recherchez votre équipe préférée
                  </p>
                </div>
              </div>

              {/* Étape 3 */}
              <div className="flex items-start gap-6 bg-white/70 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#5a03cf] to-[#9cff02] flex items-center justify-center flex-shrink-0 text-white text-2xl" style={{ fontWeight: '700' }}>
                  3
                </div>
                <div>
                  <h3 className="text-2xl mb-2" style={{ fontWeight: '600' }}>
                    🍺 Trouvez le meilleur lieu
                  </h3>
                  <p className="text-lg text-gray-600">
                    Découvrez les bars autour de vous et réservez votre place
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4️⃣ Aperçu de l'application */}
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl italic text-center mb-16" style={{ fontWeight: '700', color: '#5a03cf' }}>
              L'application Match
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Mockup 1 - Liste des matchs */}
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50">
                <div className="aspect-[9/16] bg-gradient-to-br from-[#5a03cf]/5 to-[#9cff02]/5 rounded-2xl flex items-center justify-center border border-gray-200/30">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 flex items-center justify-center">
                      <Navigation className="w-8 h-8 text-[#5a03cf]" />
                    </div>
                    <p className="text-gray-600" style={{ fontWeight: '600' }}>
                      Liste des matchs
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Tous les matchs en cours et à venir
                    </p>
                  </div>
                </div>
              </div>

              {/* Mockup 2 - Fiche lieu */}
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50">
                <div className="aspect-[9/16] bg-gradient-to-br from-[#5a03cf]/5 to-[#9cff02]/5 rounded-2xl flex items-center justify-center border border-gray-200/30">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 flex items-center justify-center">
                      <Star className="w-8 h-8 text-[#5a03cf]" />
                    </div>
                    <p className="text-gray-600" style={{ fontWeight: '600' }}>
                      Fiche lieu
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Infos, photos, avis et réservation
                    </p>
                  </div>
                </div>
              </div>

              {/* Mockup 3 - Carte */}
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50">
                <div className="aspect-[9/16] bg-gradient-to-br from-[#5a03cf]/5 to-[#9cff02]/5 rounded-2xl flex items-center justify-center border border-gray-200/30">
                  <div className="text-center p-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-[#5a03cf]" />
                    </div>
                    <p className="text-gray-600" style={{ fontWeight: '600' }}>
                      Carte interactive
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Tous les bars sur une carte
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5️⃣ Bloc "Pour qui ?" */}
        <section className="py-16 px-6 md:px-12">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl italic text-center mb-12" style={{ fontWeight: '700', color: '#5a03cf' }}>
              Pour qui ?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 flex items-center gap-4">
                <Check className="w-6 h-6 text-[#5a03cf] flex-shrink-0" />
                <p className="text-lg text-gray-700">
                  Fans de sport passionnés
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 flex items-center gap-4">
                <Check className="w-6 h-6 text-[#5a03cf] flex-shrink-0" />
                <p className="text-lg text-gray-700">
                  Groupes d'amis
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 flex items-center gap-4">
                <Check className="w-6 h-6 text-[#5a03cf] flex-shrink-0" />
                <p className="text-lg text-gray-700">
                  Soirées match inoubliables
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 flex items-center gap-4">
                <Check className="w-6 h-6 text-[#5a03cf] flex-shrink-0" />
                <p className="text-lg text-gray-700">
                  Découverte de nouveaux bars
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6️⃣ CTA final */}
        <section className="py-20 px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-12 border border-gray-200/50">
              <h2 className="text-4xl md:text-5xl italic mb-6" style={{ fontWeight: '700', color: '#5a03cf' }}>
                Prêt à vivre les matchs autrement ? 🚀
              </h2>

              <p className="text-xl text-gray-600 mb-8">
                Rejoignez des milliers de fans qui utilisent Match
              </p>

              <button
                onClick={handleInstallApp}
                className="px-12 py-5 bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white rounded-xl hover:brightness-105 hover:scale-[1.02] transition-all shadow-lg text-xl mb-4"
                style={{ fontWeight: '600' }}
              >
                Installer l'application Match
              </button>

              <p className="text-sm text-gray-500">
                Disponible gratuitement
              </p>
            </div>
          </div>
        </section>

        {/* CTA Sticky mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-gray-200/50 z-50">
          <button
            onClick={handleInstallApp}
            className="w-full px-6 py-4 bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white rounded-xl hover:brightness-105 transition-all shadow-lg"
            style={{ fontWeight: '600' }}
          >
            📲 Installer l'application
          </button>
        </div>
      </div>
    </div>
  );
}
