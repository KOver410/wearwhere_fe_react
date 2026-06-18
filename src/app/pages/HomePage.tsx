import { HeroSection } from '@/app/components/HeroSection';
import { EditorialCollections } from '@/app/components/EditorialCollections';
import { OutfitSuggestions } from '@/app/components/OutfitSuggestions';
import { FeaturedArtisans } from '@/app/components/FeaturedArtisans';
import { NearbyShops } from '@/app/components/NearbyShops';
import { SmartWardrobe } from '@/app/components/SmartWardrobe';
import { HeritageCTA } from '@/app/components/HeritageCTA';
import { useAuth } from '@/app/contexts/AuthContext';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { motion } from 'motion/react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { StarburstBadge } from '@/app/components/StarburstBadge';
import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* ═══ MARQUEE ═══ */
function EditorialMarquee() {
  const items = [
    'MAKE YOUR STYLE FIT', '✦', 'PROUDLY LOCAL', '✦', 'MADE IN VIETNAM', '✦',
    'VOTE WITH YOUR STYLE', '✦', 'OWN YOUR FIT', '✦', 'MAKE SOME NOISE', '✦',
    'MAKE YOUR STYLE FIT', '✦', 'PROUDLY LOCAL', '✦', 'MADE IN VIETNAM', '✦',
    'VOTE WITH YOUR STYLE', '✦', 'OWN YOUR FIT', '✦', 'MAKE SOME NOISE', '✦',
  ];

  return (
    <div className="overflow-hidden py-3" style={{ backgroundColor: '#0d0d0d', marginTop: '32px' }}>
      <div className="flex gap-8 whitespace-nowrap" style={{ animation: 'marquee 35s linear infinite' }}>
        {items.map((item, i) => (
          <span key={i} className="flex-shrink-0 flex items-center" style={{
            fontFamily: item === '✦' ? 'sans-serif' : "'Oswald', sans-serif",
            fontSize: item === '✦' ? '12px' : '18px',
            letterSpacing: '0.15em',
            color: item === '✦' ? '#d41c1c' : '#fff9f2',
          }}>
            {item === '✦' ? (
              <span style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '9999px',
                backgroundColor: '#d41c1c',
              }} />
            ) : item}
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

/* ═══ TRENDING POSTS ═══ */
function TrendingPosts() {
  const { lang, v } = useLanguage();

  const posts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1596609548086-85bbf8ddb6b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwc3RyZWV0d2VhciUyMGZhc2hpb24lMjBvdXRmaXR8ZW58MXx8fHwxNzcyNTQ3MjcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: lang === 'vi' ? 'Áo khoác denim local brand siêu...' : 'Local brand denim jacket super...',
      price: '450.000₫',
      user: '@thegoldie',
      userName: '@minhanh.style',
      userAvatar: 'https://images.unsplash.com/photo-1730715145729-bf929994c328?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGFzaWFuJTIwd29tYW4lMjBwb3J0cmFpdCUyMGZhc2hpb258ZW58MXx8fHwxNzcyNTU5MTkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1566800450696-93f195ecd77c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwY29sb3JmdWwlMjBvdXRmaXQlMjBzcHJpbmclMjBmYXNoaW9ufGVufDF8fHx8MTc3MjU0NzI3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: lang === 'vi' ? 'Outfit colorful phong cách Xuân...' : 'Colorful spring style outfit...',
      price: '380.000₫',
      user: '@aesir.studio',
      userName: '@thanhha.ootd',
      userAvatar: 'https://images.unsplash.com/photo-1543267570-95d78122e7e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwY29sb3JmdWwlMjBwb3J0cmFpdCUyMHNtaWxlfGVufDF8fHx8MTc3MjU1OTE5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1768862211215-2c205a01e5b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjB3ZWFyaW5nJTIwZGVuaW0lMjBqYWNrZXQlMjBjYXN1YWwlMjBzdHJlZXR8ZW58MXx8fHwxNzcyNTQ3MjczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: lang === 'vi' ? 'Denim jacket wash cổ điển...' : 'Classic wash denim jacket...',
      price: '520.000₫',
      user: '@phonchay',
      userName: '@ducphong.fit',
      userAvatar: 'https://images.unsplash.com/photo-1603954698693-b0bcbceb5ad0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGFzaWFuJTIwbWFuJTIwY2FzdWFsJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcyNTA0NTY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1762509547577-76aa7cf87c62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHdoaXRlJTIwZHJlc3MlMjBtaW5pbWFsaXN0JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcyNTQ3MjczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: lang === 'vi' ? 'Đầm trắng tối giản tinh tế...' : 'Minimalist white dress look...',
      price: '650.000₫',
      user: '@maisonvn',
      userName: '@linhchi.vn',
      userAvatar: 'https://images.unsplash.com/photo-1771591350917-1dc566e5d76a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwbWluaW1hbGlzdCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjU1OTE5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1766830423628-b4b636d0d907?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG1hbiUyMGhvb2RpZSUyMHVyYmFuJTIwc2thdGVib2FyZCUyMHN0eWxlfGVufDF8fHx8MTc3MjU0NzI3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: lang === 'vi' ? 'Hoodie skater oversize phối...' : 'Oversize skater hoodie combo...',
      price: '290.000₫',
      user: '@kicks.vn',
      userName: '@quanghuy.skate',
      userAvatar: 'https://images.unsplash.com/photo-1571846480269-a45e1420c732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGFzaWFuJTIwbWFuJTIwc2thdGVib2FyZCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjU1OTE5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1589851254324-027baf32f041?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGxlYXRoZXIlMjBqYWNrZXQlMjBuaWdodCUyMGNpdHklMjBmYXNoaW9ufGVufDF8fHx8MTc3MjU0NzI3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: lang === 'vi' ? 'Leather jacket đêm phố cá tính...' : 'Night city leather jacket look...',
      price: '890.000₫',
      user: '@darkmode.sg',
      userName: '@ngoctram.noir',
      userAvatar: 'https://images.unsplash.com/photo-1669995629538-e009b209d14e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwbGVhdGhlciUyMGphY2tldCUyMHBvcnRyYWl0JTIwbmlnaHR8ZW58MXx8fHwxNzcyNTU5MTk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: 7,
      image: 'https://images.unsplash.com/photo-1707765643763-aa1f4d3da740?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBsaW5lbiUyMHNoaXJ0JTIwc3VtbWVyJTIwdHJvcGljYWwlMjBvdXRmaXR8ZW58MXx8fHwxNzcyNTQ3Mjc3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: lang === 'vi' ? 'Sơ mi linen hè tropical...' : 'Summer tropical linen shirt...',
      price: '340.000₫',
      user: '@saigon.fils',
      userName: '@baonam.sgn',
      userAvatar: 'https://images.unsplash.com/photo-1727278465739-b3b5266e18de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbiUyMHN1bW1lciUyMHBvcnRyYWl0JTIwb3V0ZG9vcnxlbnwxfHx8fDE3NzI1NTkxOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: 8,
      image: 'https://images.unsplash.com/photo-1738739907430-69c912cea31d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHZpbnRhZ2UlMjBibGF6ZXIlMjByZXRybyUyMHN0eWxlfGVufDF8fHx8MTc3MjU0NzI3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: lang === 'vi' ? 'Blazer vintage retro phong cách...' : 'Vintage retro blazer style...',
      price: '750.000₫',
      user: '@hanoivtg',
      userName: '@thuhuong.retro',
      userAvatar: 'https://images.unsplash.com/photo-1762325658226-3a8bc64a6fd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwdmludGFnZSUyMHJldHJvJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcyNTU5MTk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: 9,
      image: 'https://images.unsplash.com/photo-1731104664406-a9d38ac8f346?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMG91dGZpdCUyMGNsb3NldXAlMjBmYXNoaW9uJTIwZGV0YWlsfGVufDF8fHx8MTc3MjU0NzI3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: lang === 'vi' ? 'Sneaker collab limited edition...' : 'Limited edition sneaker collab...',
      price: '1.200.000₫',
      user: '@sole.local',
      userName: '@tuankiet.sole',
      userAvatar: 'https://images.unsplash.com/photo-1721373381429-2d66706c633f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbiUyMHNuZWFrZXJzJTIwc3RyZWV0d2VhciUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MjU1OTE5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    {
      id: 10,
      image: 'https://images.unsplash.com/photo-1612049621554-1df669d740df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBtYXRjaGluZyUyMG91dGZpdCUyMGNvb3JkaW5hdGVkJTIwc3RyZWV0d2VhcnxlbnwxfHx8fDE3NzI1NDcyNzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      title: lang === 'vi' ? 'Couple matching outfit tone đen...' : 'Matching couple black tone fit...',
      price: '980.000₫',
      user: '@duo.wear',
      userName: '@vy.khoa',
      userAvatar: 'https://images.unsplash.com/photo-1612049621554-1df669d740df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGNvdXBsZSUyMHBvcnRyYWl0JTIwc3RyZWV0d2VhcnxlbnwxfHx8fDE3NzI1NTkxOTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
  ];

  const CARD_WIDTH = 240;
  const CARD_GAP = 8;

  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = useCallback(() => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 2);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();
    // Re-check after layout settles
    const timer = setTimeout(updateScrollState, 300);
    // Watch for resize changes
    const ro = new ResizeObserver(() => updateScrollState());
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      clearTimeout(timer);
      ro.disconnect();
    };
  }, [updateScrollState]);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = (CARD_WIDTH + CARD_GAP) * 3;
      containerRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-12 md:py-20" style={{ backgroundColor: '#fff9f2' }}>
      <div className="mx-auto px-4 lg:px-6" style={{ maxWidth: 'calc(75% + 320px)' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '14px', letterSpacing: '0.3em', color: '#d41c1c' }}>
            TRENDING
          </span>
          <h2 className="mt-2" style={{ fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(40px, 6vw, 64px)', color: '#0d0d0d', lineHeight: 0.95 }}>
            {lang === 'vi' ? 'BÀI ĐĂNG ĐANG THỊNH HÀNH' : 'TRENDING POSTS'}
          </h2>
        </motion.div>

        {/* Horizontal scrollable cards */}
        <div className="relative group/carousel">
          <style>{`.trending-scroll::-webkit-scrollbar { display: none; }`}</style>
          <div
            ref={containerRef}
            className="trending-scroll flex overflow-x-scroll overflow-y-hidden pb-4"
            style={{ scrollbarWidth: 'none', gap: `${CARD_GAP}px`, WebkitOverflowScrolling: 'touch', touchAction: 'pan-x', scrollSnapType: 'x proximity' }}
          >
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex-shrink-0 snap-start relative group cursor-pointer overflow-hidden"
                style={{ width: `${CARD_WIDTH}px`, aspectRatio: '3/4.5', borderRadius: '6px' }}
              >
                {/* Image */}
                <ImageWithFallback
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-[45%] pointer-events-none"
                  style={{ background: 'linear-gradient(to top, rgba(13,13,13,0.85) 0%, rgba(13,13,13,0.4) 50%, transparent 100%)' }}
                />
                {/* Info overlay */}
                <div className="absolute bottom-0 inset-x-0 p-3 flex items-center gap-2.5" style={{ borderRadius: '0 0 6px 6px' }}>
                  <div className="flex-shrink-0 w-7 h-7 rounded-full overflow-hidden">
                    <ImageWithFallback src={post.userAvatar} alt={post.userName} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px', color: '#fff9f2', fontWeight: 600 }}>
                      {post.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '13px', color: '#fff9f2', fontWeight: 700 }}>
                        {post.price}
                      </span>
                      <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '10px', color: 'rgba(255,249,242,0.6)' }}>
                        {post.userName}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Hover effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(212,28,28,0.15)' }}>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Left arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute top-1/2 -left-6 -translate-y-1/2 z-10 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300"
              style={{
                width: '44px', height: '44px', borderRadius: '9999px',
                backgroundColor: '#0d0d0d', color: '#fff9f2',
                boxShadow: '0px 4px 12px rgba(0,0,0,0.3)',
                border: '2px solid rgba(255,249,242,0.2)',
              }}
              aria-label={v('Scroll left', 'Cuộn sang trái')}
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* Right arrow */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute top-1/2 -right-6 -translate-y-1/2 z-10 flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300"
              style={{
                width: '44px', height: '44px', borderRadius: '9999px',
                backgroundColor: '#0d0d0d', color: '#fff9f2',
                boxShadow: '0px 4px 12px rgba(0,0,0,0.3)',
                border: '2px solid rgba(255,249,242,0.2)',
              }}
              aria-label={v('Scroll right', 'Cuộn sang phải')}
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══ HOMEPAGE ═══ */
export function HomePage() {
  const { isLoggedIn } = useAuth();

  return (
    <>
      <HeroSection />
      <EditorialMarquee />
      <TrendingPosts />
      <EditorialCollections />
      <OutfitSuggestions />
      <FeaturedArtisans />
      {isLoggedIn && <NearbyShops />}
      {isLoggedIn && <SmartWardrobe />}
      <HeritageCTA />
    </>
  );
}