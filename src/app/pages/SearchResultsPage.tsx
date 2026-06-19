import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Search, X, Heart, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { products as allProducts, CATEGORIES, STYLES } from '@/app/data/mockData';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { formatVnd } from '@/app/utils/currency';

export function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { v, lang } = useLanguage();
  const isVi = lang === 'vi';
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());

  const results = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return allProducts.filter(
      p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.style.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.colors.some(c => c.toLowerCase().includes(q))
    );
  }, [query]);

  const suggestedCategories = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return CATEGORIES.filter(c => c.name.toLowerCase().includes(q) || c.slug.includes(q));
  }, [query]);

  const suggestedStyles = useMemo(() => {
    if (!query) return [];
    const q = query.toLowerCase();
    return STYLES.filter(s => s.name.toLowerCase().includes(q) || s.slug.includes(q));
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const toggleLike = (id: number) => {
    setLikedProducts(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

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
        {query && (
          <div className="mb-8">
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05 }}>
              {results.length > 0
                ? <>{v('Results for', 'Kết quả cho')} "<span style={{ color: '#F54900' }}>{query}</span>"</>
                : <>{v('No results for', 'Không có kết quả cho')} "<span style={{ color: '#E7000B' }}>{query}</span>"</>
              }
            </h1>
            <p style={{ fontSize: '14px', color: '#4a4a4a', marginTop: '4px' }}>
              {results.length} {v('products found', 'sản phẩm')}
            </p>
          </div>
        )}

        {/* Suggested Categories/Styles */}
        {(suggestedCategories.length > 0 || suggestedStyles.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-8">
            {suggestedCategories.map(c => (
              <Link
                key={c.slug}
                to={`/shop?category=${c.slug}`}
                className="px-4 py-2 bg-[#f3f0eb] hover:bg-[#ede8e0] transition-colors"
                style={{ borderRadius: '9999px', fontSize: '14px', color: '#0d0d0d' }}
              >
                {v('Shop', 'Mua')} {isVi ? c.nameVi : c.name} →
              </Link>
            ))}
            {suggestedStyles.map(s => (
              <Link
                key={s.slug}
                to={`/style/${s.slug}`}
                className="px-4 py-2 bg-[#f3f0eb] hover:bg-[#ede8e0] transition-colors"
                style={{ borderRadius: '9999px', fontSize: '14px', color: '#0d0d0d' }}
              >
                {isVi ? s.nameVi : s.name} →
              </Link>
            ))}
          </div>
        )}

        {/* Results Grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {results.map(product => {
              const discount = product.salePrice
                ? Math.round(((product.price - product.salePrice) / product.price) * 100)
                : 0;
              return (
                <div key={product.id} className="group">
                  <Link to={`/product/${product.id}`}>
                    <div className="relative overflow-hidden bg-[#f3f0eb] aspect-[3/4] mb-3" style={{ borderRadius: '4px' }}>
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {discount > 0 && (
                        <span className="absolute top-3 left-3 px-2.5 py-1" style={{ backgroundColor: '#E7000B', color: '#FFF', fontSize: '11px', fontWeight: 700, borderRadius: '9999px' }}>
                          -{discount}%
                        </span>
                      )}
                    </div>
                  </Link>
                  <button
                    onClick={() => toggleLike(product.id)}
                    className="relative float-right -mt-13 mr-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform z-10"
                  >
                    <Heart className={`w-4 h-4 ${likedProducts.has(product.id) ? 'fill-[#E7000B] text-[#E7000B]' : 'text-[#4a4a4a]'}`} />
                  </button>
                  <div className="mt-1">
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