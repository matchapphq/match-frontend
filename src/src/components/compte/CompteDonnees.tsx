import { useState } from 'react';
import { PageType } from '../../types';
import { useAuth } from '../../features/authentication/context/AuthContext';
import { ArrowLeft } from 'lucide-react';

interface CompteDonneesProps {
  onNavigate?: (page: PageType) => void;
  onBack?: () => void;
}

export function CompteDonnees({ onNavigate, onBack }: CompteDonneesProps) {
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    analyticsConsent: true,
    marketingConsent: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Bouton retour aux paramètres */}
      {onBack && (
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all"
          style={{ fontWeight: '600' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Retourner aux paramètres du compte
        </button>
      )}

      {/* Header de la page */}
      <div className="mb-12">
        <h1 className="text-5xl italic mb-2" style={{ fontWeight: '700', color: '#5a03cf' }}>
          Données & confidentialité
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">Gérez vos données personnelles et vos préférences de confidentialité</p>
      </div>

      {/* Export des données */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6">
        <h2 className="text-2xl mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
          Export des données
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Téléchargez une copie de toutes vos données personnelles</p>
        
        <div className="bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-200/30 dark:border-gray-700/30 mb-4">
          <p className="text-gray-700 dark:text-gray-300 mb-2" style={{ fontWeight: '600' }}>
            Vos données exportables incluent :
          </p>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-[#5a03cf] mt-1">•</span>
              <span>Informations de profil et compte</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#5a03cf] mt-1">•</span>
              <span>Établissements et paramètres</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#5a03cf] mt-1">•</span>
              <span>Historique des matchs diffusés</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#5a03cf] mt-1">•</span>
              <span>Statistiques et données d'utilisation</span>
            </li>
          </ul>
        </div>

        <button 
          className="px-6 py-3 bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white rounded-xl hover:brightness-105 hover:scale-[1.01] transition-all shadow-sm"
          style={{ fontWeight: '600' }}
        >
          Demander un export
        </button>
      </div>

      {/* Consentements */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6">
        <h2 className="text-2xl mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
          Consentements
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Gérez vos préférences de communication et d'utilisation des données</p>

        <div className="space-y-4">
          <div className="bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-200/30 dark:border-gray-700/30 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-900 dark:text-white mb-1" style={{ fontWeight: '600' }}>
                Notifications par email
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Recevoir des emails concernant vos matchs et réservations
              </p>
            </div>
            <button
              onClick={() => handleToggle('emailNotifications')}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.emailNotifications ? 'bg-gradient-to-r from-[#5a03cf] to-[#9cff02]' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.emailNotifications ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-200/30 dark:border-gray-700/30 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-900 dark:text-white mb-1" style={{ fontWeight: '600' }}>
                Notifications par SMS
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Recevoir des SMS pour les événements importants
              </p>
            </div>
            <button
              onClick={() => handleToggle('smsNotifications')}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.smsNotifications ? 'bg-gradient-to-r from-[#5a03cf] to-[#9cff02]' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.smsNotifications ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-200/30 dark:border-gray-700/30 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-900 dark:text-white mb-1" style={{ fontWeight: '600' }}>
                Analyse et statistiques
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Autoriser la collecte de données pour améliorer votre expérience
              </p>
            </div>
            <button
              onClick={() => handleToggle('analyticsConsent')}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.analyticsConsent ? 'bg-gradient-to-r from-[#5a03cf] to-[#9cff02]' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.analyticsConsent ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-200/30 dark:border-gray-700/30 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-900 dark:text-white mb-1" style={{ fontWeight: '600' }}>
                Communications marketing
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Recevoir des offres et nouveautés de Match
              </p>
            </div>
            <button
              onClick={() => handleToggle('marketingConsent')}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.marketingConsent ? 'bg-gradient-to-r from-[#5a03cf] to-[#9cff02]' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  settings.marketingConsent ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Cookies */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6">
        <h2 className="text-2xl mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
          Cookies et tracking
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Informations sur l'utilisation des cookies</p>

        <div className="bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-200/30 dark:border-gray-700/30 mb-4">
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            Match utilise des cookies pour améliorer votre expérience. Nous utilisons :
          </p>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-[#5a03cf] mt-1">•</span>
              <span><span style={{ fontWeight: '600' }}>Cookies essentiels</span> - nécessaires au fonctionnement du site</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#5a03cf] mt-1">•</span>
              <span><span style={{ fontWeight: '600' }}>Cookies de performance</span> - pour améliorer les fonctionnalités</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#5a03cf] mt-1">•</span>
              <span><span style={{ fontWeight: '600' }}>Cookies analytiques</span> - pour comprendre l'utilisation du site</span>
            </li>
          </ul>
        </div>

        <button 
          className="px-6 py-3 text-[#5a03cf] bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all"
          style={{ fontWeight: '600' }}
        >
          Gérer les préférences
        </button>
      </div>

      {/* RGPD */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6">
        <h2 className="text-2xl mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
          Vos droits RGPD
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Conformément au RGPD, vous disposez de plusieurs droits</p>

        <div className="bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-200/30 dark:border-gray-700/30">
          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-[#5a03cf] mt-1">•</span>
              <span><span style={{ fontWeight: '600' }}>Droit d'accès</span> - accédez à vos données personnelles</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#5a03cf] mt-1">•</span>
              <span><span style={{ fontWeight: '600' }}>Droit de rectification</span> - corrigez vos données inexactes</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#5a03cf] mt-1">•</span>
              <span><span style={{ fontWeight: '600' }}>Droit à l'effacement</span> - supprimez vos données</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#5a03cf] mt-1">•</span>
              <span><span style={{ fontWeight: '600' }}>Droit à la portabilité</span> - récupérez vos données</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#5a03cf] mt-1">•</span>
              <span><span style={{ fontWeight: '600' }}>Droit d'opposition</span> - refusez le traitement de vos données</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Suppression du compte */}
      <div className="bg-red-50/50 dark:bg-red-900/20 backdrop-blur-xl rounded-xl shadow-sm border border-red-200/30 dark:border-red-900/50 p-6">
        <h2 className="text-2xl mb-1" style={{ fontWeight: '600', color: '#dc2626' }}>
          Suppression du compte
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">Cette action est irréversible. Toutes vos données seront définitivement supprimées.</p>

        <div className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-red-200/30 dark:border-red-900/50 mb-4">
          <p className="text-gray-700 dark:text-gray-300 mb-2" style={{ fontWeight: '600' }}>
            Avant de supprimer votre compte :
          </p>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-red-500 dark:text-red-400 mt-1">•</span>
              <span>Annulez tous vos abonnements actifs</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-500 dark:text-red-400 mt-1">•</span>
              <span>Exportez vos données si nécessaire</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-500 dark:text-red-400 mt-1">•</span>
              <span>Contactez le support en cas de questions</span>
            </li>
          </ul>
        </div>

        <button 
          className="px-6 py-3 bg-red-500/90 dark:bg-red-600/90 text-white rounded-xl hover:bg-red-600 dark:hover:bg-red-700 transition-all shadow-sm"
          style={{ fontWeight: '600' }}
        >
          Supprimer mon compte
        </button>
      </div>
    </div>
  );
}
