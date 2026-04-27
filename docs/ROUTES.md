# Frontend Routes

Source: `src/app/App.tsx`.

## Public
- `/`
- `/login`
- `/register`
- `/forgot-password`
- `/public-referral`
- `/presentation`
- `/terms`
- `/privacy`
- `/terms-of-sale`

## Onboarding (auth requis)
- `/onboarding`
- `/onboarding/add-venue` (redirect vers `/onboarding/info`)
- `/onboarding/info`
- `/onboarding/billing`
- `/onboarding/confirmation`
- `/onboarding/payment-required`

## Espace partenaire (auth + paiement + onboarding)
- `/dashboard`
- `/matches`
- `/matches/schedule`
- `/my-matches`
- `/my-matches/:id`
- `/my-matches/:id/edit`
- `/my-venues`
- `/my-venues/add`
- `/my-venues/add/info`
- `/my-venues/add/billing`
- `/my-venues/add/confirmation`
- `/my-venues/:id`
- `/my-venues/:id/edit`
- `/boost`
- `/boost/purchase`
- `/referral`
- `/my-reviews`
- `/account`
- `/account/info`
- `/account/billing`
- `/account/notifications`
- `/account/security`
- `/account/data`
- `/account/help`
- `/reservations`
- `/notifications`
- `/qr-scanner`

## Fallback
- `*` redirige vers `/`
