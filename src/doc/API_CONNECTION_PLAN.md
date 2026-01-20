# 📋 API Connection Plan - Match Frontend

**Complete mapping of frontend pages to backend API endpoints**  
*Last updated: January 2026*

---

## 📊 Overview

This document provides a comprehensive plan for connecting all frontend pages to the backend API. The migration follows a phased approach, starting with critical authentication and core features.

### Quick Stats

| Category | Pages | Status |
|----------|-------|--------|
| Authentication | 2 | 🔴 To Do |
| Onboarding | 5 | 🔴 To Do |
| Dashboard | 1 | 🔴 To Do |
| Établissements | 4 | 🔴 To Do |
| Matchs | 5 | 🔴 To Do |
| Réservations | 2 | 🔴 To Do |
| Boosts | 2 | 🔴 To Do |
| Parrainage | 2 | 🔴 To Do |
| Compte | 3 | 🔴 To Do |
| **Total** | **26** | |

---

## 🎯 Migration Phases

### Phase 1 - Critical (Authentication & Core)
1. Login
2. Register
3. Dashboard
4. Mes Restaurants

### Phase 2 - Core Features
5. Programmer Match
6. Mes Matchs
7. Réservations
8. QR Scanner

### Phase 3 - Onboarding Flow
9. Onboarding Welcome
10. Infos Établissement
11. Facturation
12. Paiement Validation
13. Confirmation Onboarding

### Phase 4 - Advanced Features
14. Booster
15. Acheter Boosts
16. Parrainage
17. Referral Page
18. Compte
19. Mes Avis
20. Notification Center

### Phase 5 - Remaining Pages
21. Liste Matchs
22. Match Detail
23. Modifier Match
24. Ajouter Restaurant
25. Modifier Restaurant
26. Restaurant Detail

---

## 🔐 Authentication (2 pages)

### 1. Login

**File:** `/components/Login.tsx`

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Authenticate user |

**Request:**
```typescript
{
  email: string;
  password: string;
}
```

**Response:**
```typescript
{
  user: User;
  token: string;
  refresh_token: string;
}
```

**Services/Hooks to use:**
- `useLogin()` from `/hooks/useAuth.ts`
- `login()` from `/services/users.service.ts`

**Implementation Notes:**
- Store token in localStorage/sessionStorage
- Redirect to Dashboard on success
- Handle error states (invalid credentials, network error)

---

### 2. Register

**File:** `/components/Register.tsx`

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new user account |
| POST | `/api/referral/validate` | Validate referral code (optional) |

**Request:**
```typescript
{
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: 'user' | 'venue_owner' | 'admin';
  referral_code?: string;
}
```

**Response:**
```typescript
{
  user: User;
  token: string;
  refresh_token: string;
}
```

**Services/Hooks to use:**
- `useRegister()` from `/hooks/useAuth.ts`
- `register()` from `/services/users.service.ts`
- `validateReferralCode()` from `/services/referral.service.ts`

**Implementation Notes:**
- Validate referral code before registration if provided
- Store token after successful registration
- Redirect to onboarding flow for venue_owner role

---

## 🚀 Onboarding (5 pages)

### 3. Onboarding Welcome

**File:** `/pages/onboarding-welcome/OnboardingWelcome.tsx`

**API Endpoints:** None (static page)

**Implementation Notes:**
- No API calls needed
- Navigation to next onboarding step

---

### 4. Infos Établissement

**File:** `/pages/infos-etablissement/InfosEtablissement.tsx`

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/partners/venues` | Create new venue |
| GET | `/api/amenities` | Get available amenities |
| PUT | `/api/venues/:venueId/amenities` | Set venue amenities |

**Services/Hooks to use:**
- `useCreateVenue()` from `/hooks/useVenues.ts`
- `getAllAmenities()` from `/services/venues.service.ts`

**Implementation Notes:**
- Load amenities on mount
- Create venue with basic info
- Save venue ID for next steps

---

### 5. Facturation

**File:** `/pages/facturation/Facturation.tsx`

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/subscriptions/plans` | Get available subscription plans |

**Services/Hooks to use:**
- `getSubscriptionPlans()` from `/services/subscriptions.service.ts`

**Implementation Notes:**
- Display subscription plans (Basic, Pro, Enterprise)
- Allow selection of billing period (monthly/yearly)

---

### 6. Paiement Validation

**File:** `/pages/paiement-validation/PaiementValidation.tsx`

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/subscriptions/create-checkout` | Create Stripe checkout session |

**Request:**
```typescript
{
  plan: 'basic' | 'pro' | 'enterprise';
  billing_period?: 'monthly' | 'yearly';
}
```

**Response:**
```typescript
{
  checkout_url: string;
  session_id: string;
}
```

**Services/Hooks to use:**
- `createSubscriptionCheckout()` from `/services/subscriptions.service.ts`

**Implementation Notes:**
- Redirect to Stripe checkout URL
- Store session_id for verification

---

### 7. Confirmation Onboarding

**File:** `/pages/confirmation-onboarding/ConfirmationOnboarding.tsx`

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/partners/venues/verify-checkout` | Verify Stripe payment |
| PUT | `/api/users/me/onboarding-complete` | Mark onboarding complete |

**Services/Hooks to use:**
- `verifyCheckout()` from `/services/subscriptions.service.ts`
- `completeOnboarding()` from `/services/users.service.ts`

**Implementation Notes:**
- Verify payment on page load (from URL params)
- Mark user onboarding as complete
- Redirect to Dashboard

---

## 📊 Dashboard (1 page)

### 8. Dashboard

**File:** `/pages/dashboard/Dashboard.tsx`

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/partners/analytics/dashboard` | Get dashboard analytics |
| GET | `/api/partners/venues` | Get user's venues |
| GET | `/api/boosts/summary` | Get boost summary |
| GET | `/api/partners/venues/matches` | Get all scheduled matches |

**Response (analytics/dashboard):**
```typescript
{
  overview: {
    total_venues: number;
    total_matches: number;
    total_reservations: number;
  };
  reservations_by_status: {
    pending: number;
    confirmed: number;
    canceled: number;
  };
  capacity_utilization: number;
}
```

**Services/Hooks to use:**
- `getDashboardAnalytics()` from `/services/analytics.service.ts`
- `useMyVenues()` from `/hooks/useVenues.ts`
- `useBoostSummary()` from `/hooks/useBoosts.ts`
- `useMyMatches()` from `/hooks/useMatches.ts`

**Implementation Notes:**
- Load all data in parallel with Promise.all
- Display loading states
- Handle empty states (new user with no venues)

---

## 🏢 Établissements / Venues (4 pages)

### 9. Mes Restaurants

**File:** `/pages/mes-restaurants/MesRestaurants.tsx`

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/partners/venues` | Get user's venues |
| GET | `/api/partners/venues/:venueId/subscription` | Get venue subscription |

**Response (venues):**
```typescript
{
  venues: Venue[];
}
```

**Services/Hooks to use:**
- `useMyVenues()` from `/hooks/useVenues.ts`
- `getVenueSubscription()` from `/services/venues.service.ts`

**Implementation Notes:**
- Display list of user's venues
- Show subscription status for each venue
- Link to modify/view venue details

---

### 10. Ajouter Restaurant

**File:** `/pages/ajouter-restaurant/AjouterRestaurant.tsx`

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/partners/venues` | Create new venue |
| POST | `/api/subscriptions/create-checkout` | Create subscription checkout |

**Services/Hooks to use:**
- `useCreateVenue()` from `/hooks/useVenues.ts`
- `createSubscriptionCheckout()` from `/services/subscriptions.service.ts`

**Implementation Notes:**
- Similar to onboarding venue creation
- Redirect to Stripe for subscription payment

---

### 11. Modifier Restaurant

**File:** `/pages/modifier-restaurant/ModifierRestaurant.tsx`

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/venues/:venueId` | Get venue details |
| PUT | `/api/venues/:venueId` | Update venue |
| GET | `/api/venues/:venueId/photos` | Get venue photos |
| POST | `/api/venues/:venueId/photos` | Upload photo |
| DELETE | `/api/venues/:venueId/photos/:photoId` | Delete photo |
| PUT | `/api/venues/:venueId/photos/:photoId/primary` | Set primary photo |
| GET | `/api/venues/:venueId/opening-hours` | Get opening hours |
| PUT | `/api/venues/:venueId/opening-hours` | Update opening hours |
| GET | `/api/venues/:venueId/amenities` | Get venue amenities |
| PUT | `/api/venues/:venueId/amenities` | Update amenities |
| PUT | `/api/venues/:venueId/booking-mode` | Update booking mode |

**Services/Hooks to use:**
- `useVenueDetails()` from `/hooks/useVenues.ts`
- `useUpdateVenue()` from `/hooks/useVenues.ts`
- Multiple photo/hours/amenities services

**Implementation Notes:**
- Load all venue data on mount
- Handle photo upload with preview
- Save changes on form submit

---

### 12. Restaurant Detail

**File:** `/pages/restaurant-detail/RestaurantDetail.tsx`

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/venues/:venueId` | Get venue details |
| GET | `/api/venues/:venueId/photos` | Get venue photos |
| GET | `/api/venues/:venueId/reviews` | Get venue reviews |

**Services/Hooks to use:**
- `useVenueDetails()` from `/hooks/useVenues.ts`
- `getVenuePhotos()` from `/services/venues.service.ts`
- `getVenueReviews()` from `/services/reviews.service.ts`

---

## ⚽ Matchs (5 pages)

### 13. Liste Matchs

**File:** `/pages/liste-matchs/ListeMatchs.tsx`

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/matches/upcoming` | Get upcoming matches |
| GET | `/api/matches` | Get matches with filters |
| GET | `/api/sports` | Get all sports |
| GET | `/api/sports/:sportId/leagues` | Get leagues for sport |

**Services/Hooks to use:**
- `useUpcomingMatches()` from `/hooks/useMatches.ts`
- `useAllSports()` from `/hooks/useMatches.ts`

---

### 14. Mes Matchs

**File:** `/pages/mes-matchs/MesMatchs.tsx`

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/partners/venues/matches` | Get all venue matches |
| GET | `/api/partners/venues/:venueId/reservations` | Get reservations |

**Response (venues/matches):**
```typescript
{
  data: [
    {
      id: string;
      venue: { id: string; name: string } | null;
      match: {
        id: string;
        homeTeam: string;
        awayTeam: string;
        scheduled_at: string;
        league?: string | null;
      } | null;
      total_capacity: number;
      reserved_seats: number;
      available_capacity: number;
      status: 'upcoming' | 'live' | 'finished';
    }
  ];
}
```

**Services/Hooks to use:**
- `useMyMatches()` from `/hooks/useMatches.ts`
- `useVenueReservations()` from `/hooks/useReservations.ts`

---

### 15. Match Detail

**File:** `/pages/match-detail/MatchDetail.tsx`

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/matches/:matchId` | Get match details |
| GET | `/api/matches/:matchId/venues` | Get venues broadcasting |
| GET | `/api/reservations/venue-match/:venueMatchId` | Get reservations for venue match |

**Services/Hooks to use:**
- `useMatchDetails()` from `/hooks/useMatches.ts`
- `getVenueMatchReservations()` from `/services/reservations.service.ts`

---

### 16. Programmer Match

**File:** `/pages/programmer-match/ProgrammerMatch.tsx`

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/matches/upcoming` | Get available matches |
| GET | `/api/partners/venues` | Get user's venues |
| POST | `/api/partners/venues/:venueId/matches` | Schedule match at venue |

**Request (create venue match):**
```typescript
{
  match_id: string;
  total_capacity: number;
}
```

**Services/Hooks to use:**
- `useUpcomingMatches()` from `/hooks/useMatches.ts`
- `useMyVenues()` from `/hooks/useVenues.ts`
- `createVenueMatch()` from `/services/matches.service.ts`

---

### 17. Modifier Match

**File:** `/pages/modifier-match/ModifierMatch.tsx`

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/partners/venues/:venueId/matches/:matchId` | Update venue match |
| DELETE | `/api/partners/venues/:venueId/matches/:matchId` | Cancel venue match |

**Services/Hooks to use:**
- `updateVenueMatch()` from `/services/matches.service.ts`
- `deleteVenueMatch()` from `/services/matches.service.ts`

---

## 📅 Réservations (2 pages)

### 18. Réservations

**File:** `/pages/reservations/Reservations.tsx`

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/partners/venues/:venueId/reservations` | Get venue reservations |
| GET | `/api/partners/venues/:venueId/reservations/stats` | Get reservation stats |
| PATCH | `/api/partners/reservations/:reservationId/status` | Update status |
| POST | `/api/partners/reservations/:reservationId/mark-no-show` | Mark no-show |

**Services/Hooks to use:**
- `useVenueReservations()` from `/hooks/useReservations.ts`
- `useUpdateReservationStatus()` from `/hooks/useReservations.ts`

---

### 19. QR Scanner

**File:** `/pages/qr-scanner/QRScanner.tsx`

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reservations/verify-qr` | Verify QR code |
| POST | `/api/reservations/:reservationId/check-in` | Check-in reservation |

**Request (verify-qr):**
```typescript
{
  qr_code: string;
}
```

**Response:**
```typescript
{
  valid: boolean;
  reservation: Reservation;
}
```

**Services/Hooks to use:**
- `verifyQRCode()` from `/services/reservations.service.ts`
- `checkInReservation()` from `/services/reservations.service.ts`

---

## ⚡ Boosts (2 pages)

### 20. Booster

**File:** `/pages/booster/Booster.tsx`

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/boosts/summary` | Get boost summary |
| GET | `/api/boosts/boostable/:venueId` | Get boostable matches |
| POST | `/api/boosts/activate` | Activate boost |
| POST | `/api/boosts/deactivate` | Deactivate boost |
| GET | `/api/boosts/history` | Get boost history |

**Services/Hooks to use:**
- `useBoostSummary()` from `/hooks/useBoosts.ts`
- `useActivateBoost()` from `/hooks/useBoosts.ts`
- `getBoostableMatches()` from `/services/boosts.service.ts`

---

### 21. Acheter Boosts

**File:** `/pages/acheter-boosts/AcheterBoosts.tsx`

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/boosts/prices` | Get boost prices |
| POST | `/api/boosts/purchase/create-checkout` | Create checkout |
| POST | `/api/boosts/purchase/verify` | Verify purchase |

**Services/Hooks to use:**
- `getBoostPrices()` from `/services/boosts.service.ts`
- `createBoostCheckout()` from `/services/boosts.service.ts`

---

## 🎁 Parrainage (2 pages)

### 22. Parrainage

**File:** `/pages/parrainage/Parrainage.tsx`

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/referral/code` | Get referral code |
| GET | `/api/referral/stats` | Get referral stats |
| GET | `/api/referral/history` | Get referral history |
| GET | `/api/referral/boosts` | Get earned boosts |
| POST | `/api/referral/boosts/:boostId/use` | Use referral boost |

**Services/Hooks to use:**
- `useMyReferralCode()` from `/hooks/useReferral.ts`
- `useReferralStats()` from `/hooks/useReferral.ts`

---

### 23. Referral Page

**File:** `/pages/referral/ReferralPage.tsx`

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/referral/validate` | Validate referral code |

**Services/Hooks to use:**
- `validateReferralCode()` from `/services/referral.service.ts`

---

## 👤 Compte Utilisateur (3 pages)

### 24. Compte

**File:** `/pages/compte/Compte.tsx`

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/me` | Update profile |
| GET | `/api/subscriptions/me` | Get subscription |
| POST | `/api/subscriptions/me/cancel` | Cancel subscription |
| PUT | `/api/users/me/notification-preferences` | Update notifications |

**Services/Hooks to use:**
- `useProfile()` from `/hooks/useAuth.ts`
- `useMySubscription()` from `/hooks/useSubscriptions.ts`

---

### 25. Mes Avis

**File:** `/pages/mes-avis/MesAvis.tsx`

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/venues/:venueId/reviews` | Get venue reviews |
| POST | `/api/venues/:venueId/reviews` | Create review |
| PUT | `/api/reviews/:reviewId` | Update review |
| DELETE | `/api/reviews/:reviewId` | Delete review |

**Services/Hooks to use:**
- `getVenueReviews()` from `/services/reviews.service.ts`

---

### 26. Notification Center

**File:** `/pages/notification-center/NotificationCenter.tsx`

**API Endpoints:**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get notifications |
| PUT | `/api/notifications/:notificationId/read` | Mark as read |
| PUT | `/api/notifications/read-all` | Mark all as read |
| DELETE | `/api/notifications/:notificationId` | Delete notification |

**Services/Hooks to use:**
- `getMyNotifications()` from `/services/notifications.service.ts`
- `markNotificationAsRead()` from `/services/notifications.service.ts`

---

## 📌 Static Pages

### App Presentation

**File:** `/pages/app-presentation/AppPresentation.tsx`

**API Endpoints:** None (static page)

---

## 🔧 Implementation Checklist

### Phase 1 - Critical ✅ COMPLETED
- [x] Login (`/components/Login.tsx`)
- [x] Register (`/components/Register.tsx`)
- [x] Dashboard (`/pages/dashboard/Dashboard.tsx`)
- [x] Mes Restaurants (`/pages/mes-restaurants/MesRestaurants.tsx`)

### Phase 2 - Core Features
- [ ] Programmer Match (`/pages/programmer-match/ProgrammerMatch.tsx`)
- [ ] Mes Matchs (`/pages/mes-matchs/MesMatchs.tsx`)
- [ ] Réservations (`/pages/reservations/Reservations.tsx`)
- [ ] QR Scanner (`/pages/qr-scanner/QRScanner.tsx`)

### Phase 3 - Onboarding
- [ ] Onboarding Welcome (`/pages/onboarding-welcome/OnboardingWelcome.tsx`)
- [ ] Infos Établissement (`/pages/infos-etablissement/InfosEtablissement.tsx`)
- [ ] Facturation (`/pages/facturation/Facturation.tsx`)
- [ ] Paiement Validation (`/pages/paiement-validation/PaiementValidation.tsx`)
- [ ] Confirmation Onboarding (`/pages/confirmation-onboarding/ConfirmationOnboarding.tsx`)

### Phase 4 - Advanced
- [ ] Booster (`/pages/booster/Booster.tsx`)
- [ ] Acheter Boosts (`/pages/acheter-boosts/AcheterBoosts.tsx`)
- [ ] Parrainage (`/pages/parrainage/Parrainage.tsx`)
- [ ] Referral Page (`/pages/referral/ReferralPage.tsx`)
- [ ] Compte (`/pages/compte/Compte.tsx`)
- [ ] Mes Avis (`/pages/mes-avis/MesAvis.tsx`)
- [ ] Notification Center (`/pages/notification-center/NotificationCenter.tsx`)

### Phase 5 - Remaining
- [ ] Liste Matchs (`/pages/liste-matchs/ListeMatchs.tsx`)
- [ ] Match Detail (`/pages/match-detail/MatchDetail.tsx`)
- [ ] Modifier Match (`/pages/modifier-match/ModifierMatch.tsx`)
- [ ] Ajouter Restaurant (`/pages/ajouter-restaurant/AjouterRestaurant.tsx`)
- [ ] Modifier Restaurant (`/pages/modifier-restaurant/ModifierRestaurant.tsx`)
- [ ] Restaurant Detail (`/pages/restaurant-detail/RestaurantDetail.tsx`)

---

## 📚 Resources

- **Services:** `/services/*.service.ts`
- **Hooks:** `/hooks/use*.ts`
- **API Helpers:** `/utils/api-helpers.ts`
- **API Constants:** `/utils/api-constants.ts`
- **Backend Routes:** `/match-api/API_ROUTES.md`

---

*This document will be updated as pages are migrated to the real API.*
