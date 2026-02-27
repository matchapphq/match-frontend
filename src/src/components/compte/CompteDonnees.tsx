import { useState, type ComponentType } from 'react';
import { PageType } from '../../types';
import {
  ArrowLeft,
  Database,
  FileDown,
  Loader2,
  ShieldCheck,
  Cookie,
  Trash2,
  AlertTriangle,
  Bell,
  MessageSquare,
  BarChart3,
  Megaphone,
} from 'lucide-react';
import apiClient from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../features/authentication/context/AuthContext';
import { API_ENDPOINTS } from '../../utils/api-constants';

interface CompteDonneesProps {
  onNavigate?: (page: PageType) => void;
  onBack?: () => void;
}

export function CompteDonnees({ onBack }: CompteDonneesProps) {
  const { logout, isLoggingOut } = useAuth();
  const toast = useToast();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    analyticsConsent: true,
    marketingConsent: false,
  });
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportMessage, setExportMessage] = useState('');
  const [isSubmittingExportRequest, setIsSubmittingExportRequest] = useState(false);
  const [exportSubmitError, setExportSubmitError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState('Je n’utilise plus Match');
  const [deleteDetails, setDeleteDetails] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteSubmitError, setDeleteSubmitError] = useState<string | null>(null);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const enabledConsentCount = Object.values(settings).filter(Boolean).length;

  const consentItems: Array<{
    key: keyof typeof settings;
    title: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
    iconClass: string;
  }> = [
    {
      key: 'emailNotifications',
      title: 'Notifications par email',
      description: 'Recevoir des emails concernant vos matchs et réservations.',
      icon: Bell,
      iconClass: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
    },
    {
      key: 'smsNotifications',
      title: 'Notifications par SMS',
      description: 'Recevoir des SMS pour les événements importants.',
      icon: MessageSquare,
      iconClass: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    },
    {
      key: 'analyticsConsent',
      title: 'Analyse et statistiques',
      description: 'Autoriser la collecte de données pour améliorer votre expérience.',
      icon: BarChart3,
      iconClass: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    },
    {
      key: 'marketingConsent',
      title: 'Communications marketing',
      description: 'Recevoir des offres et nouveautés de Match.',
      icon: Megaphone,
      iconClass: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    },
  ];

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleOpenExportModal = () => {
    setExportSubmitError(null);
    setShowExportModal(true);
  };

  const handleCloseExportModal = () => {
    if (isSubmittingExportRequest) return;
    setExportSubmitError(null);
    setShowExportModal(false);
  };

  const handleSubmitExportRequest = async () => {
    const message = exportMessage;
    if (!message.trim()) {
      setExportSubmitError('Veuillez ajouter un message pour préciser votre demande.');
      return;
    }

    setIsSubmittingExportRequest(true);
    setExportSubmitError(null);
    try {
      await apiClient.post(
        API_ENDPOINTS.SUPPORT_DATA_EXPORT_REQUEST,
        { message },
        { timeout: 15000 }
      );
      toast.success('Demande envoyée à data@matchapp.fr');
      setShowExportModal(false);
      setExportMessage('');
    } catch (error: any) {
      const rawMessage = typeof error?.message === 'string' ? error.message : '';
      const messageFromApi = rawMessage.toLowerCase().includes('timeout')
        ? 'La demande prend trop de temps. Réessayez dans quelques secondes.'
        : rawMessage || 'Impossible d’envoyer la demande pour le moment.';
      setExportSubmitError(messageFromApi);
      toast.error(messageFromApi);
    } finally {
      setIsSubmittingExportRequest(false);
    }
  };

  const handleOpenDeleteModal = () => {
    setDeleteReason('Je n’utilise plus Match');
    setDeleteDetails('');
    setDeletePassword('');
    setDeleteSubmitError(null);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    if (isDeletingAccount || isLoggingOut) return;
    setDeleteSubmitError(null);
    setShowDeleteModal(false);
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword.trim()) {
      setDeleteSubmitError('Veuillez renseigner votre mot de passe pour confirmer la suppression.');
      return;
    }
    if (deletePassword.trim().length < 6) {
      setDeleteSubmitError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setIsDeletingAccount(true);
    setDeleteSubmitError(null);
    try {
      await apiClient.delete(API_ENDPOINTS.USERS_ME, {
        data: {
          reason: deleteReason,
          details: deleteDetails.trim() || undefined,
          password: deletePassword.trim(),
        },
        timeout: 20000,
      });

      toast.success('Compte désactivé. Vous pouvez le réactiver en vous reconnectant sous 30 jours.');
      setShowDeleteModal(false);
      await logout();
    } catch (error: any) {
      const rawMessage = typeof error?.message === 'string' ? error.message : '';
      const normalized = rawMessage.trim().toLowerCase();
      const messageFromApi =
        normalized === 'invalid password'
          ? 'Mot de passe incorrect.'
          : normalized === 'password is required'
            ? 'Mot de passe requis.'
            : rawMessage || 'Impossible de supprimer le compte pour le moment.';
      setDeleteSubmitError(messageFromApi);
      toast.error(messageFromApi);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 pb-24 lg:pb-0">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto pb-24 lg:pb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl text-gray-900 dark:text-white mb-1">
              Données & confidentialité
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Contrôlez vos données personnelles, vos consentements et vos droits RGPD.
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
              type="button"
              onClick={handleOpenExportModal}
              className="px-4 py-2.5 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] hover:from-[#6a13df] hover:to-[#8a33ff] text-white text-sm rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#5a03cf]/20"
            >
              <FileDown className="w-4 h-4" />
              Demander un export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-5 h-5 text-[#5a03cf]" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Données</span>
            </div>
            <div className="text-2xl text-gray-900 dark:text-white">4</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Blocs exportables</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-2xl p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Consentements</span>
            </div>
            <div className="text-2xl text-blue-700 dark:text-blue-300">{enabledConsentCount}/4</div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Actifs</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-2 mb-2">
              <Cookie className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Cookies</span>
            </div>
            <div className="text-2xl text-emerald-700 dark:text-emerald-300">Standard</div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Préférences à ajuster</p>
          </div>

        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg text-gray-900 dark:text-white mb-1">Consentements</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gérez vos préférences de communication et d&apos;utilisation des données.
              </p>
            </div>

            <div className="p-6 space-y-3">
              {consentItems.map((item) => {
                const Icon = item.icon;
                const enabled = settings[item.key];

                return (
                  <div
                    key={item.key}
                    className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.iconClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white mb-1">
                          {item.title}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggle(item.key)}
                      aria-pressed={enabled}
                      className={`relative w-14 h-8 rounded-full transition-colors flex-shrink-0 ${
                        enabled ? 'bg-gradient-to-r from-[#5a03cf] to-[#7a23ef]' : 'bg-gray-300 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform ${
                          enabled ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
              <div className="w-12 h-12 bg-[#5a03cf]/10 text-[#5a03cf] rounded-xl flex items-center justify-center mb-3">
                <FileDown className="w-6 h-6" />
              </div>
              <h3 className="text-base text-gray-900 dark:text-white mb-1">
                Export des données
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Téléchargez une copie de vos informations personnelles.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <li>• Profil et données de compte</li>
                <li>• Établissements et paramètres</li>
                <li>• Historique des matchs diffusés</li>
                <li>• Données d&apos;utilisation</li>
              </ul>
              <button
                type="button"
                onClick={handleOpenExportModal}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] hover:from-[#6a13df] hover:to-[#8a33ff] text-white rounded-xl transition-all text-sm font-medium"
              >
                Demander un export
              </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-3">
                <Cookie className="w-6 h-6" />
              </div>
              <h3 className="text-base text-gray-900 dark:text-white mb-0.5">
                Cookies et tracking
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Match utilise des cookies essentiels, de performance et analytiques.
              </p>
              <button className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-colors text-sm font-medium">
                Gérer les préférences
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg text-gray-900 dark:text-white mb-1">Vos droits RGPD</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Conformément au RGPD, vous disposez de plusieurs droits.
              </p>
            </div>
            <div className="p-6">
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li>• <span className="text-gray-900 dark:text-white">Droit d&apos;accès</span> - accéder à vos données personnelles</li>
                <li>• <span className="text-gray-900 dark:text-white">Droit de rectification</span> - corriger des données inexactes</li>
                <li>• <span className="text-gray-900 dark:text-white">Droit à l&apos;effacement</span> - demander la suppression de vos données</li>
                <li>• <span className="text-gray-900 dark:text-white">Droit à la portabilité</span> - récupérer une copie de vos données</li>
                <li>• <span className="text-gray-900 dark:text-white">Droit d&apos;opposition</span> - refuser certains traitements</li>
              </ul>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-red-200 dark:border-red-900/50 shadow-sm">
            <div className="p-6 border-b border-red-100 dark:border-red-900/30">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg text-red-700 dark:text-red-300 mb-1">Suppression du compte</h2>
                  <p className="text-sm text-red-600/90 dark:text-red-300/90">
                    Désactivation immédiate avec conservation des données pendant 30 jours.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40">
                <p className="text-sm text-red-700 dark:text-red-300 flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  Avant de supprimer votre compte :
                </p>
                <ul className="space-y-2 text-sm text-red-700/90 dark:text-red-300/90">
                  <li>• Vos données seront supprimées définitivement après 30 jours</li>
                  <li>• Vous pouvez réactiver le compte en vous reconnectant avant ce délai</li>
                  <li>• Contactez le support en cas de doute</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={handleOpenDeleteModal}
                className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Désactiver mon compte
              </button>
            </div>
          </div>
        </div>
      </div>

      {showExportModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            onClick={handleCloseExportModal}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-[0_18px_45px_-20px_rgba(0,0,0,0.45)]">
            <h2 className="text-xl text-gray-900 dark:text-white mb-2">Demande d&apos;export RGPD</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Votre demande sera transmise à <span className="text-gray-900 dark:text-gray-100">data@matchapp.fr</span>.
              Ajoutez un message pour préciser le contexte de votre demande.
            </p>

            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
              Message
            </label>
            <textarea
              value={exportMessage}
              onChange={(e) => {
                setExportMessage(e.target.value);
                if (exportSubmitError) {
                  setExportSubmitError(null);
                }
              }}
              rows={5}
              placeholder="Exemple: Je souhaite recevoir l'ensemble de mes données personnelles liées à mon compte."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5a03cf] transition-all resize-none"
              disabled={isSubmittingExportRequest}
            />
            {exportSubmitError && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                {exportSubmitError}
              </p>
            )}

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseExportModal}
                disabled={isSubmittingExportRequest}
                className="px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSubmitExportRequest}
                disabled={isSubmittingExportRequest}
                className="px-4 py-2 text-sm bg-[#5a03cf] text-white rounded-xl hover:bg-[#4a02af] transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {isSubmittingExportRequest && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmittingExportRequest ? 'Envoi...' : 'Envoyer la demande'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            onClick={handleCloseDeleteModal}
          />
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-[0_18px_45px_-20px_rgba(0,0,0,0.45)]">
            <h2 className="text-xl text-red-700 dark:text-red-300 mb-2">Confirmer la désactivation du compte</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Votre compte sera désactivé immédiatement. Vos données seront conservées 30 jours puis supprimées définitivement.
              Si vous changez d&apos;avis, reconnectez-vous simplement avant ce délai pour réactiver le compte.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Raison principale
                </label>
                <select
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  disabled={isDeletingAccount || isLoggingOut}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                >
                  <option>Je n’utilise plus Match</option>
                  <option>Je préfère une autre solution</option>
                  <option>Je ne suis pas satisfait du service</option>
                  <option>Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Détails (optionnel)
                </label>
                <textarea
                  value={deleteDetails}
                  onChange={(e) => setDeleteDetails(e.target.value)}
                  rows={3}
                  disabled={isDeletingAccount || isLoggingOut}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all resize-none"
                  placeholder="Expliquez brièvement votre choix"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Mot de passe de confirmation
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => {
                    setDeletePassword(e.target.value);
                    if (deleteSubmitError) {
                      setDeleteSubmitError(null);
                    }
                  }}
                  disabled={isDeletingAccount || isLoggingOut}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                  placeholder="Votre mot de passe actuel"
                />
              </div>
            </div>

            {deleteSubmitError && (
              <p className="mt-4 text-sm text-red-600 dark:text-red-400">
                {deleteSubmitError}
              </p>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseDeleteModal}
                disabled={isDeletingAccount || isLoggingOut}
                className="px-4 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount || isLoggingOut}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {(isDeletingAccount || isLoggingOut) && <Loader2 className="w-4 h-4 animate-spin" />}
                {isDeletingAccount || isLoggingOut ? 'Désactivation...' : 'Désactiver le compte'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
