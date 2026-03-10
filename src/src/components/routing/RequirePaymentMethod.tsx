import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/authentication/context/AuthContext';

/**
 * Route guard that redirects venue owners without a payment method
 * to the payment-required onboarding page.
 */
export function RequirePaymentMethod({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();

  if (
    currentUser &&
    currentUser.role === 'venue_owner' &&
    !currentUser.hasPaymentMethod
  ) {
    return <Navigate to="/onboarding/payment-required" replace />;
  }

  return <>{children}</>;
}
