export type LogoutReason =
  | 'session_invalidated'
  | 'session_inactive'
  | 'session_expired'
  | 'session_security'
  | 'missing_refresh_token'
  | 'token_refresh_failed';
