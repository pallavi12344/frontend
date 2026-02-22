import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

export function withAuth<P extends object>(Component: React.ComponentType<P>): React.FC<P> {
  const ProtectedRoute: React.FC<P> = (props) => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.replace('/login');
      }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;
    return <Component {...props} />;
  };
  ProtectedRoute.displayName = `withAuth(${Component.displayName || Component.name})`;
  return ProtectedRoute;
}
