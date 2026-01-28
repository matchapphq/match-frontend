# 🔌 API Integration Guide - Match Frontend

*[Fichier déplacé depuis la racine vers `/doc/` pour une meilleure organisation]*

**Guide pratique pour migrer du mock data vers l'API backend réelle**

*Last updated: January 2026*

## 📋 Vue d'Ensemble

Ce guide explique **comment migrer** chaque composant du mock data vers les vraies routes API.

**🎯 Approche : Frontend utilise les mêmes noms que le Backend (snake_case)**

Pour une intégration seamless, le frontend utilisera directement les mêmes noms de champs que le backend. Plus besoin de transformation !

## 📚 Documentation complète

Pour les détails complets, consultez :

- **[SERVICES_BY_PAGE.md](/doc/SERVICES_BY_PAGE.md)** - Services recommandés pour chaque page
- **[API_IMPLEMENTATION_SUMMARY.md](/doc/API_IMPLEMENTATION_SUMMARY.md)** - Résumé complet
- **[README_API.md](/doc/README_API.md)** - Documentation des endpoints

## 🗂️ Structure API Service

Tous les endpoints sont définis dans `/services/api.ts` et organisés par domaine :

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

## 🪝 Hooks React Query Disponibles

Tous les hooks sont dans `/hooks/api/` et prêts à l'emploi.

Pour la liste complète des hooks et exemples d'utilisation, voir :
- `/doc/SERVICES_BY_PAGE.md`
- `/doc/SERVICES_USAGE_EXAMPLES.md`

## 🎯 Pattern de Migration

### Avant (Mock Data)
```typescript
import { mockRestaurants } from '../data/mockData';

export function MesRestaurants() {
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  
  return (
    <div>
      {restaurants.map(r => (
        <div key={r.id}>{r.nom}</div>
      ))}
    </div>
  );
}
```

### Après (API Réelle)
```typescript
import { useMyVenues } from '../hooks';

export function MesRestaurants() {
  const { data: venues, loading, error } = useMyVenues();
  
  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;
  
  return (
    <div>
      {venues?.map(v => (
        <div key={v.id}>{v.name}</div>
      ))}
    </div>
  );
}
```

---

Pour plus d'informations et d'exemples complets, consultez la documentation complète dans `/doc/`.
