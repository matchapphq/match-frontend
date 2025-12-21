/**
 * Notifications Service
 * Handles user notifications
 */

import api from './api';
import type {
  Notification,
  NotificationsResponse,
  PaginationParams,
  MessageResponse,
} from './types';

interface GetNotificationsParams extends PaginationParams {
  is_read?: boolean;
  type?: string;
}

export const notificationsService = {
  /**
   * Get user's notifications
   */
  async getAll(params?: GetNotificationsParams): Promise<NotificationsResponse> {
    return api.get('/notifications', params);
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<{ notification: Notification }> {
    return api.put(`/notifications/${notificationId}/read`);
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<MessageResponse> {
    return api.put('/notifications/read-all');
  },

  /**
   * Delete notification
   */
  async delete(notificationId: string): Promise<MessageResponse> {
    return api.delete(`/notifications/${notificationId}`);
  },
};

export default notificationsService;
