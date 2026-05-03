import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/authentication/context/AuthContext';

/**
 * Route guard for public-only pages (landing, login, register).
 * Redirects authenticated users to the dashboard.
 */
export function PublicOnly({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, currentUser } = useAuth();
  const hasSessionHint = Boolean(
    localStorage.getItem('authToken') ||
    sessionStorage.getItem('authToken') ||
    localStorage.getItem('refresh_token') ||
    sessionStorage.getItem('refresh_token')
  );

  if (isLoading && hasSessionHint) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#5a03cf] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    if (currentUser && !currentUser.hasCompletedOnboarding) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
