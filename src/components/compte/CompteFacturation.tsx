import { useState } from 'react';
import { PageType } from '../../src/types';
import { useAuth } from '../../src/features/authentication/context/AuthContext';
import { ArrowLeft, Plus, X, Building, MapPin, Mail, Phone, CreditCard } from 'lucide-react';

interface CompteFacturationProps {
  onNavigate?: (page: PageType) => void;
  onBack?: () => void;
}

export function CompteFacturation({ onNavigate, onBack }: CompteFacturationProps) {
  const { currentUser } = useAuth();
  const [showAddVenueModal, setShowAddVenueModal] = useState(false);

  // 4️⃣ Logique : 1 établissement = 1 abonnement
  const [etablissements] = useState([
    {
      id: '1',
      nom: 'Le Sport Bar Paris',
      ville: 'Paris 11ème',
      formule: 'Annuel',
      prix: '300€/an',
      prixMensuel: '25€/mois',
      statut: 'actif',
      prochainRenouvellement: '01/12/2025',
      moyenPaiement: {
        type: 'VISA',
        numero: '•••• 4242',
        expiration: '12/2026',
      },
      factures: [
        { id: 1, date: '01/12/2024', montant: '300€', statut: 'Payée', numero: 'INV-2024-001' },
        { id: 2, date: '01/12/2023', montant: '300€', statut: 'Payée', numero: 'INV-2023-001' },
      ],
    },
    {
      id: '2',
      nom: 'Stadium Café Lyon',
      ville: 'Lyon 2ème',
      formule: 'Mensuel',
      prix: '30€/mois',
      prixMensuel: '30€/mois',
      statut: 'actif',
      prochainRenouvellement: '15/01/2025',
      moyenPaiement: {
        type: 'MASTERCARD',
        numero: '•••• 8888',
        expiration: '08/2027',
      },
      factures: [
        { id: 1, date: '15/12/2024', montant: '30€', statut: 'Payée', numero: 'INV-2024-002' },
        { id: 2, date: '15/11/2024', montant: '30€', statut: 'Payée', numero: 'INV-2024-003' },
      ],
    },
  ]);

  const [selectedEtablissement, setSelectedEtablissement] = useState(etablissements[0].id);

  const currentEtablissement = etablissements.find(e => e.id === selectedEtablissement);

  const features = [
    'Diffusion illimitée de matchs',
    'Visibilité sur la plateforme Match',
    'Gestion des réservations en temps réel',
    'Statistiques détaillées',
    'Support prioritaire',
  ];

  const handleAddVenue = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique d'ajout de lieu
    alert('Nouvel établissement ajouté !');
    setShowAddVenueModal(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Bouton retour aux paramètres */}
      {onBack && (
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all"
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
        <p className="text-lg text-gray-700 dark:text-gray-300">Gérez les abonnements de vos établissements</p>
      </div>

      {/* Sélecteur d'établissement */}
      <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl" style={{ fontWeight: '600', color: '#5a03cf' }}>
            Vos établissements
          </h2>
          <button
            onClick={() => setShowAddVenueModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white rounded-xl hover:brightness-105 transition-all text-sm"
            style={{ fontWeight: '600' }}
          >
            <Plus className="w-4 h-4" />
            Ajouter un lieu
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {etablissements.map((etablissement) => (
            <button
              key={etablissement.id}
              onClick={() => setSelectedEtablissement(etablissement.id)}
              className={`text-left bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-xl p-5 transition-all ${
                selectedEtablissement === etablissement.id
                  ? 'border-2 border-[#5a03cf]/40 shadow-md'
                  : 'border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/60 dark:hover:border-gray-600/60'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-lg mb-1" style={{ fontWeight: '700', color: '#5a03cf' }}>
                    {etablissement.nom}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{etablissement.ville}</p>
                </div>
                <span
                  className="inline-block px-3 py-1 bg-[#9cff02]/20 backdrop-blur-sm text-[#5a03cf] rounded-lg border border-[#9cff02]/30 text-sm"
                  style={{ fontWeight: '600' }}
                >
                  {etablissement.statut === 'actif' ? 'Actif' : 'Inactif'}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300" style={{ fontWeight: '600' }}>
                {etablissement.formule} - {etablissement.prix}
              </p>
            </button>
          ))}
        </div>
      </div>

      {currentEtablissement && (
        <>
          {/* Abonnement actuel de l'établissement */}
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6">
            <h2 className="text-2xl mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
              Abonnement actif
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Formule pour {currentEtablissement.nom}
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-200/30 dark:border-gray-700/30">
                <p className="text-gray-700 dark:text-gray-300 mb-1">Formule</p>
                <p className="text-xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
                  {currentEtablissement.formule}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{currentEtablissement.prix}</p>
              </div>
              <div className="bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-200/30 dark:border-gray-700/30">
                <p className="text-gray-700 dark:text-gray-300 mb-1">Prochain renouvellement</p>
                <p className="text-lg text-gray-900 dark:text-white" style={{ fontWeight: '600' }}>
                  {currentEtablissement.prochainRenouvellement}
                </p>
              </div>
              <div className="bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-200/30 dark:border-gray-700/30">
                <p className="text-gray-700 dark:text-gray-300 mb-1">Statut</p>
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
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6">
            <h2 className="text-2xl mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
              Changer de formule
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Modifiez l'abonnement de cet établissement</p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div
                className={`bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border ${
                  currentEtablissement.formule === 'Mensuel'
                    ? 'border-2 border-[#5a03cf]/40 shadow-md'
                    : 'border-gray-200/50 dark:border-gray-700/50'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xl mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
                      Mensuel
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">360€/an</p>
                  </div>
                </div>
                <div className="mb-4">
                  <span
                    className="text-4xl bg-gradient-to-r from-[#5a03cf] to-[#9cff02] bg-clip-text text-transparent"
                    style={{ fontWeight: '700' }}
                  >
                    30€
                  </span>
                  <span className="text-gray-600 dark:text-gray-400 ml-1">/mois</span>
                </div>
              </div>

              <div
                className={`bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border ${
                  currentEtablissement.formule === 'Annuel'
                    ? 'border-2 border-[#5a03cf]/40 shadow-md'
                    : 'border-gray-200/50 dark:border-gray-700/50'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xl mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
                      Annuel
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">300€/an</p>
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
                  <span className="text-gray-600 dark:text-gray-400 ml-1">/mois</span>
                </div>
              </div>
            </div>

            {/* Avantages sans icônes */}
            <div className="bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-200/30 dark:border-gray-700/30">
              <p className="text-gray-700 dark:text-gray-300 mb-3" style={{ fontWeight: '600' }}>
                Inclus dans votre abonnement
              </p>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                    <span className="text-[#5a03cf] mt-1">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Moyen de paiement */}
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6">
            <h2 className="text-2xl mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
              Moyen de paiement
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Carte bancaire pour {currentEtablissement.nom}</p>

            <div className="bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-5 border border-gray-200/30 dark:border-gray-700/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-gradient-to-br from-[#5a03cf] to-[#9cff02] rounded flex items-center justify-center">
                    <span className="text-white text-xs" style={{ fontWeight: '700' }}>
                      {currentEtablissement.moyenPaiement.type}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white" style={{ fontWeight: '600' }}>
                      {currentEtablissement.moyenPaiement.numero}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Expire le {currentEtablissement.moyenPaiement.expiration}
                    </p>
                  </div>
                </div>
                <button
                  className="px-4 py-2 text-[#5a03cf] hover:bg-[#5a03cf]/5 dark:hover:bg-[#5a03cf]/10 rounded-lg transition-colors"
                  style={{ fontWeight: '600' }}
                >
                  Modifier
                </button>
              </div>
            </div>
          </div>

          {/* Historique des factures */}
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6">
            <h2 className="text-2xl mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
              Historique des factures
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Factures pour {currentEtablissement.nom}
            </p>

            <div className="space-y-3">
              {currentEtablissement.factures.map((invoice) => (
                <div
                  key={invoice.id}
                  className="bg-gray-50/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30 dark:border-gray-700/30 flex items-center justify-between"
                >
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-gray-900 dark:text-white" style={{ fontWeight: '600' }}>
                        {invoice.numero}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{invoice.date}</p>
                    </div>
                    <div>
                      <p className="text-gray-900 dark:text-white" style={{ fontWeight: '600' }}>
                        {invoice.montant}
                      </p>
                    </div>
                    <span
                      className="px-3 py-1 bg-[#9cff02]/20 backdrop-blur-sm text-[#5a03cf] rounded-lg text-sm border border-[#9cff02]/30"
                      style={{ fontWeight: '600' }}
                    >
                      {invoice.statut}
                    </span>
                  </div>
                  <button
                    className="px-4 py-2 text-[#5a03cf] hover:bg-[#5a03cf]/5 dark:hover:bg-[#5a03cf]/10 rounded-lg transition-colors"
                    style={{ fontWeight: '600' }}
                  >
                    Télécharger
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Bloc rassurance */}
          <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-lg mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
                  Paiement sécurisé
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Vos données sont cryptées et protégées
                </p>
              </div>
              <div>
                <p className="text-lg mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
                  Résiliation simple
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Annulez l'abonnement à tout moment
                </p>
              </div>
              <div>
                <p className="text-lg mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
                  Support disponible
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
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
              className="px-8 py-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-red-200/50 dark:border-red-900/50 text-red-500 dark:text-red-400 rounded-xl hover:bg-red-50/70 dark:hover:bg-red-900/20 transition-all"
              style={{ fontWeight: '600' }}
            >
              Résilier cet abonnement
            </button>
          </div>
        </>
      )}

      {/* Modal d'ajout de nouveau lieu */}
      {showAddVenueModal && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl mb-1" style={{ fontWeight: '700', color: '#5a03cf' }}>
                  Ajouter un nouvel établissement
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Créez un nouvel abonnement pour votre lieu
                </p>
              </div>
              <button
                onClick={() => setShowAddVenueModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddVenue} className="p-6 space-y-6">
              {/* Informations de l'établissement */}
              <div className="space-y-4">
                <h3 className="text-lg text-gray-900 dark:text-white" style={{ fontWeight: '600' }}>
                  Informations de l'établissement
                </h3>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm" style={{ fontWeight: '600' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="w-4 h-4 text-[#5a03cf]" />
                      Nom de l'établissement
                    </div>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Le Sport Bar Paris"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] text-gray-900 dark:text-white transition-all"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm" style={{ fontWeight: '600' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4 text-[#5a03cf]" />
                        Ville
                      </div>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Paris 11ème"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] text-gray-900 dark:text-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm" style={{ fontWeight: '600' }}>
                      Code postal
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="75011"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] text-gray-900 dark:text-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm" style={{ fontWeight: '600' }}>
                    Adresse complète
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="123 Rue de la République"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] text-gray-900 dark:text-white transition-all"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm" style={{ fontWeight: '600' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="w-4 h-4 text-[#5a03cf]" />
                        Email de contact
                      </div>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="contact@sportbar.fr"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] text-gray-900 dark:text-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm" style={{ fontWeight: '600' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Phone className="w-4 h-4 text-[#5a03cf]" />
                        Téléphone
                      </div>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="01 23 45 67 89"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] text-gray-900 dark:text-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Choix de la formule */}
              <div className="space-y-4">
                <h3 className="text-lg text-gray-900 dark:text-white" style={{ fontWeight: '600' }}>
                  Choisissez votre formule
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <label className="cursor-pointer">
                    <input type="radio" name="formule" value="mensuel" className="peer sr-only" />
                    <div className="p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl peer-checked:border-[#5a03cf] peer-checked:bg-[#5a03cf]/5 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-lg mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
                            Mensuel
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">360€/an</p>
                        </div>
                      </div>
                      <div>
                        <span className="text-3xl bg-gradient-to-r from-[#5a03cf] to-[#9cff02] bg-clip-text text-transparent" style={{ fontWeight: '700' }}>
                          30€
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">/mois</span>
                      </div>
                    </div>
                  </label>

                  <label className="cursor-pointer">
                    <input type="radio" name="formule" value="annuel" defaultChecked className="peer sr-only" />
                    <div className="p-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl peer-checked:border-[#5a03cf] peer-checked:bg-[#5a03cf]/5 transition-all relative overflow-hidden">
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-[#9cff02]/20 text-[#5a03cf] rounded text-xs" style={{ fontWeight: '600' }}>
                          Économisez 60€
                        </span>
                      </div>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-lg mb-1" style={{ fontWeight: '600', color: '#5a03cf' }}>
                            Annuel
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">300€/an</p>
                        </div>
                      </div>
                      <div>
                        <span className="text-3xl bg-gradient-to-r from-[#5a03cf] to-[#9cff02] bg-clip-text text-transparent" style={{ fontWeight: '700' }}>
                          25€
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">/mois</span>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Avantages */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm" style={{ fontWeight: '600' }}>
                    Inclus dans votre abonnement :
                  </p>
                  <ul className="space-y-2">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 text-sm">
                        <span className="text-[#5a03cf] mt-0.5">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Paiement */}
              <div className="space-y-4">
                <h3 className="text-lg text-gray-900 dark:text-white flex items-center gap-2" style={{ fontWeight: '600' }}>
                  <CreditCard className="w-5 h-5 text-[#5a03cf]" />
                  Informations de paiement
                </h3>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm" style={{ fontWeight: '600' }}>
                    Numéro de carte
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] text-gray-900 dark:text-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm" style={{ fontWeight: '600' }}>
                      Date d'expiration
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/AA"
                      maxLength={5}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] text-gray-900 dark:text-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 text-sm" style={{ fontWeight: '600' }}>
                      CVV
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="123"
                      maxLength={3}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5a03cf] text-gray-900 dark:text-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowAddVenueModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                  style={{ fontWeight: '600' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white rounded-xl hover:brightness-105 transition-all shadow-lg"
                  style={{ fontWeight: '600' }}
                >
                  Créer l'abonnement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}