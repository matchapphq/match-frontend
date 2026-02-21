import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../features/authentication/context/AuthContext';

/**
 * Route guard that redirects unauthenticated users to the login page.
 * Preserves the attempted URL so we can redirect back after login.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#5a03cf] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
