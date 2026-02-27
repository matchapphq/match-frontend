# Services API par Page

Ce document répertorie les services API recommandés pour chaque page de l'application Match.

## 📋 Table des matières

- [Pages d'authentification](#pages-dauthentification)
- [Pages d'onboarding](#pages-donboarding)
- [Dashboard & Analytics](#dashboard--analytics)
- [Gestion des établissements](#gestion-des-établissements)
- [Gestion des matchs](#gestion-des-matchs)
- [Réservations](#réservations)
- [Boosts](#boosts)
- [Parrainage](#parrainage)
- [Compte utilisateur](#compte-utilisateur)
- [Autres pages](#autres-pages)

---

## Pages d'authentification

### `/components/Login.tsx`
**Services:** `users.service.ts`

```typescript
import { login, getAuthenticatedUser } from '../services/users.service';

// Login user
const handleLogin = async (email: string, password: string) => {
  const { access_token, refresh_token, user } = await login({ email, password });
  // Store tokens and user data
};
```

### `/components/Register.tsx`
**Services:** `users.service.ts`, `referral.service.ts`

```typescript
import { register } from '../services/users.service';
import { validateReferralCode } from '../services/referral.service';

// Validate referral code before registration
const validateCode = async (code: string) => {
  const { valid, message } = await validateReferralCode(code);
  return valid;
};

// Register with optional referral code
const handleRegister = async (data) => {
  const { access_token, user } = await register({
    email: data.email,
    password: data.password,
    name: data.name,
    phone: data.phone,
    referral_code: data.referralCode,
  });
};
```

---

## Pages d'onboarding

### `/pages/onboarding-welcome/OnboardingWelcome.tsx`
**Services:** Aucun service API nécessaire (page d'accueil)

### `/pages/infos-etablissement/InfosEtablissement.tsx`
**Services:** `venues.service.ts`

```typescript
import { createVenue, getAllAmenities, updateVenueAmenities } from '../services/venues.service';

// Get available amenities
const loadAmenities = async () => {
  const amenities = await getAllAmenities(authToken);
  setAmenities(amenities);
};

// Create venue (Step 1)
const handleCreateVenue = async (venueData) => {
  const venue = await createVenue({
    name: venueData.name,
    address: venueData.address,
    city: venueData.city,
    postal_code: venueData.postalCode,
    phone: venueData.phone,
    email: venueData.email,
    description: venueData.description,
    capacity: venueData.capacity,
    booking_mode: venueData.bookingMode,
  }, authToken);
  
  // Update amenities
  if (selectedAmenities.length > 0) {
    await updateVenueAmenities(venue.id, selectedAmenities, authToken);
  }
  
  return venue;
};
```

### `/pages/facturation/Facturation.tsx`
**Services:** `subscriptions.service.ts`

```typescript
import { getSubscriptionPlans } from '../services/subscriptions.service';

// Load subscription plans
const loadPlans = async () => {
  const plans = await getSubscriptionPlans();
  setPlans(plans);
};
```

### `/pages/paiement-validation/PaiementValidation.tsx`
**Services:** `subscriptions.service.ts`

```typescript
import { createSubscriptionCheckout } from '../services/subscriptions.service';

// Create Stripe checkout session
const handlePayment = async () => {
  const { checkout_url, session_id } = await createSubscriptionCheckout({
    plan: 'basic',
    billing_period: selectedFormule === 'mensuel' ? 'monthly' : 'yearly',
  }, authToken);
  
  // Redirect to Stripe
  window.location.href = checkout_url;
};
```

### `/pages/confirmation-onboarding/ConfirmationOnboarding.tsx`
**Services:** `subscriptions.service.ts`, `users.service.ts`

```typescript
import { verifyCheckout } from '../services/subscriptions.service';
import { completeOnboarding } from '../services/users.service';

// Verify Stripe checkout (on redirect back)
const verifyPayment = async (sessionId: string) => {
  const { success, subscription_id } = await verifyCheckout(sessionId, authToken);
  
  if (success) {
    await completeOnboarding(authToken);
  }
};
```

---

## Dashboard & Analytics

### `/pages/dashboard/Dashboard.tsx`
**Services:** `analytics.service.ts`, `venues.service.ts`, `reservations.service.ts`

```typescript
import { getDashboardAnalytics, getAnalyticsSummary } from '../services/analytics.service';
import { getMyVenues } from '../services/venues.service';

// Load dashboard data
const loadDashboard = async () => {
  const [analytics, venues] = await Promise.all([
    getDashboardAnalytics({ date_from, date_to }, authToken),
    getMyVenues(authToken),
  ]);
  
  setAnalytics(analytics);
  setVenues(venues);
};

// Load analytics summary
const loadSummary = async () => {
  const summary = await getAnalyticsSummary({
    period: 'month',
    date_from,
    date_to,
  }, authToken);
};
```

---

## Gestion des établissements

### `/pages/mes-restaurants/MesRestaurants.tsx`
**Services:** `venues.service.ts`, `subscriptions.service.ts`

```typescript
import { getMyVenues, getVenueSubscription } from '../services/venues.service';

// Load user's venues
const loadVenues = async () => {
  const venues = await getMyVenues(authToken);
  
  // Load subscription for each venue
  const venuesWithSubscription = await Promise.all(
    venues.map(async (venue) => {
      const subscription = await getVenueSubscription(venue.id, authToken);
      return { ...venue, subscription };
    })
  );
  
  setVenues(venuesWithSubscription);
};
```

### `/pages/ajouter-restaurant/AjouterRestaurant.tsx`
**Services:** `venues.service.ts`, `subscriptions.service.ts`

```typescript
import { createVenue } from '../services/venues.service';
import { createSubscriptionCheckout } from '../services/subscriptions.service';

// Create venue and initiate subscription
const handleAddVenue = async (venueData) => {
  // 1. Create venue
  const venue = await createVenue(venueData, authToken);
  
  // 2. Redirect to subscription checkout
  const { checkout_url } = await createSubscriptionCheckout({
    plan: 'basic',
    billing_period: 'monthly',
    venue_id: venue.id,
  }, authToken);
  
  window.location.href = checkout_url;
};
```

### `/pages/modifier-restaurant/ModifierRestaurant.tsx`
**Services:** `venues.service.ts`

```typescript
import {
  getVenueDetails,
  updateVenue,
  getVenuePhotos,
  uploadVenuePhoto,
  deleteVenuePhoto,
  setPhotoPrimary,
  getOpeningHours,
  updateOpeningHours,
  getVenueAmenities,
  updateVenueAmenities,
  updateBookingMode,
} from '../services/venues.service';

// Load venue details
const loadVenue = async (venueId: string) => {
  const [venue, photos, hours, amenities] = await Promise.all([
    getVenueDetails(venueId, authToken),
    getVenuePhotos(venueId, authToken),
    getOpeningHours(venueId, authToken),
    getVenueAmenities(venueId, authToken),
  ]);
  
  setVenue(venue);
  setPhotos(photos);
  setHours(hours);
  setAmenities(amenities);
};

// Update venue
const handleUpdate = async (data) => {
  await updateVenue(venueId, data, authToken);
};

// Upload photo
const handlePhotoUpload = async (file: File) => {
  const photo = await uploadVenuePhoto(venueId, file, authToken);
  setPhotos([...photos, photo]);
};
```

### `/pages/restaurant-detail/RestaurantDetail.tsx`
**Services:** `venues.service.ts`, `reviews.service.ts`

```typescript
import { getVenueDetails, getVenuePhotos } from '../services/venues.service';
import { getVenueReviews } from '../services/reviews.service';

// Load venue details and reviews
const loadVenueDetails = async (venueId: string) => {
  const [venue, photos, reviews] = await Promise.all([
    getVenueDetails(venueId, authToken),
    getVenuePhotos(venueId, authToken),
    getVenueReviews(venueId, { limit: 10, sort_by: 'recent' }),
  ]);
};
```

---

## Gestion des matchs

### `/pages/liste-matchs/ListeMatchs.tsx`
**Services:** `matches.service.ts`

```typescript
import { getUpcomingMatches, searchMatches, getAllSports, getSportLeagues } from '../services/matches.service';

// Load upcoming matches
const loadMatches = async () => {
  const matches = await getUpcomingMatches({
    sport_id: selectedSport,
    league_id: selectedLeague,
    limit: 20,
  }, authToken);
};

// Search matches
const handleSearch = async (query: string) => {
  const results = await searchMatches({
    query,
    date_from: startDate,
    date_to: endDate,
  }, authToken);
};

// Load sports and leagues
const loadFilters = async () => {
  const sports = await getAllSports();
  setSports(sports);
};
```

### `/pages/mes-matchs/MesMatchs.tsx`
**Services:** `matches.service.ts`, `reservations.service.ts`

```typescript
import { getMyMatches, getVenueMatches } from '../services/matches.service';
import { getVenueReservations } from '../services/reservations.service';

// Load venue matches
const loadMyMatches = async () => {
  const matches = await getMyMatches({
    venue_id: selectedVenue,
    status: 'SCHEDULED',
    date_from: new Date().toISOString(),
  }, authToken);
  
  // Load reservations for each match
  const matchesWithReservations = await Promise.all(
    matches.map(async (match) => {
      const reservations = await getVenueReservations(match.venue_id, {
        match_id: match.id,
      }, authToken);
      return { ...match, reservations };
    })
  );
};
```

### `/pages/match-detail/MatchDetail.tsx`
**Services:** `matches.service.ts`, `reservations.service.ts`, `reviews.service.ts`

```typescript
import { getMatchDetails, getMatchVenues, getVenueMatchDetails } from '../services/matches.service';
import { getVenueMatchReservations } from '../services/reservations.service';
import { getVenueReviews } from '../services/reviews.service';

// Load match details (for users)
const loadMatchDetails = async (matchId: string) => {
  const [match, venues] = await Promise.all([
    getMatchDetails(matchId, authToken),
    getMatchVenues(matchId, { latitude, longitude, radius: 5000 }, authToken),
  ]);
};

// Load venue match details (for partners)
const loadVenueMatchDetails = async (venueId: string, matchId: string) => {
  const [venueMatch, reservations] = await Promise.all([
    getVenueMatchDetails(venueId, matchId, authToken),
    getVenueMatchReservations(venueMatch.id, authToken),
  ]);
};
```

### `/pages/programmer-match/ProgrammerMatch.tsx`
**Services:** `matches.service.ts`, `venues.service.ts`

```typescript
import { getUpcomingMatches, createVenueMatch } from '../services/matches.service';
import { getMyVenues } from '../services/venues.service';

// Load available matches
const loadAvailableMatches = async () => {
  const matches = await getUpcomingMatches({
    date_from: new Date().toISOString(),
    limit: 50,
  }, authToken);
};

// Create venue match
const handleProgramMatch = async (data) => {
  const venueMatch = await createVenueMatch(selectedVenue, {
    match_id: selectedMatch,
    max_capacity: data.capacity,
    price_per_person: data.price,
    booking_mode: data.bookingMode,
  }, authToken);
};
```

### `/pages/modifier-match/ModifierMatch.tsx`
**Services:** `matches.service.ts`

```typescript
import { getVenueMatchDetails, updateVenueMatch, deleteVenueMatch } from '../services/matches.service';

// Load match details
const loadMatchDetails = async () => {
  const match = await getVenueMatchDetails(venueId, matchId, authToken);
  setMatch(match);
};

// Update match
const handleUpdate = async (data) => {
  await updateVenueMatch(venueId, matchId, data, authToken);
};

// Delete match
const handleDelete = async () => {
  await deleteVenueMatch(venueId, matchId, authToken);
};
```

---

## Réservations

### `/pages/reservations/Reservations.tsx`
**Services:** `reservations.service.ts`, `venues.service.ts`

```typescript
import {
  getVenueReservations,
  getVenueReservationStats,
  updateReservationStatus,
  markReservationNoShow,
} from '../services/reservations.service';

// Load reservations
const loadReservations = async () => {
  const [reservations, stats] = await Promise.all([
    getVenueReservations(venueId, {
      status: filterStatus,
      date_from: startDate,
      date_to: endDate,
    }, authToken),
    getVenueReservationStats(venueId, { date_from: startDate, date_to: endDate }, authToken),
  ]);
};

// Confirm reservation
const handleConfirm = async (reservationId: string) => {
  await updateReservationStatus(reservationId, 'CONFIRMED', authToken);
};

// Cancel reservation
const handleCancel = async (reservationId: string) => {
  await updateReservationStatus(reservationId, 'CANCELLED', authToken);
};

// Mark as no-show
const handleNoShow = async (reservationId: string) => {
  await markReservationNoShow(reservationId, authToken);
};
```

### `/pages/qr-scanner/QRScanner.tsx`
**Services:** `reservations.service.ts`

```typescript
import { verifyQRCode, checkInReservation } from '../services/reservations.service';

// Verify and check-in
const handleQRScan = async (qrCode: string) => {
  const { valid, reservation, message } = await verifyQRCode(qrCode, authToken);
  
  if (valid && reservation) {
    await checkInReservation(reservation.id, authToken);
    setMessage('Réservation validée !');
  } else {
    setError(message);
  }
};
```

---

## Boosts

### `/pages/booster/Booster.tsx`
**Services:** `boosts.service.ts`, `matches.service.ts`

```typescript
import {
  getBoostSummary,
  getBoostableMatches,
  activateBoost,
  deactivateBoost,
  getBoostHistory,
} from '../services/boosts.service';

// Load boost summary
const loadBoostData = async () => {
  const [summary, boostableMatches, history] = await Promise.all([
    getBoostSummary(authToken),
    getBoostableMatches(venueId, authToken),
    getBoostHistory({ status: 'ACTIVE' }, authToken),
  ]);
};

// Activate boost
const handleActivateBoost = async (venueMatchId: string) => {
  const { success, boost_id, expires_at, remaining_boosts } = await activateBoost({
    venue_match_id: venueMatchId,
    duration_hours: 24,
  }, authToken);
};

// Deactivate boost
const handleDeactivateBoost = async (boostId: string) => {
  await deactivateBoost({ boost_id: boostId, refund: true }, authToken);
};
```

### `/pages/acheter-boosts/AcheterBoosts.tsx`
**Services:** `boosts.service.ts`

```typescript
import { getBoostPrices, createBoostCheckout, verifyBoostPurchase } from '../services/boosts.service';

// Load boost prices
const loadPrices = async () => {
  const prices = await getBoostPrices();
  setPrices(prices);
};

// Purchase boosts
const handlePurchase = async (pack: BoostPack) => {
  const { checkout_url, session_id } = await createBoostCheckout({
    pack_type: pack.id,
    quantity: pack.quantity,
    amount: pack.price,
  }, authToken);
  
  // Redirect to Stripe
  window.location.href = checkout_url;
};

// Verify purchase (on redirect back)
const verifyPurchase = async (sessionId: string) => {
  const { success, boosts_added, message } = await verifyBoostPurchase(sessionId, authToken);
};
```

---

## Parrainage

### `/pages/parrainage/Parrainage.tsx`
**Services:** `referral.service.ts`

```typescript
import {
  getMyReferralCode,
  getReferralStats,
  getReferralHistory,
  getReferralBoosts,
  useReferralBoost,
} from '../services/referral.service';

// Load referral data
const loadReferralData = async () => {
  const [code, stats, history, boosts] = await Promise.all([
    getMyReferralCode(authToken),
    getReferralStats(authToken),
    getReferralHistory({}, authToken),
    getReferralBoosts(authToken),
  ]);
};

// Use referral boost
const handleUseBoost = async (boostId: string, venueMatchId: string) => {
  const { success, message } = await useReferralBoost(boostId, {
    venue_match_id: venueMatchId,
  }, authToken);
};
```

### `/pages/referral/ReferralPage.tsx`
**Services:** `referral.service.ts`

```typescript
import { validateReferralCode } from '../services/referral.service';

// Validate referral code
const handleValidate = async (code: string) => {
  const { valid, message, referrer_name } = await validateReferralCode(code);
  
  if (valid) {
    setMessage(`Code valide ! Parrainé par ${referrer_name}`);
  }
};
```

---

## Compte utilisateur

### `/src/features/compte/pages/MonCompte.tsx` and `/src/components/compte/*.tsx`
**Services:** `useAccount.ts`, `api/client.ts`, `services/api.ts`

```typescript
import {
  useUserProfile,
  useNotificationPreferences,
  usePrivacyPreferences,
  useSessions,
  useUpdatePassword,
  useRevokeSession,
  useRevokeOtherSessions,
} from '../hooks/api/useAccount';

// Profile and account settings
const profile = useUserProfile();
const notificationPreferences = useNotificationPreferences();
const privacyPreferences = usePrivacyPreferences();
const sessions = useSessions();

// Security actions
await updatePasswordMutation.mutateAsync({
  current_password,
  new_password,
  confirm_password,
});
await revokeSessionMutation.mutateAsync(sessionId);
await revokeOtherSessionsMutation.mutateAsync();

// Privacy / GDPR
await apiClient.post('/support/data-export-request', { message });
await apiClient.delete('/users/me', {
  data: { reason, details, password },
});
```

### `/pages/mes-avis/MesAvis.tsx`
**Services:** `reviews.service.ts`

```typescript
import { getVenueReviews, createReview, updateReview, deleteReview } from '../services/reviews.service';

// Load venue reviews
const loadReviews = async () => {
  const reviews = await getVenueReviews(venueId, {
    sort_by: 'recent',
    limit: 50,
  }, authToken);
};

// Create review
const handleCreateReview = async (data) => {
  await createReview(venueId, {
    reservation_id: data.reservationId,
    rating: data.rating,
    comment: data.comment,
  }, authToken);
};
```

### `/pages/notification-center/NotificationCenter.tsx`
**Services:** `notifications.service.ts`

```typescript
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllAsRead,
  deleteNotification,
} from '../services/notifications.service';

// Load notifications
const loadNotifications = async () => {
  const notifications = await getMyNotifications({
    limit: 50,
  }, authToken);
};

// Mark as read
const handleMarkAsRead = async (notificationId: string) => {
  await markNotificationAsRead(notificationId, authToken);
};

// Mark all as read
const handleMarkAllAsRead = async () => {
  await markAllAsRead(authToken);
};
```

---

## Autres pages

### `/pages/app-presentation/AppPresentation.tsx`
**Services:** Aucun service API nécessaire (page de présentation)

---

## 🎯 Bonnes pratiques

### 1. Gestion des erreurs

```typescript
try {
  const data = await getMyVenues(authToken);
  setVenues(data);
} catch (error) {
  console.error('Erreur lors du chargement:', error);
  setError(error instanceof Error ? error.message : 'Une erreur est survenue');
}
```

### 2. États de chargement

```typescript
const [loading, setLoading] = useState(false);

const loadData = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const data = await getMyVenues(authToken);
    setVenues(data);
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Erreur');
  } finally {
    setLoading(false);
  }
};
```

### 3. Appels parallèles

```typescript
// ✅ Bon - Appels en parallèle
const [venues, matches, reservations] = await Promise.all([
  getMyVenues(authToken),
  getMyMatches({}, authToken),
  getVenueReservations(venueId, {}, authToken),
]);

// ❌ Mauvais - Appels séquentiels
const venues = await getMyVenues(authToken);
const matches = await getMyMatches({}, authToken);
const reservations = await getVenueReservations(venueId, {}, authToken);
```

### 4. Cache et optimisation

```typescript
import { getCached } from '../utils/api-helpers';

// Cache les données pendant 5 minutes
const venues = await getCached(
  'my-venues',
  () => getMyVenues(authToken),
  5 * 60 * 1000
);
```

### 5. TypeScript strict

```typescript
// ✅ Types explicites
const handleUpdate = async (venueId: string, data: Partial<Venue>): Promise<void> => {
  const updatedVenue = await updateVenue(venueId, data, authToken);
  setVenue(updatedVenue);
};

// ✅ Gestion des types de retour
const loadVenue = async (): Promise<Venue | null> => {
  try {
    return await getVenueDetails(venueId, authToken);
  } catch {
    return null;
  }
};
```

---

## 📝 Notes importantes

1. **Approche 100% seamless** : Tous les paramètres et retours utilisent `snake_case`
2. **Tokens d'authentification** : La plupart des endpoints nécessitent un `authToken`
3. **Mock data** : En attendant le backend, utilisez des mock responses cohérentes
4. **Stripe redirections** : Les endpoints checkout retournent une `checkout_url` pour redirection
5. **Pagination** : Utilisez `limit` et `offset` pour paginer les résultats
6. **Filtres de dates** : Format ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`)

---

## 🔗 Liens utiles

- [API Constants](/utils/api-constants.ts) - Tous les endpoints
- [API Helpers](/utils/api-helpers.ts) - Fonctions utilitaires
- [Services Index](/services/index.ts) - Export centralisé
- [API Endpoints by Page](/doc/API_ENDPOINTS_BY_PAGE.md) - Documentation des endpoints
