import { Check, Sparkles, Calendar, Settings } from 'lucide-react';
import { PageType } from '../../../types';
// import logoMatch from 'figma:asset/c263754cf7a254d8319da5c6945751d81a6f5a94.png';
import logoMatch from '../../../../assets/logo.png';

interface ConfirmationOnboardingProps {
  onNavigate: (page: PageType) => void;
  nomBar?: string;
  isAddingVenue?: boolean; // True when adding from "Mes lieux" (redirects back there)
}

export function ConfirmationOnboarding({ onNavigate, nomBar, isAddingVenue = false }: ConfirmationOnboardingProps) {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5a03cf]/5 dark:bg-[#5a03cf]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#9cff02]/5 dark:bg-[#9cff02]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5a03cf]/3 dark:bg-[#5a03cf]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <img 
            src={logoMatch} 
            alt="Match" 
            className="h-12 sm:h-16 mx-auto dark:brightness-150"
            style={{ filter: 'brightness(0) saturate(100%) invert(13%) sepia(91%) saturate(6297%) hue-rotate(268deg) brightness(83%) contrast(122%)' }}
          />
        </div>

        {/* Carte de confirmation */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-10 text-center">
          {/* Icône de succès */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 dark:from-[#5a03cf]/20 dark:to-[#9cff02]/20 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#5a03cf] to-[#9cff02] flex items-center justify-center">
                  <Check className="w-8 h-8 text-white" strokeWidth={3} />
                </div>
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-6 h-6 text-[#9cff02] animate-pulse" />
              </div>
            </div>
          </div>

          {/* Message principal */}
          <h1 className="text-3xl sm:text-4xl mb-3 text-gray-900 dark:text-white">
            Votre établissement est prêt
          </h1>
          
          {nomBar && (
            <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 mb-6">
              <span className="font-medium text-[#5a03cf] dark:text-[#7a23ef]">{nomBar}</span> est maintenant actif sur Match
            </p>
          )}

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Vous pouvez dès maintenant commencer à diffuser des matchs et attirer vos clients.
          </p>

          {/* Liste des prochaines étapes */}
          <div className="bg-gradient-to-br from-[#5a03cf]/5 to-[#9cff02]/5 dark:from-[#5a03cf]/10 dark:to-[#9cff02]/10 backdrop-blur-sm rounded-xl p-5 sm:p-6 border border-[#5a03cf]/20 dark:border-[#5a03cf]/30 mb-8 text-left">
            <h3 className="text-lg mb-4 text-[#5a03cf] dark:text-[#7a23ef] flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Prochaines étapes
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#9cff02]/20 dark:bg-[#9cff02]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-[#5a03cf] dark:text-[#7a23ef]" strokeWidth={3} />
                </div>
                <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Programmez vos premiers matchs</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#9cff02]/20 dark:bg-[#9cff02]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-[#5a03cf] dark:text-[#7a23ef]" strokeWidth={3} />
                </div>
                <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Configurez les détails de votre établissement</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#9cff02]/20 dark:bg-[#9cff02]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-[#5a03cf] dark:text-[#7a23ef]" strokeWidth={3} />
                </div>
                <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Boostez vos matchs pour plus de visibilité</span>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="space-y-3">
            <button
              onClick={() => onNavigate(isAddingVenue ? 'mes-restaurants' : 'dashboard')}
              className="w-full py-4 bg-[#5a03cf] text-white rounded-xl hover:bg-[#4a02af] transition-all duration-200 shadow-lg shadow-[#5a03cf]/20 hover:scale-[1.01]"
            >
              {isAddingVenue ? 'Retour à mes établissements' : 'Accéder à mon tableau de bord'}
            </button>

            {!isAddingVenue && (
              <button
                onClick={() => onNavigate('mes-restaurants')}
                className="w-full py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
              >
                <Settings className="w-5 h-5" />
                Configurer mon établissement
              </button>
            )}
          </div>
        </div>

        {/* Message de bienvenue */}
        <div className="text-center mt-8">
          <p className="text-gray-600 dark:text-gray-400">
            Bienvenue dans l'aventure Match 🎉
          </p>
        </div>
      </div>
    </div>
  );
}
