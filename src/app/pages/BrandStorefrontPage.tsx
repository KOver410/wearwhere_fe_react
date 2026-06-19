import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router';
import {
  MapPin, Star, BadgeCheck, Heart, Share2, ChevronRight, Users, Package, Calendar,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { brands, products as allProducts, SORT_OPTIONS, locationVi, styleVi, categoryVi } from '@/app/data/mockData';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { formatVnd } from '@/app/utils/currency';

export function BrandStorefrontPage() {
  const { slug } = useParams<{ slug: string }>();
  const brand = brands.find(b => b.slug === slug);
  const [isFollowing, setIsFollowing] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());
  const { v, lang } = useLanguage();
  const isVi = lang === 'vi';

  const brandProducts = useMemo(() => {
    let result = allProducts.filter(p => p.brandSlug === slug);
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }
    switch (sortBy) {
      case 'price-low': result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price)); break;
      case 'price-high': result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price)); break;
      case 'popular': result.sort((a, b) => b.likes - a.likes); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }
    return result;
  }, [slug, sortBy, selectedCategory]);

  const availableCategories = useMemo(() => {
    const cats = [...new Set(allProducts.filter(p => p.brandSlug === slug).map(p => p.category))];
    return cats;
  }, [slug]);

  const toggleLike = (id: number) => {
    setLikedProducts(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: '#fff9f2' }}>
        <div className="text-center">
          <p style={{ fontSize: '30px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '16px' }}>{v('Brand not found', 'Không tìm thấy thương hiệu')}</p>
          <Link to="/brands" className="px-6 py-3 bg-[#0d0d0d] text-white inline-block hover:bg-[#d41c1c] transition-colors" style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Oswald', sans-serif" }}>
            {v('Browse All Brands', 'Xem tất cả thương hiệu')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: '#fff9f2' }}>
      {/* Banner */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <ImageWithFallback
          src={brand.banner}
          alt={brand.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      </div>

      {/* Brand Info Section */}
      <div className="mx-auto px-4 lg:px-6" style={{ maxWidth: 'calc(75% + 320px)' }}>
        <div className="relative -mt-16 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
            {/* Avatar */}
            <div className="relative">
              <ImageWithFallback
                src={brand.logo}
                alt={brand.name}
                className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-lg"
              />
              {brand.verified && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#d41c1c] rounded-full flex items-center justify-center border-2 border-white">
                  <BadgeCheck className="w-5 h-5 text-white" />
                </div>
              )}
            </div>

            {/* Name & Stats */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05 }}>{brand.name}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-4" style={{ fontSize: '14px', color: '#4a4a4a' }}>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />{v(brand.location, locationVi(brand.location))}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#d41c1c] text-[#d41c1c]" />{brand.rating} {v('rating', 'đánh giá')}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />{(brand.followers / 1000).toFixed(1)}k {v('followers', 'người theo dõi')}
                </span>
                <span className="flex items-center gap-1">
                  <Package className="w-4 h-4" />{brand.productCount} {v('products', 'sản phẩm')}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />{v('Since', 'Từ')} {brand.founded}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-6 py-3 transition-colors ${
                  isFollowing
                    ? 'bg-white text-[#d41c1c] border-2 border-[#d41c1c]'
                    : 'bg-[#d41c1c] text-white'
                }`}
                style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                {isFollowing ? v('Following', 'Đang theo dõi') : v('Follow', 'Theo dõi')}
              </button>
              <button
                className="p-3 border-2 border-[#e0d8cf] hover:bg-[#f3f0eb] transition-colors"
                style={{ borderRadius: '10px' }}
              >
                <Share2 className="w-5 h-5 text-[#4a4a4a]" />
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8 max-w-3xl">
          <p style={{ fontSize: '16px', color: '#4a4a4a', lineHeight: '1.7' }}>
            {brand.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {brand.styles.map(s => (
              <Link
                key={s}
                to={`/style/${s}`}
                className="px-3 py-1.5 bg-[#f3f0eb] hover:bg-[#ede8e0] transition-colors capitalize"
                style={{ fontSize: '13px', borderRadius: '9999px', color: '#4a4a4a' }}
              >
                {v(s, styleVi(s))}
              </Link>
            ))}
            {brand.categories.map(c => (
              <Link
                key={c}
                to={`/shop?category=${c}`}
                className="px-3 py-1.5 border-2 border-[#e0d8cf] hover:bg-[#f3f0eb] transition-colors capitalize"
                style={{ fontSize: '13px', borderRadius: '9999px', color: '#4a4a4a' }}
              >
                {v(c, categoryVi(c))}
              </Link>
            ))}
          </div>
        </div>

        {/* Category Filter + Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b-2 border-[#e0d8cf]">
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex-shrink-0 px-4 py-2 transition-colors ${
                selectedCategory === 'all' ? 'bg-[#d41c1c] text-white' : 'border-2 border-[#e0d8cf] hover:bg-[#f3f0eb]'
              }`}
              style={{ borderRadius: '9999px', fontSize: '14px' }}
            >
              {v('All Products', 'Tất cả')}
            </button>
            {availableCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 capitalize transition-colors ${
                  selectedCategory === cat ? 'bg-[#d41c1c] text-white' : 'border-2 border-[#e0d8cf] hover:bg-[#f3f0eb]'
                }`}
                style={{ borderRadius: '9999px', fontSize: '14px' }}
              >
                {v(cat, categoryVi(cat))}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: '14px', color: '#4a4a4a' }}>{brandProducts.length} {v('items', 'sản phẩm')}</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="appearance-none px-4 py-2 border-2 border-[#e0d8cf] bg-white cursor-pointer"
              style={{ borderRadius: '10px', fontSize: '14px' }}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{isVi ? o.labelVi : o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 pb-12">
          {brandProducts.map(product => {
            const discount = product.salePrice
              ? Math.round(((product.price - product.salePrice) / product.price) * 100)
              : 0;
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
                  <p style={{ fontSize: '12px', color: '#4a4a4a', marginTop: '2px' }}>{product.likes} {v('likes', 'lượt thích')}</p>
                </div>
              </div>
            );
          })}
        </div>

        {brandProducts.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 mx-auto text-[#e0d8cf] mb-4" />
            <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '8px' }}>{v('No products in this category', 'Không có sản phẩm trong danh mục này')}</p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="px-6 py-3 bg-[#0d0d0d] text-white mt-2 hover:bg-[#d41c1c] transition-colors"
              style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Oswald', sans-serif" }}
            >
              {v('View All Products', 'Xem tất cả sản phẩm')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}