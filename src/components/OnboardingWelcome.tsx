import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { PageType } from '../App';
import logoMatch from 'figma:asset/c263754cf7a254d8319da5c6945751d81a6f5a94.png';

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
          description: 'Choisissez votre formule d\'abonnement pour activer votre compte',
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Éléments décoratifs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#9cff02]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#5a03cf]/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5a03cf]/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-4xl">
        <div className="text-center space-y-8">
          {/* Logo Match */}
          <div className="flex justify-center mb-8">
            <img 
              src={logoMatch} 
              alt="Match" 
              className="h-32 md:h-40"
            />
          </div>

          {/* Message principal */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl text-[#5a03cf] italic tracking-tight leading-tight" style={{ fontWeight: '800' }}>
              Rejoignez l'aventure Match
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              et proposez des matchs à toute la ville
            </p>
          </div>

          {/* Carte de progression */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 max-w-2xl mx-auto mt-12">
            <div className="space-y-6">
              {/* Salutation personnalisée */}
              <div className="text-center">
                <div className="text-6xl mb-4">
                  👋
                </div>
                <h2 className="text-3xl text-[#5a03cf] mb-2">
                  Bienvenue <span className="text-[#9cff02]">{userName}</span> !
                </h2>
                <p className="text-gray-600 text-lg">
                  Vous êtes à quelques étapes de votre premier match
                </p>
              </div>

              {/* Barre de progression */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progression de votre inscription</span>
                  <span className="text-[#5a03cf]">{stepInfo.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#9cff02] to-[#5a03cf] rounded-full transition-all duration-500"
                    style={{ width: `${stepInfo.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Prochaine étape */}
              <div className="bg-gradient-to-r from-[#9cff02]/10 to-[#5a03cf]/10 rounded-2xl p-6 border-2 border-[#5a03cf]/20">
                <h3 className="text-xl text-[#5a03cf] mb-2">
                  Prochaine étape : {stepInfo.title}
                </h3>
                <p className="text-gray-600">
                  {stepInfo.description}
                </p>
              </div>

              {/* Bouton d'action */}
              <Button
                onClick={() => onContinue(stepInfo.page)}
                className="w-full bg-gradient-to-r from-[#9cff02] to-[#5a03cf] hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300 h-14 text-lg"
              >
                <span className="flex items-center justify-center gap-3">
                  {stepInfo.buttonText}
                  <ArrowRight className="w-6 h-6" />
                </span>
              </Button>

              {/* Liste des étapes */}
              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-3">Étapes restantes :</p>
                <div className="space-y-2">
                  <div className={`flex items-center gap-3 p-3 rounded-xl ${currentStep === 'restaurant' ? 'bg-[#5a03cf]/10 border border-[#5a03cf]/30' : 'bg-gray-50'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'restaurant' ? 'bg-[#5a03cf] text-white' : 'bg-gray-300 text-gray-600'}`}>
                      1
                    </div>
                    <span className={currentStep === 'restaurant' ? 'text-[#5a03cf]' : 'text-gray-400 line-through'}>
                      Ajouter votre restaurant
                    </span>
                  </div>
                  <div className={`flex items-center gap-3 p-3 rounded-xl ${currentStep === 'facturation' ? 'bg-[#5a03cf]/10 border border-[#5a03cf]/30' : 'bg-gray-50'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'facturation' ? 'bg-[#5a03cf] text-white' : 'bg-gray-300 text-gray-600'}`}>
                      2
                    </div>
                    <span className={currentStep === 'facturation' ? 'text-[#5a03cf]' : currentStep === 'complete' ? 'text-gray-400 line-through' : 'text-gray-500'}>
                      Choisir votre formule d'abonnement
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-300 text-gray-600">
                      3
                    </div>
                    <span className="text-gray-500">
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