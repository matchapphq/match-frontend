import apiClient from '../api/client';
import { API_ENDPOINTS } from './api-constants';

export const sendSessionHeartbeat = async (): Promise<void> => {
  await apiClient.post(API_ENDPOINTS.USERS_ME_SESSION_HEARTBEAT, {});
};
