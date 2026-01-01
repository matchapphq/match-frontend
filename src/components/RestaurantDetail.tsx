import { ArrowLeft, MapPin, Users, Star, Phone, Mail, Edit2, Calendar, BarChart3, Eye } from 'lucide-react';

interface RestaurantDetailProps {
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

const restaurant = {
  nom: 'Le Sport Bar',
  adresse: '12 Rue de la République, 75001 Paris',
  telephone: '01 23 45 67 89',
  email: 'contact@lesportbar.fr',
  capaciteMax: 50,
  note: 4.5,
  totalAvis: 0,
  image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop',
  horaires: 'Lun-Dim: 11h00 - 02h00',
  tarif: '30€/mois',
  statut: 'actif',
  matchsDiffuses: 45,
  clientsAccueillis: 1240,
};

export function RestaurantDetail({ onBack, onNavigate }: RestaurantDetailProps) {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour à mes lieux
      </button>

      {/* Hero - Image et titre */}
      <div className="mb-8">
        <div className="h-64 rounded-2xl overflow-hidden mb-6 relative">
          <img src={restaurant.image} alt={restaurant.nom} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
        
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl italic" style={{ fontWeight: '700', color: '#5a03cf' }}>
              {restaurant.nom}
            </h1>
            <span
              className={`px-3 py-1.5 rounded-lg text-sm backdrop-blur-sm ${
                restaurant.statut === 'actif'
                  ? 'bg-[#9cff02]/20 text-[#5a03cf] border border-[#9cff02]/40'
                  : 'bg-gray-100/80 text-gray-600 border border-gray-300/50'
              }`}
              style={{ fontWeight: '600' }}
            >
              {restaurant.statut === 'actif' ? 'Actif' : 'Inactif'}
            </span>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2.5 bg-white/70 backdrop-blur-sm border border-gray-200/50 text-gray-700 rounded-xl hover:bg-white/90 transition-all flex items-center gap-2" style={{ fontWeight: '600' }}>
            <Edit2 className="w-4 h-4" />
            Modifier le lieu
          </button>
          <button className="px-4 py-2.5 bg-white/70 backdrop-blur-sm border border-gray-200/50 text-gray-700 rounded-xl hover:bg-white/90 transition-all flex items-center gap-2" style={{ fontWeight: '600' }}>
            <Calendar className="w-4 h-4" />
            Gérer les matchs
          </button>
          <button className="px-4 py-2.5 bg-white/70 backdrop-blur-sm border border-gray-200/50 text-gray-700 rounded-xl hover:bg-white/90 transition-all flex items-center gap-2" style={{ fontWeight: '600' }}>
            <BarChart3 className="w-4 h-4" />
            Voir les statistiques
          </button>
          <button className="px-4 py-2.5 bg-white/70 backdrop-blur-sm border border-gray-200/50 text-gray-700 rounded-xl hover:bg-white/90 transition-all flex items-center gap-2" style={{ fontWeight: '600' }}>
            <Eye className="w-4 h-4" />
            Aperçu public
          </button>
        </div>
      </div>

      {/* Informations clés */}
      <h2 className="text-2xl mb-4 italic" style={{ fontWeight: '700', color: '#5a03cf' }}>
        Informations du lieu
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white/70 backdrop-blur-xl rounded-xl border border-gray-200/50 p-5 group hover:border-gray-300/60 transition-all min-h-[120px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <MapPin className="w-5 h-5 text-[#5a03cf]" />
              <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-[#5a03cf]">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-600 text-sm mb-1">Adresse</p>
            <p className="text-gray-900" style={{ fontWeight: '600' }}>{restaurant.adresse}</p>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-xl border border-gray-200/50 p-5 group hover:border-gray-300/60 transition-all min-h-[120px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-[#5a03cf]" />
              <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-[#5a03cf]">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-600 text-sm mb-1">Capacité maximale</p>
            <p className="text-gray-900" style={{ fontWeight: '600' }}>
              {restaurant.capaciteMax} places
            </p>
          </div>
          <p className="text-xs text-gray-500 mt-2">Utilisée pour la gestion des réservations</p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-xl border border-gray-200/50 p-5 hover:border-gray-300/60 transition-all min-h-[120px] flex flex-col justify-between">
          <div>
            <Phone className="w-5 h-5 text-[#5a03cf] mb-2" />
            <p className="text-gray-600 text-sm mb-1">Téléphone</p>
            <p className="text-gray-900" style={{ fontWeight: '600' }}>{restaurant.telephone}</p>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-xl border border-gray-200/50 p-5 hover:border-gray-300/60 transition-all min-h-[120px] flex flex-col justify-between">
          <div>
            <Mail className="w-5 h-5 text-[#5a03cf] mb-2" />
            <p className="text-gray-600 text-sm mb-1">Email</p>
            <p className="text-gray-900" style={{ fontWeight: '600' }}>{restaurant.email}</p>
          </div>
        </div>
      </div>

      {/* Performance du lieu */}
      <h2 className="text-2xl mb-4 italic" style={{ fontWeight: '700', color: '#5a03cf' }}>
        Performance de ce lieu
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/70 backdrop-blur-xl rounded-xl border border-gray-200/50 p-5 hover:border-gray-300/60 transition-all">
          <p className="text-gray-600 text-sm mb-2">Matchs diffusés</p>
          <p className="text-3xl italic" style={{ fontWeight: '700', color: '#5a03cf' }}>
            {restaurant.matchsDiffuses}
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-xl border border-gray-200/50 p-5 hover:border-gray-300/60 transition-all">
          <p className="text-gray-600 text-sm mb-2">Clients accueillis</p>
          <p className="text-3xl italic" style={{ fontWeight: '700', color: '#5a03cf' }}>
            {restaurant.clientsAccueillis.toLocaleString('fr-FR')}
          </p>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-xl border border-gray-200/50 p-5 hover:border-gray-300/60 transition-all">
          <p className="text-gray-600 text-sm mb-2">Note moyenne</p>
          <div className="flex items-center gap-2">
            <p className="text-3xl italic" style={{ fontWeight: '700', color: '#5a03cf' }}>
              {restaurant.note}
            </p>
            <Star className="w-6 h-6 fill-[#9cff02] text-[#9cff02]" />
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-xl border border-gray-200/50 p-5 hover:border-gray-300/60 transition-all">
          <p className="text-gray-600 text-sm mb-2">Nombre d'avis</p>
          <p className="text-3xl italic" style={{ fontWeight: '700', color: '#5a03cf' }}>
            {restaurant.totalAvis}
          </p>
        </div>
      </div>

      {/* Avis clients */}
      <h2 className="text-2xl mb-4 italic" style={{ fontWeight: '700', color: '#5a03cf' }}>
        Avis clients
      </h2>
      <div className="bg-white/70 backdrop-blur-xl rounded-xl border border-gray-200/50 overflow-hidden">
        {restaurant.totalAvis === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 flex items-center justify-center">
              <Star className="w-8 h-8 text-[#5a03cf]/40" />
            </div>
            <p className="text-xl mb-2" style={{ fontWeight: '600', color: '#5a03cf' }}>
              Aucun avis pour le moment
            </p>
            <p className="text-gray-600">
              Les avis apparaîtront après vos premiers matchs diffusés.
            </p>
          </div>
        ) : (
          <div className="p-6">
            {/* Les avis réels s'afficheront ici */}
          </div>
        )}
      </div>
    </div>
  );
}
