import { useState } from 'react';
import { Users, Search, Mail, Phone, X, CheckCircle, Clock, Filter, Download, MessageCircle, Calendar, MapPin, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import { PageType } from '../App';
import { mockMatchesWithReservations, mockReservations } from '../data/mockData';

interface ReservationsProps {
  onNavigate?: (page: PageType) => void;
  matchId?: number;
}

export function Reservations({ onNavigate, matchId }: ReservationsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState<'tous' | 'confirmée' | 'en attente' | 'annulée'>('tous');
  const [filterLieu, setFilterLieu] = useState<string>('tous');
  const [filterPeriode, setFilterPeriode] = useState<'tous' | 'aujourdhui' | 'semaine' | 'avenir' | 'passes'>('tous');
  const [viewMode, setViewMode] = useState<'grouped' | 'list'>('grouped');
  const [expandedMatches, setExpandedMatches] = useState<number[]>([1]); // Premier match ouvert par défaut

  const toggleMatchExpand = (matchId: number) => {
    setExpandedMatches(prev => 
      prev.includes(matchId) 
        ? prev.filter(id => id !== matchId)
        : [...prev, matchId]
    );
  };

  const handleCancelReservation = (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
      alert(`Réservation #${id} annulée`);
    }
  };

  const handleConfirmReservation = (id: number) => {
    alert(`Réservation #${id} confirmée`);
  };

  const handleContactClient = (email: string, phone: string) => {
    const choice = confirm(`Contacter par:\n\nOK = Email (${email})\nAnnuler = Téléphone (${phone})`);
    if (choice) {
      window.location.href = `mailto:${email}`;
    } else {
      window.location.href = `tel:${phone}`;
    }
  };

  const handleExportReservations = () => {
    alert('Export des réservations en CSV');
  };

  // Filtrer les réservations
  const reservationsFiltrees = mockReservations.filter(res => {
    const matchSearch = res.clientNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       res.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       res.telephone.includes(searchTerm);
    const matchStatut = filterStatut === 'tous' || res.statut === filterStatut;
    
    const match = mockMatchesWithReservations.find(m => m.id === res.matchId);
    const matchLieu = filterLieu === 'tous' || match?.lieu === filterLieu;
    
    // Filtre de période (simplifié pour la démo)
    let matchPeriode = true;
    if (filterPeriode === 'aujourdhui') {
      matchPeriode = res.dateReservation === '15/01/2025';
    } else if (filterPeriode === 'semaine') {
      matchPeriode = ['15/01/2025', '16/01/2025', '18/01/2025'].includes(res.dateReservation);
    }
    
    return matchSearch && matchStatut && matchLieu && matchPeriode;
  });

  // Grouper par match
  const reservationsParMatch = mockMatchesWithReservations.map(match => ({
    match,
    reservations: reservationsFiltrees.filter(r => r.matchId === match.id),
    stats: {
      total: mockReservations.filter(r => r.matchId === match.id && r.statut !== 'annulée').length,
      confirmees: mockReservations.filter(r => r.matchId === match.id && r.statut === 'confirmée').length,
      enAttente: mockReservations.filter(r => r.matchId === match.id && r.statut === 'en attente').length,
      placesReservees: mockReservations.filter(r => r.matchId === match.id && r.statut !== 'annulée').reduce((acc, r) => acc + r.nombrePlaces, 0),
    }
  })).filter(item => item.reservations.length > 0); // Ne montrer que les matchs avec réservations filtrées

  // Stats globales
  const statsGlobales = {
    total: mockReservations.length,
    confirmees: mockReservations.filter(r => r.statut === 'confirmée').length,
    enAttente: mockReservations.filter(r => r.statut === 'en attente').length,
    annulees: mockReservations.filter(r => r.statut === 'annulée').length,
    totalPlaces: mockReservations.filter(r => r.statut !== 'annulée').reduce((acc, r) => acc + r.nombrePlaces, 0),
    matchsProgram: mockMatchesWithReservations.length,
  };

  const lieux = Array.from(new Set(mockMatchesWithReservations.map(m => m.lieu)));

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'confirmée':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800';
      case 'en attente':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800';
      case 'annulée':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-700';
    }
  };

  const getTauxRemplissage = (placesReservees: number, capacite: number) => {
    const taux = (placesReservees / capacite) * 100;
    return Math.min(taux, 100);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto pb-24 lg:pb-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl text-gray-900 dark:text-white mb-1">Réservations</h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Gérez vos réservations par match et par date</p>
              </div>
            </div>
            <button
              onClick={handleExportReservations}
              className="px-4 py-2 bg-gradient-to-r from-[#5a03cf] to-[#9cff02] text-white rounded-xl hover:brightness-105 transition-all flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exporter tout</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl sm:text-3xl text-[#5a03cf] mb-1">{statsGlobales.matchsProgram}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Matchs programmés</div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl sm:text-3xl text-gray-900 dark:text-white mb-1">{statsGlobales.total}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total réservations</div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl sm:text-3xl text-green-600 dark:text-green-400 mb-1">{statsGlobales.confirmees}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Confirmées</div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl sm:text-3xl text-orange-600 dark:text-orange-400 mb-1">{statsGlobales.enAttente}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">En attente</div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl sm:text-3xl text-red-600 dark:text-red-400 mb-1">{statsGlobales.annulees}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Annulées</div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="text-2xl sm:text-3xl text-[#9cff02] dark:text-[#9cff02] mb-1">{statsGlobales.totalPlaces}</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Places réservées</div>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, email ou téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5a03cf] text-sm"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              {/* Période */}
              <select
                value={filterPeriode}
                onChange={(e) => setFilterPeriode(e.target.value as any)}
                className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5a03cf] text-sm"
              >
                <option value="tous">Toutes les dates</option>
                <option value="aujourdhui">Aujourd'hui</option>
                <option value="semaine">Cette semaine</option>
                <option value="avenir">À venir</option>
                <option value="passes">Passées</option>
              </select>

              {/* Lieu */}
              <select
                value={filterLieu}
                onChange={(e) => setFilterLieu(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5a03cf] text-sm"
              >
                <option value="tous">Tous les lieux</option>
                {lieux.map(lieu => (
                  <option key={lieu} value={lieu}>{lieu}</option>
                ))}
              </select>

              {/* Statut */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <select
                  value={filterStatut}
                  onChange={(e) => setFilterStatut(e.target.value as any)}
                  className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5a03cf] text-sm"
                >
                  <option value="tous">Tous les statuts</option>
                  <option value="confirmée">Confirmées</option>
                  <option value="en attente">En attente</option>
                  <option value="annulée">Annulées</option>
                </select>
              </div>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Affichage :</span>
            <button
              onClick={() => setViewMode('grouped')}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                viewMode === 'grouped'
                  ? 'bg-[#5a03cf] text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Par match
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                viewMode === 'list'
                  ? 'bg-[#5a03cf] text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Liste complète
            </button>
          </div>
        </div>

        {/* Reservations Display */}
        {viewMode === 'grouped' ? (
          // Vue groupée par match
          <div className="space-y-4">
            {reservationsParMatch.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg text-gray-900 dark:text-white mb-2">Aucune réservation trouvée</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {searchTerm ? 'Essayez avec d\'autres termes de recherche' : 'Les réservations apparaîtront ici'}
                </p>
              </div>
            ) : (
              reservationsParMatch.map(({ match, reservations, stats }) => (
                <div
                  key={match.id}
                  className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  {/* Match Header */}
                  <button
                    onClick={() => toggleMatchExpand(match.id)}
                    className="w-full p-4 sm:p-6 bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 dark:from-[#5a03cf]/20 dark:to-[#9cff02]/20 hover:from-[#5a03cf]/20 hover:to-[#9cff02]/20 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="text-4xl sm:text-5xl">{match.sport}</div>
                        <div className="flex-1 text-left">
                          <h3 className="text-lg sm:text-xl text-gray-900 dark:text-white mb-2">
                            {match.equipe1} vs {match.equipe2}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {match.date}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {match.heure}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {match.lieu}
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span className="px-2 py-0.5 bg-[#5a03cf]/20 text-[#5a03cf] dark:text-[#9cff02] rounded text-xs">
                              {match.competition}
                            </span>
                          </div>

                          {/* Stats du match */}
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span className="text-gray-700 dark:text-gray-300">
                                {stats.confirmees} confirmée{stats.confirmees > 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                              <span className="text-gray-700 dark:text-gray-300">
                                {stats.enAttente} en attente
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-[#5a03cf]" />
                              <span className="text-gray-700 dark:text-gray-300">
                                {stats.placesReservees}/{match.capacite} places ({getTauxRemplissage(stats.placesReservees, match.capacite).toFixed(0)}%)
                              </span>
                            </div>
                          </div>

                          {/* Barre de progression */}
                          <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#5a03cf] to-[#9cff02] transition-all duration-500"
                              style={{ width: `${getTauxRemplissage(stats.placesReservees, match.capacite)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <div className="text-2xl text-[#5a03cf] mb-1">{reservations.length}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">résa{reservations.length > 1 ? 's' : ''}</div>
                        </div>
                        {expandedMatches.includes(match.id) ? (
                          <ChevronUp className="w-6 h-6 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Reservations List */}
                  {expandedMatches.includes(match.id) && reservations.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-700">
                      {reservations.map((reservation, index) => (
                        <div
                          key={reservation.id}
                          className={`p-4 sm:p-6 ${
                            index !== reservations.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
                          } hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            {/* Client Info */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h4 className="text-base sm:text-lg text-gray-900 dark:text-white mb-1">
                                    {reservation.clientNom}
                                  </h4>
                                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="flex items-center gap-1">
                                      <Mail className="w-4 h-4" />
                                      {reservation.email}
                                    </span>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="flex items-center gap-1">
                                      <Phone className="w-4 h-4" />
                                      {reservation.telephone}
                                    </span>
                                  </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${getStatutColor(reservation.statut)}`}>
                                  {reservation.statut}
                                </span>
                              </div>

                              <div className="grid sm:grid-cols-2 gap-3 mb-3">
                                <div className="flex items-center gap-2 text-sm">
                                  <Users className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-900 dark:text-white">{reservation.nombrePlaces} places</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-600 dark:text-gray-400">
                                    Réservé le {reservation.dateReservation} à {reservation.heureReservation}
                                  </span>
                                </div>
                              </div>

                              {reservation.notes && (
                                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-3">
                                  <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="text-gray-500 dark:text-gray-400">Note:</span> {reservation.notes}
                                  </p>
                                </div>
                              )}

                              <div className="text-xs text-gray-500 dark:text-gray-500 font-mono">
                                QR: {reservation.qrCode}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex sm:flex-col gap-2">
                              <button
                                onClick={() => handleContactClient(reservation.email, reservation.telephone)}
                                className="flex-1 sm:flex-none px-4 py-2 bg-[#5a03cf] text-white rounded-lg hover:bg-[#4a02af] transition-all flex items-center justify-center gap-2 text-sm whitespace-nowrap"
                              >
                                <MessageCircle className="w-4 h-4" />
                                Contacter
                              </button>
                              
                              {reservation.statut === 'en attente' && (
                                <button
                                  onClick={() => handleConfirmReservation(reservation.id)}
                                  className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2 text-sm whitespace-nowrap"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Confirmer
                                </button>
                              )}
                              
                              {reservation.statut !== 'annulée' && (
                                <button
                                  onClick={() => handleCancelReservation(reservation.id)}
                                  className="flex-1 sm:flex-none px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2 text-sm whitespace-nowrap"
                                >
                                  <X className="w-4 h-4" />
                                  Annuler
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {expandedMatches.includes(match.id) && reservations.length === 0 && (
                    <div className="p-8 text-center border-t border-gray-200 dark:border-gray-700">
                      <p className="text-gray-500 dark:text-gray-400">Aucune réservation pour ce match</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : (
          // Vue liste complète
          <div className="space-y-3">
            {reservationsFiltrees.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-lg text-gray-900 dark:text-white mb-2">Aucune réservation trouvée</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {searchTerm ? 'Essayez avec d\'autres termes de recherche' : 'Les réservations apparaîtront ici'}
                </p>
              </div>
            ) : (
              reservationsFiltrees.map((reservation) => {
                const match = mockMatchesWithReservations.find(m => m.id === reservation.matchId);
                return (
                  <div
                    key={reservation.id}
                    className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#5a03cf]/30 hover:shadow-lg transition-all p-4 sm:p-6"
                  >
                    {/* Match Info Header */}
                    {match && (
                      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{match.sport}</span>
                          <div className="flex-1">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {match.equipe1} vs {match.equipe2}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <span>{match.date}</span>
                              <span>•</span>
                              <span>{match.heure}</span>
                              <span>•</span>
                              <span>{match.lieu}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      {/* Client Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-base sm:text-lg text-gray-900 dark:text-white mb-1">
                              {reservation.clientNom}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {reservation.email}
                              </span>
                              <span className="hidden sm:inline">•</span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {reservation.telephone}
                              </span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${getStatutColor(reservation.statut)}`}>
                            {reservation.statut}
                          </span>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3 mb-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900 dark:text-white">{reservation.nombrePlaces} places</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              Réservé le {reservation.dateReservation} à {reservation.heureReservation}
                            </span>
                          </div>
                        </div>

                        {reservation.notes && (
                          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-3">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              <span className="text-gray-500 dark:text-gray-400">Note:</span> {reservation.notes}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex sm:flex-col gap-2">
                        <button
                          onClick={() => handleContactClient(reservation.email, reservation.telephone)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-[#5a03cf] text-white rounded-lg hover:bg-[#4a02af] transition-all flex items-center justify-center gap-2 text-sm whitespace-nowrap"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Contacter
                        </button>
                        
                        {reservation.statut === 'en attente' && (
                          <button
                            onClick={() => handleConfirmReservation(reservation.id)}
                            className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2 text-sm whitespace-nowrap"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Confirmer
                          </button>
                        )}
                        
                        {reservation.statut !== 'annulée' && (
                          <button
                            onClick={() => handleCancelReservation(reservation.id)}
                            className="flex-1 sm:flex-none px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2 text-sm whitespace-nowrap"
                          >
                            <X className="w-4 h-4" />
                            Annuler
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Results Count */}
        {reservationsFiltrees.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            {reservationsFiltrees.length} réservation{reservationsFiltrees.length > 1 ? 's' : ''} affichée{reservationsFiltrees.length > 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}