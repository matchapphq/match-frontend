import { useState, useEffect, useCallback } from 'react';
import { billingService, subscriptionsService } from '../services';
import type { Invoice, Transaction, Subscription, SubscriptionPlan } from '../services/types';

/**
 * Hook for fetching invoices
 */
export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await billingService.getInvoices();
      setInvoices(response.invoices);
      setTotal(response.total);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const downloadPdf = async (invoiceId: string): Promise<void> => {
    const blob = await billingService.downloadInvoicePdf(invoiceId);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoiceId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return { invoices, total, isLoading, error, refetch: fetchInvoices, downloadPdf };
}

/**
 * Hook for fetching transactions
 */
export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await billingService.getTransactions();
      setTransactions(response.transactions);
      setTotal(response.total);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { transactions, total, isLoading, error, refetch: fetchTransactions };
}

/**
 * Hook for subscription management
 */
export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubscription = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await subscriptionsService.getMySubscription();
      setSubscription(response.subscription);
    } catch (err) {
      // No subscription is not an error for new users
      if ((err as Error).message?.includes('404')) {
        setSubscription(null);
      } else {
        setError(err as Error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const upgrade = async (plan: SubscriptionPlan): Promise<void> => {
    const response = await subscriptionsService.upgradeSubscription(plan);
    setSubscription(response.subscription);
  };

  const cancel = async (): Promise<void> => {
    const response = await subscriptionsService.cancelSubscription();
    setSubscription(response.subscription);
  };

  const createCheckout = async (plan: SubscriptionPlan, billingPeriod?: 'monthly' | 'yearly') => {
    return subscriptionsService.createCheckout({ plan, billing_period: billingPeriod });
  };

  return {
    subscription,
    isLoading,
    error,
    refetch: fetchSubscription,
    upgrade,
    cancel,
    createCheckout,
  };
}
