import { useState } from 'react';
import { ArrowLeft, Building2, CheckCircle2, CircleArrowRight, CreditCard, Sparkles } from 'lucide-react';
import { PageType } from '../../../types';

interface AjouterRestaurantProps {
  onBack: () => void;
  onNavigate: (page: PageType) => void;
  isOnboarding?: boolean;
}

export function AjouterRestaurant({ onBack, onNavigate, isOnboarding = false }: AjouterRestaurantProps) {
  const [isSubmittingChoice, setIsSubmittingChoice] = useState(false);

  const handleContinue = () => {
    if (isSubmittingChoice) return;
    setIsSubmittingChoice(true);

    setTimeout(() => {
      onNavigate('infos-etablissement' as PageType);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] p-4 sm:p-8 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5a03cf]/5 dark:bg-[#5a03cf]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#9cff02]/5 dark:bg-[#9cff02]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5a03cf]/3 dark:bg-[#5a03cf]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Retour</span>
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 dark:from-[#5a03cf]/20 dark:to-[#9cff02]/20 rounded-2xl mb-6">
            <Building2 className="w-8 h-8 text-[#5a03cf] dark:text-[#7a23ef]" />
          </div>
          <h1 className="text-3xl sm:text-4xl mb-3 text-gray-900 dark:text-white">
            Ajoutez votre établissement
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Commencez par les informations de votre lieu. La facturation est configurée à l’étape suivante.
          </p>
        </div>

        <div className="space-y-6">
          <section className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-[#5a03cf] dark:text-[#7a23ef]" />
              <h2 className="text-xl text-gray-900 dark:text-white">Parcours d’activation</h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-[#5a03cf]/20 dark:border-[#7a23ef]/30 bg-gradient-to-br from-[#5a03cf]/6 to-[#9cff02]/6 dark:from-[#5a03cf]/10 dark:to-[#9cff02]/10 p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#5a03cf] text-xs text-white">1</span>
                  <div>
                    <h3 className="text-base text-gray-900 dark:text-white">Renseignez votre établissement</h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Nom, adresse, capacité et informations de contact.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200/60 dark:border-gray-700/60 bg-gray-50/80 dark:bg-gray-900/40 p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#5a03cf] text-xs text-white">2</span>
                  <div>
                    <h3 className="text-base text-gray-900 dark:text-white">Configurez la facturation</h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Après création du lieu, Match lance la configuration du moyen de paiement Stripe si nécessaire.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleContinue}
                disabled={isSubmittingChoice}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-sm transition-all disabled:cursor-not-allowed disabled:opacity-50 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white hover:from-[#6a13df] hover:to-[#8a33ff]"
              >
                {isSubmittingChoice ? (
                  <>
                    <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Ouverture...
                  </>
                ) : (
                  <>
                    Continuer
                    <CircleArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </section>

          <section className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-[#5a03cf] dark:text-[#7a23ef]" />
              <h2 className="text-xl text-gray-900 dark:text-white">Ce qui vous attend ensuite</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#5a03cf]" />
                <span>Votre lieu est créé immédiatement après validation du formulaire.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#5a03cf]" />
                <span>Si aucun moyen de paiement n’est configuré, vous passez sur l’étape de facturation.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#5a03cf]" />
                <span>Le bouton retour ne modifie pas votre étape d’onboarding.</span>
              </li>
            </ul>
            {!isOnboarding && (
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Vous pouvez ajouter d’autres établissements à tout moment.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
