import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/authentication/context/AuthContext';

/**
 * Route guard that redirects users who haven't completed onboarding.
 * Must be nested inside RequireAuth.
 */
export function RequireOnboarding({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();

  if (currentUser && !currentUser.hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
