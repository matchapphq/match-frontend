import { ArrowRight, Sparkles, Building2, CreditCard, Rocket } from 'lucide-react';
import { useState } from 'react';
import { PageType } from '../../../types';
// import logoMatch from 'figma:asset/c263754cf7a254d8319da5c6945751d81a6f5a94.png';
import logoMatch from '../../../assets/logo.png';
import { useBillingPricing } from '../../../hooks/api/useBilling';
import { formatPricingLabel } from '../../../utils/pricing';

interface OnboardingWelcomeProps {
  onContinue: (page: PageType) => void;
  onSkipPaymentSetup?: () => Promise<void> | void;
  currentStep: 'restaurant' | 'facturation' | 'complete';
  userName: string;
}

export function OnboardingWelcome({ onContinue, onSkipPaymentSetup, currentStep, userName }: OnboardingWelcomeProps) {
  const { data: billingPricing } = useBillingPricing();
  const [isSkippingPayment, setIsSkippingPayment] = useState(false);
  const commissionPricingLabel = billingPricing
    ? formatPricingLabel({
        default_rate: billingPricing.default_rate,
        currency: billingPricing.currency,
        unit: billingPricing.unit,
      })
    : null;

  const getStepInfo = () => {
    switch (currentStep) {
      case 'restaurant':
        return {
          title: 'Ajoutez votre premier établissement',
          description: 'Renseignez les informations de votre lieu pour démarrer l’activation.',
          buttonText: 'Ajouter mon restaurant',
          page: 'ajouter-restaurant' as PageType,
          progress: 33
        };
      case 'facturation':
        return {
          title: 'Finalisez votre inscription',
          description: commissionPricingLabel
            ? `Configurez votre facturation à la commission (${commissionPricingLabel}) pour activer votre compte`
            : 'Configurez votre facturation à la commission pour activer votre compte',
          buttonText: 'Configurer ma facturation',
          page: 'facturation' as PageType,
          progress: 66
        };
      default:
        return {
          title: 'Bienvenue sur Match',
          description: 'Votre inscription est terminée. Continuez vers votre dashboard pour commencer.',
          buttonText: 'Continuer vers votre dashboard',
          page: 'dashboard' as PageType,
          progress: 100
        };
    }
  };

  const stepInfo = getStepInfo();
  const isRestaurantStep = currentStep === 'restaurant';
  const isBillingStep = currentStep === 'facturation';
  const isCompleteStep = currentStep === 'complete';
  const onboardingStatusCard = isRestaurantStep
    ? {
        title: 'Étape actuelle',
        description: 'Ajoutez votre premier établissement pour débloquer la configuration de facturation.',
      }
    : isBillingStep
      ? {
          title: 'Étape actuelle',
          description: 'Finalisez votre configuration de facturation pour activer complètement votre compte.',
        }
      : {
          title: 'Compte prêt',
          description: 'Votre onboarding est terminé. Vous pouvez maintenant commencer à diffuser des matchs.',
        };
  const handleSkipPaymentSetup = async () => {
    if (!onSkipPaymentSetup || isSkippingPayment) return;

    try {
      setIsSkippingPayment(true);
      await onSkipPaymentSetup();
    } finally {
      setIsSkippingPayment(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] p-4 sm:p-8 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#9cff02]/5 dark:bg-[#9cff02]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#5a03cf]/5 dark:bg-[#5a03cf]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5a03cf]/3 dark:bg-[#5a03cf]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto space-y-6">
        <div className="text-center">
          <div className="flex justify-center mb-5">
            <img
              src={logoMatch}
              alt="Match"
              className="h-16 sm:h-20 dark:brightness-150"
              style={{ filter: 'brightness(0) saturate(100%) invert(13%) sepia(91%) saturate(6297%) hue-rotate(268deg) brightness(83%) contrast(122%)' }}
            />
          </div>
          <h1 className="text-3xl sm:text-4xl text-gray-900 dark:text-white">
            Bienvenue {userName}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Suivez les étapes d&apos;activation pour finaliser votre compte Match.
          </p>
        </div>

        <section className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <div className="flex items-center gap-3" style={{ marginBottom: 24 }}>
            <Sparkles className="w-5 h-5 text-[#5a03cf] dark:text-[#7a23ef]" />
            <h2 className="text-xl text-gray-900 dark:text-white">
              {isCompleteStep ? 'Inscription terminée' : 'Prochaine étape'}
            </h2>
          </div>

          <div className="rounded-2xl border border-[#5a03cf]/20 dark:border-[#7a23ef]/30 bg-gradient-to-br from-[#5a03cf]/6 to-[#9cff02]/6 dark:from-[#5a03cf]/10 dark:to-[#9cff02]/10 p-5">
            <h3 className="text-xl text-gray-900 dark:text-white">{stepInfo.title}</h3>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{stepInfo.description}</p>
          </div>

          <div className="mt-6 space-y-2">
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

          <button
            onClick={() => onContinue(stepInfo.page)}
            className="mt-6 w-full py-4 bg-[#5a03cf] text-white rounded-xl hover:bg-[#4a02af] transition-all duration-200 shadow-lg shadow-[#5a03cf]/20 hover:scale-[1.01] flex items-center justify-center gap-3"
          >
            <span>{stepInfo.buttonText}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          {isBillingStep && onSkipPaymentSetup && (
            <button
              type="button"
              onClick={handleSkipPaymentSetup}
              disabled={isSkippingPayment}
              className="mt-3 w-full text-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSkippingPayment ? 'Redirection...' : 'Configurer plus tard et accéder au dashboard'}
            </button>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Building2 className="w-5 h-5 text-[#5a03cf] dark:text-[#7a23ef]" />
              <h2 className="text-xl text-gray-900 dark:text-white">Étapes de l&apos;onboarding</h2>
            </div>

            <div className="space-y-3">
              <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                isRestaurantStep
                  ? 'bg-[#5a03cf]/10 dark:bg-[#5a03cf]/20 border border-[#5a03cf]/30 dark:border-[#5a03cf]/40'
                  : 'bg-gray-50 dark:bg-gray-800/50 border border-transparent'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isRestaurantStep ? 'bg-[#5a03cf] text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {isRestaurantStep ? '1' : <Building2 className="w-4 h-4" />}
                </div>
                <span className={`text-sm ${
                  isRestaurantStep ? 'text-[#5a03cf] dark:text-[#7a23ef] font-medium' : 'text-gray-400 dark:text-gray-500 line-through'
                }`}>
                  Ajouter votre restaurant
                </span>
              </div>

              <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                isBillingStep
                  ? 'bg-[#5a03cf]/10 dark:bg-[#5a03cf]/20 border border-[#5a03cf]/30 dark:border-[#5a03cf]/40'
                  : 'bg-gray-50 dark:bg-gray-800/50 border border-transparent'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isBillingStep ? 'bg-[#5a03cf] text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {isBillingStep ? '2' : <CreditCard className="w-4 h-4" />}
                </div>
                <span className={`text-sm ${
                  isBillingStep
                    ? 'text-[#5a03cf] dark:text-[#7a23ef] font-medium'
                    : isCompleteStep
                      ? 'text-gray-400 dark:text-gray-500 line-through'
                      : 'text-gray-500 dark:text-gray-400'
                }`}>
                  Configurer votre facturation à la commission
                </span>
              </div>

              <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                isCompleteStep
                  ? 'bg-[#5a03cf]/10 dark:bg-[#5a03cf]/20 border border-[#5a03cf]/30 dark:border-[#5a03cf]/40'
                  : 'bg-gray-50 dark:bg-gray-800/50 border border-transparent'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCompleteStep ? 'bg-[#5a03cf] text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {isCompleteStep ? '3' : <Rocket className="w-4 h-4" />}
                </div>
                <span className={`text-sm ${
                  isCompleteStep ? 'text-[#5a03cf] dark:text-[#7a23ef] font-medium' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  Commencer à diffuser des matchs !
                </span>
              </div>
            </div>
          </section>

          <section className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-[#5a03cf] dark:text-[#7a23ef]" />
              <h2 className="text-xl text-gray-900 dark:text-white">Suivi de votre activation</h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-[#5a03cf]/20 dark:border-[#7a23ef]/30 bg-gradient-to-br from-[#5a03cf]/5 to-[#9cff02]/5 dark:from-[#5a03cf]/10 dark:to-[#9cff02]/10 p-4">
                <p className="text-sm text-gray-900 dark:text-white">{onboardingStatusCard.title}</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{onboardingStatusCard.description}</p>
              </div>

              <div className="rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-gray-50/80 dark:bg-gray-900/40 p-4">
                <p className="text-sm text-gray-900 dark:text-white">Tarification appliquée</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {commissionPricingLabel || 'Tarification à la commission'}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-gray-50/80 dark:bg-gray-900/40 p-4">
                <p className="text-sm text-gray-900 dark:text-white">Parcours guidé</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Vous pouvez revenir sur cette page à tout moment pour suivre votre progression.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
