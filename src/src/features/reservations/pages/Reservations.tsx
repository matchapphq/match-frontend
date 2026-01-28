import { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle, 
  MoreVertical,
  Phone,
  Mail,
  MessageSquare,
  X,
  TrendingUp,
  TrendingDown,
  Activity,
  UserCheck,
  UserX,
  Send,
  Smartphone,
  Layers,
  LayoutList,
  Download,
  Bell,
  CalendarClock,
  FileDown,
  History,
  FileText,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { PageType } from '../../../types';
import { useAuth } from '../../authentication/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../api/client';
import { useVenueReservations, useUpdateReservationStatus, useMarkNoShow } from '../../../hooks/api/useReservations';
import { format, parseISO, isWithinInterval, subDays, parse } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import type { ReminderTemplate, ReminderHistoryEntry } from '../../../data/mockData';

interface ReservationsProps {
  onNavigate: (page: PageType, matchId?: number | string, restaurantId?: number) => void;
  matchId?: string | number | null;
}

interface ContactModalProps {
  client: any;
  onClose: () => void;
}

interface ReminderModalProps {
  onClose: () => void;
  clients: any[];
  matchs: any[];
}

// Reminder Modal Component
function ReminderModal({ onClose, clients, matchs }: ReminderModalProps) {
  const [selectedMatch, setSelectedMatch] = useState<number | 'all'>('all');
  const [messageTemplate, setMessageTemplate] = useState('match-reminder');
  const [customMessage, setCustomMessage] = useState('');
  const [sendMethod, setSendMethod] = useState<'email' | 'sms' | 'whatsapp'>('email');

  // Filter clients by match and confirmed status
  const eligibleClients = clients.filter(c => {
    if (c.statut !== 'confirmé') return false;
    if (selectedMatch === 'all') return true;
    return c.matchId === selectedMatch;
  });

  // Get upcoming matches only
  const upcomingMatches = matchs?.filter(m => m.statut === 'à venir') || [];

  const messageTemplates = {
    'match-reminder': 'Bonjour {prenom}, rappel pour votre réservation de {personnes} place(s) pour le match {match} le {date} à {heure}. À bientôt !',
    'match-tomorrow': 'Bonjour {prenom}, votre match {match} a lieu demain à {heure}. Votre réservation de {personnes} place(s) est confirmée. À demain !',
    'thank-you': 'Bonjour {prenom}, merci pour votre réservation pour le match {match}. Nous vous attendons le {date} à {heure} !',
    'custom': customMessage
  };

  const getMessage = () => {
    return messageTemplates[messageTemplate as keyof typeof messageTemplates] || customMessage;
  };

  const handleSendReminders = () => {
    const message = getMessage();
    
    eligibleClients.forEach(client => {
      const match = matchs?.find(m => m.id === client.matchId);
      const finalMessage = message
        .replace('{prenom}', client.prenom || client.nom)
        .replace('{personnes}', client.personnes || '1')
        .replace('{match}', match ? `${match.equipe1} vs ${match.equipe2}` : client.match)
        .replace('{date}', match?.date || client.date)
        .replace('{heure}', match?.heure || '');

      const encodedMessage = encodeURIComponent(finalMessage);

      // Open contact method based on selection
      if (sendMethod === 'email' && client.email) {
        window.open(`mailto:${client.email}?subject=Rappel réservation&body=${encodedMessage}`, '_blank');
      } else if (sendMethod === 'sms' && client.telephone) {
        window.open(`sms:${client.telephone}?&body=${encodedMessage}`, '_blank');
      } else if (sendMethod === 'whatsapp' && client.telephone) {
        window.open(`https://wa.me/${client.telephone.replace(/[^0-9]/g, '')}?text=${encodedMessage}`, '_blank');
      }
    });

    alert(`${eligibleClients.length} rappel(s) envoyé(s) !`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Envoyer des rappels
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Rappeler vos clients de leurs réservations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Match Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sélectionner un match
          </label>
          <select
            value={selectedMatch}
            onChange={(e) => setSelectedMatch(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5a03cf]"
          >
            <option value="all">Tous les matchs à venir ({upcomingMatches.length})</option>
            {upcomingMatches.map((match) => (
              <option key={match.id} value={match.id}>
                {match.equipe1} vs {match.equipe2} - {match.date}
              </option>
            ))}
          </select>
        </div>

        {/* Send Method */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Méthode d'envoi
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setSendMethod('email')}
              className={`p-4 rounded-xl border-2 transition-all ${
                sendMethod === 'email'
                  ? 'border-[#5a03cf] bg-[#5a03cf]/5'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <Mail className={`w-6 h-6 mx-auto mb-2 ${sendMethod === 'email' ? 'text-[#5a03cf]' : 'text-gray-400'}`} />
              <div className="text-sm font-medium text-gray-900 dark:text-white">Email</div>
            </button>
            <button
              onClick={() => setSendMethod('sms')}
              className={`p-4 rounded-xl border-2 transition-all ${
                sendMethod === 'sms'
                  ? 'border-[#5a03cf] bg-[#5a03cf]/5'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <MessageSquare className={`w-6 h-6 mx-auto mb-2 ${sendMethod === 'sms' ? 'text-[#5a03cf]' : 'text-gray-400'}`} />
              <div className="text-sm font-medium text-gray-900 dark:text-white">SMS</div>
            </button>
            <button
              onClick={() => setSendMethod('whatsapp')}
              className={`p-4 rounded-xl border-2 transition-all ${
                sendMethod === 'whatsapp'
                  ? 'border-[#5a03cf] bg-[#5a03cf]/5'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <Smartphone className={`w-6 h-6 mx-auto mb-2 ${sendMethod === 'whatsapp' ? 'text-[#5a03cf]' : 'text-gray-400'}`} />
              <div className="text-sm font-medium text-gray-900 dark:text-white">WhatsApp</div>
            </button>
          </div>
        </div>

        {/* Message Template */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Template de message
          </label>
          <select
            value={messageTemplate}
            onChange={(e) => setMessageTemplate(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5a03cf] mb-3"
          >
            <option value="match-reminder">Rappel standard</option>
            <option value="match-tomorrow">Match demain</option>
            <option value="thank-you">Remerciement</option>
            <option value="custom">Message personnalisé</option>
          </select>

          {messageTemplate === 'custom' ? (
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Écrivez votre message personnalisé... Variables: {prenom}, {personnes}, {match}, {date}, {heure}"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5a03cf] resize-none h-32"
            />
          ) : (
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                {getMessage()}
              </p>
            </div>
          )}
        </div>

        {/* Recipients Count */}
        <div className="mb-6 p-4 bg-gradient-to-r from-[#5a03cf]/5 to-[#9cff02]/5 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-[#5a03cf]" />
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {eligibleClients.length} destinataire(s)
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Seuls les clients avec réservations confirmées
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSendReminders}
            disabled={eligibleClients.length === 0}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] hover:from-[#6a13df] hover:to-[#8a33ff] text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            Envoyer les rappels
          </button>
        </div>
      </div>
    </div>
  );
}

function ContactModal({ client, onClose }: ContactModalProps) {
  const [message, setMessage] = useState(`Bonjour ${client.prenom || client.nom}, concernant votre réservation pour le match...`);

  const encodedMessage = encodeURIComponent(message);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Contacter {client.nom}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Choisissez un moyen de contact
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Message Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Message (optionnel)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5a03cf] resize-none h-24"
            placeholder="Écrivez votre message ici..."
          />
        </div>

        {/* Contact Options */}
        <div className="space-y-3">
          {/* Téléphone */}
          {client.telephone && (
            <a
              href={`tel:${client.telephone}`}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#5a03cf]/5 to-[#9cff02]/5 hover:from-[#5a03cf]/10 hover:to-[#9cff02]/10 rounded-xl border border-gray-200 dark:border-gray-700 transition-all group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-white">Appeler</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{client.telephone}</div>
              </div>
              <Send className="w-5 h-5 text-gray-400 group-hover:text-[#5a03cf] transition-colors" />
            </a>
          )}

          {/* Email */}
          {client.email && (
            <a
              href={`mailto:${client.email}?subject=Réservation Match&body=${encodedMessage}`}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#5a03cf]/5 to-[#9cff02]/5 hover:from-[#5a03cf]/10 hover:to-[#9cff02]/10 rounded-xl border border-gray-200 dark:border-gray-700 transition-all group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-white">Email</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{client.email}</div>
              </div>
              <Send className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </a>
          )}

          {/* SMS */}
          {client.telephone && (
            <a
              href={`sms:${client.telephone}?&body=${encodedMessage}`}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#5a03cf]/5 to-[#9cff02]/5 hover:from-[#5a03cf]/10 hover:to-[#9cff02]/10 rounded-xl border border-gray-200 dark:border-gray-700 transition-all group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-white">SMS</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Envoyer un message</div>
              </div>
              <Send className="w-5 h-5 text-gray-400 group-hover:text-green-500 transition-colors" />
            </a>
          )}

          {/* WhatsApp */}
          {client.telephone && (
            <a
              href={`https://wa.me/${client.telephone.replace(/[^0-9]/g, '')}?text=${encodedMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#5a03cf]/5 to-[#9cff02]/5 hover:from-[#5a03cf]/10 hover:to-[#9cff02]/10 rounded-xl border border-gray-200 dark:border-gray-700 transition-all group"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-full flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-white">WhatsApp</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Ouvrir la conversation</div>
              </div>
              <Send className="w-5 h-5 text-gray-400 group-hover:text-[#25D366] transition-colors" />
            </a>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

export function Reservations({ onNavigate, matchId }: ReservationsProps) {
  const { currentUser } = useAuth();
  
  // Fetch user's venues first
  const { data: venuesData } = useQuery({
    queryKey: ['partner-venues'],
    queryFn: async () => {
      const response = await apiClient.get('/partners/venues');
      return response.data.venues || [];
    },
  });
  
  const venues = venuesData || [];
  const selectedVenueId = venues.length > 0 ? String(venues[0].id) : null;
  
  // Fetch reservations for the selected venue
  const { data: reservationsData, isLoading: reservationsLoading } = useVenueReservations(selectedVenueId);
  
  // Fetch matches for the venue (uses /partners/venues/matches for all venue matches)
  const { data: matchesData } = useQuery({
    queryKey: ['partner-matches'],
    queryFn: async () => {
      const response = await apiClient.get('/partners/venues/matches');
      return response.data.matches || response.data || [];
    },
  });
  
  // Mutation hooks
  const updateStatusMutation = useUpdateReservationStatus();
  const markNoShowMutation = useMarkNoShow();
  
  // Transform API data to match expected format
  const clients = useMemo(() => {
    // Handle various API response formats
    let reservations: any[] = [];
    if (Array.isArray(reservationsData)) {
      reservations = reservationsData;
    } else if (reservationsData?.reservations) {
      reservations = reservationsData.reservations;
    } else if (reservationsData?.data) {
      reservations = reservationsData.data;
    }
    
    console.log('[DEBUG] reservationsData:', reservationsData);
    console.log('[DEBUG] parsed reservations:', reservations);
    
    return reservations.map((r: any) => {
      let dateStr = '';
      let createdAtStr = '';
      let matchDateStr = '';
      
      try {
        if (r.created_at) {
          const date = new Date(r.created_at);
          if (!isNaN(date.getTime())) {
            dateStr = format(date, 'dd/MM/yyyy', { locale: fr });
            createdAtStr = format(date, 'dd/MM/yyyy HH:mm', { locale: fr });
          }
        }
      } catch (e) {
        console.warn('Error parsing reservation date:', e);
      }
      
      // Handle both camelCase (venueMatch) and snake_case (venue_match) from API
      const venueMatch = r.venueMatch || r.venue_match;
      const match = venueMatch?.match;
      
      // Get match date/time
      try {
        const scheduledAt = match?.scheduled_at || match?.scheduledAt;
        if (scheduledAt) {
          const matchDate = new Date(scheduledAt);
          if (!isNaN(matchDate.getTime())) {
            matchDateStr = format(matchDate, 'dd/MM/yyyy à HH:mm', { locale: fr });
          }
        }
      } catch (e) {
        console.warn('Error parsing match date:', e);
      }
      
      // Get team names - API uses homeTeam/awayTeam (camelCase)
      const homeTeam = match?.homeTeam?.name || match?.home_team?.name || 'Équipe A';
      const awayTeam = match?.awayTeam?.name || match?.away_team?.name || 'Équipe B';
      
      return {
        id: r.id,
        nom: r.user?.last_name || 'Client',
        prenom: r.user?.first_name || '',
        email: r.user?.email || '',
        telephone: r.user?.phone || '',
        personnes: r.party_size || r.quantity || 1,
        matchId: match?.id || venueMatch?.match_id || r.venue_match_id,
        match: match ? `${homeTeam} vs ${awayTeam}` : 'Match',
        matchDate: matchDateStr,
        date: dateStr,
        createdAt: createdAtStr,
        statut: r.status === 'pending' ? 'en attente' : 
                r.status === 'confirmed' ? 'confirmé' : 
                r.status === 'declined' ? 'refusé' : 
                r.status === 'checked_in' ? 'confirmé' :
                r.status === 'no_show' ? 'refusé' : r.status,
        restaurant: venues.find((v: any) => String(v.id) === selectedVenueId)?.name || '',
      };
    });
  }, [reservationsData, venues, selectedVenueId]);
  
  // Sport emoji mapping based on league name
  const getSportEmoji = (league: string): string => {
    const leagueLower = (league || '').toLowerCase();
    if (leagueLower.includes('nfl') || leagueLower.includes('american football')) return '🏈';
    if (leagueLower.includes('nba') || leagueLower.includes('basketball')) return '🏀';
    if (leagueLower.includes('nhl') || leagueLower.includes('hockey')) return '🏒';
    if (leagueLower.includes('mlb') || leagueLower.includes('baseball')) return '⚾';
    if (leagueLower.includes('tennis') || leagueLower.includes('atp') || leagueLower.includes('wta')) return '🎾';
    if (leagueLower.includes('golf') || leagueLower.includes('pga')) return '⛳';
    if (leagueLower.includes('rugby')) return '🏉';
    if (leagueLower.includes('cricket')) return '🏏';
    if (leagueLower.includes('f1') || leagueLower.includes('formula')) return '🏎️';
    if (leagueLower.includes('mma') || leagueLower.includes('ufc')) return '🥊';
    if (leagueLower.includes('boxing')) return '🥊';
    return '⚽';
  };
  
  // Transform matches data
  const matchs = useMemo(() => {
    // Handle various API response formats
    let matches: any[] = [];
    if (Array.isArray(matchesData)) {
      matches = matchesData;
    } else if (matchesData?.matches && Array.isArray(matchesData.matches)) {
      matches = matchesData.matches;
    } else if (matchesData?.data && Array.isArray(matchesData.data)) {
      matches = matchesData.data;
    }
    
    return matches.map((m: any) => {
      const match = m.match || m;
      let dateStr = '';
      let heureStr = '';
      let statut = 'à venir';
      
      try {
        // Use scheduled_at from the actual API response
        const startTime = match.scheduled_at || match.start_time || m.scheduled_at;
        if (startTime) {
          const date = new Date(startTime);
          if (!isNaN(date.getTime())) {
            dateStr = format(date, 'dd/MM/yyyy', { locale: fr });
            heureStr = format(date, 'HH:mm', { locale: fr });
            statut = m.status === 'finished' ? 'passé' : (date > new Date() ? 'à venir' : 'passé');
          }
        }
      } catch (e) {
        console.warn('Error parsing match date:', e);
      }
      
      // Get team names - API uses homeTeam/awayTeam as strings
      const equipe1 = match.homeTeam || match.home_team?.name || match.home_team || 'Équipe A';
      const equipe2 = match.awayTeam || match.away_team?.name || match.away_team || 'Équipe B';
      const league = match.league || match.competition?.name || '';
      
      return {
        id: match.id || m.id,
        equipe1,
        equipe2,
        date: dateStr,
        heure: heureStr,
        competition: league || 'Compétition',
        sport: getSportEmoji(league),
        statut,
      };
    });
  }, [matchesData]);
  
  // Handle reservation actions
  const handleReservationAction = async (reservationId: string | number, action: string) => {
    const status = action === 'acceptée' ? 'confirmed' : action === 'refusée' ? 'declined' : action;
    try {
      await updateStatusMutation.mutateAsync({ 
        reservationId: String(reservationId), 
        status 
      });
      toast.success(action === 'acceptée' ? 'Réservation confirmée' : 'Réservation refusée');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };
  const [filter, setFilter] = useState<'tous' | 'en-attente' | 'confirmé' | 'refusé'>('tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMatchFilter, setSelectedMatchFilter] = useState<string | 'tous'>('tous');
  const [matchSearchQuery, setMatchSearchQuery] = useState('');
  const [contactClient, setContactClient] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grouped'>('list');
  const [showReminderModal, setShowReminderModal] = useState(false);
  
  // Separate filters for reservation date (when booked) vs match date (when game happens)
  const [reservationDateFilter, setReservationDateFilter] = useState<'all' | 'today' | '7days' | '30days' | 'custom'>('all');
  const [matchDateFilter, setMatchDateFilter] = useState<'all' | 'today' | '7days' | '30days' | 'custom'>('all');
  const [customReservationStartDate, setCustomReservationStartDate] = useState('');
  const [customReservationEndDate, setCustomReservationEndDate] = useState('');
  const [customMatchStartDate, setCustomMatchStartDate] = useState('');
  const [customMatchEndDate, setCustomMatchEndDate] = useState('');

  // Temporary aliases for backward compatibility with the existing UI
  const dateFilter = reservationDateFilter;
  const setDateFilter = setReservationDateFilter;
  const customStartDate = customReservationStartDate;
  const setCustomStartDate = setCustomReservationStartDate;
  const customEndDate = customReservationEndDate;
  const setCustomEndDate = setCustomReservationEndDate;

  const handleDateFilterChange = (newDateFilter: typeof dateFilter) => {
    setDateFilter(newDateFilter);
  };

  // Helper function to parse French date format (DD/MM/YYYY) or (DD/MM/YYYY HH:mm)
  const parseFrenchDate = (dateStr: string): Date | null => {
    try {
      const datePart = dateStr.split(' ')[0];
      if (!datePart) return null;
      const parts = datePart.split('/');
      if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }
      return null;
    } catch {
      return null;
    }
  };

  // Get filtered matches based on match search query AND match date filter
  const getFilteredMatches = () => {
    if (!matchs) return [];

    let filtered = [...matchs];

    // Filter by match date
    if (matchDateFilter !== 'all') {
      filtered = filtered.filter(match => {
        const matchDate = parseFrenchDate(match.date);
        if (!matchDate) return false;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (matchDateFilter) {
          case 'today':
            const todayEnd = new Date(today);
            todayEnd.setHours(23, 59, 59, 999);
            return matchDate >= today && matchDate <= todayEnd;
          case '7days':
            const sevenDaysAgo = subDays(today, 7);
            const sevenDaysAhead = new Date(today);
            sevenDaysAhead.setDate(today.getDate() + 7);
            return matchDate >= sevenDaysAgo && matchDate <= sevenDaysAhead;
          case '30days':
            const thirtyDaysAgo = subDays(today, 30);
            const thirtyDaysAhead = new Date(today);
            thirtyDaysAhead.setDate(today.getDate() + 30);
            return matchDate >= thirtyDaysAgo && matchDate <= thirtyDaysAhead;
          case 'custom':
            if (customMatchStartDate && customMatchEndDate) {
              const startDate = new Date(customMatchStartDate);
              const endDate = new Date(customMatchEndDate);
              endDate.setHours(23, 59, 59, 999);
              return matchDate >= startDate && matchDate <= endDate;
            }
            return true;
          default:
            return true;
        }
      });
    }

    // Filter by match search query
    if (matchSearchQuery) {
      const query = matchSearchQuery.toLowerCase();
      filtered = filtered.filter(match => 
        match.equipe1.toLowerCase().includes(query) ||
        match.equipe2.toLowerCase().includes(query) ||
        match.date.includes(query) ||
        (match.competition && match.competition.toLowerCase().includes(query))
      );
    }

    return filtered;
  };

  const filteredMatches = getFilteredMatches();

  // Reset match filter if selected match is not in filtered matches
  const handleMatchDateFilterChange = (newDateFilter: typeof matchDateFilter) => {
    setMatchDateFilter(newDateFilter);
    
    // Check if currently selected match is still valid
    if (selectedMatchFilter !== 'tous') {
      const filteredMatchIds = filteredMatches.map(m => m.id);
      if (!filteredMatchIds.includes(selectedMatchFilter as string)) {
        setSelectedMatchFilter('tous');
        toast.info('Le match sélectionné a été réinitialisé car il ne correspond plus aux critères');
      }
    }
  };

  // Export to CSV function
  const exportToCSV = () => {
    // CSV Headers
    const headers = ['ID', 'Nom', 'Prénom', 'Email', 'Téléphone', 'Personnes', 'Match', 'Date Match', 'Date Réservation', 'Restaurant', 'Statut'];
    
    // CSV Data
    const csvData = filteredReservations.map(client => {
      const clientMatch = matchs?.find(m => String(m.id) === String(client.matchId));
      return [
        client.id,
        client.nom,
        client.prenom || '',
        client.email || '',
        client.telephone || '',
        client.personnes || 1,
        clientMatch ? `${clientMatch.equipe1} vs ${clientMatch.equipe2}` : client.match,
        clientMatch?.date || client.date,
        client.createdAt || client.date,
        client.restaurant || '',
        client.statut || ''
      ];
    });

    // Build CSV content
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create Blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reservations_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Export de ${filteredReservations.length} réservation(s) terminé`);
  };

  // Debug: Log raw data to console
  console.log('[RESERVATION DEBUG] Raw reservationsData:', reservationsData);
  console.log('[RESERVATION DEBUG] Transformed clients:', clients);
  console.log('[RESERVATION DEBUG] matchId prop:', matchId, 'type:', typeof matchId);
  console.log('[RESERVATION DEBUG] selectedMatchFilter:', selectedMatchFilter);
  console.log('[RESERVATION DEBUG] filter state:', filter);
  
  // TEMPORARY: Skip filtering to debug - just use clients directly
  const filteredReservations = clients;

  // Group reservations by match
  const groupedReservations = filteredReservations.reduce((acc, client) => {
    const matchId = client.matchId || -1;
    if (!acc[matchId]) {
      acc[matchId] = [];
    }
    acc[matchId].push(client);
    return acc;
  }, {} as Record<number, typeof clients>);

  // Calculate stats
  const totalReservations = clients.length;
  const enAttenteCount = clients.filter(c => c.statut === 'en attente').length;
  const confirmeesCount = clients.filter(c => c.statut === 'confirmé').length;
  const refuseesCount = clients.filter(c => c.statut === 'refusé').length;
  const tauxAcceptation = (confirmeesCount + refuseesCount) > 0 ? Math.round((confirmeesCount / (confirmeesCount + refuseesCount)) * 100) : 0;
  const totalPersonnes = clients.reduce((acc, c) => acc + (c.personnes || 0), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmé':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'refusé':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      default:
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
    }
  };

  const renderReservationCard = (client: any) => {
    const clientMatch = matchs?.find(m => m.id === client.matchId);
    
    return (
      <div 
        key={client.id}
        className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Client Info */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-[#5a03cf]">
                {client.nom.charAt(0)}
              </span>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {client.nom}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(client.statut)}`}>
                  {client.statut}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{client.personnes || 1} pers.</span>
                </div>
                {client.telephone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4" />
                    <span>{client.telephone}</span>
                  </div>
                )}
                {client.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    <span className="truncate max-w-[200px]">{client.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Match Info - Show only in list view or if grouping failed */}
          {viewMode === 'list' && (
            <div className="flex-1 lg:text-center lg:border-l lg:border-r border-gray-100 dark:border-gray-700 lg:px-6">
              {clientMatch ? (
                <>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {clientMatch.equipe1} vs {clientMatch.equipe2}
                  </div>
                  <div className="flex items-center lg:justify-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{clientMatch.date} à {clientMatch.heure}</span>
                  </div>
                  <div className="flex items-center lg:justify-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                      {clientMatch.competition}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    Match #{client.matchId}
                  </div>
                  <div className="flex items-center lg:justify-center gap-1.5 text-xs text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Informations du match</span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 lg:w-auto w-full">
            {client.statut === 'en attente' ? (
              <>
                <button 
                  onClick={() => handleReservationAction(client.id, 'acceptée')}
                  className="flex-1 lg:flex-none px-4 py-2 bg-[#9cff02] hover:bg-[#8be600] text-[#5a03cf] font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Accepter</span>
                </button>
                <button 
                  onClick={() => handleReservationAction(client.id, 'refusée')}
                  className="flex-1 lg:flex-none px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Refuser</span>
                </button>
              </>
            ) : (
              <button 
                onClick={() => setContactClient(client)}
                className="flex-1 lg:flex-none px-4 py-2 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] hover:from-[#6a13df] hover:to-[#8a33ff] text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contacter</span>
              </button>
            )}
            
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 pb-24 lg:pb-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Réservations
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Gérez les demandes de réservation pour vos matchs
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher un client..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5a03cf] w-full md:w-64"
            />
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Total Réservations */}
        <div className="bg-gradient-to-br from-[#5a03cf]/10 to-[#9cff02]/10 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-[#5a03cf]" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Total</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalReservations}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Réservations</p>
        </div>

        {/* En attente */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-900/20 dark:to-yellow-800/10 rounded-2xl p-4 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">En attente</span>
          </div>
          <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{enAttenteCount}</div>
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">À traiter</p>
        </div>

        {/* Confirmées */}
        <div className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10 rounded-2xl p-4 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-xs font-medium text-green-600 dark:text-green-400">Confirmées</span>
          </div>
          <div className="text-2xl font-bold text-green-700 dark:text-green-300">{confirmeesCount}</div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">Validées</p>
        </div>

        {/* Refusées */}
        <div className="bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10 rounded-2xl p-4 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 mb-2">
            <UserX className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-xs font-medium text-red-600 dark:text-red-400">Refusées</span>
          </div>
          <div className="text-2xl font-bold text-red-700 dark:text-red-300">{refuseesCount}</div>
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">Déclinées</p>
        </div>

        {/* Taux d'acceptation */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-2xl p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Taux</span>
          </div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{tauxAcceptation}%</div>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Acceptation</p>
        </div>

        {/* Total personnes */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 rounded-2xl p-4 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Personnes</span>
          </div>
          <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{totalPersonnes}</div>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Total places</p>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
          {/* Filters Section */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Date Filters */}
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <CalendarClock className="w-4 h-4" />
              <span>Période:</span>
            </div>
            <select
              value={dateFilter}
              onChange={(e) => handleDateFilterChange(e.target.value as any)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5a03cf]"
            >
              <option value="all">Toutes les dates</option>
              <option value="today">Aujourd'hui</option>
              <option value="7days">7 derniers jours</option>
              <option value="30days">30 derniers jours</option>
              <option value="custom">Période personnalisée</option>
            </select>

            {/* Custom Date Range */}
            {dateFilter === 'custom' && (
              <>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5a03cf]"
                  placeholder="Date début"
                />
                <span className="text-gray-400">→</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5a03cf]"
                  placeholder="Date fin"
                />
              </>
            )}

            {/* Match Filter */}
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 ml-4">
              <Filter className="w-4 h-4" />
              <span>Match:</span>
            </div>
            
            {/* Match Search */}
            {matchs && matchs.length > 5 && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un match..."
                  value={matchSearchQuery}
                  onChange={(e) => setMatchSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5a03cf] w-48"
                />
              </div>
            )}
            
            <select
              value={selectedMatchFilter}
              onChange={(e) => setSelectedMatchFilter(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5a03cf]"
            >
              <option value="tous">Tous les matchs ({filteredMatches.length})</option>
              {filteredMatches.map((match) => (
                <option key={match.id} value={match.id}>
                  {match.equipe1} vs {match.equipe2} - {match.date}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 ml-4">
              <Layers className="w-4 h-4" />
              <span>Statut:</span>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5a03cf]"
            >
              <option value="tous">Tous les statuts</option>
              <option value="en-attente">En attente</option>
              <option value="confirmé">Confirmé</option>
              <option value="refusé">Refusé</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Export CSV */}
            <button
              onClick={exportToCSV}
              disabled={filteredReservations.length === 0}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
              title="Exporter en CSV"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exporter CSV</span>
            </button>

            {/* Send Reminders */}
            <button
              onClick={() => setShowReminderModal(true)}
              disabled={confirmeesCount === 0}
              className="px-4 py-2 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] hover:from-[#6a13df] hover:to-[#8a33ff] text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
              title="Envoyer des rappels"
            >
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Rappels</span>
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">{filteredReservations.length}</span> réservation(s) affichée(s)
            {(dateFilter !== 'all' || selectedMatchFilter !== 'tous' || filter !== 'tous') && (
              <span className="ml-2 text-xs">
                · Filtré(s) par {[
                  dateFilter !== 'all' && 'période',
                  selectedMatchFilter !== 'tous' && 'match',
                  filter !== 'tous' && 'statut'
                ].filter(Boolean).join(', ')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Reservations List / Groups */}
      <div className="space-y-6">
        {filteredReservations.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 border-dashed">
            <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Aucune réservation</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Aucune réservation ne correspond à vos critères
            </p>
          </div>
        ) : (
          viewMode === 'list' ? (
            // List View
            <div className="space-y-4">
              {filteredReservations.map(renderReservationCard)}
            </div>
          ) : (
            // Grouped View
            <div className="space-y-8">
              {Object.entries(groupedReservations).map(([matchIdStr, matchReservations]) => {
                const id = Number(matchIdStr);
                const match = matchs?.find(m => m.id === id);
                
                return (
                  <div key={id} className="space-y-4">
                    {/* Group Header */}
                    <div className="flex items-center gap-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#5a03cf] to-[#7a23ef] flex items-center justify-center text-2xl shadow-lg shadow-[#5a03cf]/20">
                        {match ? match.sport : <Calendar className="w-6 h-6 text-white" />}
                      </div>
                      <div className="flex-1">
                        {match ? (
                          <>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                              {match.equipe1} <span className="text-gray-400 text-sm font-normal">vs</span> {match.equipe2}
                            </h2>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {match.date}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {match.heure}
                              </span>
                              <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-xs">
                                {match.competition}
                              </span>
                            </div>
                          </>
                        ) : (
                          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                            Match inconnu (#{id})
                          </h2>
                        )}
                      </div>
                      <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300">
                        {matchReservations.length} rés.
                      </div>
                    </div>

                    {/* Group Reservations */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      {matchReservations.map(renderReservationCard)}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* Contact Modal */}
      {contactClient && (
        <ContactModal 
          client={contactClient} 
          onClose={() => setContactClient(null)} 
        />
      )}

      {/* Reminder Modal */}
      {showReminderModal && (
        <ReminderModal 
          onClose={() => setShowReminderModal(false)} 
          clients={clients} 
          matchs={matchs} 
        />
      )}
    </div>
  );
}