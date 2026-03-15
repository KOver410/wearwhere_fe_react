import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useAuth } from '@/app/contexts/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, promptLogin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      promptLogin(location.pathname);
    }
  }, [isLoggedIn, location.pathname, promptLogin]);

  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}
