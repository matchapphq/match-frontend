import { ArrowLeft, Check } from 'lucide-react';
import { useState } from 'react';
import { PageType } from '../../App';
import { useAuth } from '../../context/AuthContext';

interface FacturationProps {
  onBack: () => void;
  onNavigate: (page: PageType) => void;
  isOnboarding?: boolean;
}

export function Facturation({ onBack, onNavigate, isOnboarding = false }: FacturationProps) {
  const { completeOnboarding } = useAuth();
  const [selectedFormule, setSelectedFormule] = useState<'mensuel' | 'annuel' | null>(null);

  const handleChooseFormule = (formule: 'mensuel' | 'annuel') => {
    setSelectedFormule(formule);
    
    // Simuler la validation de la formule
    setTimeout(() => {
      if (isOnboarding) {
        completeOnboarding();
        onNavigate('dashboard');
      } else {
        alert(`Formule ${formule} sélectionnée !`);
        onNavigate('mes-restaurants');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5a03cf]/10 via-gray-50 to-[#9cff02]/10 p-8 relative overflow-hidden">
      {/* Bouton retour */}
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
        {/* 1️⃣ Header explicatif */}
        <div className="text-center mb-12">
          <h1 className="text-5xl italic mb-3" style={{ fontWeight: '700', color: '#5a03cf' }}>
            Choisissez la formule adaptée à votre établissement
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Chaque établissement dispose de son propre abonnement.
          </p>
          <p className="text-sm text-gray-500">
            Vous pourrez ajouter d'autres établissements plus tard.
          </p>
        </div>

        {/* 2️⃣ Choix de la formule - Cartes Mensuel / Annuel */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* 🟣 Carte Mensuel */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/50 p-8">
            <div className="mb-6">
              <h2 className="text-2xl mb-2" style={{ fontWeight: '700', color: '#5a03cf' }}>
                Mensuel
              </h2>
              <div className="mb-1">
                <span className="text-4xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
                  30€
                </span>
                <span className="text-gray-600 text-lg"> / mois</span>
              </div>
              <p className="text-sm text-gray-500">Engagement 12 mois</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#5a03cf]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#5a03cf]" strokeWidth={3} />
                </div>
                <span className="text-gray-700">Facturation mensuelle</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#5a03cf]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#5a03cf]" strokeWidth={3} />
                </div>
                <span className="text-gray-700">Tous les avantages Match</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#5a03cf]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#5a03cf]" strokeWidth={3} />
                </div>
                <span className="text-gray-700">Résiliation possible après 12 mois</span>
              </div>
            </div>

            {/* CTA secondaire (outline) */}
            <button
              onClick={() => handleChooseFormule('mensuel')}
              disabled={selectedFormule !== null}
              className="w-full py-4 rounded-xl border-2 border-[#5a03cf]/30 text-[#5a03cf] hover:bg-[#5a03cf]/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontWeight: '600' }}
            >
              {selectedFormule === 'mensuel' ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-[#5a03cf]/30 border-t-[#5a03cf] rounded-full animate-spin"></div>
                  Validation...
                </span>
              ) : (
                'Choisir cette formule'
              )}
            </button>
          </div>

          {/* 🟢 Carte Annuel (recommandée) */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-200/50 p-8 relative">
            {/* Badge économie discret */}
            <div className="absolute top-4 right-4">
              <div className="bg-white/70 backdrop-blur-sm rounded-full px-3 py-1 border border-gray-200/50">
                <span className="text-xs" style={{ fontWeight: '600', color: '#9cff02' }}>
                  Économie de 60€ / an
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl mb-2" style={{ fontWeight: '700', color: '#5a03cf' }}>
                Annuel
              </h2>
              <div className="mb-1">
                <span className="text-4xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
                  25€
                </span>
                <span className="text-gray-600 text-lg"> / mois</span>
              </div>
              <p className="text-sm text-gray-500">Soit 300€ / an</p>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#9cff02]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#5a03cf]" strokeWidth={3} />
                </div>
                <span className="text-gray-700">Facturation annuelle</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#9cff02]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#5a03cf]" strokeWidth={3} />
                </div>
                <span className="text-gray-700">Tous les avantages Match</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#9cff02]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#5a03cf]" strokeWidth={3} />
                </div>
                <span className="text-gray-700">Meilleur rapport qualité/prix</span>
              </div>
            </div>

            {/* CTA principal avec dégradé Match */}
            <button
              onClick={() => handleChooseFormule('annuel')}
              disabled={selectedFormule !== null}
              className="w-full bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white py-4 rounded-xl hover:brightness-105 hover:scale-[1.01] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontWeight: '600' }}
            >
              {selectedFormule === 'annuel' ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Validation...
                </span>
              ) : (
                'Choisir cette formule'
              )}
            </button>
          </div>
        </div>

        {/* 3️⃣ Bloc information importante */}
        <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#5a03cf]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-lg" style={{ fontWeight: '700', color: '#5a03cf' }}>ℹ️</span>
            </div>
            <div>
              <h3 className="text-lg mb-2" style={{ fontWeight: '600', color: '#5a03cf' }}>
                Information importante
              </h3>
              <p className="text-gray-700 mb-2">
                Un abonnement correspond à un établissement.
              </p>
              <p className="text-gray-600 text-sm">
                Si vous gérez plusieurs lieux, chaque établissement dispose de son propre abonnement.
              </p>
            </div>
          </div>
        </div>

        {/* 4️⃣ Footer de validation */}
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
              Conditions d'abonnement
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
