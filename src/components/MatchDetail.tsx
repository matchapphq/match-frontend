import { ArrowLeft, Calendar, Users, MapPin, TrendingUp, Eye } from 'lucide-react';

interface MatchDetailProps {
  onBack: () => void;
}

const matchInfo = {
  equipe1: 'PSG',
  equipe2: 'OM',
  sport: '⚽',
  sportNom: 'Football',
  date: '15/12/2024',
  heure: '21:00',
  competition: 'Ligue 1',
  restaurant: 'Le Sport Bar',
  places: 40,
  reservees: 35,
};

const reservations = [
  { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@email.fr', places: 2, dateReservation: '10/12/2024' },
  { id: 2, nom: 'Martin', prenom: 'Sophie', email: 'sophie.martin@email.fr', places: 1, dateReservation: '11/12/2024' },
  { id: 3, nom: 'Bernard', prenom: 'Luc', email: 'luc.bernard@email.fr', places: 4, dateReservation: '12/12/2024' },
  { id: 4, nom: 'Petit', prenom: 'Marie', email: 'marie.petit@email.fr', places: 3, dateReservation: '12/12/2024' },
];

export function MatchDetail({ onBack }: MatchDetailProps) {
  const percentage = Math.round((matchInfo.reservees / matchInfo.places) * 100);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour aux matchs
      </button>

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl">{matchInfo.sport}</span>
          <div>
            <h1 className="text-gray-900 italic text-4xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
              {matchInfo.equipe1} vs {matchInfo.equipe2}
            </h1>
            <p className="text-gray-600 text-lg">{matchInfo.sportNom} • {matchInfo.competition}</p>
          </div>
        </div>
      </div>

      {/* Informations du match */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] text-white rounded-xl p-6 shadow-lg">
          <Calendar className="w-8 h-8 mb-3" />
          <p className="text-white/80 text-sm mb-1">Date et heure</p>
          <p className="text-2xl italic" style={{ fontWeight: '700' }}>
            {matchInfo.date} à {matchInfo.heure}
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#9cff02] to-[#7cdf00] text-[#5a03cf] rounded-xl p-6 shadow-lg">
          <MapPin className="w-8 h-8 mb-3" />
          <p className="text-[#5a03cf]/80 text-sm mb-1">Établissement</p>
          <p className="text-2xl italic" style={{ fontWeight: '700' }}>
            {matchInfo.restaurant}
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-lg border-2 border-[#5a03cf] p-6">
          <Users className="w-6 h-6 text-[#5a03cf] mb-3" />
          <p className="text-gray-600 text-sm mb-1">Places réservées</p>
          <p className="text-3xl italic text-[#5a03cf]" style={{ fontWeight: '700' }}>
            {matchInfo.reservees}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
          <TrendingUp className="w-6 h-6 text-gray-600 mb-3" />
          <p className="text-gray-600 text-sm mb-1">Places totales</p>
          <p className="text-3xl italic text-gray-900" style={{ fontWeight: '700' }}>
            {matchInfo.places}
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#9cff02] to-[#7cdf00] text-[#5a03cf] rounded-xl shadow-lg p-6">
          <Eye className="w-6 h-6 mb-3" />
          <p className="text-[#5a03cf]/80 text-sm mb-1">Taux de remplissage</p>
          <p className="text-3xl italic" style={{ fontWeight: '700' }}>
            {percentage}%
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-6">
          <Users className="w-6 h-6 text-gray-600 mb-3" />
          <p className="text-gray-600 text-sm mb-1">Réservations</p>
          <p className="text-3xl italic text-gray-900" style={{ fontWeight: '700' }}>
            {reservations.length}
          </p>
        </div>
      </div>

      {/* Liste des réservations */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white p-6">
          <h2 className="text-2xl" style={{ fontWeight: '700' }}>
            Liste des réservations
          </h2>
          <p className="text-white/80">{reservations.length} réservations confirmées</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700" style={{ fontWeight: '600' }}>Client</th>
                <th className="px-6 py-3 text-left text-gray-700" style={{ fontWeight: '600' }}>Email</th>
                <th className="px-6 py-3 text-left text-gray-700" style={{ fontWeight: '600' }}>Places</th>
                <th className="px-6 py-3 text-left text-gray-700" style={{ fontWeight: '600' }}>Date de réservation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900">
                    {reservation.prenom} {reservation.nom}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{reservation.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#9cff02] text-[#5a03cf]" style={{ fontWeight: '600' }}>
                      {reservation.places}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{reservation.dateReservation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
