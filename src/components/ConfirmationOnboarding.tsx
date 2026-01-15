import { Check } from 'lucide-react';
import { memo } from 'react';
import { PageType } from '../App';
import logoMatch from 'figma:asset/c263754cf7a254d8319da5c6945751d81a6f5a94.png';
import patternBg from 'figma:asset/20e2f150b2f5f4be01b1aec94edb580bb26d8dcf.png';

interface ConfirmationOnboardingProps {
  onNavigate: (page: PageType) => void;
  nomBar?: string;
}

export const ConfirmationOnboarding = memo(function ConfirmationOnboarding({ onNavigate, nomBar }: ConfirmationOnboardingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5a03cf]/10 via-gray-50 to-[#9cff02]/10 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Pattern de fond avec éclairs */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.05]"
        style={{
          backgroundImage: `url(${patternBg})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '400px',
        }}
      ></div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src={logoMatch} 
            alt="Match" 
            className="h-16 mx-auto"
          />
        </div>

        {/* Carte de confirmation */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-200/50 p-10 text-center">
          {/* Icône de succès */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#5a03cf] to-[#9cff02] flex items-center justify-center">
              <Check className="w-10 h-10 text-white" strokeWidth={3} />
            </div>
          </div>

          {/* Message principal */}
          <h1 className="text-4xl italic mb-3" style={{ fontWeight: '700', color: '#5a03cf' }}>
            Votre établissement est prêt
          </h1>
          
          {nomBar && (
            <p className="text-xl text-gray-700 mb-6">
              <span style={{ fontWeight: '600' }}>{nomBar}</span> est maintenant actif sur Match
            </p>
          )}

          <p className="text-lg text-gray-600 mb-8">
            Vous pouvez dès maintenant commencer à diffuser des matchs et attirer vos clients.
          </p>

          {/* Liste des prochaines étapes */}
          <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/30 mb-8 text-left">
            <h3 className="text-lg mb-4" style={{ fontWeight: '600', color: '#5a03cf' }}>
              Prochaines étapes
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#9cff02]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#5a03cf]" strokeWidth={3} />
                </div>
                <span className="text-gray-700">Programmez vos premiers matchs</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#9cff02]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#5a03cf]" strokeWidth={3} />
                </div>
                <span className="text-gray-700">Configurez les détails de votre établissement</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#9cff02]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#5a03cf]" strokeWidth={3} />
                </div>
                <span className="text-gray-700">Boostez vos matchs pour plus de visibilité</span>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="space-y-3">
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white py-4 rounded-xl hover:brightness-105 hover:scale-[1.01] transition-all shadow-sm"
              style={{ fontWeight: '600' }}
            >
              Accéder à mon tableau de bord
            </button>

            <button
              onClick={() => onNavigate('mes-lieux')}
              className="w-full py-4 rounded-xl border-2 border-[#5a03cf]/30 text-[#5a03cf] hover:bg-[#5a03cf]/5 transition-all"
              style={{ fontWeight: '600' }}
            >
              Configurer mon établissement
            </button>
          </div>
        </div>

        {/* Message de bienvenue */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Bienvenue dans l'aventure Match 🎉
          </p>
        </div>
      </div>
    </div>
  );
});