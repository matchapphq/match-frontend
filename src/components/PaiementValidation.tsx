import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { PageType } from '../App';
import patternBg from 'figma:asset/20e2f150b2f5f4be01b1aec94edb580bb26d8dcf.png';
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
    <div className="min-h-screen bg-gradient-to-br from-[#5a03cf]/10 via-gray-50 to-[#9cff02]/10 p-8 relative overflow-hidden">
      {/* Pattern de fond avec éclairs */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.05]"
        style={{
          backgroundImage: `url(${patternBg})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '400px',
        }}
      ></div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Bouton retour */}
        <div className="mb-6">
          <button
            onClick={onBack}
            disabled={isProcessing}
            className="flex items-center gap-2 text-gray-600 hover:text-[#5a03cf] transition-colors disabled:opacity-50"
            style={{ fontWeight: '600' }}
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl italic mb-3" style={{ fontWeight: '700', color: '#5a03cf' }}>
            Paiement & validation
          </h1>
          <p className="text-lg text-gray-600">
            Finalisez votre abonnement pour activer votre établissement
          </p>
        </div>

        {/* Bloc 1 — Récapitulatif */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/50 p-6 mb-6">
          <h2 className="text-xl mb-4" style={{ fontWeight: '600', color: '#5a03cf' }}>
            Récapitulatif
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200/50">
              <span className="text-gray-700">Établissement</span>
              <span className="text-gray-900" style={{ fontWeight: '600' }}>{nomBar || 'Votre établissement'}</span>
            </div>
            
            <div className="flex justify-between items-center pb-3 border-b border-gray-200/50">
              <span className="text-gray-700">Formule</span>
              <span className="text-gray-900" style={{ fontWeight: '600' }}>
                {selectedFormule === 'mensuel' ? 'Mensuel' : 'Annuel'}
              </span>
            </div>
            
            <div className="flex justify-between items-center pb-3 border-b border-gray-200/50">
              <span className="text-gray-700">Prix</span>
              <span className="text-gray-900" style={{ fontWeight: '600' }}>{details.prix} / {details.periode}</span>
            </div>
            
            <div className="flex justify-between items-center pt-3">
              <span className="text-gray-900" style={{ fontWeight: '700' }}>Total à payer</span>
              <span className="text-2xl" style={{ fontWeight: '700', color: '#5a03cf' }}>{details.total}</span>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50/50 backdrop-blur-sm rounded-xl border border-gray-200/30">
            <p className="text-sm text-gray-600">
              <span style={{ fontWeight: '600', color: '#5a03cf' }}>Important :</span> 1 établissement = 1 abonnement
            </p>
          </div>
        </div>

        {/* Bloc 2 — Paiement */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/50 p-6 mb-6">
          <h2 className="text-xl mb-4" style={{ fontWeight: '600', color: '#5a03cf' }}>
            Informations de paiement
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom sur la carte */}
            <div className="space-y-2">
              <label htmlFor="nomCarte" className="block text-gray-700" style={{ fontWeight: '600' }}>
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
                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf]/30 focus:border-[#5a03cf]/30 transition-all disabled:opacity-50"
              />
            </div>

            {/* Numéro de carte */}
            <div className="space-y-2">
              <label htmlFor="numeroCarte" className="block text-gray-700" style={{ fontWeight: '600' }}>
                Numéro de carte
              </label>
              <input
                id="numeroCarte"
                type="text"
                value={formData.numeroCarte}
                onChange={(e) => updateField('numeroCarte', e.target.value)}
                placeholder="1234 5678 9012 3456"
                required
                maxLength={19}
                disabled={isProcessing}
                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf]/30 focus:border-[#5a03cf]/30 transition-all disabled:opacity-50"
              />
            </div>

            {/* Date et CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="dateExpiration" className="block text-gray-700" style={{ fontWeight: '600' }}>
                  Date d'expiration
                </label>
                <input
                  id="dateExpiration"
                  type="text"
                  value={formData.dateExpiration}
                  onChange={(e) => updateField('dateExpiration', e.target.value)}
                  placeholder="MM/AA"
                  required
                  maxLength={5}
                  disabled={isProcessing}
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf]/30 focus:border-[#5a03cf]/30 transition-all disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="cvv" className="block text-gray-700" style={{ fontWeight: '600' }}>
                  CVV
                </label>
                <input
                  id="cvv"
                  type="text"
                  value={formData.cvv}
                  onChange={(e) => updateField('cvv', e.target.value)}
                  placeholder="123"
                  required
                  maxLength={3}
                  disabled={isProcessing}
                  className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf]/30 focus:border-[#5a03cf]/30 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Texte rassurant */}
            <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30">
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span style={{ fontWeight: '600', color: '#5a03cf' }}>🔒</span>
                Paiement 100% sécurisé - Vos informations sont cryptées
              </p>
            </div>

            {/* Bloc 3 — Validation */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white py-4 rounded-xl hover:brightness-105 hover:scale-[1.01] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontWeight: '600' }}
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
            <p className="text-xs text-gray-500 text-center">
              En validant, vous confirmez votre abonnement pour cet établissement.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}