import { Link } from 'react-router';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { motion } from 'motion/react';
import { StarburstBadge } from './StarburstBadge';

export function HeritageCTA() {
  const { lang } = useLanguage();

  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: '#d41c1c' }}>
      {/* Zigzag pattern */}
      <div className="absolute inset-0 opacity-[0.06]">
        <svg width="100%" height="100%" className="absolute inset-0">
          <pattern id="zigzag" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 10 L10 0 L20 10 L30 0 L40 10" stroke="#fff9f2" strokeWidth="1" fill="none" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#zigzag)" />
        </svg>
      </div>

      {/* Starburst decorations */}
      <div className="absolute -top-4 -left-4 hidden lg:block">
        <StarburstBadge text="JOIN!" size={160} bgColor="#e2b93b" textColor="#0d0d0d" rotate={true} fontSize="24px" />
      </div>
      <div className="absolute -bottom-5 -right-5 hidden lg:block">
        <StarburstBadge text="GO!" size={140} bgColor="#fff9f2" textColor="#0d0d0d" rotate={true} fontSize="22px" />
      </div>

      <div className="relative z-10 max-w-[900px] mx-auto px-4 lg:px-6 py-12 md:py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(36px, 6vw, 72px)', color: '#fff9f2', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
            {lang === 'vi' ? 'SẴN SÀNG THỂ HIỆN PHONG CÁCH?' : 'READY TO OWN YOUR STYLE?'}
          </h2>

          <p className="mt-6 text-white/70" style={{ fontSize: '15px', lineHeight: 1.7, maxWidth: '500px', margin: '24px auto 0' }}>
            {lang === 'vi'
              ? 'Tham gia cộng đồng 50K+ người yêu thời trang local brand Việt Nam.'
              : 'Join 50K+ fashion lovers supporting Vietnamese local brands.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link to="/register"
              className="px-10 py-4 transition-all bg-[#fff9f2] text-[#0d0d0d] hover:bg-[#0d0d0d] hover:text-[#fff9f2]"
              style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              {lang === 'vi' ? 'ĐĂNG KÝ NGAY' : 'SIGN UP NOW'} →
            </Link>
            <Link to="/about"
              className="px-10 py-4 transition-all hover:bg-white/10"
              style={{ border: '2px solid #fff9f2', color: '#fff9f2', fontSize: '13px', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              {lang === 'vi' ? 'VỀ CHÚNG TÔI' : 'ABOUT US'}
            </Link>
          </div>

        </motion.div>

      </div>
    </div>
  );
}