# 🔌 API Integration Guide - Match Frontend

**Guide pratique pour migrer du mock data vers l'API backend réelle**

*Last updated: January 2026*

---

## 📋 Vue d'Ensemble

Ce guide explique **comment migrer** chaque composant du mock data vers les vraies routes API. 

**🎯 Approche : Frontend utilise les mêmes noms que le Backend (snake_case)**

Pour une intégration seamless, le frontend utilisera directement les mêmes noms de champs que le backend. Plus besoin de transformation !

---

## 🗂️ Structure API Service

Tous les endpoints sont définis dans `/services/api.ts` :

| API Object | Description | Routes Backend |
|------------|-------------|----------------|
| `authAPI` | Authentification | `/api/auth/*` |
| `userAPI` | Profil utilisateur | `/api/users/*` |
| `venueAPI` | Données venues publiques | `/api/venues/*` |
| `matchesAPI` | Matchs et sports | `/api/matches/*` |
| `reservationsAPI` | Réservations utilisateur | `/api/reservations/*` |
| `partnerAPI` | **Dashboard venue owner** | `/api/partners/*` |
| `boostAPI` | Gestion boosts | `/api/boosts/*` |
| `referralAPI` | Système parrainage | `/api/referral/*` |
| `notificationsAPI` | Notifications | `/api/notifications/*` |
| `reviewsAPI` | Avis venues | `/api/reviews/*` |
| `subscriptionsAPI` | Abonnements | `/api/subscriptions/*` |

---

## 🪝 Hooks React Query Disponibles

Tous les hooks sont dans `/hooks/api/` :

### `useAuth.ts` - Authentication
```typescript
import { 
  useLogin,               // POST /api/auth/login
  useRegister,            // POST /api/auth/register
  useLogout,              // POST /api/auth/logout
  useCurrentUser,         // GET /api/auth/me
  useUpdateProfile,       // PUT /api/auth/me
  useRefreshToken         // POST /api/auth/refresh-token
} from '../hooks/api';
```

### `usePartner.ts` - Venue Owner Dashboard
```typescript
import { 
  usePartnerVenues,           // GET /api/partners/venues
  useCreatePartnerVenue,      // POST /api/partners/venues
  useVerifyCheckout,          // POST /api/partners/venues/verify-checkout
  usePartnerVenueMatches,     // GET /api/partners/venues/matches
  usePartnerReservations,     // GET /api/partners/venues/:id/reservations
  useReservationStats,        // GET /api/partners/venues/:id/reservations/stats
  useUpdateReservation,       // PATCH /api/partners/reservations/:id
  useUpdateReservationStatus, // PATCH /api/partners/reservations/:id/status
  useMarkNoShow,              // POST /api/partners/reservations/:id/mark-no-show
  useScheduleMatch,           // POST /api/partners/venues/:id/matches
  useUpdateVenueMatch,        // PUT /api/partners/venues/:id/matches/:matchId
  useCancelMatch,             // DELETE /api/partners/venues/:id/matches/:matchId
  useMatchesCalendar,         // GET /api/partners/venues/:id/matches/calendar
  useVenueClients,            // GET /api/partners/venues/:id/clients
  useVenueSubscription,       // GET /api/partners/venues/:id/subscription
  usePaymentPortal,           // POST /api/partners/venues/:id/payment-portal
  useCustomerStats,           // GET /api/partners/stats/customers
  usePartnerAnalyticsSummary, // GET /api/partners/analytics/summary
  usePartnerAnalytics         // GET /api/partners/analytics/dashboard
} from '../hooks/api';
```

### `useVenues.ts` - Venues
```typescript
import { 
  useVenues,                  // GET /api/venues (public)
  useNearbyVenues,            // GET /api/venues/nearby
  useVenue,                   // GET /api/venues/:id
  useVenuePhotos,             // GET /api/venues/:id/photos
  useUploadVenuePhoto,        // POST /api/venues/:id/photos
  useDeleteVenuePhoto,        // DELETE /api/venues/:id/photos/:photoId
  useSetPrimaryPhoto,         // PUT /api/venues/:id/photos/:photoId/primary
  useVenueOpeningHours,       // GET /api/venues/:id/opening-hours
  useUpdateOpeningHours,      // PUT /api/venues/:id/opening-hours
  useCreateHoursException,    // POST /api/venues/:id/opening-hours/exceptions
  useHoursExceptions,         // GET /api/venues/:id/opening-hours/exceptions
  useDeleteHoursException,    // DELETE /api/venues/:id/opening-hours/exceptions/:id
  useAmenities,               // GET /api/amenities
  useVenueAmenities,          // GET /api/venues/:id/amenities
  useUpdateVenueAmenities,    // PUT /api/venues/:id/amenities
  useVenueMenu,               // GET /api/venues/:id/menu
  useUpdateVenueMenu,         // POST /api/venues/:id/menu
  useVenueMatches,            // GET /api/venues/:id/matches
  useVenueAvailability,       // GET /api/venues/:id/availability
  useCreateVenue,             // POST /api/venues
  useUpdateVenue,             // PUT /api/venues/:id
  useDeleteVenue,             // DELETE /api/venues/:id
  useUpdateBookingMode        // PUT /api/venues/:id/booking-mode
} from '../hooks/api';
```

### `useMatches.ts` - Matches
```typescript
import { 
  useMatches,                 // GET /api/matches
  useUpcomingMatches,         // GET /api/matches/upcoming
  useUpcomingNearbyMatches,   // GET /api/matches/upcoming-nearby
  useMatch,                   // GET /api/matches/:id
  useMatchVenues,             // GET /api/matches/:id/venues
  useMatchLiveUpdates,        // GET /api/matches/:id/live-updates
  useSports,                  // GET /api/sports
  useSport,                   // GET /api/sports/:id
  useSportLeagues,            // GET /api/sports/:id/leagues
  useSportsFixtures,          // GET /api/sports/fixture
  useLeague,                  // GET /api/leagues/:id
  useLeagueTeams,             // GET /api/leagues/:id/teams
  useTeam                     // GET /api/teams/:id
} from '../hooks/api';
```

### `useReservations.ts` - Reservations
```typescript
import { 
  useReservations,            // GET /api/reservations
  useReservation,             // GET /api/reservations/:id
  useCreateReservation,       // POST /api/reservations
  useCancelReservation,       // POST /api/reservations/:id/cancel
  useVerifyQR,                // POST /api/reservations/verify-qr
  useCheckInReservation,      // POST /api/reservations/:id/check-in
  useVenueMatchReservations   // GET /api/reservations/venue-match/:venueMatchId
} from '../hooks/api';
```

### `useBoosts.ts` - Boosts
```typescript
import { 
  useBoostPrices,             // GET /api/boosts/prices
  useAvailableBoosts,         // GET /api/boosts/available
  useBoostStats,              // GET /api/boosts/stats
  useBoostSummary,            // GET /api/boosts/summary
  useCreateBoostCheckout,     // POST /api/boosts/purchase/create-checkout
  useVerifyBoostPurchase,     // POST /api/boosts/purchase/verify
  useBoostableMatches,        // GET /api/boosts/boostable/:venueId
  useBoostPurchases,          // GET /api/boosts/purchases
  useActivateBoost,           // POST /api/boosts/activate
  useDeactivateBoost,         // POST /api/boosts/deactivate
  useBoostHistory,            // GET /api/boosts/history
  useBoostAnalytics           // GET /api/boosts/analytics/:id
} from '../hooks/api';
```

### `useReferrals.ts` - Parrainage
```typescript
import { 
  useReferralCode,            // GET /api/referral/code
  useReferralStats,           // GET /api/referral/stats
  useReferralHistory,         // GET /api/referral/history
  useValidateReferralCode,    // POST /api/referral/validate
  useRegisterReferral,        // POST /api/referral/register
  useConvertReferral,         // POST /api/referral/convert
  useReferralBoosts,          // GET /api/referral/boosts
  useReferralBoost            // POST /api/referral/boosts/:id/use
} from '../hooks/api';
```

### `useOther.ts` - Reviews, Notifications, Subscriptions
```typescript
import { 
  // Reviews
  useCreateReview,            // POST /api/venues/:id/reviews
  useVenueReviews,            // GET /api/venues/:id/reviews
  useUpdateReview,            // PUT /api/reviews/:id
  useDeleteReview,            // DELETE /api/reviews/:id
  useMarkReviewHelpful,       // POST /api/reviews/:id/helpful
  
  // Notifications
  useNotifications,           // GET /api/notifications
  useMarkNotificationRead,    // PUT /api/notifications/:id/read
  useMarkAllNotificationsRead,// PUT /api/notifications/read-all
  useDeleteNotification,      // DELETE /api/notifications/:id
  
  // Subscriptions
  useSubscriptionPlans,       // GET /api/subscriptions/plans
  useCreateCheckout,          // POST /api/subscriptions/create-checkout
  useMySubscription,          // GET /api/subscriptions/me
  useUpdatePaymentMethod,     // POST /api/subscriptions/me/update-payment-method
  useCancelSubscription,      // POST /api/subscriptions/me/cancel
  useUpgradeSubscription,     // POST /api/subscriptions/me/upgrade
  useToggleMockSubscription,  // POST /api/subscriptions/mock
  
  // Invoices
  useInvoices,                // GET /api/invoices
  useInvoice,                 // GET /api/invoices/:id
  
  // Venue Favorites
  useAddFavorite,             // POST /api/venues/:id/favorite
  useRemoveFavorite,          // DELETE /api/venues/:id/favorite
  useUpdateFavorite,          // PATCH /api/venues/:id/favorite
  useCheckFavorite,           // GET /api/venues/:id/favorite
  
  // User
  useUserAddresses,           // GET /api/users/me/addresses
  useCreateAddress,           // POST /api/users/me/addresses
  useUpdateAddress,           // PUT /api/users/me/addresses/:id
  useDeleteAddress,           // DELETE /api/users/me/addresses/:id
  useFavoriteVenues,          // GET /api/users/me/favorite-venues
  useUpdateNotificationPrefs, // PUT /api/users/me/notification-preferences
  useCompleteOnboarding       // PUT /api/users/me/onboarding-complete
} from '../hooks/api';
```

---

## 🔄 Pattern de Migration

### ❌ Avant (Mock Data avec noms français)
```typescript
// Dashboard.tsx - Mock data avec camelCase français
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export function Dashboard() {
  const { currentUser } = useAuth();
  const { 
    getUserMatchs, 
    getUserClients, 
    getUserRestaurants,
    boostsDisponibles 
  } = useAppContext();
  
  const matchs = currentUser ? getUserMatchs(currentUser.id) : [];
  const clients = currentUser ? getUserClients(currentUser.id) : [];
  
  // Noms français
  const matchsAVenir = matchs.filter(m => m.statut === 'à venir').length;
  
  return (
    <div>
      <StatCard title="Matchs à venir" value={matchsAVenir} />
      <StatCard title="Boosts" value={boostsDisponibles} />
    </div>
  );
}
```

### ✅ Après (API avec snake_case backend)
```typescript
// Dashboard.tsx - Utilisant directement les noms backend
import { 
  usePartnerVenues,
  usePartnerAnalytics,
  useBoostSummary 
} from '../hooks/api';

export function Dashboard() {
  const { data: venues, isLoading: venuesLoading } = usePartnerVenues();
  const { data: analytics, isLoading: analyticsLoading } = usePartnerAnalytics();
  const { data: boostData, isLoading: boostLoading } = useBoostSummary();
  
  if (venuesLoading || analyticsLoading || boostLoading) {
    return <LoadingSpinner />;
  }
  
  // ✅ Utiliser directement les noms backend (snake_case)
  const total_matches = analytics?.overview?.total_matches || 0;
  const total_reservations = analytics?.overview?.total_reservations || 0;
  const available_boosts = boostData?.available_boosts || 0;
  
  return (
    <div>
      <h1>Dashboard</h1>
      <StatCard title="Matchs à venir" value={total_matches} />
      <StatCard title="Réservations" value={total_reservations} />
      <StatCard title="Boosts" value={available_boosts} />
    </div>
  );
}
```

### 🎯 Avantages :
- ✅ **Pas de transformation** nécessaire
- ✅ Noms identiques frontend/backend
- ✅ Moins de bugs de mapping
- ✅ Code plus simple et maintenable
- ✅ Autocomplete TypeScript cohérent

---

## 📊 Noms de Champs Standardisés

**Le frontend utilise maintenant les mêmes noms que le backend (snake_case) :**

### User/Auth
```typescript
{
  id: string;
  email: string;
  first_name: string;        // ✅ Plus de "prenom"
  last_name: string;         // ✅ Plus de "nom"
  phone: string;
  avatar_url: string;
  role: 'user' | 'venue_owner' | 'admin';
  created_at: string;
}
```

### Venue
```typescript
{
  id: string;
  name: string;              // ✅ Plus de "nom"
  street_address: string;    // ✅ Plus de "adresse"
  city: string;
  postal_code: string;
  country: string;
  phone: string;
  capacity: number;          // ✅ Plus de "capaciteMax"
  booking_mode: 'INSTANT' | 'REQUEST';
  owner_id: string;
  latitude: number;
  longitude: number;
  created_at: string;
}
```

### Match / VenueMatch
```typescript
{
  id: string;
  venue: {
    id: string;
    name: string;
  };
  match: {
    id: string;
    home_team: string;       // ✅ Plus de "equipe1"
    away_team: string;       // ✅ Plus de "equipe2"
    scheduled_at: string;    // ✅ Plus de "date" + "heure"
    league: string;
    sport: {
      slug: string;
      name: string;
    };
  };
  total_capacity: number;
  reserved_seats: number;    // ✅ Calculé par le backend
  available_capacity: number;
  status: 'upcoming' | 'live' | 'finished';
}
```

### Reservation
```typescript
{
  id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  venue_match: {
    match: {
      home_team: string;
      away_team: string;
      scheduled_at: string;
    };
  };
  party_size: number;        // ✅ Plus de "nombrePlaces"
  status: 'PENDING' | 'CONFIRMED' | 'DECLINED' | 'CANCELED_BY_USER' | 'NO_SHOW';
  special_requests: string;
  created_at: string;
}
```

### Boost
```typescript
{
  id: string;
  type: 'purchased' | 'referral' | 'promotional';
  status: 'available' | 'used' | 'expired';
  source: string;
  venue_match_id: string;
  activated_at: string;
  expires_at: string;
  created_at: string;
}
```

### Referral
```typescript
{
  referral_code: string;     // "MATCH-RESTO-A7B9C2"
  referral_link: string;
  total_invited: number;
  total_signed_up: number;
  total_converted: number;
  total_rewards_earned: number;
  rewards_value: number;
  conversion_rate: number;
  created_at: string;
}
```

---

## 🗺️ Mapping Mock Data → API

| Mock Data | API Endpoint | Hook | Changements de noms |
|-----------|--------------|------|---------------------|
| `mockRestaurants` | `GET /api/partners/venues` | `usePartnerVenues()` | `nom` → `name`, `adresse` → `street_address` |
| `mockMatchs` | `GET /api/partners/venues/matches` | `usePartnerVenueMatches()` | `equipe1/2` → `home_team/away_team` |
| `mockClients` | `GET /api/partners/stats/customers` | `useCustomerStats()` | - |
| `mockReservations` | `GET /api/partners/venues/:id/reservations` | `usePartnerReservations()` | `nombrePlaces` → `party_size` |
| `mockBoosts` | `GET /api/boosts/available` | `useAvailableBoosts()` | - |
| `mockReferralCode` | `GET /api/referral/code` | `useReferralCode()` | - |

---

## 📝 Migration par Composant

### 1️⃣ **Dashboard.tsx**

**Migration :**
```typescript
// ❌ AVANT
const { getUserMatchs, getUserClients, boostsDisponibles } = useAppContext();
const matchs = currentUser ? getUserMatchs(currentUser.id) : [];
const matchsAVenir = matchs.filter(m => m.statut === 'à venir').length;

// ✅ APRÈS - Utiliser directement les noms backend
const { data: analytics } = usePartnerAnalytics();
const { data: boostData } = useBoostSummary();

const total_matches = analytics?.overview?.total_matches || 0;
const total_reservations = analytics?.overview?.total_reservations || 0;
const available_boosts = boostData?.available_boosts || 0;
```

**Checklist :**
- [ ] Remplacer variables françaises par snake_case
- [ ] Utiliser `total_matches` au lieu de `matchsAVenir`
- [ ] Utiliser `available_boosts` au lieu de `boostsDisponibles`
- [ ] Ajouter loading states
- [ ] Tester avec données réelles

---

### 2️⃣ **MesRestaurants.tsx**

**Migration :**
```typescript
// ❌ AVANT
const restaurants = getUserRestaurants(currentUser.id);
const handleAdd = (data) => {
  addRestaurant({ 
    nom: data.nom,
    adresse: data.adresse,
    capaciteMax: data.capaciteMax
  });
};

// ✅ APRÈS - snake_case direct
const { data: venues, isLoading } = usePartnerVenues();
const createVenue = useCreatePartnerVenue();

const handleAdd = async (data) => {
  try {
    await createVenue.mutateAsync({
      name: data.name,                // ✅ Pas de transformation
      street_address: data.street_address,
      city: data.city,
      postal_code: data.postal_code,
      country: data.country || 'FR',
      latitude: data.latitude,
      longitude: data.longitude,
      phone: data.phone,
      capacity: data.capacity
    });
    toast.success('Restaurant ajouté !');
  } catch (error) {
    toast.error('Erreur lors de l\'ajout');
  }
};
```

**Affichage dans le template :**
```typescript
// ✅ Utiliser directement les champs backend
<div className="restaurant-card">
  <h3>{venue.name}</h3>
  <p>{venue.street_address}, {venue.city}</p>
  <p>Capacité: {venue.capacity} places</p>
  <Badge>{venue.booking_mode}</Badge>
</div>
```

**Checklist :**
- [ ] Remplacer `nom` → `name` partout
- [ ] Remplacer `adresse` → `street_address`
- [ ] Remplacer `capaciteMax` → `capacity`
- [ ] Mettre à jour les formulaires avec les nouveaux noms
- [ ] Mettre à jour l'affichage dans les templates

---

### 3️⃣ **MesMatchs.tsx**

**Migration :**
```typescript
// ❌ AVANT
const matchs = getUserMatchs(currentUser.id);
matchs.map(m => (
  <div>
    <h3>{m.equipe1} vs {m.equipe2}</h3>
    <p>{m.date} à {m.heure}</p>
    <p>{m.reservees}/{m.total}</p>
  </div>
));

// ✅ APRÈS - Nouvelle structure backend
const { data: matchesData, isLoading } = usePartnerVenueMatches();

// matchesData.data contient la structure backend
matchesData?.data.map(venueMatch => (
  <div key={venueMatch.id}>
    <h3>{venueMatch.match.home_team} vs {venueMatch.match.away_team}</h3>
    <p>{new Date(venueMatch.match.scheduled_at).toLocaleDateString()}</p>
    <p>{venueMatch.reserved_seats}/{venueMatch.total_capacity}</p>
    <Badge>{venueMatch.status}</Badge>
  </div>
));
```

**Scheduler un match :**
```typescript
const scheduleMatch = useScheduleMatch();

const handleSchedule = async (venueId, matchData) => {
  try {
    await scheduleMatch.mutateAsync({ 
      venueId, 
      matchData: {
        match_id: matchData.match_id,
        total_capacity: matchData.total_capacity
      }
    });
    toast.success('Match programmé !');
  } catch (error) {
    toast.error('Erreur');
  }
};
```

**Checklist :**
- [ ] Remplacer `equipe1/equipe2` → `home_team/away_team`
- [ ] Remplacer `date + heure` → `scheduled_at`
- [ ] Utiliser `reserved_seats` (backend calcule)
- [ ] Utiliser structure `data[]` au lieu de `matches[]`
- [ ] Mettre à jour tous les templates d'affichage

---

### 4️⃣ **Reservations.tsx**

**Migration :**
```typescript
// ❌ AVANT
const reservations = mockReservations.filter(...);
reservations.map(r => (
  <div>
    <p>{r.clientNom}</p>
    <p>{r.nombrePlaces} places</p>
    <p>{r.statut}</p>
  </div>
));

// ✅ APRÈS - Structure backend
const { data: reservationsData } = usePartnerReservations(venueId, { 
  status: 'pending' 
});

reservationsData?.reservations.map(reservation => (
  <div key={reservation.id}>
    <p>{reservation.user.first_name} {reservation.user.last_name}</p>
    <p>{reservation.party_size} places</p>
    <Badge>{reservation.status}</Badge>
    {reservation.special_requests && (
      <p className="text-sm text-gray-500">{reservation.special_requests}</p>
    )}
  </div>
));
```

**Actions :**
```typescript
const updateStatus = useUpdateReservationStatus();

const handleAccept = async (reservationId) => {
  try {
    await updateStatus.mutateAsync({ 
      reservationId, 
      status: 'CONFIRMED' 
    });
    toast.success('Réservation confirmée !');
  } catch (error) {
    toast.error('Erreur');
  }
};
```

**Checklist :**
- [ ] Remplacer `nombrePlaces` → `party_size`
- [ ] Remplacer `clientNom` → `user.first_name + user.last_name`
- [ ] Utiliser status backend: 'PENDING', 'CONFIRMED', etc.
- [ ] Afficher `special_requests`
- [ ] Mettre à jour formulaires et affichages

---

### 5️⃣ **Parrainage.tsx**

**Migration :**
```typescript
// ❌ AVANT
const referralCode = mockReferralCode;
const stats = mockReferralStats;

// ✅ APRÈS - Direct backend
const { data: codeData } = useReferralCode();
const { data: stats } = useReferralStats();
const { data: history } = useReferralHistory({ page: 1, limit: 20 });

// ✅ Utiliser directement les champs backend
const referral_code = codeData?.referral_code;
const referral_link = codeData?.referral_link;

// Affichage stats
<StatCard 
  title="Invitations envoyées" 
  value={stats?.total_invited} 
/>
<StatCard 
  title="Conversions" 
  value={stats?.total_converted} 
/>
<StatCard 
  title="Valeur des récompenses" 
  value={`${stats?.rewards_value}€`} 
/>
<StatCard 
  title="Taux de conversion" 
  value={`${stats?.conversion_rate}%`} 
/>

// Historique
{history?.referred_users.map(user => (
  <div key={user.id}>
    <p>{user.name}</p>
    <Badge>{user.status}</Badge>
    {user.reward_earned && <span>🎁 {user.reward_earned}</span>}
  </div>
))}
```

**Checklist :**
- [ ] Utiliser `referral_code` au lieu de variable française
- [ ] Utiliser `total_converted` pour conversions
- [ ] Utiliser `rewards_value` pour valeur en euros
- [ ] Afficher `conversion_rate`
- [ ] Mettre à jour tous les templates

---

### 6️⃣ **AcheterBoosts.tsx**

**Migration :**
```typescript
// ❌ AVANT
const prices = mockBoostPrices;

// ✅ APRÈS
const { data: prices } = useBoostPrices();
const createCheckout = useCreateBoostCheckout();

// Afficher les prix
{prices?.map(price => (
  <div key={price.pack_type} className="boost-pack">
    <h3>{price.quantity} Boost{price.quantity > 1 ? 's' : ''}</h3>
    <p className="price">{price.price}€</p>
    <p className="unit-price">{price.unit_price}€/boost</p>
    {price.discount_percentage > 0 && (
      <Badge variant="success">-{price.discount_percentage}%</Badge>
    )}
    {price.badge && <Badge>{price.badge}</Badge>}
    <Button onClick={() => handlePurchase(price.pack_type)}>
      Acheter
    </Button>
  </div>
))}
```

**Acheter :**
```typescript
const handlePurchase = async (pack_type: 'single' | 'pack_3' | 'pack_10') => {
  try {
    const { checkout_url, session_id } = await createCheckout.mutateAsync({ 
      pack_type,
      success_url: `${window.location.origin}/boosts/success`,
      cancel_url: `${window.location.origin}/boosts`
    });
    window.location.href = checkout_url;
  } catch (error) {
    toast.error('Erreur checkout');
  }
};
```

**Checklist :**
- [ ] Utiliser `pack_type` (single, pack_3, pack_10)
- [ ] Afficher `unit_price` et `discount_percentage`
- [ ] Gérer `badge` si présent
- [ ] Vérifier flow Stripe complet

---

### 7️⃣ **Booster.tsx**

**Migration :**
```typescript
// ❌ AVANT
const matchs = getUserMatchs(currentUser.id).filter(m => m.statut === 'à venir');

// ✅ APRÈS
const { data: venues } = usePartnerVenues();
const selectedVenue = venues?.[0];
const { data: matches } = useBoostableMatches(selectedVenue?.id);
const activateBoost = useActivateBoost();

// Afficher matchs boostables
{matches?.map(match => (
  <div key={match.id} className="match-card">
    <h3>{match.home_team}</h3>
    <p>{new Date(match.scheduled_at).toLocaleDateString()}</p>
    <p>{match.available_capacity}/{match.total_capacity} places</p>
    
    {match.is_boosted ? (
      <Badge variant="success">⚡ Sponsorisé</Badge>
    ) : (
      <Button onClick={() => handleBoost(match.id)}>
        Booster ce match
      </Button>
    )}
  </div>
))}
```

**Activer boost :**
```typescript
const handleBoost = async (venueMatchId, boostId) => {
  try {
    const result = await activateBoost.mutateAsync({ 
      boost_id: boostId, 
      venue_match_id: venueMatchId 
    });
    toast.success(`⚡ Boost activé jusqu'au ${new Date(result.expires_at).toLocaleDateString()}`);
  } catch (error) {
    toast.error('Erreur activation boost');
  }
};
```

**Checklist :**
- [ ] Vérifier `is_boosted` avant activation
- [ ] Utiliser `home_team` pour affichage
- [ ] Afficher `expires_at` après activation
- [ ] Gérer badge "⚡ Sponsorisé"

---

### 8️⃣ **MesAvis.tsx**

**Migration :**
```typescript
// ❌ AVANT
const avis = mockAvis;

// ✅ APRÈS
const { data: venues } = usePartnerVenues();
const venueId = venues?.[0]?.id;
const { data: reviewsData } = useVenueReviews(venueId, { 
  limit: 50,
  sort: 'recent'
});

// Afficher avis
<div className="reviews-summary">
  <h2>Note moyenne: {reviewsData?.average_rating}/5</h2>
  <p>{reviewsData?.total} avis</p>
</div>

{reviewsData?.reviews.map(review => (
  <div key={review.id} className="review-card">
    <div className="review-header">
      <p className="author">{review.user.first_name} {review.user.last_name}</p>
      <div className="rating">{review.rating}/5 ⭐</div>
    </div>
    <h4>{review.title}</h4>
    <p>{review.content}</p>
    
    {/* Notes détaillées */}
    {review.atmosphere_rating && (
      <Badge>Ambiance: {review.atmosphere_rating}/5</Badge>
    )}
    {review.food_rating && (
      <Badge>Nourriture: {review.food_rating}/5</Badge>
    )}
    {review.service_rating && (
      <Badge>Service: {review.service_rating}/5</Badge>
    )}
    
    <span className="date">{new Date(review.created_at).toLocaleDateString()}</span>
  </div>
))}
```

**Checklist :**
- [ ] Utiliser `average_rating` pour moyenne
- [ ] Afficher notes détaillées (atmosphere, food, service, value)
- [ ] Utiliser `created_at` pour date
- [ ] Ajouter pagination si besoin

---

### 9️⃣ **QRScanner.tsx**

**Migration :**
```typescript
// ✅ Implémenter API réelle avec champs backend
const verifyQR = useVerifyQR();
const checkIn = useCheckInReservation();

const handleScan = async (qrCode: string) => {
  try {
    // 1. Vérifier QR
    const { valid, reservation } = await verifyQR.mutateAsync(qrCode);
    
    if (!valid) {
      toast.error('QR code invalide');
      return;
    }
    
    // 2. Afficher infos (utiliser champs backend)
    const userName = `${reservation.user.first_name} ${reservation.user.last_name}`;
    const partySize = reservation.party_size;
    
    // 3. Check-in
    await checkIn.mutateAsync(reservation.id);
    
    toast.success(`✅ ${userName} enregistré !`);
    toast.info(`Nombre de places: ${partySize}`);
    
  } catch (error) {
    toast.error('Erreur scan QR');
  }
};
```

**Checklist :**
- [ ] Utiliser `party_size` au lieu de `nombrePlaces`
- [ ] Utiliser `first_name`, `last_name`
- [ ] Gérer tous les status possibles
- [ ] Tester avec vrais QR codes

---

### 🔟 **ModifierRestaurant.tsx**

**Migration :**
```typescript
// ✅ Formulaire avec champs backend
const updateVenue = useUpdateVenue();
const updateBookingMode = useUpdateBookingMode();
const updateHours = useUpdateOpeningHours();

const handleSave = async (venueId, formData) => {
  try {
    // 1. Update basic info (déjà en snake_case)
    await updateVenue.mutateAsync({ 
      venueId, 
      data: {
        name: formData.name,
        description: formData.description,
        phone: formData.phone,
        capacity: formData.capacity
      }
    });
    
    // 2. Update booking mode
    if (formData.booking_mode) {
      await updateBookingMode.mutateAsync({ 
        venueId, 
        bookingMode: formData.booking_mode  // 'INSTANT' | 'REQUEST'
      });
    }
    
    // 3. Update opening hours
    if (formData.opening_hours) {
      await updateHours.mutateAsync({ 
        venueId, 
        hours: formData.opening_hours
      });
    }
    
    toast.success('Restaurant mis à jour !');
  } catch (error) {
    toast.error('Erreur mise à jour');
  }
};
```

**Formulaire HTML :**
```typescript
<form onSubmit={handleSubmit}>
  <input 
    name="name"           {/* ✅ snake_case */}
    placeholder="Nom du restaurant"
    value={formData.name}
  />
  
  <input 
    name="street_address" {/* ✅ snake_case */}
    placeholder="Adresse"
    value={formData.street_address}
  />
  
  <input 
    name="capacity"       {/* ✅ snake_case */}
    type="number"
    placeholder="Capacité max"
    value={formData.capacity}
  />
  
  <select name="booking_mode">
    <option value="INSTANT">Confirmation instantanée</option>
    <option value="REQUEST">Sur demande</option>
  </select>
  
  <button type="submit">Enregistrer</button>
</form>
```

**Checklist :**
- [ ] Tous les champs en snake_case
- [ ] Pas de transformation nécessaire
- [ ] Validation côté backend gère les erreurs
- [ ] Mettre à jour tous les formulaires

---

## 🔐 Authentification

### Login/Register avec champs backend

```typescript
// ✅ Register
const registerMutation = useRegister();

const handleRegister = async (formData) => {
  try {
    const { user, token, refresh_token } = await registerMutation.mutateAsync({
      email: formData.email,
      password: formData.password,
      first_name: formData.first_name,    // ✅ snake_case
      last_name: formData.last_name,      // ✅ snake_case
      role: 'venue_owner'
    });
    
    // user contient déjà les bons champs
    console.log(user.first_name, user.last_name);
    
    toast.success('Compte créé !');
    navigate('/onboarding');
    
  } catch (error) {
    toast.error('Erreur lors de l\'inscription');
  }
};
```

**Formulaire Register :**
```typescript
<form onSubmit={handleSubmit}>
  <input 
    name="first_name"     {/* ✅ snake_case */}
    placeholder="Prénom"
  />
  
  <input 
    name="last_name"      {/* ✅ snake_case */}
    placeholder="Nom"
  />
  
  <input 
    name="email"
    type="email"
    placeholder="Email"
  />
  
  <input 
    name="password"
    type="password"
    placeholder="Mot de passe"
  />
  
  <button type="submit">S'inscrire</button>
</form>
```

---

## ⚡ Setup Environnement

### 1. Variables d'environnement

Créer `.env` :
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 2. Configuration API Client

```typescript
// /services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error interceptor avec refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post('/api/auth/refresh-token', { 
            refresh_token: refreshToken 
          });
          localStorage.setItem('authToken', data.token);
          error.config.headers.Authorization = `Bearer ${data.token}`;
          return axios(error.config);
        } catch (refreshError) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 3. TypeScript Types

Créer des types qui correspondent exactement au backend :

```typescript
// /types/venue.types.ts
export interface Venue {
  id: string;
  name: string;
  street_address: string;
  city: string;
  postal_code: string;
  country: string;
  phone: string;
  capacity: number;
  booking_mode: 'INSTANT' | 'REQUEST';
  owner_id: string;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
}

// /types/match.types.ts
export interface VenueMatch {
  id: string;
  venue: {
    id: string;
    name: string;
  } | null;
  match: {
    id: string;
    home_team: string;
    away_team: string;
    scheduled_at: string;
    league?: string | null;
    sport: {
      slug: string;
      name: string;
    };
  } | null;
  total_capacity: number;
  reserved_seats: number;
  available_capacity: number;
  status: 'upcoming' | 'live' | 'finished';
}

// /types/reservation.types.ts
export interface Reservation {
  id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  venue_match: {
    match: {
      home_team: string;
      away_team: string;
      scheduled_at: string;
    };
  };
  party_size: number;
  status: 'PENDING' | 'CONFIRMED' | 'DECLINED' | 'CANCELED_BY_USER' | 'CANCELED_BY_VENUE' | 'NO_SHOW';
  special_requests?: string;
  created_at: string;
  updated_at: string;
}
```

### 4. Hooks avec types corrects

```typescript
// /hooks/api/usePartner.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../services/api';
import type { Venue, VenueMatch, Reservation } from '../../types';

export function usePartnerVenues() {
  return useQuery<Venue[]>({
    queryKey: ['partnerVenues'],
    queryFn: async () => {
      const { data } = await api.get('/partners/venues');
      return data.venues; // ✅ Déjà au bon format
    },
  });
}

export function usePartnerVenueMatches() {
  return useQuery<VenueMatch[]>({
    queryKey: ['partnerVenueMatches'],
    queryFn: async () => {
      const { data } = await api.get('/partners/venues/matches');
      return data.data; // ✅ Déjà au bon format
    },
  });
}

export function usePartnerReservations(venueId: string, params?: any) {
  return useQuery<{ reservations: Reservation[]; total: number }>({
    queryKey: ['partnerReservations', venueId, params],
    queryFn: async () => {
      const { data } = await api.get(`/partners/venues/${venueId}/reservations`, { params });
      return data; // ✅ Déjà au bon format
    },
    enabled: !!venueId,
  });
}
```

---

## 🧪 Tester l'Intégration

### Vérifier les champs dans DevTools

**Network Tab → Response :**
```json
{
  "venues": [
    {
      "id": "...",
      "name": "Le Sportif",              // ✅ Pas "nom"
      "street_address": "10 rue...",     // ✅ Pas "adresse"
      "capacity": 100,                   // ✅ Pas "capaciteMax"
      "booking_mode": "INSTANT"
    }
  ]
}
```

**React Query DevTools :**
- Vérifier que les données sont directement utilisables
- Pas de transformation nécessaire
- Types TypeScript corrects

---

## 🚨 Gestion des Erreurs

### Erreurs de Validation (422)

```typescript
const createVenue = useCreatePartnerVenue();

const handleSubmit = async (formData) => {
  try {
    await createVenue.mutateAsync(formData); // ✅ Déjà au bon format
  } catch (error) {
    if (error.response?.status === 422) {
      const errors = error.response.data.errors;
      
      // Afficher erreurs (champs déjà en snake_case)
      if (errors.street_address) {
        toast.error(`Adresse: ${errors.street_address[0]}`);
      }
      if (errors.postal_code) {
        toast.error(`Code postal: ${errors.postal_code[0]}`);
      }
    }
  }
};
```

---

## ✅ Checklist Migration Complète

### Phase 1 : Setup
- [ ] Variables d'environnement configurées
- [ ] API client configuré
- [ ] **Types TypeScript créés avec snake_case**
- [ ] Query Client Provider installé
- [ ] DevTools React Query ajouté

### Phase 2 : Mise à jour Types
- [ ] Créer `venue.types.ts` avec snake_case
- [ ] Créer `match.types.ts` avec snake_case
- [ ] Créer `reservation.types.ts` avec snake_case
- [ ] Créer `user.types.ts` avec snake_case
- [ ] Créer `boost.types.ts` avec snake_case
- [ ] Créer `referral.types.ts` avec snake_case

### Phase 3 : Migration Composants
- [ ] Dashboard : utiliser `total_matches`, `available_boosts`
- [ ] MesRestaurants : utiliser `name`, `street_address`, `capacity`
- [ ] MesMatchs : utiliser `home_team`, `away_team`, `scheduled_at`
- [ ] Reservations : utiliser `party_size`, `first_name`, `last_name`
- [ ] Parrainage : utiliser `total_converted`, `rewards_value`
- [ ] Boosts : utiliser `pack_type`, `is_boosted`

### Phase 4 : Mise à jour Formulaires
- [ ] Tous les inputs en snake_case
- [ ] Validation côté client avec bons noms
- [ ] Messages d'erreur avec bons noms

### Phase 5 : Mise à jour Affichage
- [ ] Templates utilisent snake_case
- [ ] Aucune transformation dans le JSX
- [ ] Types TypeScript corrects partout

### Phase 6 : Tests
- [ ] Vérifier toutes les requêtes API
- [ ] Vérifier types TypeScript
- [ ] Vérifier affichage
- [ ] Vérifier formulaires
- [ ] Tester erreurs de validation

---

## 🎯 Avantages de cette approche

### ✅ **Simplicité**
```typescript
// Pas besoin de ça :
const nom = venue.name;
const adresse = venue.street_address;

// Directement :
<h3>{venue.name}</h3>
<p>{venue.street_address}</p>
```

### ✅ **Moins de bugs**
Pas de risque d'oublier une transformation ou de se tromper dans le mapping.

### ✅ **Types cohérents**
Les types TypeScript correspondent exactement au backend.

### ✅ **Code maintenable**
Si le backend change un champ, un seul endroit à modifier dans le frontend.

### ✅ **Autocomplete parfait**
L'IDE suggère les bons champs directement depuis les types backend.

---

## 📚 Ressources

**Documentation API complète :**
→ `/PROJECT_ARCHITECTURE.md` (section "API Integration")

**Types Backend :**
→ Créer dans `/types/` avec exactement les mêmes noms que le backend

**React Query Docs :**
→ https://tanstack.com/query/latest/docs/react/overview

---

**Ce guide permet une intégration seamless en utilisant directement les noms backend partout ! 🚀**
