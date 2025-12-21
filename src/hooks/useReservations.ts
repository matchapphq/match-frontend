import { useState, useEffect, useCallback } from 'react';
import { reservationsService } from '../services';
import type { Reservation } from '../services/types';

/**
 * Hook for fetching reservations for a venue match
 */
export function useVenueReservations(venueMatchId: string | null) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchReservations = useCallback(async () => {
    if (!venueMatchId) {
      setReservations([]);
      setTotal(0);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await reservationsService.getVenueMatchReservations(venueMatchId);
      setReservations(response.reservations);
      setTotal(response.total);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [venueMatchId]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const checkIn = async (reservationId: string, qrCode?: string): Promise<void> => {
    await reservationsService.checkIn(reservationId, qrCode);
    setReservations(prev => 
      prev.map(r => 
        r.id === reservationId 
          ? { ...r, status: 'checked_in' as const, checked_in_at: new Date().toISOString() }
          : r
      )
    );
  };

  const verifyQR = async (qrCode: string) => {
    return reservationsService.verifyQR(qrCode);
  };

  return {
    reservations,
    total,
    isLoading,
    error,
    refetch: fetchReservations,
    checkIn,
    verifyQR,
  };
}

/**
 * Hook for user's own reservations
 */
export function useMyReservations(status?: string) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReservations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await reservationsService.getMyReservations({ status });
      setReservations(response.reservations);
      setTotal(response.total);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const cancel = async (reservationId: string, reason?: string): Promise<void> => {
    await reservationsService.cancel(reservationId, reason);
    setReservations(prev => 
      prev.map(r => 
        r.id === reservationId 
          ? { ...r, status: 'cancelled' as const }
          : r
      )
    );
  };

  return {
    reservations,
    total,
    isLoading,
    error,
    refetch: fetchReservations,
    cancel,
  };
}
