import { ArrowLeft, Calendar, Users, MapPin, TrendingUp, Eye, Check, X, Clock, Edit, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { PageType } from '../../App';
import { mockMatchInfo, mockMatchDetailReservations } from '../../data/mockData';

interface MatchDetailProps {
  matchId: number | null;
  onBack: () => void;
  onEditMatch?: () => void;
  onNavigate?: (page: PageType, matchId?: number) => void;
}

export function MatchDetail({ matchId, onBack, onEditMatch, onNavigate }: MatchDetailProps) {
  const [reservations, setReservations] = useState(mockMatchDetailReservations);
  const [activeTab, setActiveTab] = useState<'en-attente' | 'confirmees' | 'refusees'>('en-attente');
  const { handleReservationAction } = useAppContext();

  const matchInfo = mockMatchInfo;
  const percentage = Math.round((matchInfo.reservees / matchInfo.places) * 100);

  // Filtrer les réservations par statut
  const enAttente = reservations.filter(r => r.statut === 'en attente');
  const confirmees = reservations.filter(r => r.statut === 'confirmé');
  const refusees = reservations.filter(r => r.statut === 'refusé');

  const handleAccept = (reservationId: number) => {
    setReservations(prev => 
      prev.map(r => r.id === reservationId ? { ...r, statut: 'confirmé' as const } : r)
    );
    // handleReservationAction(reservationId, 'acceptée');
  };

  const handleReject = (reservationId: number) => {
    setReservations(prev => 
      prev.map(r => r.id === reservationId ? { ...r, statut: 'refusé' as const } : r)
    );
    // handleReservationAction(reservationId, 'refusée');
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#5a03cf] dark:hover:text-[#9cff02] mb-6 transition-colors"
        style={{ fontWeight: '600' }}
      >
        <ArrowLeft className="w-5 h-5" />
        Retour aux matchs
      </button>

      {/* Header du match */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{matchInfo.sport}</span>
            <div>
              <h1 className="text-gray-900 dark:text-white italic text-4xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
                {matchInfo.equipe1} vs {matchInfo.equipe2}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">{matchInfo.sportNom} • {matchInfo.competition}</p>
            </div>
          </div>
          
          {onEditMatch && (
            <button
              onClick={onEditMatch}
              className="px-4 py-2.5 bg-white/70 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-white/90 dark:hover:bg-gray-800/95 hover:border-[#5a03cf]/30 hover:text-[#5a03cf] dark:hover:text-[#9cff02] transition-all flex items-center gap-2"
              style={{ fontWeight: '600' }}
            >
              <Edit className="w-4 h-4" />
              Modifier le match
            </button>
          )}
        </div>
      </div>

      {/* Informations du match */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/70 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl p-6 shadow-sm border-2 border-[#5a03cf]/30 dark:border-[#5a03cf]/50">
          <Calendar className="w-8 h-8 mb-3 text-[#5a03cf]" />
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Date et heure</p>
          <p className="text-2xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
            {matchInfo.date} à {matchInfo.heure}
          </p>
        </div>

        <div className="bg-white/70 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl p-6 shadow-sm border-2 border-[#9cff02]/30 dark:border-[#9cff02]/50">
          <MapPin className="w-8 h-8 mb-3 text-[#5a03cf]" />
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Établissement</p>
          <p className="text-2xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
            {matchInfo.restaurant}
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/70 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 dark:border-white/10 p-6">
          <Users className="w-6 h-6 text-[#5a03cf] mb-3" />
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Places réservées</p>
          <p className="text-3xl text-[#5a03cf]" style={{ fontWeight: '700' }}>
            {matchInfo.reservees}
          </p>
        </div>

        <div className="bg-white/70 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 dark:border-white/10 p-6">
          <TrendingUp className="w-6 h-6 text-gray-600 dark:text-gray-400 mb-3" />
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Places totales</p>
          <p className="text-3xl text-gray-900 dark:text-white" style={{ fontWeight: '700' }}>
            {matchInfo.places}
          </p>
        </div>

        <div className="bg-white/70 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-sm border-2 border-[#9cff02]/30 dark:border-[#9cff02]/50 p-6">
          <Eye className="w-6 h-6 text-[#5a03cf] mb-3" />
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Taux de remplissage</p>
          <p className="text-3xl" style={{ fontWeight: '700', color: '#5a03cf' }}>
            {percentage}%
          </p>
        </div>

        <div className="bg-white/70 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 dark:border-white/10 p-6">
          <Clock className="w-6 h-6 text-orange-500 mb-3" />
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">En attente</p>
          <p className="text-3xl text-orange-500" style={{ fontWeight: '700' }}>
            {enAttente.length}
          </p>
        </div>
      </div>

      {/* Gestion des réservations */}
      <div className="bg-white/70 dark:bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-sm border border-gray-200/50 dark:border-white/10 overflow-hidden">
        <div className="bg-gradient-to-r from-white/90 to-white/70 dark:from-gray-900/90 dark:to-gray-900/70 backdrop-blur-sm p-6 border-b border-gray-200/50 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl mb-1" style={{ fontWeight: '700', color: '#5a03cf' }}>
                Gestion des réservations
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Gérez les demandes et consultez toutes vos réservations
              </p>
            </div>
            {onNavigate && (
              <button
                onClick={() => onNavigate('reservations', matchId || undefined)}
                className="px-4 py-2.5 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                style={{ fontWeight: '600' }}
              >
                <ExternalLink className="w-4 h-4" />
                Voir toutes les réservations
              </button>
            )}
          </div>
        </div>

        {/* Onglets */}
        <div className="flex gap-2 p-4 border-b border-gray-200/50 dark:border-white/10 bg-gray-50/50 dark:bg-gray-800/50">
          <button
            onClick={() => setActiveTab('en-attente')}
            className={`px-6 py-3 rounded-xl transition-all ${
              activeTab === 'en-attente'
                ? 'bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white shadow-sm'
                : 'bg-white/70 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-white/90 dark:hover:bg-gray-700/95'
            }`}
            style={{ fontWeight: '600' }}
          >
            En attente
            {enAttente.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-white/30 rounded-full text-xs">
                {enAttente.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('confirmees')}
            className={`px-6 py-3 rounded-xl transition-all ${
              activeTab === 'confirmees'
                ? 'bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white shadow-sm'
                : 'bg-white/70 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-white/90 dark:hover:bg-gray-700/95'
            }`}
            style={{ fontWeight: '600' }}
          >
            Confirmées
            <span className="ml-2 px-2 py-0.5 bg-white/30 rounded-full text-xs">
              {confirmees.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('refusees')}
            className={`px-6 py-3 rounded-xl transition-all ${
              activeTab === 'refusees'
                ? 'bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white shadow-sm'
                : 'bg-white/70 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-white/90 dark:hover:bg-gray-700/95'
            }`}
            style={{ fontWeight: '600' }}
          >
            Refusées
            {refusees.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-white/30 rounded-full text-xs">
                {refusees.length}
              </span>
            )}
          </button>
        </div>

        {/* Contenu des onglets */}
        <div className="p-6">
          {/* EN ATTENTE */}
          {activeTab === 'en-attente' && (
            <div className="space-y-4">
              {enAttente.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100/50 dark:bg-gray-800/50 flex items-center justify-center">
                    <Clock className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Aucune demande en attente
                  </p>
                </div>
              ) : (
                enAttente.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="bg-white/90 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-5 border-2 border-orange-200/50 dark:border-orange-500/30 hover:border-orange-300/60 dark:hover:border-orange-400/50 transition-all shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-gray-900 dark:text-white" style={{ fontWeight: '700' }}>
                            {reservation.prenom} {reservation.nom}
                          </p>
                          <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg text-xs" style={{ fontWeight: '600' }}>
                            En attente
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{reservation.email}</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{reservation.telephone}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Places : <span style={{ fontWeight: '600', color: '#5a03cf' }}>{reservation.places}</span>
                          </span>
                          <span className="text-gray-500 dark:text-gray-500">
                            Demande : {reservation.dateReservation}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAccept(reservation.id)}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white rounded-xl hover:brightness-105 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 shadow-sm"
                        style={{ fontWeight: '600' }}
                      >
                        <Check className="w-4 h-4" />
                        Accepter
                      </button>
                      <button
                        onClick={() => handleReject(reservation.id)}
                        className="flex-1 px-4 py-3 bg-white/70 dark:bg-gray-700/95 backdrop-blur-sm border border-gray-200/50 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-white/90 dark:hover:bg-gray-600/95 transition-all flex items-center justify-center gap-2"
                        style={{ fontWeight: '600' }}
                      >
                        <X className="w-4 h-4" />
                        Refuser
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* CONFIRMÉES */}
          {activeTab === 'confirmees' && (
            <div>
              {confirmees.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100/50 dark:bg-gray-800/50 flex items-center justify-center">
                    <Users className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Aucune réservation confirmée
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-200/50 dark:border-white/10">
                      <tr>
                        <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300" style={{ fontWeight: '600' }}>Client</th>
                        <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300" style={{ fontWeight: '600' }}>Contact</th>
                        <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300" style={{ fontWeight: '600' }}>Places</th>
                        <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300" style={{ fontWeight: '600' }}>Date de réservation</th>
                        <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300" style={{ fontWeight: '600' }}>Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                      {confirmees.map((reservation) => (
                        <tr key={reservation.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-800/30 transition-colors">
                          <td className="px-6 py-4 text-gray-900 dark:text-white" style={{ fontWeight: '600' }}>
                            {reservation.prenom} {reservation.nom}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-gray-600 dark:text-gray-400 text-sm">
                              <p>{reservation.email}</p>
                              <p className="text-gray-500 dark:text-gray-500">{reservation.telephone}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#9cff02]/20 text-[#5a03cf] border border-[#9cff02]/30" style={{ fontWeight: '600' }}>
                              {reservation.places}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{reservation.dateReservation}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/30" style={{ fontWeight: '600' }}>
                              <Check className="w-3 h-3 mr-1" />
                              Confirmé
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* REFUSÉES */}
          {activeTab === 'refusees' && (
            <div>
              {refusees.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100/50 dark:bg-gray-800/50 flex items-center justify-center">
                    <X className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Aucune réservation refusée
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-200/50 dark:border-white/10">
                      <tr>
                        <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300" style={{ fontWeight: '600' }}>Client</th>
                        <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300" style={{ fontWeight: '600' }}>Contact</th>
                        <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300" style={{ fontWeight: '600' }}>Places</th>
                        <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300" style={{ fontWeight: '600' }}>Date de demande</th>
                        <th className="px-6 py-3 text-left text-gray-700 dark:text-gray-300" style={{ fontWeight: '600' }}>Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                      {refusees.map((reservation) => (
                        <tr key={reservation.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-800/30 transition-colors opacity-60">
                          <td className="px-6 py-4 text-gray-900 dark:text-white" style={{ fontWeight: '600' }}>
                            {reservation.prenom} {reservation.nom}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-gray-600 dark:text-gray-400 text-sm">
                              <p>{reservation.email}</p>
                              <p className="text-gray-500 dark:text-gray-500">{reservation.telephone}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400" style={{ fontWeight: '600' }}>
                              {reservation.places}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{reservation.dateReservation}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30" style={{ fontWeight: '600' }}>
                              <X className="w-3 h-3 mr-1" />
                              Refusé
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
