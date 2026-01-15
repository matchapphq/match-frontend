import { useState } from 'react';
import { PageType } from '../../App';
import { ArrowLeft } from 'lucide-react';

interface CompteNotificationsProps {
  onBack?: () => void;
  onNavigate?: (page: PageType) => void;
}

export function CompteNotifications({ onBack }: CompteNotificationsProps) {
  const [emailReservations, setEmailReservations] = useState(true);
  const [emailMatchs, setEmailMatchs] = useState(true);
  const [pushReservations, setPushReservations] = useState(true);
  const [pushRappels, setPushRappels] = useState(false);

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
          Notifications
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">Gérez vos préférences de notifications</p>
      </div>

      {/* Notifications par email */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-8 mb-6">
        <h2 className="text-2xl mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
          Notifications par email
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Recevez des emails pour rester informé</p>

        <div className="space-y-4">
          <div className="bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-200/30 dark:border-gray-700/30 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-900 dark:text-white mb-1" style={{ fontWeight: '600' }}>
                Nouvelles réservations
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Recevez un email à chaque nouvelle réservation
              </p>
            </div>
            <button
              onClick={() => setEmailReservations(!emailReservations)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                emailReservations ? 'bg-gradient-to-r from-[#5a03cf] to-[#9cff02]' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  emailReservations ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-200/30 dark:border-gray-700/30 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-900 dark:text-white mb-1" style={{ fontWeight: '600' }}>
                Rappels de matchs
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Recevez un rappel 24h avant vos matchs programmés
              </p>
            </div>
            <button
              onClick={() => setEmailMatchs(!emailMatchs)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                emailMatchs ? 'bg-gradient-to-r from-[#5a03cf] to-[#9cff02]' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  emailMatchs ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Notifications push */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-8 mb-6">
        <h2 className="text-2xl mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
          Notifications push
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Notifications instantanées sur vos appareils</p>

        <div className="space-y-4">
          <div className="bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-200/30 dark:border-gray-700/30 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-900 dark:text-white mb-1" style={{ fontWeight: '600' }}>
                Réservations en temps réel
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Notification instantanée pour chaque nouvelle réservation
              </p>
            </div>
            <button
              onClick={() => setPushReservations(!pushReservations)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                pushReservations ? 'bg-gradient-to-r from-[#5a03cf] to-[#9cff02]' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  pushReservations ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-200/30 dark:border-gray-700/30 flex items-center justify-between">
            <div className="flex-1">
              <p className="text-gray-900 dark:text-white mb-1" style={{ fontWeight: '600' }}>
                Rappels de matchs
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Notification 2h avant le début d'un match
              </p>
            </div>
            <button
              onClick={() => setPushRappels(!pushRappels)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                pushRappels ? 'bg-gradient-to-r from-[#5a03cf] to-[#9cff02]' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  pushRappels ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Bouton CTA */}
      <button
        className="w-full bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white py-4 rounded-xl hover:brightness-105 hover:scale-[1.01] transition-all shadow-sm"
        style={{ fontWeight: '600' }}
      >
        Enregistrer les préférences
      </button>
    </div>
  );
}