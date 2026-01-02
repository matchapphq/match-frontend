import { useState, useEffect } from 'react';
import { PageType } from '../../App';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Loader2, ExternalLink, Download, CreditCard } from 'lucide-react';
import api, { Subscription, Invoice } from '../../services/api';
import { useAppContext } from '../../context/AppContext';

interface CompteFacturationProps {
  onNavigate?: (page: PageType) => void;
  onBack?: () => void;
}

export function CompteFacturation({ onNavigate, onBack }: CompteFacturationProps) {
  const { currentUser } = useAuth();
  const { restaurants } = useAppContext();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [venueSubscriptions, setVenueSubscriptions] = useState<Record<string, Subscription>>({});
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [selectedVenueId, setSelectedVenueId] = useState<string>('');

  // Fetch invoices on mount
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const invoicesResponse = await api.getMyInvoices().catch(() => ({ invoices: [] }));
        setInvoices(invoicesResponse.invoices || []);
      } catch (err: any) {
        console.error('Failed to fetch invoices:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // Set default selected venue
  useEffect(() => {
    if (restaurants.length > 0 && !selectedVenueId) {
      setSelectedVenueId(restaurants[0].venueId);
    }
  }, [restaurants, selectedVenueId]);

  // Fetch subscriptions for all venues
  useEffect(() => {
    const fetchAllVenueSubscriptions = async () => {
      if (restaurants.length === 0) return;
      
      const subscriptionMap: Record<string, Subscription> = {};
      
      await Promise.all(
        restaurants.map(async (restaurant) => {
          try {
            const response = await api.getVenueSubscription(restaurant.venueId);
            if (response.subscription) {
              subscriptionMap[restaurant.venueId] = response.subscription;
            }
          } catch (err) {
            console.error(`Failed to fetch subscription for venue ${restaurant.venueId}:`, err);
          }
        })
      );
      
      setVenueSubscriptions(subscriptionMap);
    };

    fetchAllVenueSubscriptions();
  }, [restaurants]);

  // Update selected subscription when venue changes
  useEffect(() => {
    if (selectedVenueId && venueSubscriptions[selectedVenueId]) {
      setSubscription(venueSubscriptions[selectedVenueId]);
    } else if (selectedVenueId) {
      // Fetch if not in cache yet
      const fetchVenueSubscription = async () => {
        setIsLoading(true);
        try {
          const response = await api.getVenueSubscription(selectedVenueId);
          setSubscription(response.subscription);
          if (response.subscription) {
            setVenueSubscriptions(prev => ({ ...prev, [selectedVenueId]: response.subscription! }));
          }
        } catch (err: any) {
          console.error('Failed to fetch venue subscription:', err);
          setSubscription(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchVenueSubscription();
    }
  }, [selectedVenueId, venueSubscriptions]);

  // Handle payment method update for a specific venue (redirect to Stripe portal)
  const handleUpdatePayment = async (venueId?: string) => {
    setIsUpdatingPayment(true);
    try {
      const response = venueId 
        ? await api.getVenuePaymentPortal(venueId)
        : await api.getPaymentPortal();
      if (response.portal_url) {
        window.location.href = response.portal_url;
      }
    } catch (err: any) {
      console.error('Failed to open payment portal:', err);
      setError('Impossible d\'ouvrir le portail de paiement');
      setIsUpdatingPayment(false);
    }
  };

  // Handle invoice download
  const handleDownloadInvoice = (invoice: Invoice) => {
    if (invoice.pdf_url) {
      window.open(invoice.pdf_url, '_blank');
    } else {
      setError('Le PDF de cette facture n\'est pas disponible');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    if (!confirm('Êtes-vous sûr de vouloir résilier votre abonnement ? Vous conserverez l\'accès jusqu\'à la fin de la période en cours.')) {
      return;
    }

    setIsCanceling(true);
    try {
      await api.cancelSubscription();
      // Refresh subscription data
      const response = await api.getMySubscription();
      setSubscription(response.subscription);
    } catch (err: any) {
      console.error('Failed to cancel subscription:', err);
      setError('Impossible de résilier l\'abonnement');
    } finally {
      setIsCanceling(false);
    }
  };

  const features = [
    'Diffusion illimitée de matchs',
    'Visibilité sur la plateforme Match',
    'Gestion des réservations en temps réel',
    'Statistiques détaillées',
    'Support prioritaire',
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Bouton retour aux paramètres */}
      {onBack && (
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm border border-gray-200/50 text-gray-700 rounded-xl hover:bg-white/90 transition-all"
          style={{ fontWeight: '600' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Retourner aux paramètres du compte
        </button>
      )}

      {/* Header de la page */}
      <div className="mb-12">
        <h1 className="text-5xl italic mb-2" style={{ fontWeight: '700', color: '#5a03cf' }}>
          Facturation & abonnement
        </h1>
        <p className="text-lg text-gray-700">Gérez les abonnements de vos établissements</p>
      </div>

      {/* Sélecteur d'établissement */}
      {restaurants.length > 0 && (
        <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 p-6 mb-6">
          <h2 className="text-xl mb-4" style={{ fontWeight: '600', color: '#5a03cf' }}>
            Sélectionnez un établissement
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {restaurants.map((restaurant) => (
              <button
                key={restaurant.venueId}
                onClick={() => setSelectedVenueId(restaurant.venueId)}
                className={`text-left bg-white/70 backdrop-blur-xl rounded-xl p-5 transition-all ${
                  selectedVenueId === restaurant.venueId
                    ? 'border-2 border-[#5a03cf]/40 shadow-md'
                    : 'border border-gray-200/50 hover:border-gray-300/60'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-lg mb-1" style={{ fontWeight: '700', color: '#5a03cf' }}>
                      {restaurant.nom}
                    </p>
                    <p className="text-gray-600 text-sm">{restaurant.adresse}</p>
                  </div>
                  <span
                    className="inline-block px-3 py-1 bg-[#9cff02]/20 backdrop-blur-sm text-[#5a03cf] rounded-lg border border-[#9cff02]/30 text-sm"
                    style={{ fontWeight: '600' }}
                  >
                    Actif
                  </span>
                </div>
                <p className="text-gray-700" style={{ fontWeight: '600' }}>
                  {venueSubscriptions[restaurant.venueId]?.plan_name || 'Chargement...'} - {venueSubscriptions[restaurant.venueId]?.display_price || '...'}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedVenueId && subscription && (
        <>
          {/* Abonnement actuel de l'établissement */}
          <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 p-6 mb-6">
            <h2 className="text-2xl mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
              Abonnement actif
            </h2>
            <p className="text-gray-600 mb-6">
              Formule pour {restaurants.find(r => r.venueId === selectedVenueId)?.nom || 'votre établissement'}
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200/30">
                <p className="text-gray-700 mb-1">Formule</p>
                <p className="text-xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
                  {subscription.plan_name || (subscription.plan === 'pro' ? 'Annuel' : 'Mensuel')}
                </p>
                <p className="text-gray-600 text-sm mt-1">{subscription.display_price || (subscription.plan === 'pro' ? '300€/an' : '30€/mois')}</p>
              </div>
              <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200/30">
                <p className="text-gray-700 mb-1">Prochain renouvellement</p>
                <p className="text-lg" style={{ fontWeight: '600' }}>
                  {new Date(subscription.current_period_end).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200/30">
                <p className="text-gray-700 mb-1">Statut</p>
                <span
                  className="inline-block px-3 py-1 bg-[#9cff02]/20 backdrop-blur-sm text-[#5a03cf] rounded-lg border border-[#9cff02]/30"
                  style={{ fontWeight: '600' }}
                >
                  Actif
                </span>
              </div>
            </div>
          </div>

          {/* Formules disponibles */}
          <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 p-6 mb-6">
            <h2 className="text-2xl mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
              Changer de formule
            </h2>
            <p className="text-gray-600 mb-6">Modifiez l'abonnement de cet établissement</p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div
                className={`bg-white/70 backdrop-blur-xl rounded-xl p-6 border ${
                  subscription.plan === 'basic'
                    ? 'border-2 border-[#5a03cf]/40 shadow-md'
                    : 'border-gray-200/50'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xl mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
                      Mensuel
                    </p>
                    <p className="text-gray-600 text-sm">360€/an</p>
                  </div>
                </div>
                <div className="mb-4">
                  <span
                    className="text-4xl bg-gradient-to-r from-[#5a03cf] to-[#9cff02] bg-clip-text text-transparent"
                    style={{ fontWeight: '700' }}
                  >
                    30€
                  </span>
                  <span className="text-gray-600 ml-1">/mois</span>
                </div>
              </div>

              <div
                className={`bg-white/70 backdrop-blur-xl rounded-xl p-6 border ${
                  subscription.plan === 'pro'
                    ? 'border-2 border-[#5a03cf]/40 shadow-md'
                    : 'border-gray-200/50'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xl mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
                      Annuel
                    </p>
                    <p className="text-gray-600 text-sm">300€/an</p>
                  </div>
                  <span
                    className="inline-block px-3 py-1 bg-[#9cff02]/20 backdrop-blur-sm text-[#5a03cf] rounded-lg border border-[#9cff02]/30 text-sm"
                    style={{ fontWeight: '600' }}
                  >
                    Économisez 60€
                  </span>
                </div>
                <div className="mb-4">
                  <span
                    className="text-4xl bg-gradient-to-r from-[#5a03cf] to-[#9cff02] bg-clip-text text-transparent"
                    style={{ fontWeight: '700' }}
                  >
                    25€
                  </span>
                  <span className="text-gray-600 ml-1">/mois</span>
                </div>
              </div>
            </div>

            {/* Avantages sans icônes */}
            <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200/30">
              <p className="text-gray-700 mb-3" style={{ fontWeight: '600' }}>
                Inclus dans votre abonnement
              </p>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-700">
                    <span className="text-[#5a03cf] mt-1">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Moyen de paiement */}
          <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 p-6 mb-6">
            <h2 className="text-2xl mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
              Moyen de paiement
            </h2>
            <p className="text-gray-600 mb-6">Carte bancaire pour {restaurants.find(r => r.venueId === selectedVenueId)?.nom || 'votre établissement'}</p>

            <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-5 border border-gray-200/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-gradient-to-br from-[#5a03cf] to-[#9cff02] rounded flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-900" style={{ fontWeight: '600' }}>
                      Carte enregistrée via Stripe
                    </p>
                    <p className="text-gray-600 text-sm">
                      Gérez votre moyen de paiement via le portail sécurisé
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleUpdatePayment(selectedVenueId)}
                  disabled={isUpdatingPayment}
                  className="flex items-center gap-2 px-4 py-2 text-[#5a03cf] hover:bg-[#5a03cf]/5 rounded-lg transition-colors disabled:opacity-50"
                  style={{ fontWeight: '600' }}
                >
                  {isUpdatingPayment ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ExternalLink className="w-4 h-4" />
                  )}
                  Modifier
                </button>
              </div>
            </div>
          </div>

          {/* Historique des factures */}
          <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 p-6 mb-6">
            <h2 className="text-2xl mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
              Historique des factures
            </h2>
            <p className="text-gray-600 mb-6">
              Vos factures
            </p>

            <div className="space-y-3">
              {invoices.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Aucune facture disponible</p>
              ) : (
                invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-gray-900" style={{ fontWeight: '600' }}>
                          {invoice.invoice_number}
                        </p>
                        <p className="text-gray-600 text-sm">{new Date(invoice.issue_date).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div>
                        <p className="text-gray-900" style={{ fontWeight: '600' }}>
                          {invoice.total}€
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-lg text-sm border ${
                          invoice.status === 'paid'
                            ? 'bg-[#9cff02]/20 text-[#5a03cf] border-[#9cff02]/30'
                            : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                        }`}
                        style={{ fontWeight: '600' }}
                      >
                        {invoice.status === 'paid' ? 'Payée' : invoice.status === 'pending' ? 'En attente' : invoice.status}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDownloadInvoice(invoice)}
                      className="flex items-center gap-2 px-4 py-2 text-[#5a03cf] hover:bg-[#5a03cf]/5 rounded-lg transition-colors"
                      style={{ fontWeight: '600' }}
                    >
                      <Download className="w-4 h-4" />
                      Télécharger
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bloc rassurance */}
          <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 p-6 mb-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-lg mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
                  Paiement sécurisé
                </p>
                <p className="text-gray-600 text-sm">
                  Vos données sont cryptées et protégées
                </p>
              </div>
              <div>
                <p className="text-lg mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
                  Résiliation simple
                </p>
                <p className="text-gray-600 text-sm">
                  Annulez l'abonnement à tout moment
                </p>
              </div>
              <div>
                <p className="text-lg mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
                  Support disponible
                </p>
                <p className="text-gray-600 text-sm">
                  Notre équipe vous accompagne 7j/7
                </p>
              </div>
            </div>
          </div>

          {/* Boutons CTA */}
          <div className="flex gap-4">
            <button
              className="flex-1 bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white py-4 rounded-xl hover:brightness-105 hover:scale-[1.01] transition-all shadow-sm"
              style={{ fontWeight: '600' }}
            >
              Modifier l'abonnement
            </button>
            <button
              className="px-8 py-4 bg-white/50 backdrop-blur-sm border border-red-200/50 text-red-500 rounded-xl hover:bg-red-50/70 transition-all"
              style={{ fontWeight: '600' }}
            >
              Résilier cet abonnement
            </button>
          </div>
        </>
      )}
    </div>
  );
}