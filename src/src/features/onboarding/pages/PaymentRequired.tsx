import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, CreditCard, Loader2, RefreshCw, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../authentication/context/AuthContext';
import { useBillingPaymentMethod, useBillingSetupCheckout } from '../../../hooks/api/useBilling';

export function PaymentRequired() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser, refreshUserData, completeOnboarding } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isManualCheckPending, setIsManualCheckPending] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const venueId = useMemo(() => searchParams.get('venue') || '', [searchParams]);
  const setupCheckoutMutation = useBillingSetupCheckout();
  const {
    data: paymentMethodStatus,
    isLoading: isPaymentMethodLoading,
    isFetching: isPaymentMethodFetching,
    refetch: refetchPaymentMethod,
  } = useBillingPaymentMethod({ refetchInterval: 3000 });

  const hasPaymentMethod = paymentMethodStatus?.has_payment_method ?? currentUser?.hasPaymentMethod ?? false;

  const navigateAfterActivation = useCallback(async () => {
    if (isRedirecting) return;

    setIsRedirecting(true);

    try {
      await refreshUserData();

      if (currentUser && !currentUser.hasCompletedOnboarding) {
        await completeOnboarding();
        navigate('/onboarding/confirmation', { replace: true });
        return;
      }

      navigate('/dashboard', { replace: true });
    } catch {
      setIsRedirecting(false);
      setError('Le moyen de paiement est détecté, mais la redirection automatique a échoué. Vous pouvez réessayer.');
    }
  }, [completeOnboarding, currentUser, isRedirecting, navigate, refreshUserData]);

  useEffect(() => {
    if (!hasPaymentMethod || isRedirecting) return;
    navigateAfterActivation();
  }, [hasPaymentMethod, isRedirecting, navigateAfterActivation]);

  const handleReopenSetup = async () => {
    setError(null);

    if (!venueId) {
      setError('Identifiant du lieu manquant. Revenez à l’étape précédente puis relancez la configuration.');
      return;
    }

    const setupPopup = window.open('about:blank', '_blank');

    try {
      const result = await setupCheckoutMutation.mutateAsync({
        flow: 'post_first_venue',
        venue_id: venueId,
      });

      if (!result.checkout_url) {
        throw new Error('URL de configuration Stripe indisponible.');
      }

      if (setupPopup && !setupPopup.closed) {
        setupPopup.location.href = result.checkout_url;
        return;
      }

      window.location.href = result.checkout_url;
    } catch (setupError) {
      if (setupPopup && !setupPopup.closed) {
        setupPopup.close();
      }
      setError(
        setupError instanceof Error
          ? setupError.message
          : 'Impossible de relancer la configuration du paiement.',
      );
    }
  };

  const handleManualCheck = async () => {
    setError(null);
    setIsManualCheckPending(true);

    try {
      const result = await refetchPaymentMethod();

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
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] p-4 sm:p-8">
      <div className="mx-auto flex min-h-[75vh] w-full max-w-3xl items-center justify-center">
        <section className="w-full rounded-2xl border border-gray-200/50 bg-white/80 p-8 shadow-xl backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/80 sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 dark:from-[#5a03cf]/20 dark:to-[#9cff02]/20">
            <CreditCard className="h-8 w-8 text-[#5a03cf] dark:text-[#7a23ef]" />
          </div>

          <h1 className="mt-6 text-center text-2xl text-gray-900 dark:text-white sm:text-3xl">
            Moyen de paiement requis
          </h1>

          <p className="mt-3 text-center text-sm leading-6 text-gray-600 dark:text-gray-400 sm:text-base">
            Votre établissement est bien créé, mais il reste inactif tant que le moyen de paiement n&apos;est pas configuré.
          </p>

          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-900/20">
            <p className="flex items-start gap-3 text-sm text-amber-800 dark:text-amber-300">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Une vérification automatique du moyen de paiement est lancée toutes les 3 secondes.
                {venueId ? ` Lieu concerné : ${venueId}.` : ''}
              </span>
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={handleReopenSetup}
              disabled={setupCheckoutMutation.isPending || isRedirecting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#5a03cf] px-5 py-3.5 text-sm text-white transition-colors hover:bg-[#6a13df] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {setupCheckoutMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
              Reconfigurer le paiement Stripe
            </button>

            <button
              type="button"
              onClick={handleManualCheck}
              disabled={isManualCheckPending || isRedirecting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {isManualCheckPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              J&apos;ai terminé
            </button>
          </div>

          {(isPaymentMethodLoading || isPaymentMethodFetching || isRedirecting) && (
            <p className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              {hasPaymentMethod ? 'Activation détectée, redirection en cours...' : 'Vérification du statut de paiement...'}
            </p>
          )}

          {hasPaymentMethod && !isRedirecting && (
            <p className="mt-4 flex items-center justify-center gap-2 text-sm text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              Moyen de paiement détecté.
            </p>
          )}

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-900/20">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
