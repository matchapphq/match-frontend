import { useEffect, useState } from 'react';
import { ArrowRight, Calendar, Check, CheckCircle2, Settings } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { PageType } from '../../../types';
import { getCheckoutState } from '../../../utils/checkout-state';

interface ConfirmationOnboardingProps {
  onNavigate: (page: PageType) => void;
  nomBar?: string;
  isAddingVenue?: boolean;
}

export function ConfirmationOnboarding({ onNavigate, nomBar, isAddingVenue = false }: ConfirmationOnboardingProps) {
  const location = useLocation();
  const locationState = (location.state as { venueName?: string } | null) ?? null;
  const [resolvedVenueName, setResolvedVenueName] = useState(nomBar || locationState?.venueName || '');

  useEffect(() => {
    if (resolvedVenueName.trim()) return;

    const savedState = getCheckoutState();
    if (savedState?.venueName) {
      setResolvedVenueName(savedState.venueName);
    }
  }, [resolvedVenueName]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] p-4 sm:p-8 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5a03cf]/5 dark:bg-[#5a03cf]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#9cff02]/5 dark:bg-[#9cff02]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5a03cf]/3 dark:bg-[#5a03cf]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 dark:from-[#5a03cf]/20 dark:to-[#9cff02]/20 rounded-2xl mb-6">
            <CheckCircle2 className="w-8 h-8 text-[#5a03cf] dark:text-[#7a23ef]" />
          </div>
          <h1 className="text-3xl sm:text-4xl mb-3 text-gray-900 dark:text-white">
            Confirmation
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Votre établissement a bien été ajouté.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-6">
            <section className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
              <div className="flex flex-col gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300">
                    <Check className="h-4 w-4" />
                    Ajout confirmé
                  </div>
                  <h2 className="mt-4 text-2xl sm:text-3xl text-gray-900 dark:text-white">
                    {resolvedVenueName ? `${resolvedVenueName} a bien été ajouté` : 'Votre établissement a bien été ajouté'}
                  </h2>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Vous pouvez maintenant le retrouver dans vos établissements.
                  </p>
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    Merci de contribuer à l&apos;aventure Match.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => onNavigate(isAddingVenue ? 'mes-restaurants' : 'dashboard')}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#5a03cf] px-5 py-4 text-white transition-all duration-200 shadow-lg shadow-[#5a03cf]/20 hover:bg-[#4a02af]"
                  >
                    {isAddingVenue ? 'Voir mes établissements' : 'Accéder au tableau de bord'}
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => onNavigate(isAddingVenue ? 'dashboard' : 'mes-restaurants')}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-4 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    {isAddingVenue ? (
                      <>
                        <Calendar className="h-5 w-5" />
                        Tableau de bord
                      </>
                    ) : (
                      <>
                        <Settings className="h-5 w-5" />
                        Gérer le lieu
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
