import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useAuth } from '@/shared/contexts/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading, promptLogin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      promptLogin(`${location.pathname}${location.search}`);
    }
  }, [isLoading, isLoggedIn, location.pathname, location.search, promptLogin]);

  if (isLoading) {
    return (
      <div
        data-testid="protected-route-loading"
        className="min-h-[240px] flex items-center justify-center px-4 text-sm text-[#4a4a4a]"
      >
        Loading account session...
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}
