import { Link } from 'react-router';
import { ImageWithFallback } from '@/shared/components/figma/ImageWithFallback';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { motion } from 'motion/react';
import { ArrowRight, MapPin } from 'lucide-react';

import brandImg1 from "@/assets/bc05621120d4db2bbbd43846c3c3991b34aec3c6.png";
import brandImg2 from "@/assets/bad20da9e4fc651f15c7723fb8bde82ddda04a19.png";
import brandImg3 from "@/assets/d2fc9947c889bd072d0bd3a03b51bf323d05cc72.png";

export function FeaturedArtisans() {
  const { lang } = useLanguage();

  const brands = [
    {
      id: 1, name: 'THE GOLDIE OFFICIAL',
      tagline: lang === 'vi' ? 'Streetwear vintage retro, lấy cảm hứng từ thập niên 90s' : 'Vintage retro streetwear inspired by the 90s',
      location: lang === 'vi' ? 'TP. Hồ Chí Minh' : 'Ho Chi Minh City',
      image: brandImg1,
      products: 120, category: lang === 'vi' ? 'Streetwear' : 'Streetwear',
    },
    {
      id: 2, name: 'AESIR.STUDIO',
      tagline: lang === 'vi' ? 'Thời trang tối giản, thiết kế đương đại với chất liệu cao cấp' : 'Minimalist fashion, contemporary design with premium materials',
      location: lang === 'vi' ? 'TP. Hồ Chí Minh' : 'Ho Chi Minh City',
      image: brandImg2,
      products: 85, category: lang === 'vi' ? 'Tối giản' : 'Minimalist',
    },
    {
      id: 3, name: 'PHÓN CHẢY',
      tagline: lang === 'vi' ? 'Streetwear đồ hoạ, in ấn táo bạo mang tinh thần đường phố Việt' : 'Graphic streetwear with bold prints and Vietnamese street spirit',
      location: lang === 'vi' ? 'TP. Hồ Chí Minh' : 'Ho Chi Minh City',
      image: brandImg3,
      products: 95, category: lang === 'vi' ? 'Đồ hoạ' : 'Graphic',
    },
  ];

  return (
    <div className="py-12 md:py-20" style={{ backgroundColor: '#fff9f2' }}>
      <div className="mx-auto px-4 lg:px-6" style={{ maxWidth: 'calc(75% + 320px)' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4"
        >
          <div>
            <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '14px', letterSpacing: '0.3em', color: '#d41c1c' }}>
              FEATURED
            </span>
            <h2 className="mt-2" style={{ fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(40px, 6vw, 64px)', color: '#0d0d0d', lineHeight: 0.95 }}>
              {lang === 'vi' ? 'THƯƠNG HIỆU NỔI BẬT' : 'TRUSTED BRANDS'}
            </h2>
          </div>
          <Link to="/brands" className="group inline-flex items-center gap-3"
            style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#0d0d0d' }}>
            {lang === 'vi' ? 'XEM TẤT CẢ' : 'VIEW ALL'}
            <div className="w-6 h-[2px] bg-[#d41c1c] group-hover:w-10 transition-all" />
          </Link>
        </motion.div>

        {/* Brand Cards */}
        <div className="grid md:grid-cols-3 gap-0" style={{ border: '2px solid #0d0d0d' }}>
          {brands.map((brand, i) => (
            <motion.div key={brand.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={`/brands/${brand.id}`}
                className="group block h-full"
                style={{ borderRight: i < 2 ? '2px solid #0d0d0d' : undefined }}>
                {/* Image */}
                <div className="relative overflow-hidden" style={{ height: '260px' }}>
                  <ImageWithFallback src={brand.image} alt={brand.name}
                    className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500" />
                  <div className="absolute top-3 left-3 px-3 py-1" style={{ backgroundColor: '#d41c1c', color: '#fff9f2', fontSize: '10px', fontWeight: 800, letterSpacing: '0.1em' }}>
                    {brand.category}
                  </div>
                </div>
                {/* Content */}
                <div className="p-5" style={{ backgroundColor: '#fff9f2', borderTop: '2px solid #0d0d0d' }}>
                  <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: '24px', color: '#0d0d0d', letterSpacing: '0.05em' }}>
                    {brand.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1" style={{ fontSize: '12px', color: '#666' }}>
                    <MapPin className="w-3 h-3" /> {brand.location} · {brand.products} {lang === 'vi' ? 'sp' : 'products'}
                  </div>
                  <p className="mt-2" style={{ fontSize: '13px', color: '#666', lineHeight: 1.5 }}>{brand.tagline}</p>
                  <div className="mt-4 inline-flex items-center gap-2 group-hover:gap-3 transition-all"
                    style={{ fontSize: '11px', fontWeight: 800, color: '#d41c1c', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {lang === 'vi' ? 'XEM BRAND' : 'VIEW BRAND'} <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}