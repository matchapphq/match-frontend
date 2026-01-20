import { Bell, Check, ChevronLeft, Filter, Trash2, X, Clock, Users, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { PageType } from '../../App';

interface NotificationCenterProps {
  onBack?: () => void;
  onNavigate?: (page: PageType) => void;
}

type FilterType = 'all' | 'unread' | 'reservations' | 'system';

export function NotificationCenter({ onBack, onNavigate }: NotificationCenterProps) {
  const { notifications, handleReservationAction, markAllAsRead } = useAppContext();
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const userNotifications = currentUser 
    ? notifications.filter(n => n.userId === currentUser.id)
    : [];

  // Apply filters
  const filteredNotifications = userNotifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'reservations') return notification.type === 'reservation';
    if (filter === 'system') return notification.type !== 'reservation';
    return true;
  });

  const unreadCount = userNotifications.filter(n => !n.read).length;

  const handleSelectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map(n => n.id));
    }
  };

  const handleToggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleMarkSelectedAsRead = () => {
    // Mark selected as read logic
    setSelectedIds([]);
  };

  const handleDeleteSelected = () => {
    // Delete selected logic
    setSelectedIds([]);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reservation':
        return <Users className="w-5 h-5 text-[#5a03cf]" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto pb-24 lg:pb-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-4 mb-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </button>
            )}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl text-gray-900 dark:text-white mb-1">
                Centre de notifications
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {unreadCount > 0 
                  ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`
                  : 'Toutes vos notifications sont à jour'
                }
              </p>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Filters */}
            <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-1 shadow-sm">
              {[
                { key: 'all', label: 'Toutes' },
                { key: 'unread', label: 'Non lues' },
                { key: 'reservations', label: 'Réservations' },
                { key: 'system', label: 'Système' },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key as FilterType)}
                  className={`
                    px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-all
                    ${filter === f.key
                      ? 'bg-[#5a03cf] text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Bulk Actions */}
            {selectedIds.length > 0 ? (
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedIds.length} sélectionnée{selectedIds.length > 1 ? 's' : ''}
                </span>
                <button
                  onClick={handleMarkSelectedAsRead}
                  className="px-3 py-2 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-700 dark:text-green-400 rounded-lg transition-all text-sm flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Marquer lues
                </button>
                <button
                  onClick={handleDeleteSelected}
                  className="px-3 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-lg transition-all text-sm flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-auto">
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllAsRead && currentUser && markAllAsRead(currentUser.id)}
                    className="px-3 sm:px-4 py-2 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg transition-all text-sm text-gray-700 dark:text-gray-300"
                  >
                    Tout marquer comme lu
                  </button>
                )}
                <button
                  onClick={handleSelectAll}
                  className="px-3 sm:px-4 py-2 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg transition-all text-sm text-gray-700 dark:text-gray-300"
                >
                  Sélectionner tout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-16">
            <div className="text-center max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Bell className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl text-gray-900 dark:text-white mb-2">
                Aucune notification
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === 'unread' 
                  ? 'Toutes vos notifications sont lues !'
                  : 'Vous n\'avez aucune notification pour le moment.'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`
                  group relative
                  bg-white dark:bg-gray-900 rounded-xl border-2 
                  ${notification.read 
                    ? 'border-gray-200 dark:border-gray-800 opacity-60' 
                    : 'border-[#5a03cf]/20 hover:border-[#5a03cf]/40'
                  }
                  hover:shadow-lg transition-all p-4 sm:p-5
                `}
              >
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(notification.id)}
                    onChange={() => handleToggleSelect(notification.id)}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-[#5a03cf] focus:ring-[#5a03cf]"
                  />

                  {/* Icon */}
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                    ${notification.read 
                      ? 'bg-gray-100 dark:bg-gray-800' 
                      : 'bg-[#5a03cf]/10'
                    }
                  `}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.read && (
                        <span className="px-2 py-1 bg-[#5a03cf]/10 text-[#5a03cf] rounded-lg text-xs font-semibold whitespace-nowrap">
                          Nouveau
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{notification.date}</span>
                    </div>

                    {/* Actions for reservations */}
                    {notification.type === 'reservation' && notification.reservationId && !notification.read && (
                      <div className="flex items-center gap-2 mt-4">
                        <button
                          onClick={() => handleReservationAction(notification.reservationId!, 'acceptée')}
                          className="px-4 py-2 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] text-white rounded-lg hover:shadow-lg transition-all text-sm flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Accepter
                        </button>
                        <button
                          onClick={() => handleReservationAction(notification.reservationId!, 'refusée')}
                          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Refuser
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
