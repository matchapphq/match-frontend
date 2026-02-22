import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';
import type { PageType } from '../types';

/**
 * Maps legacy PageType values to URL paths.
 * This is the single source of truth for SPA→MPA route mapping.
 */
export const PAGE_TO_PATH: Record<PageType, string> = {
  'dashboard': '/dashboard',
  'liste-matchs': '/matches',
  'match-detail': '/my-matches/:id',
  'mes-matchs': '/my-matches',
  'mes-restaurants': '/my-venues',
  'restaurant-detail': '/my-venues/:id',
  'programmer-match': '/matches/schedule',
  'modifier-match': '/my-matches/:id/edit',
  'ajouter-restaurant': '/my-venues/add',
  'modifier-restaurant': '/my-venues/:id/edit',
  'booster': '/boost',
  'acheter-boosts': '/boost/purchase',
  'parrainage': '/referral',
  'mes-avis': '/my-reviews',
  'compte': '/account',
  'compte-infos': '/account/info',
  'compte-facturation': '/account/billing',
  'compte-notifications': '/account/notifications',
  'compte-securite': '/account/security',
  'compte-donnees': '/account/data',
  'compte-aide': '/account/help',
  'infos-etablissement': '/my-venues/add/info',
  'facturation': '/my-venues/add/billing',
  'onboarding-welcome': '/onboarding',
  'confirmation-onboarding': '/onboarding/confirmation',
  'paiement-validation': '/onboarding/payment',
  'app-presentation': '/presentation',
  'referral': '/public-referral',
  'qr-scanner': '/qr-scanner',
  'reservations': '/reservations',
  'notification-center': '/notifications',
};

/**
 * Resolves a PageType to a URL path, substituting :id params when provided.
 */
export function resolvePagePath(
  page: PageType,
  params?: { matchId?: number | string | null; restaurantId?: number | string | null }
): string {
  let path = PAGE_TO_PATH[page] || '/dashboard';

  if (params?.matchId != null && path.includes(':id')) {
    path = path.replace(':id', String(params.matchId));
  }
  if (params?.restaurantId != null && path.includes(':id')) {
    path = path.replace(':id', String(params.restaurantId));
  }

  return path;
}

/**
 * Drop-in replacement for the old onNavigate / onBack callback pattern.
 * Usage:
 *   const { navigateTo, goBack } = useAppNavigate();
 *   navigateTo('mes-matchs');
 *   navigateTo('match-detail', { matchId: 42 });
 *   goBack();
 */
export function useAppNavigate() {
  const navigate = useNavigate();

  const navigateTo = useCallback(
    (
      page: PageType,
      params?: { matchId?: number | string | null; restaurantId?: number | string | null }
    ) => {
      const path = resolvePagePath(page, params);
      navigate(path);
    },
    [navigate]
  );

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return { navigateTo, goBack, navigate };
}
