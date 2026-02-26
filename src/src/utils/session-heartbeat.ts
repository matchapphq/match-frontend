import apiClient from '../api/client';
import { API_ENDPOINTS } from './api-constants';

type SessionLocation = {
  city: string;
  region: string;
  country: string;
};

const SESSION_LOCATION_CACHE_MS = 10 * 60 * 1000;

let cachedLocation: SessionLocation | null = null;
let cachedLocationExpiresAt = 0;
let pendingLocationPromise: Promise<SessionLocation | null> | null = null;

const sanitize = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const normalizeLocation = (payload: {
  city?: unknown;
  region?: unknown;
  country?: unknown;
  country_name?: unknown;
}): SessionLocation | null => {
  const city = sanitize(payload.city);
  const region = sanitize(payload.region);
  const country = sanitize(
    typeof payload.country_name === 'string' ? payload.country_name : payload.country
  );

  if (!city && !region && !country) {
    return null;
  }

  return {
    city: city || '',
    region: region || '',
    country: country || '',
  };
};

const fetchSessionLocation = async (): Promise<SessionLocation | null> => {
  const providers = [
    'https://ipapi.co/json/',
    'https://ipwho.is/',
    'https://ipinfo.io/json',
  ];

  for (const provider of providers) {
    try {
      const response = await fetch(provider, {
        signal: AbortSignal.timeout(2000),
      });

      if (!response.ok) {
        continue;
      }

      const payload = (await response.json()) as {
        city?: unknown;
        region?: unknown;
        country?: unknown;
        country_name?: unknown;
        success?: unknown;
      };

      if (payload.success === false) {
        continue;
      }

      const normalized = normalizeLocation(payload);
      if (normalized) {
        return normalized;
      }
    } catch {
      // Try next provider
    }
  }

  return null;
};

export const resolveSessionLocation = async (): Promise<SessionLocation | null> => {
  if (cachedLocation && cachedLocationExpiresAt > Date.now()) {
    return cachedLocation;
  }

  if (pendingLocationPromise) {
    return pendingLocationPromise;
  }

  pendingLocationPromise = fetchSessionLocation()
    .then((location) => {
      if (!location) {
        cachedLocation = null;
        cachedLocationExpiresAt = Date.now() + 60 * 1000;
        return null;
      }

      cachedLocation = location;
      cachedLocationExpiresAt = Date.now() + SESSION_LOCATION_CACHE_MS;
      return location;
    })
    .finally(() => {
      pendingLocationPromise = null;
    });

  return pendingLocationPromise;
};

export const sendSessionHeartbeat = async (): Promise<void> => {
  const location = await resolveSessionLocation();
  await apiClient.post(API_ENDPOINTS.USERS_ME_SESSION_HEARTBEAT, location ? { location } : {});
};
