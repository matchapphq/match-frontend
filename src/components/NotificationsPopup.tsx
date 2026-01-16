import { Bell, Check, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

interface NotificationsPopupProps {
  onClose?: () => void;
}

export function NotificationsPopup({ onClose }: NotificationsPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, handleReservationAction, markAllAsRead } = useAppContext();
  const { currentUser } = useAuth();
  const popupRef = useRef<HTMLDivElement>(null);

  const userNotifications = currentUser 
    ? notifications.filter(n => n.userId === currentUser.id)
    : [];

  // Séparer les notifications par priorité
  const prioritaires = userNotifications.filter(n => !n.read && n.type === 'reservation');
  const informatives = userNotifications.filter(n => !n.read && n.type !== 'reservation');
  const historisees = userNotifications.filter(n => n.read);

  const unreadCount = userNotifications.filter(n => !n.read).length;

  // Fermer le popup quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleAccept = (notificationId: number, reservationId: number) => {
    handleReservationAction(reservationId, 'acceptée');
  };

  const handleReject = (notificationId: number, reservationId: number) => {
    handleReservationAction(reservationId, 'refusée');
  };

  const handleMarkAllAsRead = () => {
    if (markAllAsRead && currentUser) {
      markAllAsRead(currentUser.id);
    }
  };

  return (
    <div className="relative" ref={popupRef}>
      {/* Bouton de notification */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 bg-white/20 backdrop-blur-xl rounded-full border-2 border-white/30 hover:border-[#5a03cf] transition-all shadow-lg hover:shadow-xl"
      >
        <Bell className="w-5 h-5 text-[#5a03cf]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#9cff02] to-[#7cdf00] text-[#5a03cf] rounded-full flex items-center justify-center text-xs" style={{ fontWeight: '800' }}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popup de notifications */}
      {isOpen && (
        <div className="absolute right-0 top-16 w-[420px] bg-white/70 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 z-50 max-h-[600px] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200/50 flex items-center justify-between">
            <h3 className="text-xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
              Notifications
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-gray-600 hover:text-[#5a03cf] transition-colors"
                  style={{ fontWeight: '600' }}
                >
                  Tout marquer comme lu
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-200/50 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Contenu des notifications */}
          <div className="overflow-y-auto flex-1 p-4">
            {userNotifications.length === 0 ? (
              // État vide
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100/50 flex items-center justify-center">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600">
                  Aucune notification pour le moment
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 1️⃣ Notifications prioritaires */}
                {prioritaires.length > 0 && (
                  <div>
                    {prioritaires.map((notification) => (
                      <div
                        key={notification.id}
                        className="mb-3 bg-white/90 backdrop-blur-sm rounded-xl p-5 border-2 border-[#5a03cf]/20 hover:border-[#5a03cf]/40 transition-all shadow-sm"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="text-gray-900 mb-1" style={{ fontWeight: '700' }}>
                              {notification.title}
                            </p>
                            <p className="text-gray-700 text-sm mb-1">
                              {notification.message}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {notification.date}
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-[#5a03cf]/10 text-[#5a03cf] rounded-lg text-xs" style={{ fontWeight: '600' }}>
                            Nouveau
                          </span>
                        </div>

                        {/* Actions pour les réservations */}
                        {notification.type === 'reservation' && notification.reservationId && (
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => handleAccept(notification.id, notification.reservationId!)}
                              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white rounded-xl hover:brightness-105 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                              style={{ fontWeight: '600' }}
                            >
                              <Check className="w-4 h-4" />
                              Accepter
                            </button>
                            <button
                              onClick={() => handleReject(notification.id, notification.reservationId!)}
                              className="flex-1 px-4 py-2.5 bg-white/70 backdrop-blur-sm border border-gray-200/50 text-gray-700 rounded-xl hover:bg-white/90 transition-all flex items-center justify-center gap-2"
                              style={{ fontWeight: '600' }}
                            >
                              <X className="w-4 h-4" />
                              Refuser
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 2️⃣ Notifications informatives */}
                {informatives.length > 0 && (
                  <div>
                    {informatives.map((notification) => (
                      <div
                        key={notification.id}
                        className="mb-3 bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 hover:border-gray-300/60 transition-all"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1">
                            <p className="text-gray-900 mb-1" style={{ fontWeight: '600' }}>
                              {notification.title}
                            </p>
                            <p className="text-gray-600 text-sm mb-1">
                              {notification.message}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {notification.date}
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-[#9cff02]/20 text-[#5a03cf] rounded-lg text-xs" style={{ fontWeight: '600' }}>
                            Nouveau
                          </span>
                        </div>

                        <button
                          className="mt-3 text-sm text-[#5a03cf] hover:underline"
                          style={{ fontWeight: '600' }}
                        >
                          Voir
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3️⃣ Notifications historisées */}
                {historisees.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-2 px-1" style={{ fontWeight: '600' }}>
                      PLUS ANCIENNES
                    </p>
                    {historisees.map((notification) => (
                      <div
                        key={notification.id}
                        className="mb-2 bg-gray-50/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30 opacity-60 hover:opacity-80 transition-opacity"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-gray-700 mb-1" style={{ fontWeight: '600' }}>
                              {notification.title}
                            </p>
                            <p className="text-gray-600 text-sm mb-1">
                              {notification.message}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {notification.date}
                            </p>
                          </div>
                          {notification.type === 'reservation' && (
                            <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded-lg text-xs" style={{ fontWeight: '600' }}>
                              Traité
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}