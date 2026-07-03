import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import { Search, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '@/shared/components/figma/ImageWithFallback';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { listBrands } from '@/features/shop/api/catalogApi';
import type { BrandListResponse } from '@/features/shop/api/contracts';

// Backend supports only `a-z` and `newest` for brand sort.
type BrandSort = 'a-z' | 'newest';

export function AllBrandsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<BrandSort>('a-z');
  const { v } = useLanguage();

  const [response, setResponse] = useState<BrandListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce the search input so we don't fire a request per keystroke.
  const [debouncedQuery, setDebouncedQuery] = useState('');
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300);
    return () => clearTimeout(id);
  }, [searchQuery]);

  const fetchBrands = useCallback(() => {
    setLoading(true);
    setError(null);
    let active = true;
    listBrands({ q: debouncedQuery || undefined, sort: sortBy, page: 1, limit: 24 })
      .then(res => { if (active) setResponse(res); })
      .catch((e: unknown) => {
        if (active) setError(e instanceof Error ? e.message : v('Failed to load brands', 'Không tải được thương hiệu'));
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, sortBy]);

  useEffect(() => {
    const cancel = fetchBrands();
    return cancel;
  }, [fetchBrands]);

  const brands = response?.items ?? [];

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: '#fff9f2' }}>
      <div className="mx-auto px-4 lg:px-6 py-3 sm:py-4" style={{ maxWidth: 'calc(75% + 320px)' }}>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6" style={{ fontSize: '14px', color: '#4a4a4a' }}>
          <Link to="/" className="hover:text-[#d41c1c] transition-colors">{v('Home', 'Trang chủ')}</Link>
          <ChevronRight className="w-3 h-3" />
          <span style={{ color: '#0d0d0d' }}>{v('Brands', 'Thương hiệu')}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05, marginBottom: '8px' }}>
            {v('All Brands', 'Tất cả thương hiệu')}
          </h1>
          <p style={{ fontSize: '16px', color: '#4a4a4a' }}>
            {v('Discover local and independent fashion brands on WearWhere', 'Khám phá các thương hiệu thời trang local và độc lập trên WearWhere')}
          </p>
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4a4a]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={v('Search brands...', 'Tìm thương hiệu...')}
              className="w-full pl-11 pr-4 py-3 border-2 border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors"
              style={{ borderRadius: '10px', fontSize: '14px' }}
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as BrandSort)}
              className="appearance-none px-4 py-2.5 border-2 border-[#e0d8cf] bg-white cursor-pointer"
              style={{ borderRadius: '10px', fontSize: '14px' }}
            >
              <option value="a-z">A - Z</option>
              <option value="newest">{v('Newest', 'Mới nhất')}</option>
            </select>
          </div>
        </div>

        {/* Brands Grid / states */}
        {loading ? (
          <div data-testid="brands-loading" className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#e0d8cf] border-t-[#d41c1c] rounded-full animate-spin" />
            <p className="mt-4" style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Loading...', 'Đang tải...')}</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '8px' }}>{v('Something went wrong', 'Đã có lỗi xảy ra')}</p>
            <p style={{ fontSize: '14px', color: '#4a4a4a', marginBottom: '24px' }}>{error}</p>
            <button
              onClick={() => fetchBrands()}
              className="inline-block px-6 py-3 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors"
              style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Oswald', sans-serif" }}
            >
              {v('Retry', 'Thử lại')}
            </button>
          </div>
        ) : brands.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 mx-auto text-[#e0d8cf] mb-4" />
            <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '8px' }}>{v('No brands found', 'Không tìm thấy thương hiệu')}</p>
            <p style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Try a different search term', 'Hãy thử từ khóa khác')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map(brand => (
              <Link
                key={brand.id}
                to={`/brands/${brand.slug}`}
                className="group border-2 border-[#e0d8cf] overflow-hidden hover:shadow-lg transition-shadow"
                style={{ borderRadius: '10px' }}
              >
                {/* Banner */}
                <div className="relative h-40 overflow-hidden bg-[#f3f0eb]">
                  <ImageWithFallback
                    src={brand.banner_url}
                    alt={brand.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                    <div className="flex items-center gap-3">
                      <ImageWithFallback
                        src={brand.logo_url}
                        alt={brand.name}
                        className="w-12 h-12 rounded-full border-2 border-white object-cover bg-white"
                      />
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>{brand.name}</h3>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info */}
                {brand.story && (
                  <div className="p-4">
                    <p className="line-clamp-3" style={{ fontSize: '14px', color: '#4a4a4a' }}>
                      {brand.story}
                    </p>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
