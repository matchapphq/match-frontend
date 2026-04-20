import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, CreditCard, Loader2, RefreshCw, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../authentication/context/AuthContext';
import { useBillingPaymentMethod, useBillingSetupCheckout } from '../../../hooks/api/useBilling';
import { usePartnerVenues } from '../../../hooks/api/useVenues';
import {
  clearPendingPaymentVenueId,
  getPendingPaymentVenueId,
  saveCheckoutState,
  savePendingPaymentVenueId,
} from '../../../utils/checkout-state';

export function PaymentRequired() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser, refreshUserData, completeOnboarding } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isManualCheckPending, setIsManualCheckPending] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [resolvedVenueId, setResolvedVenueId] = useState('');

  const venueIdFromQuery = useMemo(() => searchParams.get('venue') || '', [searchParams]);
  const autoContinueFromQuery = useMemo(() => searchParams.get('autocontinue') === '1', [searchParams]);
  const openedFromBilling = useMemo(() => searchParams.get('from') === 'billing', [searchParams]);
  const setupCheckoutMutation = useBillingSetupCheckout();
  const { data: venues } = usePartnerVenues();
  const {
    data: paymentMethodStatus,
    refetch: refetchPaymentMethod,
  } = useBillingPaymentMethod();

  const hasPaymentMethod = paymentMethodStatus?.has_payment_method ?? currentUser?.hasPaymentMethod ?? false;
  const fallbackVenueIdFromList = useMemo(() => {
    if (!venues || venues.length === 0) return '';

    const inactiveVenue = venues.find((venue) => !(venue.is_active === true && venue.status === 'approved'));
    return inactiveVenue?.id || venues[0]?.id || '';
  }, [venues]);

  useEffect(() => {
    const pendingVenueId = getPendingPaymentVenueId() || '';
    const nextVenueId = venueIdFromQuery || pendingVenueId || fallbackVenueIdFromList;
    if (!nextVenueId) return;

    setResolvedVenueId((previous) => (previous === nextVenueId ? previous : nextVenueId));
  }, [fallbackVenueIdFromList, venueIdFromQuery]);

  useEffect(() => {
    if (!resolvedVenueId) return;
    savePendingPaymentVenueId(resolvedVenueId);

    if (venueIdFromQuery === resolvedVenueId) return;
    const params = new URLSearchParams();
    params.set('venue', resolvedVenueId);
    if (autoContinueFromQuery) {
      params.set('autocontinue', '1');
    }
    if (openedFromBilling) {
      params.set('from', 'billing');
    }
    navigate(`/onboarding/payment-required?${params.toString()}`, { replace: true });
  }, [autoContinueFromQuery, navigate, openedFromBilling, resolvedVenueId, venueIdFromQuery]);

  const navigateAfterActivation = useCallback(async () => {
    if (isRedirecting) return;

    setIsRedirecting(true);

    try {
      await refreshUserData();
      await completeOnboarding();
      clearPendingPaymentVenueId();
      navigate('/onboarding', { replace: true });
    } catch {
      setIsRedirecting(false);
      setError('Le moyen de paiement est détecté, mais la redirection automatique a échoué. Vous pouvez réessayer.');
    }
  }, [completeOnboarding, currentUser, isRedirecting, navigate, refreshUserData]);

  useEffect(() => {
    if (!autoContinueFromQuery || !hasPaymentMethod || isRedirecting) return;
    navigateAfterActivation();
  }, [autoContinueFromQuery, hasPaymentMethod, isRedirecting, navigateAfterActivation]);

  const handleReopenSetup = async () => {
    setError(null);

    if (!resolvedVenueId) {
      setError('Identifiant du lieu manquant. Revenez à l’étape précédente puis relancez la configuration.');
      return;
    }

    try {
      const paymentRequiredParams = new URLSearchParams();
      paymentRequiredParams.set('venue', resolvedVenueId);
      if (openedFromBilling) {
        paymentRequiredParams.set('from', 'billing');
      }
      const paymentRequiredPath = `/onboarding/payment-required?${paymentRequiredParams.toString()}`;
      const paymentRequiredUrl = `${window.location.origin}${paymentRequiredPath}`;
      const result = await setupCheckoutMutation.mutateAsync({
        flow: 'post_first_venue',
        venue_id: resolvedVenueId,
        success_url: paymentRequiredUrl,
        cancel_url: paymentRequiredUrl,
      });

      if (!result.checkout_url) {
        throw new Error('URL de configuration Stripe indisponible.');
      }

      savePendingPaymentVenueId(resolvedVenueId);
      saveCheckoutState({
        type: 'payment-setup',
        venueId: resolvedVenueId,
        sessionId: result.session_id,
        checkoutUrl: result.checkout_url,
        returnPage: paymentRequiredPath,
      });
      // Open Stripe in the same tab to avoid duplicate tabs on return.
      window.location.href = result.checkout_url;
    } catch (setupError) {
      setError(
        setupError instanceof Error
          ? setupError.message
          : 'Impossible de relancer la configuration du paiement.',
      );
    }
  };

  const backPath = openedFromBilling ? '/account/billing' : '/onboarding';
  const backLabel = openedFromBilling ? 'Retour' : 'Retour à l\'onboarding';

  const handleManualCheck = async () => {
    setError(null);
    setIsManualCheckPending(true);

    try {
      const result = await refetchPaymentMethod();

      if (result.data?.has_payment_method) {
        await navigateAfterActivation();
        return;
      }

      if (!result.data?.has_payment_method) {
        setError('Aucun moyen de paiement détecté pour le moment. Réessayez dans quelques secondes.');
      }
    } catch {
      setError('Impossible de vérifier le statut du paiement pour le moment.');
    } finally {
      setIsManualCheckPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] p-4 sm:p-8 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5a03cf]/5 dark:bg-[#5a03cf]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#9cff02]/5 dark:bg-[#9cff02]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5a03cf]/3 dark:bg-[#5a03cf]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto space-y-6">
        <div>
          <button
            type="button"
            onClick={() => navigate(backPath)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">{backLabel}</span>
          </button>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 dark:from-[#5a03cf]/20 dark:to-[#9cff02]/20 rounded-2xl mb-5">
            <CreditCard className="w-8 h-8 text-[#5a03cf] dark:text-[#7a23ef]" />
          </div>
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Finalisez l&apos;activation de votre établissement
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Votre lieu est bien créé. Configurez votre moyen de paiement pour l&apos;activer.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-5 h-5 text-[#5a03cf] dark:text-[#7a23ef]" />
              <h2 className="text-xl text-gray-900 dark:text-white">Ce qu&apos;il faut savoir</h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-gray-50/80 dark:bg-gray-900/40 p-4">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#9cff02] text-[#1a1a1a]">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">Activation liée à votre moyen de paiement Stripe</span>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-gray-50/80 dark:bg-gray-900/40 p-4">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#9cff02] text-[#1a1a1a]">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">Vos lieux restent visibles dans votre compte</span>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-gray-50/80 dark:bg-gray-900/40 p-4">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#9cff02] text-[#1a1a1a]">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">Vous pouvez relancer la configuration à tout moment</span>
              </div>
            </div>

            {isRedirecting && (
              <p className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Activation détectée, redirection en cours...
              </p>
            )}
          </section>

          <section className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="w-5 h-5 text-[#5a03cf] dark:text-[#7a23ef]" />
              <h2 className="text-xl text-gray-900 dark:text-white">Actions</h2>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleReopenSetup}
                disabled={setupCheckoutMutation.isPending || isRedirecting}
                className="w-full bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white py-4 rounded-xl hover:from-[#6a13df] hover:to-[#8a33ff] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {setupCheckoutMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Ouverture Stripe...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Configurer mon moyen de paiement
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleManualCheck}
                disabled={isManualCheckPending || isRedirecting}
                className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950/20 text-gray-700 dark:text-gray-200 py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isManualCheckPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Vérification...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-5 w-5" />
                    J&apos;ai terminé, vérifier
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20 p-4">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            )}

            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              En poursuivant, vous confirmez l&apos;activation de votre facturation conformément aux{' '}
              <a href="/terms-of-sale" className="text-[#5a03cf] hover:underline font-medium">
                CGV
              </a>
              .
            </p>
          </section>
        </div>

        <section className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <h2 className="text-lg text-gray-900 dark:text-white mb-4">Suite du parcours</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-gray-50/80 dark:bg-gray-900/40 p-4">
              <p className="text-xs text-[#5a03cf] dark:text-[#7a23ef] uppercase tracking-wide">Étape 1</p>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">Ouvrez Stripe et ajoutez votre moyen de paiement.</p>
            </div>
            <div className="rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-gray-50/80 dark:bg-gray-900/40 p-4">
              <p className="text-xs text-[#5a03cf] dark:text-[#7a23ef] uppercase tracking-wide">Étape 2</p>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">Revenez ici puis cliquez sur “J&apos;ai terminé, vérifier”.</p>
            </div>
            <div className="rounded-xl border border-[#5a03cf]/20 dark:border-[#7a23ef]/30 bg-gradient-to-br from-[#5a03cf]/5 to-[#9cff02]/5 dark:from-[#5a03cf]/10 dark:to-[#9cff02]/10 p-4">
              <p className="text-xs text-[#5a03cf] dark:text-[#7a23ef] uppercase tracking-wide">Étape 3</p>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">Une fois validé, votre onboarding continue automatiquement.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
