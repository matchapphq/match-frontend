import { useState, useRef } from 'react';
import { PageType } from '../types';
import { useAuth } from '../features/authentication/context/AuthContext';
import { ArrowLeft, MapPin, Star, Eye, Edit2, BarChart3 } from 'lucide-react';

interface MesLieuxProps {
  onNavigate: (page: PageType) => void;
  onBack?: () => void;
}

export function MesLieux({ onNavigate, onBack }: MesLieuxProps) {
  const { currentUser } = useAuth();
  const listeRef = useRef<HTMLDivElement>(null);

  const [etablissements] = useState([
    {
      id: '1',
      nom: 'Le Sport Bar',
      ville: 'Paris',
      adresse: '12 Rue de la République, 75001 Paris',
      statut: 'actif',
      abonnement: 'Annuel - 300€/an',
      prochainRenouvellement: '01/12/2025',
      matchsDiffuses: 47,
      clientsTotal: 1240,
      note: 4.5,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop',
    },
    {
      id: '2',
      nom: 'Chez Michel',
      ville: 'Lyon',
      adresse: '45 Avenue des Champs, 69001 Lyon',
      statut: 'actif',
      abonnement: 'Mensuel - 30€/mois',
      prochainRenouvellement: '15/01/2025',
      matchsDiffuses: 23,
      clientsTotal: 580,
      note: 4.8,
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop',
    },
    {
      id: '3',
      nom: 'La Brasserie du Stade',
      ville: 'Marseille',
      adresse: '78 Boulevard Sport, 13001 Marseille',
      statut: 'actif',
      abonnement: 'Annuel - 300€/an',
      prochainRenouvellement: '20/11/2025',
      matchsDiffuses: 35,
      clientsTotal: 890,
      note: 4.6,
      image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&h=400&fit=crop',
    },
  ]);

  // Calcul des KPI globaux
  const nombreLieux = etablissements.length;
  const noteMoyenneGlobale = etablissements.length > 0
    ? (etablissements.reduce((acc, e) => acc + e.note, 0) / nombreLieux).toFixed(1)
    : '0.0';

  const scrollToListe = () => {
    listeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
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

      {/* Header avec KPI et bouton */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border-2 border-transparent bg-clip-padding p-8 mb-6"
        style={{
          backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #9cff02 0%, #5a03cf 100%)',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
        }}
      >
        <div className="flex items-start justify-between mb-8">
          <h1 className="text-5xl italic" style={{ fontWeight: '700', color: '#5a03cf' }}>
            Mes lieux
          </h1>
          
          <div className="group relative">
            <button
              onClick={() => onNavigate('ajouter-restaurant')}
              className="px-6 py-3 bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white rounded-xl hover:brightness-105 hover:scale-[1.01] transition-all shadow-sm"
              style={{ fontWeight: '600' }}
            >
              + Ajouter un restaurant
            </button>
            <span className="absolute right-0 top-full mt-2 px-3 py-2 bg-gray-900/90 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm">
              Ajoutez un nouveau lieu et commencez à diffuser des matchs
            </span>
          </div>
        </div>

        {/* KPI globaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={scrollToListe}
            className="bg-white/70 backdrop-blur-xl rounded-xl border-2 border-transparent bg-clip-padding p-6 hover:scale-[1.02] transition-all text-left group cursor-pointer"
            style={{
              backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #9cff02 0%, #5a03cf 100%)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <p className="text-6xl italic mb-2" style={{ fontWeight: '700', color: '#9cff02' }}>
              {nombreLieux}
            </p>
            <p className="text-gray-700" style={{ fontWeight: '600' }}>
              Nombre de lieu(x)
            </p>
          </button>

          <div 
            className="bg-white/70 backdrop-blur-xl rounded-xl border-2 border-transparent bg-clip-padding p-6 transition-all"
            style={{
              backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #9cff02 0%, #5a03cf 100%)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <p className="text-6xl italic mb-2" style={{ fontWeight: '700', color: '#9cff02' }}>
              {noteMoyenneGlobale}
            </p>
            <p className="text-gray-700" style={{ fontWeight: '600' }}>
              Note moyenne de mes établissements
            </p>
          </div>
        </div>
      </div>

      {/* Grille des établissements */}
      <div ref={listeRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {etablissements.map((etablissement) => (
          <div
            key={etablissement.id}
            onClick={() => onNavigate('restaurant-detail')}
            className="bg-white/70 backdrop-blur-xl rounded-2xl border-2 border-transparent bg-clip-padding overflow-hidden hover:scale-[1.02] transition-all cursor-pointer group"
            style={{
              backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #9cff02 0%, #5a03cf 100%)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            {/* Image du lieu */}
            <div className="w-full h-48 relative overflow-hidden">
              <img 
                src={etablissement.image} 
                alt={etablissement.nom} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              
              {/* Badge de statut */}
              <div className="absolute top-3 right-3">
                <span
                  className={`inline-block px-3 py-1.5 rounded-lg text-xs backdrop-blur-md ${
                    etablissement.statut === 'actif'
                      ? 'bg-[#9cff02]/90 text-[#5a03cf]'
                      : etablissement.statut === 'inactif'
                      ? 'bg-gray-100/90 text-gray-600'
                      : 'bg-orange-50/90 text-orange-600'
                  }`}
                  style={{ fontWeight: '700' }}
                >
                  {etablissement.statut === 'actif' ? 'Actif' : etablissement.statut === 'inactif' ? 'Inactif' : 'En attente'}
                </span>
              </div>

              {/* Actions rapides au hover */}
              <div className="absolute inset-0 bg-[#5a03cf]/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('restaurant-detail');
                  }}
                  className="p-2.5 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg hover:bg-white/30 transition-all"
                  title="Voir le détail"
                >
                  <Eye className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('modifier-restaurant');
                  }}
                  className="p-2.5 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg hover:bg-white/30 transition-all"
                  title="Modifier"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Navigation vers statistiques
                  }}
                  className="p-2.5 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg hover:bg-white/30 transition-all"
                  title="Statistiques"
                >
                  <BarChart3 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Informations */}
            <div className="p-5">
              <h3 className="text-xl mb-2 italic" style={{ fontWeight: '700', color: '#5a03cf' }}>
                {etablissement.nom}
              </h3>
              
              <div className="flex items-start gap-2 text-gray-600 mb-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{etablissement.adresse}</p>
              </div>

              {/* Statistiques */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200/50">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#9cff02] text-[#9cff02]" />
                  <span className="text-sm" style={{ fontWeight: '700', color: '#5a03cf' }}>
                    {etablissement.note}
                  </span>
                </div>
                
                <div className="text-right">
                  <p className="text-xs text-gray-500">Matchs diffusés</p>
                  <p className="text-sm" style={{ fontWeight: '700', color: '#5a03cf' }}>
                    {etablissement.matchsDiffuses}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-500">Clients</p>
                  <p className="text-sm" style={{ fontWeight: '700', color: '#5a03cf' }}>
                    {etablissement.clientsTotal}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message si aucun établissement */}
      {etablissements.length === 0 && (
        <div className="bg-white/70 backdrop-blur-xl rounded-xl border border-gray-200/50 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 flex items-center justify-center">
            <MapPin className="w-10 h-10 text-[#5a03cf]/40" />
          </div>
          <p className="text-2xl mb-2 italic" style={{ fontWeight: '700', color: '#5a03cf' }}>
            Vous n'avez encore aucun lieu enregistré
          </p>
          <p className="text-gray-600 mb-6">
            Commencez par ajouter votre premier restaurant pour diffuser des matchs
          </p>
          <button
            onClick={() => onNavigate('ajouter-restaurant')}
            className="px-6 py-3 bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white rounded-xl hover:brightness-105 hover:scale-[1.01] transition-all shadow-sm"
            style={{ fontWeight: '600' }}
          >
            Ajouter mon premier restaurant
          </button>
        </div>
      )}
    </div>
  );
}
