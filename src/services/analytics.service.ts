/**
 * Analytics Service
 * Handles venue analytics for venue owners
 */

import api from './api';
import type {
  AnalyticsOverviewResponse,
  AnalyticsTrendsResponse,
} from './types';

interface DateRangeParams {
  start_date?: string;
  end_date?: string;
}

interface TrendParams extends DateRangeParams {
  group_by?: 'day' | 'week' | 'month';
}

export const analyticsService = {
  /**
   * Get venue analytics overview (dashboard metrics)
   */
  async getOverview(venueId: string, params?: DateRangeParams): Promise<AnalyticsOverviewResponse> {
    return api.get(`/venues/${venueId}/analytics/overview`, params);
  },

  /**
   * Get reservation trends over time
   */
  async getReservationTrends(venueId: string, params?: TrendParams): Promise<AnalyticsTrendsResponse> {
    return api.get(`/venues/${venueId}/analytics/reservations`, params);
  },

  /**
   * Get revenue/occupancy trends
   */
  async getRevenueTrends(venueId: string, params?: TrendParams): Promise<AnalyticsTrendsResponse> {
    return api.get(`/venues/${venueId}/analytics/revenue`, params);
  },
};

export default analyticsService;
