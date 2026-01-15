import { ArrowLeft, CreditCard, Calendar, Lock, Receipt, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { PageType } from '../App';
import { useAuth } from '../context/AuthContext';

interface PaiementValidationProps {
  onBack: () => void;
  onNavigate: (page: PageType) => void;
  selectedFormule?: 'mensuel' | 'annuel';
  nomBar?: string;
}

export function PaiementValidation({ onBack, onNavigate, selectedFormule = 'mensuel', nomBar = '' }: PaiementValidationProps) {
  const { completeOnboarding } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    nomCarte: '',
    numeroCarte: '',
    dateExpiration: '',
    cvv: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const formuleDetails = {
    mensuel: {
      prix: '30€',
      periode: 'mois',
      total: '30€',
      description: 'Facturation mensuelle - Engagement 12 mois',
    },
    annuel: {
      prix: '300€',
      periode: 'an',
      total: '300€',
      description: 'Facturation annuelle - Soit 25€/mois',
    },
  };

  const details = formuleDetails[selectedFormule];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simuler le paiement
    setTimeout(() => {
      completeOnboarding();
      onNavigate('confirmation-onboarding' as PageType);
    }, 2000);
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
              Informations de paiement
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nom sur la carte */}
            <div>
              <label htmlFor="nomCarte" className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                Nom sur la carte
              </label>
              <input
                id="nomCarte"
                type="text"
                value={formData.nomCarte}
                onChange={(e) => updateField('nomCarte', e.target.value)}
                placeholder="Jean Dupont"
                required
                disabled={isProcessing}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent transition-all disabled:opacity-50 placeholder-gray-400 dark:placeholder-gray-600"
              />
            </div>

            {/* Numéro de carte */}
            <div>
              <label htmlFor="numeroCarte" className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                Numéro de carte
              </label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  id="numeroCarte"
                  type="text"
                  value={formData.numeroCarte}
                  onChange={(e) => updateField('numeroCarte', e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  required
                  maxLength={19}
                  disabled={isProcessing}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent transition-all disabled:opacity-50 placeholder-gray-400 dark:placeholder-gray-600"
                />
              </div>
            </div>

            {/* Date et CVV */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dateExpiration" className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                  Date d'expiration
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    id="dateExpiration"
                    type="text"
                    value={formData.dateExpiration}
                    onChange={(e) => updateField('dateExpiration', e.target.value)}
                    placeholder="MM/AA"
                    required
                    maxLength={5}
                    disabled={isProcessing}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent transition-all disabled:opacity-50 placeholder-gray-400 dark:placeholder-gray-600"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="cvv" className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                  CVV
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                  <input
                    id="cvv"
                    type="text"
                    value={formData.cvv}
                    onChange={(e) => updateField('cvv', e.target.value)}
                    placeholder="123"
                    required
                    maxLength={3}
                    disabled={isProcessing}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] focus:border-transparent transition-all disabled:opacity-50 placeholder-gray-400 dark:placeholder-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Texte rassurant */}
            <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10 backdrop-blur-sm rounded-xl p-4 border border-green-200/30 dark:border-green-700/30">
              <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Lock className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span>Paiement 100% sécurisé - Vos informations sont cryptées</span>
              </p>
            </div>

            {/* Bloc 3 — Validation */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 bg-[#5a03cf] text-white rounded-xl hover:bg-[#4a02af] transition-all duration-200 shadow-lg shadow-[#5a03cf]/20 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Paiement en cours...
                </span>
              ) : (
                `Valider et payer ${details.total}`
              )}
            </button>

            {/* Mention légale */}
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              En validant, vous confirmez votre abonnement pour cet établissement.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}