import { useState } from 'react';
import { PageType } from '../App';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

interface MesLieuxProps {
  onNavigate: (page: PageType) => void;
  onBack?: () => void;
}

export function MesLieux({ onNavigate, onBack }: MesLieuxProps) {
  const { currentUser } = useAuth();

  const [etablissements] = useState([
    {
      id: '1',
      nom: 'Le Sport Bar Paris',
      ville: 'Paris 11ème',
      adresse: '12 Rue de la République',
      statut: 'actif',
      abonnement: 'Annuel - 300€/an',
      prochainRenouvellement: '01/12/2025',
      matchsDiffuses: 47,
      clientsTotal: 1240,
    },
    {
      id: '2',
      nom: 'Stadium Café Lyon',
      ville: 'Lyon 2ème',
      adresse: '8 Avenue des Sports',
      statut: 'actif',
      abonnement: 'Mensuel - 30€/mois',
      prochainRenouvellement: '15/01/2025',
      matchsDiffuses: 23,
      clientsTotal: 580,
    },
    {
      id: '3',
      nom: 'Goal Lounge Marseille',
      ville: 'Marseille 1er',
      adresse: '25 Boulevard du Match',
      statut: 'en_attente',
      abonnement: null,
      prochainRenouvellement: null,
      matchsDiffuses: 0,
      clientsTotal: 0,
    },
  ]);

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
          Mes lieux
        </h1>
        <p className="text-lg text-gray-700">Gérez vos établissements et leurs paramètres</p>
      </div>

      {/* Bouton d'ajout */}
      <div className="mb-6">
        <button
          onClick={() => onNavigate('ajouter-restaurant')}
          className="px-6 py-3 bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white rounded-xl hover:brightness-105 hover:scale-[1.01] transition-all shadow-sm"
          style={{ fontWeight: '600' }}
        >
          Ajouter un établissement
        </button>
      </div>

      {/* Liste des établissements */}
      <div className="space-y-4">
        {etablissements.map((etablissement) => (
          <div
            key={etablissement.id}
            className="bg-white/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 p-6 hover:border-gray-300/60 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
                    {etablissement.nom}
                  </h2>
                  <span
                    className={`inline-block px-3 py-1 rounded-lg text-sm ${
                      etablissement.statut === 'actif'
                        ? 'bg-[#9cff02]/20 text-[#5a03cf] border border-[#9cff02]/30'
                        : 'bg-orange-50 text-orange-600 border border-orange-200'
                    }`}
                    style={{ fontWeight: '600' }}
                  >
                    {etablissement.statut === 'actif' ? 'Actif' : 'En attente'}
                  </span>
                </div>
                <p className="text-gray-700 mb-1">{etablissement.adresse}</p>
                <p className="text-gray-600">{etablissement.ville}</p>
              </div>
            </div>

            {/* Statistiques rapides */}
            {etablissement.statut === 'actif' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30">
                  <p className="text-gray-600 text-sm mb-1">Matchs diffusés</p>
                  <p className="text-2xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
                    {etablissement.matchsDiffuses}
                  </p>
                </div>
                <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30">
                  <p className="text-gray-600 text-sm mb-1">Clients total</p>
                  <p className="text-2xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
                    {etablissement.clientsTotal}
                  </p>
                </div>
                <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30">
                  <p className="text-gray-600 text-sm mb-1">Abonnement</p>
                  <p className="text-sm" style={{ fontWeight: '600', color: '#5a03cf' }}>
                    {etablissement.abonnement}
                  </p>
                </div>
                <div className="bg-gray-50/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/30">
                  <p className="text-gray-600 text-sm mb-1">Renouvellement</p>
                  <p className="text-sm" style={{ fontWeight: '600' }}>
                    {etablissement.prochainRenouvellement}
                  </p>
                </div>
              </div>
            )}

            {/* En attente d'activation */}
            {etablissement.statut === 'en_attente' && (
              <div className="bg-orange-50/50 backdrop-blur-sm rounded-xl p-4 border border-orange-200/30 mb-4">
                <p className="text-orange-700" style={{ fontWeight: '600' }}>
                  Établissement en attente d'activation
                </p>
                <p className="text-orange-600 text-sm mt-1">
                  Finalisez votre abonnement pour activer cet établissement
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => onNavigate('restaurant-detail')}
                className="flex-1 px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 text-[#5a03cf] rounded-xl hover:bg-white/70 transition-all"
                style={{ fontWeight: '600' }}
              >
                Voir les détails
              </button>
              <button
                onClick={() => onNavigate('modifier-restaurant')}
                className="flex-1 px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 text-[#5a03cf] rounded-xl hover:bg-white/70 transition-all"
                style={{ fontWeight: '600' }}
              >
                Paramètres
              </button>
              {etablissement.statut === 'actif' && (
                <button
                  onClick={() => onNavigate('compte-facturation')}
                  className="flex-1 px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 text-[#5a03cf] rounded-xl hover:bg-white/70 transition-all"
                  style={{ fontWeight: '600' }}
                >
                  Gérer l'abonnement
                </button>
              )}
              {etablissement.statut === 'en_attente' && (
                <button
                  onClick={() => onNavigate('facturation')}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white rounded-xl hover:brightness-105 hover:scale-[1.01] transition-all shadow-sm"
                  style={{ fontWeight: '600' }}
                >
                  Activer l'abonnement
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Message si aucun établissement */}
      {etablissements.length === 0 && (
        <div className="bg-white/70 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 p-12 text-center">
          <p className="text-xl text-gray-600 mb-4">
            Vous n'avez pas encore d'établissement
          </p>
          <button
            onClick={() => onNavigate('ajouter-restaurant')}
            className="px-6 py-3 bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white rounded-xl hover:brightness-105 hover:scale-[1.01] transition-all shadow-sm"
            style={{ fontWeight: '600' }}
          >
            Ajouter votre premier établissement
          </button>
        </div>
      )}
    </div>
  );
}