import { useState, useEffect, useCallback } from 'react';
import { partnerService, venuesService, analyticsService } from '../services';
import type { Venue, CreateVenueRequest, UpdateVenueRequest, AnalyticsOverview } from '../services/types';

/**
 * Hook for fetching venue owner's venues
 */
export function useMyVenues() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVenues = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await partnerService.getMyVenues();
      setVenues(response.venues);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  const createVenue = async (data: CreateVenueRequest): Promise<Venue> => {
    const response = await partnerService.createVenue(data);
    setVenues(prev => [...prev, response.venue]);
    return response.venue;
  };

  const updateVenue = async (venueId: string, data: UpdateVenueRequest): Promise<Venue> => {
    const updated = await venuesService.update(venueId, data);
    setVenues(prev => prev.map(v => v.id === venueId ? updated : v));
    return updated;
  };

  const deleteVenue = async (venueId: string): Promise<void> => {
    await venuesService.delete(venueId);
    setVenues(prev => prev.filter(v => v.id !== venueId));
  };

  return {
    venues,
    isLoading,
    error,
    refetch: fetchVenues,
    createVenue,
    updateVenue,
    deleteVenue,
  };
}

/**
 * Hook for fetching a single venue with details
 */
export function useVenue(venueId: string | null) {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!venueId) {
      setVenue(null);
      return;
    }

    const fetchVenue = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await venuesService.getById(venueId);
        setVenue(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenue();
  }, [venueId]);

  return { venue, isLoading, error };
}

/**
 * Hook for fetching venue analytics
 */
export function useVenueAnalytics(venueId: string | null) {
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!venueId) {
      setAnalytics(null);
      return;
    }

    const fetchAnalytics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await analyticsService.getOverview(venueId);
        setAnalytics(response.overview);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [venueId]);

  return { analytics, isLoading, error };
}
