# 📊 Analyse des Fichiers Dupliqués

## Situation Actuelle

Le projet contient des fichiers en **double** entre la racine et `/src/`. Voici l'analyse complète :

## 🔴 DOUBLONS CONFIRMÉS

### Components

| Racine | /src/ | Status |
|--------|-------|--------|
| `/components/Sidebar.tsx` | `/src/components/layout/Sidebar.tsx` | ✅ Migré |
| `/components/Header.tsx` | `/src/components/layout/Header.tsx` | ✅ Migré |
| `/components/Footer.tsx` | `/src/components/layout/Footer.tsx` | ✅ Migré |
| `/components/SideMenu.tsx` | `/src/components/layout/SideMenu.tsx` | ✅ Migré |
| `/components/NotificationsPopup.tsx` | `/src/components/layout/NotificationsPopup.tsx` | ✅ Migré |
| `/components/NotificationBell.tsx` | `/src/components/layout/NotificationBell.tsx` | 🔄 Re-export créé |
| `/components/StatCard.tsx` | `/src/components/common/StatCard.tsx` | ✅ Migré |
| `/components/compte/*.tsx` | `/src/components/compte/*.tsx` | 🔄 Re-exports créés |

### Pages

| Racine | /src/features/ | Status |
|--------|----------------|--------|
| `/components/LandingPage.tsx` | `/src/features/authentication/pages/LandingPage.tsx` | ✅ Migré |
| `/components/Login.tsx` | `/src/features/authentication/pages/Login.tsx` | ✅ Migré |
| `/components/Register.tsx` | `/src/features/authentication/pages/Register.tsx` | ✅ Migré |
| `/pages/dashboard/Dashboard.tsx` | `/src/features/dashboard/pages/Dashboard.tsx` | ✅ Migré |
| `/pages/liste-matchs/ListeMatchs.tsx` | `/src/features/matches/pages/ListeMatchs.tsx` | ✅ Migré |
| `/pages/match-detail/MatchDetail.tsx` | `/src/features/matches/pages/MatchDetail.tsx` | ✅ Migré |
| `/pages/mes-matchs/MesMatchs.tsx` | `/src/features/matches/pages/MesMatchs.tsx` | ✅ Migré |
| `/pages/programmer-match/ProgrammerMatch.tsx` | `/src/features/matches/pages/ProgrammerMatch.tsx` | ✅ Migré |
| `/pages/modifier-match/ModifierMatch.tsx` | `/src/features/matches/pages/ModifierMatch.tsx` | ✅ Migré |
| `/pages/mes-restaurants/MesRestaurants.tsx` | `/src/features/restaurants/pages/MesRestaurants.tsx` | ✅ Migré |
| `/pages/restaurant-detail/RestaurantDetail.tsx` | `/src/features/restaurants/pages/RestaurantDetail.tsx` | ✅ Migré |
| `/pages/ajouter-restaurant/AjouterRestaurant.tsx` | `/src/features/restaurants/pages/AjouterRestaurant.tsx` | ✅ Migré |
| `/pages/modifier-restaurant/ModifierRestaurant.tsx` | `/src/features/restaurants/pages/ModifierRestaurant.tsx` | ✅ Migré |
| `/pages/booster/Booster.tsx` | `/src/features/booster/pages/Booster.tsx` | ✅ Migré |
| `/pages/parrainage/Parrainage.tsx` | `/src/features/parrainage/pages/Parrainage.tsx` | ✅ Migré |
| `/pages/mes-avis/MesAvis.tsx` | `/src/features/avis/pages/MesAvis.tsx` | ✅ Migré |
| `/pages/compte/Compte.tsx` | `/src/features/compte/pages/MonCompte.tsx` | ✅ Migré |
| `/pages/onboarding-welcome/OnboardingWelcome.tsx` | `/src/features/onboarding/pages/OnboardingWelcome.tsx` | ✅ Migré |
| `/pages/infos-etablissement/InfosEtablissement.tsx` | `/src/features/onboarding/pages/InfosEtablissement.tsx` | ✅ Migré |
| `/pages/facturation/Facturation.tsx` | `/src/features/onboarding/pages/Facturation.tsx` | ✅ Migré |
| `/pages/confirmation-onboarding/ConfirmationOnboarding.tsx` | `/src/features/onboarding/pages/ConfirmationOnboarding.tsx` | ✅ Migré |
| `/pages/paiement-validation/PaiementValidation.tsx` | `/src/features/onboarding/pages/PaiementValidation.tsx` | ✅ Migré |
| `/pages/reservations/Reservations.tsx` | `/src/features/reservations/pages/Reservations.tsx` | ✅ Migré |
| `/pages/qr-scanner/QRScanner.tsx` | `/src/features/reservations/pages/QRScanner.tsx` | ✅ Migré |
| `/pages/acheter-boosts/AcheterBoosts.tsx` | - | 🔄 Re-export créé |
| `/pages/app-presentation/AppPresentation.tsx` | - | 🔄 Re-export créé |
| `/pages/notification-center/NotificationCenter.tsx` | - | 🔄 Re-export créé |

### Context

| Racine | /src/ | Status |
|--------|-------|--------|
| `/context/AuthContext.tsx` | `/src/features/authentication/context/AuthContext.tsx` | ✅ Migré |
| `/context/ThemeContext.tsx` | `/src/features/theme/context/ThemeContext.tsx` | ✅ Migré |
| `/context/AppContext.tsx` | - | 🔄 Re-export créé |
| `/context/LanguageContext.tsx` | - | 🔄 Re-export créé |
| `/context/ToastContext.tsx` | - | 🔄 Re-export créé |

### Hooks, Services, Utils

| Racine | /src/ | Statut | Action |
|--------|-------|--------|---------|
| `/hooks/*.ts` | `/src/hooks/*.ts` | ⚠️ À vérifier | Comparer et fusionner |
| `/services/*.ts` | `/src/services/*.ts` | ⚠️ À vérifier | Comparer et fusionner |
| `/data/mockData.ts` | `/src/data/*.ts` | ⚠️ À vérifier | Comparer et fusionner |
| `/config/index.ts` | `/src/constants/*.ts` | ⚠️ À vérifier | Probablement différents |
| `/utils/*.ts` | `/src/utils/*.ts` | ⚠️ À vérifier | Probablement différents (API vs Utils) |

## 🟡 FICHIERS À LA RACINE (Usage Spécial)

Ces fichiers à la racine peuvent avoir un usage différent de `/src/` :

- `/api/index.ts` - Probablement des types/helpers API spécifiques
- `/utils/api-*.ts` - Helpers API spécifiques (différents de `/src/utils/`)
- `/hooks/api/*.ts` - Hooks API custom (peuvent être différents de `/src/hooks/`)

## ✅ FICHIERS LÉGITIMES À LA RACINE

Ces fichiers DOIVENT rester à la racine :

- `/package.json`
- `/tsconfig.json`
- `/vite.config.ts`
- `/styles/globals.css` (ou migrer vers `/src/styles/`)
- `/doc/` - Documentation
- `/*.md` - README, MIGRATION_STATUS, etc.
- `/components/ui/` - shadcn/ui components (si non dans src)

## 🎯 Plan d'Action

### Phase 1 : ✅ COMPLÉTÉ
- [x] Migrer `/App.tsx` vers `/src/app/App.tsx`
- [x] Créer re-exports temporaires pour éviter de casser l'app
- [x] Nettoyer `/package.json`

### Phase 2 : 🔄 EN COURS
- [ ] Comparer `/hooks/` racine vs `/src/hooks/`
- [ ] Comparer `/services/` racine vs `/src/services/`
- [ ] Migrer les contexts restants (AppContext, LanguageContext, ToastContext)
- [ ] Migrer les composants compte
- [ ] Migrer les pages restantes (acheter-boosts, app-presentation, notification-center)

### Phase 3 : ⏳ À FAIRE
- [ ] Supprimer les fichiers racine dupliqués (après vérification)
- [ ] Mettre à jour tous les imports
- [ ] Tests de non-régression
- [ ] Documenter la structure finale

## 📝 Notes

- Les fichiers dans `/src/` suivent une **architecture feature-based** moderne
- Les fichiers à la racine sont probablement issus d'une structure plate ancienne
- La migration est conçue pour être **progressive et sans casse**
- Les re-exports permettent de continuer à développer pendant la migration
