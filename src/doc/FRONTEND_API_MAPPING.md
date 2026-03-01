# Mapping Frontend Pages to API Endpoints

This document lists all the frontend pages in the `match-frontend` application and identifies the corresponding API endpoints from `match-api` that need to be connected.

> **Note:** All API routes are prefixed with `/api`.
> **Authentication:** Most routes require a Bearer token in the `Authorization` header.

## 1. Authentication & Onboarding

| Page / Component | Feature | API Endpoints | Method | Notes |
|------------------|---------|---------------|--------|-------|
| `Login.tsx` | User Login | `/auth/login` | `POST` | Returns JWT tokens & user info |
| `Register.tsx` | User Registration | `/auth/register` | `POST` | Handles both User and Venue Owner registration |
| | Referral Validation | `/referral/validate` | `POST` | Checks referral code validity |
| | Register Referral | `/referral/register` | `POST` | Links new user to referrer |
| `InfosEtablissement.tsx` | Create Venue (Step 1) | `/partners/venues` | `POST` | Initiates venue creation (often part of checkout flow) |
| `Facturation.tsx` | Subscription Plans | `/subscriptions/plans` | `GET` | Fetches available plans |
| `PaiementValidation.tsx` | Checkout | `/subscriptions/create-checkout` | `POST` | Creates Stripe session |
| `ConfirmationOnboarding.tsx` | Finalize | `/partners/venues/verify-checkout` | `POST` | Verifies payment & activates venue |

## 2. Dashboard

| Page | Feature | API Endpoints | Method | Notes |
|------|---------|---------------|--------|-------|
| `Dashboard.tsx` | Overview Stats | `/partners/analytics/dashboard` | `GET` | Key metrics (clients, revenue, etc.) |
| | Upcoming Matches | `/partners/venues/matches` | `GET` | Filter by status='upcoming' |
| | Recent Activity | `/partners/activity` | `GET` | Recent reservations/reviews |
| `NotificationCenter.tsx` | Notifications | `/notifications` | `GET` | List user notifications |
| | Mark Read | `/notifications/:id/read` | `PUT` | |
| | Mark All Read | `/notifications/read-all` | `PUT` | |

## 3. Venue Management (Mes Établissements)

| Page | Feature | API Endpoints | Method | Notes |
|------|---------|---------------|--------|-------|
| `MesRestaurants.tsx` | List Venues | `/partners/venues` | `GET` | List all venues owned by user |
| `AjouterRestaurant.tsx` | Create Venue | `/partners/venues` | `POST` | |
| `RestaurantDetail.tsx` | Venue Details | `/venues/:id` | `GET` | Public venue info |
| | Analytics | `/venues/:id/analytics/overview` | `GET` | Venue specific stats |
| `ModifierRestaurant.tsx` | Update Info | `/venues/:id` | `PUT` | Update basics |
| | Photos | `/venues/:id/photos` | `POST/DELETE` | Manage gallery |
| | Opening Hours | `/venues/:id/opening-hours` | `PUT` | |
| | Amenities | `/venues/:id/amenities` | `PUT` | |
| | Booking Mode | `/venues/:id/booking-mode` | `PUT` | Toggle Instant/Request |

## 4. Match Management (Mes Matchs)

| Page | Feature | API Endpoints | Method | Notes |
|------|---------|---------------|--------|-------|
| `MesMatchs.tsx` | List My Matches | `/partners/venues/matches` | `GET` | List scheduled matches |
| `ListeMatchs.tsx` | List All Matches | `/matches` | `GET` | Public match list (reference) |
| `ProgrammerMatch.tsx` | Search Matches | `/matches/upcoming` | `GET` | Find matches to schedule |
| | Schedule Match | `/partners/venues/:id/matches` | `POST` | Add match to venue |
| `ModifierMatch.tsx` | Update Schedule | `/partners/venues/:venueId/matches/:matchId` | `PUT` | Update capacity/price |
| | Cancel Schedule | `/partners/venues/:venueId/matches/:matchId` | `DELETE` | Remove match |
| `MatchDetail.tsx` | Match Info | `/matches/:id` | `GET` | Sports details |
| | Reservations | `/reservations/venue-match/:id` | `GET` | List reservations for this match |

## 5. Reservations & Clients

| Page | Feature | API Endpoints | Method | Notes |
|------|---------|---------------|--------|-------|
| `Reservations.tsx` | List Reservations | `/partners/venues/:venueId/reservations` | `GET` | Filter by status/date |
| | Update Status | `/partners/reservations/:id/status` | `PATCH` | Confirm/Decline requests |
| | Mark No-Show | `/partners/reservations/:id/mark-no-show` | `POST` | |
| `QRScanner.tsx` | Verify QR | `/reservations/verify-qr` | `POST` | Scan customer code |
| | Check-in | `/reservations/:id/check-in` | `POST` | Validate arrival |
| `ClientsDetail.tsx` | Client Stats | `/partners/stats/customers` | `GET` | Aggregate client data |

## 6. Boosts & Marketing

| Page | Feature | API Endpoints | Method | Notes |
|------|---------|---------------|--------|-------|
| `Booster.tsx` | Boost Summary | `/boosts/summary` | `GET` | Active boosts, stats |
| | Available Boosts | `/boosts/available` | `GET` | Inventory |
| | Activate Boost | `/boosts/activate` | `POST` | Apply boost to match |
| | History | `/boosts/history` | `GET` | Past boosts |
| `AcheterBoosts.tsx` | Get Prices | `/boosts/prices` | `GET` | Pack options |
| | Purchase | `/boosts/purchase/create-checkout` | `POST` | Stripe checkout for boosts |

## 7. Referral (Parrainage)

| Page | Feature | API Endpoints | Method | Notes |
|------|---------|---------------|--------|-------|
| `Parrainage.tsx` | My Code | `/referral/code` | `GET` | Get user's referral code |
| | Stats | `/referral/stats` | `GET` | Successful referrals |
| | History | `/referral/history` | `GET` | List of referred users |

## 8. Account & Settings

| Page | Feature | API Endpoints | Method | Notes |
|------|---------|---------------|--------|-------|
| `MonCompte.tsx` | User Profile | `/users/me` | `GET` | |
| `CompteInfos.tsx` | Update Profile | `/users/me` | `PUT` | |
| `CompteFacturation.tsx`| Subscription | `/subscriptions/me` | `GET` | Current plan status |
| | Invoices | `/subscriptions/invoices` | `GET` | Billing history |
| | Payment Method | `/subscriptions/me/update-payment-method` | `POST` | Stripe Portal |
| `CompteNotifications.tsx`| Preferences | `/users/me/notification-preferences` | `GET`, `PUT` | |
| `CompteDonnees.tsx` | Privacy Preferences | `/users/me/privacy-preferences` | `GET`, `PUT` | Includes `account_deletion_grace_days` |
| `CompteDonnees.tsx` | GDPR Export Request | `/support/data-export-request` | `POST` | |
| `CompteDonnees.tsx` | Account Deactivation | `/users/me` | `DELETE` | Soft delete with grace period |
| `CompteSecurite.tsx` | Password | `/users/me/password` | `PUT` | |
| `CompteSecurite.tsx` | Sessions | `/users/me/sessions` | `GET` | Active sessions |
| `CompteSecurite.tsx` | Revoke Other Sessions | `/users/me/sessions/others` | `DELETE` | |
| `CompteSecurite.tsx` | Revoke One Session | `/users/me/sessions/:sessionId` | `DELETE` | |
| `AuthenticatedLayout.tsx` | Session Heartbeat | `/users/me/session-heartbeat` | `POST` | Activity refresh |

## 9. Reviews (Avis)

| Page | Feature | API Endpoints | Method | Notes |
|------|---------|---------------|--------|-------|
| `MesAvis.tsx` | List Reviews | `/venues/:id/reviews` | `GET` | Reviews for my venues |
| | Reply | `/reviews/:id/reply` | `POST` | *If implemented* |

---

**Next Steps:**
1. Configure `axios` or `fetch` client with base URL and interceptors for token.
2. Replace mock data calls in pages with real API calls using the `useApi` hook or similar.
3. Handle loading and error states for each connection.
