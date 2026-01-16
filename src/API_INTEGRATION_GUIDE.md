# 🔌 API Integration Guide - Match Frontend

**How to connect frontend components to the real backend API**

---

## 📋 Overview

This guide explains how to migrate from mock data to real API calls. The API service layer is already set up in `/services/api.ts` with all endpoints defined.

---

## 🗂️ API Service Structure

All API endpoints are defined in `/services/api.ts`:

| API Object | Description | Backend Route |
|------------|-------------|---------------|
| `authAPI` | Authentication (login, register, logout) | `/api/auth/*` |
| `userAPI` | User profile and settings | `/api/users/*` |
| `venueAPI` | Public venue data | `/api/venues/*` |
| `matchesAPI` | Match listings and details | `/api/matches/*` |
| `reservationsAPI` | User reservations | `/api/reservations/*` |
| `partnerAPI` | **Venue owner dashboard** | `/api/partners/*` |
| `boostAPI` | Boost purchasing and management | `/api/boosts/*` |
| `referralAPI` | Referral/parrainage system | `/api/referral/*` |
| `notificationsAPI` | User notifications | `/api/notifications/*` |
| `reviewsAPI` | Venue reviews | `/api/reviews/*` |
| `subscriptionsAPI` | Subscription management | `/api/subscriptions/*` |

---

## 🪝 React Query Hooks

All hooks are in `/hooks/api/`:

### Partner/Venue Owner Hooks (`usePartner.ts`)
```typescript
import { usePartnerVenues, usePartnerVenueMatches, useVenueClients } from '../hooks/api';

// Get all venues owned by current user
const { data: venues, isLoading } = usePartnerVenues();

// Get all matches scheduled at partner venues
const { data: matches } = usePartnerVenueMatches();

// Get clients for a specific venue
const { data: clients } = useVenueClients(venueId);
```

### Boost Hooks (`useBoosts.ts`)
```typescript
import { useAvailableBoosts, useBoostSummary, useActivateBoost } from '../hooks/api';

// Get available boosts count
const { data: boosts } = useAvailableBoosts();

// Get boost summary for dashboard
const { data: summary } = useBoostSummary();

// Activate a boost on a match
const activateMutation = useActivateBoost();
activateMutation.mutate({ boost_id: '...', venue_match_id: '...' });
```

### Referral Hooks (`useReferrals.ts`)
```typescript
import { useMyReferralCode, useReferralStats, useReferralHistory } from '../hooks/api';

// Get user's referral code
const { data: codeData } = useMyReferralCode();

// Get referral statistics
const { data: stats } = useReferralStats();
```

---

## 🔄 Migration Pattern

### Before (Mock Data)
```typescript
// Dashboard.tsx - Using mock data
import { useAppContext } from '../context/AppContext';

export function Dashboard() {
  const { getUserMatchs, getUserClients, boostsDisponibles } = useAppContext();
  const matchs = currentUser ? getUserMatchs(currentUser.id) : [];
  const clients = currentUser ? getUserClients(currentUser.id) : [];
  
  // Use matchs, clients, boostsDisponibles...
}
```

### After (Real API)
```typescript
// Dashboard.tsx - Using real API
import { usePartnerVenueMatches, usePartnerCustomerStats, useBoostSummary } from '../hooks/api';

export function Dashboard() {
  const { data: matchesData, isLoading: matchesLoading } = usePartnerVenueMatches();
  const { data: customerStats, isLoading: statsLoading } = usePartnerCustomerStats();
  const { data: boostSummary } = useBoostSummary();
  
  const matches = matchesData?.matches || [];
  const boostsDisponibles = boostSummary?.available_boosts || 0;
  
  if (matchesLoading || statsLoading) {
    return <LoadingSpinner />;
  }
  
  // Use real data...
}
```

---

## 🗺️ Endpoint Mapping: Mock → API

| Mock Data | API Endpoint | Hook |
|-----------|--------------|------|
| `mockRestaurants` | `GET /api/partners/venues` | `usePartnerVenues()` |
| `mockMatchs` | `GET /api/partners/venues/matches` | `usePartnerVenueMatches()` |
| `mockClients` | `GET /api/partners/venues/:id/clients` | `useVenueClients(id)` |
| `mockReservations` | `GET /api/partners/venues/:id/reservations` | `useVenueReservations(id)` |
| `mockNotifications` | `GET /api/notifications` | `useNotifications()` |
| `mockStats` | `GET /api/partners/analytics/dashboard` | `usePartnerAnalyticsDashboard()` |
| `mockBoosts` | `GET /api/boosts/available` | `useAvailableBoosts()` |
| `mockAvis` | `GET /api/venues/:id/reviews` | `useVenueReviews(id)` |
| `mockReferralStats` | `GET /api/referral/stats` | `useReferralStats()` |

---

## 📝 Component Migration Checklist

### Dashboard.tsx
- [ ] Replace `getUserMatchs()` → `usePartnerVenueMatches()`
- [ ] Replace `getUserClients()` → `usePartnerCustomerStats()`
- [ ] Replace `boostsDisponibles` → `useBoostSummary()`
- [ ] Add loading states
- [ ] Add error handling

### MesRestaurants.tsx
- [ ] Replace `getUserRestaurants()` → `usePartnerVenues()`
- [ ] Use `useCreatePartnerVenue()` for adding venues
- [ ] Add loading/error states

### MesMatchs.tsx
- [ ] Replace `getUserMatchs()` → `usePartnerVenueMatches()`
- [ ] Use `useScheduleMatch()` for scheduling
- [ ] Use `useCancelMatch()` for cancellation

### Reservations.tsx
- [ ] Replace mock reservations → `useVenueReservations(venueId)`
- [ ] Use `useUpdateReservationStatus()` for accept/decline
- [ ] Use `useMarkNoShow()` for no-shows

### Parrainage.tsx
- [ ] Replace mock referral data → `useMyReferralCode()`, `useReferralStats()`
- [ ] Use `useReferralHistory()` for referred users list

### AcheterBoosts.tsx
- [ ] Replace mock boost prices → `useBoostPrices()`
- [ ] Use `useCreateBoostCheckout()` for purchase flow
- [ ] Use `useVerifyBoostPurchase()` after Stripe redirect

### Booster.tsx
- [ ] Replace mock data → `useBoostableMatches(venueId)`
- [ ] Use `useActivateBoost()` to apply boosts

---

## 🔐 Authentication

The API client automatically:
1. Adds `Authorization: Bearer <token>` header from `localStorage.authToken`
2. Handles 401 errors by refreshing token from `localStorage.refreshToken`
3. Redirects to `/login` if refresh fails

---

## ⚡ Environment Setup

Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3000/api
```

For production:
```env
VITE_API_BASE_URL=https://api.matchapp.fr/api
```

---

## 🧪 Testing the Integration

1. Start the backend: `cd match-api && bun run dev`
2. Start the frontend: `cd match-frontend && bun run dev`
3. Login with a seeded user
4. Check Network tab for API calls
5. Verify data matches database

---

## 📊 Data Type Differences

### Backend vs Frontend Field Names

| Backend (snake_case) | Frontend (camelCase) |
|---------------------|---------------------|
| `first_name` | `prenom` |
| `last_name` | `nom` |
| `street_address` | `adresse` |
| `party_size` | `nombrePlaces` |
| `scheduled_at` | `date` + `heure` |
| `booking_mode` | `bookingMode` |

Consider adding transform functions in API hooks to map between formats.

---

**This document will help you migrate all components from mock data to real API! 🚀**
