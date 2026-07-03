import { Navigate, useLocation } from 'react-router';
import { useAuth } from '@/shared/contexts/AuthContext';

export function RequireRole({
  role,
  loginPath,
  children,
}: {
  role: string;
  loginPath: string;
  children: React.ReactNode;
}) {
  const { isLoggedIn, isLoading, role: currentRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        data-testid="require-role-loading"
        className="min-h-[240px] flex items-center justify-center px-4 text-sm text-[#4a4a4a]"
      >
        Loading account session...
      </div>
    );
  }

  if (!isLoggedIn || currentRole !== role) {
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
