# Match Frontend (Dashboard Partenaires)

Application React/Vite du projet Match.

## Objectif
Le frontend permet aux établissements partenaires de:
- gérer onboarding et infos établissement
- programmer/modifier les matchs diffusés
- suivre réservations, notifications, avis et compte
- gérer billing/moyen de paiement et boosts

## Stack
- React 18
- TypeScript 5
- Vite 6
- React Router
- TanStack Query
- UI basée sur Radix + composants internes (`src/components/ui`)

## Structure
Le frontend utilise une structure unique:
- `src/` (source applicative)
- plus de `src/src` imbriqué

Entrées principales:
- `src/main.tsx`
- `src/app/App.tsx`
- `src/components/routing/RouteAdapters.tsx`
- `src/services/api.ts` et `src/utils/api-constants.ts`

## Prérequis
- Node.js 20+
- npm 10+
- backend accessible (local ou distant)

## Installation
```bash
cd front
npm install
```

## Variables d'environnement
Fichier: `front/.env`

Variables utilisées:
- `VITE_API_URL` URL API backend (ex: `http://localhost:8008/api`)
- `VITE_GOOGLE_CLIENT_ID` Client ID Google OAuth côté frontend

## Scripts
```bash
# dev server
npm run dev

# typecheck TS
npm run typecheck

# build production + pages SEO statiques
npm run build
```

## Qualité
Avant push:
1. `npm run typecheck`
2. `npm run build`
3. vérifier le chargement de l'app en local (`npm run dev`)
4. vérifier la navigation des routes critiques (login, dashboard, matches, my-venues, billing)

## Build output
Le build sort dans `front/build/`.

Le script `scripts/build-seo-pages.ts` génère les pages statiques SEO publiques:
- `/`
- `/presentation`
- `/public-referral`
- `/terms`
- `/privacy`
- `/terms-of-sale`

## Docs complémentaires
- `front/docs/INDEX.md`
- `front/docs/ARCHITECTURE.md`
