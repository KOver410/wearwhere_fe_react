import { useLocation } from 'react-router';
import { Header } from '@/shared/components/Header';
import { Footer } from '@/shared/components/Footer';
import { AppRoutes } from '@/app/routes/AppRoutes';

export function PublicLayout() {
  const location = useLocation();
  const isAuthOrOnboarding =
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/register') ||
    location.pathname.startsWith('/forgot-password') ||
    location.pathname.startsWith('/reset-password') ||
    location.pathname.startsWith('/verify-email') ||
    location.pathname.startsWith('/email-verified') ||
    location.pathname.startsWith('/onboarding') ||
    (location.pathname.startsWith('/brand/') || location.pathname === '/brand') ||
    location.pathname.startsWith('/admin');

  const isBrandOrAdmin =
    (location.pathname.startsWith('/brand/') || location.pathname === '/brand') ||
    location.pathname.startsWith('/admin');

  return (
    <div
      className={`min-h-screen flex flex-col ${isBrandOrAdmin ? 'bg-white' : ''}`}
      style={!isBrandOrAdmin ? { backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" } : {}}
    >
      {!isAuthOrOnboarding && <Header />}
      <main className="flex-1">
        <AppRoutes />
      </main>
      {!isAuthOrOnboarding && <Footer />}
    </div>
  );
}
