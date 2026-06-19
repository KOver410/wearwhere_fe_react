import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router';
import { Heart, ChevronRight, Sparkles } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { products as allProducts, STYLES, SORT_OPTIONS } from '@/app/data/mockData';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { formatVnd } from '@/app/utils/currency';

const styleBanners: Record<string, { title: string; titleVi: string; subtitle: string; subtitleVi: string; gradient: string }> = {
  streetwear: { title: 'Streetwear', titleVi: 'Đường phố', subtitle: 'Bold, urban, unapologetic. Express yourself through street culture.', subtitleVi: 'Mạnh mẽ, đô thị, không ngại. Thể hiện bản thân qua văn hóa đường phố.', gradient: 'from-[#0d0d0d] to-[#333]' },
  minimalist: { title: 'Minimalist', titleVi: 'Tối giản', subtitle: 'Less is more. Clean lines, neutral tones, timeless elegance.', subtitleVi: 'Ít hơn là nhiều hơn. Đường nét tinh gọn, tông màu trung tính, thanh lịch vượt thời gian.', gradient: 'from-[#4a4a4a] to-[#777]' },
  vintage: { title: 'Vintage', titleVi: 'Cổ điển', subtitle: 'Curated pieces from past decades. Every item tells a story.', subtitleVi: 'Những món đồ tuyển chọn từ các thập kỷ trước. Mỗi sản phẩm kể một câu chuyện.', gradient: 'from-[#6f7d4e] to-[#e2b93b]' },
  y2k: { title: 'Y2K', titleVi: 'Y2K', subtitle: 'Turn back time with early 2000s inspired fashion trends.', subtitleVi: 'Quay ngược thời gian với xu hướng thời trang lấy cảm hứng từ đầu những năm 2000.', gradient: 'from-[#d41c1c] to-[#f1b6c8]' },
  korean: { title: 'Korean Fashion', titleVi: 'Thời trang Hàn Quốc', subtitle: 'K-Fashion vibes. Trendy, cute, and effortlessly chic.', subtitleVi: 'Phong cách K-Fashion. Thời thượng, dễ thương và sành điệu một cách tự nhiên.', gradient: 'from-[#d41c1c] to-[#e2b93b]' },
  sporty: { title: 'Sporty', titleVi: 'Thể thao', subtitle: 'Athleisure meets fashion. Performance and style combined.', subtitleVi: 'Athleisure gặp thời trang. Kết hợp hiệu suất và phong cách.', gradient: 'from-[#0d0d0d] to-[#4a4a4a]' },
  bohemian: { title: 'Bohemian', titleVi: 'Bohemian', subtitle: 'Free-spirited, earthy, artistic. Embrace the boho lifestyle.', subtitleVi: 'Tự do, gần gũi thiên nhiên, nghệ thuật. Đón nhận lối sống boho.', gradient: 'from-[#6f7d4e] to-[#888]' },
  classic: { title: 'Classic', titleVi: 'Cổ điển', subtitle: 'Timeless pieces that never go out of style.', subtitleVi: 'Những món đồ không bao giờ lỗi mốt.', gradient: 'from-[#0d0d0d] to-[#4a4a4a]' },
};

export function StylePage() {
  const { slug } = useParams<{ slug: string }>();
  const [sortBy, setSortBy] = useState('popular');
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());
  const { v, lang } = useLanguage();
  const isVi = lang === 'vi';

  const styleInfo = slug ? styleBanners[slug] : null;
  const styleData = STYLES.find(s => s.slug === slug);

  const filteredProducts = useMemo(() => {
    let result = allProducts.filter(p => p.style === slug);
    switch (sortBy) {
      case 'price-low': result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price)); break;
      case 'price-high': result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price)); break;
      case 'popular': result.sort((a, b) => b.likes - a.likes); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }
    return result;
  }, [slug, sortBy]);

  const toggleLike = (id: number) => {
    setLikedProducts(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  if (!styleInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: '#fff9f2' }}>
        <div className="text-center">
          <p style={{ fontSize: '30px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '16px' }}>{v('Style not found', 'Không tìm thấy phong cách')}</p>
          <Link to="/shop" className="px-6 py-3 bg-[#0d0d0d] text-white inline-block hover:bg-[#d41c1c] transition-colors" style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Oswald', sans-serif" }}>
            {v('Browse All Products', 'Xem tất cả sản phẩm')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: '#fff9f2' }}>
      {/* Hero Banner */}
      <div className={`bg-gradient-to-r ${styleInfo.gradient} text-white`}>
        <div className="mx-auto px-6 lg:px-12 py-16 sm:py-24" style={{ maxWidth: 'calc(75% + 320px)' }}>
          <nav className="flex items-center gap-2 mb-6" style={{ fontSize: '14px', opacity: 0.7 }}>
            <Link to="/" className="hover:opacity-100 transition-opacity">{v('Home', 'Trang chủ')}</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/shop" className="hover:opacity-100 transition-opacity">{v('Shop', 'Cửa hàng')}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="opacity-100">{isVi ? styleInfo.titleVi : styleInfo.title}</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <h1 style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.05 }}>{isVi ? styleInfo.titleVi : styleInfo.title}</h1>
          </div>
          <p style={{ fontSize: '18px', opacity: 0.8, maxWidth: '600px' }}>{isVi ? styleInfo.subtitleVi : styleInfo.subtitle}</p>
          <p className="mt-4" style={{ fontSize: '14px', opacity: 0.6 }}>{filteredProducts.length} {v('products', 'sản phẩm')}</p>
        </div>
      </div>

      {/* Other Styles */}
      <div className="mx-auto px-4 lg:px-6 py-8 sm:py-12" style={{ maxWidth: 'calc(75% + 320px)' }}>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {STYLES.filter(s => s.slug !== slug).map(s => (
            <Link
              key={s.slug}
              to={`/style/${s.slug}`}
              className="flex-shrink-0 px-4 py-2 border-2 border-[#e0d8cf] hover:bg-[#d41c1c] hover:text-white hover:border-[#d41c1c] transition-colors"
              style={{ borderRadius: '9999px', fontSize: '13px' }}
            >
              {isVi ? s.nameVi : s.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="mx-auto px-4 lg:px-6 pb-6" style={{ maxWidth: 'calc(75% + 320px)' }}>
        <div className="flex items-center justify-between mb-6">
          <p style={{ fontSize: '14px', color: '#4a4a4a' }}>{filteredProducts.length} {v('products', 'sản phẩm')}</p>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2 border-2 border-[#e0d8cf] bg-white cursor-pointer"
            style={{ borderRadius: '10px', fontSize: '14px' }}
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{isVi ? o.labelVi : o.label}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredProducts.map(product => {
            const discount = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;
            return (
              <div key={product.id} className="group">
                <div className="relative">
                  <Link to={`/product/${product.id}`}>
                    <div className="relative overflow-hidden bg-[#f3f0eb] aspect-[3/4] mb-3" style={{ borderRadius: '4px' }}>
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {product.isNew && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#d41c1c] text-white" style={{ fontSize: '11px', fontWeight: 700, borderRadius: '9999px' }}>{v('NEW', 'MỚI')}</span>
                      )}
                      {discount > 0 && (
                        <span className="absolute top-3 px-2.5 py-1" style={{ left: product.isNew ? '60px' : '12px', backgroundColor: '#E7000B', color: '#FFF', fontSize: '11px', fontWeight: 700, borderRadius: '9999px' }}>
                          -{discount}%
                        </span>
                      )}
                    </div>
                  </Link>
                  <button
                    onClick={() => toggleLike(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform z-10"
                  >
                    <Heart className={`w-4 h-4 ${likedProducts.has(product.id) ? 'fill-[#E7000B] text-[#E7000B]' : 'text-[#4a4a4a]'}`} />
                  </button>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#4a4a4a', marginBottom: '2px' }}>{product.brand}</p>
                  <Link to={`/product/${product.id}`}>
                    <p className="line-clamp-2 hover:underline" style={{ fontSize: '14px', color: '#0d0d0d', marginBottom: '4px' }}>{v(product.name, product.nameVi)}</p>
                  </Link>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '16px', fontWeight: 700, color: product.salePrice ? '#F54900' : '#0d0d0d' }}>
                      {formatVnd(product.salePrice || product.price)}
                    </span>
                    {product.salePrice && (
                      <span className="line-through" style={{ fontSize: '13px', color: '#4a4a4a' }}>{formatVnd(product.price)}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '8px' }}>{v('No products in this style yet', 'Chưa có sản phẩm theo phong cách này')}</p>
            <Link to="/shop" className="inline-block px-6 py-3 bg-[#0d0d0d] text-white mt-4 hover:bg-[#d41c1c] transition-colors" style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Oswald', sans-serif" }}>
              {v('Browse All Products', 'Xem tất cả sản phẩm')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}