/**
 * Authentication feature public API
 * Export all authentication-related pages, hooks, and types
 */

// Pages
export { Login } from './pages/Login';
export { Register } from './pages/Register';
export { LandingPage } from './pages/LandingPage';
export { ForgotPassword } from './pages/ForgotPassword';

// Context & Hooks
export { AuthProvider, useAuth } from './context/AuthContext';

// Types (re-export from global types)
export type { User, LoginCredentials, RegisterData } from '@types';