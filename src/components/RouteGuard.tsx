import { useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ 
  children, 
  requireAuth = false, 
  redirectTo = '/IniciarSesion' 
}) => {
  const { autenticado } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if authentication is required and user is not authenticated
    if (requireAuth && !autenticado) {
      console.log(`🔒 Route ${location.pathname} requires authentication, redirecting to ${redirectTo}`);
      navigate(redirectTo, { replace: true });
    }
  }, [autenticado, requireAuth, navigate, redirectTo, location.pathname]);

  // If auth is required but user is not authenticated, don't render children
  if (requireAuth && !autenticado) {
    return null;
  }

  return <>{children}</>;
};

export default RouteGuard;
