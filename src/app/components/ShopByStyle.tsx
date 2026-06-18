import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Link } from 'react-router';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { motion } from 'motion/react';

// Unsplash images for shop-by-style categories (missing from Figma export)
const dateNightImage = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=800&fit=crop';
const vintageJerseyImage = 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&h=600&fit=crop';
const runningGearImage = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop';
const cozyCashmereImage = 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=600&fit=crop';
const winterSunImage = 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop';
const girlsNightImage = 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=400&fit=crop';

export function ShopByStyle() {
  const { t, lang, v } = useLanguage();

  const categories = [
    { id: 1, name: t('shopByStyle.localTees'), image: dateNightImage, slug: 'streetwear' },
    { id: 2, name: t('shopByStyle.vintageJerseys'), image: vintageJerseyImage, slug: 'vintage' },
    { id: 3, name: t('shopByStyle.sneakers'), image: runningGearImage, slug: 'sporty' },
    { id: 4, name: t('shopByStyle.hoodies'), image: cozyCashmereImage, slug: 'korean' },
    { id: 5, name: t('shopByStyle.bags'), image: winterSunImage, slug: 'classic' },
    { id: 6, name: t('shopByStyle.streetwear'), image: girlsNightImage, slug: 'y2k' },
  ];

  return (
    <section className="py-12 md:py-20" style={{ backgroundColor: '#FFFFFF', fontFamily: "'Montserrat', sans-serif" }}>
      <div className="mx-auto px-4 lg:px-6" style={{ maxWidth: 'calc(75% + 320px)' }}>
        {/* Section Header — Editorial system */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '14px', letterSpacing: '0.3em', color: '#d41c1c', textTransform: 'uppercase' }}>
            {lang === 'vi' ? 'KHÁM PHÁ' : 'EXPLORE'}
          </span>
          <h2
            className="mt-2"
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: 'clamp(40px, 6vw, 64px)',
              fontWeight: 700,
              color: '#0d0d0d',
              lineHeight: 0.95,
              textTransform: 'uppercase',
            }}
          >
            {t('shopByStyle.title')}
          </h2>
        </motion.div>

        {/* Masonry-style grid: 2 tall on left, 4 smaller on right */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {/* Featured large - spans 2 rows */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="col-span-1 md:col-span-2 md:row-span-2"
          >
            <Link to={`/style/${categories[0].slug}`} className="group block relative overflow-hidden h-full" style={{ minHeight: '400px' }}>
              <ImageWithFallback src={categories[0].image} alt={categories[0].name} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,13,13,0.75) 0%, rgba(13,13,13,0.1) 50%, transparent 70%)' }} />
              {/* Bold corner frames */}
              <div className="absolute top-4 left-4 w-10 h-10" style={{ borderTop: '2px solid #d41c1c', borderLeft: '2px solid #d41c1c' }} />
              <div className="absolute bottom-4 right-4 w-10 h-10" style={{ borderBottom: '2px solid #d41c1c', borderRight: '2px solid #d41c1c' }} />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <span className="block mb-2" style={{ fontSize: '12px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#d41c1c', fontWeight: 600, fontFamily: "'Oswald', sans-serif" }}>{v('Style', 'Phong cách')}</span>
                <h3 className="text-white" style={{ fontSize: '26px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, textTransform: 'uppercase' }}>
                  {categories[0].name}
                </h3>
                <div className="inline-flex items-center gap-3 text-white mt-3 group-hover:gap-5 transition-all" style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, fontFamily: "'Oswald', sans-serif" }}>
                  <span>{v('Explore', 'Khám phá')}</span>
                  <div className="w-6 h-px bg-white group-hover:w-10 transition-all duration-300" />
                </div>
              </div>
            </Link>
          </motion.div>

          {/* 4 smaller tiles */}
          {categories.slice(1, 5).map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index + 1) * 0.08 }}
            >
              <Link to={`/style/${category.slug}`} className="group block relative overflow-hidden aspect-square">
                <ImageWithFallback src={category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,13,13,0.7) 0%, rgba(13,13,13,0.05) 60%, transparent 100%)' }} />
                {/* Bold border on hover */}
                <div className="absolute inset-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ border: '2px solid rgba(212,28,28,0.5)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4 className="text-white" style={{ fontSize: '15px', fontFamily: "'Oswald', sans-serif", fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {category.name}
                  </h4>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Last item - full width on mobile, normal on desktop */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="col-span-2 md:col-span-4"
          >
            <Link to={`/style/${categories[5].slug}`} className="group block relative overflow-hidden" style={{ height: '220px' }}>
              <ImageWithFallback src={categories[5].image} alt={categories[5].name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,13,13,0.75) 0%, rgba(13,13,13,0.2) 50%, transparent 100%)' }} />
              {/* Bold corner frames */}
              <div className="absolute top-4 left-4 w-10 h-10" style={{ borderTop: '2px solid #d41c1c', borderLeft: '2px solid #d41c1c' }} />
              <div className="absolute bottom-4 right-4 w-10 h-10" style={{ borderBottom: '2px solid #d41c1c', borderRight: '2px solid #d41c1c' }} />
              <div className="absolute inset-0 flex items-center p-8 md:p-12">
                <div>
                  <span className="block mb-2" style={{ fontSize: '12px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#d41c1c', fontWeight: 600, fontFamily: "'Oswald', sans-serif" }}>{v('Featured Style', 'Phong cách nổi bật')}</span>
                  <h3 className="text-white mb-3" style={{ fontSize: '28px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, textTransform: 'uppercase' }}>
                    {categories[5].name}
                  </h3>
                  <div className="inline-flex items-center gap-3 text-white group-hover:gap-5 transition-all" style={{ fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, fontFamily: "'Oswald', sans-serif" }}>
                    <span>{v('Explore Collection', 'Khám phá bộ sưu tập')}</span>
                    <div className="w-6 h-px bg-white group-hover:w-10 transition-all duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}