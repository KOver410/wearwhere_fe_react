import { useAuth } from '@/shared/contexts/AuthContext'
import { useLanguage } from '@/shared/i18n/LanguageContext'
import { PortalLoginForm } from '@/features/auth/components/PortalLoginForm'

export function BrandLoginPage() {
  const { loginBrand, isLoggedIn, role } = useAuth()
  const { v } = useLanguage()

  return (
    <PortalLoginForm
      role="brand"
      loginFn={loginBrand}
      isLoggedIn={isLoggedIn}
      currentRole={role}
      routePrefix="/brand"
      dashboardPath="/brand/dashboard"
      idPrefix="brand"
      title={v('Brand Portal', 'Cổng thương hiệu')}
      subtitle={v('Sign in to manage your store.', 'Đăng nhập để quản lý cửa hàng của bạn.')}
    />
  )
}
