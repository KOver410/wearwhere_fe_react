import {
  User, ShoppingBag, RotateCcw, MapPin, CreditCard, Settings, ChevronRight, LogOut, Ticket, Shirt, Heart,
} from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { currentUser } from '@/app/data/accountMockData';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { useAuth } from '@/app/contexts/AuthContext';

export function AccountLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { v } = useLanguage();
  const { logout } = useAuth();

  const menuItems = [
    { path: '/account/profile', label: v('My Profile', 'Hồ sơ'), icon: User },
    { path: '/account/orders', label: v('My Orders', 'Đơn hàng'), icon: ShoppingBag },
    { path: '/account/returns', label: v('My Returns', 'Đổi trả'), icon: RotateCcw },
    { path: '/account/vouchers', label: v('My Vouchers', 'Voucher'), icon: Ticket },
    { path: '/account/wardrobe', label: v('My Wardrobe', 'Tủ đồ'), icon: Shirt },
    { path: '/wishlist', label: v('Wishlist', 'Yêu thích'), icon: Heart },
    { path: '/account/addresses', label: v('Address Book', 'Địa chỉ'), icon: MapPin },
    { path: '/account/payments', label: v('Payment Methods', 'Thanh toán'), icon: CreditCard },
    { path: '/account/settings', label: v('Settings', 'Cài đặt'), icon: Settings },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
      <div className="mx-auto px-4 lg:px-6 py-4 sm:py-5" style={{ maxWidth: 'calc(75% + 320px)' }}>
        <nav className="flex items-center gap-2 mb-8" style={{ fontSize: '13px', color: '#888' }}>
          <Link to="/" className="hover:text-[#d41c1c] transition-colors">{v('Home', 'Trang chủ')}</Link>
          <ChevronRight className="w-3 h-3" />
          <span style={{ color: '#0d0d0d', fontWeight: 700 }}>{v('My Account', 'Tài khoản')}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="p-6 mb-4 bg-white" style={{ border: '1px solid #e0d8cf' }}>
              <div className="flex items-center gap-3 mb-6 pb-6" style={{ borderBottom: '1px solid #e0d8cf' }}>
                <ImageWithFallback src={currentUser.avatar} alt={currentUser.fullName}
                  className="w-14 h-14 rounded-full object-cover" style={{ border: '2px solid #d41c1c' } as any} />
                <div className="min-w-0">
                  <p style={{ fontSize: '16px', fontWeight: 800, color: '#0d0d0d' }} className="truncate">{currentUser.fullName}</p>
                  <p style={{ fontSize: '13px', color: '#888' }}>@{currentUser.username}</p>
                </div>
              </div>

              <nav className="space-y-1">
                {menuItems.map(item => {
                  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                  return (
                    <Link key={item.path} to={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 transition-all ${
                        isActive ? 'text-white' : 'text-[#0d0d0d] hover:text-[#d41c1c] hover:bg-[#f5f0ea]'
                      }`}
                      style={{ fontSize: '14px', fontWeight: isActive ? 800 : 500, backgroundColor: isActive ? '#d41c1c' : undefined }}>
                      <item.icon className="w-4 h-4" /><span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-4 pt-4" style={{ borderTop: '1px solid #e0d8cf' }}>
                <Link to="/" onClick={() => logout()}
                  className="flex items-center gap-3 px-3 py-2.5 text-[#d41c1c] hover:bg-[#fef2f2] transition-colors"
                  style={{ fontSize: '14px', fontWeight: 700 }}>
                  <LogOut className="w-4 h-4" /><span>{v('Log Out', 'Đăng xuất')}</span>
                </Link>
              </div>
            </div>
          </aside>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}