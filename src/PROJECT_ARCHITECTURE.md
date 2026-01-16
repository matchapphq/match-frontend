# 🏗️ Project Architecture - Match Platform

**Documentation complète de l'architecture du projet Match**

---

## 📊 Vue d'Ensemble

```
Match Platform
├── Frontend : React + TypeScript + Vite
├── Styling : Tailwind CSS v4 + Design System Match
├── State Management : Context API (Auth + App)
├── Build Tool : Vite
└── Backend : API REST (specs définies, implémentation partielle)
```

---

## 📁 Structure des Dossiers

```
/
├── components/              # Composants React principaux (legacy structure)
│   ├── ui/                  # Composants UI shadcn/ui
│   ├── compte/              # Pages compte utilisateur
│   └── details/             # Pages détails (stats)
│
├── context/                 # Contextes React
│   ├── AuthContext.tsx      # Authentification
│   ├── AppContext.tsx       # State global app
│   ├── LanguageContext.tsx  # Internationalisation
│   └── ThemeContext.tsx     # Dark mode
│
├── data/                    # Données et documentation
│   ├── mockData.ts          # ⭐ TOUTES les mock data
│   └── *.md                 # Documentation API/intégration
│
├── hooks/                   # Custom hooks
│   └── api/                 # Hooks API (pour future intégration)
│
├── services/                # Services externes
│   └── api.ts               # Configuration Axios
│
├── src/                     # 🎯 NOUVELLE ARCHITECTURE (refactoring en cours)
│   ├── app/                 # App principale
│   ├── components/          # Composants communs + layout
│   │   ├── common/
│   │   └── layout/
│   ├── constants/           # Constantes (colors, routes, config)
│   ├── features/            # Features organisées par domaine
│   │   ├── authentication/
│   │   ├── avis/
│   │   ├── booster/
│   │   ├── compte/
│   │   ├── dashboard/
│   │   ├── matches/
│   │   ├── onboarding/
│   │   ├── parrainage/
│   │   ├── reservations/
│   │   ├── restaurants/
│   │   └── theme/
│   ├── hooks/               # Hooks utilitaires
│   ├── types/               # Types TypeScript
│   ├── utils/               # Fonctions utilitaires
│   ├── main.tsx             # Point d'entrée
│   └── index.ts             # Exports centralisés
│
├── styles/                  # CSS global
│   └── globals.css          # Tailwind + tokens design
│
├── guidelines/              # Documentation développement
│   └── Guidelines.md        # Conventions de code strictes
│
├── App.tsx                  # Composant App principal (legacy)
├── tsconfig.json            # Configuration TypeScript
├── vite.config.ts           # Configuration Vite
└── package.json             # Dépendances
```

---

## 🎨 Design System

### **Couleurs Match**

```typescript
// /src/constants/colors.constants.ts
export const COLORS = {
  primary: {
    green: '#9cff02',      // Vert Match principal
    purple: '#5a03cf',     // Violet Match principal
  },
  gradients: {
    purpleToBlue: 'from-[#5a03cf] to-[#7a23ef]',
    greenAccent: 'from-[#9cff02] to-[#a0ff20]',
  }
};
```

### **Règles d'Or du Design Match**

```
✅ Peu de couleurs pleines
✅ Beaucoup de transparence
✅ Dégradés subtils
✅ Bordures dégradées plutôt que fonds dégradés
✅ Liquid glass partout (backdrop-blur-xl)
✅ Suppression icônes décoratives
✅ Priorité à la lisibilité
```

### **Composants UI (shadcn/ui)**

```
/components/ui/
├── accordion.tsx
├── alert.tsx
├── avatar.tsx
├── badge.tsx
├── button.tsx
├── calendar.tsx
├── card.tsx
├── checkbox.tsx
├── dialog.tsx
├── dropdown-menu.tsx
├── form.tsx
├── input.tsx
├── label.tsx
├── popover.tsx
├── select.tsx
├── separator.tsx
├── sheet.tsx
├── switch.tsx
├── table.tsx
├── tabs.tsx
├── textarea.tsx
├── toast.tsx
└── ... (30+ composants)
```

**Tous personnalisés avec :**
- Liquid glass backgrounds
- Bordures transparentes
- Couleurs Match (#9cff02, #5a03cf)

---

## 🔌 State Management

### **1. AuthContext** (`/context/AuthContext.tsx`)

**Responsabilités :**
- Authentification utilisateur
- Login/Logout
- Persistance session
- User actuel

**État :**
```typescript
{
  currentUser: User | null,
  isAuthenticated: boolean
}
```

**Méthodes :**
```typescript
login(email: string, password: string): void
logout(): void
register(userData: any): void
```

**Utilisation :**
```typescript
const { currentUser, login, logout } = useAuth();
```

---

### **2. AppContext** (`/context/AppContext.tsx`)

**Responsabilités :**
- State global application
- CRUD restaurants
- CRUD matchs
- CRUD clients
- Gestion notifications
- Gestion boosts

**État :**
```typescript
{
  restaurants: Restaurant[],
  matchs: Match[],
  clients: Client[],
  boostsDisponibles: number,
  notifications: Notification[]
}
```

**Méthodes principales :**
```typescript
// Restaurants
addRestaurant(restaurant: Restaurant): void
updateRestaurant(id: number, data: Partial<Restaurant>): void
deleteRestaurant(id: number): void
getUserRestaurants(userId: string): Restaurant[]

// Matchs
addMatch(match: Match): void
updateMatch(id: number, data: Partial<Match>): void
deleteMatch(id: number): void
getUserMatchs(userId: string): Match[]

// Clients
updateClient(id: number, client: Partial<Client>): void
getUserClients(userId: string): Client[]

// Réservations
handleReservationAction(id: number, action: 'acceptée' | 'refusée'): void

// Boosts
useBoost(): void
addBoosts(count: number): void

// Notifications
markAllAsRead(userId: string): void
```

**Utilisation :**
```typescript
const {
  restaurants,
  matchs,
  addRestaurant,
  updateMatch,
  boostsDisponibles
} = useAppContext();
```

---

### **3. LanguageContext** (`/context/LanguageContext.tsx`)

**Responsabilités :**
- Internationalisation FR/EN
- Switch langue

**État :**
```typescript
{
  language: 'fr' | 'en',
  t: (key: string) => string
}
```

---

### **4. ThemeContext** (`/context/ThemeContext.tsx`)

**Responsabilités :**
- Dark mode toggle
- Persistance préférence

**État :**
```typescript
{
  theme: 'light' | 'dark',
  toggleTheme: () => void
}
```

---

## 🧩 Architecture Features (Nouvelle Structure)

### **Principe : Feature-Based Architecture**

Chaque feature contient :
```
/src/features/[feature-name]/
├── index.ts                 # Public exports
├── pages/                   # Pages de la feature
│   ├── [PageName].tsx
│   └── index.ts
├── components/              # Composants internes (optionnel)
├── hooks/                   # Hooks spécifiques (optionnel)
└── context/                 # Context local (optionnel)
```

---

### **Features Implémentées**

#### **1. Authentication** (`/src/features/authentication/`)

```
authentication/
├── context/
│   └── AuthContext.tsx
├── pages/
│   ├── LandingPage.tsx      # Page d'accueil
│   ├── Login.tsx            # Connexion
│   └── Register.tsx         # Inscription
└── index.ts
```

---

#### **2. Dashboard** (`/src/features/dashboard/`)

```
dashboard/
├── pages/
│   └── Dashboard.tsx        # Dashboard principal
└── index.ts
```

**Stats affichées :**
- Clients (30 jours, total, âge moyen)
- Matchs (diffusés, à venir, total)
- Vues & impressions
- Boosts
- Taux de remplissage

---

#### **3. Restaurants** (`/src/features/restaurants/`)

```
restaurants/
├── pages/
│   ├── MesRestaurants.tsx   # Liste restaurants
│   ├── MesLieux.tsx         # Vue alternative
│   ├── AjouterRestaurant.tsx
│   ├── ModifierRestaurant.tsx
│   └── RestaurantDetail.tsx
└── index.ts
```

**Fonctionnalités :**
- CRUD complet restaurants
- Gestion capacité max
- **Booking mode (INSTANT / REQUEST)** ⭐ Nouveau
- Horaires d'ouverture
- Photos (UI prête, API manquante)

---

#### **4. Matches** (`/src/features/matches/`)

```
matches/
├── pages/
│   ├── MesMatchs.tsx        # Liste matchs du user
│   ├── ListeMatchs.tsx      # Liste publique
│   ├── MatchDetail.tsx      # Détails match
│   ├── ProgrammerMatch.tsx  # Programmer nouveau
│   └── ModifierMatch.tsx    # Modifier existant
└── index.ts
```

**Fonctionnalités :**
- CRUD complet matchs
- Filtres par sport
- Filtres par statut (à venir / terminé)
- Sélection depuis catalogue API externe
- Gestion capacité/réservations

---

#### **5. Reservations** (`/src/features/reservations/`)

```
reservations/
├── pages/
│   ├── Reservations.tsx     # Liste réservations
│   └── QRScanner.tsx        # Scan QR codes
└── index.ts
```

**Fonctionnalités :**
- Liste toutes réservations
- Filtres par statut
- **Accepter/Refuser** (mode REQUEST)
- Scan QR code pour validation
- Stats par match

---

#### **6. Onboarding** (`/src/features/onboarding/`)

```
onboarding/
├── pages/
│   ├── OnboardingWelcome.tsx
│   ├── InfosEtablissement.tsx
│   ├── Facturation.tsx
│   ├── PaiementValidation.tsx
│   └── ConfirmationOnboarding.tsx
└── index.ts
```

**Flow :**
1. Welcome → 2. Infos établissement → 3. Facturation → 4. Paiement → 5. Confirmation

---

#### **7. Parrainage** (`/src/features/parrainage/`)

```
parrainage/
├── pages/
│   ├── Parrainage.tsx       # Dashboard parrainage
│   └── ReferralPage.tsx     # Page publique référence
└── index.ts
```

**Fonctionnalités :**
- Code référence unique
- Stats parrainage (invités, conversions)
- Récompenses (boosts)
- Partage multi-canal
- Historique parrainages

---

#### **8. Booster** (`/src/features/booster/`)

```
booster/
├── pages/
│   └── Booster.tsx          # Gestion boosts
└── index.ts
```

**Fonctionnalités :**
- Achat boosts (3 types)
- Application sur matchs
- Stats boosts utilisés
- Recommandations

---

#### **9. Compte** (`/src/features/compte/`)

```
compte/
├── pages/
│   └── MonCompte.tsx        # Page compte principale
└── index.ts
```

**Sous-pages :**
- Informations personnelles
- Sécurité (mot de passe)
- Notifications (préférences)
- Facturation
- Données personnelles (RGPD)
- Aide

---

#### **10. Avis** (`/src/features/avis/`)

```
avis/
├── pages/
│   └── MesAvis.tsx          # Liste avis
└── index.ts
```

**Fonctionnalités :**
- Liste tous les avis
- Filtres par note
- Réponse aux avis (UI prête, API manquante)
- Stats moyennes

---

## 🔧 Types TypeScript

### **Structure Types** (`/src/types/`)

```
types/
├── index.ts                 # Exports centralisés
├── user.types.ts            # User, Auth
├── restaurant.types.ts      # Restaurant, Venue
├── match.types.ts           # Match, Competition
├── reservation.types.ts     # Reservation, Booking
├── avis.types.ts            # Review, Rating
├── stats.types.ts           # Statistics, Analytics
└── common.types.ts          # Types communs
```

### **Types Principaux**

#### **User**
```typescript
interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  onboardingCompleted: boolean;
  restaurants: number[];
}
```

#### **Restaurant**
```typescript
interface Restaurant {
  id: number;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  capaciteMax: number;
  note: number;
  totalAvis: number;
  image: string;
  horaires: string;
  tarif: string;
  userId: string;
  bookingMode?: 'INSTANT' | 'REQUEST'; // ⭐ Nouveau
}
```

#### **Match**
```typescript
interface Match {
  id: number;
  equipe1: string;
  equipe2: string;
  date: string;
  heure: string;
  reservees: number;
  total: number;
  sport: string;
  sportNom: string;
  restaurant: string;
  statut: 'à venir' | 'terminé';
  restaurantId: number;
  userId: string;
  competition?: string;
}
```

#### **Reservation**
```typescript
interface Reservation {
  id: number;
  matchId: number;
  matchNom: string;
  clientNom: string;
  prenom: string;
  nom: string;
  email: string;
  telephone: string;
  nombrePlaces: number;
  places: number;
  dateReservation: string;
  statut: 'confirmée' | 'en attente' | 'annulée' | 'refusé' | 'confirmé';
  restaurant?: string;
}
```

---

## 🛠️ Utilitaires

### **Utils** (`/src/utils/`)

```
utils/
├── index.ts
├── date.ts                  # Formatage dates
├── formatters.ts            # Formatage nombres, currency
└── validators.ts            # Validation forms
```

**Exemples :**
```typescript
// date.ts
formatDate(date: string): string
isDatePast(date: string): boolean

// formatters.ts
formatCurrency(amount: number): string
formatPhoneNumber(phone: string): string

// validators.ts
isValidEmail(email: string): boolean
isValidPhone(phone: string): boolean
```

---

### **Hooks** (`/src/hooks/`)

```
hooks/
├── index.ts
├── useClickOutside.ts
├── useDebounce.ts
├── useLocalStorage.ts
└── useMediaQuery.ts
```

---

### **Constants** (`/src/constants/`)

```
constants/
├── index.ts
├── colors.constants.ts      # Couleurs Match
├── routes.constants.ts      # Routes app
└── config.constants.ts      # Config générale
```

**Exemple :**
```typescript
// routes.constants.ts
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  RESTAURANTS: '/mes-restaurants',
  MATCHES: '/mes-matchs',
  RESERVATIONS: '/reservations',
  PARRAINAGE: '/parrainage',
  // ...
};
```

---

## 🔌 API Integration

### **Base URL & Configuration**

```typescript
// /services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL || '/api',
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

// Error interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

### **Structure Hooks API** (`/hooks/api/`)

```
hooks/api/
├── index.ts                 # Exports centralisés
├── useAuth.ts               # Authentication & user
├── useVenues.ts             # Venues/restaurants
├── useMatches.ts            # Matches & sports
├── useReservations.ts       # Réservations
├── usePartner.ts            # Partner dashboard
├── useReferrals.ts          # Parrainage
├── useBoosts.ts             # Boosts & promotions
└── useOther.ts              # Reviews, notifications, etc.
```

---

### **📋 API Routes Overview**

| Catégorie | Base Path | Description | Protected |
|-----------|-----------|-------------|-----------|
| **Authentication** | `/api/auth` | Login, register, logout, profile | Partial |
| **Users** | `/api/users` | User profile, addresses, preferences | ✅ |
| **Venues** | `/api/venues` | Venue CRUD, photos, hours, amenities | Partial |
| **Matches** | `/api/matches` | Matches, sports, leagues, teams | Public |
| **Reservations** | `/api/reservations` | Book, cancel, check-in, QR verify | ✅ |
| **Partners** | `/api/partners` | Dashboard, stats, venue management | ✅ |
| **Subscriptions** | `/api/subscriptions` | Plans, checkout, billing | ✅ |
| **Boosts** | `/api/boosts` | Purchase, activate, analytics | ✅ |
| **Referrals** | `/api/referral` | Code, stats, rewards | ✅ |
| **Analytics** | `/api/venues/:id/analytics` | Revenue, reservations, occupancy | ✅ |
| **Reviews** | `/api/venues/:id/reviews` | Create, read, update reviews | Partial |
| **Notifications** | `/api/notifications` | User notifications | ✅ |

---

### **🔐 1. Authentication Routes** (`useAuth.ts`)

#### **POST /api/auth/register**
```typescript
interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: 'user' | 'venue_owner' | 'admin';
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await api.post('/auth/register', data);
      return response.data; // { user, token, refresh_token }
    },
    onSuccess: (data) => {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('refreshToken', data.refresh_token);
    },
  });
}
```

#### **POST /api/auth/login**
```typescript
export function useLogin() {
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await api.post('/auth/login', { email, password });
      return response.data; // { user, token, refresh_token }
    },
    onSuccess: (data) => {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('refreshToken', data.refresh_token);
    },
  });
}
```

#### **GET /api/auth/me**
```typescript
export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data } = await api.get('/auth/me');
      return data.user;
    },
    retry: false,
  });
}
```

#### **POST /api/auth/logout**
```typescript
export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout');
    },
    onSuccess: () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      queryClient.clear();
    },
  });
}
```

---

### **👤 2. User Routes** (`useAuth.ts`)

#### **PUT /api/users/me**
```typescript
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      const response = await api.put('/users/me', data);
      return response.data.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['currentUser']);
    },
  });
}
```

#### **PUT /api/users/me/notification-preferences**
```typescript
export function useUpdateNotificationPreferences() {
  return useMutation({
    mutationFn: async (preferences: NotificationPreferences) => {
      const response = await api.put('/users/me/notification-preferences', preferences);
      return response.data.notification_preferences;
    },
  });
}
```

---

### **🏟️ 3. Venue Routes** (`useVenues.ts`)

#### **GET /api/venues** (Public)
```typescript
interface VenueFilters {
  limit?: number;
  offset?: number;
  city?: string;
  type?: string;
  search?: string;
  lat?: number;
  lng?: number;
  distance_km?: number;
}

export function useVenues(filters?: VenueFilters) {
  return useQuery({
    queryKey: ['venues', filters],
    queryFn: async () => {
      const { data } = await api.get('/venues', { params: filters });
      return data; // { venues, total }
    },
  });
}
```

#### **GET /api/venues/:venueId** (Public)
```typescript
export function useVenue(venueId: string) {
  return useQuery({
    queryKey: ['venue', venueId],
    queryFn: async () => {
      const { data } = await api.get(`/venues/${venueId}`);
      return data; // { venue, photos, rating }
    },
    enabled: !!venueId,
  });
}
```

#### **PUT /api/venues/:venueId** (Owner only)
```typescript
export function useUpdateVenue() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ venueId, data }: { venueId: string; data: Partial<Venue> }) => {
      const response = await api.put(`/venues/${venueId}`, data);
      return response.data.venue;
    },
    onSuccess: (venue) => {
      queryClient.invalidateQueries(['venue', venue.id]);
      queryClient.invalidateQueries(['partnerVenues']);
    },
  });
}
```

#### **PUT /api/venues/:venueId/booking-mode** (Owner only)
```typescript
export function useUpdateBookingMode() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      venueId, 
      bookingMode 
    }: { 
      venueId: string; 
      bookingMode: 'INSTANT' | 'REQUEST' 
    }) => {
      const response = await api.put(`/venues/${venueId}/booking-mode`, { booking_mode: bookingMode });
      return response.data.venue;
    },
    onSuccess: (venue) => {
      queryClient.invalidateQueries(['venue', venue.id]);
    },
  });
}
```

#### **POST /api/venues/:venueId/photos** (Owner only)
```typescript
export function useUploadVenuePhoto() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      venueId, 
      photoData 
    }: { 
      venueId: string; 
      photoData: { photo_url: string; is_primary?: boolean } 
    }) => {
      const response = await api.post(`/venues/${venueId}/photos`, photoData);
      return response.data.photo;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['venue', variables.venueId]);
    },
  });
}
```

#### **PUT /api/venues/:venueId/opening-hours** (Owner only)
```typescript
export function useUpdateOpeningHours() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      venueId, 
      hours 
    }: { 
      venueId: string; 
      hours: OpeningHours 
    }) => {
      const response = await api.put(`/venues/${venueId}/opening-hours`, { opening_hours: hours });
      return response.data.venue;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['venue', variables.venueId]);
    },
  });
}
```

#### **GET /api/amenities** (Public)
```typescript
export function useAmenities() {
  return useQuery({
    queryKey: ['amenities'],
    queryFn: async () => {
      const { data } = await api.get('/amenities');
      return data; // { amenities, categories }
    },
    staleTime: Infinity, // Amenities rarely change
  });
}
```

#### **PUT /api/venues/:venueId/amenities** (Owner only)
```typescript
export function useUpdateVenueAmenities() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      venueId, 
      amenities 
    }: { 
      venueId: string; 
      amenities: string[] 
    }) => {
      const response = await api.put(`/venues/${venueId}/amenities`, { amenities });
      return response.data.venue;
    },
    onSuccess: (venue) => {
      queryClient.invalidateQueries(['venue', venue.id]);
    },
  });
}
```

---

### **⚽ 4. Match Routes** (`useMatches.ts`)

#### **GET /api/matches**
```typescript
interface MatchFilters {
  limit?: number;
  offset?: number;
  status?: 'upcoming' | 'live' | 'finished';
  league_id?: string;
  scheduled_from?: string;
  scheduled_to?: string;
}

export function useMatches(filters?: MatchFilters) {
  return useQuery({
    queryKey: ['matches', filters],
    queryFn: async () => {
      const { data } = await api.get('/matches', { params: filters });
      return data; // { matches, total }
    },
  });
}
```

#### **GET /api/matches/upcoming**
```typescript
export function useUpcomingMatches(sport_id?: string, limit?: number) {
  return useQuery({
    queryKey: ['matches', 'upcoming', sport_id, limit],
    queryFn: async () => {
      const { data } = await api.get('/matches/upcoming', { 
        params: { sport_id, limit } 
      });
      return data.matches;
    },
  });
}
```

#### **GET /api/matches/:matchId**
```typescript
export function useMatch(matchId: string) {
  return useQuery({
    queryKey: ['match', matchId],
    queryFn: async () => {
      const { data } = await api.get(`/matches/${matchId}`);
      return data; // { match, teams: { home, away } }
    },
    enabled: !!matchId,
  });
}
```

#### **GET /api/matches/:matchId/venues**
```typescript
export function useMatchVenues(matchId: string) {
  return useQuery({
    queryKey: ['match', matchId, 'venues'],
    queryFn: async () => {
      const { data } = await api.get(`/matches/${matchId}/venues`);
      return data.venues; // VenueMatch[]
    },
    enabled: !!matchId,
  });
}
```

#### **GET /api/sports**
```typescript
export function useSports() {
  return useQuery({
    queryKey: ['sports'],
    queryFn: async () => {
      const { data } = await api.get('/sports');
      return data.sports;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
```

---

### **🎟️ 5. Reservation Routes** (`useReservations.ts`)

#### **GET /api/reservations**
```typescript
export function useReservations(status?: string) {
  return useQuery({
    queryKey: ['reservations', status],
    queryFn: async () => {
      const { data } = await api.get('/reservations', { params: { status } });
      return data; // { reservations, total }
    },
  });
}
```

#### **GET /api/reservations/:reservationId**
```typescript
export function useReservation(reservationId: string) {
  return useQuery({
    queryKey: ['reservation', reservationId],
    queryFn: async () => {
      const { data } = await api.get(`/reservations/${reservationId}`);
      return data; // { reservation, qr_code, venue, match }
    },
    enabled: !!reservationId,
  });
}
```

#### **POST /api/reservations** (Create - INSTANT or REQUEST mode)
```typescript
interface CreateReservationData {
  venue_match_id: string;
  party_size: number;
  requires_accessibility?: boolean;
  special_requests?: string;
}

export function useCreateReservation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateReservationData) => {
      const response = await api.post('/reservations', data);
      return response.data; // { reservation, qr_code? }
      // status: 'PENDING' (REQUEST mode) or 'CONFIRMED' (INSTANT mode)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reservations']);
    },
  });
}
```

#### **POST /api/reservations/:reservationId/cancel**
```typescript
export function useCancelReservation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      reservationId, 
      reason 
    }: { 
      reservationId: string; 
      reason?: string 
    }) => {
      const response = await api.post(`/reservations/${reservationId}/cancel`, { reason });
      return response.data.reservation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reservations']);
    },
  });
}
```

#### **POST /api/reservations/verify-qr** (Venue owner scans)
```typescript
export function useVerifyQR() {
  return useMutation({
    mutationFn: async (qrCode: string) => {
      const response = await api.post('/reservations/verify-qr', { qr_code: qrCode });
      return response.data; // { valid, reservation }
    },
  });
}
```

#### **POST /api/reservations/:reservationId/check-in**
```typescript
export function useCheckInReservation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (reservationId: string) => {
      const response = await api.post(`/reservations/${reservationId}/check-in`);
      return response.data.reservation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reservations']);
    },
  });
}
```

---

### **💼 6. Partner Routes** (`usePartner.ts`)

#### **GET /api/partners/venues**
```typescript
export function usePartnerVenues() {
  return useQuery({
    queryKey: ['partnerVenues'],
    queryFn: async () => {
      const { data } = await api.get('/partners/venues');
      return data.venues;
    },
  });
}
```

#### **POST /api/partners/venues**
```typescript
export function useCreatePartnerVenue() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (venueData: any) => {
      const response = await api.post('/partners/venues', venueData);
      return response.data.venue;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['partnerVenues']);
    },
  });
}
```

#### **GET /api/partners/venues/:venueId/reservations**
```typescript
export function usePartnerReservations(
  venueId: string, 
  params?: { page?: number; limit?: number; status?: string }
) {
  return useQuery({
    queryKey: ['partnerReservations', venueId, params],
    queryFn: async () => {
      const { data } = await api.get(`/partners/venues/${venueId}/reservations`, { params });
      return data; // { reservations, total, page, limit }
    },
    enabled: !!venueId,
  });
}
```

#### **GET /api/partners/venues/:venueId/reservations/stats**
```typescript
export function useReservationStats(
  venueId: string, 
  params?: { from?: string; to?: string }
) {
  return useQuery({
    queryKey: ['reservationStats', venueId, params],
    queryFn: async () => {
      const { data } = await api.get(`/partners/venues/${venueId}/reservations/stats`, { params });
      return data.stats;
    },
    enabled: !!venueId,
  });
}
```

#### **PATCH /api/partners/reservations/:reservationId** (Full update)
```typescript
export function useUpdateReservation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      reservationId, 
      data 
    }: { 
      reservationId: string; 
      data: Partial<Reservation> 
    }) => {
      const response = await api.patch(`/partners/reservations/${reservationId}`, data);
      return response.data.reservation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['partnerReservations']);
      queryClient.invalidateQueries(['reservations']);
    },
  });
}
```

#### **PATCH /api/partners/reservations/:reservationId/status** (Accept/Decline)
```typescript
export function useUpdateReservationStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      reservationId, 
      status 
    }: { 
      reservationId: string; 
      status: 'CONFIRMED' | 'DECLINED' 
    }) => {
      const response = await api.patch(`/partners/reservations/${reservationId}/status`, { status });
      return response.data.reservation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['partnerReservations']);
    },
  });
}
```

#### **POST /api/partners/reservations/:reservationId/mark-no-show**
```typescript
export function useMarkNoShow() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      reservationId, 
      reason 
    }: { 
      reservationId: string; 
      reason?: string 
    }) => {
      const response = await api.post(`/partners/reservations/${reservationId}/mark-no-show`, { reason });
      return response.data; // { reservation, seats_released }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['partnerReservations']);
    },
  });
}
```

#### **POST /api/partners/venues/:venueId/matches** (Schedule match)
```typescript
export function useScheduleMatch() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      venueId, 
      matchData 
    }: { 
      venueId: string; 
      matchData: { match_id: string; total_seats: number } 
    }) => {
      const response = await api.post(`/partners/venues/${venueId}/matches`, matchData);
      return response.data.venueMatch;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['partnerMatches']);
    },
  });
}
```

#### **GET /api/partners/venues/:venueId/matches/calendar**
```typescript
export function useMatchesCalendar(venueId: string, month?: string) {
  return useQuery({
    queryKey: ['matchesCalendar', venueId, month],
    queryFn: async () => {
      const { data } = await api.get(`/partners/venues/${venueId}/matches/calendar`, {
        params: { month }
      });
      return data; // { matches, summary, days_with_matches }
    },
    enabled: !!venueId,
  });
}
```

#### **GET /api/partners/analytics/dashboard**
```typescript
export function usePartnerAnalytics(params?: { start_date?: string; end_date?: string }) {
  return useQuery({
    queryKey: ['partnerAnalytics', params],
    queryFn: async () => {
      const { data } = await api.get('/partners/analytics/dashboard', { params });
      return data; // { overview, reservations_by_status, capacity_utilization }
    },
  });
}
```

---

### **💳 7. Subscription Routes** (`usePartner.ts`)

#### **GET /api/subscriptions/plans**
```typescript
export function useSubscriptionPlans() {
  return useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: async () => {
      const { data } = await api.get('/subscriptions/plans');
      return data.plans;
    },
    staleTime: Infinity,
  });
}
```

#### **POST /api/subscriptions/create-checkout**
```typescript
export function useCreateCheckout() {
  return useMutation({
    mutationFn: async ({ 
      plan, 
      billing_period 
    }: { 
      plan: 'basic' | 'pro' | 'enterprise'; 
      billing_period?: 'monthly' | 'yearly' 
    }) => {
      const response = await api.post('/subscriptions/create-checkout', { plan, billing_period });
      return response.data; // { checkout_url, session_id }
    },
  });
}
```

#### **GET /api/subscriptions/me**
```typescript
export function useMySubscription() {
  return useQuery({
    queryKey: ['mySubscription'],
    queryFn: async () => {
      const { data } = await api.get('/subscriptions/me');
      return data; // { subscription, next_billing_date, payment_method }
    },
  });
}
```

#### **POST /api/subscriptions/me/cancel**
```typescript
export function useCancelSubscription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const response = await api.post('/subscriptions/me/cancel');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mySubscription']);
    },
  });
}
```

#### **POST /api/subscriptions/mock** (Dev/Testing only)
```typescript
export function useToggleMockSubscription() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params?: { plan?: string; active?: boolean }) => {
      const response = await api.post('/subscriptions/mock', params);
      return response.data; // { subscription, message }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['mySubscription']);
    },
  });
}
```

---

### **⚡ 8. Boost Routes** (`useBoosts.ts`)

#### **GET /api/boosts/prices** (Public)
```typescript
export function useBoostPrices() {
  return useQuery({
    queryKey: ['boostPrices'],
    queryFn: async () => {
      const { data } = await api.get('/boosts/prices');
      return data.prices;
    },
    staleTime: Infinity,
  });
}
```

#### **GET /api/boosts/available**
```typescript
export function useAvailableBoosts() {
  return useQuery({
    queryKey: ['availableBoosts'],
    queryFn: async () => {
      const { data } = await api.get('/boosts/available');
      return data; // { count, boosts }
    },
  });
}
```

#### **GET /api/boosts/stats**
```typescript
export function useBoostStats() {
  return useQuery({
    queryKey: ['boostStats'],
    queryFn: async () => {
      const { data } = await api.get('/boosts/stats');
      return data; // { boosts, purchases, performance }
    },
  });
}
```

#### **POST /api/boosts/purchase/create-checkout**
```typescript
export function useCreateBoostCheckout() {
  return useMutation({
    mutationFn: async ({ 
      pack_type 
    }: { 
      pack_type: 'single' | 'pack_3' | 'pack_10' 
    }) => {
      const response = await api.post('/boosts/purchase/create-checkout', { pack_type });
      return response.data; // { checkout_url, session_id, purchase_id }
    },
  });
}
```

#### **POST /api/boosts/purchase/verify**
```typescript
export function useVerifyBoostPurchase() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (session_id: string) => {
      const response = await api.post('/boosts/purchase/verify', { session_id });
      return response.data; // { success, purchase }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['availableBoosts']);
      queryClient.invalidateQueries(['boostStats']);
    },
  });
}
```

#### **GET /api/boosts/boostable/:venueId**
```typescript
export function useBoostableMatches(venueId: string) {
  return useQuery({
    queryKey: ['boostableMatches', venueId],
    queryFn: async () => {
      const { data } = await api.get(`/boosts/boostable/${venueId}`);
      return data.matches;
    },
    enabled: !!venueId,
  });
}
```

#### **POST /api/boosts/activate**
```typescript
export function useActivateBoost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      boost_id, 
      venue_match_id 
    }: { 
      boost_id: string; 
      venue_match_id: string 
    }) => {
      const response = await api.post('/boosts/activate', { boost_id, venue_match_id });
      return response.data; // { success, boost_id, venue_match_id, expires_at }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['availableBoosts']);
      queryClient.invalidateQueries(['partnerMatches']);
    },
  });
}
```

#### **GET /api/boosts/history**
```typescript
export function useBoostHistory(params?: { page?: number; limit?: number; status?: string }) {
  return useQuery({
    queryKey: ['boostHistory', params],
    queryFn: async () => {
      const { data } = await api.get('/boosts/history', { params });
      return data; // { boosts, total, page, limit }
    },
  });
}
```

#### **GET /api/boosts/analytics/:boostId**
```typescript
export function useBoostAnalytics(boostId: string) {
  return useQuery({
    queryKey: ['boostAnalytics', boostId],
    queryFn: async () => {
      const { data } = await api.get(`/boosts/analytics/${boostId}`);
      return data; // { views_before, views_during, bookings_during, performance_score, roi }
    },
    enabled: !!boostId,
  });
}
```

---

### **🎁 9. Referral Routes** (`useReferrals.ts`)

#### **GET /api/referral/code**
```typescript
export function useReferralCode() {
  return useQuery({
    queryKey: ['referralCode'],
    queryFn: async () => {
      const { data } = await api.get('/referral/code');
      return data; // { referral_code, referral_link, created_at }
    },
  });
}
```

#### **GET /api/referral/stats**
```typescript
export function useReferralStats() {
  return useQuery({
    queryKey: ['referralStats'],
    queryFn: async () => {
      const { data } = await api.get('/referral/stats');
      return data; // { total_invited, total_converted, rewards_earned, conversion_rate }
    },
  });
}
```

#### **GET /api/referral/history**
```typescript
export function useReferralHistory(params?: { page?: number; limit?: number; status?: string }) {
  return useQuery({
    queryKey: ['referralHistory', params],
    queryFn: async () => {
      const { data } = await api.get('/referral/history', { params });
      return data; // { referred_users, total, page, limit }
    },
  });
}
```

#### **POST /api/referral/validate** (Public)
```typescript
export function useValidateReferralCode() {
  return useMutation({
    mutationFn: async (referral_code: string) => {
      const response = await api.post('/referral/validate', { referral_code });
      return response.data; // { valid, referrer_name?, message }
    },
  });
}
```

---

### **⭐ 10. Reviews Routes** (`useOther.ts`)

#### **POST /api/venues/:venueId/reviews**
```typescript
interface ReviewData {
  rating: number; // 1-5
  title: string;
  content: string;
  atmosphere_rating?: number;
  food_rating?: number;
  service_rating?: number;
  value_rating?: number;
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ venueId, reviewData }: { venueId: string; reviewData: ReviewData }) => {
      const response = await api.post(`/venues/${venueId}/reviews`, reviewData);
      return response.data.review;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['venue', variables.venueId]);
    },
  });
}
```

#### **GET /api/venues/:venueId/reviews**
```typescript
export function useVenueReviews(venueId: string, params?: { limit?: number; offset?: number; sort?: string }) {
  return useQuery({
    queryKey: ['venueReviews', venueId, params],
    queryFn: async () => {
      const { data } = await api.get(`/venues/${venueId}/reviews`, { params });
      return data; // { reviews, total, average_rating }
    },
    enabled: !!venueId,
  });
}
```

---

### **🔔 11. Notifications Routes** (`useOther.ts`)

#### **GET /api/notifications**
```typescript
export function useNotifications(params?: { is_read?: boolean; type?: string }) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: async () => {
      const { data } = await api.get('/notifications', { params });
      return data; // { notifications, unread_count }
    },
  });
}
```

#### **PUT /api/notifications/:notificationId/read**
```typescript
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data.notification;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
  });
}
```

#### **PUT /api/notifications/read-all**
```typescript
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      await api.put('/notifications/read-all');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
  });
}
```

---

### **📊 12. Analytics Routes** (`usePartner.ts`)

#### **GET /api/venues/:venueId/analytics/overview**
```typescript
export function useVenueAnalytics(
  venueId: string, 
  params?: { from?: string; to?: string }
) {
  return useQuery({
    queryKey: ['venueAnalytics', venueId, params],
    queryFn: async () => {
      const { data } = await api.get(`/venues/${venueId}/analytics/overview`, { params });
      return data.analytics; // { total_reservations, total_revenue, average_occupancy, top_matches }
    },
    enabled: !!venueId,
  });
}
```

#### **GET /api/venues/:venueId/analytics/reservations**
```typescript
export function useReservationAnalytics(
  venueId: string,
  params?: { from?: string; to?: string; group_by?: 'day' | 'week' | 'month' }
) {
  return useQuery({
    queryKey: ['reservationAnalytics', venueId, params],
    queryFn: async () => {
      const { data } = await api.get(`/venues/${venueId}/analytics/reservations`, { params });
      return data.data; // Array of { date, count, revenue }
    },
    enabled: !!venueId,
  });
}
```

---

### **🎯 Pattern d'Utilisation dans les Composants**

```typescript
// Example: Dashboard.tsx
import { usePartnerVenues, usePartnerAnalytics } from '@/hooks/api';

export function Dashboard() {
  const { data: venues, isLoading: venuesLoading } = usePartnerVenues();
  const { data: analytics, isLoading: analyticsLoading } = usePartnerAnalytics();
  
  if (venuesLoading || analyticsLoading) {
    return <div>Chargement...</div>;
  }
  
  return (
    <div>
      <h1>Dashboard</h1>
      <div>Total venues: {venues?.length}</div>
      <div>Total reservations: {analytics?.overview.total_reservations}</div>
    </div>
  );
}
```

```typescript
// Example: CreateReservation.tsx
import { useCreateReservation } from '@/hooks/api';
import { toast } from 'sonner';

export function CreateReservation({ venueMatchId }: { venueMatchId: string }) {
  const createReservation = useCreateReservation();
  
  const handleSubmit = async (partySize: number) => {
    try {
      const result = await createReservation.mutateAsync({
        venue_match_id: venueMatchId,
        party_size: partySize,
      });
      
      if (result.reservation.status === 'CONFIRMED') {
        toast.success('Réservation confirmée ! Voici votre QR code.');
      } else if (result.reservation.status === 'PENDING') {
        toast.info('Demande envoyée ! En attente de confirmation du restaurant.');
      }
    } catch (error) {
      toast.error('Erreur lors de la réservation');
    }
  };
  
  return (
    <button onClick={() => handleSubmit(4)}>
      Réserver pour 4 personnes
    </button>
  );
}
```

---

### **🎨 Query Client Setup**

```typescript
// main.tsx or App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
    mutations: {
      retry: 0,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* ... */}
    </QueryClientProvider>
  );
}
```

---

### **📝 Notes d'Implémentation**

**Booking Mode Logic:**
- `INSTANT` → Réservation confirmée immédiatement si capacité disponible
- `REQUEST` → Réservation créée avec statut `PENDING`, venue owner doit accepter/refuser

**Pagination Standard:**
- `limit` (default: 20)
- `offset` (default: 0)
- ou `page` + `limit`

**Authentication:**
- JWT token stocké dans `localStorage`
- Refresh token pour renouveler le JWT
- Interceptor Axios ajoute automatiquement le Bearer token

**Optimistic Updates:**
- Utiliser `onMutate` dans useMutation pour update UI immédiat
- Rollback en cas d'erreur avec `onError`

**Query Keys Convention:**
```typescript
// Simple entity
['venues']
['venues', venueId]

// With filters
['venues', filters]
['matches', { status: 'upcoming', sport_id: '123' }]

// Nested resources
['venue', venueId, 'reviews']
['venue', venueId, 'analytics', params]

// User-specific
['partnerVenues']
['mySubscription']
['availableBoosts']
```

---

## 📦 Dépendances Principales

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.x",
    "axios": "^1.x",
    "@tanstack/react-query": "^5.x",
    "lucide-react": "^0.x",
    "tailwindcss": "^4.0.0",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    "sonner": "^2.0.3",
    "recharts": "^2.x",
    "qr-scanner": "^1.x"
  },
  "devDependencies": {
    "typescript": "^5.5.3",
    "vite": "^5.4.2",
    "@vitejs/plugin-react": "^4.3.1"
  }
}
```

---

## 🚀 Build & Deploy

### **Scripts**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

### **Configuration Vite** (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
```

### **Configuration TypeScript** (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 🎯 Patterns & Best Practices

### **1. Composants**

```typescript
// ✅ Bon : Export nommé, props typées, destructuration
interface DashboardProps {
  userId: string;
}

export function Dashboard({ userId }: DashboardProps) {
  // ...
}

// ❌ Mauvais : Export default, any
export default function Dashboard(props: any) {
  // ...
}
```

---

### **2. State Management**

```typescript
// ✅ Bon : Context pour state partagé
const { restaurants, addRestaurant } = useAppContext();

// ❌ Mauvais : Prop drilling sur 5 niveaux
<Parent>
  <Child data={data}>
    <GrandChild data={data}>
      <GreatGrandChild data={data} />
    </GrandChild>
  </Child>
</Parent>
```

---

### **3. Styling**

```typescript
// ✅ Bon : Tailwind inline, liquid glass
<div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-200/50">

// ❌ Mauvais : Couleurs pleines, pas de transparence
<div className="bg-white rounded-lg border border-gray-300">
```

---

### **4. Import Paths**

```typescript
// ✅ Bon : Import relatif simple
import { Dashboard } from '../features/dashboard';

// ❌ Mauvais : Import path très long
import { Dashboard } from '../../../features/dashboard/pages/Dashboard';
```

---

## 📊 Métriques Architecture

| Metric | Valeur |
|--------|--------|
| **Composants UI** | ~30 (shadcn/ui) |
| **Pages** | ~40 |
| **Features** | 10 |
| **Contexts** | 4 |
| **Types** | ~20 interfaces |
| **Utils** | ~15 functions |
| **Hooks** | ~10 custom |
| **Mock Data** | ~81 items |

---

## 🔄 Migration en Cours

### **Legacy → Nouvelle Structure**

**Actuellement en transition :**
- ✅ Nouvelle structure `/src/features/` créée
- ✅ Nouveaux types dans `/src/types/`
- ✅ Nouveaux utils dans `/src/utils/`
- ⏳ Migration progressive des composants `/components/` → `/src/features/`

**Priorité migration :**
1. Dashboard ✅
2. Authentication ✅
3. Restaurants ✅
4. Matches ✅
5. Reservations ⏳
6. Autres features ⏳

---

## 🎯 Prochaines Étapes Architecture

### **Court Terme (1-2 semaines)**
```
☐ Finir migration composants vers /src/features/
☐ Créer hooks API complets
☐ Intégrer TanStack Query
☐ Supprimer dossier /components/ (legacy)
☐ Tests unitaires features critiques
```

### **Moyen Terme (1-2 mois)**
```
☐ Optimistic updates (mutations)
☐ Error boundaries par feature
☐ Lazy loading features
☐ Code splitting
☐ Performance monitoring
```

### **Long Terme (3-6 mois)**
```
☐ Micro-frontends (si scale)
☐ Monorepo (app mobile + web)
☐ Storybook pour UI components
☐ E2E testing suite
```

---

## 📚 Documentation Référence

- **Guidelines de Code** : `/guidelines/Guidelines.md`
- **Mock Data** : `/MOCK_DATA_INVENTORY.md`
- **API Endpoints** : `/DETAILED_MISSING_ENDPOINTS_SPECS.md`
- **Booking Mode** : `/BOOKING_MODE_SETTINGS.md`
- **Parrainage** : `/data/PARRAINAGE_INTEGRATION_GUIDE.md`

---

**Cette architecture est conçue pour être scalable, maintenable et performante. Elle suit les best practices React/TypeScript 2024. 🚀**
