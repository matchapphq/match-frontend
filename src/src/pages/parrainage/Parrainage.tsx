/**
 * Parrainage Page
 * 
 * Page dédiée au système de parrainage
 * 1 parrainage = 1 boost
 * Noms anonymisés
 */

import { useState } from 'react';
import { toast } from 'sonner@2.0.3';
import { ShareReferralModal } from '../../components/ShareReferralModal';
import { ArrowLeft, Copy, Share2, Users, TrendingUp, Gift } from 'lucide-react';
import {
  mockUserReferralCode,
  mockUserReferralStats,
  mockReferralHistory,
  mockVenueOwnerReferralCode,
  mockVenueOwnerReferralStats,
} from '../../data/mockData';

interface ParrainageProps {
  onBack?: () => void;
}

export function Parrainage({ onBack }: ParrainageProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data
  const isVenueOwner = true;
  const referralCode = isVenueOwner ? mockVenueOwnerReferralCode.referral_code : mockUserReferralCode.referral_code;
  const stats = isVenueOwner ? mockVenueOwnerReferralStats : mockUserReferralStats;
  const referralLink = `https://match.app/signup?ref=${referralCode}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Code copié !');
  };

  const filteredHistory = (mockReferralHistory.referred_users || []).filter((referral) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'converted') return referral.status === 'converted';
    if (statusFilter === 'pending') return referral.status === 'signed_up';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto pb-24 lg:pb-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
          <h1 className="text-xl sm:text-2xl lg:text-3xl mb-1 text-gray-900 dark:text-white">
            Programme de <span className="text-[#5a03cf]">Parrainage</span> 🎁
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Invitez d'autres restaurateurs et gagnez des boosts gratuits
          </p>
        </div>

        {/* Main Referral Card */}
        <div className="bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] rounded-2xl p-6 sm:p-8 mb-8 text-white shadow-xl">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl mb-3">Votre code de parrainage</h2>
            <p className="text-white/80 mb-6">
              Partagez votre code avec d'autres restaurateurs. Pour chaque inscription, vous gagnez 1 boost gratuit !
            </p>
            
            {/* Referral Code */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="text-xs text-white/60 mb-1">Votre code</div>
                  <div className="text-2xl font-mono font-bold tracking-wider">{referralCode}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(referralCode)}
                    className="px-4 py-2.5 bg-white text-[#5a03cf] rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2 font-medium shadow-lg"
                  >
                    <Copy className="w-4 h-4" />
                    Copier
                  </button>
                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="px-4 py-2.5 bg-[#9cff02] text-black rounded-xl hover:bg-[#8ce002] transition-colors flex items-center gap-2 font-medium shadow-lg"
                  >
                    <Share2 className="w-4 h-4" />
                    Partager
                  </button>
                </div>
              </div>
            </div>

            <div className="text-xs text-white/60">
              Lien: {referralLink}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.total_invited}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Invités au total</div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.total_signed_up}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Inscrits</div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                <Gift className="w-6 h-6 text-[#5a03cf]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stats.total_converted}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Convertis</div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm border-[#9cff02]/30">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#9cff02]/20 to-[#7cdf00]/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-[#5a03cf] mb-1">{stats.total_rewards_earned}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Boosts gagnés</div>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm mb-8">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg text-gray-900 dark:text-white">Comment ça marche ?</h2>
          </div>
          <div className="p-6">
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#5a03cf]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📤</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">1. Partagez</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Envoyez votre code à vos contacts restaurateurs
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#5a03cf]/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">✍️</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">2. Inscription</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ils s'inscrivent avec votre code
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#9cff02]/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">3. Gagnez</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Recevez 1 boost gratuit par parrainage
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral History */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-lg text-gray-900 dark:text-white">Historique des parrainages</h2>
              
              {/* Filter */}
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-1.5 rounded-md text-sm transition-all duration-200 ${
                    statusFilter === 'all'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setStatusFilter('converted')}
                  className={`px-4 py-1.5 rounded-md text-sm transition-all duration-200 ${
                    statusFilter === 'converted'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Convertis
                </button>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-4 py-1.5 rounded-md text-sm transition-all duration-200 ${
                    statusFilter === 'pending'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  En attente
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">Aucun parrainage pour ce filtre</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Commencez à partager votre code pour voir vos parrainages ici
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredHistory.map((referral) => (
                  <div
                    key={referral.id}
                    className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#5a03cf]/20 to-[#7a23ef]/20 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-[#5a03cf]" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{referral.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Invité le {new Date(referral.created_at).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                            referral.status === 'converted'
                              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                              : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                          }`}
                        >
                          {referral.status === 'converted' ? '✓ Converti' : '⏳ En attente'}
                        </span>
                        {referral.status === 'converted' && referral.converted_at && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            le {new Date(referral.converted_at).toLocaleDateString('fr-FR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareReferralModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        referralCode={referralCode}
        referralLink={referralLink}
        isVenueOwner={isVenueOwner}
      />
    </div>
  );
}