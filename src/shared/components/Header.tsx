import { Search, ShoppingBag, User, MapPin, Info, HelpCircle, Store, Menu, X, Globe, Bell, LogIn, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import logoImage from '@/assets/80e96fc2cdc554ebf44dc26a8edeb9829e3445b2.png';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { useAuth } from '@/shared/contexts/AuthContext';
import { getCart } from '@/features/account/api/cartApi';
import { CART_UPDATED_EVENT } from '@/features/account/api/cartEvents';

interface HeaderProps {
  onNavigate?: (page: any) => void;
  currentPage?: any;
}

export function Header({}: HeaderProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { lang, setLang, t, v } = useLanguage();
  const { isLoggedIn, promptLogin } = useAuth();
  const [cartQty, setCartQty] = useState(0);
  // Monotonic request-sequence guard: rapid cart-updated events fire concurrent
  // getCart() calls; only the latest-issued response may set the badge so a
  // stale late resolver can't overwrite a newer count.
  const reqSeq = useRef(0);
  const isCartRoute = currentPath === '/cart' || currentPath.startsWith('/cart/');

  // Authoritative cart-badge count from the backend. Refreshed on login, on
  // entering/leaving the cart route, and on the cart-updated browser event that
  // add/update/remove/clear operations dispatch. No global cart store here.
  useEffect(() => {
    if (!isLoggedIn) {
      setCartQty(0);
      return;
    }

    let active = true;
    const refresh = () => {
      const seq = ++reqSeq.current;
      getCart()
        .then(cart => {
          if (active && seq === reqSeq.current) setCartQty(cart.summary.total_qty);
        })
        .catch(() => {
          // A failed badge refresh must not break the header.
        });
    };

    refresh();
    window.addEventListener(CART_UPDATED_EVENT, refresh);
    return () => {
      active = false;
      window.removeEventListener(CART_UPDATED_EVENT, refresh);
    };
    // Re-run when auth changes or the cart route is entered/left so the badge
    // reflects edits made on the cart page.
  }, [isLoggedIn, isCartRoute]);

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + '/');
  const toggleLang = () => setLang(lang === 'en' ? 'vi' : 'en');

  return (
    <header className="sticky top-0 z-50" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      {/* Top Bar - Black */}
      <div style={{ backgroundColor: '#0d0d0d' }}>
        <div className="mx-auto px-4 lg:px-6 flex items-center justify-between h-8" style={{ maxWidth: 'calc(75% + 320px)' }}>
          <div className="hidden sm:flex items-center gap-6">
            <Link to="/about" className="text-white/60 hover:text-white transition-colors"
              style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>
              {t('header.aboutUs')}
            </Link>
            <Link to="/how-it-works" className="text-white/60 hover:text-white transition-colors"
              style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>
              {t('header.howItWorks')}
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={toggleLang} className="text-white/60 hover:text-white transition-colors flex items-center gap-1.5"
              style={{ fontSize: '10px', letterSpacing: '0.1em', fontWeight: 700 }}>
              <Globe className="w-3 h-3" />
              <span className={lang === 'en' ? 'text-white' : ''}>EN</span>
              <span className="text-white/30">|</span>
              <span className={lang === 'vi' ? 'text-white' : ''}>VI</span>
            </button>
            <Link to="/partner" className="hidden sm:block text-white/60 hover:text-white transition-colors"
              style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700 }}>
              {t('header.becomeASeller')}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div style={{ backgroundColor: '#fff9f2', borderBottom: '2px solid #0d0d0d' }}>
        <div className="mx-auto px-4 lg:px-6" style={{ maxWidth: 'calc(75% + 320px)' }}>
          <div className="flex items-center justify-between h-14 gap-6">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img src={logoImage} alt="Wear Where" className="h-9 w-auto" />
            </Link>

            {/* Right Side */}
            <div className="flex items-center gap-0">
              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center">
                {[
                  { to: '/', label: v('HOME', 'TRANG CHỦ'), active: currentPath === '/' },
                  { to: '/shop', label: v('SHOP', 'CỬA HÀNG'), active: isActive('/shop') },
                  { to: '/ootd', label: 'OOTD', active: isActive('/ootd') || isActive('/style') },
                  { to: '/brands', label: v('BRAND', 'THƯƠNG HIỆU'), active: isActive('/brands') },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`px-4 py-2 transition-all relative ${
                      item.active ? 'text-[#d41c1c]' : 'text-[#0d0d0d] hover:text-[#d41c1c]'
                    }`}
                    style={{
                      fontSize: '12px',
                      fontWeight: 800,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.label}
                    {item.active && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[2px]" style={{ backgroundColor: '#d41c1c' }} />
                    )}
                  </Link>
                ))}
              </nav>

              <div className="hidden md:block w-px h-4 mx-3" style={{ backgroundColor: '#0d0d0d' }} />

              {/* Icon Actions */}
              <div className="flex items-center gap-0">
                <Link to="/search" className="p-2 hover:bg-[#0d0d0d]/5 transition-colors" aria-label="Search">
                  <Search className={`w-[18px] h-[18px] ${isActive('/search') ? 'text-[#d41c1c]' : 'text-[#0d0d0d]'}`} />
                </Link>

                {isLoggedIn ? (
                  <>
                    <Link to="/cart" className="p-2 hover:bg-[#0d0d0d]/5 transition-colors relative" aria-label={v('Cart', 'Giỏ hàng')}>
                      <ShoppingBag className="w-[18px] h-[18px] text-[#0d0d0d]" />
                      {cartQty > 0 && (
                        <span data-testid="cart-badge" className="absolute -top-0 -right-0 text-white rounded-full w-4 h-4 flex items-center justify-center"
                          style={{ fontSize: '9px', fontWeight: 900, backgroundColor: '#d41c1c' }}>{cartQty}</span>
                      )}
                    </Link>
                    <Link to="/notifications" className="p-2 hover:bg-[#0d0d0d]/5 transition-colors relative" aria-label="Notifications">
                      <Bell className="w-[18px] h-[18px] text-[#0d0d0d]" />
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: '#d41c1c' }} />
                    </Link>
                    <Link to="/account/profile" className="p-2 hover:bg-[#0d0d0d]/5 transition-colors">
                      <User className={`w-[18px] h-[18px] ${isActive('/account') ? 'text-[#d41c1c]' : 'text-[#0d0d0d]'}`} />
                    </Link>
                  </>
                ) : (
                  <>
                    <button onClick={() => promptLogin('/cart')} className="p-2 hover:bg-[#0d0d0d]/5 transition-colors relative">
                      <ShoppingBag className="w-[18px] h-[18px] text-[#0d0d0d]" />
                    </button>
                    <Link to="/login"
                      className="hidden sm:flex items-center gap-1.5 ml-3 px-5 py-2 text-white transition-all hover:bg-[#0d0d0d]"
                      style={{ backgroundColor: '#d41c1c', fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      <LogIn className="w-3.5 h-3.5" />
                      {v('Sign In', 'Đăng Nhập')}
                    </Link>
                    <button onClick={() => promptLogin()} className="sm:hidden p-2 hover:bg-[#0d0d0d]/5 transition-colors">
                      <User className="w-[18px] h-[18px] text-[#0d0d0d]" />
                    </button>
                  </>
                )}

                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 hover:bg-[#0d0d0d]/5 transition-colors">
                  {mobileMenuOpen ? <X className="w-5 h-5 text-[#0d0d0d]" /> : <Menu className="w-5 h-5 text-[#0d0d0d]" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shopping Navigation Bar - Desktop */}
      <div className="hidden md:block" style={{ backgroundColor: '#fff9f2', borderBottom: '1px solid #e0d8cf' }}>
        <div className="mx-auto px-4 lg:px-6" style={{ maxWidth: 'calc(75% + 320px)' }}>
          <nav className="flex items-center justify-center gap-0 h-10">
            {[
              { to: '/shop?category=women', label: t('nav.women') },
              { to: '/shop?category=men', label: t('nav.men') },
              { to: '/shop?category=kids', label: t('nav.kids') },
              { to: '/shop?category=new', label: v('New Arrivals', 'Hàng Mới') },
              { to: '/shop?sort=popular', label: t('nav.trending') },
              { to: '/stores', label: t('nav.stores') },
            ].map((item) => (
              <Link key={item.to} to={item.to}
                className="px-4 py-1.5 text-[#0d0d0d]/60 hover:text-[#0d0d0d] transition-colors"
                style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              disabled
              title={v('Not supported yet', 'Chưa hỗ trợ')}
              className="px-4 py-1 ml-2 cursor-not-allowed opacity-50"
              style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#d41c1c', border: '2px solid #d41c1c' }}>
              {t('nav.sale')} ({v('Not supported yet', 'Chưa hỗ trợ')})
            </button>
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden" style={{ backgroundColor: '#fff9f2', borderBottom: '3px solid #0d0d0d' }}>
          <div className="mx-auto px-6 py-4 space-y-1" style={{ maxWidth: 'calc(75% + 320px)' }}>
            {[
              { to: '/', label: v('Home', 'Trang Chủ') },
              { to: '/shop', label: v('Shop', 'Cửa Hàng') },
              { to: '/ootd', label: 'OOTD' },
              { to: '/brands', label: v('Brands', 'Thương Hiệu') },
            ].map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-[#0d0d0d] hover:text-[#d41c1c] hover:bg-[#0d0d0d]/5 transition-colors"
                style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {item.label}
              </Link>
            ))}
            <div className="my-3 h-[2px]" style={{ backgroundColor: '#0d0d0d' }} />
            <p className="px-3 py-1" style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#d41c1c' }}>
              {v('Shop', 'Mua Sắm')}
            </p>
            {[
              { to: '/shop?category=women', label: t('nav.women') },
              { to: '/shop?category=men', label: t('nav.men') },
              { to: '/shop?category=kids', label: t('nav.kids') },
            ].map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-[#0d0d0d] hover:text-[#d41c1c] transition-colors"
                style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.03em' }}>
                {item.label}
              </Link>
            ))}
            <button type="button" disabled
              title={v('Not supported yet', 'Chưa hỗ trợ')}
              className="block w-full text-left px-3 py-2.5 text-[#0d0d0d] cursor-not-allowed opacity-50"
              style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.03em' }}>
              {t('nav.sale')} ({v('Not supported yet', 'Chưa hỗ trợ')})
            </button>
            <div className="my-3 h-[2px]" style={{ backgroundColor: '#0d0d0d' }} />
            {[
              { to: '/stores', label: t('mobile.storeLocator'), icon: <MapPin className="w-4 h-4" /> },
              { to: '/account/profile', label: v('My Account', 'Tài Khoản'), icon: <User className="w-4 h-4" /> },
              { to: '/wishlist', label: v('Wishlist', 'Yêu Thích'), icon: <Heart className="w-4 h-4" /> },
            ].map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 text-[#0d0d0d] hover:text-[#d41c1c] transition-colors"
                style={{ fontSize: '14px', fontWeight: 600 }}>
                {item.icon}{item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}