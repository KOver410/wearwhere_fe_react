import { Link } from 'react-router';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { motion } from 'motion/react';
import svgPaths from '../../imports/svg-808xvy0n2p';
import ownYourFitImg from "@/assets/1a3ecfcfac22b27f28a84b104b2e2f2af08112c0.png";
import limitedImg from "@/assets/57c7275ffcf3e07274192b3249898a58d3cb60fe.png";

export function HeroSection() {
  const { lang } = useLanguage();

  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: '#fff9f2' }}>
      <div className="relative z-10 mx-auto px-6 lg:px-9" style={{ maxWidth: 'calc(75% + 320px)', height: 'clamp(360px, 42vw, 480px)' }}>
        <div className="flex h-full">
          {/* ═══ LEFT: Main Typography ═══ */}
          <div className="relative z-10 flex flex-col justify-between py-10 lg:py-12 shrink-0" style={{ width: '48%' }}>
            {/* Top: Heading + Subheading */}
            <div>
              {/* Giant heading */}
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: 'clamp(44px, 7vw, 88px)',
                  lineHeight: 0.92,
                  color: '#0d0d0d',
                  letterSpacing: '-0.02em',
                }}
              >
                MAKE YOUR<br />
                <span style={{ color: '#d41c1c' }}>STYLE</span><br />
                FIT.
              </motion.h1>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-5"
                style={{ fontSize: '14px', color: '#4a4a4a', lineHeight: 1.65, fontWeight: 500, maxWidth: '380px' }}
              >
                {lang === 'vi'
                  ? 'Thời trang không phải để bạn vừa vặn với nó. Nó phải vừa vặn với bạn.'
                  : 'Fashion is not about fitting in. It\'s about standing out — your way.'}
              </motion.p>
            </div>

            {/* Bottom: Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-4"
            >
              {/* SHOP NOW starburst */}
              <Link to="/shop" className="group relative shrink-0" style={{ width: '64px', height: '64px' }}>
                <svg
                  className="absolute inset-0 w-full h-full transition-transform duration-300 group-hover:scale-110"
                  viewBox="0 0 109 109"
                  fill="none"
                >
                  <path d={svgPaths.p1ab1fce0} fill="#D41C1C" />
                </svg>
                <span
                  className="absolute inset-0 flex items-center justify-center text-center"
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: '13px',
                    color: '#FFFFFF',
                    letterSpacing: '0.6px',
                    lineHeight: 1,
                  }}
                >
                  SHOP<br />NOW
                </span>
              </Link>

              {/* Outlined button */}
              <Link
                to="/brands"
                className="flex items-center justify-center transition-all text-[#0d0d0d] hover:bg-[#0d0d0d] hover:text-[#fff9f2]"
                style={{
                  border: '2px solid #0d0d0d',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '1.8px',
                  textTransform: 'uppercase' as const,
                  fontFamily: "'Montserrat', sans-serif",
                  height: '42px',
                  paddingLeft: '24px',
                  paddingRight: '24px',
                }}
              >
                {lang === 'vi' ? 'KHÁM PHÁ BRANDS' : 'EXPLORE BRANDS'}
              </Link>
            </motion.div>
          </div>

          {/* ═══ RIGHT: Graphic Shapes ═══ */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="relative hidden lg:flex flex-1 h-full items-center justify-center"
          >
            {/* Container for all 3 graphic elements */}
            <div className="relative w-full h-full">

              {/* ── LIMITED — mustard starburst (top-left of right area) ── */}
              <motion.div
                className="absolute"
                style={{ top: '6%', left: '10%', width: '36%', aspectRatio: '1' }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.img
                  src={limitedImg}
                  alt="LIMITED"
                  className="w-full h-full object-contain mx-[-164px] my-[0px]"
                  style={{ transform: 'translateX(-15%)' }}
                  animate={{
                    rotate: [0, -3, 0, 3, 0],
                    scale: [1, 1.05, 1, 1.03, 1],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </motion.div>

              {/* ── NEW DROP — red starburst (right side, middle) ── */}
              <div
                className="absolute"
                style={{ top: '12%', right: '-2%', width: '48%', aspectRatio: '1' }}
              >
                <motion.svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 417.18 427.908"
                  fill="none"
                  preserveAspectRatio="xMidYMid meet"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                >
                  <path d={svgPaths.pe5d4080} fill="#B22C2C" />
                </motion.svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-center"
                    style={{
                      fontFamily: "'Oswald', sans-serif",
                      fontSize: 'clamp(32px, 4.5vw, 56px)',
                      lineHeight: 0.85,
                      color: '#fff9f2',
                      letterSpacing: '1px',
                    }}
                  >
                    NEW<br />DROP
                  </span>
                </div>
              </div>

              {/* ── OWN YOUR FIT — pink element (bottom-center) ── */}
              <motion.div
                className="absolute"
                style={{ bottom: '8%', left: '22%', width: '26%', aspectRatio: '166/167' }}
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.img
                  src={ownYourFitImg}
                  alt="OWN YOUR FIT."
                  className="w-full h-full object-contain"
                  animate={{ y: [0, -6, 0], rotate: [-2, 2, -2] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}