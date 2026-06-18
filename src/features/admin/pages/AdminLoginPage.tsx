import { useAuth } from '@/shared/contexts/AuthContext';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { PortalLoginForm } from '@/features/auth/components/PortalLoginForm';

export default function AdminLoginPage() {
  const { loginAdmin, isLoggedIn, role } = useAuth();
  const { v } = useLanguage();

  return (
    <PortalLoginForm
      role="admin"
      loginFn={loginAdmin}
      isLoggedIn={isLoggedIn}
      currentRole={role}
      routePrefix="/admin"
      dashboardPath="/admin/dashboard"
      idPrefix="admin"
      title={v('Admin Console', 'Bảng điều khiển quản trị')}
      subtitle={v('Sign in to the WearWhere control center.', 'Đăng nhập vào trung tâm quản trị WearWhere.')}
    />
  );
}
