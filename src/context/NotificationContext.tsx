import { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';
import { useNotificationPolling, useMarkAllAsRead, useMarkAsRead, Notification } from '../hooks/api/useNotifications';
import { useAuth } from '../features/authentication/context/AuthContext';

interface NotificationContextType {
  unreadCount: number;
  newNotifications: Notification[];
  latestNotification: Notification | null;
  showBanner: boolean;
  dismissBanner: () => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNewNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [showBanner, setShowBanner] = useState(false);
  const [latestNotification, setLatestNotification] = useState<Notification | null>(null);
  const bannerTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  // Handle new notification arrival
  const handleNewNotification = useCallback((notification: Notification) => {
    setLatestNotification(notification);
    setShowBanner(true);

    // Play notification sound (optional - can be enabled/disabled)
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio('/notification.mp3');
        audioRef.current.volume = 0.5;
      }
      audioRef.current.play().catch(() => {
        // Audio play failed - likely due to browser autoplay policy
      });
    } catch (e) {
      // Audio not supported
    }

    // Auto-dismiss banner after 8 seconds
    if (bannerTimeoutRef.current) {
      clearTimeout(bannerTimeoutRef.current);
    }
    bannerTimeoutRef.current = setTimeout(() => {
      setShowBanner(false);
    }, 8000);
  }, []);

  // Only enable polling when user is logged in
  const { newNotifications, unreadCount, clearNewNotifications } = useNotificationPolling({
    enabled: !!currentUser,
    interval: 15000, // Poll every 15 seconds
    onNewNotification: handleNewNotification,
  });

  const dismissBanner = useCallback(() => {
    setShowBanner(false);
    if (bannerTimeoutRef.current) {
      clearTimeout(bannerTimeoutRef.current);
    }
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  }, [markAsReadMutation]);

  const markAllAsReadHandler = useCallback(() => {
    markAllAsReadMutation.mutate();
    setShowBanner(false);
    setLatestNotification(null);
  }, [markAllAsReadMutation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (bannerTimeoutRef.current) {
        clearTimeout(bannerTimeoutRef.current);
      }
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        newNotifications,
        latestNotification,
        showBanner,
        dismissBanner,
        markAsRead,
        markAllAsRead: markAllAsReadHandler,
        clearNewNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}
