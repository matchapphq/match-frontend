import { useState } from 'react';
import { PageType } from '../../types';
import {
  ArrowLeft,
  Loader2,
  KeyRound,
  ShieldCheck,
  Laptop,
  Smartphone,
  Tablet,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  LogOut,
} from 'lucide-react';
import {
  useRevokeOtherSessions,
  useRevokeSession,
  useSessions,
  useUpdatePassword,
} from '../../hooks/api/useAccount';
import { toast } from 'sonner';

interface CompteSecuriteProps {
  onBack?: () => void;
  onNavigate?: (page: PageType) => void;
}

export function CompteSecurite({ onBack }: CompteSecuriteProps) {
  const { data: sessions = [], isLoading: isSessionsLoading } = useSessions();
  const updatePasswordMutation = useUpdatePassword();
  const revokeSessionMutation = useRevokeSession();
  const revokeOtherSessionsMutation = useRevokeOtherSessions();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(null);

  const otherSessionsCount = sessions.filter((session) => !session.is_current).length;

  const getErrorMessage = (error: unknown, fallback: string) => {
    return error instanceof Error && error.message ? error.message : fallback;
  };

  const formatSessionDate = (value: string) => {
    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) return 'date indisponible';
    return parsedDate.toLocaleString('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const getSessionIcon = (device: string) => {
    const lowerDevice = device.toLowerCase();
    if (lowerDevice.includes('ipad') || lowerDevice.includes('tablet')) return Tablet;
    if (lowerDevice.includes('iphone') || lowerDevice.includes('android') || lowerDevice.includes('mobile')) return Smartphone;
    return Laptop;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword.trim()) {
      toast.error('Le mot de passe actuel est requis');
      return;
    }

    if (!newPassword.trim()) {
      toast.error('Le nouveau mot de passe est requis');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    
    try {
      await updatePasswordMutation.mutateAsync({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      toast.success('Mot de passe mis à jour avec succès');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Erreur lors de la mise à jour du mot de passe'));
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    setRevokingSessionId(sessionId);
    try {
      await revokeSessionMutation.mutateAsync(sessionId);
      toast.success('Session déconnectée');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Impossible de déconnecter cette session'));
    } finally {
      setRevokingSessionId(null);
    }
  };

  const handleRevokeOtherSessions = async () => {
    if (otherSessionsCount === 0) {
      toast.info('Aucune autre session active');
      return;
    }

    try {
      const result = await revokeOtherSessionsMutation.mutateAsync();
      if (result.revoked === 0) {
        toast.info('Aucune autre session active');
      } else {
        toast.success(`${result.revoked} session${result.revoked > 1 ? 's' : ''} déconnectée${result.revoked > 1 ? 's' : ''}`);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, 'Impossible de déconnecter les autres sessions'));
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 pb-24 lg:pb-0">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto pb-24 lg:pb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl text-gray-900 dark:text-white mb-1">
              Sécurité du compte
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Protégez vos accès, gérez vos sessions et sécurisez votre compte.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </button>
            )}
            <button
              onClick={handleRevokeOtherSessions}
              disabled={revokeOtherSessionsMutation.isPending || isSessionsLoading || otherSessionsCount === 0}
              className="px-4 py-2.5 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] hover:from-[#6a13df] hover:to-[#8a33ff] text-white text-sm rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#5a03cf]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {revokeOtherSessionsMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
              Déconnecter les autres sessions
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <KeyRound className="w-5 h-5 text-[#5a03cf]" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Mot de passe</span>
            </div>
            <div className="text-2xl text-gray-900 dark:text-white">Actif</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Niveau de sécurité standard</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-2xl p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">2FA</span>
            </div>
            <div className="text-2xl text-blue-700 dark:text-blue-300">Off</div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Recommandé pour tous les comptes</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 rounded-2xl p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <Laptop className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-green-600 dark:text-green-400">Sessions</span>
            </div>
            <div className="text-2xl text-green-700 dark:text-green-300">{isSessionsLoading ? '…' : sessions.length}</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">Appareils connectés</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10 rounded-2xl p-4 border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-xs font-medium text-orange-600 dark:text-orange-400">Alertes</span>
            </div>
            <div className="text-2xl text-orange-700 dark:text-orange-300">0</div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Aucune activité suspecte</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg text-gray-900 dark:text-white mb-1">Changer le mot de passe</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Utilisez un mot de passe unique et difficile à deviner.
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mot de passe actuel
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5a03cf] transition-all"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5a03cf] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5a03cf] transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={updatePasswordMutation.isPending}
                  className="px-6 py-3 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] hover:from-[#6a13df] hover:to-[#8a33ff] text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#5a03cf]/20"
                >
                  {updatePasswordMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Mettre à jour
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="px-6 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors"
                >
                  Réinitialiser
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-base text-gray-900 dark:text-white mb-1">
                Authentification à deux facteurs
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Ajoutez une validation par code pour sécuriser vos connexions.
              </p>
              <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/40">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Statut actuel: désactivée
                </p>
              </div>
              <button
                type="button"
                onClick={() => toast.info('La 2FA sera disponible prochainement')}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] hover:from-[#6a13df] hover:to-[#8a33ff] text-white rounded-xl transition-all text-sm font-medium"
              >
                Activer la 2FA (bientôt)
              </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
              <h3 className="text-base text-gray-900 dark:text-white mb-3">
                Recommandations rapides
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  Utiliser un mot de passe unique par service.
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  Activer la double authentification.
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  Vérifier régulièrement les sessions actives.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg text-gray-900 dark:text-white mb-1">Sessions actives</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Contrôlez les appareils actuellement connectés à votre compte.
              </p>
            </div>
            <button className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-sm rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors">
              <Clock3 className="w-4 h-4" />
              Historique
            </button>
          </div>

          <div className="p-6 space-y-3">
            {isSessionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 animate-spin text-gray-500 dark:text-gray-400" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-sm text-gray-600 dark:text-gray-400 py-8 text-center">
                Aucune session active trouvée.
              </div>
            ) : (
              sessions.map((session) => {
                const SessionIcon = getSessionIcon(session.device);
                const isRevoking = revokingSessionId === session.id;

                return (
                  <div
                    key={session.id}
                    className="group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-[#5a03cf]/30 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center flex-shrink-0">
                        <SessionIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white truncate">
                          {session.device || 'Appareil inconnu'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          {session.is_current ? 'Session actuelle' : 'Session active'}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          Dernière activité : {formatSessionDate(session.updated_at)}
                        </p>
                      </div>
                    </div>

                    {session.is_current ? (
                      <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-900/40">
                        Session active
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleRevokeSession(session.id)}
                        disabled={isRevoking}
                        className="self-start sm:self-auto text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                      >
                        {isRevoking && <Loader2 className="w-4 h-4 animate-spin" />}
                        Déconnecter
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
