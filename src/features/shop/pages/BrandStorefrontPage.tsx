import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useParams } from 'react-router';
import { MapPin, Share2, Package, Globe } from 'lucide-react';
import { ImageWithFallback } from '@/shared/components/figma/ImageWithFallback';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { formatVND } from '@/shared/utils/currency';
import { getBrand, listProducts } from '@/features/shop/api/catalogApi';
import { useWishlistToggle } from '@/features/account/hooks/useWishlistToggle';
import { WishlistHeartButton } from '@/features/shop/components/WishlistHeartButton';
import type {
  BrandDetailResponse,
  ProductListResponse,
  ProductSummary,
} from '@/features/shop/api/contracts';

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

export function BrandStorefrontPage() {
  const { slug } = useParams<{ slug: string }>();
  const [sortBy, setSortBy] = useState('popular');
  const { v } = useLanguage();

  const [detail, setDetail] = useState<BrandDetailResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(true);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [response, setResponse] = useState<ProductListResponse | null>(null);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  const fetchBrand = useCallback(() => {
    if (!slug) return () => {};
    setDetailLoading(true);
    setDetailError(null);
    let active = true;
    getBrand(slug)
      .then(res => { if (active) setDetail(res); })
      .catch((e: unknown) => {
        if (active) setDetailError(e instanceof Error ? e.message : v('Failed to load brand', 'Không tải được thương hiệu'));
      })
      .finally(() => { if (active) setDetailLoading(false); });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchProducts = useCallback(() => {
    if (!slug) return () => {};
    setProductsLoading(true);
    setProductsError(null);
    let active = true;
    listProducts({ brand: slug, sort: mapSort(sortBy), page: 1, limit: 20 })
      .then(res => { if (active) setResponse(res); })
      .catch((e: unknown) => {
        if (active) setProductsError(e instanceof Error ? e.message : v('Failed to load products', 'Không tải được sản phẩm'));
      })
      .finally(() => { if (active) setProductsLoading(false); });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, sortBy]);

  useEffect(() => { const c = fetchBrand(); return c; }, [fetchBrand]);
  useEffect(() => { const c = fetchProducts(); return c; }, [fetchProducts]);

  // Hooks must run unconditionally, before the loading/error early returns.
  const visibleIds = useMemo(() => (response?.items ?? []).map(p => p.id), [response]);
  const { isInWishlist, toggle, isPending } = useWishlistToggle(visibleIds);

  if (detailLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: '#fff9f2' }}>
        <div data-testid="brand-loading" className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-[#e0d8cf] border-t-[#d41c1c] rounded-full animate-spin" />
          <p className="mt-4" style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Loading...', 'Đang tải...')}</p>
        </div>
      </div>
    );
  }

  if (detailError || !detail) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: '#fff9f2' }}>
        <div className="text-center">
          <p style={{ fontSize: '24px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '12px' }}>{v('Brand not found', 'Không tìm thấy thương hiệu')}</p>
          {detailError && <p style={{ fontSize: '14px', color: '#4a4a4a', marginBottom: '16px' }}>{detailError}</p>}
          <button
            onClick={() => fetchBrand()}
            className="px-6 py-3 bg-[#0d0d0d] text-white inline-block mr-3 hover:bg-[#d41c1c] transition-colors"
            style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Oswald', sans-serif" }}
          >
            {v('Retry', 'Thử lại')}
          </button>
          <Link to="/brands" className="px-6 py-3 bg-white border-2 border-[#0d0d0d] text-[#0d0d0d] inline-block hover:bg-[#f3f0eb] transition-colors" style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Oswald', sans-serif" }}>
            {v('Browse All Brands', 'Xem tất cả thương hiệu')}
          </Link>
        </div>
      </div>
    );
  }

  const brand = detail.brand;
  const addresses = detail.addresses.filter(a => a.is_public);
  const products = response?.items ?? [];
  const total = response?.pagination.total ?? 0;

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: '#fff9f2' }}>
      {/* Banner */}
      {brand.banner_url && (
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <ImageWithFallback
            src={brand.banner_url}
            alt={brand.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>
      )}

      {/* Brand Info Section */}
      <div className="mx-auto px-4 lg:px-6" style={{ maxWidth: 'calc(75% + 320px)' }}>
        <div className={`relative ${brand.banner_url ? '-mt-16' : 'mt-8'} mb-8`}>
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
            {/* Avatar */}
            {brand.logo_url && (
              <div className="relative">
                <ImageWithFallback
                  src={brand.logo_url}
                  alt={brand.name}
                  className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-lg bg-white"
                />
              </div>
            )}

            {/* Name & meta */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05 }}>{brand.name}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-4" style={{ fontSize: '14px', color: '#4a4a4a' }}>
                {brand.website_url && (
                  <a href={brand.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#d41c1c] transition-colors">
                    <Globe className="w-4 h-4" />{v('Website', 'Trang web')}
                  </a>
                )}
                <span className="flex items-center gap-1">
                  <Package className="w-4 h-4" />{total} {v('products', 'sản phẩm')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled
                title={v('Not supported yet', 'Chưa hỗ trợ')}
                className="px-6 py-3 bg-[#d41c1c] text-white opacity-50 cursor-not-allowed"
                style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                {v('Follow', 'Theo dõi')} ({v('Not supported yet', 'Chưa hỗ trợ')})
              </button>
              <button
                type="button"
                disabled
                title={v('Not supported yet', 'Chưa hỗ trợ')}
                className="p-3 border-2 border-[#e0d8cf] opacity-50 cursor-not-allowed"
                style={{ borderRadius: '10px' }}
              >
                <Share2 className="w-5 h-5 text-[#4a4a4a]" />
              </button>
            </div>
          </div>
        </div>

        {/* Story */}
        {brand.story && (
          <div className="mb-8 max-w-3xl">
            <p style={{ fontSize: '16px', color: '#4a4a4a', lineHeight: '1.7' }}>
              {brand.story}
            </p>
          </div>
        )}

        {/* Public addresses */}
        {addresses.length > 0 && (
          <div className="mb-8 max-w-3xl space-y-2">
            {addresses.map(a => (
              <div key={a.id} className="flex items-start gap-2" style={{ fontSize: '14px', color: '#4a4a4a' }}>
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  {a.label ? `${a.label}: ` : ''}
                  {[a.address_line, a.ward, a.district, a.city, a.country].filter(Boolean).join(', ')}
                  {a.phone ? ` · ${a.phone}` : ''}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b-2 border-[#e0d8cf]">
          <div />
          <div className="flex items-center gap-3">
            <span style={{ fontSize: '14px', color: '#4a4a4a' }}>{total} {v('items', 'sản phẩm')}</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="appearance-none px-4 py-2 border-2 border-[#e0d8cf] bg-white cursor-pointer"
              style={{ borderRadius: '10px', fontSize: '14px' }}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} disabled={o.disabled}>{v(o.label, o.labelVi)}</option>)}
            </select>
          </div>
        </div>

        {/* Products */}
        {productsLoading ? (
          <div data-testid="brand-products-loading" className="flex flex-col items-center justify-center py-16 pb-16">
            <div className="w-10 h-10 border-4 border-[#e0d8cf] border-t-[#d41c1c] rounded-full animate-spin" />
            <p className="mt-4" style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Loading...', 'Đang tải...')}</p>
          </div>
        ) : productsError ? (
          <div className="text-center py-16 pb-16">
            <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '8px' }}>{v('Something went wrong', 'Đã có lỗi xảy ra')}</p>
            <p style={{ fontSize: '14px', color: '#4a4a4a', marginBottom: '24px' }}>{productsError}</p>
            <button
              onClick={() => fetchProducts()}
              className="inline-block px-6 py-3 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors"
              style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Oswald', sans-serif" }}
            >
              {v('Retry', 'Thử lại')}
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 pb-16">
            <Package className="w-16 h-16 mx-auto text-[#e0d8cf] mb-4" />
            <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '8px' }}>{v('No products yet', 'Chưa có sản phẩm')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 pb-12">
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
