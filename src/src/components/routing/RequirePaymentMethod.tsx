import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/authentication/context/AuthContext';
import { getPendingPaymentVenueId } from '../../utils/checkout-state';

/**
 * Route guard that redirects venue owners without a payment method
 * to the payment-required onboarding page.
 */
export function RequirePaymentMethod({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const pendingVenueId = getPendingPaymentVenueId();

  if (
    currentUser &&
    currentUser.role === 'venue_owner' &&
    !currentUser.hasPaymentMethod
  ) {
    const venueQuery = pendingVenueId ? `?venue=${encodeURIComponent(pendingVenueId)}` : '';
    return <Navigate to={`/onboarding/payment-required${venueQuery}`} replace />;
  }

  return <>{children}</>;
}
