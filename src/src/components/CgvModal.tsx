import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, ExternalLink, FileText, TrendingUp, Bell, Headphones } from 'lucide-react';

interface CgvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

export function CgvModal({ isOpen, onClose, onSubscribe }: CgvModalProps) {
  const [acceptCgv, setAcceptCgv] = useState(false);
  const [acceptPrelevement, setAcceptPrelevement] = useState(false);

  // Reset checkboxes when modal closes
  useEffect(() => {
    if (!isOpen) {
      setAcceptCgv(false);
      setAcceptPrelevement(false);
    }
  }, [isOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubscribe = () => {
    if (acceptCgv && acceptPrelevement) {
      onSubscribe();
    }
  };

  const isFormValid = acceptCgv && acceptPrelevement;

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cgv-modal-title"
    >
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] px-6 py-5 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 
                id="cgv-modal-title"
                className="text-xl sm:text-2xl text-white mb-2"
              >
                Abonnement Premium B2B
              </h2>
              <p className="text-sm text-white/90">Conditions Générales de Vente</p>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Fermer la modal"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Benefits Section */}
          <div>
            <h3 className="text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#9cff02]" />
              Avantages inclus dans votre abonnement
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-gray-900 dark:text-white font-medium mb-1">Réservations prioritaires</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Gestion avancée des réservations clients</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-gray-900 dark:text-white font-medium mb-1">Analytics avancés</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Statistiques détaillées en temps réel</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-gray-900 dark:text-white font-medium mb-1">Notifications push</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Alertes instantanées pour vos réservations</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-gray-900 dark:text-white font-medium mb-1">Support prioritaire</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Assistance dédiée 7j/7</p>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Checkboxes Section */}
          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg text-gray-900 dark:text-white mb-4">
              Acceptation des conditions (obligatoire)
            </h3>

            {/* First Checkbox - CGV */}
            <div className="relative">
              <label 
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  acceptCgv 
                    ? 'bg-[#9cff02]/10 border-[#9cff02] dark:bg-[#9cff02]/5' 
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
                htmlFor="accept-cgv"
              >
                <div className="relative flex items-center justify-center w-6 h-6 mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    id="accept-cgv"
                    checked={acceptCgv}
                    onChange={(e) => setAcceptCgv(e.target.checked)}
                    className="w-6 h-6 rounded border-2 border-gray-300 dark:border-gray-600 text-[#5a03cf] focus:ring-2 focus:ring-[#5a03cf] focus:ring-offset-2 cursor-pointer"
                    aria-required="true"
                    aria-describedby="cgv-description"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-gray-900 dark:text-white">
                    J'accepte les{' '}
                    <a
                      href="/terms-of-sale"
                      className="text-[#5a03cf] hover:text-[#7a23ef] underline inline-flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Conditions Générales de Vente B2B
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </span>
                  <p id="cgv-description" className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Consultez nos conditions commerciales pour les professionnels
                  </p>
                </div>
              </label>
            </div>

            {/* Second Checkbox - Prélèvement */}
            <div className="relative">
              <label 
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  acceptPrelevement 
                    ? 'bg-[#9cff02]/10 border-[#9cff02] dark:bg-[#9cff02]/5' 
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
                htmlFor="accept-prelevement"
              >
                <div className="relative flex items-center justify-center w-6 h-6 mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    id="accept-prelevement"
                    checked={acceptPrelevement}
                    onChange={(e) => setAcceptPrelevement(e.target.checked)}
                    className="w-6 h-6 rounded border-2 border-gray-300 dark:border-gray-600 text-[#5a03cf] focus:ring-2 focus:ring-[#5a03cf] focus:ring-offset-2 cursor-pointer"
                    aria-required="true"
                    aria-describedby="prelevement-description"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-gray-900 dark:text-white">
                    J'autorise les prélèvements automatiques via Stripe
                  </span>
                  <p id="prelevement-description" className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Paiement sécurisé renouvelé automatiquement chaque mois
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Legal Notice - B2B Warning */}
          <div className="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-gray-900 dark:text-white font-semibold mb-2 flex items-center gap-2">
                  Contrat B2B ferme et définitif
                  <span className="px-2 py-0.5 bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 text-xs rounded-full">
                    Art. L441-6 C.com
                  </span>
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  En tant que professionnel, vous ne bénéficiez pas du droit de rétractation de 14 jours. 
                  Ce contrat B2B est <strong>ferme et définitif</strong> dès validation du paiement.
                  L'abonnement est <strong>sans engagement</strong> et résiliable à tout moment depuis votre espace facturation.
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Info */}
          <div className="bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 dark:from-[#5a03cf]/20 dark:to-[#9cff02]/20 border border-[#5a03cf]/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tarif mensuel</p>
                <p className="text-2xl text-gray-900 dark:text-white">
                  49€ <span className="text-base text-gray-600 dark:text-gray-400">HT/mois</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Soit 58,80€ TTC/mois (TVA 20%)</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Fréquence</p>
                <p className="text-gray-900 dark:text-white font-medium">Mensuel</p>
                <p className="text-xs text-[#9cff02] dark:text-[#9cff02] mt-1">Sans engagement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4 sm:px-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-center"
              aria-label="Annuler et fermer"
            >
              Annuler
            </button>
            <button
              onClick={handleSubscribe}
              disabled={!isFormValid}
              className={`flex-1 px-6 py-3 rounded-xl transition-all text-center font-medium ${
                isFormValid
                  ? 'bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white hover:brightness-110 shadow-lg shadow-[#5a03cf]/30'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
              }`}
              aria-label="Souscrire à l'abonnement"
              aria-disabled={!isFormValid}
            >
              {isFormValid ? (
                <>Souscrire 49€ HT/mois</>
              ) : (
                <>Veuillez accepter les conditions</>
              )}
            </button>
          </div>
          {!isFormValid && (
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3" role="status">
              Les deux cases doivent être cochées pour continuer
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
