/**
 * Parrainage Widget
 * 
 * Petit widget à afficher dans le dashboard
 * Promo du système de parrainage
 */

import { toast } from 'sonner';
import { useMyReferralCode, useReferralStats } from '../hooks/api';

interface ParrainageWidgetProps {
  onNavigate?: (page: string) => void;
}

export function ParrainageWidget({ onNavigate }: ParrainageWidgetProps) {
  // API hooks for referral data
  const { data: codeData } = useMyReferralCode();
  const { data: statsData } = useReferralStats();

  const referralCode = codeData?.code || 'XXXXXX';
  const stats = statsData || { successful_referrals: 0, total_boosts_earned: 0 };

  const copyToClipboard = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      toast.success('Code copié !');
    }
  };

  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate('parrainage');
    }
  };

  return (
    <div className="mt-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
      <div className="flex items-start gap-3 mb-4">
        <div className="text-3xl">🎁</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Programme de Parrainage</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Parrainez vos amis et gagnez des boosts !
          </p>
        </div>
      </div>

      {referralCode && (
        <div className="mb-4">
          <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
            <span className="flex-1 font-mono text-sm text-[#9cff02]">
              {referralCode}
            </span>
            <button
              onClick={copyToClipboard}
              className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-xs rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-900 dark:text-white"
            >
              📋 Copier
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="text-gray-600 dark:text-gray-400">
          📊 {stats.total_converted} ami{stats.total_converted !== 1 ? 's' : ''} parrainé{stats.total_converted !== 1 ? 's' : ''}
        </div>
        <div className="text-[#9cff02] font-medium">
          {stats.total_rewards_earned} boost{stats.total_rewards_earned !== 1 ? 's' : ''}
        </div>
      </div>

      <button
        onClick={handleNavigate}
        className="w-full px-4 py-2.5 bg-gradient-to-r from-[#9cff02] to-[#5a03cf] text-black font-semibold rounded-xl hover:opacity-90 transition-opacity"
      >
        Voir plus
      </button>
    </div>
  );
}