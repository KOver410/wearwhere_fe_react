import { useEffect } from 'react';
import { Link } from 'react-router';
import { X, LogIn, UserPlus, ShoppingBag, Heart, Shirt } from 'lucide-react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

export function LoginPromptModal() {
  const { showLoginPrompt, dismissPrompt, pendingRedirect } = useAuth();
  const { v } = useLanguage();
  const signInHref = pendingRedirect
    ? `/login?redirect=${encodeURIComponent(pendingRedirect)}`
    : '/login';

  useEffect(() => {
    if (showLoginPrompt) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showLoginPrompt]);

  return (
    <AnimatePresence>
      {showLoginPrompt && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50" onClick={dismissPrompt} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[440px] bg-white overflow-hidden"
            style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
          >
            <div className="h-[3px]" style={{ backgroundColor: '#d41c1c' }} />

            <button onClick={dismissPrompt} className="absolute top-4 right-4 p-1.5 hover:bg-[#f5f0ea] transition-colors z-10">
              <X className="w-5 h-5 text-[#0d0d0d]" />
            </button>

            <div className="px-8 pt-8 pb-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: '#d41c1c' }}>
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div className="w-12 h-12 flex items-center justify-center" style={{ backgroundColor: '#e2b93b' }}>
                  <Heart className="w-6 h-6 text-[#0d0d0d]" />
                </div>
                <div className="w-10 h-10 flex items-center justify-center" style={{ backgroundColor: '#6f7d4e' }}>
                  <Shirt className="w-5 h-5 text-white" />
                </div>
              </div>

              <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '28px', color: '#0d0d0d', letterSpacing: '0.05em' }}>
                {v('WELCOME TO WEAR WHERE', 'CHÀO MỪNG ĐẾN WEAR WHERE')}
              </h2>

              <p className="mt-2" style={{ fontSize: '14px', color: '#666', lineHeight: 1.6, marginBottom: '28px', fontWeight: 500 }}>
                {v(
                  'Sign in to shop, save your favorites, build your wardrobe and join our fashion community.',
                  'Đăng nhập để mua sắm, lưu yêu thích, xây dựng tủ đồ và tham gia cộng đồng thời trang.'
                )}
              </p>

              <div className="space-y-3">
                <Link to={signInHref} onClick={dismissPrompt}
                  className="flex items-center justify-center gap-2 w-full py-3.5 text-white transition-all hover:bg-[#0d0d0d]"
                  style={{ backgroundColor: '#d41c1c', fontSize: '13px', fontWeight: 800, letterSpacing: '0.1em' }}>
                  <LogIn className="w-4 h-4" />{v('SIGN IN', 'ĐĂNG NHẬP')}
                </Link>
                <Link to="/register" onClick={dismissPrompt}
                  className="flex items-center justify-center gap-2 w-full py-3.5 transition-all hover:bg-[#f5f0ea]"
                  style={{ border: '2px solid #0d0d0d', color: '#0d0d0d', fontSize: '13px', fontWeight: 800, letterSpacing: '0.1em' }}>
                  <UserPlus className="w-4 h-4" />{v('CREATE ACCOUNT', 'TẠO TÀI KHOẢN')}
                </Link>
              </div>
            </div>

            <div className="px-8 py-3" style={{ backgroundColor: '#fff9f2', borderTop: '1px solid #e0d8cf' }}>
              <p className="text-center" style={{ fontSize: '12px', color: '#888', fontWeight: 500 }}>
                {v('You can still browse products and explore brands without an account.', 'Bạn vẫn có thể xem sản phẩm mà không cần tài khoản.')}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
