import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading, promptLogin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      promptLogin(location.pathname);
    }
  }, [isLoggedIn, isLoading, location.pathname, promptLogin]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#d41c1c]" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}
