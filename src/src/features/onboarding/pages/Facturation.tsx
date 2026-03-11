import { useState } from 'react';
import { ArrowLeft, Check, CreditCard } from 'lucide-react';
import { PageType } from '../../../types';
import { useAuth } from '../../authentication/context/AuthContext';
import { useBillingPricing } from '../../../hooks/api/useBilling';
import { formatPricingLabel } from '../../../utils/pricing';

interface FacturationProps {
  onBack: () => void;
  onNavigate: (page: PageType) => void;
  isOnboarding?: boolean;
}

export function Facturation({ onBack, onNavigate, isOnboarding = false }: FacturationProps) {
  const { completeOnboarding } = useAuth();
  const { data: billingPricing } = useBillingPricing();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const commissionPricingLabel = billingPricing
    ? formatPricingLabel({
        default_rate: billingPricing.default_rate,
        currency: billingPricing.currency,
        unit: billingPricing.unit,
      })
    : 'Tarification à la commission';

  const handleContinue = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    setTimeout(async () => {
      if (isOnboarding) {
        await completeOnboarding();
        onNavigate('dashboard');
      } else {
        onNavigate('mes-restaurants');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5a03cf]/10 via-gray-50 to-[#9cff02]/10 p-8 relative overflow-hidden">
      <div className="max-w-5xl mx-auto mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-[#5a03cf] transition-colors"
          style={{ fontWeight: '600' }}
        >
          <ArrowLeft className="w-5 h-5" />
          {isOnboarding ? 'Retour' : 'Retour au compte'}
        </button>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#5a03cf]/10 mb-6">
            <CreditCard className="w-8 h-8 text-[#5a03cf]" />
          </div>
          <h1 className="text-5xl italic mb-3" style={{ fontWeight: '700', color: '#5a03cf' }}>
            Facturation à la commission
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Le tarif est calculé selon l&apos;activité réelle de chaque établissement.
          </p>
          <p className="text-sm text-gray-500">
            Vous pourrez ajouter d&apos;autres établissements plus tard.
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/50 p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl mb-2" style={{ fontWeight: '700', color: '#5a03cf' }}>
              Tarif de référence
            </h2>
            <div className="mb-1">
              <span className="text-4xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
                {commissionPricingLabel}
              </span>
            </div>
            <p className="text-sm text-gray-500">Appliqué par client réellement présent</p>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#5a03cf]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-[#5a03cf]" strokeWidth={3} />
              </div>
              <span className="text-gray-700">Modèle de facturation unique</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#5a03cf]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-[#5a03cf]" strokeWidth={3} />
              </div>
              <span className="text-gray-700">Visible depuis votre espace facturation</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-[#5a03cf]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-[#5a03cf]" strokeWidth={3} />
              </div>
              <span className="text-gray-700">Factures Stripe disponibles par établissement</span>
            </div>
          </div>

          <button
            onClick={handleContinue}
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white py-4 rounded-xl hover:brightness-105 hover:scale-[1.01] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontWeight: '600' }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Validation...
              </span>
            ) : (
              'Continuer'
            )}
          </button>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#5a03cf]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-lg" style={{ fontWeight: '700', color: '#5a03cf' }}>i</span>
            </div>
            <div>
              <h3 className="text-lg mb-2" style={{ fontWeight: '600', color: '#5a03cf' }}>
                Information importante
              </h3>
              <p className="text-gray-700 mb-2">
                Chaque lieu suit ses propres commissions et factures.
              </p>
              <p className="text-gray-600 text-sm">
                L&apos;activation définitive du lieu dépend de la configuration du moyen de paiement.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <p className="text-sm text-gray-500">
            Aucun paiement ne sera effectué sans confirmation.
          </p>
          <p className="text-sm text-gray-600">
            <button
              onClick={onBack}
              className="text-[#5a03cf] hover:underline transition-all"
              style={{ fontWeight: '600' }}
            >
              Conditions de facturation
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
