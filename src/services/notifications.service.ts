/**
 * Notifications Service
 * 
 * API calls related to notifications management
 * Used in: NotificationCenter, NotificationBell
 */

import { API_ENDPOINTS } from '../utils/api-constants';
import { apiGet, apiPost, apiPatch, apiDelete } from '../utils/api-helpers';

// ==================== Types ====================

export interface Notification {
  id: string;
  user_id: string;
  type: 'RESERVATION' | 'MATCH' | 'BOOST' | 'SYSTEM' | 'REFERRAL' | 'PAYMENT';
  title: string;
  message: string;
  data?: any; // Additional JSON data
  is_read: boolean;
  read_at?: string;
  created_at: string;
  
  // UI helpers
  icon?: string;
  action_url?: string;
}

export interface NotificationSummary {
  total_unread: number;
  total_notifications: number;
  by_type: {
    type: string;
    count: number;
  }[];
}

// ==================== Get Notifications ====================

/**
 * Get all notifications for current user
 */
export async function getMyNotifications(params?: {
  is_read?: boolean;
  type?: string;
  limit?: number;
  offset?: number;
}, authToken?: string): Promise<Notification[]> {
  return apiGet<Notification[]>(API_ENDPOINTS.NOTIFICATIONS, params, authToken);
}

/**
 * Get unread notifications count
 */
export async function getUnreadCount(authToken: string): Promise<{
  unread_count: number;
}> {
  return apiGet<{
    unread_count: number;
  }>(API_ENDPOINTS.NOTIFICATIONS, { is_read: false }, authToken);
}

// ==================== Mark as Read ====================

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(notificationId: string, authToken: string): Promise<Notification> {
  return apiPatch<Notification>(API_ENDPOINTS.NOTIFICATION_READ(notificationId), {}, authToken);
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(authToken: string): Promise<{
  success: boolean;
  marked_count: number;
}> {
  return apiPost<{
    success: boolean;
    marked_count: number;
  }>(API_ENDPOINTS.NOTIFICATIONS_READ_ALL, {}, authToken);
}

// ==================== Delete Notifications ====================

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string, authToken: string): Promise<void> {
  return apiDelete(API_ENDPOINTS.NOTIFICATION_DELETE(notificationId), authToken);
}

// ==================== Real-time (WebSocket/SSE) ====================

/**
 * Subscribe to real-time notifications
 * This would typically use WebSocket or Server-Sent Events
 */
export function subscribeToNotifications(authToken: string, callback: (notification: Notification) => void): () => void {
  // Implementation would depend on backend (WebSocket, SSE, etc.)
  // Example with SSE:
  const eventSource = new EventSource(`/api/notifications/stream?token=${authToken}`);
  
  eventSource.onmessage = (event) => {
    const notification = JSON.parse(event.data);
    callback(notification);
  };
  
  // Return cleanup function
  return () => {
    eventSource.close();
  };
}
