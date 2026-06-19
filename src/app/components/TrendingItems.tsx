import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Link } from 'react-router';
import { Heart } from 'lucide-react';
import exampleImage from 'figma:asset/361f1985f8fbe6838ab254f9f9aaf3094df5e64d.png';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { motion } from 'motion/react';
import { useState } from 'react';

const trendingItems = [
  { id: 1, image: exampleImage, name: 'Stockholm Small Suede Top-Handle Bag - Blue', nameVi: 'Túi cầm tay da lộn Stockholm nhỏ - Xanh dương', price: 4570000, clicks: 12400, brand: 'DEMELLIER', seller: 'MYTHERESA' },
  { id: 2, image: 'https://images.unsplash.com/photo-1622760807301-4d2351a5a942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHByb2R1Y3QlMjBwaG90b2dyYXBoeXxlbnwxfHx8fDE3Njk5NjE4NjF8MA&ixlib=rb-4.1.0&q=80&w=1080', name: 'Air Max Classic Sneakers - White', nameVi: 'Giày sneaker Air Max cổ điển - Trắng', price: 3200000, clicks: 18750, brand: 'NIKE', seller: 'SNEAKER LAB' },
  { id: 3, image: 'https://images.unsplash.com/photo-1639600280301-80d94f9cfe0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob29kaWUlMjBwcm9kdWN0JTIwd2hpdGUlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3MDA0NTQ0MHww&ixlib=rb-4.1.0&q=80&w=1080', name: 'Premium Oversized Hoodie - Black', nameVi: 'Áo hoodie oversize cao cấp - Đen', price: 1890000, clicks: 15320, brand: 'ESSENTIALS', seller: 'LOCAL STREET' },
  { id: 4, image: 'https://images.unsplash.com/photo-1594734415578-00fc9540929b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYWNrZXQlMjBwcm9kdWN0JTIwd2hpdGUlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3MDA0NjIzMHww&ixlib=rb-4.1.0&q=80&w=1080', name: 'Denim Trucker Jacket - Vintage Wash', nameVi: 'Áo khoác denim trucker - Wash cổ điển', price: 2450000, clicks: 9870, brand: "LEVI'S", seller: 'VINTAGE HUB' },
  { id: 5, image: 'https://images.unsplash.com/photo-1596273501899-336404ed1701?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWNrcGFjayUyMHByb2R1Y3QlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzY5OTg4NjA4fDA&ixlib=rb-4.1.0&q=80&w=1080', name: 'Canvas Backpack - Khaki', nameVi: 'Balo vải canvas - Kaki', price: 1120000, clicks: 11240, brand: 'FJALLRAVEN', seller: 'URBAN GEAR' },
  { id: 6, image: 'https://images.unsplash.com/photo-1714218707756-173966d250b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXRjaCUyMHByb2R1Y3QlMjBwaG90b2dyYXBoeXxlbnwxfHx8fDE3Njk5NjAyMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080', name: 'Minimalist Watch - Silver Mesh', nameVi: 'Đồng hồ tối giản - Dây lưới bạc', price: 2890000, clicks: 13560, brand: 'DANIEL WELLINGTON', seller: 'WATCH STORE' },
  { id: 7, image: 'https://images.unsplash.com/photo-1711223499758-8aef018b720e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5nbGFzc2VzJTIwcHJvZHVjdCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc3MDAxMTM2NXww&ixlib=rb-4.1.0&q=80&w=1080', name: 'Aviator Sunglasses - Gold Frame', nameVi: 'Kính mát phi công - Gọng vàng', price: 890000, clicks: 8920, brand: 'RAY-BAN', seller: 'EYEWEAR CO' },
  { id: 8, image: 'https://images.unsplash.com/photo-1562869319-a1368ba7fe75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYmFnJTIwcHJvZHVjdCUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzAwNDYyMjl8MA&ixlib=rb-4.1.0&q=80&w=1080', name: 'Leather Crossbody Bag - Brown', nameVi: 'Túi đeo chéo da - Nâu', price: 3670000, clicks: 14580, brand: 'COACH', seller: 'LUXURY BAGS' },
];

function ProductTile({ item, formatPrice, index }: { item: typeof trendingItems[0]; formatPrice: (p: number) => string; index: number }) {
  const { v } = useLanguage();
  const [liked, setLiked] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
    >
      <Link to={`/product/${item.id}`} className="group block">
        <div className="relative overflow-hidden mb-4 aspect-[3/4]" style={{ backgroundColor: '#F3F4F6' }}>
          <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700" />
          {/* Bold border on hover */}
          <div className="absolute inset-3 opacity-0 group-hover:opacity-100 transition-all duration-600 pointer-events-none" style={{ border: '2px solid rgba(13,13,13,0.15)' }} />
          {/* Wishlist button */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLiked(!liked); }}
            className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            style={{ backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: '50%' }}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-[#d41c1c] text-[#d41c1c]' : 'text-[#4a4a4a]'}`} />
          </button>
        </div>
        <div>
          <div className="mb-1" style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#d41c1c', fontWeight: 700, fontFamily: "'Oswald', sans-serif" }}>{item.brand}</div>
          <div className="mb-2 line-clamp-2" style={{ fontSize: '15px', color: '#0d0d0d', fontWeight: 500, lineHeight: 1.4 }}>{v(item.name, item.nameVi)}</div>
          <div className="flex items-baseline justify-between">
            <div style={{ fontSize: '18px', color: '#d41c1c', fontWeight: 600, fontFamily: "'Oswald', sans-serif" }}>{formatPrice(item.price)}</div>
            <div style={{ fontSize: '11px', color: '#888' }}>{(item.clicks / 1000).toFixed(1)}k {v('views', 'lượt xem')}</div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function TrendingItems() {
  const { t, lang, v } = useLanguage();

  const formatPrice = (price: number) => {
    // Currency is always Vietnamese đồng, regardless of UI language.
    return `${(price / 1000).toLocaleString('vi-VN', { maximumFractionDigits: 0 })}k`;
  };

  const featured = trendingItems[0];
  const gridItems = trendingItems.slice(1);

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
            {lang === 'vi' ? 'TUYỂN CHỌN' : 'CURATED SELECTION'}
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
            {t('trending.title')}
          </h2>
          <p className="mt-3" style={{ fontSize: '15px', color: '#4a4a4a', fontWeight: 400 }}>{t('trending.subtitle')}</p>
        </motion.div>

        {/* Featured + Grid editorial layout */}
        <div className="grid lg:grid-cols-5 gap-8 mb-10">
          {/* Featured large item */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2"
          >
            <Link to={`/product/${featured.id}`} className="group block">
              <div className="relative overflow-hidden aspect-[3/4] lg:aspect-auto lg:h-full" style={{ backgroundColor: '#F3F4F6', minHeight: '500px' }}>
                <ImageWithFallback src={featured.image} alt={featured.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-1000" />
                {/* Bold corner frames */}
                <div className="absolute top-4 left-4 w-12 h-12" style={{ borderTop: '2px solid #d41c1c', borderLeft: '2px solid #d41c1c' }} />
                <div className="absolute bottom-4 right-4 w-12 h-12" style={{ borderBottom: '2px solid #d41c1c', borderRight: '2px solid #d41c1c' }} />
                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6" style={{ background: 'linear-gradient(to top, rgba(13,13,13,0.85) 0%, transparent 100%)' }}>
                  <span className="block mb-1" style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#d41c1c', fontWeight: 700, fontFamily: "'Oswald', sans-serif" }}>{featured.brand}</span>
                  <h4 className="text-white mb-2" style={{ fontSize: '20px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, lineHeight: 1.3, textTransform: 'uppercase' }}>{v(featured.name, featured.nameVi)}</h4>
                  <div style={{ fontSize: '22px', color: '#FFFFFF', fontWeight: 600, fontFamily: "'Oswald', sans-serif" }}>{formatPrice(featured.price)}</div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Grid of smaller items */}
          <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-6">
            {gridItems.map((item, i) => (
              <ProductTile key={item.id} item={item} formatPrice={formatPrice} index={i} />
            ))}
          </div>
        </div>

        {/* View more CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mt-14"
        >
          <Link
            to="/shop"
            className="inline-flex items-center gap-4 transition-all group"
          >
            <div className="h-px w-8 group-hover:w-12 transition-all duration-300" style={{ backgroundColor: '#d41c1c' }} />
            <span style={{ color: '#d41c1c', fontSize: '14px', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 600, fontFamily: "'Oswald', sans-serif" }}>
              {t('trending.viewMore')}
            </span>
            <div className="h-px w-8 group-hover:w-12 transition-all duration-300" style={{ backgroundColor: '#d41c1c' }} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}