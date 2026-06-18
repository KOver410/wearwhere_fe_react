import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Search, X, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '@/shared/components/figma/ImageWithFallback';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { formatVND } from '@/shared/utils/currency';
import { listProducts } from '@/features/shop/api/catalogApi';
import { useWishlistToggle } from '@/features/account/hooks/useWishlistToggle';
import { WishlistHeartButton } from '@/features/shop/components/WishlistHeartButton';
import type { ProductListResponse, ProductSummary } from '@/features/shop/api/contracts';

function priceDisplay(product: ProductSummary): string {
  if (product.max_price > product.min_price) {
    return `${formatVND(product.min_price)} - ${formatVND(product.max_price)}`;
  }
  return formatVND(product.min_price);
}

export function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { v } = useLanguage();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);

  const [response, setResponse] = useState<ProductListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { setSearchInput(query); }, [query]);

  const fetchResults = useCallback(() => {
    if (!query) {
      setResponse(null);
      setLoading(false);
      setError(null);
      return () => {};
    }
    setLoading(true);
    setError(null);
    let active = true;
    listProducts({ q: query, sort: 'relevance', page: 1, limit: 20 })
      .then(res => { if (active) setResponse(res); })
      .catch((e: unknown) => {
        if (active) setError(e instanceof Error ? e.message : v('Failed to load results', 'Không tải được kết quả'));
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    const cancel = fetchResults();
    return cancel;
  }, [fetchResults]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const results = response?.items ?? [];
  const suggestions = response?.suggestions ?? [];
  const totalResults = response?.pagination.total ?? 0;

  const visibleIds = useMemo(() => results.map(p => p.id), [results]);
  const { isInWishlist, toggle, isPending } = useWishlistToggle(visibleIds);
  const popularSearches = ['Denim Jacket', 'Sneakers', 'Korean Fashion', 'Vintage', 'Leather Bag', 'Summer Dress'];

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: '#fff9f2' }}>
      <div className="mx-auto px-4 lg:px-6 py-3 sm:py-4" style={{ maxWidth: 'calc(75% + 320px)' }}>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6" style={{ fontSize: '14px', color: '#4a4a4a' }}>
          <Link to="/" className="hover:text-[#d41c1c] transition-colors">{v('Home', 'Trang chủ')}</Link>
          <ChevronRight className="w-3 h-3" />
          <span style={{ color: '#0d0d0d' }}>{v('Search Results', 'Kết quả tìm kiếm')}</span>
        </nav>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4a4a4a]" />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder={v('Search for products, brands, styles...', 'Tìm kiếm sản phẩm, thương hiệu, phong cách...')}
              className="w-full pl-12 pr-12 py-4 border-2 border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors"
              style={{ borderRadius: '10px', fontSize: '16px', color: '#0d0d0d' }}
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => { setSearchInput(''); setSearchParams({}); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-[#f3f0eb] rounded-full"
              >
                <X className="w-4 h-4 text-[#4a4a4a]" />
              </button>
            )}
          </div>
        </form>

        {/* Results Header */}
        {query && !loading && !error && (
          <div className="mb-8">
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05 }}>
              {results.length > 0
                ? <>{v('Results for', 'Kết quả cho')} "<span style={{ color: '#F54900' }}>{query}</span>"</>
                : <>{v('No results for', 'Không có kết quả cho')} "<span style={{ color: '#E7000B' }}>{query}</span>"</>
              }
            </h1>
            <p style={{ fontSize: '14px', color: '#4a4a4a', marginTop: '4px' }}>
              {totalResults} {v('products found', 'sản phẩm')}
            </p>
          </div>
        )}

        {/* Backend suggestions */}
        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <span style={{ fontSize: '14px', color: '#4a4a4a', alignSelf: 'center' }}>
              {v('Did you mean', 'Có phải bạn muốn tìm')}:
            </span>
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => { setSearchInput(s); setSearchParams({ q: s }); }}
                className="px-4 py-2 bg-[#f3f0eb] hover:bg-[#ede8e0] transition-colors"
                style={{ borderRadius: '9999px', fontSize: '14px', color: '#0d0d0d' }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div data-testid="search-loading" className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#e0d8cf] border-t-[#d41c1c] rounded-full animate-spin" />
            <p className="mt-4" style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Loading...', 'Đang tải...')}</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '8px' }}>{v('Something went wrong', 'Đã có lỗi xảy ra')}</p>
            <p style={{ fontSize: '14px', color: '#4a4a4a', marginBottom: '24px' }}>{error}</p>
            <button
              onClick={() => fetchResults()}
              className="inline-block px-8 py-3 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors"
              style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
            >
              {v('Retry', 'Thử lại')}
            </button>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {results.map(product => (
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
                <div className="mt-1">
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
        ) : query ? (
          <div className="text-center py-16">
            <Search className="w-20 h-20 mx-auto text-[#e0d8cf] mb-6" />
            <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '8px' }}>
              {v("We couldn't find any matches", 'Không tìm thấy kết quả phù hợp')}
            </p>
            <p style={{ fontSize: '14px', color: '#4a4a4a', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
              {v('Try searching with different keywords or browse our popular categories', 'Hãy thử tìm kiếm với từ khóa khác hoặc duyệt danh mục phổ biến')}
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {popularSearches.map(term => (
                <button
                  key={term}
                  onClick={() => { setSearchInput(term); setSearchParams({ q: term }); }}
                  className="px-4 py-2 border-2 border-[#e0d8cf] hover:border-[#d41c1c] hover:bg-[#d41c1c] hover:text-white transition-colors"
                  style={{ borderRadius: '9999px', fontSize: '14px' }}
                >
                  {term}
                </button>
              ))}
            </div>
            <Link
              to="/shop"
              className="inline-block px-8 py-3 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors"
              style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
            >
              {v('Browse All Products', 'Xem tất cả sản phẩm')}
            </Link>
          </div>
        ) : (
          /* Empty State - No search yet */
          <div className="text-center py-16">
            <Search className="w-20 h-20 mx-auto text-[#e0d8cf] mb-6" />
            <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '16px' }}>
              {v('What are you looking for?', 'Bạn đang tìm kiếm gì?')}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {popularSearches.map(term => (
                <button
                  key={term}
                  onClick={() => { setSearchInput(term); setSearchParams({ q: term }); }}
                  className="px-4 py-2 border-2 border-[#e0d8cf] hover:border-[#d41c1c] hover:bg-[#d41c1c] hover:text-white transition-colors"
                  style={{ borderRadius: '9999px', fontSize: '14px' }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
