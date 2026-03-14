import { useEffect, useMemo, useState } from 'react';
import { PageType } from '../../src/types';
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  CalendarDays,
  CreditCard,
  Loader2,
  MapPin,
  Plus,
  Receipt,
  Wallet,
} from 'lucide-react';
import { usePartnerVenues } from '../../src/hooks/api/useVenues';
import { useVenueInvoices, useVenuePaymentPortal } from '../../src/hooks/api/useAccount';
import { useAccruedCommission, useBillingPaymentMethod, useBillingPricing } from '../../src/hooks/api/useBilling';
import { formatPricingLabel } from '../../src/utils/pricing';
import { toast } from 'sonner';

interface CompteFacturationProps {
  onNavigate?: (page: PageType) => void;
  onBack?: () => void;
}

type BillingVenue = {
  id: string;
  nom: string;
  ville: string;
  statusKey: string;
  statusLabel: string;
};

type BillingInvoice = {
  id: string;
  numero: string;
  date: string;
  dateLabel: string;
  dueDate?: string;
  montant: string;
  statusKey: string;
  statusLabel: string;
  pdfUrl?: string;
};

function formatDateLabel(value?: string | null) {
  if (!value) return 'Non disponible';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Non disponible';

  return new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'UTC',
  }).format(date);
}

function formatAmountLabel(value?: string | number | null, currency = 'EUR') {
  if (value === null || value === undefined || value === '') return 'Non disponible';

  const numericValue = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(numericValue)) return 'Non disponible';

  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    maximumFractionDigits: numericValue % 1 === 0 ? 0 : 2,
  }).format(numericValue);
}

function resolveVenueStatus(venue: { status?: string; is_active?: boolean }) {
  if (venue.is_active === true) {
    return 'active';
  }

  if (venue.status === 'pending') {
    return 'pending';
  }

  if (venue.status === 'rejected') {
    return 'rejected';
  }

  if (venue.status === 'suspended') {
    return 'suspended';
  }

  return 'inactive';
}

function getVenueStatusLabel(status: string) {
  switch (status) {
    case 'active':
      return 'Actif';
    case 'pending':
      return 'En attente de paiement';
    case 'rejected':
      return 'Refusé';
    case 'suspended':
      return 'Suspendu';
    default:
      return 'Inactif';
  }
}

function getVenueStatusClasses(status: string) {
  switch (status) {
    case 'active':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:ring-emerald-900/40';
    case 'pending':
      return 'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:ring-blue-900/40';
    case 'suspended':
      return 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:ring-amber-900/40';
    case 'rejected':
      return 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-900/20 dark:text-red-300 dark:ring-red-900/40';
    default:
      return 'bg-gray-100 text-gray-700 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700';
  }
}

function getInvoiceStatusLabel(status: string) {
  switch (status) {
    case 'paid':
      return 'Payée';
    case 'open':
      return 'Ouverte';
    case 'pending':
      return 'En attente';
    case 'draft':
      return 'Brouillon';
    case 'overdue':
      return 'En retard';
    case 'void':
    case 'canceled':
      return 'Annulée';
    default:
      return status;
  }
}

function getInvoiceStatusClasses(status: string) {
  switch (status) {
    case 'paid':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:ring-emerald-900/40';
    case 'open':
    case 'pending':
      return 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:ring-amber-900/40';
    case 'draft':
      return 'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:ring-blue-900/40';
    case 'overdue':
      return 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-900/20 dark:text-red-300 dark:ring-red-900/40';
    case 'void':
    case 'canceled':
      return 'bg-gray-100 text-gray-700 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700';
    default:
      return 'bg-gray-100 text-gray-700 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700';
  }
}

function getPaymentMethodDisplay(paymentMethod?: {
  type?: string;
  brand?: string | null;
  last4?: string | null;
  exp_month?: number | null;
  exp_year?: number | null;
} | null) {
  if (!paymentMethod) {
    return {
      label: 'Stripe',
      title: 'Aucun moyen de paiement configuré',
      number: '•••• •••• •••• ••••',
      subtitle: 'Ajoutez une carte ou un prélèvement pour activer vos lieux.',
    };
  }

  if (paymentMethod.type === 'card') {
    const brand = paymentMethod.brand ? paymentMethod.brand.toUpperCase() : 'Carte';
    const last4 = paymentMethod.last4 ? `•••• •••• •••• ${paymentMethod.last4}` : '•••• •••• •••• ••••';
    const expiration =
      paymentMethod.exp_month && paymentMethod.exp_year
        ? `${String(paymentMethod.exp_month).padStart(2, '0')}/${String(paymentMethod.exp_year).slice(-2)}`
        : 'Expiration non disponible';

    return {
      label: brand,
      title: 'Carte bancaire configurée',
      number: last4,
      subtitle: `Expiration ${expiration}`,
    };
  }

  if (paymentMethod.type === 'sepa_debit') {
    return {
      label: 'SEPA',
      title: 'Prélèvement SEPA configuré',
      number: `•••• ${paymentMethod.last4 || '----'}`,
      subtitle: 'IBAN utilisé pour le prélèvement',
    };
  }

  return {
    label: 'Stripe',
    title: 'Moyen de paiement Stripe',
    number: 'Détails disponibles dans Stripe',
    subtitle: 'Ouvrez le portail pour voir les informations complètes.',
  };
}

export function CompteFacturation({ onNavigate, onBack }: CompteFacturationProps) {
  const initialVenueIdFromUrl = useMemo(() => new URLSearchParams(window.location.search).get('venue') || '', []);
  const [selectedEtablissement, setSelectedEtablissement] = useState<string>('');

  const { data: venues, isLoading: isLoadingVenues } = usePartnerVenues();
  const {
    data: invoices,
    isLoading: isLoadingInvoices,
    isFetching: isFetchingInvoices,
  } = useVenueInvoices(selectedEtablissement || undefined);
  const paymentPortalMutation = useVenuePaymentPortal();

  const { data: billingPricing, isLoading: isLoadingPricing } = useBillingPricing();
  const { data: accruedCommission, isLoading: isLoadingAccruedCommission } = useAccruedCommission();
  const {
    data: paymentMethodStatus,
    isLoading: isLoadingPaymentMethod,
  } = useBillingPaymentMethod();

  const etablissements = useMemo<BillingVenue[]>(() => {
    if (!venues) return [];

    return venues.map((venue) => {
      const statusKey = resolveVenueStatus(venue);

      return {
        id: venue.id,
        nom: venue.name,
        ville: venue.city?.trim() || 'Ville non renseignée',
        statusKey,
        statusLabel: getVenueStatusLabel(statusKey),
      };
    });
  }, [venues]);

  const formattedInvoices = useMemo<BillingInvoice[]>(() => {
    if (!invoices) return [];

    return [...invoices]
      .sort((a, b) => new Date(b.issue_date || b.created_at).getTime() - new Date(a.issue_date || a.created_at).getTime())
      .map((invoice) => ({
        id: invoice.id,
        numero: invoice.invoice_number || invoice.number || invoice.id,
        date: invoice.status === 'paid'
          ? formatDateLabel(invoice.paid_date || invoice.issue_date || invoice.created_at)
          : formatDateLabel(invoice.issue_date || invoice.created_at),
        dateLabel: invoice.status === 'paid' ? 'Réglée le' : 'Émise le',
        dueDate: invoice.status === 'paid' ? undefined : invoice.due_date ? formatDateLabel(invoice.due_date) : undefined,
        montant: formatAmountLabel(invoice.total ?? invoice.amount, invoice.currency || 'EUR'),
        statusKey: invoice.status,
        statusLabel: getInvoiceStatusLabel(invoice.status),
        pdfUrl: invoice.pdf_url,
      }));
  }, [invoices]);

  useEffect(() => {
    if (etablissements.length === 0) {
      setSelectedEtablissement('');
      return;
    }

    setSelectedEtablissement((previous) => {
      if (previous && etablissements.some((item) => item.id === previous)) {
        return previous;
      }
      if (initialVenueIdFromUrl && etablissements.some((item) => item.id === initialVenueIdFromUrl)) {
        return initialVenueIdFromUrl;
      }
      return etablissements[0]?.id || '';
    });
  }, [etablissements, initialVenueIdFromUrl]);

  const currentEtablissement = etablissements.find((item) => item.id === selectedEtablissement) || null;
  const activeVenuesCount = etablissements.filter((item) => item.statusKey === 'active').length;
  const paymentMethodDisplay = getPaymentMethodDisplay(paymentMethodStatus?.payment_method);
  const hasPaymentMethod = paymentMethodStatus?.has_payment_method ?? false;

  const pricingLabel = billingPricing
    ? formatPricingLabel({
      default_rate: billingPricing.default_rate,
      currency: billingPricing.currency,
      unit: billingPricing.unit,
    }, 'fr-FR')
    : 'Tarification indisponible';

  const accruedCommissionLabel = accruedCommission
    ? formatAmountLabel(accruedCommission.amount, accruedCommission.currency || billingPricing?.currency || 'EUR')
    : 'Non disponible';

  const handleManagePayment = async () => {
    if (!selectedEtablissement) {
      toast.error('Sélectionnez un établissement avant d’ouvrir le portail de paiement');
      return;
    }

    const portalWindow = window.open('about:blank', '_blank');

    try {
      const result = await paymentPortalMutation.mutateAsync(selectedEtablissement);
      if (result.portal_url) {
        if (portalWindow) {
          portalWindow.opener = null;
          portalWindow.location.href = result.portal_url;
        } else {
          window.location.href = result.portal_url;
        }
      } else if (portalWindow) {
        portalWindow.close();
      }
    } catch {
      if (portalWindow) {
        portalWindow.close();
      }
      toast.error('Erreur lors de l’accès au portail de paiement');
    }
  };

  const handleAddVenueNavigation = () => {
    if (typeof onNavigate === 'function') {
      onNavigate('ajouter-restaurant' as PageType);
      return;
    }

    window.location.href = '/my-venues/add';
  };

  if (isLoadingVenues) {
    return (
      <div className="min-h-screen bg-[#fafafa] pb-24 dark:bg-gray-950 lg:pb-0">
        <div className="mx-auto flex max-w-[1600px] items-center justify-center p-8 pb-24 lg:pb-8">
          <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 text-sm text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
            <Loader2 className="h-5 w-5 animate-spin text-[#5a03cf]" />
            Chargement de votre facturation...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24 dark:bg-gray-950 lg:pb-0">
      <div className="mx-auto max-w-[1600px] p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="mb-1 text-xl text-gray-900 dark:text-white sm:text-2xl lg:text-3xl">
              Facturation des commissions
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">
              Suivez la tarification, les factures par lieu et vos commissions en cours.
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:justify-end">
            {onBack && (
              <button
                onClick={onBack}
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs leading-none text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 sm:px-4 sm:text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </button>
            )}

            <button
              onClick={handleAddVenueNavigation}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-xs leading-none text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 sm:px-4 sm:text-sm"
            >
              <Plus className="h-4 w-4" />
              Ajouter un lieu
            </button>

            <button
              onClick={handleManagePayment}
              disabled={paymentPortalMutation.isPending || !selectedEtablissement}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] px-3 py-2.5 text-xs leading-none text-white shadow-lg shadow-[#5a03cf]/20 transition-all hover:from-[#6a13df] hover:to-[#8a33ff] disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:text-sm"
            >
              {paymentPortalMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
              Portail de paiement
            </button>
          </div>
        </div>

        {!hasPaymentMethod && !isLoadingPaymentMethod && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300 sm:mb-8">
            <p className="flex items-start gap-3 text-sm sm:text-base">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <span>
                Aucun moyen de paiement configuré. Vos établissements restent inactifs tant que la configuration Stripe n&apos;est pas terminée.
              </span>
            </p>
          </div>
        )}

        <div className="mb-6 grid grid-cols-2 gap-4 sm:mb-8 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 p-4 dark:border-gray-700">
            <div className="mb-2 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#5a03cf]" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Établissements</span>
            </div>
            <div className="text-2xl text-gray-900 dark:text-white">{etablissements.length}</div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Lieux suivis dans votre compte</p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 dark:border-blue-800 dark:from-blue-900/20 dark:to-blue-800/10">
            <div className="mb-2 flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Lieux actifs</span>
            </div>
            <div className="text-2xl text-blue-700 dark:text-blue-300">{activeVenuesCount}</div>
            <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">Selon l’état de facturation remonté</p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 dark:border-emerald-800 dark:from-emerald-900/20 dark:to-emerald-800/10">
            <div className="mb-2 flex items-center gap-2">
              <Receipt className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Tarification</span>
            </div>
            <div className="text-sm text-emerald-700 dark:text-emerald-300">
              {isLoadingPricing ? 'Chargement...' : pricingLabel}
            </div>
            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">Commission par client check-in</p>
          </div>

          <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/50 p-4 dark:border-orange-800 dark:from-orange-900/20 dark:to-orange-800/10">
            <div className="mb-2 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <span className="text-xs font-medium text-orange-600 dark:text-orange-400">Commissions du mois en cours</span>
            </div>
            <div className="text-xl text-orange-700 dark:text-orange-300">
              {isLoadingAccruedCommission ? '...' : accruedCommissionLabel}
            </div>
            <p className="mt-1 text-xs text-orange-600 dark:text-orange-400">Selon l&apos;activité de vos établissements</p>
          </div>
        </div>

        {etablissements.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5a03cf]/10 text-[#5a03cf]">
              <Building2 className="h-7 w-7" />
            </div>
            <h2 className="text-lg text-gray-900 dark:text-white">Aucun établissement rattaché</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-600 dark:text-gray-400">
              Ajoutez un lieu pour commencer à suivre les commissions qui vous sont facturées.
            </p>
            <button
              onClick={handleAddVenueNavigation}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] px-4 py-2.5 text-sm text-white transition-all hover:from-[#6a13df] hover:to-[#8a33ff]"
            >
              <Plus className="h-4 w-4" />
              Ajouter un lieu
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="border-b border-gray-100 p-6 dark:border-gray-800">
                <h2 className="text-lg text-gray-900 dark:text-white">Vos établissements</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Sélectionnez un lieu pour consulter ses factures de commissions dues.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
                {etablissements.map((etablissement) => (
                  <button
                    key={etablissement.id}
                    type="button"
                    onClick={() => setSelectedEtablissement(etablissement.id)}
                    className={`rounded-2xl border p-5 text-left transition-all ${
                      currentEtablissement?.id === etablissement.id
                        ? 'border-[#5a03cf]/30 bg-[#5a03cf]/5 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-base text-gray-900 dark:text-white">{etablissement.nom}</p>
                        <p className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{etablissement.ville}</span>
                        </p>
                      </div>
                      <span className={`inline-flex shrink-0 rounded-full px-3 py-1 text-xs ring-1 ${getVenueStatusClasses(etablissement.statusKey)}`}>
                        {etablissement.statusLabel}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {etablissement.statusKey === 'active'
                        ? 'Lieu actif'
                        : etablissement.statusKey === 'pending'
                        ? 'Activation en attente du setup Stripe'
                        : 'Lieu inactif'}
                    </p>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="border-b border-gray-100 p-6 dark:border-gray-800">
                <h2 className="text-lg text-gray-900 dark:text-white">Moyen de paiement Stripe</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Le moyen de paiement est partagé pour vos établissements et requis pour l’activation.
                </p>
              </div>

              <div className="p-6">
                <div className="mx-auto max-w-[460px] rounded-[32px] bg-gray-200 p-[1px] dark:bg-gray-700">
                  <div className="overflow-hidden rounded-[32px] bg-white dark:bg-gray-900">
                    <div className="bg-[#5a03cf] p-6 text-white">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="inline-flex rounded-full bg-white/12 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/90 ring-1 ring-white/15">
                            {paymentMethodDisplay.label}
                          </p>
                          <p className="mt-8 text-sm text-white/80">{paymentMethodDisplay.title}</p>
                          <p className="mt-3 truncate text-[1.75rem] tracking-[0.16em] text-white">{paymentMethodDisplay.number}</p>
                          <p className="mt-3 text-sm text-white/80">{paymentMethodDisplay.subtitle}</p>
                        </div>
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] bg-white/12 text-white ring-1 ring-white/15">
                          <CreditCard className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="mt-10 flex items-center justify-between gap-4 text-xs text-white/80">
                        <span>Match Billing</span>
                        <span>{hasPaymentMethod ? 'Méthode active' : 'Activation requise'}</span>
                      </div>
                    </div>

                    <button
                      onClick={handleManagePayment}
                      disabled={paymentPortalMutation.isPending || !selectedEtablissement}
                      className="flex w-full items-center justify-center gap-2 border-t border-gray-200 bg-[#f7f4ff] px-4 py-4 text-sm text-gray-900 transition-colors hover:bg-[#f1ebff] disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
                    >
                      {paymentPortalMutation.isPending ? <Loader2 className="h-4 w-4 shrink-0 animate-spin" /> : <Wallet className="h-4 w-4 shrink-0" />}
                      <span className="text-center">Gérer les informations de paiement</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="border-b border-gray-100 p-6 dark:border-gray-800">
                <h2 className="text-lg text-gray-900 dark:text-white">Factures de commission</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {currentEtablissement
                    ? `Factures Stripe de commission pour ${currentEtablissement.nom}.`
                    : 'Sélectionnez un lieu pour consulter ses factures.'}
                </p>
              </div>

              <div className="space-y-3 p-6">
                {(isLoadingInvoices || isFetchingInvoices) ? (
                  <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Chargement des factures...
                  </div>
                ) : formattedInvoices.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-400">
                    Aucune facture disponible pour le moment.
                  </div>
                ) : (
                  formattedInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/70 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center md:gap-8">
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">{invoice.numero}</p>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {invoice.dateLabel} {invoice.date}{invoice.dueDate ? ` • Échéance ${invoice.dueDate}` : ''}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Montant</p>
                          <p className="mt-1 text-sm text-gray-900 dark:text-white">{invoice.montant}</p>
                        </div>
                        <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs ring-1 ${getInvoiceStatusClasses(invoice.statusKey)}`}>
                          {invoice.statusLabel}
                        </span>
                      </div>

                      {invoice.pdfUrl ? (
                        <a
                          href={invoice.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          Télécharger le PDF
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400 dark:text-gray-500">PDF indisponible</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
