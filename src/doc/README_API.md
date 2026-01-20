# 🚀 Match Platform - API Implementation

> Implémentation complète des APIs pour la plateforme Match avec approche 100% seamless (snake_case)

## 📖 Table des matières

- [Vue d'ensemble](#-vue-densemble)
- [Quick Start](#-quick-start)
- [Architecture](#-architecture)
- [Documentation](#-documentation)
- [Exemples](#-exemples)
- [Migration](#-migration)

---

## 🎯 Vue d'ensemble

Cette implémentation fournit **27 fichiers** comprenant :

- ✅ **10 services API** couvrant tous les domaines fonctionnels
- ✅ **60+ hooks React** avec gestion automatique des états
- ✅ **150+ fonctions** API prêtes à l'emploi
- ✅ **Documentation exhaustive** avec exemples pratiques
- ✅ **Utilitaires de mapping** pour conversion de données
- ✅ **TypeScript strict** sur toute la chaîne

### Fonctionnalités couvertes

| Domaine | Services | Hooks | Status |
|---------|----------|-------|--------|
| **Authentification** | users.service.ts | useAuth.ts | ✅ |
| **Établissements** | venues.service.ts | useVenues.ts | ✅ |
| **Matchs** | matches.service.ts | useMatches.ts | ✅ |
| **Réservations** | reservations.service.ts | useReservations.ts | ✅ |
| **Boosts** | boosts.service.ts | useBoosts.ts | ✅ |
| **Parrainage** | referral.service.ts | useReferral.ts | ✅ |
| **Abonnements** | subscriptions.service.ts | useSubscriptions.ts | ✅ |
| **Analytics** | analytics.service.ts | - | ✅ |
| **Notifications** | notifications.service.ts | - | ✅ |
| **Avis** | reviews.service.ts | - | ✅ |

---

## ⚡ Quick Start

### Installation

Aucune installation nécessaire ! Tous les fichiers sont déjà créés.

### Utilisation basique

```typescript
// 1. Importer le hook
import { useMyVenues } from './hooks';

// 2. Utiliser dans un composant
function MesRestaurants() {
  const { data: venues, loading, error } = useMyVenues();
  
  if (loading) return <Spinner />;
  if (error) return <Error message={error.message} />;
  
  return (
    <div>
      {venues?.map(venue => (
        <VenueCard key={venue.id} venue={venue} />
      ))}
    </div>
  );
}

// 3. Mutations (POST, PUT, DELETE)
function CreateVenue() {
  const { mutate: createVenue, loading } = useCreateVenue();
  
  const handleSubmit = async (data) => {
    try {
      await createVenue(data);
      toast.success('Établissement créé !');
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  return <VenueForm onSubmit={handleSubmit} loading={loading} />;
}
```

### Authentification

```typescript
import { useLogin, useRegister, setAuthToken } from './hooks';

// Login
const { mutate: login, loading } = useLogin();

const handleLogin = async (email: string, password: string) => {
  const { access_token, user } = await login({ email, password });
  // Token stocké automatiquement
  console.log('User:', user);
};

// Register
const { mutate: register } = useRegister();

const handleRegister = async (data) => {
  const { access_token, user } = await register({
    email: data.email,
    password: data.password,
    name: data.name,
    referral_code: data.referralCode,
  });
};
```

---

## 🏗️ Architecture

### Structure des fichiers

```
/services/               # Services API bruts
  ├── venues.service.ts
  ├── matches.service.ts
  ├── reservations.service.ts
  ├── boosts.service.ts
  ├── referral.service.ts
  ├── subscriptions.service.ts
  ├── analytics.service.ts
  ├── users.service.ts
  ├── notifications.service.ts
  ├── reviews.service.ts
  └── index.ts

/hooks/                  # Custom hooks React
  ├── useApi.ts
  ├── useAuth.ts
  ├── useVenues.ts
  ├── useMatches.ts
  ├── useReservations.ts
  ├── useBoosts.ts
  ├── useReferral.ts
  ├── useSubscriptions.ts
  └── index.ts

/utils/
  ├── api-constants.ts   # Endpoints
  ├── api-helpers.ts     # HTTP functions
  └── data-mappers.ts    # Data transformation

/examples/
  └── MesRestaurantsMigrated.example.tsx
```

### Flow de données

```
┌─────────────────┐
│  React Component │  ← Utilise les hooks
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Custom Hook    │  ← Gère loading/error/cache
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Service API    │  ← Appels HTTP bruts
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Helper     │  ← GET/POST/PUT/DELETE
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Backend API    │  ← Endpoints RESTful
└─────────────────┘
```

---

## 📚 Documentation

### Documents principaux

| Document | Description | Lignes |
|----------|-------------|--------|
| **[API_IMPLEMENTATION_SUMMARY.md](./API_IMPLEMENTATION_SUMMARY.md)** | Vue d'ensemble complète | ~400 |
| **[SERVICES_BY_PAGE.md](./SERVICES_BY_PAGE.md)** | Services recommandés par page | ~800 |
| **[SERVICES_USAGE_EXAMPLES.md](./SERVICES_USAGE_EXAMPLES.md)** | Exemples pratiques d'utilisation | ~600 |
| **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** | Guide de migration mock → API | ~500 |
| **[FILES_CREATED.md](./FILES_CREATED.md)** | Liste de tous les fichiers créés | ~100 |

### Par cas d'usage

#### Vous voulez...

| Objectif | Document à consulter |
|----------|---------------------|
| Comprendre l'implémentation | [API_IMPLEMENTATION_SUMMARY.md](./API_IMPLEMENTATION_SUMMARY.md) |
| Voir quel service utiliser | [SERVICES_BY_PAGE.md](./SERVICES_BY_PAGE.md) |
| Copier du code exemple | [SERVICES_USAGE_EXAMPLES.md](./SERVICES_USAGE_EXAMPLES.md) |
| Migrer une page | [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) |
| Lister tous les fichiers | [FILES_CREATED.md](./FILES_CREATED.md) |

---

**Pour la suite de la documentation, consultez :**
- [QUICK_START.md](./QUICK_START.md) - Guide rapide 5 minutes
- [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md) - Résumé complet
- [API_FILES_INDEX.md](./API_FILES_INDEX.md) - Index de tous les fichiers

---

**Made with ❤️ for Match Platform**
