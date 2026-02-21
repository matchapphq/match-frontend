import { useNavigate, useLocation } from 'react-router-dom';
import { useCallback } from 'react';
import type { PageType } from '../types';

/**
 * Maps legacy PageType values to URL paths.
 * This is the single source of truth for SPA→MPA route mapping.
 */
export const PAGE_TO_PATH: Record<PageType, string> = {
  'dashboard': '/tableau-de-bord',
  'liste-matchs': '/matchs',
  'match-detail': '/mes-matchs/:id',
  'mes-matchs': '/mes-matchs',
  'mes-restaurants': '/mes-restaurants',
  'restaurant-detail': '/mes-restaurants/:id',
  'programmer-match': '/matchs/programmer',
  'modifier-match': '/mes-matchs/:id/modifier',
  'ajouter-restaurant': '/mes-restaurants/ajouter',
  'modifier-restaurant': '/mes-restaurants/:id/modifier',
  'booster': '/booster',
  'acheter-boosts': '/booster/acheter',
  'parrainage': '/parrainage',
  'mes-avis': '/mes-avis',
  'compte': '/compte',
  'compte-infos': '/compte/infos',
  'compte-facturation': '/compte/facturation',
  'compte-notifications': '/compte/notifications',
  'compte-securite': '/compte/securite',
  'compte-donnees': '/compte/donnees',
  'compte-aide': '/compte/aide',
  'infos-etablissement': '/mes-restaurants/ajouter/infos',
  'facturation': '/mes-restaurants/ajouter/facturation',
  'onboarding-welcome': '/onboarding',
  'confirmation-onboarding': '/onboarding/confirmation',
  'paiement-validation': '/onboarding/paiement',
  'app-presentation': '/presentation',
  'referral': '/parrainage-public',
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
  let path = PAGE_TO_PATH[page] || '/tableau-de-bord';

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
