import { useState } from 'react';
import { ArrowLeft, Check, CreditCard, Receipt, ShieldCheck, Sparkles } from 'lucide-react';
import { PageType } from '../../../types';
import { useAuth } from '../../authentication/context/AuthContext';
import { useBillingPricing } from '../../../hooks/api/useBilling';
import { formatPricingLabel } from '../../../utils/pricing';

interface AjouterRestaurantProps {
  onBack: () => void;
  onNavigate: (page: PageType) => void;
  isOnboarding?: boolean;
}

export function AjouterRestaurant({ onBack, onNavigate, isOnboarding = false }: AjouterRestaurantProps) {
  const { updateOnboardingStep } = useAuth();
  const { data: billingPricing } = useBillingPricing();
  const [isSubmittingChoice, setIsSubmittingChoice] = useState(false);

  const handleChoisirOffre = () => {
    if (isSubmittingChoice) return;
    setIsSubmittingChoice(true);

    setTimeout(() => {
      if (isOnboarding) {
        updateOnboardingStep('facturation');
      }
      onNavigate('infos-etablissement' as PageType);
    }, 800);
  };

  const commissionPricingLabel = billingPricing
    ? formatPricingLabel({
        default_rate: billingPricing.default_rate,
        currency: billingPricing.currency,
        unit: billingPricing.unit,
      })
    : 'Tarification à la commission';

  const commissionFeatures = [
    'Tous les avantages Match',
    'Facturation alignée sur l’activité réelle',
    'Activation rapide de votre établissement',
  ];

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
            <CreditCard className="w-8 h-8 text-[#5a03cf] dark:text-[#7a23ef]" />
          </div>
          <h1 className="text-3xl sm:text-4xl mb-3 text-gray-900 dark:text-white">
            Activez votre facturation
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Chaque établissement fonctionne avec une facturation à la commission.
          </p>
        </div>

        <div className="space-y-6">
          <section className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Receipt className="w-5 h-5 text-[#5a03cf] dark:text-[#7a23ef]" />
              <h2 className="text-xl text-gray-900 dark:text-white">Tarification</h2>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div className="relative rounded-2xl border p-6 backdrop-blur-xl transition-all border-[#5a03cf]/20 dark:border-[#7a23ef]/30 bg-gradient-to-br from-[#5a03cf]/6 to-[#9cff02]/6 dark:from-[#5a03cf]/10 dark:to-[#9cff02]/10">
                <span className="absolute right-4 top-4 rounded-full bg-[#5a03cf] px-2.5 py-1 text-[11px] text-white">
                  Commission
                </span>

                <div className="mb-6">
                  <h3 className="text-2xl text-gray-900 dark:text-white">Tarif par client présent</h3>
                  <div className="mt-3">
                    <span className="text-4xl bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
                      {commissionPricingLabel}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Montant appliqué selon le nombre de clients check-in</p>
                </div>

                <div className="mb-6 rounded-xl border border-gray-200/60 bg-gray-50/80 p-4 dark:border-gray-700/60 dark:bg-gray-900/40">
                  <p className="text-sm text-gray-900 dark:text-white">Modèle de facturation unique</p>
                  <ul className="mt-3 space-y-2">
                    {commissionFeatures.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#9cff02] text-[#1a1a1a]">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={handleChoisirOffre}
                  disabled={isSubmittingChoice}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-sm transition-all disabled:cursor-not-allowed disabled:opacity-50 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white hover:from-[#6a13df] hover:to-[#8a33ff]"
                >
                  {isSubmittingChoice ? (
                    <>
                      <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Validation...
                    </>
                  ) : (
                    'Continuer'
                  )}
                </button>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
            <section className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-5 h-5 text-[#5a03cf] dark:text-[#7a23ef]" />
                <h2 className="text-xl text-gray-900 dark:text-white">À retenir</h2>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-gray-50/80 dark:bg-gray-900/50 p-4">
                  <p className="text-sm text-gray-900 dark:text-white">Une facturation par lieu</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Si vous gérez plusieurs établissements, chacun suit ses propres commissions.
                  </p>
                </div>

                <div className="rounded-xl border border-blue-200/60 dark:border-blue-900/40 bg-blue-50/80 dark:bg-blue-900/10 p-4">
                  <p className="text-sm text-gray-900 dark:text-white">Aucun paiement immédiat ici</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Vous renseignez d’abord les informations du lieu, puis la configuration de paiement s’ouvre si nécessaire.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="w-5 h-5 text-[#5a03cf] dark:text-[#7a23ef]" />
                <h2 className="text-xl text-gray-900 dark:text-white">Suite du parcours</h2>
              </div>

              <div className="rounded-xl border border-[#5a03cf]/20 dark:border-[#7a23ef]/30 bg-gradient-to-br from-[#5a03cf]/5 to-[#9cff02]/5 dark:from-[#5a03cf]/10 dark:to-[#9cff02]/10 p-4 flex-1">
                <div className="space-y-3">
                  <div className="rounded-xl border border-white/50 bg-white/70 p-3 dark:border-white/10 dark:bg-gray-950/20">
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#5a03cf] text-xs text-white">
                        1
                      </span>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Vous confirmez le modèle de facturation à la commission.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/50 bg-white/70 p-3 dark:border-white/10 dark:bg-gray-950/20">
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#5a03cf] text-xs text-white">
                        2
                      </span>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Vous renseignez ensuite les informations du lieu.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/50 bg-white/70 p-3 dark:border-white/10 dark:bg-gray-950/20">
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#5a03cf] text-xs text-white">
                        3
                      </span>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Le moyen de paiement Stripe est configuré à l’étape finale si requis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
