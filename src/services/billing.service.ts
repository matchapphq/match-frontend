/**
 * Billing Service
 * Handles invoices and transactions for venue owners
 */

import api from './api';
import type {
  Invoice,
  InvoicesResponse,
  Transaction,
  TransactionsResponse,
  PaginationParams,
} from './types';

interface GetInvoicesParams extends PaginationParams {
  status?: string;
}

interface GetTransactionsParams extends PaginationParams {
  type?: string;
  status?: string;
}

export const billingService = {
  // =============================================
  // INVOICES
  // =============================================

  /**
   * Get user's invoices
   */
  async getInvoices(params?: GetInvoicesParams): Promise<InvoicesResponse> {
    return api.get('/invoices', params);
  },

  /**
   * Get invoice by ID
   */
  async getInvoiceById(invoiceId: string): Promise<{ invoice: Invoice }> {
    return api.get(`/invoices/${invoiceId}`);
  },

  /**
   * Download invoice PDF
   * Returns a blob URL for the PDF
   */
  async downloadInvoicePdf(invoiceId: string): Promise<Blob> {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8008'}/invoices/${invoiceId}/pdf`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to download invoice PDF');
    }
    
    return response.blob();
  },

  // =============================================
  // TRANSACTIONS
  // =============================================

  /**
   * Get user's transactions
   */
  async getTransactions(params?: GetTransactionsParams): Promise<TransactionsResponse> {
    return api.get('/transactions', params);
  },

  /**
   * Get transaction by ID
   */
  async getTransactionById(transactionId: string): Promise<{ transaction: Transaction }> {
    return api.get(`/transactions/${transactionId}`);
  },
};

export default billingService;
