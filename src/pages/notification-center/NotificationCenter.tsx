import { PageType } from '../../types';
import { useAuth } from '../../features/authentication/context/AuthContext';
import { Bell, Check, Clock, ChevronLeft, Trash2, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../api/client';

interface NotificationCenterProps {
  onNavigate: (page: PageType) => void;
}

interface ApiNotification {
  id: string;
  user_id: string;
  type: 'reservation' | 'review' | 'referral' | 'system';
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  metadata?: any;
}

export function NotificationCenter({ onNavigate }: NotificationCenterProps) {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery<ApiNotification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/notifications');
        return response.data?.notifications || response.data || [];
      } catch {
        return [];
      }
    },
    enabled: !!currentUser,
    refetchInterval: 30000, // Poll every 30s
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllMutation = useMutation({
    mutationFn: () => apiClient.put('/notifications/read-all'),
    onSuccess: () => {
      queryClient.setQueryData<ApiNotification[]>(['notifications'], (old) =>
        (old || []).map(n => ({ ...n, read: true }))
      );
    },
  });

  const markOneMutation = useMutation({
    mutationFn: (id: string) => apiClient.put(`/notifications/${id}/read`),
    onSuccess: (_, id) => {
      queryClient.setQueryData<ApiNotification[]>(['notifications'], (old) =>
        (old || []).map(n => n.id === id ? { ...n, read: true } : n)
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/notifications/${id}`),
    onSuccess: (_, id) => {
      queryClient.setQueryData<ApiNotification[]>(['notifications'], (old) =>
        (old || []).filter(n => n.id !== id)
      );
    },
  });

  const handleMarkAllRead = () => {
    markAllMutation.mutate();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'reservation':
        return '📅';
      case 'review':
        return '⭐';
      case 'referral':
        return '🤝';
      case 'system':
        return '🔔';
      default:
        return '📌';
    }
  };

  const safeParseDateISO = (dateStr: string): Date => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#5a03cf]" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 pb-32 lg:pb-6 max-w-4xl mx-auto">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3 lg:gap-4">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors lg:hidden flex-shrink-0"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white flex flex-wrap items-center gap-2 lg:gap-3">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2.5 lg:px-3 py-1 bg-[#5a03cf] text-white text-xs lg:text-sm font-medium rounded-full whitespace-nowrap">
                  {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </h1>
            <p className="text-sm lg:text-base text-gray-500 dark:text-gray-400 mt-1">
              Restez informé de l'activité de votre établissement
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center justify-center lg:justify-start gap-2 px-4 py-2 text-sm font-medium text-[#5a03cf] hover:bg-[#5a03cf]/5 rounded-xl transition-colors w-full lg:w-auto"
          >
            <Check className="w-4 h-4" />
            <span>Tout marquer comme lu</span>
          </button>
        )}
      </header>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12 lg:py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 border-dashed">
            <Bell className="w-12 h-12 lg:w-16 lg:h-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-lg lg:text-xl font-medium text-gray-900 dark:text-white mb-2">
              Aucune notification
            </h3>
            <p className="text-sm lg:text-base text-gray-500 dark:text-gray-400 px-4">
              Vous êtes à jour ! Les nouvelles notifications apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                onClick={() => {
                  if (!notification.read) markOneMutation.mutate(notification.id);
                }}
                className={`
                  p-4 lg:p-5 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors relative group cursor-pointer
                  ${!notification.read ? 'bg-[#5a03cf]/5 dark:bg-[#5a03cf]/10' : ''}
                `}
              >
                <div className="flex gap-3 lg:gap-4">
                  <div className={`
                    w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center text-lg lg:text-xl flex-shrink-0
                    ${!notification.read ? 'bg-white dark:bg-gray-800 shadow-sm' : 'bg-gray-100 dark:bg-gray-700 grayscale opacity-70'}
                  `}>
                    {getIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 lg:gap-4 mb-1">
                      <h3 className={`font-semibold text-sm lg:text-base ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                        {notification.title}
                      </h3>
                      <span className="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1 flex-shrink-0">
                        <Clock className="w-3 h-3" />
                        <span className="hidden lg:inline">
                          {formatDistanceToNow(safeParseDateISO(notification.created_at), { addSuffix: true, locale: fr })}
                        </span>
                        <span className="lg:hidden">
                          {formatDistanceToNow(safeParseDateISO(notification.created_at), { addSuffix: true, locale: fr }).replace('il y a ', '').replace('dans ', '')}
                        </span>
                      </span>
                    </div>
                    
                    <p className={`text-xs lg:text-sm ${!notification.read ? 'text-gray-600 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500'}`}>
                      {notification.message}
                    </p>

                    {/* Actions contextuelles */}
                    {notification.type === 'reservation' && (
                      <div className="mt-2 lg:mt-3 flex gap-3">
                        <button 
                          onClick={(e) => { e.stopPropagation(); onNavigate('reservations'); }}
                          className="text-xs font-medium text-[#5a03cf] hover:underline"
                        >
                          Voir la réservation
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-2 flex-shrink-0">
                    {!notification.read && (
                      <div className="w-2 h-2 bg-[#9cff02] rounded-full mt-1 lg:mt-2" />
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(notification.id); }}
                      className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4 text-red-400 hover:text-red-500" />
                    </button>
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
