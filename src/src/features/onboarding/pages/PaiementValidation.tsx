import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, CreditCard, Lock, Receipt, ShieldCheck } from 'lucide-react';
import { PageType } from '../../../types';
import { saveCheckoutState, getCheckoutState } from '../../../utils/checkout-state';
import { API_ENDPOINTS } from '../../../utils/api-constants';
import { apiPost } from '../../../utils/api-helpers';

interface PaiementValidationProps {
  onBack: () => void;
  onNavigate: (page: PageType) => void;
  selectedFormule?: 'mensuel' | 'annuel';
  nomBar?: string;
  checkoutUrl?: string | null;
  isAddingVenue?: boolean;
}

export function PaiementValidation({
  onBack,
  selectedFormule = 'mensuel',
  nomBar = '',
  checkoutUrl: checkoutUrlProp,
  isAddingVenue = false,
}: PaiementValidationProps) {
  const authToken = localStorage.getItem('authToken') || '';
  const successRedirectUrl = `${window.location.origin}${isAddingVenue ? '/my-venues/add/confirmation' : '/onboarding/confirmation'}`;
  const cancelRedirectUrl = `${window.location.origin}${isAddingVenue ? '/my-venues/add/payment' : '/onboarding/payment'}`;
  const [isProcessing, setIsProcessing] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(checkoutUrlProp || null);
  const [resolvedVenueName, setResolvedVenueName] = useState<string>(nomBar);

  useEffect(() => {
    const savedState = getCheckoutState();

    if ((!resolvedVenueName || !resolvedVenueName.trim()) && savedState?.venueName) {
      setResolvedVenueName(savedState.venueName);
    }

    if (!checkoutUrl && savedState?.checkoutUrl) {
        setCheckoutUrl(savedState.checkoutUrl);
    }
  }, [checkoutUrl, resolvedVenueName]);

  const formuleDetails = {
    mensuel: {
      label: 'Mensuel',
      prix: '30€',
      periode: 'mois',
      total: '30€',
      description: 'Facturation mensuelle, sans engagement.',
      cadence: 'Prélèvement mensuel',
    },
    annuel: {
      label: 'Annuel',
      prix: '300€',
      periode: 'an',
      total: '300€',
      description: 'Facturation annuelle, soit 25€/mois.',
      cadence: 'Prélèvement annuel',
    },
  };

  const details = formuleDetails[selectedFormule];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptedTerms) {
      setError('Vous devez accepter les conditions pour continuer');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      if (checkoutUrl) {
        const existingState = getCheckoutState();
        if (!existingState) {
          saveCheckoutState({
            type: isAddingVenue ? 'add-venue' : 'onboarding',
            venueName: nomBar,
            formule: selectedFormule,
            returnPage: isAddingVenue ? 'mes-restaurants' : 'confirmation-onboarding',
          });
        }
        window.location.href = checkoutUrl;
        return;
      }

      if (nomBar) {
        throw new Error('La session de création a expiré. Veuillez retourner à l\'étape précédente.');
      }

      const data = await apiPost(
        API_ENDPOINTS.SUBSCRIPTIONS_CREATE_CHECKOUT,
        {
          plan_id: selectedFormule === 'annuel' ? 'annual' : 'monthly',
          success_url: successRedirectUrl,
          cancel_url: cancelRedirectUrl,
        },
        authToken || '',
      );

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        throw new Error('Impossible de créer la session de paiement');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setIsProcessing(false);
    }
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
            disabled={isProcessing}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Retour
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 dark:from-[#5a03cf]/20 dark:to-[#9cff02]/20 rounded-2xl mb-6">
            <CreditCard className="w-8 h-8 text-[#5a03cf] dark:text-[#7a23ef]" />
          </div>
          <h1 className="text-3xl sm:text-4xl mb-3 text-gray-900 dark:text-white">
            Confirmation & paiement
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Vérifiez votre récapitulatif avant d'être redirigé vers le paiement sécurisé.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
          <section className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Receipt className="w-5 h-5 text-[#5a03cf] dark:text-[#7a23ef]" />
              <h2 className="text-xl text-gray-900 dark:text-white">
                Récapitulatif
              </h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-gray-50/80 dark:bg-gray-900/50 px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Établissement</span>
                  <span className="text-sm text-gray-900 dark:text-white">{resolvedVenueName || 'Votre établissement'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-blue-200/60 dark:border-blue-900/40 bg-blue-50/80 dark:bg-blue-900/10 p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Formule</p>
                  <p className="mt-2 text-base text-gray-900 dark:text-white">{details.label}</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{details.description}</p>
                </div>

                <div className="rounded-xl border border-emerald-200/60 dark:border-emerald-900/40 bg-emerald-50/80 dark:bg-emerald-900/10 p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Cadence</p>
                  <p className="mt-2 text-base text-gray-900 dark:text-white">{details.cadence}</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{details.prix} / {details.periode}</p>
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-br from-[#5a03cf]/5 to-[#9cff02]/5 dark:from-[#5a03cf]/10 dark:to-[#9cff02]/10 backdrop-blur-sm border border-[#5a03cf]/20 dark:border-[#5a03cf]/30 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Montant à valider</p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Montant associé à l’abonnement sélectionné</p>
                  </div>
                  <p className="text-3xl text-[#5a03cf] dark:text-[#c9a7ff]">{details.total}</p>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:border-emerald-900/40 dark:bg-emerald-900/20 p-4">
                <p className="flex items-start gap-3 text-sm text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="mt-0.5 w-4 h-4 shrink-0" />
                  <span>Un abonnement correspond à un seul établissement. Vous pourrez ajouter d'autres lieux ensuite si nécessaire.</span>
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-5 h-5 text-[#5a03cf] dark:text-[#7a23ef]" />
              <h2 className="text-xl text-gray-900 dark:text-white">
                Étape suivante
              </h2>
            </div>

            <div className="rounded-xl border border-[#5a03cf]/20 dark:border-[#7a23ef]/30 bg-gradient-to-br from-[#5a03cf]/5 to-[#9cff02]/5 dark:from-[#5a03cf]/10 dark:to-[#9cff02]/10 p-5">
              <p className="text-sm text-gray-900 dark:text-white">
                Après validation, vous passez à l’étape de paiement sécurisé pour finaliser l’activation de votre établissement.
              </p>
            </div>
          </section>
          </div>

          <div className="xl:col-span-1">
          <section className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Lock className="w-5 h-5 text-[#5a03cf] dark:text-[#7a23ef]" />
              <h2 className="text-xl text-gray-900 dark:text-white">
                Conditions et validation
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-gray-50/80 dark:bg-gray-900/50 p-4">
                <label htmlFor="acceptTerms" className="flex cursor-pointer items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    disabled={isProcessing}
                    className="mt-0.5 h-5 w-5 rounded border-gray-300 text-[#5a03cf] focus:ring-[#5a03cf] focus:ring-offset-0 disabled:opacity-50"
                    required
                  />
                  <span>
                    J’accepte les{' '}
                    <a
                      href="/terms-of-sale"
                      className="font-medium text-[#5a03cf] hover:underline dark:text-[#c9a7ff]"
                    >
                      CGV
                    </a>
                    {' '}et les{' '}
                    <a href="/terms" className="font-medium text-[#5a03cf] hover:underline dark:text-[#c9a7ff]">
                      CGU
                    </a>
                    .
                  </span>
                </label>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-950/30">
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isProcessing || !acceptedTerms}
                className="w-full py-4 bg-[#5a03cf] text-white rounded-xl hover:bg-[#4a02af] transition-all duration-200 shadow-lg shadow-[#5a03cf]/20 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Redirection vers le paiement...
                  </>
                ) : (
                  `Accéder au paiement sécurisé (${details.total})`
                )}
              </button>

              <div className="space-y-2 pt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Le montant sera prélevé selon la cadence choisie pour cet établissement.
                </p>
              </div>
            </form>
          </section>
          </div>
        </div>
      </div>
    </div>
  );
}
