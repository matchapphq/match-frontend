/**
 * Analytics Service
 * 
 * API calls related to analytics and statistics
 * Used in: Dashboard
 */

import { API_ENDPOINTS } from '../utils/api-constants';
import { apiGet } from '../utils/api-helpers';

// ==================== Types ====================

export interface DashboardAnalytics {
  total_venues: number;
  total_matches: number;
  total_reservations: number;
  total_revenue: number;
  active_boosts: number;
  available_boosts: number;
  
  // Periods comparison
  reservations_change: number; // percentage
  revenue_change: number; // percentage
  
  // Recent activity
  recent_reservations: any[];
  upcoming_matches: any[];
}

export interface AnalyticsSummary {
  period: string;
  total_views: number;
  total_clicks: number;
  total_reservations: number;
  total_revenue: number;
  conversion_rate: number;
  average_party_size: number;
  
  // By channel
  organic_views: number;
  boosted_views: number;
  
  // Trends
  views_trend: number[];
  reservations_trend: number[];
  revenue_trend: number[];
}

export interface CustomerStats {
  total_customers: number;
  new_customers: number;
  returning_customers: number;
  retention_rate: number;
  average_visits: number;
  top_customers: Array<{
    id: string;
    name: string;
    email: string;
    total_visits: number;
    total_spent: number;
    last_visit: string;
  }>;
}

export interface VenueAnalytics {
  venue_id: string;
  venue_name: string;
  
  // Performance
  total_views: number;
  total_reservations: number;
  total_revenue: number;
  conversion_rate: number;
  
  // Capacity
  total_capacity: number;
  average_occupancy: number;
  peak_occupancy: number;
  
  // Trends
  daily_stats: Array<{
    date: string;
    views: number;
    reservations: number;
    revenue: number;
  }>;
}

// ==================== Dashboard Analytics ====================

/**
 * Get dashboard analytics overview
 */
export async function getDashboardAnalytics(params?: {
  date_from?: string;
  date_to?: string;
  venue_id?: string;
}, authToken?: string): Promise<DashboardAnalytics> {
  return apiGet<DashboardAnalytics>(API_ENDPOINTS.PARTNERS_ANALYTICS_DASHBOARD, params, authToken);
}

/**
 * Get analytics summary
 */
export async function getAnalyticsSummary(params?: {
  period?: 'day' | 'week' | 'month' | 'year';
  date_from?: string;
  date_to?: string;
  venue_id?: string;
}, authToken?: string): Promise<AnalyticsSummary> {
  return apiGet<AnalyticsSummary>(API_ENDPOINTS.PARTNERS_ANALYTICS_SUMMARY, params, authToken);
}

// ==================== Customer Analytics ====================

/**
 * Get customer statistics
 */
export async function getCustomerStats(params?: {
  venue_id?: string;
  date_from?: string;
  date_to?: string;
}, authToken?: string): Promise<CustomerStats> {
  return apiGet<CustomerStats>(API_ENDPOINTS.PARTNERS_STATS_CUSTOMERS, params, authToken);
}

/**
 * Get venue clients
 */
export async function getVenueClients(venueId: string, params?: {
  search?: string;
  sort_by?: 'name' | 'visits' | 'spent' | 'last_visit';
  limit?: number;
  offset?: number;
}, authToken?: string): Promise<any[]> {
  return apiGet(API_ENDPOINTS.PARTNERS_VENUE_CLIENTS(venueId), params, authToken);
}

// ==================== Venue Performance ====================

/**
 * Get analytics for a specific venue
 */
export async function getVenueAnalytics(venueId: string, params?: {
  date_from?: string;
  date_to?: string;
}, authToken?: string): Promise<VenueAnalytics> {
  // This would need a dedicated endpoint or use dashboard with venue_id filter
  return getDashboardAnalytics({ ...params, venue_id: venueId }, authToken) as any;
}
