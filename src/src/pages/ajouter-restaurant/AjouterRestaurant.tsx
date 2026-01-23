import { ArrowLeft, MapPin, Phone, Mail, Users, Clock, Save, Upload } from 'lucide-react';
import { PageType } from '../../types';
import { useAuth } from '../../features/authentication/context/AuthContext';
import logoMatch from 'figma:asset/c263754cf7a254d8319da5c6945751d81a6f5a94.png';
import patternBg from 'figma:asset/20e2f150b2f5f4be01b1aec94edb580bb26d8dcf.png';
import { useState } from 'react';

interface AjouterRestaurantProps {
  onBack: () => void;
  onNavigate: (page: PageType) => void;
  isOnboarding?: boolean;
  onFormuleSelected?: (formule: 'mensuel' | 'annuel') => void;
}

export function AjouterRestaurant({ onBack, onNavigate, isOnboarding = false, onFormuleSelected }: AjouterRestaurantProps) {
  const { updateOnboardingStep } = useAuth();
  const [selectedFormule, setSelectedFormule] = useState<'mensuel' | 'annuel' | null>(null);

  const handleChoisirOffre = (type: 'mensuel' | 'annuel') => {
    setSelectedFormule(type);
    
    // Notifier le parent de la formule sélectionnée
    if (onFormuleSelected) {
      onFormuleSelected(type);
    }
    
    // Simuler la validation
    setTimeout(() => {
      if (isOnboarding) {
        updateOnboardingStep('facturation');
      }
      onNavigate('infos-etablissement' as PageType);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
      {/* Header avec retour */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#5a03cf] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </button>
            
            <img 
              src={logoMatch} 
              alt="Match" 
              className="h-8"
              style={{ filter: 'brightness(0) saturate(100%) invert(13%) sepia(91%) saturate(6297%) hue-rotate(268deg) brightness(83%) contrast(122%)' }}
            />
            
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-full mb-6">
            <div className="w-2 h-2 bg-[#9cff02] rounded-full animate-pulse" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Sélection de formule</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-4">
            Choisissez votre{' '}
            <span className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
              formule
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2 max-w-2xl mx-auto">
            Chaque établissement dispose de son propre abonnement
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Vous pourrez ajouter d'autres établissements plus tard
          </p>
        </div>

        {/* Choix de la formule */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Carte Mensuel */}
          <div className="relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 hover:border-[#5a03cf]/30 transition-all duration-300">
            <div className="mb-6">
              <h2 className="text-2xl mb-2 text-gray-900 dark:text-white">
                Mensuel
              </h2>
              <div className="mb-1">
                <span className="text-4xl bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
                  30€
                </span>
                <span className="text-gray-600 dark:text-gray-400 text-lg"> / mois</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-500">Sans engagement</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#9cff02] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#1a1a1a]" strokeWidth={3} />
                </div>
                <span className="text-gray-700 dark:text-gray-300">Facturation mensuelle</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#9cff02] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#1a1a1a]" strokeWidth={3} />
                </div>
                <span className="text-gray-700 dark:text-gray-300">Tous les avantages Match</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#9cff02] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#1a1a1a]" strokeWidth={3} />
                </div>
                <span className="text-gray-700 dark:text-gray-300">Sans engagement - Résiliable à tout moment</span>
              </div>
            </div>

            <button
              onClick={() => handleChoisirOffre('mensuel')}
              disabled={selectedFormule !== null}
              className="relative w-full py-4 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl text-[#5a03cf] dark:text-[#7a23ef] hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all duration-200 gradient-border disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {selectedFormule === 'mensuel' ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-[#5a03cf]/30 border-t-[#5a03cf] rounded-full animate-spin"></div>
                  Validation...
                </span>
              ) : (
                'Choisir cette formule'
              )}
            </button>
          </div>

          {/* Carte Annuel (recommandée) */}
          <div className="relative bg-gradient-to-br from-[#5a03cf]/5 to-[#9cff02]/5 dark:from-[#5a03cf]/10 dark:to-[#9cff02]/10 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 hover:border-[#5a03cf]/50 transition-all duration-300 shadow-lg shadow-[#5a03cf]/5">
            {/* Badge économie */}
            <div className="absolute top-4 right-4">
              <div className="bg-[#9cff02] rounded-full px-3 py-1">
                <span className="text-xs text-[#1a1a1a]">
                  Économie de 60€/an
                </span>
              </div>
            </div>

            <div className="mb-6">
              <div className="inline-flex items-center gap-2 mb-2">
                <h2 className="text-2xl text-gray-900 dark:text-white">
                  Annuel
                </h2>
                <span className="text-xs bg-[#5a03cf] text-white px-2 py-1 rounded-full">
                  Recommandé
                </span>
              </div>
              <div className="mb-1">
                <span className="text-4xl bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
                  25€
                </span>
                <span className="text-gray-600 dark:text-gray-400 text-lg"> / mois</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-500">Soit 300€ / an</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#9cff02] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#1a1a1a]" strokeWidth={3} />
                </div>
                <span className="text-gray-700 dark:text-gray-300">Facturation annuelle</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#9cff02] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#1a1a1a]" strokeWidth={3} />
                </div>
                <span className="text-gray-700 dark:text-gray-300">Tous les avantages Match</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-[#9cff02] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#1a1a1a]" strokeWidth={3} />
                </div>
                <span className="text-gray-700 dark:text-gray-300">Meilleur rapport qualité/prix</span>
              </div>
            </div>

            <button
              onClick={() => handleChoisirOffre('annuel')}
              disabled={selectedFormule !== null}
              className="w-full bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white py-4 rounded-full hover:brightness-110 hover:shadow-xl hover:shadow-[#5a03cf]/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {selectedFormule === 'annuel' ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Validation...
                </span>
              ) : (
                'Choisir cette formule'
              )}
            </button>
          </div>
        </div>

        {/* Information importante */}
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">💡</span>
            </div>
            <div>
              <h3 className="text-lg mb-2 text-gray-900 dark:text-white">
                Information importante
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                Un abonnement correspond à un établissement
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Si vous gérez plusieurs lieux, chaque établissement dispose de son propre abonnement
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Aucun paiement ne sera effectué sans confirmation
          </p>
          <button
            onClick={onBack}
            className="text-sm text-[#5a03cf] dark:text-[#7a23ef] hover:underline transition-all"
          >
            Conditions d'abonnement
          </button>
        </div>
      </div>
    </div>
  );
}