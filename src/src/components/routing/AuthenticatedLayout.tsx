import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { Sidebar } from '../layout/Sidebar';
import { NotificationBell } from '../layout/NotificationBell';
import { NotificationBanner } from '../NotificationBanner';
import { QrCode } from 'lucide-react';
import { useAuth } from '../../features/authentication/context/AuthContext';
import { useAppNavigate } from '../../hooks/useAppNavigate';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { sendSessionHeartbeat as triggerSessionHeartbeat } from '../../utils/session-heartbeat';
import type { PageType } from '../../types';

/**
 * Layout wrapper for all authenticated pages that shows the sidebar,
 * notification bell, banner, and QR scanner button.
 */
export function AuthenticatedLayout() {
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { navigateTo } = useAppNavigate();

  const { data: notifications = [] } = useQuery<{ id: string; read: boolean }[]>({
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
    refetchInterval: 30000,
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const isQrScanner = location.pathname === '/qr-scanner';

  const handleBellNavigate = (page: PageType) => {
    navigateTo(page);
  };

  const sendSessionHeartbeat = useCallback(() => {
    if (!isAuthenticated || !currentUser) return;
    triggerSessionHeartbeat().catch(() => undefined);
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    sendSessionHeartbeat();
  }, [location.pathname, sendSessionHeartbeat]);

  useEffect(() => {
    if (!isAuthenticated || !currentUser) return;

    const onFocus = () => sendSessionHeartbeat();
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        sendSessionHeartbeat();
      }
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [isAuthenticated, currentUser, sendSessionHeartbeat]);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
      <Sidebar />
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <NotificationBanner
          type="info"
          message="🎉 Nouveau : Le système de réservations est maintenant disponible !"
          action={{
            label: "Découvrir",
            onClick: () => navigate('/reservations') // already English
          }}
        />

        <Outlet />
      </div>

      {/* Notification Bell - Fixed top right */}
      {isAuthenticated && (
        <NotificationBell onNavigate={handleBellNavigate} unreadCount={unreadCount} />
      )}

      {/* Floating QR Scanner Button - Only on mobile when authenticated */}
      {isAuthenticated && !isQrScanner && (
        <button
          onClick={() => navigate('/qr-scanner')}
          className="lg:hidden fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] text-white rounded-full shadow-2xl shadow-[#5a03cf]/40 hover:scale-110 transition-transform duration-300 flex items-center justify-center"
          style={{
            bottom: 'max(1.5rem, calc(1.5rem + env(safe-area-inset-bottom)))'
          }}
        >
          <QrCode className="w-8 h-8" />
        </button>
      )}
    </div>
  );
}
