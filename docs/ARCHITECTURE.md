# Frontend Architecture

## Pipeline d'exécution
1. `src/main.tsx`
   - initialise `QueryClientProvider`
   - monte `App`
   - charge `index.css` + `styles/globals.css`
2. `src/app/App.tsx`
   - providers UI/app/auth/theme/lang
   - `SeoManager`
   - guard Stripe return (`StripeReturnHandler`)
   - routing principal

## Routing
Routes publiques:
- `/`, `/login`, `/register`, `/forgot-password`, `/public-referral`
- `/presentation`, `/terms`, `/privacy`, `/terms-of-sale`

Routes authentifiées (layout partenaire):
- `/dashboard`
- `/matches`, `/matches/schedule`
- `/my-matches`, `/my-matches/:id`, `/my-matches/:id/edit`
- `/my-venues`, `/my-venues/add`, `/my-venues/:id`, `/my-venues/:id/edit`
- `/boost`, `/boost/purchase`
- `/referral`, `/my-reviews`
- `/account/*`
- `/reservations`, `/notifications`, `/qr-scanner`

## Organisation des dossiers `src/`
- `app/`: app shell + routing
- `features/`: logique métier par domaine
- `components/`: composants transverses
- `pages/`: pages historiques encore utilisées
- `services/` + `api/`: accès API
- `hooks/`, `utils/`, `context/`, `types/`

## API
- base URL via `VITE_API_URL`
- fallback local: `http://localhost:8008/api`
- appels via `axios` + hooks métiers (`src/hooks/api/*`)

## SEO
- `SeoManager` met à jour les meta tags dynamiques
- build SEO génère des pages statiques pour les routes publiques
- JSON-LD géré au format `@context + @graph`

## Qualité attendue
- TypeScript strict sans erreurs
- build Vite sans erreurs
- pas de dépendance au layout legacy `src/src`
