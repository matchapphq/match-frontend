import { X, Bell, Calendar, Star, AlertCircle, Zap } from 'lucide-react';
import { useNotificationContext } from '../../context/NotificationContext';
import { PageType } from '../../types';

interface NotificationToastProps {
  onNavigate?: (page: PageType) => void;
}

export function NotificationToast({ onNavigate }: NotificationToastProps) {
  const { showBanner, latestNotification, dismissBanner, markAsRead } = useNotificationContext();

  if (!showBanner || !latestNotification) return null;

  const getIcon = () => {
    switch (latestNotification.type) {
      case 'reservation_confirmed':
        return <Calendar className="w-5 h-5 text-green-500" />;
      case 'reservation_canceled':
        return <Calendar className="w-5 h-5 text-red-500" />;
      case 'match_starting':
        return <Zap className="w-5 h-5 text-orange-500" />;
      case 'review_response':
        return <Star className="w-5 h-5 text-yellow-500" />;
      case 'payment_failed':
      case 'subscription_expiring':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-[#5a03cf]" />;
    }
  };

  const handleClick = () => {
    // Mark as read
    markAsRead(latestNotification.id);
    dismissBanner();
    
    // Navigate based on notification type
    if (onNavigate) {
      if (latestNotification.type === 'reservation_confirmed' || 
          latestNotification.type === 'reservation_canceled') {
        onNavigate('reservations');
      } else {
        onNavigate('notification-center');
      }
    }
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    dismissBanner();
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div 
        onClick={handleClick}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 max-w-sm cursor-pointer hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]"
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#5a03cf]/10 flex items-center justify-center">
            {getIcon()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {latestNotification.title}
              </h4>
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {latestNotification.message}
            </p>
            <p className="text-xs text-[#5a03cf] mt-2 font-medium">
              Cliquez pour voir les détails
            </p>
          </div>
        </div>

        {/* Progress bar for auto-dismiss */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-700 rounded-b-2xl overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#5a03cf] to-[#9cff02] animate-shrink-width"
            style={{ animationDuration: '8s' }}
          />
        </div>
      </div>
    </div>
  );
}
