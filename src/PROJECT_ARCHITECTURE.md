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

## 🔌 API Integration (Future)

### **Structure Hooks API** (`/hooks/api/`)

```
hooks/api/
├── index.ts
├── useAuth.ts               # Auth endpoints
├── useVenues.ts             # Venues/restaurants
├── useMatches.ts            # Matches
├── useReservations.ts       # Réservations
├── usePartner.ts            # Partner-specific
├── useReferrals.ts          # Parrainage
└── useOther.ts              # Autres
```

**Pattern recommandé :**
```typescript
// useVenues.ts
export function useVenues() {
  return useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      const { data } = await axios.get('/api/partners/venues');
      return data;
    }
  });
}

export function useCreateVenue() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (venueData) => {
      const { data } = await axios.post('/api/partners/venues', venueData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['venues']);
    }
  });
}
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
