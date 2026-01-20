/**
 * Subscriptions Hook
 * 
 * Custom hooks for subscription-related API calls
 */

import { useApiCall, useApiMutation, getAuthToken } from './useApi';
import * as SubscriptionsService from '../services/subscriptions.service';
import type { SubscriptionPlan, Subscription, Invoice } from '../services/subscriptions.service';

// ==================== Get Subscriptions ====================

export function useSubscriptionPlans() {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => SubscriptionsService.getSubscriptionPlans(authToken),
    [authToken]
  );
}

export function useMySubscription() {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => SubscriptionsService.getMySubscription(authToken),
    [authToken]
  );
}

export function useSubscriptionInvoices(params?: {
  status?: 'PAID' | 'PENDING' | 'FAILED';
  limit?: number;
  offset?: number;
}) {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => SubscriptionsService.getSubscriptionInvoices(params, authToken),
    [JSON.stringify(params), authToken]
  );
}

export function useAllInvoices(params?: {
  venue_id?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}) {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => SubscriptionsService.getAllInvoices(params, authToken),
    [JSON.stringify(params), authToken]
  );
}

export function useInvoiceDetails(invoiceId: string) {
  const authToken = getAuthToken();
  
  return useApiCall(
    () => SubscriptionsService.getInvoiceDetails(invoiceId, authToken),
    [invoiceId, authToken],
    { immediate: !!invoiceId }
  );
}

// ==================== Mutations ====================

export function useCreateSubscriptionCheckout() {
  const authToken = getAuthToken();
  
  return useApiMutation<
    { checkout_url: string; session_id: string },
    {
      plan: string;
      billing_period: 'monthly' | 'yearly';
      venue_id?: string;
    }
  >(
    (data) => SubscriptionsService.createSubscriptionCheckout(data, authToken)
  );
}

export function useVerifyCheckout() {
  const authToken = getAuthToken();
  
  return useApiMutation<
    {
      success: boolean;
      subscription_id: string;
      message: string;
    },
    string
  >(
    (sessionId) => SubscriptionsService.verifyCheckout(sessionId, authToken)
  );
}

export function useCancelSubscription() {
  const authToken = getAuthToken();
  
  return useApiMutation<
    {
      success: boolean;
      message: string;
      cancelled_at?: string;
    },
    {
      cancel_at_period_end: boolean;
      reason?: string;
    }
  >(
    (data) => SubscriptionsService.cancelSubscription(data, authToken)
  );
}

export function useUpdatePaymentMethod() {
  const authToken = getAuthToken();
  
  return useApiMutation<
    { portal_url: string },
    void
  >(
    () => SubscriptionsService.updatePaymentMethod(authToken)
  );
}

export function useUpgradeSubscription() {
  const authToken = getAuthToken();
  
  return useApiMutation<
    {
      success: boolean;
      message: string;
      new_subscription: Subscription;
    },
    {
      new_plan_id: string;
      billing_period: 'monthly' | 'yearly';
    }
  >(
    (data) => SubscriptionsService.upgradeSubscription(data, authToken)
  );
}
