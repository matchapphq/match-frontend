/**
 * Subscriptions Service
 * Handles subscription management for venue owners
 */

import api from './api';
import type {
  Subscription,
  SubscriptionPlansResponse,
  SubscriptionResponse,
  SubscriptionPlan,
  MessageResponse,
} from './types';

export const subscriptionsService = {
  /**
   * Get available subscription plans
   */
  async getPlans(): Promise<SubscriptionPlansResponse> {
    return api.post('/subscriptions/plans');
  },

  /**
   * Create Stripe checkout session
   */
  async createCheckout(data: {
    plan: SubscriptionPlan;
    billing_period?: 'monthly' | 'yearly';
  }): Promise<{
    checkout_url: string;
    session_id: string;
  }> {
    return api.post('/subscriptions/create-checkout', data);
  },

  /**
   * Get current user's subscription
   */
  async getMySubscription(): Promise<SubscriptionResponse> {
    return api.get('/subscriptions/me');
  },

  /**
   * Update payment method
   */
  async updatePaymentMethod(stripePaymentMethodId: string): Promise<SubscriptionResponse> {
    return api.post('/subscriptions/me/update-payment-method', {
      stripe_payment_method_id: stripePaymentMethodId,
    });
  },

  /**
   * Cancel subscription
   */
  async cancelSubscription(): Promise<{
    subscription: Subscription;
    cancellation_date: string;
  }> {
    return api.post('/subscriptions/me/cancel');
  },

  /**
   * Upgrade subscription plan
   */
  async upgradeSubscription(plan: SubscriptionPlan): Promise<{
    subscription: Subscription;
  }> {
    return api.post('/subscriptions/me/upgrade', { plan });
  },

  /**
   * Mock subscription toggle (for testing)
   */
  async mockSubscription(): Promise<{ subscription: Subscription }> {
    return api.post('/subscriptions/mock');
  },
};

export default subscriptionsService;
