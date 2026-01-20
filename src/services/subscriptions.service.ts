/**
 * Subscriptions Service
 * 
 * API calls related to subscriptions management
 * Used in: PaiementValidation, Facturation
 */

import { API_ENDPOINTS } from '../utils/api-constants';
import { apiGet, apiPost, apiPatch } from '../utils/api-helpers';

// ==================== Types ====================

export interface SubscriptionPlan {
  id: string;
  name: string;
  billing_period: 'monthly' | 'yearly';
  price: number;
  currency: string;
  features: string[];
  is_active: boolean;
}

export interface Subscription {
  id: string;
  venue_id: string;
  plan_id: string;
  plan_name: string;
  billing_period: 'monthly' | 'yearly';
  status: 'ACTIVE' | 'CANCELLED' | 'PAST_DUE' | 'UNPAID';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  cancelled_at?: string;
  amount: number;
  currency: string;
  stripe_subscription_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  subscription_id: string;
  amount: number;
  currency: string;
  status: 'PAID' | 'PENDING' | 'FAILED';
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  paid_at?: string;
  invoice_pdf_url?: string;
  stripe_invoice_id?: string;
}

// ==================== Subscription Plans ====================

/**
 * Get all available subscription plans
 */
export async function getSubscriptionPlans(authToken?: string): Promise<SubscriptionPlan[]> {
  return apiGet<SubscriptionPlan[]>(API_ENDPOINTS.SUBSCRIPTIONS_PLANS, undefined, authToken);
}

// ==================== Create Subscription ====================

/**
 * Create Stripe checkout session for subscription
 */
export async function createSubscriptionCheckout(data: {
  plan: string;
  billing_period: 'monthly' | 'yearly';
  venue_id?: string;
}, authToken: string): Promise<{
  checkout_url: string;
  session_id: string;
}> {
  return apiPost<{
    checkout_url: string;
    session_id: string;
  }>(API_ENDPOINTS.SUBSCRIPTIONS_CREATE_CHECKOUT, data, authToken);
}

/**
 * Verify checkout after Stripe redirect
 */
export async function verifyCheckout(sessionId: string, authToken: string): Promise<{
  success: boolean;
  subscription_id: string;
  message: string;
}> {
  return apiPost<{
    success: boolean;
    subscription_id: string;
    message: string;
  }>(API_ENDPOINTS.PARTNERS_VENUES_VERIFY_CHECKOUT, { session_id: sessionId }, authToken);
}

// ==================== Current Subscription ====================

/**
 * Get current user's subscription
 */
export async function getMySubscription(authToken: string): Promise<Subscription> {
  return apiGet<Subscription>(API_ENDPOINTS.SUBSCRIPTIONS_ME, undefined, authToken);
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(data: {
  cancel_at_period_end: boolean;
  reason?: string;
}, authToken: string): Promise<{
  success: boolean;
  message: string;
  cancelled_at?: string;
}> {
  return apiPost<{
    success: boolean;
    message: string;
    cancelled_at?: string;
  }>(API_ENDPOINTS.SUBSCRIPTIONS_CANCEL, data, authToken);
}

/**
 * Update payment method
 */
export async function updatePaymentMethod(authToken: string): Promise<{
  portal_url: string;
}> {
  return apiPost<{
    portal_url: string;
  }>(API_ENDPOINTS.SUBSCRIPTIONS_UPDATE_PAYMENT, {}, authToken);
}

/**
 * Upgrade subscription
 */
export async function upgradeSubscription(data: {
  new_plan_id: string;
  billing_period: 'monthly' | 'yearly';
}, authToken: string): Promise<{
  success: boolean;
  message: string;
  new_subscription: Subscription;
}> {
  return apiPost<{
    success: boolean;
    message: string;
    new_subscription: Subscription;
  }>(API_ENDPOINTS.SUBSCRIPTIONS_UPGRADE, data, authToken);
}

// ==================== Invoices ====================

/**
 * Get subscription invoices
 */
export async function getSubscriptionInvoices(params?: {
  status?: 'PAID' | 'PENDING' | 'FAILED';
  limit?: number;
  offset?: number;
}, authToken?: string): Promise<Invoice[]> {
  return apiGet<Invoice[]>(API_ENDPOINTS.SUBSCRIPTIONS_INVOICES, params, authToken);
}

/**
 * Get all invoices (partner)
 */
export async function getAllInvoices(params?: {
  venue_id?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}, authToken?: string): Promise<Invoice[]> {
  return apiGet<Invoice[]>(API_ENDPOINTS.INVOICES, params, authToken);
}

/**
 * Get invoice details
 */
export async function getInvoiceDetails(invoiceId: string, authToken: string): Promise<Invoice> {
  return apiGet<Invoice>(API_ENDPOINTS.INVOICE_DETAILS(invoiceId), undefined, authToken);
}

/**
 * Download invoice PDF
 */
export async function downloadInvoicePDF(invoiceId: string, authToken: string): Promise<Blob> {
  const { apiDownload } = await import('../utils/api-helpers');
  return apiDownload(API_ENDPOINTS.INVOICE_PDF(invoiceId), authToken);
}

// ==================== Transactions ====================

/**
 * Get all transactions
 */
export async function getTransactions(params?: {
  type?: 'SUBSCRIPTION' | 'BOOST' | 'REFUND';
  status?: string;
  date_from?: string;
  date_to?: string;
  limit?: number;
  offset?: number;
}, authToken?: string): Promise<any[]> {
  return apiGet(API_ENDPOINTS.TRANSACTIONS, params, authToken);
}

/**
 * Get transaction details
 */
export async function getTransactionDetails(transactionId: string, authToken: string): Promise<any> {
  return apiGet(API_ENDPOINTS.TRANSACTION_DETAILS(transactionId), undefined, authToken);
}

// ==================== Mock Subscription (Dev) ====================

/**
 * Create mock subscription for testing (dev only)
 */
export async function createMockSubscription(data: {
  venue_id: string;
  billing_period: 'monthly' | 'yearly';
}, authToken: string): Promise<Subscription> {
  return apiPost<Subscription>(API_ENDPOINTS.SUBSCRIPTIONS_MOCK, data, authToken);
}
