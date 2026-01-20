# API Endpoints par Page

*[Fichier déplacé depuis la racine vers `/doc/` pour une meilleure organisation]*

## 📋 Vue d'ensemble

Ce document mappe les endpoints API aux pages de l'application Match.

Pour les détails complets avec exemples de code, voir :
- **[SERVICES_BY_PAGE.md](/doc/SERVICES_BY_PAGE.md)** - Services et exemples détaillés
- **[API_IMPLEMENTATION_SUMMARY.md](/doc/API_IMPLEMENTATION_SUMMARY.md)** - Vue d'ensemble

## 🗺️ Mapping Endpoints → Pages

### Authentification
- `/components/Login.tsx` → `POST /api/auth/login`
- `/components/Register.tsx` → `POST /api/auth/register`

### Dashboard
- `/pages/dashboard/Dashboard.tsx` → `GET /api/partners/analytics/dashboard`

### Établissements
- `/pages/mes-restaurants/MesRestaurants.tsx` → `GET /api/partners/venues`
- `/pages/ajouter-restaurant/AjouterRestaurant.tsx` → `POST /api/partners/venues`
- `/pages/modifier-restaurant/ModifierRestaurant.tsx` → `PUT /api/partners/venues/:id`

### Matchs
- `/pages/mes-matchs/MesMatchs.tsx` → `GET /api/partners/venues/matches`
- `/pages/programmer-match/ProgrammerMatch.tsx` → `POST /api/partners/venues/:id/matches`
- `/pages/match-detail/MatchDetail.tsx` → `GET /api/partners/venues/:id/matches/:matchId`

### Réservations
- `/pages/reservations/Reservations.tsx` → `GET /api/partners/venues/:id/reservations`
- `/pages/qr-scanner/QRScanner.tsx` → `POST /api/reservations/verify-qr`

### Boosts
- `/pages/booster/Booster.tsx` → `GET /api/boosts/summary`
- `/pages/acheter-boosts/AcheterBoosts.tsx` → `POST /api/boosts/checkout`

### Parrainage
- `/pages/parrainage/Parrainage.tsx` → `GET /api/referral/my-code`

### Compte
- `/pages/compte/Compte.tsx` → `GET /api/auth/me`

---

Pour plus de détails, consultez la documentation complète dans `/doc/`.
