/**
 * Share Referral Modal
 * 
 * Modal pour partager son code de parrainage via différents canaux
 * Design: fond blanc avec boutons Match
 */

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ShareReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode: string;
  referralLink: string;
}

export function ShareReferralModal({
  isOpen,
  onClose,
  referralCode,
  referralLink,
}: ShareReferralModalProps) {
  const [customMessage, setCustomMessage] = useState('');
  const [copiedTarget, setCopiedTarget] = useState<'link' | 'grid-link' | 'message' | null>(null);
  const canUseNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  const normalizedReferralLink = referralLink.replace('/signup?ref=', '/register?ref=');

  useEffect(() => {
    if (!copiedTarget) return;
    const timeoutId = window.setTimeout(() => {
      setCopiedTarget(null);
    }, 1400);
    return () => window.clearTimeout(timeoutId);
  }, [copiedTarget]);

  if (!isOpen) return null;

  const defaultMessage = `Bonjour,\n\nJe vous invite à rejoindre Match, la plateforme #1 pour les restaurateurs qui diffusent les grands matchs.\n\nEn utilisant mon lien ou mon code de parrainage, un boost gratuit vous est offert pour démarrer.\n\nCode : ${referralCode}\nLien : ${normalizedReferralLink}`;

  const message = customMessage || defaultMessage;

  const copyToClipboard = (text: string, target?: 'link' | 'grid-link' | 'message') => {
    navigator.clipboard.writeText(text);
    if (target) setCopiedTarget(target);
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
        url: normalizedReferralLink,
      });
    } catch {
      // User cancelled or error
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl text-gray-900">Partagez votre code</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-[#5a03cf] transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-2">
            Votre lien de parrainage
          </label>
          <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl">
            <input
              type="text"
              value={normalizedReferralLink}
              readOnly
              className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
            />
            <button
              onClick={() => copyToClipboard(normalizedReferralLink, 'link')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                copiedTarget === 'link'
                  ? 'bg-[#9cff02] text-[#1f2937] scale-[1.02]'
                  : 'bg-[#5a03cf] text-white hover:bg-[#4a02af]'
              }`}
            >
              {copiedTarget === 'link' ? '✓ Copié' : '📋 Copier'}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-gray-600 mb-3">
            Partagez via
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={shareViaWhatsApp}
              className="flex flex-col items-center gap-2 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-[#5a03cf]/5 hover:border-[#5a03cf]/20 hover:-translate-y-0.5 transition-all text-gray-700"
            >
              <span className="text-2xl">💬</span>
              <span className="text-xs">WhatsApp</span>
            </button>

            <button
              onClick={shareViaEmail}
              className="flex flex-col items-center gap-2 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-[#5a03cf]/5 hover:border-[#5a03cf]/20 hover:-translate-y-0.5 transition-all text-gray-700"
            >
              <span className="text-2xl">✉️</span>
              <span className="text-xs">Email</span>
            </button>

            <button
              onClick={shareViaSMS}
              className="flex flex-col items-center gap-2 p-4 bg-gray-50 border border-gray-200 rounded-xl hover:bg-[#5a03cf]/5 hover:border-[#5a03cf]/20 hover:-translate-y-0.5 transition-all text-gray-700"
            >
              <span className="text-2xl">📱</span>
              <span className="text-xs">SMS</span>
            </button>

            <button
              onClick={() => copyToClipboard(message, 'message')}
              className={`flex flex-col items-center gap-2 p-4 border rounded-xl transition-all text-gray-700 ${
                copiedTarget === 'message'
                  ? 'bg-[#9cff02]/20 border-[#9cff02] scale-[1.02]'
                  : 'bg-gray-50 border-gray-200 hover:bg-[#5a03cf]/5 hover:border-[#5a03cf]/20 hover:-translate-y-0.5'
              }`}
            >
              <span className="text-2xl">{copiedTarget === 'message' ? '✅' : '📄'}</span>
              <span className="text-xs text-center">{copiedTarget === 'message' ? 'Texte copié' : 'Copier texte'}</span>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-gray-600">Message suggéré</label>
            <button
              onClick={() => setCustomMessage(defaultMessage)}
              className="text-xs text-[#5a03cf] hover:underline"
            >
              Réinitialiser
            </button>
          </div>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
            <textarea
              value={customMessage || defaultMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="w-full h-32 bg-transparent text-sm text-gray-700 outline-none resize-none"
              placeholder="Votre message personnalisé..."
            />
          </div>
        </div>

        {canUseNativeShare && (
          <button
            onClick={shareViaNativeAPI}
            className="w-full px-6 py-3 bg-[#5a03cf] text-white font-semibold rounded-xl hover:bg-[#4a02af] hover:-translate-y-0.5 transition-all"
          >
            Partager maintenant
          </button>
        )}
      </div>
    </div>
  );
}
