import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import logoMatch from 'figma:asset/c263754cf7a254d8319da5c6945751d81a6f5a94.png';
import { useState } from 'react';

interface ReferralPageProps {
  onBackToLanding: () => void;
  onGoToLogin?: () => void;
}

export function ReferralPage({ onBackToLanding, onGoToLogin }: ReferralPageProps) {
  const [referralMode, setReferralMode] = useState<'restaurant' | 'particulier'>('particulier');
  const [referralName, setReferralName] = useState('');
  const [referralEmail, setReferralEmail] = useState('');
  const [referralPhone, setReferralPhone] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [yourName, setYourName] = useState('');
  const [yourEmail, setYourEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
      {/* Header sticky */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBackToLanding}
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-full mb-6">
            <div className="w-2 h-2 bg-[#9cff02] rounded-full animate-pulse" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Programme de parrainage</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6">
            Parrainez un{' '}
            <span className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
              établissement
            </span>
          </h1>
          
          {/* Bandeau informatif avec bordure dégradée */}
          <div className="relative max-w-3xl mx-auto mb-8">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#9cff02] to-[#5a03cf] rounded-2xl opacity-30 blur-sm"></div>
            <div className="relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
              <p className="text-lg text-gray-900 dark:text-white text-center">
                Pour chaque établissement qui rejoint Match, recevez{' '}
                <span className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
                  30€ de bon d'achat
                </span>
                {' '}à utiliser sur l'application
              </p>
            </div>
          </div>
        </div>

        {/* Sélecteur de mode */}
        <div className="flex justify-center gap-4 mb-12">
          <button
            onClick={() => {
              setReferralMode('particulier');
              setIsSubmitted(false);
            }}
            className={`px-8 py-3 rounded-xl transition-all border ${
              referralMode === 'particulier'
                ? 'bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white border-transparent'
                : 'bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:border-[#5a03cf]/30'
            }`}
          >
            Je suis particulier
          </button>
          
          <button
            onClick={() => {
              if (onGoToLogin) {
                onGoToLogin();
              }
            }}
            className="px-8 py-3 rounded-xl transition-all bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:border-[#5a03cf]/30"
          >
            Je suis restaurateur
          </button>
        </div>

        {/* Formulaire */}
        <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 mb-12">
          <h2 className="text-2xl text-gray-900 dark:text-white mb-6 text-center">
            Formulaire de parrainage
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="quickFirstName" className="text-gray-700 dark:text-gray-300">
                  Mon prénom *
                </Label>
                <Input
                  id="quickFirstName"
                  type="text"
                  placeholder="Marie"
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 focus:outline-none focus:border-[#5a03cf]/50 text-gray-900 dark:text-white placeholder-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quickLastName" className="text-gray-700 dark:text-gray-300">
                  Mon nom *
                </Label>
                <Input
                  id="quickLastName"
                  type="text"
                  placeholder="Dupont"
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 focus:outline-none focus:border-[#5a03cf]/50 text-gray-900 dark:text-white placeholder-gray-500"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="quickEmail" className="text-gray-700 dark:text-gray-300">
                  Mon adresse email (utilisée sur Match) *
                </Label>
                <Input
                  id="quickEmail"
                  type="email"
                  placeholder="marie.dupont@example.com"
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 focus:outline-none focus:border-[#5a03cf]/50 text-gray-900 dark:text-white placeholder-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quickRestaurantName" className="text-gray-700 dark:text-gray-300">
                  Nom de l'établissement *
                </Label>
                <Input
                  id="quickRestaurantName"
                  type="text"
                  placeholder="Le Sport Bar"
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 focus:outline-none focus:border-[#5a03cf]/50 text-gray-900 dark:text-white placeholder-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quickSiret" className="text-gray-700 dark:text-gray-300">
                  Numéro de SIRET *
                </Label>
                <Input
                  id="quickSiret"
                  type="text"
                  placeholder="123 456 789 00012"
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 focus:outline-none focus:border-[#5a03cf]/50 text-gray-900 dark:text-white placeholder-gray-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-8 px-6 py-3 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 group"
            >
              Envoyer ma recommandation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        {/* CTA Restaurateur */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] rounded-2xl opacity-30 group-hover:opacity-40 transition-opacity blur-sm"></div>
          <div className="relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-12 border border-gray-200/50 dark:border-gray-700/50 text-center">
            <h2 className="text-3xl text-gray-900 dark:text-white mb-4">
              Vous êtes restaurateur ?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Rejoignez Match et profitez de tous les avantages de notre plateforme
            </p>
            <button
              onClick={onBackToLanding}
              className="px-8 py-3 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white rounded-xl hover:brightness-110 transition-all inline-flex items-center gap-2 group"
            >
              Découvrir Match
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 dark:border-gray-800/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© 2024 Match - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}
