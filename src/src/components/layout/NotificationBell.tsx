import { Bell } from 'lucide-react';
import { useState } from 'react';
import { PageType } from '../../types';

interface NotificationBellProps {
  onNavigate: (page: PageType) => void;
  unreadCount?: number;
}

export function NotificationBell({ onNavigate, unreadCount = 3 }: NotificationBellProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={() => onNavigate('notification-center')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed z-40 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-105 group
                 lg:bottom-6 lg:right-6
                 bottom-[calc(6rem+max(1.5rem,calc(1.5rem+env(safe-area-inset-bottom))))] right-6"
      title="Notifications"
    >
      <div className="relative">
        <Bell className={`w-6 h-6 text-gray-600 dark:text-gray-300 transition-all ${isHovered ? 'animate-wiggle' : 'animate-bell-ring'}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse-scale">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </div>
    </button>
  );
}