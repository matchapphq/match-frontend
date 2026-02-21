/**
 * Share Referral Modal
 * 
 * Modal pour partager son code de parrainage via différents canaux
 * Design: Liquid glass effect avec les couleurs Match
 */

import { useState } from 'react';
import { toast } from 'sonner';

interface ShareReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode: string;
  referralLink: string;
  isVenueOwner?: boolean;
}

export function ShareReferralModal({
  isOpen,
  onClose,
  referralCode,
  referralLink,
  isVenueOwner = false,
}: ShareReferralModalProps) {
  const [customMessage, setCustomMessage] = useState('');
  const canUseNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  if (!isOpen) return null;

  const defaultMessage = isVenueOwner
    ? `Rejoignez Match, la plateforme #1 pour gérer vos événements sportifs !\n\nUtilisez mon code: ${referralCode}\nou cliquez ici: ${referralLink}\n\nVous aurez 1 mois gratuit ! 🎁`
    : `Salut ! 👋\n\nJe t'invite à rejoindre Match, la plateforme pour réserver ta place dans les meilleurs bars sportifs !\n\nUtilise mon code: ${referralCode}\nou clique ici: ${referralLink}\n\nTu gagneras un boost ! 🚀`;

  const message = customMessage || defaultMessage;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copié !');
  };

  const shareViaWhatsApp = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Rejoins Match avec mon code de parrainage !');
    const body = encodeURIComponent(message);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const shareViaSMS = () => {
    const encodedMessage = encodeURIComponent(message);
    window.location.href = `sms:?body=${encodedMessage}`;
  };

  const shareViaNativeAPI = async () => {
    if (!canUseNativeShare) {
      toast.error('Partage non supporté sur ce navigateur');
      return;
    }

    try {
      await navigator.share({
        title: 'Code de parrainage Match',
        text: message,
        url: referralLink,
      });
    } catch (error) {
      // User cancelled or error
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Partagez votre code</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Referral Link */}
        <div className="mb-6">
          <label className="block text-sm text-white/70 mb-2">
            Votre lien de parrainage
          </label>
          <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 bg-transparent text-sm outline-none"
            />
            <button
              onClick={() => copyToClipboard(referralLink)}
              className="px-3 py-1.5 bg-gradient-to-r from-[#9cff02] to-[#5a03cf] text-black text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              📋 Copier
            </button>
          </div>
        </div>

        {/* Share Options */}
        <div className="mb-6">
          <label className="block text-sm text-white/70 mb-3">
            Partagez via
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* WhatsApp */}
            <button
              onClick={shareViaWhatsApp}
              className="flex flex-col items-center gap-2 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
            >
              <span className="text-2xl">💬</span>
              <span className="text-xs">WhatsApp</span>
            </button>

            {/* Email */}
            <button
              onClick={shareViaEmail}
              className="flex flex-col items-center gap-2 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
            >
              <span className="text-2xl">✉️</span>
              <span className="text-xs">Email</span>
            </button>

            {/* SMS */}
            <button
              onClick={shareViaSMS}
              className="flex flex-col items-center gap-2 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
            >
              <span className="text-2xl">📱</span>
              <span className="text-xs">SMS</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={() => copyToClipboard(referralLink)}
              className="flex flex-col items-center gap-2 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
            >
              <span className="text-2xl">🔗</span>
              <span className="text-xs">Lien</span>
            </button>
          </div>
        </div>

        {/* Custom Message */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-white/70">Message suggéré</label>
            <button
              onClick={() => setCustomMessage(defaultMessage)}
              className="text-xs text-[#9cff02] hover:underline"
            >
              ✏️ Modifier
            </button>
          </div>
          <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
            <textarea
              value={customMessage || defaultMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full h-32 bg-transparent text-sm outline-none resize-none"
              placeholder="Votre message personnalisé..."
            />
          </div>
        </div>

        {/* Share Button (Native API) */}
        {canUseNativeShare && (
          <button
            onClick={shareViaNativeAPI}
            className="w-full px-6 py-3 bg-gradient-to-r from-[#9cff02] to-[#5a03cf] text-black font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Partager maintenant
          </button>
        )}
      </div>
    </div>
  );
}
