import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useParams } from 'react-router';
import { ChevronRight, Sparkles } from 'lucide-react';
import { ImageWithFallback } from '@/shared/components/figma/ImageWithFallback';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { formatVND } from '@/shared/utils/currency';
import { listProducts, listStyleTags } from '@/features/shop/api/catalogApi';
import { useWishlistToggle } from '@/features/account/hooks/useWishlistToggle';
import { WishlistHeartButton } from '@/features/shop/components/WishlistHeartButton';
import type { ProductListResponse, ProductSummary, StyleTagRef } from '@/features/shop/api/contracts';

const SORT_OPTIONS: { value: string; label: string; labelVi: string; backend?: string; disabled?: boolean }[] = [
  { value: 'newest', label: 'Newest', labelVi: 'Mới nhất', backend: 'newest' },
  { value: 'popular', label: 'Most Popular', labelVi: 'Phổ biến nhất', backend: 'popular' },
  { value: 'price-low', label: 'Price: Low to High', labelVi: 'Giá: Thấp đến cao', backend: 'price_asc' },
  { value: 'price-high', label: 'Price: High to Low', labelVi: 'Giá: Cao đến thấp', backend: 'price_desc' },
  { value: 'rating', label: 'Highest Rated (Chưa hỗ trợ)', labelVi: 'Đánh giá cao nhất (Chưa hỗ trợ)', disabled: true },
];

function mapSort(uiSort: string): string {
  return SORT_OPTIONS.find(o => o.value === uiSort)?.backend ?? 'popular';
}

function priceDisplay(product: ProductSummary): string {
  if (product.max_price > product.min_price) {
    return `${formatVND(product.min_price)} - ${formatVND(product.max_price)}`;
  }
  return formatVND(product.min_price);
}

export function StylePage() {
  const { slug } = useParams<{ slug: string }>();
  const [sortBy, setSortBy] = useState('popular');
  const { v } = useLanguage();

  const [response, setResponse] = useState<ProductListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [styleTags, setStyleTags] = useState<StyleTagRef[]>([]);

  useEffect(() => {
    let active = true;
    listStyleTags()
      .then(res => { if (active) setStyleTags(res.items); })
      .catch(() => { if (active) setStyleTags([]); });
    return () => { active = false; };
  }, []);

  const fetchProducts = useCallback(() => {
    if (!slug) return () => {};
    setLoading(true);
    setError(null);
    let active = true;
    listProducts({ style: [slug], sort: mapSort(sortBy), page: 1, limit: 20 })
      .then(res => { if (active) setResponse(res); })
      .catch((e: unknown) => {
        if (active) setError(e instanceof Error ? e.message : v('Failed to load products', 'Không tải được sản phẩm'));
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, sortBy]);

  useEffect(() => {
    const cancel = fetchProducts();
    return cancel;
  }, [fetchProducts]);

  const products = response?.items ?? [];
  const total = response?.pagination.total ?? 0;
  const visibleIds = useMemo(() => products.map(p => p.id), [products]);
  const { isInWishlist, toggle, isPending } = useWishlistToggle(visibleIds);
  const styleInfo = styleTags.find(s => s.slug === slug);
  const styleTitle = styleInfo?.name || slug || '';

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: '#fff9f2' }}>
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#0d0d0d] to-[#333] text-white">
        <div className="mx-auto px-6 lg:px-12 py-16 sm:py-24" style={{ maxWidth: 'calc(75% + 320px)' }}>
          <nav className="flex items-center gap-2 mb-6" style={{ fontSize: '14px', opacity: 0.7 }}>
            <Link to="/" className="hover:opacity-100 transition-opacity">{v('Home', 'Trang chủ')}</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/shop" className="hover:opacity-100 transition-opacity">{v('Shop', 'Cửa hàng')}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="opacity-100 capitalize">{styleTitle}</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <h1 className="capitalize" style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.05 }}>{styleTitle}</h1>
          </div>
          <p className="mt-4" style={{ fontSize: '14px', opacity: 0.6 }}>{total} {v('products', 'sản phẩm')}</p>
        </div>
      </div>

      {/* Other Styles */}
      <div className="mx-auto px-4 lg:px-6 py-8 sm:py-12" style={{ maxWidth: 'calc(75% + 320px)' }}>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {styleTags.filter(s => s.slug !== slug).map(s => (
            <Link
              key={s.slug}
              to={`/style/${s.slug}`}
              className="flex-shrink-0 px-4 py-2 border-2 border-[#e0d8cf] hover:bg-[#d41c1c] hover:text-white hover:border-[#d41c1c] transition-colors"
              style={{ borderRadius: '9999px', fontSize: '13px' }}
            >
              {s.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Products */}
      <div className="mx-auto px-4 lg:px-6 pb-6" style={{ maxWidth: 'calc(75% + 320px)' }}>
        <div className="flex items-center justify-between mb-6">
          <p style={{ fontSize: '14px', color: '#4a4a4a' }}>{total} {v('products', 'sản phẩm')}</p>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2 border-2 border-[#e0d8cf] bg-white cursor-pointer"
            style={{ borderRadius: '10px', fontSize: '14px' }}
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} disabled={o.disabled}>{v(o.label, o.labelVi)}</option>)}
          </select>
        </div>

        {loading ? (
          <div data-testid="style-loading" className="flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-[#e0d8cf] border-t-[#d41c1c] rounded-full animate-spin" />
            <p className="mt-4" style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Loading...', 'Đang tải...')}</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '8px' }}>{v('Something went wrong', 'Đã có lỗi xảy ra')}</p>
            <p style={{ fontSize: '14px', color: '#4a4a4a', marginBottom: '24px' }}>{error}</p>
            <button
              onClick={() => fetchProducts()}
              className="inline-block px-6 py-3 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors"
              style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Oswald', sans-serif" }}
            >
              {v('Retry', 'Thử lại')}
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '8px' }}>{v('No products in this style yet', 'Chưa có sản phẩm theo phong cách này')}</p>
            <Link to="/shop" className="inline-block px-6 py-3 bg-[#0d0d0d] text-white mt-4 hover:bg-[#d41c1c] transition-colors" style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Oswald', sans-serif" }}>
              {v('Browse All Products', 'Xem tất cả sản phẩm')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {products.map(product => (
              <div key={product.id} className="group">
                <div className="relative">
                  <Link to={`/product/${product.id}`}>
                    <div className="relative overflow-hidden bg-[#f3f0eb] aspect-[3/4] mb-3" style={{ borderRadius: '4px' }}>
                      <ImageWithFallback
                        src={product.primary_image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {!product.in_stock && (
                        <span className="absolute top-3 left-3 px-2.5 py-1" style={{ backgroundColor: '#4a4a4a', color: '#FFF', fontSize: '11px', fontWeight: 700, borderRadius: '9999px' }}>
                          {v('Out of stock', 'Hết hàng')}
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="absolute top-3 right-3">
                    <WishlistHeartButton active={isInWishlist(product.id)} onToggle={() => toggle(product.id)} pending={isPending(product.id)} />
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: '12px', color: '#4a4a4a', marginBottom: '2px' }}>{product.brand_name}</p>
                  <Link to={`/product/${product.id}`}>
                    <p className="line-clamp-2 hover:underline" style={{ fontSize: '14px', color: '#0d0d0d', marginBottom: '4px' }}>{product.name}</p>
                  </Link>
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#0d0d0d' }}>
                      {priceDisplay(product)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
