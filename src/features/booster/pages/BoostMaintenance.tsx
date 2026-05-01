import { Loader2, Wrench, Sparkles } from 'lucide-react';
import { useBoostSummary } from '../../../hooks/api/useBoosts';

interface BoostMaintenanceProps {
  onBack?: () => void;
}

export function BoostMaintenance({ onBack }: BoostMaintenanceProps) {
  const { data, isLoading } = useBoostSummary();
  const boostCount = Number(data?.available_boosts ?? 0);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto pb-24 lg:pb-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 sm:p-8">
          <div className="w-14 h-14 rounded-xl bg-[#5a03cf]/10 flex items-center justify-center mb-5">
            <Wrench className="w-7 h-7 text-[#5a03cf]" />
          </div>

          <h1 className="text-2xl sm:text-3xl text-gray-900 dark:text-white mb-3">Page boost</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Nous revoyons la logique et l&apos;implémentation des boost et du parrainage.
          </p>

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 space-y-3">
            <p className="text-gray-800 dark:text-gray-200">
              Si vous aviez des boosts, vous les conservez.
            </p>
            <div className="flex items-center gap-2 text-[#5a03cf] dark:text-[#9cff02]">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm sm:text-base">
                Votre nombre de boost est le suivant :{' '}
                {isLoading ? <Loader2 className="inline w-4 h-4 animate-spin align-[-2px]" /> : boostCount}
              </span>
            </div>
          </div>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mt-6 px-4 py-2.5 bg-[#5a03cf] text-white rounded-xl hover:bg-[#4a02af] transition-colors"
            >
              Retour
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

