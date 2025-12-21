import { ArrowLeft, Download, FileText, CreditCard, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useInvoices, useTransactions, useSubscription } from '../hooks';
import type { Invoice, Transaction } from '../services/types';

interface BillingHistoryProps {
  onBack: () => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatAmount = (amount: number, currency: string = 'EUR') => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100);
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'paid':
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
          <CheckCircle className="w-4 h-4" />
          Payé
        </span>
      );
    case 'pending':
    case 'open':
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
          <Clock className="w-4 h-4" />
          En attente
        </span>
      );
    case 'failed':
    case 'void':
    case 'uncollectible':
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
          <XCircle className="w-4 h-4" />
          Échoué
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
          {status}
        </span>
      );
  }
};

export function BillingHistory({ onBack }: BillingHistoryProps) {
  const { invoices, isLoading: invoicesLoading, downloadPdf } = useInvoices();
  const { transactions, isLoading: transactionsLoading } = useTransactions();
  const { subscription, isLoading: subscriptionLoading } = useSubscription();

  const isLoading = invoicesLoading || transactionsLoading || subscriptionLoading;

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      await downloadPdf(invoiceId);
    } catch (error) {
      console.error('Failed to download invoice:', error);
      alert('Erreur lors du téléchargement de la facture');
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour
      </button>

      <div className="mb-8">
        <h1 className="text-gray-900 italic text-4xl mb-2" style={{ fontWeight: '700', color: '#5a03cf' }}>
          Facturation
        </h1>
        <p className="text-gray-600 text-lg">Gérez vos factures et votre abonnement</p>
      </div>

      {/* Current Subscription */}
      {subscription && (
        <div className="bg-gradient-to-r from-[#5a03cf]/10 to-[#9cff02]/10 rounded-xl p-6 mb-8 border-2 border-[#5a03cf]/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl mb-2" style={{ fontWeight: '700', color: '#5a03cf' }}>
                Abonnement actuel
              </h2>
              <p className="text-gray-700">
                Plan <span className="font-semibold capitalize">{subscription.plan}</span>
              </p>
              <p className="text-gray-600 text-sm mt-1">
                Renouvellement le {formatDate(subscription.current_period_end)}
              </p>
            </div>
            <div className="text-right">
              {getStatusBadge(subscription.status)}
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5a03cf]"></div>
        </div>
      ) : (
        <>
          {/* Invoices */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl flex items-center gap-2" style={{ fontWeight: '700', color: '#5a03cf' }}>
                <FileText className="w-5 h-5" />
                Factures
              </h2>
            </div>
            
            {invoices.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Aucune facture disponible
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {invoices.map((invoice: Invoice) => (
                  <div key={invoice.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="bg-[#5a03cf]/10 p-2 rounded-lg">
                        <FileText className="w-5 h-5 text-[#5a03cf]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Facture #{invoice.invoice_number}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(invoice.invoice_date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-900">
                        {formatAmount(invoice.amount, invoice.currency)}
                      </span>
                      {getStatusBadge(invoice.status)}
                      <button
                        onClick={() => handleDownloadInvoice(invoice.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Télécharger la facture"
                      >
                        <Download className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl flex items-center gap-2" style={{ fontWeight: '700', color: '#5a03cf' }}>
                <CreditCard className="w-5 h-5" />
                Transactions
              </h2>
            </div>
            
            {transactions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Aucune transaction disponible
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {transactions.map((transaction: Transaction) => (
                  <div key={transaction.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === 'payment' 
                          ? 'bg-green-100' 
                          : transaction.type === 'refund' 
                          ? 'bg-red-100' 
                          : 'bg-gray-100'
                      }`}>
                        <CreditCard className={`w-5 h-5 ${
                          transaction.type === 'payment' 
                            ? 'text-green-600' 
                            : transaction.type === 'refund' 
                            ? 'text-red-600' 
                            : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">
                          {transaction.type === 'payment' ? 'Paiement' : 
                           transaction.type === 'refund' ? 'Remboursement' : 
                           transaction.description || 'Transaction'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(transaction.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`font-semibold ${
                        transaction.type === 'refund' ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        {transaction.type === 'refund' ? '-' : ''}
                        {formatAmount(transaction.amount, transaction.currency)}
                      </span>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
