import { ArrowLeft, MapPin, Users, Star, Phone, Mail, Clock, Euro } from 'lucide-react';

interface RestaurantDetailProps {
  onBack: () => void;
}

const restaurant = {
  nom: 'Le Sport Bar',
  adresse: '12 Rue de la République, 75001 Paris',
  telephone: '01 23 45 67 89',
  email: 'contact@lesportbar.fr',
  capaciteMax: 50,
  note: 4.5,
  totalAvis: 127,
  image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop',
  horaires: 'Lun-Dim: 11h00 - 02h00',
  tarif: '30€/mois',
};

const avis = [
  { id: 1, auteur: 'Jean D.', note: 5, commentaire: 'Excellent endroit pour regarder les matchs ! Ambiance de folie.', date: '05/12/2024' },
  { id: 2, auteur: 'Sophie M.', note: 4, commentaire: 'Très bon service, écrans de qualité. Je recommande !', date: '03/12/2024' },
  { id: 3, auteur: 'Luc B.', note: 5, commentaire: 'Le meilleur bar sportif de Paris. Toujours bien accueilli.', date: '01/12/2024' },
  { id: 4, auteur: 'Marie P.', note: 4, commentaire: 'Super ambiance, parfait pour les soirées matchs entre amis.', date: '28/11/2024' },
];

const statistiques = [
  { label: 'Matchs diffusés', value: '45', icon: Clock },
  { label: 'Clients accueillis', value: '1.2K', icon: Users },
  { label: 'Note moyenne', value: '4.5/5', icon: Star },
  { label: 'Abonnement', value: '30€/mois', icon: Euro },
];

export function RestaurantDetail({ onBack }: RestaurantDetailProps) {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour aux restaurants
      </button>

      {/* Image et titre */}
      <div className="mb-8">
        <div className="h-64 rounded-2xl overflow-hidden mb-6">
          <img src={restaurant.image} alt={restaurant.nom} className="w-full h-full object-cover" />
        </div>
        <h1 className="text-gray-900 italic text-4xl mb-4" style={{ fontWeight: '700', color: '#5a03cf' }}>
          {restaurant.nom}
        </h1>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
          <MapPin className="w-6 h-6 text-[#5a03cf] mb-3" />
          <p className="text-gray-600 text-sm mb-1">Adresse</p>
          <p className="text-gray-900" style={{ fontWeight: '600' }}>{restaurant.adresse}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
          <Users className="w-6 h-6 text-[#5a03cf] mb-3" />
          <p className="text-gray-600 text-sm mb-1">Capacité maximale</p>
          <p className="text-gray-900 text-2xl italic" style={{ fontWeight: '700' }}>
            {restaurant.capaciteMax} places
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
          <Phone className="w-6 h-6 text-[#5a03cf] mb-3" />
          <p className="text-gray-600 text-sm mb-1">Téléphone</p>
          <p className="text-gray-900" style={{ fontWeight: '600' }}>{restaurant.telephone}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
          <Mail className="w-6 h-6 text-[#5a03cf] mb-3" />
          <p className="text-gray-600 text-sm mb-1">Email</p>
          <p className="text-gray-900" style={{ fontWeight: '600' }}>{restaurant.email}</p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {statistiques.map((stat, index) => {
          const Icon = stat.icon;
          const isGreen = index % 2 === 1;
          return (
            <div
              key={index}
              className={`${
                isGreen
                  ? 'bg-gradient-to-br from-[#9cff02] to-[#7cdf00] text-[#5a03cf]'
                  : 'bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] text-white'
              } rounded-xl p-6 shadow-lg`}
            >
              <Icon className={`w-6 h-6 mb-3 ${isGreen ? 'opacity-80' : 'opacity-80'}`} />
              <p className={`${isGreen ? 'text-[#5a03cf]/80' : 'text-white/80'} text-sm mb-1`}>
                {stat.label}
              </p>
              <p className="text-2xl italic" style={{ fontWeight: '700' }}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Avis clients */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl mb-1" style={{ fontWeight: '700' }}>
                Avis clients
              </h2>
              <p className="text-white/80">{restaurant.totalAvis} avis</p>
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 fill-[#9cff02] text-[#9cff02]" />
              <span className="text-3xl italic" style={{ fontWeight: '700' }}>
                {restaurant.note}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {avis.map((avisItem) => (
            <div
              key={avisItem.id}
              className="bg-gradient-to-r from-[#5a03cf]/5 to-[#9cff02]/5 rounded-xl p-5 border border-[#5a03cf]/20"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-gray-900" style={{ fontWeight: '600' }}>
                    {avisItem.auteur}
                  </p>
                  <div className="flex mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= avisItem.note ? 'fill-[#9cff02] text-[#9cff02]' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-500 text-sm">{avisItem.date}</p>
              </div>
              <p className="text-gray-700">{avisItem.commentaire}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
