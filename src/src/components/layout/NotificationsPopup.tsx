import { X, Bell } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: Notification[];
}

export function NotificationsPopup({ isOpen, onClose, notifications = [] }: NotificationsPopupProps) {
  if (!isOpen) return null;

  const mockNotifications: Notification[] = notifications.length > 0 ? notifications : [
    {
      id: '1',
      title: 'Nouvelle réservation',
      message: 'Jean Dupont a réservé pour le match PSG vs OM',
      time: 'Il y a 5 minutes',
      read: false,
    },
    {
      id: '2',
      title: 'Match confirmé',
      message: 'Le match de ce soir est confirmé',
      time: 'Il y a 1 heure',
      read: true,
    },
  ];

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Popup */}
      <div className="fixed right-4 top-20 w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 max-h-[600px] overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#5a03cf]" />
            <h3 className="text-lg" style={{ fontWeight: '700', color: '#5a03cf' }}>
              Notifications
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-[500px]">
          {mockNotifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Aucune notification
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    !notification.read ? 'bg-[#5a03cf]/5' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {!notification.read && (
                      <div className="w-2 h-2 bg-[#5a03cf] rounded-full mt-2" />
                    )}
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white mb-1" style={{ fontWeight: '600' }}>
                        {notification.title}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                        {notification.message}
                      </p>
                      <p className="text-gray-500 dark:text-gray-500 text-xs">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <button className="w-full text-center text-[#5a03cf] text-sm hover:underline" style={{ fontWeight: '600' }}>
            Tout marquer comme lu
          </button>
        </div>
      </div>
    </>
  );
}
