import { ArrowLeft, Bell, Mail, Smartphone, Calendar } from 'lucide-react';
import { useState } from 'react';

interface CompteNotificationsProps {
  onBack: () => void;
}

export function CompteNotifications({ onBack }: CompteNotificationsProps) {
  const [emailReservations, setEmailReservations] = useState(true);
  const [emailMatchs, setEmailMatchs] = useState(true);
  const [pushReservations, setPushReservations] = useState(true);
  const [pushRappels, setPushRappels] = useState(false);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour au compte
      </button>

      <div className="mb-8">
        <h1 className="text-gray-900 italic text-4xl mb-2" style={{ fontWeight: '700', color: '#5a03cf' }}>
          Notifications
        </h1>
        <p className="text-gray-600 text-lg">Gérez vos préférences de notifications</p>
      </div>

      <div className="space-y-6">
        {/* Notifications par email */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-6 h-6 text-[#5a03cf]" />
            <h2 className="text-xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
              Notifications par email
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <p className="text-gray-900 mb-1" style={{ fontWeight: '600' }}>
                  Nouvelles réservations
                </p>
                <p className="text-gray-600 text-sm">
                  Recevez un email à chaque nouvelle réservation
                </p>
              </div>
              <button
                onClick={() => setEmailReservations(!emailReservations)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  emailReservations ? 'bg-[#9cff02]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    emailReservations ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 mb-1" style={{ fontWeight: '600' }}>
                  Rappels de matchs
                </p>
                <p className="text-gray-600 text-sm">
                  Recevez un rappel 24h avant vos matchs programmés
                </p>
              </div>
              <button
                onClick={() => setEmailMatchs(!emailMatchs)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  emailMatchs ? 'bg-[#9cff02]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    emailMatchs ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications push */}
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Smartphone className="w-6 h-6 text-[#5a03cf]" />
            <h2 className="text-xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
              Notifications push
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <p className="text-gray-900 mb-1" style={{ fontWeight: '600' }}>
                  Réservations en temps réel
                </p>
                <p className="text-gray-600 text-sm">
                  Notification instantanée pour chaque nouvelle réservation
                </p>
              </div>
              <button
                onClick={() => setPushReservations(!pushReservations)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  pushReservations ? 'bg-[#9cff02]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    pushReservations ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-900 mb-1" style={{ fontWeight: '600' }}>
                  Rappels de matchs
                </p>
                <p className="text-gray-600 text-sm">
                  Notification 2h avant le début d&apos;un match
                </p>
              </div>
              <button
                onClick={() => setPushRappels(!pushRappels)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  pushRappels ? 'bg-[#9cff02]' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                    pushRappels ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <button
          className="w-full bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white py-4 rounded-xl hover:shadow-lg transition-all italic text-lg"
          style={{ fontWeight: '600' }}
        >
          Enregistrer les préférences
        </button>
      </div>
    </div>
  );
}
