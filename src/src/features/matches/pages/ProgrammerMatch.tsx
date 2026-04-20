import { ArrowLeft, Calendar, ChevronRight, MapPin, Check, Search, Trophy, Clock, Users, Loader2, AlertTriangle, CreditCard } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../api/client';
import { useSports, useUpcomingMatches, useScheduleMatch } from '../../../hooks/api/useMatches';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as DatePickerCalendar } from '../../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../../components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';

interface ProgrammerMatchProps {
  onBack: () => void;
}

interface Sport {
  id: string;
  name: string;
  emoji: string;
}

interface Match {
  id: string;
  sport: string;
  team1: string;
  team2: string;
  league: string;
  date: string;
  time: string;
  venue?: string;
  startTime?: string;
};

interface QuickDateOption {
  value: string;
  title: string;
  subtitle: string;
  badge?: string;
}

export function ProgrammerMatch({ onBack }: ProgrammerMatchProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<'sport' | 'date' | 'search' | 'configure'>('sport');
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedVenueId, setSelectedVenueId] = useState<string>('');
  const [placesDisponibles, setPlacesDisponibles] = useState(30);
  const [isInactiveVenueModalOpen, setIsInactiveVenueModalOpen] = useState(false);
  const maxPlaces = 50;

  useEffect(() => {
    const shouldLockScroll = isDatePickerOpen || isInactiveVenueModalOpen;
    if (!shouldLockScroll) return;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [isDatePickerOpen, isInactiveVenueModalOpen]);

  const isInactiveVenueError = (error: unknown): boolean => {
    const rawMessage = error instanceof Error ? error.message : '';
    if (!rawMessage) return false;

    const normalized = rawMessage.toUpperCase();
    return (
      normalized.includes('VENUE_INACTIVE_PAYMENT_REQUIRED') ||
      normalized.includes('VENUE IS INACTIVE UNTIL A VALID PAYMENT METHOD IS CONFIGURED')
    );
  };

  const handleOpenPaymentRequired = () => {
    const params = new URLSearchParams();
    if (selectedVenueId) {
      params.set('venue', selectedVenueId);
    }
    params.set('from', 'billing');
    navigate(`/onboarding/payment-required?${params.toString()}`);
  };
  
  // Sport name to emoji mapping
  const getSportEmojiByName = (name: string): string => {
    const nameLower = (name || '').toLowerCase();
    if (nameLower.includes('football') && !nameLower.includes('american')) return '⚽';
    if (nameLower.includes('american football')) return '🏈';
    if (nameLower.includes('basketball')) return '🏀';
    if (nameLower.includes('hockey') || nameLower.includes('ice hockey')) return '🏒';
    if (nameLower.includes('baseball')) return '⚾';
    if (nameLower.includes('tennis')) return '🎾';
    if (nameLower.includes('golf')) return '⛳';
    if (nameLower.includes('rugby')) return '🏉';
    if (nameLower.includes('cricket')) return '🏏';
    if (nameLower.includes('formula') || nameLower.includes('f1')) return '🏎️';
    if (nameLower.includes('mma') || nameLower.includes('martial')) return '🥋';
    if (nameLower.includes('boxing')) return '🥊';
    if (nameLower.includes('soccer')) return '⚽';
    return '⚽';
  };
  
  // Fetch sports from API
  const { data: sportsData } = useSports();
  const SPORTS: Sport[] = useMemo(() => {
    let sports: any[] = [];
    if (Array.isArray(sportsData)) {
      sports = sportsData;
    } else if (sportsData?.sports) {
      sports = sportsData.sports;
    } else if (sportsData?.data) {
      sports = sportsData.data;
    }
    return sports.map((s: any) => ({
      id: s.id,
      name: s.name,
      emoji: getSportEmojiByName(s.name),
    }));
  }, [sportsData]);
  
  // Fetch upcoming matches from API
  const { data: upcomingData, isLoading: matchesLoading } = useUpcomingMatches({
    sport_id: selectedSport || undefined,
    date: selectedDate || undefined,
    search: searchQuery || undefined,
  });
  
  // Transform upcoming matches
  const availableMatches: Match[] = useMemo(() => {
    let matches: any[] = [];
    if (Array.isArray(upcomingData)) {
      matches = upcomingData;
    } else if (upcomingData?.matches) {
      matches = upcomingData.matches;
    } else if (upcomingData?.data) {
      matches = upcomingData.data;
    }
    
    return matches.map((m: any) => {
      let dateStr = '';
      let timeStr = '';
      try {
        if (m.start_time) {
          const date = new Date(m.start_time);
          if (!isNaN(date.getTime())) {
            dateStr = format(date, 'yyyy-MM-dd');
            timeStr = format(date, 'HH:mm');
          }
        }
      } catch (e) {
        console.warn('Error parsing date:', e);
      }
      
      return {
        id: m.id,
        sport: m.sport?.id || selectedSport || '',
        team1: m.home_team?.name || 'Équipe A',
        team2: m.away_team?.name || 'Équipe B',
        league: m.competition?.name || 'Compétition',
        date: dateStr,
        time: timeStr,
        venue: m.venue?.name,
        startTime: m.start_time,
      };
    });
  }, [upcomingData, selectedSport]);
  
  // Fetch user's venues
  const { data: venuesData } = useQuery({
    queryKey: ['partner-venues'],
    queryFn: async () => {
      const response = await apiClient.get('/partners/venues');
      return response.data.venues || [];
    },
  });
  
  const restaurants = useMemo(() => {
    const venues = venuesData || [];
    return venues.map((v: any) => ({ id: String(v.id), nom: v.name }));
  }, [venuesData]);
  
  // Schedule match mutation
  const scheduleMatchMutation = useScheduleMatch();

  const handleSportSelect = (sportId: string) => {
    setSelectedSport(sportId);
    setStep('date');
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setStep('search');
  };

  const quickDateOptions = useMemo<QuickDateOption[]>(() => {
    const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

    return Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + index);

      const value = format(date, 'yyyy-MM-dd');
      const title =
        index === 0
          ? 'Aujourd’hui'
          : index === 1
            ? 'Demain'
            : capitalize(format(date, 'EEEE', { locale: fr }));
      const subtitle = format(date, 'd MMMM', { locale: fr });

      return {
        value,
        title,
        subtitle,
        badge: index === 0 ? 'Rapide' : undefined,
      };
    });
  }, []);

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const calendarRange = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();

    return {
      fromMonth: new Date(year, now.getMonth(), 1),
      toMonth: new Date(year, 11, 1),
      endOfYear: new Date(year, 11, 31),
    };
  }, []);

  const selectedDateObject = useMemo(() => {
    if (!selectedDate) return undefined;

    const [year, month, day] = selectedDate.split('-').map(Number);
    if (!year || !month || !day) return undefined;

    const parsed = new Date(year, month - 1, day);
    if (Number.isNaN(parsed.getTime())) return undefined;
    return parsed;
  }, [selectedDate]);

  const matchesCountByDate = useMemo<Record<string, number>>(() => {
    let rawMatches: any[] = [];
    if (Array.isArray(upcomingData)) {
      rawMatches = upcomingData;
    } else if (upcomingData?.matches) {
      rawMatches = upcomingData.matches;
    } else if (upcomingData?.data) {
      rawMatches = upcomingData.data;
    }

    return rawMatches.reduce((acc, match) => {
      const startTime = typeof match?.start_time === 'string' ? match.start_time : '';
      const dateKey = startTime.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
      if (!dateKey) return acc;
      acc[dateKey] = (acc[dateKey] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [upcomingData]);

  // Filter matches based on search (API already filters by sport and date)
  const filteredMatches = availableMatches.filter(
    (match) =>
      searchQuery === '' ||
      match.team1.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.team2.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.league.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMatchSelect = (match: Match) => {
    setSelectedMatch(match);
    setStep('configure');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMatch || !selectedVenueId) {
      toast.error('Veuillez sélectionner un établissement');
      return;
    }
    
    try {
      await scheduleMatchMutation.mutateAsync({
        venueId: selectedVenueId,
        matchId: selectedMatch.id,
        capacity: placesDisponibles,
      });
      toast.success('Match programmé avec succès !');
      onBack();
    } catch (error: any) {
      if (isInactiveVenueError(error)) {
        setIsInactiveVenueModalOpen(true);
        return;
      }
      toast.error(error.message || 'Erreur lors de la programmation du match');
    }
  };

  const handleBackToSport = () => {
    setStep('sport');
    setSelectedSport(null);
    setSelectedDate(null);
    setSearchQuery('');
    setSelectedMatch(null);
    setIsDatePickerOpen(false);
  };

  const handleBackToDate = () => {
    setStep('date');
    setSelectedDate(null);
    setSearchQuery('');
    setSelectedMatch(null);
    setIsDatePickerOpen(false);
  };

  const handleBackToSearch = () => {
    setStep('search');
    setSelectedMatch(null);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={step === 'sport' ? onBack : step === 'date' ? handleBackToSport : step === 'search' ? handleBackToDate : handleBackToSearch}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#5a03cf] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              {step === 'sport' ? 'Retour' : step === 'date' ? 'Changer de sport' : step === 'search' ? 'Changer de date' : 'Retour à la recherche'}
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#9cff02] rounded-full animate-pulse" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {step === 'sport' ? 'Sélection du sport' : step === 'date' ? 'Sélection de la date' : step === 'search' ? 'Recherche de match' : 'Configuration'}
              </span>
            </div>
            
            <div className="w-32"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Étape 1 : Sélection du sport */}
        {step === 'sport' && (
          <div>
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-4">
                Programmer un{' '}
                <span className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
                  match
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Commencez par sélectionner le sport
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {SPORTS.map((sport) => (
                <button
                  key={sport.id}
                  onClick={() => handleSportSelect(sport.id)}
                  className="group relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 hover:border-[#5a03cf]/50 transition-all duration-300 hover:scale-105"
                >
                  <div className="text-center">
                    <div className="text-5xl mb-4">{sport.emoji}</div>
                    <h3 className="text-lg text-gray-900 dark:text-white">
                      {sport.name}
                    </h3>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#5a03cf]/0 to-[#9cff02]/0 group-hover:from-[#5a03cf]/5 group-hover:to-[#9cff02]/5 rounded-2xl transition-all duration-300" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Étape 2 : Sélection de la date */}
        {step === 'date' && (
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-full mb-6">
                <span className="text-3xl">
                  {SPORTS.find((s) => s.id === selectedSport)?.emoji}
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {SPORTS.find((s) => s.id === selectedSport)?.name}
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl mb-4">
                Sélectionner une{' '}
                <span className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
                  date
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Choisissez rapidement une date, ou sélectionnez une date précise
              </p>

              <div className="max-w-4xl mx-auto mb-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {quickDateOptions.map((option) => {
                    const matchCount = matchesCountByDate[option.value] || 0;
                    const countLabel = `${matchCount} match${matchCount > 1 ? 's' : ''} disponible${matchCount > 1 ? 's' : ''} ce jour`;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleDateSelect(option.value)}
                        className="group text-left bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/60 dark:border-gray-700/60 hover:border-[#5a03cf]/60 hover:shadow-lg hover:shadow-[#5a03cf]/10 transition-all duration-200"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <span className="text-lg text-gray-900 dark:text-white">{option.title}</span>
                          {option.badge && (
                            <span className="text-[11px] px-2 py-1 rounded-full bg-[#9cff02]/20 text-[#3f2c00] dark:text-[#d8ff7a] border border-[#9cff02]/30">
                              {option.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{option.subtitle}</p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          ({matchesLoading ? 'Chargement des matchs...' : countLabel})
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="mx-auto w-full max-w-lg bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-5 border border-gray-200/50 dark:border-gray-700/50">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Ou choisir une date précise</p>
                  <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="group w-full flex items-center justify-between gap-4 rounded-xl border border-gray-200/60 dark:border-gray-700/60 bg-white/80 dark:bg-gray-800/80 px-4 py-4 text-left hover:border-[#5a03cf]/50 hover:shadow-md hover:shadow-[#5a03cf]/10 transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#5a03cf]/10 text-[#5a03cf] dark:bg-[#5a03cf]/20 dark:text-[#caa8ff]">
                            <Calendar className="w-5 h-5" />
                          </span>
                          <div>
                            <p className="text-sm text-gray-900 dark:text-white">Ouvrir le calendrier</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {selectedDateObject
                                ? format(selectedDateObject, 'EEEE d MMMM', { locale: fr })
                                : 'Sélection simple en un clic'}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#5a03cf] transition-colors" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      side="bottom"
                      sideOffset={10}
                      className="w-[320px] max-w-[calc(100vw-1rem)] sm:w-[340px] rounded-2xl border border-gray-200 bg-white p-3 shadow-2xl text-left dark:border-gray-800 dark:bg-gray-900"
                    >
                      <p className="px-2 pb-2 text-xs text-gray-600 dark:text-gray-400">
                        Choisir une date
                      </p>
                      <DatePickerCalendar
                        mode="single"
                        locale={fr}
                        weekStartsOn={1}
                        fixedWeeks
                        fromMonth={calendarRange.fromMonth}
                        toMonth={calendarRange.toMonth}
                        selected={selectedDateObject}
                        disabled={[{ before: today }, { after: calendarRange.endOfYear }]}
                        onSelect={(date) => {
                          if (!date) return;
                          const normalized = new Date(date);
                          normalized.setHours(0, 0, 0, 0);
                          handleDateSelect(format(normalized, 'yyyy-MM-dd'));
                          setIsDatePickerOpen(false);
                        }}
                        className="w-full p-1"
                        classNames={{
                          month: 'w-full flex flex-col gap-3',
                          table: 'w-full border-collapse',
                          head_row: 'flex w-full justify-between',
                          head_cell: 'inline-flex h-8 w-8 items-center justify-center text-center text-sm font-semibold text-gray-600 dark:text-gray-300',
                          row: 'mt-2 flex w-full justify-between',
                          day: 'inline-flex h-8 w-8 items-center justify-center rounded-md p-0 text-base font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 [&.day-disabled]:text-gray-500/70 dark:[&.day-disabled]:text-gray-500/70 [&.day-disabled]:opacity-60 [&.day-outside]:!text-gray-200 dark:[&.day-outside]:!text-gray-300 [&.day-outside]:!font-normal [&.day-outside]:opacity-30 [&.day-outside]:hover:bg-transparent dark:[&.day-outside]:hover:bg-transparent',
                          caption: 'relative flex items-center justify-center pt-1',
                          nav: 'absolute inset-y-0 left-0 right-0 flex items-center justify-between',
                          caption_label: 'text-sm text-gray-900 dark:text-white',
                          nav_button: 'pointer-events-auto inline-flex h-8 w-8 items-center justify-center border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 hover:bg-white dark:hover:bg-gray-800 opacity-100 rounded-md p-0 disabled:opacity-0 disabled:pointer-events-none',
                          nav_button_previous: 'ml-1',
                          nav_button_next: 'mr-1',
                          day_selected: 'bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white hover:from-[#5a03cf] hover:to-[#7a23ef] focus:from-[#5a03cf] focus:to-[#7a23ef]',
                          day_today: 'border border-[#5a03cf]/40 text-[#5a03cf] dark:text-[#caa8ff] bg-transparent',
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    Les dates passées sont automatiquement bloquées.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Étape 3 : Recherche de match */}
        {step === 'search' && (
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-full mb-6">
                <span className="text-3xl">
                  {SPORTS.find((s) => s.id === selectedSport)?.emoji}
                </span>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {SPORTS.find((s) => s.id === selectedSport)?.name}
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl mb-4">
                Rechercher un{' '}
                <span className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
                  match
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Trouvez le match que vous souhaitez diffuser
              </p>

              {/* Barre de recherche */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par équipe ou compétition..."
                    className="w-full pl-12 pr-4 py-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl focus:outline-none focus:border-[#5a03cf]/50 text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Résultats de recherche */}
            <div className="max-w-4xl mx-auto space-y-4">
              {filteredMatches.length === 0 ? (
                <div className="text-center py-12 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
                  <p className="text-gray-500 dark:text-gray-400">
                    Aucun match trouvé. Essayez une autre recherche.
                  </p>
                </div>
              ) : (
                filteredMatches.map((match) => (
                  <button
                    key={match.id}
                    onClick={() => handleMatchSelect(match)}
                    className="w-full text-left bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:border-[#5a03cf]/50 transition-all duration-300 hover:scale-[1.01]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* Équipes */}
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xl text-gray-900 dark:text-white">
                            {match.team1}
                          </span>
                          <span className="text-gray-400">vs</span>
                          <span className="text-xl text-gray-900 dark:text-white">
                            {match.team2}
                          </span>
                        </div>
                        
                        {/* Info complémentaires */}
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                            <Trophy className="w-4 h-4" />
                            <span>{match.league}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(match.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{match.time}</span>
                          </div>
                          {match.venue && (
                            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                              <MapPin className="w-4 h-4" />
                              <span>{match.venue}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <ArrowLeft className="w-5 h-5 text-[#5a03cf] rotate-180" />
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Étape 4 : Configuration finale */}
        {step === 'configure' && selectedMatch && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl mb-4">
                Configuration du{' '}
                <span className="bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
                  match
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Finalisez les détails de diffusion
              </p>
            </div>

            {/* Récapitulatif du match sélectionné */}
            <div className="max-w-3xl mx-auto mb-8">
              <div className="bg-gradient-to-br from-[#5a03cf]/5 to-[#9cff02]/5 dark:from-[#5a03cf]/10 dark:to-[#9cff02]/10 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Match sélectionné</span>
                  <span className="text-3xl">{SPORTS.find((s) => s.id === selectedMatch.sport)?.emoji}</span>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl text-gray-900 dark:text-white">
                    {selectedMatch.team1}
                  </span>
                  <span className="text-gray-400">vs</span>
                  <span className="text-2xl text-gray-900 dark:text-white">
                    {selectedMatch.team2}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Trophy className="w-4 h-4 text-[#5a03cf]" />
                    <span>{selectedMatch.league}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Calendar className="w-4 h-4 text-[#5a03cf]" />
                    <span>{new Date(selectedMatch.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Clock className="w-4 h-4 text-[#5a03cf]" />
                    <span>{selectedMatch.time}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulaire de configuration */}
            <div className="max-w-3xl mx-auto">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Établissement */}
                <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                  <label className="block text-gray-900 dark:text-white mb-3">
                    Établissement
                  </label>
                  <select 
                    value={selectedVenueId}
                    onChange={(e) => setSelectedVenueId(e.target.value)}
                    className="w-full px-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:border-[#5a03cf]/50 text-gray-900 dark:text-white"
                  >
                    <option key="select-resto" value="">Sélectionnez un établissement</option>
                    {restaurants.map((resto: { id: string; nom: string }) => (
                      <option key={resto.id} value={resto.id}>
                        {resto.nom}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Places disponibles */}
                <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-gray-900 dark:text-white">
                      Places disponibles
                    </label>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#5a03cf]" />
                      <span className="text-2xl bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] bg-clip-text text-transparent">
                        {placesDisponibles}
                      </span>
                    </div>
                  </div>
                  
                  <input
                    type="range"
                    min="0"
                    max={maxPlaces}
                    value={placesDisponibles}
                    onChange={(e) => setPlacesDisponibles(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #9cff02 0%, #9cff02 ${(placesDisponibles / maxPlaces) * 100}%, #e5e7eb ${(placesDisponibles / maxPlaces) * 100}%, #e5e7eb 100%)`
                    }}
                  />
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <span>0</span>
                    <span>Max: {maxPlaces} places</span>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] text-white py-4 rounded-full hover:brightness-110 hover:shadow-xl hover:shadow-[#5a03cf]/30 transition-all duration-200"
                  >
                    Programmer le match
                  </button>
                  <button
                    type="button"
                    onClick={handleBackToSearch}
                    className="px-8 py-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 rounded-full hover:bg-white/80 dark:hover:bg-gray-700/80 transition-all"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isInactiveVenueModalOpen} onOpenChange={setIsInactiveVenueModalOpen}>
        <DialogContent className="max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
          <DialogHeader className="space-y-3 text-left">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle className="text-lg text-gray-900 dark:text-white">
              Établissement inactif
            </DialogTitle>
            <DialogDescription className="text-sm leading-6 text-gray-600 dark:text-gray-400">
              Ce lieu ne peut pas programmer de match tant que le moyen de paiement n&apos;est pas configuré.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsInactiveVenueModalOpen(false)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Plus tard
            </button>
            <button
              type="button"
              onClick={handleOpenPaymentRequired}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5a03cf] to-[#7a23ef] px-4 py-2.5 text-sm text-white hover:brightness-110"
            >
              <CreditCard className="h-4 w-4" />
              Configurer le paiement
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
