import { Link } from 'react-router';
import { ImageWithFallback } from '@/shared/components/figma/ImageWithFallback';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { motion } from 'motion/react';
import { useState, useCallback } from 'react';

import img1 from '@/assets/5dfe423ed1632c2b81288d6bda4ed85e98137765.png';
import img2 from '@/assets/2b119c5c587bb5799778c62469ce97baa1ca8e72.png';
import img3 from '@/assets/3401053c788261c15dcdcb39e5f92043e890f86c.png';
import img4 from '@/assets/b38b06aa798d0e36ef15c78ae91bb94fc7db0abd.png';
import img5 from '@/assets/8fe3d6cc0b8bb4636000afa761192fc428a95eed.png';
import img6 from '@/assets/0c403ab53f289d7ea1208285c31da34152f58ad8.png';
import img7 from '@/assets/129d92277cbbacd12e439a2550519cc85a57e307.png';
import img8 from '@/assets/abf818ec55e61bbc5747bb3c0b1ae552bd9c19ab.png';

const collections = [
  {
    id: 1,
    brand: 'HADES',
    collection: { en: 'Heritage Reborn', vi: 'Di Sản Tái Sinh' },
    tag: { en: 'SS26', vi: 'SS26' },
    image: img1,
    slug: 'heritage-reborn',
    accent: '#d41c1c',
  },
  {
    id: 2,
    brand: 'NẮNG',
    collection: { en: 'Saigon After Dark', vi: 'Sài Gòn Sau 10h' },
    tag: { en: 'FW25', vi: 'FW25' },
    image: img2,
    slug: 'saigon-after-dark',
    accent: '#e2b93b',
  },
  {
    id: 3,
    brand: 'DIRTY COINS',
    collection: { en: 'Gen Z Viet', vi: 'Gen Z Việt' },
    tag: { en: 'SS26', vi: 'SS26' },
    image: img3,
    slug: 'gen-z-vietnam',
    accent: '#6f7d4e',
  },
  {
    id: 4,
    brand: 'DONCARE',
    collection: { en: 'Minimal Futures', vi: 'Tương Lai Tối Giản' },
    tag: { en: 'CAPSULE', vi: 'CAPSULE' },
    image: img4,
    slug: 'minimal-futures',
    accent: '#f1b6c8',
  },
  {
    id: 5,
    brand: 'LMAO',
    collection: { en: 'Bold Statement', vi: 'Tuyên Ngôn Mạnh Mẽ' },
    tag: { en: 'FW25', vi: 'FW25' },
    image: img5,
    slug: 'bold-statement',
    accent: '#d41c1c',
  },
  {
    id: 6,
    brand: 'TSUN',
    collection: { en: 'Retro Revival', vi: 'Phục Hưng Retro' },
    tag: { en: 'SS26', vi: 'SS26' },
    image: img6,
    slug: 'retro-revival',
    accent: '#e2b93b',
  },
  {
    id: 7,
    brand: 'BOBUI',
    collection: { en: 'Urban Canvas', vi: 'Bức Tranh Đô Thị' },
    tag: { en: 'CAPSULE', vi: 'CAPSULE' },
    image: img7,
    slug: 'urban-canvas',
    accent: '#6f7d4e',
  },
  {
    id: 8,
    brand: 'SIXDO',
    collection: { en: 'Dramatic Noir', vi: 'Kịch Tính Đen' },
    tag: { en: 'FW25', vi: 'FW25' },
    image: img8,
    slug: 'dramatic-noir',
    accent: '#f1b6c8',
  },
];

export function EditorialCollections() {
  const { lang } = useLanguage();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const handleHover = useCallback((id: number | null) => {
    setHoveredId(id);
  }, []);

  return (
    <div className="py-12 md:py-20" style={{ backgroundColor: '#0d0d0d', fontFamily: "'Montserrat', sans-serif" }}>
      {/* Section Header */}
      <div className="mx-auto px-4 lg:px-6" style={{ maxWidth: 'calc(75% + 320px)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4"
        >
          <div>
            <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '14px', letterSpacing: '0.3em', color: '#d41c1c' }}>
              COLLECTIONS
            </span>
            <h2 className="mt-2" style={{ fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(40px, 6vw, 64px)', color: '#fff9f2', lineHeight: 0.95, letterSpacing: '-0.01em' }}>
              HOT DROPS
            </h2>
          </div>
          <Link to="/shop" className="group inline-flex items-center gap-3"
            style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff9f2' }}>
            {lang === 'vi' ? 'XEM TẤT CẢ' : 'VIEW ALL'}
            <div className="w-6 h-[2px] bg-[#d41c1c] group-hover:w-10 transition-all" />
          </Link>
        </motion.div>
      </div>

      {/* ═══ Expanding Accordion Slider ═══ */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full"
        style={{ height: 'clamp(480px, 60vh, 640px)' }}
        onMouseLeave={() => handleHover(null)}
      >
        <div className="flex h-full w-full">
          {collections.map((col, i) => {
            const isHovered = hoveredId === col.id;
            const hasHover = hoveredId !== null;

            return (
              <motion.div
                key={col.id}
                className="relative h-full overflow-hidden"
                style={{
                  flex: isHovered ? 4 : hasHover ? 0.6 : 1,
                  transition: 'flex 0.7s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  minWidth: 0,
                }}
                onMouseEnter={() => handleHover(col.id)}
              >
                <Link
                  to={`/style/${col.slug}`}
                  className="block w-full h-full relative"
                >
                  {/* Image */}
                  <ImageWithFallback
                    src={col.image}
                    alt={col.brand}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      transition: 'transform 0.7s cubic-bezier(0.25, 0.8, 0.25, 1), filter 0.5s ease',
                      transform: isHovered ? 'scale(1.05)' : 'scale(1.12)',
                      filter: hasHover && !isHovered ? 'brightness(0.3) saturate(0.4)' : 'brightness(1) saturate(1)',
                    }}
                  />

                  {/* Permanent dark gradient at bottom */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to top, rgba(13,13,13,0.7) 0%, rgba(13,13,13,0.1) 40%, transparent 100%)',
                    }}
                  />

                  {/* Collapsed state — vertical brand text */}
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{
                      opacity: isHovered ? 0 : 1,
                      transition: 'opacity 0.4s ease',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Oswald', sans-serif",
                        fontSize: '18px',
                        color: '#fff9f2',
                        letterSpacing: '0.25em',
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                        whiteSpace: 'nowrap',
                        opacity: hasHover && !isHovered ? 0.5 : 0.85,
                        transition: 'opacity 0.4s ease',
                      }}
                    >
                      {col.brand}
                    </span>
                  </div>

                  {/* Slide number — top-left */}
                  <div
                    className="absolute top-5 left-5 pointer-events-none"
                    style={{
                      opacity: isHovered ? 1 : 0,
                      transition: 'opacity 0.5s ease 0.15s',
                      zIndex: 3,
                    }}
                  >
                    <span style={{
                      fontFamily: "'Oswald', sans-serif",
                      fontSize: '13px',
                      color: 'rgba(255,249,242,0.4)',
                      letterSpacing: '0.15em',
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Expanded state — content overlay */}
                  <div
                    className="absolute bottom-0 left-0 right-0 pointer-events-none"
                    style={{
                      padding: '32px',
                      opacity: isHovered ? 1 : 0,
                      transform: isHovered ? 'translateY(0)' : 'translateY(24px)',
                      transition: 'opacity 0.5s ease 0.1s, transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1) 0.1s',
                      zIndex: 3,
                    }}
                  >
                    {/* Accent line */}
                    <div style={{ width: '32px', height: '2px', backgroundColor: col.accent, marginBottom: '16px' }} />

                    {/* Brand name */}
                    <h3 style={{
                      fontFamily: "'Oswald', sans-serif",
                      fontSize: 'clamp(40px, 5vw, 60px)',
                      color: '#fff9f2',
                      lineHeight: 0.95,
                      letterSpacing: '0.02em',
                    }}>
                      {col.brand}
                    </h3>

                    {/* Collection name */}
                    <p style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: '14px',
                      color: 'rgba(255,249,242,0.6)',
                      fontStyle: 'italic',
                      marginTop: '8px',
                      letterSpacing: '0.04em',
                    }}>
                      {lang === 'vi' ? col.collection.vi : col.collection.en}
                    </p>

                    {/* CTA */}
                    <div
                      className="inline-flex items-center gap-3"
                      style={{
                        marginTop: '20px',
                        fontSize: '11px',
                        fontWeight: 800,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: '#fff9f2',
                      }}
                    >
                      {lang === 'vi' ? 'KHÁM PHÁ' : 'EXPLORE'}
                      <svg width="20" height="8" viewBox="0 0 20 8" fill="none">
                        <path d="M0 4H18M18 4L14 0.5M18 4L14 7.5" stroke={col.accent} strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>

                  {/* Separator line between panels */}
                  {i < collections.length - 1 && (
                    <div
                      className="absolute top-0 right-0 w-[1px] h-full pointer-events-none"
                      style={{
                        backgroundColor: 'rgba(255,249,242,0.08)',
                        zIndex: 4,
                      }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Bottom annotation */}
      <div className="mx-auto px-4 lg:px-6 mt-6 flex items-center justify-between" style={{ maxWidth: 'calc(75% + 320px)' }}>
        
      </div>
    </div>
  );
}