import { Navigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useApp();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
