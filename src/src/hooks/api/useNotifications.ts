import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useCallback, useState } from 'react';
import apiClient from '../../api/client';
import { API_ENDPOINTS } from '../../utils/api-constants';

// Types
export interface Notification {
  id: string;
  user_id: string;
  type: 'reservation_confirmed' | 'reservation_canceled' | 'reservation_reminder' | 
        'match_starting' | 'review_response' | 'subscription_expiring' | 
        'payment_failed' | 'promotional' | 'system' | 'match_nearby' | 'venue_nearby';
  title: string;
  message: string;
  related_entity_type?: string;
  related_entity_id?: string;
  is_read: boolean;
  read_at?: string;
  send_email?: boolean;
  send_push?: boolean;
  send_sms?: boolean;
  created_at: string;
}

interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  pagination: {
    limit: number;
    offset: number;
  };
}

interface UnreadCountResponse {
  unreadCount: number;
}

interface NewNotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  hasNew: boolean;
}

// Query keys
export const notificationKeys = {
  all: ['notifications'] as const,
  list: () => [...notificationKeys.all, 'list'] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
  new: (since: string) => [...notificationKeys.all, 'new', since] as const,
};

/**
 * Hook to fetch all notifications
 */
export function useNotifications(options?: { limit?: number; offset?: number; unreadOnly?: boolean }) {
  const { limit = 50, offset = 0, unreadOnly = false } = options || {};

  return useQuery({
    queryKey: [...notificationKeys.list(), { limit, offset, unreadOnly }],
    queryFn: async (): Promise<NotificationsResponse> => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
        ...(unreadOnly && { unreadOnly: 'true' }),
      });
      const response = await apiClient.get(`${API_ENDPOINTS.NOTIFICATIONS}?${params}`);
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to fetch unread count only (lightweight for polling)
 */
export function useUnreadCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: async (): Promise<number> => {
      const response = await apiClient.get<UnreadCountResponse>(API_ENDPOINTS.NOTIFICATIONS_UNREAD_COUNT);
      return response.data.unreadCount;
    },
    staleTime: 10 * 1000, // 10 seconds
    refetchInterval: 30 * 1000, // Poll every 30 seconds
  });
}

/**
 * Hook to mark a single notification as read
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await apiClient.put(API_ENDPOINTS.NOTIFICATION_READ(notificationId));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/**
 * Hook to mark all notifications as read
 */
export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.put(API_ENDPOINTS.NOTIFICATIONS_READ_ALL);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/**
 * Hook to delete a notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await apiClient.delete(API_ENDPOINTS.NOTIFICATION_DELETE(notificationId));
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/**
 * Hook for real-time notification polling
 * Returns new notifications and provides callbacks for handling them
 */
export function useNotificationPolling(options?: {
  enabled?: boolean;
  interval?: number;
  onNewNotification?: (notification: Notification) => void;
}) {
  const { enabled = true, interval = 15000, onNewNotification } = options || {};
  const queryClient = useQueryClient();
  const lastCheckRef = useRef<Date>(new Date());
  const [newNotifications, setNewNotifications] = useState<Notification[]>([]);

  const { data, refetch } = useQuery({
    queryKey: ['notifications', 'polling'],
    queryFn: async (): Promise<NewNotificationsResponse> => {
      const since = lastCheckRef.current.toISOString();
      console.log('[Notifications] Polling for new notifications since:', since);
      const response = await apiClient.get<NewNotificationsResponse>(
        `${API_ENDPOINTS.NOTIFICATIONS_NEW}?since=${encodeURIComponent(since)}`
      );
      console.log('[Notifications] Poll response:', response.data);
      return response.data;
    },
    enabled,
    refetchInterval: interval,
    staleTime: 0,
  });

  // Handle new notifications
  useEffect(() => {
    if (data?.hasNew && data.notifications.length > 0) {
      // Update last check time
      lastCheckRef.current = new Date();
      
      // Store new notifications
      setNewNotifications(data.notifications);
      
      // Call callback for each new notification
      if (onNewNotification) {
        data.notifications.forEach(notification => {
          onNewNotification(notification);
        });
      }
      
      // Invalidate notifications cache to update UI
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    }
  }, [data, onNewNotification, queryClient]);

  const clearNewNotifications = useCallback(() => {
    setNewNotifications([]);
  }, []);

  const resetPolling = useCallback(() => {
    lastCheckRef.current = new Date();
    setNewNotifications([]);
  }, []);

  return {
    newNotifications,
    unreadCount: data?.unreadCount ?? 0,
    hasNew: data?.hasNew ?? false,
    clearNewNotifications,
    resetPolling,
    refetch,
  };
}
