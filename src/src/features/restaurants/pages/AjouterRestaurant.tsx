import { useState } from 'react';
import { ArrowLeft, Check, CreditCard, Receipt, ShieldCheck, Sparkles } from 'lucide-react';
import { PageType } from '../../../types';
import { useAuth } from '../../authentication/context/AuthContext';

interface AjouterRestaurantProps {
  onBack: () => void;
  onNavigate: (page: PageType) => void;
  isOnboarding?: boolean;
  onFormuleSelected?: (formule: 'mensuel' | 'annuel') => void;
}

export function AjouterRestaurant({ onBack, onNavigate, isOnboarding = false, onFormuleSelected }: AjouterRestaurantProps) {
  const { updateOnboardingStep } = useAuth();
  const [selectedFormule, setSelectedFormule] = useState<'mensuel' | 'annuel' | null>(null);

  const handleChoisirOffre = (type: 'mensuel' | 'annuel') => {
    setSelectedFormule(type);

    if (onFormuleSelected) {
      onFormuleSelected(type);
    }

    setTimeout(() => {
      if (isOnboarding) {
        updateOnboardingStep('facturation');
      }
      onNavigate('infos-etablissement' as PageType);
    }, 800);
  };

  const formuleCards = [
    {
      id: 'mensuel' as const,
      title: 'Mensuel',
      price: '30€',
      suffix: '/ mois',
      helper: 'Sans engagement',
      description: 'Facturation mensuelle',
      features: [
        'Tous les avantages Match',
        'Résiliable à tout moment',
        'Activation rapide de votre établissement',
      ],
      containerClass: 'border-gray-200/50 dark:border-gray-700/50 bg-white/70 dark:bg-gray-900/70',
      buttonClass: 'border border-gray-200 bg-white text-[#5a03cf] hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-[#c9a7ff] dark:hover:bg-gray-800',
      badge: null,
    },
    {
      id: 'annuel' as const,
      title: 'Annuel',
      price: '25€',
      suffix: '/ mois',
      helper: 'Soit 300€ / an',
      description: 'Facturation annuelle',
      features: [
        'Tous les avantages Match',
        'Meilleur rapport qualité / prix',
        'Économie de 60€ sur l’année',
      ],
      containerClass: 'border-[#5a03cf]/20 dark:border-[#7a23ef]/30 bg-gradient-to-br from-[#5a03cf]/6 to-[#9cff02]/6 dark:from-[#5a03cf]/10 dark:to-[#9cff02]/10',
      buttonClass: 'bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white hover:from-[#6a13df] hover:to-[#8a33ff]',
      badge: 'Recommandé',
    },
  ];

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
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Retour</span>
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 dark:from-[#5a03cf]/20 dark:to-[#9cff02]/20 rounded-2xl mb-6">
            <CreditCard className="w-8 h-8 text-[#5a03cf] dark:text-[#7a23ef]" />
          </div>
          <h1 className="text-3xl sm:text-4xl mb-3 text-gray-900 dark:text-white">
            Choisissez votre formule
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Chaque établissement dispose de son propre abonnement Match.
          </p>
        </div>

        <div className="space-y-6">
          <section className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Receipt className="w-5 h-5 text-[#5a03cf] dark:text-[#7a23ef]" />
              <h2 className="text-xl text-gray-900 dark:text-white">Sélection de la formule</h2>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {formuleCards.map((card) => (
                <div
                  key={card.id}
                  className={`relative rounded-2xl border p-6 backdrop-blur-xl transition-all ${card.containerClass}`}
                >
                  {card.badge && (
                    <span className="absolute right-4 top-4 rounded-full bg-[#5a03cf] px-2.5 py-1 text-[11px] text-white">
                      {card.badge}
                    </span>
                  )}

                  <div className="mb-6">
                    <h3 className="text-2xl text-gray-900 dark:text-white">{card.title}</h3>
                    <div className="mt-3">
                      <span className="text-4xl bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
                        {card.price}
                      </span>
                      <span className="ml-1 text-lg text-gray-600 dark:text-gray-400">{card.suffix}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{card.helper}</p>
                  </div>

                  <div className="mb-6 rounded-xl border border-gray-200/60 bg-gray-50/80 p-4 dark:border-gray-700/60 dark:bg-gray-900/40">
                    <p className="text-sm text-gray-900 dark:text-white">{card.description}</p>
                    <ul className="mt-3 space-y-2">
                      {card.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#9cff02] text-[#1a1a1a]">
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleChoisirOffre(card.id)}
                    disabled={selectedFormule !== null}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-sm transition-all disabled:cursor-not-allowed disabled:opacity-50 ${card.buttonClass}`}
                  >
                    {selectedFormule === card.id ? (
                      <>
                        <div className={`h-5 w-5 rounded-full border-2 ${card.id === 'annuel' ? 'border-white/30 border-t-white' : 'border-[#5a03cf]/30 border-t-[#5a03cf]'} animate-spin`} />
                        Validation...
                      </>
                    ) : (
                      'Choisir cette formule'
                    )}
                  </button>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
            <section className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-5 h-5 text-[#5a03cf] dark:text-[#7a23ef]" />
                <h2 className="text-xl text-gray-900 dark:text-white">À retenir</h2>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-gray-50/80 dark:bg-gray-900/50 p-4">
                  <p className="text-sm text-gray-900 dark:text-white">Un abonnement = un lieu</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Si vous gérez plusieurs établissements, chacun dispose de sa propre souscription.
                  </p>
                </div>

                <div className="rounded-xl border border-blue-200/60 dark:border-blue-900/40 bg-blue-50/80 dark:bg-blue-900/10 p-4">
                  <p className="text-sm text-gray-900 dark:text-white">Aucun paiement immédiat ici</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Vous confirmez d’abord la formule, puis vous renseignez les informations du lieu avant la validation finale.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="w-5 h-5 text-[#5a03cf] dark:text-[#7a23ef]" />
                <h2 className="text-xl text-gray-900 dark:text-white">Suite du parcours</h2>
              </div>

              <div className="rounded-xl border border-[#5a03cf]/20 dark:border-[#7a23ef]/30 bg-gradient-to-br from-[#5a03cf]/5 to-[#9cff02]/5 dark:from-[#5a03cf]/10 dark:to-[#9cff02]/10 p-4 flex-1">
                <div className="space-y-3">
                  <div className="rounded-xl border border-white/50 bg-white/70 p-3 dark:border-white/10 dark:bg-gray-950/20">
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#5a03cf] text-xs text-white">
                        1
                      </span>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Vous choisissez la formule adaptée à votre établissement.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/50 bg-white/70 p-3 dark:border-white/10 dark:bg-gray-950/20">
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#5a03cf] text-xs text-white">
                        2
                      </span>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Vous renseignez ensuite les informations du lieu.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/50 bg-white/70 p-3 dark:border-white/10 dark:bg-gray-950/20">
                    <div className="flex items-start gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#5a03cf] text-xs text-white">
                        3
                      </span>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Le paiement est finalisé à la dernière étape.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
