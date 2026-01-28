import { CheckCircle, Sparkles, Calendar, Settings, Download } from 'lucide-react';
import { PageType } from '../../app/App';
// import logoMatch from 'figma:asset/c263754cf7a254d8319da5c6945751d81a6f5a94.png';
import logoMatch from '../../../assets/logo.png';
import { useEffect } from 'react';
import { useAuth } from '../../features/authentication/context/AuthContext';
import { API_ENDPOINTS } from '../../utils/api-constants';
import { apiPost } from '../../utils/api-helpers';

interface PaiementValidationProps {
  onBack: () => void;
  onNavigate: (page: PageType) => void;
  selectedFormule?: 'mensuel' | 'annuel';
  nomBar?: string;
}

export function PaiementValidation({ onBack, onNavigate, selectedFormule = 'mensuel', nomBar = '' }: PaiementValidationProps) {
  const { completeOnboarding, authToken } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isCgvModalOpen, setIsCgvModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formuleDetails = {
    mensuel: {
      prix: '30€',
      periode: 'mois',
      total: '30€',
      description: 'Facturation mensuelle - Sans engagement',
      stripePrice: 30,
      stripePeriod: 'monthly' as const,
    },
    annuel: {
      prix: '300€',
      periode: 'an',
      total: '300€',
      description: 'Facturation annuelle - Soit 25€/mois',
      stripePrice: 300,
      stripePeriod: 'yearly' as const,
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
      // Appel API pour créer une session Stripe Checkout
      const data = await apiPost(
        API_ENDPOINTS.SUBSCRIPTIONS_CREATE_CHECKOUT,
        {
          plan: 'basic',
          billing_period: details.stripePeriod,
        },
        authToken || 'mock-token'
      );

      // Redirection vers Stripe Checkout
      if (data.checkout_url) {
        // Dans un vrai environnement, rediriger vers Stripe
        // window.location.href = data.checkout_url;
        
        // Pour la démo, simuler le succès après un délai
        setTimeout(() => {
          completeOnboarding();
          onNavigate('confirmation-onboarding' as PageType);
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] p-4 sm:p-8 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5a03cf]/5 dark:bg-[#5a03cf]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#9cff02]/5 dark:bg-[#9cff02]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5a03cf]/3 dark:bg-[#5a03cf]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Bouton retour */}
        <div className="mb-6">
          <button
            onClick={onBack}
            disabled={isProcessing}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-50 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Retour</span>
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 dark:from-[#5a03cf]/20 dark:to-[#9cff02]/20 rounded-2xl mb-6">
            <CreditCard className="w-8 h-8 text-[#5a03cf] dark:text-[#7a23ef]" />
          </div>
          <h1 className="text-3xl sm:text-4xl mb-3 text-gray-900 dark:text-white">
            Paiement & validation
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Finalisez votre abonnement pour activer votre établissement
          </p>
        </div>

        {/* Bloc 1 — Récapitulatif */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Receipt className="w-5 h-5 text-[#5a03cf] dark:text-[#7a23ef]" />
            <h2 className="text-xl text-gray-900 dark:text-white">
              Récapitulatif
            </h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200/50 dark:border-gray-700/50">
              <span className="text-gray-600 dark:text-gray-400">Établissement</span>
              <span className="text-gray-900 dark:text-white">{nomBar || 'Votre établissement'}</span>
            </div>
            
            <div className="flex justify-between items-center pb-3 border-b border-gray-200/50 dark:border-gray-700/50">
              <span className="text-gray-600 dark:text-gray-400">Formule</span>
              <span className="text-gray-900 dark:text-white">
                {selectedFormule === 'mensuel' ? 'Mensuel' : 'Annuel'}
              </span>
            </div>
            
            <div className="flex justify-between items-center pb-3 border-b border-gray-200/50 dark:border-gray-700/50">
              <span className="text-gray-600 dark:text-gray-400">Prix</span>
              <span className="text-gray-900 dark:text-white">{details.prix} / {details.periode}</span>
            </div>
            
            <div className="flex justify-between items-center pt-3">
              <span className="text-gray-900 dark:text-white">Total à payer</span>
              <span className="text-2xl text-[#5a03cf] dark:text-[#7a23ef]">{details.total}</span>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gradient-to-br from-[#5a03cf]/5 to-[#9cff02]/5 dark:from-[#5a03cf]/10 dark:to-[#9cff02]/10 backdrop-blur-sm rounded-xl border border-[#5a03cf]/20 dark:border-[#5a03cf]/30">
            <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#5a03cf] dark:text-[#7a23ef] flex-shrink-0" />
              <span><span className="font-medium text-[#5a03cf] dark:text-[#7a23ef]">Important :</span> 1 établissement = 1 abonnement</span>
            </p>
          </div>
        </div>

        {/* Bloc 2 — Paiement */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-[#5a03cf] dark:text-[#7a23ef]" />
            <h2 className="text-xl text-gray-900 dark:text-white">
              Conditions et validation
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Logo Stripe - Paiement sécurisé */}
            <div className="bg-gradient-to-br from-[#635bff]/5 to-[#635bff]/10 dark:from-[#635bff]/10 dark:to-[#635bff]/20 backdrop-blur-sm rounded-xl p-6 border border-[#635bff]/20 dark:border-[#635bff]/30 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Lock className="w-5 h-5 text-[#635bff]" />
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  Paiement sécurisé par Stripe
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Vous serez redirigé vers une page de paiement sécurisée Stripe pour finaliser votre abonnement.
              </p>
            </div>

            {/* Informations sans engagement */}
            <div className="bg-gradient-to-br from-[#9cff02]/5 to-[#9cff02]/10 dark:from-[#9cff02]/10 dark:to-[#9cff02]/20 backdrop-blur-sm rounded-xl p-4 border border-[#9cff02]/20 dark:border-[#9cff02]/30">
              <div className="space-y-2">
                <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#9cff02] flex-shrink-0" />
                  <span className="font-medium">Sans engagement - Résiliable à tout moment</span>
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 pl-6">
                  Vous pouvez annuler votre abonnement quand vous le souhaitez, directement depuis votre espace ou en nous contactant.
                </p>
              </div>
            </div>

            {/* Acceptation des CGV - Obligatoire (France) */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  disabled={isProcessing}
                  className="w-5 h-5 mt-0.5 rounded border-gray-300 dark:border-gray-600 text-[#5a03cf] focus:ring-[#5a03cf] focus:ring-offset-0 disabled:opacity-50 cursor-pointer"
                  required
                />
                <label htmlFor="acceptTerms" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer flex-1">
                  <span className="block">
                    J'accepte les{' '}
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); setIsCgvModalOpen(true); }}
                      className="text-[#5a03cf] dark:text-[#7a23ef] hover:underline font-medium"
                    >
                      Conditions Générales de Vente (CGV)
                    </a>
                    {' '}et les{' '}
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); alert('Redirection vers les CGU'); }}
                      className="text-[#5a03cf] dark:text-[#7a23ef] hover:underline font-medium"
                    >
                      Conditions Générales d'Utilisation (CGU)
                    </a>
                  </span>
                  <span className="block mt-2 text-xs text-gray-600 dark:text-gray-400">
                    Conformément à la loi française, vous disposez d'un droit de rétractation de 14 jours à compter de la souscription.
                  </span>
                </label>
              </div>

              {!acceptedTerms && (
                <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                  <span className="w-1 h-1 bg-red-600 dark:bg-red-400 rounded-full"></span>
                  Vous devez accepter les conditions pour continuer
                </p>
              )}
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Bloc 3 — Validation */}
            <button
              type="submit"
              disabled={isProcessing || !acceptedTerms}
              className="w-full py-4 bg-[#5a03cf] text-white rounded-xl hover:bg-[#4a02af] transition-all duration-200 shadow-lg shadow-[#5a03cf]/20 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Redirection vers le paiement...
                </span>
              ) : (
                `Continuer vers le paiement (${details.total})`
              )}
            </button>

            {/* Mentions légales détaillées */}
            <div className="space-y-2 pt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                En continuant, vous confirmez votre abonnement {selectedFormule === 'mensuel' ? 'mensuel' : 'annuel'} pour cet établissement.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                L'abonnement est sans engagement et peut être résilié à tout moment. Le montant sera prélevé automatiquement chaque {selectedFormule === 'mensuel' ? 'mois' : 'année'}.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Conformément aux articles L221-18 et suivants du Code de la consommation, vous disposez d'un délai de rétractation de 14 jours.
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Modal CGV */}
      <CgvModal 
        isOpen={isCgvModalOpen} 
        onClose={() => setIsCgvModalOpen(false)} 
        onSubscribe={() => {
          setAcceptedTerms(true);
          setIsCgvModalOpen(false);
        }}
      />
    </div>
  );
}