import { ArrowRight, Sparkles, Building2, CreditCard, Rocket } from 'lucide-react';
import { PageType } from '../../types';
// import logoMatch from 'figma:asset/c263754cf7a254d8319da5c6945751d81a6f5a94.png';
import logoMatch from '../../../assets/logo.png';

interface OnboardingWelcomeProps {
  onContinue: (page: PageType) => void;
  currentStep: 'restaurant' | 'facturation' | 'complete';
  userName: string;
}

export function OnboardingWelcome({ onContinue, currentStep, userName }: OnboardingWelcomeProps) {
  const getStepInfo = () => {
    switch (currentStep) {
      case 'restaurant':
        return {
          title: 'Équipez votre restaurant',
          description: 'Ajoutez votre premier établissement pour commencer à diffuser des matchs',
          buttonText: 'Ajouter mon restaurant',
          page: 'ajouter-restaurant' as PageType,
          progress: 33
        };
      case 'facturation':
        return {
          title: 'Finalisez votre inscription',
          description: "Choisissez votre formule d'abonnement pour activer votre compte",
          buttonText: 'Choisir ma formule',
          page: 'facturation' as PageType,
          progress: 66
        };
      default:
        return {
          title: 'Bienvenue',
          description: 'Commencez votre aventure',
          buttonText: 'Continuer',
          page: 'dashboard' as PageType,
          progress: 100
        };
    }
  };

  const stepInfo = getStepInfo();

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#9cff02]/5 dark:bg-[#9cff02]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#5a03cf]/5 dark:bg-[#5a03cf]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5a03cf]/3 dark:bg-[#5a03cf]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <div className="text-center space-y-8">
          {/* Logo Match */}
          <div className="flex justify-center mb-8">
            <img 
              src={logoMatch} 
              alt="Match" 
              className="h-24 md:h-32 dark:brightness-150"
              style={{ filter: 'brightness(0) saturate(100%) invert(13%) sepia(91%) saturate(6297%) hue-rotate(268deg) brightness(83%) contrast(122%)' }}
            />
          </div>

          {/* Message principal */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-gray-900 dark:text-white tracking-tight leading-tight">
              Rejoignez l'aventure <span className="text-[#5a03cf] dark:text-[#7a23ef]">Match</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              et proposez des matchs à toute la ville
            </p>
          </div>

          {/* Carte de progression */}
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 border border-gray-200/50 dark:border-gray-700/50 max-w-2xl mx-auto mt-12">
            <div className="space-y-6">
              {/* Salutation personnalisée */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 dark:from-[#5a03cf]/20 dark:to-[#9cff02]/20 mb-4">
                  <Sparkles className="w-8 h-8 text-[#5a03cf] dark:text-[#7a23ef]" />
                </div>
                <h2 className="text-2xl sm:text-3xl text-gray-900 dark:text-white mb-2">
                  Bienvenue {userName} ! 👋
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Vous êtes à quelques étapes de votre premier match
                </p>
              </div>

              {/* Barre de progression */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Progression de votre inscription</span>
                  <span className="text-[#5a03cf] dark:text-[#7a23ef] font-medium">{stepInfo.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#5a03cf] to-[#9cff02] rounded-full transition-all duration-500"
                    style={{ width: `${stepInfo.progress}%` }}
                  />
                </div>
              </div>

              {/* Prochaine étape */}
              <div className="bg-gradient-to-br from-[#5a03cf]/5 to-[#9cff02]/5 dark:from-[#5a03cf]/10 dark:to-[#9cff02]/10 rounded-xl p-5 border border-[#5a03cf]/20 dark:border-[#5a03cf]/30">
                <h3 className="text-lg text-[#5a03cf] dark:text-[#7a23ef] mb-2">
                  Prochaine étape : {stepInfo.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {stepInfo.description}
                </p>
              </div>

              {/* Bouton d'action */}
              <button
                onClick={() => onContinue(stepInfo.page)}
                className="w-full py-4 bg-[#5a03cf] text-white rounded-xl hover:bg-[#4a02af] transition-all duration-200 shadow-lg shadow-[#5a03cf]/20 hover:scale-[1.01] flex items-center justify-center gap-3"
              >
                <span>{stepInfo.buttonText}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Liste des étapes */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Étapes restantes :</p>
                <div className="space-y-2">
                  <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    currentStep === 'restaurant' 
                      ? 'bg-[#5a03cf]/10 dark:bg-[#5a03cf]/20 border border-[#5a03cf]/30 dark:border-[#5a03cf]/40' 
                      : 'bg-gray-50 dark:bg-gray-800/50 border border-transparent'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      currentStep === 'restaurant' 
                        ? 'bg-[#5a03cf] text-white' 
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {currentStep === 'restaurant' ? '1' : <Building2 className="w-4 h-4" />}
                    </div>
                    <span className={`text-sm ${
                      currentStep === 'restaurant' 
                        ? 'text-[#5a03cf] dark:text-[#7a23ef] font-medium' 
                        : 'text-gray-400 dark:text-gray-500 line-through'
                    }`}>
                      Ajouter votre restaurant
                    </span>
                  </div>
                  
                  <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    currentStep === 'facturation' 
                      ? 'bg-[#5a03cf]/10 dark:bg-[#5a03cf]/20 border border-[#5a03cf]/30 dark:border-[#5a03cf]/40' 
                      : 'bg-gray-50 dark:bg-gray-800/50 border border-transparent'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      currentStep === 'facturation' 
                        ? 'bg-[#5a03cf] text-white' 
                        : currentStep === 'complete' 
                          ? 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {currentStep === 'facturation' ? '2' : <CreditCard className="w-4 h-4" />}
                    </div>
                    <span className={`text-sm ${
                      currentStep === 'facturation' 
                        ? 'text-[#5a03cf] dark:text-[#7a23ef] font-medium' 
                        : currentStep === 'complete' 
                          ? 'text-gray-400 dark:text-gray-500 line-through' 
                          : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      Choisir votre formule d'abonnement
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-transparent">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 flex-shrink-0">
                      <Rocket className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Commencer à diffuser des matchs !
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}