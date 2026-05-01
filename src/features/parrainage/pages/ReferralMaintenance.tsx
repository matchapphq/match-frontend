import { Loader2, Wrench, Ticket } from 'lucide-react';
import { useReferralCode } from '../../../hooks/api/useReferral';

interface ReferralMaintenanceProps {
  onBack?: () => void;
}

export function ReferralMaintenance({ onBack }: ReferralMaintenanceProps) {
  const { data, isLoading } = useReferralCode();
  const referralCode = data?.referral_code || '-';

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto pb-24 lg:pb-8">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 sm:p-8">
          <div className="w-14 h-14 rounded-xl bg-[#5a03cf]/10 flex items-center justify-center mb-5">
            <Wrench className="w-7 h-7 text-[#5a03cf]" />
          </div>

          <h1 className="text-2xl sm:text-3xl text-gray-900 dark:text-white mb-3">Page parrainage</h1>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Nous revoyons la logique et l&apos;implémentation des boost et du parrainage.
          </p>

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-4 sm:p-5 space-y-3">
            <p className="text-gray-800 dark:text-gray-200">
              Pas de panique, vous pouvez encore parrainer vos collègues/amis.
            </p>
            <div className="flex items-center gap-2 text-[#5a03cf] dark:text-[#9cff02]">
              <Ticket className="w-4 h-4" />
              <span className="text-sm sm:text-base">
                Votre code est le suivant :{' '}
                {isLoading ? <Loader2 className="inline w-4 h-4 animate-spin align-[-2px]" /> : referralCode}
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

