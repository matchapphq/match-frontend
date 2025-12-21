import { useState, useEffect, useCallback } from 'react';
import { matchesService, sportsService, venueMatchesService, partnerService } from '../services';
import type { Match, VenueMatch, Sport, League } from '../services/types';

/**
 * Hook for fetching all matches with optional filters
 */
export function useMatches(filters?: {
  status?: string;
  league_id?: string;
  scheduled_from?: string;
  scheduled_to?: string;
}) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMatches = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await matchesService.getAll(filters);
      setMatches(response.matches);
      setTotal(response.total);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return { matches, total, isLoading, error, refetch: fetchMatches };
}

/**
 * Hook for fetching venue matches (matches scheduled at a venue)
 */
export function useVenueMatches(venueId: string | null) {
  const [venueMatches, setVenueMatches] = useState<VenueMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchVenueMatches = useCallback(async () => {
    if (!venueId) {
      setVenueMatches([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await venueMatchesService.getByVenue(venueId);
      setVenueMatches(response.matches);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [venueId]);

  useEffect(() => {
    fetchVenueMatches();
  }, [fetchVenueMatches]);

  const scheduleMatch = async (matchId: string, totalSeats: number): Promise<void> => {
    if (!venueId) throw new Error('No venue selected');
    await partnerService.scheduleMatch(venueId, {
      match_id: matchId,
      total_seats: totalSeats,
    });
    await fetchVenueMatches();
  };

  const cancelMatch = async (matchId: string): Promise<void> => {
    if (!venueId) throw new Error('No venue selected');
    await partnerService.cancelMatch(venueId, matchId);
    setVenueMatches(prev => prev.filter(vm => vm.match_id !== matchId));
  };

  return {
    venueMatches,
    isLoading,
    error,
    refetch: fetchVenueMatches,
    scheduleMatch,
    cancelMatch,
  };
}

/**
 * Hook for fetching sports and leagues
 */
export function useSportsAndLeagues() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const sportsResponse = await sportsService.getAll({ is_active: true });
        setSports(sportsResponse.sports);
        
        // Fetch leagues for all sports
        const allLeagues: League[] = [];
        for (const sport of sportsResponse.sports) {
          const leaguesResponse = await sportsService.getLeagues(sport.id, { is_active: true });
          allLeagues.push(...leaguesResponse.leagues);
        }
        setLeagues(allLeagues);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { sports, leagues, isLoading, error };
}
