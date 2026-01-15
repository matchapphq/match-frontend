# 📊 Mock Data Inventory - Match Platform

**Inventaire complet de toutes les données mock utilisées dans l'application**

---

## 📍 Source Unique

**Fichier principal :** `/data/mockData.ts`

Toutes les données mock sont centralisées dans ce fichier unique pour faciliter la maintenance et la migration vers une vraie API.

---

## 🗂️ Catégories de Données Mock

### 1. **User Data** 👤

#### **mockUser**
```typescript
{
  id: 'user-demo',
  email: 'demo@match.com',
  nom: 'Démo',
  prenom: 'Utilisateur',
  telephone: '06 12 34 56 78',
  onboardingCompleted: true,
  restaurants: [1, 2, 3]
}
```

**Utilisé dans :**
- `/context/AuthContext.tsx` - Authentication context
- Tous les composants nécessitant l'utilisateur actuel

---

### 2. **Restaurant Data** 🏪

#### **mockRestaurants** (3 restaurants)

```typescript
[
  {
    id: 1,
    nom: 'Le Sport Bar',
    adresse: '12 Rue de la République, 75001 Paris',
    telephone: '01 23 45 67 89',
    email: 'contact@lesportbar.fr',
    capaciteMax: 50,
    note: 4.5,
    totalAvis: 127,
    image: 'https://images.unsplash.com/photo-...',
    horaires: 'Lun-Dim: 11h00 - 02h00',
    tarif: '30€/mois',
    userId: 'user-demo',
    matchsOrganises: 12,
    bookingMode: 'INSTANT' // ⭐ Nouveau
  },
  {
    id: 2,
    nom: 'Chez Michel',
    // ...
    bookingMode: 'REQUEST' // ⭐ Nouveau
  },
  {
    id: 3,
    nom: 'La Brasserie du Stade',
    // ...
    bookingMode: 'INSTANT'
  }
]
```

**Utilisé dans :**
- `/context/AppContext.tsx` → `initialRestaurants`
- `/components/MesRestaurants.tsx` - Liste des restaurants
- `/components/RestaurantDetail.tsx` - Détails restaurant
- `/components/ModifierRestaurant.tsx` - Modification
- `/components/AjouterRestaurant.tsx` - Ajout
- `/components/Dashboard.tsx` - Stats

---

### 3. **Match Data** ⚽

#### **mockMatchs** (18 matchs)

```typescript
// 5 matchs à venir + 13 matchs terminés
[
  {
    id: 1,
    equipe1: 'Monaco',
    equipe2: 'Nice',
    date: '10/12/2024',
    heure: '20:00',
    reservees: 22,
    total: 30,
    sport: '⚽',
    sportNom: 'Football',
    restaurant: 'Le Sport Bar',
    statut: 'à venir',
    restaurantId: 1,
    userId: 'user-demo',
    competition: 'Ligue 1' // Optionnel
  },
  // ... 17 autres matchs
]
```

**Utilisé dans :**
- `/context/AppContext.tsx` → `initialMatchs`
- `/components/MesMatchs.tsx` - Liste des matchs
- `/components/MatchDetail.tsx` - Détails match
- `/components/ModifierMatch.tsx` - Modification
- `/components/ProgrammerMatch.tsx` - Programmation
- `/components/Dashboard.tsx` - Stats
- `/components/ListeMatchs.tsx` - Liste publique

#### **mockMatchInfo**
```typescript
{
  equipe1: 'PSG',
  equipe2: 'OM',
  sport: '⚽',
  sportNom: 'Football',
  date: '15/12/2024',
  heure: '21:00',
  competition: 'Ligue 1',
  restaurant: 'Le Sport Bar',
  places: 40,
  reservees: 35
}
```

**Utilisé dans :**
- `/components/MatchDetail.tsx` - Affichage détails

#### **mockAvailableMatches** (15 matchs disponibles)

```typescript
[
  {
    id: '1',
    sport: 'football',
    team1: 'PSG',
    team2: 'OM',
    league: 'Ligue 1',
    date: '2026-01-15',
    time: '21:00',
    venue: 'Parc des Princes'
  },
  // ... Football, Basketball, Rugby, Tennis, Handball, Volleyball
]
```

**Utilisé dans :**
- `/components/ProgrammerMatch.tsx` - Sélection de matchs à programmer

#### **mockAllMatches**
```typescript
[
  { id: 1, equipe1: 'Monaco', equipe2: 'Nice', date: '10/12/2024', heure: '20:00', statut: 'à venir', places: 30 },
  // ... 6 autres matchs
]
```

**Utilisé dans :**
- `/components/ListeMatchs.tsx` - Liste publique

---

### 4. **Reservation Data** 📅

#### **mockReservations** (10 réservations)

```typescript
[
  {
    id: 1,
    matchId: 1,
    matchNom: 'PSG vs OM',
    clientNom: 'Jean Dupont',
    prenom: 'Jean',
    nom: 'Dupont',
    email: 'jean.dupont@email.fr',
    telephone: '06 12 34 56 78',
    nombrePlaces: 2,
    places: 2,
    dateReservation: '10/12/2024',
    statut: 'confirmée', // 'confirmée' | 'en attente' | 'annulée' | 'refusé' | 'confirmé'
    restaurant: 'Le Sport Bar'
  },
  // ... 9 autres réservations
]
```

**Utilisé dans :**
- `/components/Reservations.tsx` - Liste des réservations
- `/components/QRScanner.tsx` - Validation QR codes

#### **mockMatchDetailReservations** (8 réservations)

```typescript
[
  {
    id: 1,
    matchId: 3,
    matchNom: 'PSG vs OM',
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@email.fr',
    telephone: '06 12 34 56 78',
    places: 2,
    nombrePlaces: 2,
    dateReservation: '10/12/2024',
    statut: 'confirmé'
  },
  // ... 7 autres
]
```

**Utilisé dans :**
- `/components/MatchDetail.tsx` - Réservations d'un match

#### **mockMatchesWithReservations** (4 matchs)

```typescript
[
  {
    id: 1,
    equipe1: 'PSG',
    equipe2: 'OM',
    date: '15/12/2024',
    heure: '21:00',
    sport: '⚽',
    sportNom: 'Football',
    placesTotal: 40,
    placesReservees: 35,
    restaurant: 'Le Sport Bar'
  },
  // ... 3 autres
]
```

**Utilisé dans :**
- `/components/Reservations.tsx` - Vue d'ensemble

---

### 5. **Client Data** 👥

#### **mockClients** (8 clients)

```typescript
[
  {
    id: 1,
    nom: 'Dupont',
    prenom: 'Jean',
    match: 'PSG vs OM',
    date: '15/11/2024',
    userId: 'user-demo',
    statut: 'confirmé', // Optionnel
    email: 'jean.dupont@email.fr', // Optionnel
    telephone: '06 12 34 56 78', // Optionnel
    restaurant: 'Le Sport Bar', // Optionnel
    matchId: 1 // Optionnel
  },
  // ... 7 autres clients
]
```

**Utilisé dans :**
- `/context/AppContext.tsx` → `initialClients`
- `/components/Dashboard.tsx` - Stats clients
- `/components/details/ClientsDetail.tsx` - Détails clients

---

### 6. **Review Data** ⭐

#### **mockAvis** (5 avis)

```typescript
[
  {
    id: 1,
    client: 'Jean Dupont',
    note: 5, // 1-5
    commentaire: 'Excellente ambiance pour regarder les matchs !',
    date: '05/12/2024'
  },
  // ... 4 autres avis
]
```

**Utilisé dans :**
- `/components/MesAvis.tsx` - Liste des avis
- `/components/RestaurantDetail.tsx` - Avis du restaurant

---

### 7. **Notification Data** 🔔

#### **mockNotifications** (3 notifications)

```typescript
[
  {
    id: 1,
    userId: 'user-demo',
    type: 'reservation', // 'reservation' | 'avis' | 'parrainage'
    title: 'Nouvelle réservation',
    message: 'Une nouvelle réservation a été faite pour le match PSG vs OM.',
    date: '15/11/2024',
    read: false,
    reservationId: 1 // Optionnel
  },
  // ... 2 autres notifications
]
```

**Utilisé dans :**
- `/context/AppContext.tsx` → `initialNotifications`
- `/components/NotificationsPopup.tsx` - Popup notifications
- `/components/Header.tsx` - Badge notifications

---

### 8. **Sports Data** ⚽🏀🏉

#### **mockSports** (10 sports)

```typescript
[
  { id: 'football', name: 'Football', emoji: '⚽' },
  { id: 'basketball', name: 'Basketball', emoji: '🏀' },
  { id: 'rugby', name: 'Rugby', emoji: '🏉' },
  { id: 'tennis', name: 'Tennis', emoji: '🎾' },
  { id: 'handball', name: 'Handball', emoji: '🤾' },
  { id: 'volleyball', name: 'Volleyball', emoji: '🏐' },
  { id: 'cyclisme', name: 'Cyclisme', emoji: '🚴' },
  { id: 'formule1', name: 'Formule 1', emoji: '🏎️' },
  { id: 'mma', name: 'MMA', emoji: '🥊' },
  { id: 'esports', name: 'E-Sports', emoji: '🎮' }
]
```

**Utilisé dans :**
- `/components/ProgrammerMatch.tsx` - Filtres par sport
- `/components/ListeMatchs.tsx` - Filtres

---

### 9. **Statistics Data** 📊

#### **mockStats**

```typescript
{
  // Clients
  clients30Jours: 156,
  clientsTotal: 487,
  ageMoyen: 32,
  sportFavori: 'Football',
  moyenneClientsParMatch: 38,
  
  // Matchs
  matchsDiffuses30Jours: 8,
  matchsAVenir: 5,
  matchsTotal: 18,
  
  // Visibilité
  vuesMois: 2847,
  impressions: 12453,
  
  // Boosts
  boostsDisponibles: 12,
  matchsBoosted: 3,
  
  // Performance
  tauxRemplissageMoyen: 87
}
```

**Utilisé dans :**
- `/components/Dashboard.tsx` - Toutes les stats
- `/components/StatCard.tsx` - Cards individuelles
- `/components/details/ClientsDetail.tsx`
- `/components/details/MatchesAVenirDetail.tsx`
- `/components/details/MatchesDiffusesDetail.tsx`
- `/components/details/VuesDetail.tsx`

---

### 10. **Boost Data** 🚀

#### **mockBoosts** (3 types de boosts)

```typescript
[
  {
    id: 1,
    nom: 'Boost Visibilité',
    description: 'Apparaissez en premier dans les résultats de recherche',
    prix: 49, // €
    duree: '7 jours',
    avantages: [
      'Top des résultats',
      '+300% de vues',
      'Badge "Recommandé"'
    ],
    popularite: 85 // %
  },
  {
    id: 2,
    nom: 'Boost Premium',
    prix: 99,
    duree: '7 jours',
    avantages: [
      'Top des résultats',
      '+500% de vues',
      'Page d\'accueil',
      'Réseaux sociaux'
    ],
    popularite: 95
  },
  {
    id: 3,
    nom: 'Boost Événement',
    prix: 29,
    duree: '1 match',
    avantages: [
      'Badge "Match à venir"',
      'Notification push'
    ],
    popularite: 70
  }
]
```

**Utilisé dans :**
- `/components/AcheterBoosts.tsx` - Achat de boosts
- `/components/Booster.tsx` - Application des boosts
- `/context/AppContext.tsx` - Gestion `boostsDisponibles`

---

### 11. **Referral Data (Parrainage)** 🎁

#### **mockVenueOwnerReferralCode**

```typescript
{
  referral_code: 'MATCH-RESTO-A7B9C2',
  referral_link: 'https://match.app/signup?ref=MATCH-RESTO-A7B9C2',
  created_at: '2025-11-01T10:00:00Z'
}
```

#### **mockUserReferralCode**

```typescript
{
  referral_code: 'MATCH-USER-X9K2M5',
  referral_link: 'https://match.app/signup?ref=MATCH-USER-X9K2M5',
  created_at: '2025-12-01T10:00:00Z'
}
```

#### **mockVenueOwnerReferralStats**

```typescript
{
  total_invited: 12,
  total_signed_up: 8,
  total_converted: 5,
  total_rewards_earned: 5,
  rewards_value: 1500, // €
  conversion_rate: 62 // %
}
```

#### **mockUserReferralStats**

```typescript
{
  total_invited: 15,
  total_signed_up: 10,
  total_converted: 8,
  total_rewards_earned: 8,
  conversion_rate: 80
}
```

#### **mockReferredUsers** (5 utilisateurs parrainés)

```typescript
[
  {
    id: '1',
    name: 'Marc D.', // Anonymisé
    status: 'converted', // 'invited' | 'signed_up' | 'converted'
    reward_earned: '1 boost',
    created_at: '2025-12-20T10:00:00Z',
    converted_at: '2025-12-22T15:30:00Z'
  },
  // ... 4 autres
]
```

#### **mockReferralHistory**

```typescript
{
  referred_users: mockReferredUsers,
  total: 5
}
```

**Utilisé dans :**
- `/components/Parrainage.tsx` - Page parrainage
- `/components/ParrainageWidget.tsx` - Widget
- `/components/ReferralPage.tsx` - Page publique
- `/components/ReferralCodeInput.tsx` - Input code
- `/components/ShareReferralModal.tsx` - Modal partage

---

## 🔄 Mapping Mock → Contextes

### **AuthContext** (`/context/AuthContext.tsx`)

```typescript
import { mockUser } from '../data/mockData';

// État initial
const [currentUser, setCurrentUser] = useState<User | null>(mockUser);
```

**Mock utilisés :**
- `mockUser`

---

### **AppContext** (`/context/AppContext.tsx`)

```typescript
import { 
  mockRestaurants, 
  mockMatchs, 
  mockClients, 
  mockNotifications 
} from '../data/mockData';

const initialRestaurants = mockRestaurants;
const initialMatchs = mockMatchs;
const initialClients = mockClients;
const initialNotifications = mockNotifications;
```

**Mock utilisés :**
- `mockRestaurants` → `initialRestaurants`
- `mockMatchs` → `initialMatchs`
- `mockClients` → `initialClients`
- `mockNotifications` → `initialNotifications`

**État :**
- `restaurants` (useState)
- `matchs` (useState)
- `clients` (useState)
- `notifications` (useState)
- `boostsDisponibles` (useState - valeur hardcodée 12)

---

## 📍 Où sont utilisées les Mock Data ?

### **Dashboard** (`/components/Dashboard.tsx`)
```typescript
const matchs = getUserMatchs(currentUser.id); // → mockMatchs filtrés
const clients = getUserClients(currentUser.id); // → mockClients filtrés
const restaurants = getUserRestaurants(currentUser.id); // → mockRestaurants filtrés

// Stats calculées à partir des mock data
const matchsAVenir = matchs.filter(m => m.statut === 'à venir').length;
const matchsDiffuses = matchs.filter(m => m.statut === 'terminé').length;
// etc.
```

---

### **MesRestaurants** (`/components/MesRestaurants.tsx`)
```typescript
const restaurants = getUserRestaurants(currentUser.id); // → mockRestaurants
```

---

### **MesMatchs** (`/components/MesMatchs.tsx`)
```typescript
const matchs = getUserMatchs(currentUser.id); // → mockMatchs
```

---

### **Reservations** (`/components/Reservations.tsx`)
```typescript
import { mockReservations, mockMatchesWithReservations } from '../data/mockData';

// Utilise directement les imports
```

---

### **MatchDetail** (`/components/MatchDetail.tsx`)
```typescript
import { mockMatchInfo, mockMatchDetailReservations } from '../data/mockData';
```

---

### **ProgrammerMatch** (`/components/ProgrammerMatch.tsx`)
```typescript
import { mockAvailableMatches, mockSports } from '../data/mockData';
```

---

### **Parrainage** (`/components/Parrainage.tsx`)
```typescript
import {
  mockVenueOwnerReferralCode,
  mockVenueOwnerReferralStats,
  mockReferralHistory
} from '../data/mockData';
```

---

### **AcheterBoosts** (`/components/AcheterBoosts.tsx`)
```typescript
import { mockBoosts } from '../data/mockData';
```

---

### **MesAvis** (`/components/MesAvis.tsx`)
```typescript
import { mockAvis } from '../data/mockData';
```

---

## 🔧 Comment Remplacer les Mock par une API

### **Étape 1 : Créer les hooks API**

```typescript
// /hooks/api/useVenues.ts
export function useVenues() {
  return useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      const { data } = await axios.get('/api/partners/venues');
      return data;
    }
  });
}

// /hooks/api/useMatches.ts
export function useMatches(venueId?: number) {
  return useQuery({
    queryKey: ['matches', venueId],
    queryFn: async () => {
      const url = venueId 
        ? `/api/partners/venues/${venueId}/matches`
        : `/api/partners/matches`;
      const { data } = await axios.get(url);
      return data;
    },
    enabled: !!venueId
  });
}
```

---

### **Étape 2 : Remplacer dans les composants**

**Avant (Mock) :**
```typescript
// Dashboard.tsx
const { getUserMatchs } = useAppContext();
const matchs = getUserMatchs(currentUser.id);
```

**Après (API) :**
```typescript
// Dashboard.tsx
import { useMatches } from '../hooks/api/useMatches';

const { data: matchs = [], isLoading } = useMatches(currentUser.id);
```

---

### **Étape 3 : Supprimer les mock**

```typescript
// Supprimer les imports de mockData.ts
// Supprimer initialRestaurants, initialMatchs, etc. de AppContext
```

---

## 📊 Statistiques Mock Data

| Catégorie | Nombre d'éléments | Fichiers utilisant |
|-----------|-------------------|-------------------|
| **User** | 1 | AuthContext |
| **Restaurants** | 3 | AppContext, 5+ components |
| **Matchs** | 18 | AppContext, 8+ components |
| **Available Matches** | 15 | ProgrammerMatch |
| **Reservations** | 10 | Reservations, MatchDetail |
| **Clients** | 8 | AppContext, Dashboard, Details |
| **Reviews** | 5 | MesAvis, RestaurantDetail |
| **Notifications** | 3 | AppContext, NotificationsPopup |
| **Sports** | 10 | ProgrammerMatch, ListeMatchs |
| **Boosts** | 3 | AcheterBoosts, Booster |
| **Referrals** | 5 users | Parrainage components |

**Total : ~81 éléments mock**

---

## 🎯 Données Mock vs Données Réelles

### **Actuellement Mock (Frontend uniquement)**

✅ Tous les restaurants  
✅ Tous les matchs  
✅ Toutes les réservations  
✅ Tous les clients  
✅ Tous les avis  
✅ Toutes les notifications  
✅ Toutes les stats  
✅ Tous les boosts  
✅ Tout le parrainage  

### **À Connecter à l'API Backend**

❌ GET /api/partners/venues → Remplacer `mockRestaurants`  
❌ GET /api/partners/matches → Remplacer `mockMatchs`  
❌ GET /api/partners/reservations → Remplacer `mockReservations`  
❌ GET /api/partners/stats → Remplacer `mockStats`  
❌ GET /api/reviews → Remplacer `mockAvis`  
❌ GET /api/notifications → Remplacer `mockNotifications`  
❌ GET /api/boosts → Remplacer `mockBoosts`  
❌ GET /api/referrals → Remplacer mock parrainage  

---

## 📝 Remarques Importantes

### **1. userId hardcodé**
Toutes les données mock utilisent `userId: 'user-demo'`. En production, il faudra filtrer par l'ID réel de l'utilisateur connecté.

### **2. Images Unsplash**
Tous les restaurants utilisent des images Unsplash. En production, il faudra uploader des vraies photos.

### **3. Dates**
Les dates sont au format `DD/MM/YYYY` (string). L'API devrait utiliser ISO 8601 (`YYYY-MM-DDTHH:mm:ssZ`).

### **4. IDs**
Les IDs mock sont des nombres séquentiels (1, 2, 3...). L'API utilisera probablement des UUIDs.

### **5. Statuts**
- Réservations : `'confirmée' | 'en attente' | 'annulée' | 'refusé' | 'confirmé'`
- Matchs : `'à venir' | 'terminé'`
- Parrainage : `'invited' | 'signed_up' | 'converted'`

### **6. Booking Mode**
Nouveau champ ajouté : `bookingMode: 'INSTANT' | 'REQUEST'` (ou `booking_mode: 'instant' | 'request'` selon la casse)

---

## ✅ Checklist Migration Mock → API

```typescript
☐ Créer hooks API dans /hooks/api/
☐ Remplacer imports mockData dans tous les composants
☐ Utiliser TanStack Query pour caching
☐ Gérer loading states (isLoading)
☐ Gérer error states (isError)
☐ Ajouter retry logic
☐ Optimistic updates pour mutations
☐ Invalidate queries après mutations
☐ Tester tous les flows
☐ Supprimer mockData.ts (dernière étape)
```

---

**Ce document répertorie 100% des mock data utilisées dans Match. Utilisez-le comme référence pour la migration API ! 🚀**
