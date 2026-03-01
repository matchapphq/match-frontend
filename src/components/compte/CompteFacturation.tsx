import { useEffect, useMemo, useState } from 'react';
import { PageType } from '../../src/types';
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  CreditCard,
  FileText,
  Loader2,
  MapPin,
  Plus,
  Receipt,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { usePartnerVenues } from '../../src/hooks/api/useVenues';
import { useInvoices, usePaymentPortal } from '../../src/hooks/api/useAccount';
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
  subscriptionLabel: string;
  priceLabel: string;
  renewalLabel: string;
  paymentMethod: {
    type: string;
    number: string;
    expiration: string;
  };
};

type BillingInvoice = {
  id: string;
  numero: string;
  date: string;
  montant: string;
  statusKey: string;
  statusLabel: string;
  pdfUrl?: string;
};

function getVenueStatusLabel(status?: string) {
  switch (status) {
    case 'active':
      return 'Actif';
    case 'trialing':
      return 'Essai';
    case 'past_due':
      return 'Paiement en retard';
    case 'canceled':
      return 'Résilié';
    default:
      return 'Inactif';
  }
}

function getVenueStatusClasses(status?: string) {
  switch (status) {
    case 'active':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:ring-emerald-900/40';
    case 'trialing':
      return 'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:ring-blue-900/40';
    case 'past_due':
      return 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:ring-amber-900/40';
    case 'canceled':
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
    case 'draft':
      return 'Brouillon';
    case 'void':
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
      return 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:ring-amber-900/40';
    case 'draft':
      return 'bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:ring-blue-900/40';
    case 'void':
      return 'bg-gray-100 text-gray-700 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700';
    default:
      return 'bg-gray-100 text-gray-700 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700';
  }
}

export function CompteFacturation({ onNavigate, onBack }: CompteFacturationProps) {
  const [selectedEtablissement, setSelectedEtablissement] = useState<string>('');

  const { data: venues, isLoading: isLoadingVenues } = usePartnerVenues();
  const { data: invoices, isLoading: isLoadingInvoices } = useInvoices();
  const paymentPortalMutation = usePaymentPortal();

  const etablissements = useMemo<BillingVenue[]>(() => {
    if (!venues) return [];

    return venues.map((venue) => {
      const isActive = venue.subscription_status === 'active';
      return {
        id: venue.id,
        nom: venue.name,
        ville: venue.city?.trim() || 'Ville non renseignée',
        statusKey: venue.subscription_status || 'inactive',
        statusLabel: getVenueStatusLabel(venue.subscription_status),
        subscriptionLabel: isActive ? 'Abonnement actif' : 'Abonnement à activer',
        priceLabel: isActive ? '30€/mois' : 'À configurer',
        renewalLabel: isActive ? 'Géré depuis le portail de paiement' : 'Aucun renouvellement planifié',
        paymentMethod: {
          type: 'CB',
          number: '•••• ••••',
          expiration: '-',
        },
      };
    });
  }, [venues]);

  const formattedInvoices = useMemo<BillingInvoice[]>(() => {
    if (!invoices) return [];

    return [...invoices]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map((invoice) => ({
        id: invoice.id,
        numero: invoice.number || invoice.id,
        date: new Date(invoice.created_at).toLocaleDateString('fr-FR'),
        montant: `${(invoice.amount / 100).toFixed(0)}€`,
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
      return etablissements[0].id;
    });
  }, [etablissements]);

  const currentEtablissement = etablissements.find((item) => item.id === selectedEtablissement) || null;
  const activeSubscriptionsCount = etablissements.filter((item) => item.statusKey === 'active').length;
  const paidInvoicesCount = formattedInvoices.filter((invoice) => invoice.statusKey === 'paid').length;
  const latestInvoice = formattedInvoices[0] || null;
  const isLoading = isLoadingVenues || isLoadingInvoices;

  const features = [
    'Diffusion illimitée de matchs',
    'Visibilité sur la plateforme Match',
    'Gestion des réservations en temps réel',
    'Statistiques détaillées',
    'Support prioritaire',
  ];

  const handleManagePayment = async () => {
    try {
      const result = await paymentPortalMutation.mutateAsync();
      if (result.url) {
        window.location.href = result.url;
      }
    } catch {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950 pb-24 lg:pb-0">
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
    <>
      <div className="min-h-screen bg-[#fafafa] pb-24 dark:bg-gray-950 lg:pb-0">
        <div className="mx-auto max-w-[1600px] p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
          <div className="mb-6 flex flex-col gap-4 sm:mb-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="mb-1 text-xl text-gray-900 dark:text-white sm:text-2xl lg:text-3xl">
                Facturation & abonnement
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 sm:text-base">
                Suivez vos abonnements, vos factures et l’accès au portail de paiement.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Retour
                </button>
              )}

              <button
                onClick={handleAddVenueNavigation}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <Plus className="h-4 w-4" />
                Ajouter un lieu
              </button>

              <button
                onClick={handleManagePayment}
                disabled={paymentPortalMutation.isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] px-4 py-2.5 text-sm text-white shadow-lg shadow-[#5a03cf]/20 transition-all hover:from-[#6a13df] hover:to-[#8a33ff] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {paymentPortalMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
                Ouvrir le portail de paiement
              </button>
            </div>
          </div>

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
                <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Actifs</span>
              </div>
              <div className="text-2xl text-blue-700 dark:text-blue-300">{activeSubscriptionsCount}</div>
              <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">Abonnements remontés comme actifs</p>
            </div>

            <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100/50 p-4 dark:border-green-800 dark:from-green-900/20 dark:to-green-800/10">
              <div className="mb-2 flex items-center gap-2">
                <Receipt className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-xs font-medium text-green-600 dark:text-green-400">Factures</span>
              </div>
              <div className="text-2xl text-green-700 dark:text-green-300">{formattedInvoices.length}</div>
              <p className="mt-1 text-xs text-green-600 dark:text-green-400">Historique de facturation disponible</p>
            </div>

            <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/50 p-4 dark:border-orange-800 dark:from-orange-900/20 dark:to-orange-800/10">
              <div className="mb-2 flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <span className="text-xs font-medium text-orange-600 dark:text-orange-400">Payées</span>
              </div>
              <div className="text-2xl text-orange-700 dark:text-orange-300">{paidInvoicesCount}</div>
              <p className="mt-1 text-xs text-orange-600 dark:text-orange-400">
                {latestInvoice ? `Dernière émise le ${latestInvoice.date}` : 'Aucune facture encore émise'}
              </p>
            </div>
          </div>

          {etablissements.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5a03cf]/10 text-[#5a03cf]">
                <Building2 className="h-7 w-7" />
              </div>
              <h2 className="text-lg text-gray-900 dark:text-white">Aucun établissement rattaché</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-600 dark:text-gray-400">
                Ajoutez un lieu pour commencer à gérer votre abonnement et centraliser votre facturation depuis cet espace.
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
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <div className="space-y-6 xl:col-span-2">
                <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                  <div className="border-b border-gray-100 p-6 dark:border-gray-800">
                    <h2 className="text-lg text-gray-900 dark:text-white">Vos établissements</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Sélectionnez un lieu pour consulter son statut d’abonnement et ses informations associées.
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
                        <p className="text-sm text-gray-700 dark:text-gray-300">{etablissement.subscriptionLabel}</p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{etablissement.priceLabel}</p>
                      </button>
                    ))}
                  </div>
                </section>

                {currentEtablissement && (
                  <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                    <div className="border-b border-gray-100 p-6 dark:border-gray-800">
                      <h2 className="text-lg text-gray-900 dark:text-white">Formules disponibles</h2>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Options tarifaires présentées pour {currentEtablissement.nom}.
                      </p>
                    </div>
                    <div className="space-y-6 p-6">
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/70">
                          <div className="mb-4">
                            <p className="text-base text-gray-900 dark:text-white">Mensuel</p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Facturation mensuelle standard</p>
                          </div>
                          <div>
                            <span className="text-4xl text-gray-900 dark:text-white">30€</span>
                            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">/mois</span>
                          </div>
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Soit 360€ / an</p>
                        </div>

                        <div className="relative overflow-hidden rounded-2xl border border-[#5a03cf]/20 bg-[#5a03cf]/5 p-6 dark:border-[#7a23ef]/30 dark:bg-[#5a03cf]/10">
                          <span className="absolute right-4 top-4 rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                            Économisez 60€
                          </span>
                          <div className="mb-4">
                            <p className="text-base text-gray-900 dark:text-white">Annuel</p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Engagement annuel recommandé</p>
                          </div>
                          <div>
                            <span className="text-4xl text-gray-900 dark:text-white">25€</span>
                            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">/mois</span>
                          </div>
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Soit 300€ / an</p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/70">
                        <p className="mb-3 text-sm text-gray-900 dark:text-white">Inclus dans votre abonnement</p>
                        <ul className="space-y-2">
                          {features.map((feature) => (
                            <li key={feature} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#5a03cf]" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] px-5 py-3 text-sm text-white transition-all hover:from-[#6a13df] hover:to-[#8a33ff]"
                        >
                          Modifier l’abonnement
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700 transition-colors hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-950/50"
                        >
                          Résilier cet abonnement
                        </button>
                      </div>
                    </div>
                  </section>
                )}

                <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                  <div className="border-b border-gray-100 p-6 dark:border-gray-800">
                    <h2 className="text-lg text-gray-900 dark:text-white">Historique des factures</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Toutes les factures disponibles sur le compte.
                    </p>
                  </div>
                  <div className="space-y-3 p-6">
                    {formattedInvoices.length === 0 ? (
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
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Émise le {invoice.date}</p>
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
                              Télécharger
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

              <div className="space-y-6 xl:col-span-1">
                {currentEtablissement && (
                  <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                    <div className="border-b border-gray-100 p-6 dark:border-gray-800">
                      <h2 className="text-lg text-gray-900 dark:text-white">Abonnement actuel</h2>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Vue synthétique pour {currentEtablissement.nom}.
                      </p>
                    </div>
                    <div className="space-y-4 p-6">
                      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/70">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Statut</p>
                        <div className="mt-3 flex items-center justify-between gap-3">
                          <p className="text-sm text-gray-900 dark:text-white">{currentEtablissement.subscriptionLabel}</p>
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs ring-1 ${getVenueStatusClasses(currentEtablissement.statusKey)}`}>
                            {currentEtablissement.statusLabel}
                          </span>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/70">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Tarif affiché</p>
                        <p className="mt-3 text-xl text-gray-900 dark:text-white">{currentEtablissement.priceLabel}</p>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/70">
                        <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <CalendarDays className="h-4 w-4" />
                          Renouvellement
                        </p>
                        <p className="mt-3 text-sm leading-6 text-gray-900 dark:text-white">
                          {currentEtablissement.renewalLabel}
                        </p>
                      </div>
                    </div>
                  </section>
                )}

                {currentEtablissement && (
                  <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                    <div className="border-b border-gray-100 p-6 dark:border-gray-800">
                      <h2 className="text-lg text-gray-900 dark:text-white">Moyen de paiement</h2>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Gestion centralisée via le portail de paiement.
                      </p>
                    </div>
                    <div className="space-y-4 p-6">
                      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-800/70">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5a03cf]/10 text-[#5a03cf]">
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-900 dark:text-white">
                              {currentEtablissement.paymentMethod.type} {currentEtablissement.paymentMethod.number}
                            </p>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                              Expiration : {currentEtablissement.paymentMethod.expiration}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleManagePayment}
                        disabled={paymentPortalMutation.isPending}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        {paymentPortalMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
                        Gérer le moyen de paiement
                      </button>
                    </div>
                  </section>
                )}

                <section className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
                  <div className="border-b border-gray-100 p-6 dark:border-gray-800">
                    <h2 className="text-lg text-gray-900 dark:text-white">Repères facturation</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      Informations utiles sur la gestion de votre compte.
                    </p>
                  </div>
                  <div className="space-y-4 p-6">
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/70">
                      <p className="text-sm text-gray-900 dark:text-white">Paiement sécurisé</p>
                      <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                        Les mises à jour de carte et les opérations de paiement sont gérées via le portail sécurisé.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/70">
                      <p className="text-sm text-gray-900 dark:text-white">Factures téléchargeables</p>
                      <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                        Les factures disponibles peuvent être ouvertes ou téléchargées au format PDF depuis cette page.
                      </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/70">
                      <p className="text-sm text-gray-900 dark:text-white">Résiliation</p>
                      <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
                        La résiliation n’est pas encore activée ici et reste à finaliser côté produit / paiement.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
      </div>

    </>
  );
}
