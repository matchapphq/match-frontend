# ⚡ Quick Start - API Implementation

> Démarrer en **5 minutes** avec les APIs réelles

---

## 🎯 En bref

**31 fichiers créés** avec :
- ✅ 10 services API complets
- ✅ 60+ hooks React prêts à l'emploi
- ✅ Documentation exhaustive
- ✅ Approche 100% seamless (snake_case)

**Il suffit de changer les imports !**

---

## 🚀 Étape 1 : Premier hook (2 min)

### Test basique - Charger les établissements

```typescript
// pages/test/ApiTest.tsx
import { useMyVenues } from '../../hooks';

export function ApiTest() {
  const { data: venues, loading, error } = useMyVenues();
  
  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error.message}</div>;
  
  return (
    <div>
      <h1>Mes établissements ({venues?.length || 0})</h1>
      {venues?.map(venue => (
        <div key={venue.id}>
          <h2>{venue.name}</h2>
          <p>{venue.city}</p>
        </div>
      ))}
    </div>
  );
}
```

✅ **C'est tout ! Vous utilisez maintenant l'API réelle.**

---

## 🔄 Étape 2 : Migrer une page (3 min)

### Exemple : Mes Restaurants

#### AVANT

```typescript
import { useAppContext } from '../../context/AppContext';

function MesRestaurants() {
  const { getUserRestaurants } = useAppContext();
  const restaurants = getUserRestaurants(currentUser.id);
  
  return <div>{restaurants.map(r => ...)}</div>;
}
```

#### APRÈS

```typescript
import { useMyVenues } from '../../hooks';

function MesRestaurants() {
  const { data: venues, loading, error } = useMyVenues();
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorBanner message={error.message} />;
  
  return <div>{venues?.map(v => ...)}</div>;
}
```

---

## 📋 Étape 3 : Les hooks par page

### Dashboard
```typescript
import { useMyMatches, useBoostSummary } from '../hooks';

const { data: matches } = useMyMatches();
const { data: boostSummary } = useBoostSummary();
```

### Mes Restaurants
```typescript
import { useMyVenues } from '../hooks';

const { data: venues, loading, error } = useMyVenues();
```

### Programmer Match
```typescript
import { useAllSports, useUpcomingMatches, useMyVenues } from '../hooks';

const { data: sports } = useAllSports();
const { data: matches } = useUpcomingMatches({ limit: 50 });
const { data: venues } = useMyVenues();
```

### Réservations
```typescript
import { useVenueReservations, useUpdateReservationStatus } from '../hooks';

const { data: reservations, refetch } = useVenueReservations(venueId);
const { mutate: updateStatus } = useUpdateReservationStatus();

const handleConfirm = async (id) => {
  await updateStatus({ reservationId: id, status: 'CONFIRMED' });
  refetch();
};
```

### Boosts
```typescript
import { useBoostSummary, useActivateBoost } from '../hooks';

const { data: summary } = useBoostSummary();
const { mutate: activateBoost } = useActivateBoost();

const handleBoost = async (matchId) => {
  await activateBoost({ venue_match_id: matchId });
};
```

### Parrainage
```typescript
import { useMyReferralCode, useReferralStats } from '../hooks';

const { data: code } = useMyReferralCode();
const { data: stats } = useReferralStats();
```

---

## 🎨 Patterns courants

### 1. Charger et afficher

```typescript
const { data, loading, error } = useMyVenues();

if (loading) return <Spinner />;
if (error) return <Error message={error.message} />;

return <div>{data?.map(item => ...)}</div>;
```

### 2. Créer une ressource

```typescript
const { mutate: create, loading } = useCreateVenue();

const handleSubmit = async (formData) => {
  try {
    await create(formData);
    toast.success('Créé !');
  } catch (error) {
    toast.error(error.message);
  }
};
```

### 3. Modifier une ressource

```typescript
const { data, refetch } = useMyVenues();
const { mutate: update } = useUpdateVenue(venueId);

const handleUpdate = async (newData) => {
  await update(newData);
  refetch(); // Recharger
};
```

### 4. Paiement Stripe

```typescript
const { mutate: createCheckout } = useCreateBoostCheckout();

const handlePurchase = async (pack) => {
  const { checkout_url } = await createCheckout({
    pack_type: pack.id,
    quantity: pack.quantity,
    amount: pack.price,
  });
  
  window.location.href = checkout_url;
};
```

---

## 🔧 Astuces

### Gestion du token

```typescript
import { getAuthToken, setAuthToken, clearAuthToken } from './hooks/useApi';

// Récupérer
const token = getAuthToken();

// Stocker
setAuthToken('eyJhbGc...');

// Nettoyer (logout)
clearAuthToken();
```

### Mapper les données

```typescript
import { mapVenueToRestaurant } from './utils/data-mappers';

// Backend → UI
const venues = await getMyVenues(authToken);
const restaurants = venues.map(v => mapVenueToRestaurant(v));
```

### Cache

```typescript
import { getCached, clearCache } from './hooks/useApi';

// Utiliser le cache
const data = await getCached('my-venues', 
  () => getMyVenues(authToken),
  5 * 60 * 1000 // 5 minutes
);

// Nettoyer
clearCache('my-venues');
```

---

## 📚 Documentation complète

| Document | Usage |
|----------|-------|
| [README_API.md](./README_API.md) | **LIRE EN PREMIER** |
| [SERVICES_BY_PAGE.md](./SERVICES_BY_PAGE.md) | Quel service pour quelle page |
| [SERVICES_USAGE_EXAMPLES.md](./SERVICES_USAGE_EXAMPLES.md) | Exemples de code |
| [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) | Guide de migration |

---

## ✅ Checklist

- [ ] Tester un hook simple (`useMyVenues()`)
- [ ] Migrer une page (Mes Restaurants)
- [ ] Tester une mutation (`useCreateVenue()`)
- [ ] Gérer les erreurs
- [ ] Implémenter le loading state
- [ ] Consulter la doc complète

---

## 🎉 Vous êtes prêt !

**Tout est en place. Commencez par tester un hook simple et migrez progressivement vos pages.**

**Bonne intégration ! 🚀**

---

**Pour aller plus loin :**
- Consulter [README_API.md](./README_API.md) pour la doc complète
- Voir [SERVICES_USAGE_EXAMPLES.md](./SERVICES_USAGE_EXAMPLES.md) pour plus d'exemples
- Lire [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) pour migrer vos pages
