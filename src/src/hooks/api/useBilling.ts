import { useMutation, useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { API_ENDPOINTS } from '../../utils/api-constants';

export interface BillingPricing {
  model: string;
  default_rate: string;
  currency: string;
  unit: string;
}

export interface BillingSetupCheckoutPayload {
  flow: string;
  venue_id?: string;
  success_url?: string;
  cancel_url?: string;
}

export interface BillingSetupCheckoutResponse {
  checkout_url: string;
  session_id?: string;
}

export interface BillingPaymentMethod {
  has_payment_method: boolean;
  payment_method?: {
    type?: string;
    brand?: string | null;
    last4?: string | null;
    exp_month?: number | null;
    exp_year?: number | null;
  } | null;
}

interface BillingPaymentMethodOptions {
  enabled?: boolean;
  refetchInterval?: number | false;
}

export interface AccruedCommission {
  amount: string | number;
  currency: string;
}

/**
 * Fetch commission pricing model details.
 */
export function useBillingPricing() {
  return useQuery<BillingPricing>({
    queryKey: ['billing-pricing'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.BILLING_PRICING);
      return response.data?.pricing ?? response.data;
    },
  });
}

/**
 * Create a Stripe setup-checkout session for billing configuration.
 */
export function useBillingSetupCheckout() {
  return useMutation<BillingSetupCheckoutResponse, Error, BillingSetupCheckoutPayload>({
    mutationFn: async (payload) => {
      const response = await apiClient.post(API_ENDPOINTS.BILLING_SETUP_CHECKOUT, payload);
      return response.data;
    },
  });
}

/**
 * Fetch payment method status for the authenticated user.
 */
export function useBillingPaymentMethod(options?: BillingPaymentMethodOptions) {
  const { enabled = true, refetchInterval = false } = options || {};

  return useQuery<BillingPaymentMethod>({
    queryKey: ['billing-payment-method'],
    enabled,
    refetchInterval,
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.BILLING_PAYMENT_METHOD);
      return response.data?.payment_method_status ?? response.data;
    },
  });
}

/**
 * Fetch accrued commission amount.
 */
export function useAccruedCommission() {
  return useQuery<AccruedCommission>({
    queryKey: ['accrued-commission'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.ACCRUED_COMMISSION);
      return response.data?.accrued_commission ?? response.data;
    },
  });
}
