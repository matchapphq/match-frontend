
  # moderne-match

  This is a code bundle for moderne-match. The original project is available at https://www.figma.com/design/fkXLUjKz0LO2thl1IzmdFB/moderne-match.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Account Deactivation Grace Period

  The dashboard does not define the reactivation/deletion grace period locally.
  It reads `account_deletion_grace_days` from `GET /users/me/privacy-preferences`,
  which is controlled by the backend env variable `ACCOUNT_DELETION_GRACE_DAYS`.
  
