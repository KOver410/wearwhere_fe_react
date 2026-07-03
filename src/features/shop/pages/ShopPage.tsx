import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import {
  Search, SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutList, ChevronRight,
} from 'lucide-react';
import { ImageWithFallback } from '@/shared/components/figma/ImageWithFallback';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { formatVND } from '@/shared/utils/currency';
import { listProducts, listCategories, listStyleTags } from '@/features/shop/api/catalogApi';
import { useWishlistToggle } from '@/features/account/hooks/useWishlistToggle';
import { WishlistHeartButton } from '@/features/shop/components/WishlistHeartButton';
import type {
  CategoryRef,
  ProductSummary,
  ProductListResponse,
  StyleTagRef,
} from '@/features/shop/api/contracts';

const PRICE_RANGES: { label: string; min: number; max: number | undefined }[] = [
  { label: 'Dưới 1.250.000₫', min: 0, max: 1250000 },
  { label: '1.250.000₫ - 2.500.000₫', min: 1250000, max: 2500000 },
  { label: '2.500.000₫ - 5.000.000₫', min: 2500000, max: 5000000 },
  { label: '5.000.000₫ - 12.500.000₫', min: 5000000, max: 12500000 },
  { label: 'Trên 12.500.000₫', min: 12500000, max: undefined },
];

// UI sort value -> backend sort. `rating` is unsupported and disabled.
const SORT_OPTIONS: { value: string; label: string; labelVi: string; backend?: string; disabled?: boolean }[] = [
  { value: 'newest', label: 'Newest', labelVi: 'Mới nhất', backend: 'newest' },
  { value: 'popular', label: 'Most Popular', labelVi: 'Phổ biến nhất', backend: 'popular' },
  { value: 'price-low', label: 'Price: Low to High', labelVi: 'Giá: Thấp đến cao', backend: 'price_asc' },
  { value: 'price-high', label: 'Price: High to Low', labelVi: 'Giá: Cao đến thấp', backend: 'price_desc' },
  { value: 'rating', label: 'Highest Rated (Chưa hỗ trợ)', labelVi: 'Đánh giá cao nhất (Chưa hỗ trợ)', disabled: true },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

function mapSort(uiSort: string): string {
  return SORT_OPTIONS.find(o => o.value === uiSort)?.backend ?? 'newest';
}

const ITEMS_PER_PAGE = 20;

export function ShopPage() {
  const [searchParams] = useSearchParams();
  const { v, lang } = useLanguage();
  const isVi = lang === 'vi';
  const urlCategory = searchParams.get('category') || '';
  const urlStyle = searchParams.get('style') || '';
  const urlSort = searchParams.get('sort') || '';

  const [showFilters, setShowFilters] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [selectedStyle, setSelectedStyle] = useState(urlStyle);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState(urlSort || 'newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOpen, setSortOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Data state
  const [response, setResponse] = useState<ProductListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryRef[]>([]);
  const [styleTags, setStyleTags] = useState<StyleTagRef[]>([]);

  // Load filter options from backend.
  useEffect(() => {
    let active = true;
    listCategories()
      .then(res => { if (active) setCategories(res.items); })
      .catch(() => { if (active) setCategories([]); });
    listStyleTags()
      .then(res => { if (active) setStyleTags(res.items); })
      .catch(() => { if (active) setStyleTags([]); });
    return () => { active = false; };
  }, []);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync URL params with state
  useEffect(() => { setSelectedCategory(urlCategory); }, [urlCategory]);
  useEffect(() => { setSelectedStyle(urlStyle); }, [urlStyle]);
  useEffect(() => { if (urlSort) setSortBy(urlSort); }, [urlSort]);

  const priceRange = selectedPriceRange !== null ? PRICE_RANGES[selectedPriceRange] : null;

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError(null);
    let active = true;
    listProducts({
      q: searchQuery.trim() || undefined,
      category: selectedCategory || undefined,
      style: selectedStyle ? [selectedStyle] : undefined,
      size: selectedSizes.length > 0 ? selectedSizes : undefined,
      price_min: priceRange ? priceRange.min : undefined,
      price_max: priceRange?.max,
      sort: mapSort(sortBy),
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    })
      .then(res => { if (active) setResponse(res); })
      .catch((e: unknown) => {
        if (active) setError(e instanceof Error ? e.message : v('Failed to load products', 'Không tải được sản phẩm'));
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory, selectedStyle, selectedSizes, selectedPriceRange, sortBy, currentPage]);

  useEffect(() => {
    const cancel = fetchProducts();
    return cancel;
  }, [fetchProducts]);

  const products = response?.items ?? [];
  const pagination = response?.pagination;
  const totalPages = pagination?.total_pages ?? 0;
  const totalResults = pagination?.total ?? 0;

  const visibleIds = useMemo(() => products.map(p => p.id), [products]);
  const { isInWishlist, toggle, isPending } = useWishlistToggle(visibleIds);

  const activeFilterCount = [
    selectedCategory, selectedStyle, selectedSizes.length > 0,
    selectedPriceRange !== null,
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedStyle('');
    setSelectedSizes([]);
    setSelectedPriceRange(null);
    setCurrentPage(1);
  };

  const toggleArrayFilter = (arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]);
    setCurrentPage(1);
  };

  const categoryName = (slug: string) => categories.find(c => c.slug === slug)?.name || slug;
  const styleName = (slug: string) => styleTags.find(s => s.slug === slug)?.name || slug;

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: '#fff9f2' }}>
      <div className="mx-auto px-4 lg:px-6 py-3 sm:py-4" style={{ maxWidth: 'calc(75% + 320px)' }}>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6" style={{ fontSize: '14px', color: '#4a4a4a' }}>
          <Link to="/" className="hover:text-[#d41c1c] transition-colors">{v('Home', 'Trang chủ')}</Link>
          <ChevronRight className="w-3 h-3" />
          <span style={{ color: '#0d0d0d' }}>{v('Shop', 'Cửa hàng')}</span>
          {selectedCategory && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span style={{ color: '#0d0d0d' }} className="capitalize">{categoryName(selectedCategory)}</span>
            </>
          )}
        </nav>

        {/* Search Bar */}
        <div className="relative mb-6">
          {searchOpen ? (
            <div
              className="flex items-center bg-white border-2 border-[#d41c1c] overflow-hidden shadow-[0_0_0_3px_rgba(212,28,28,0.08)]"
              style={{ borderRadius: '12px' }}
            >
              <Search className="w-5 h-5 text-[#4a4a4a] ml-4 flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                onKeyDown={e => { if (e.key === 'Escape') { setSearchOpen(false); } }}
                placeholder={isVi ? 'Tìm kiếm sản phẩm, thương hiệu, phong cách...' : 'Search products, brands, styles...'}
                className="w-full py-2.5 px-3 bg-transparent outline-none placeholder:text-[#999]"
                style={{ fontSize: '14px', color: '#0d0d0d', fontFamily: "'Montserrat', sans-serif" }}
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setCurrentPage(1); searchInputRef.current?.focus(); }}
                  className="mr-1 p-1.5 hover:bg-[#f3f0eb] transition-colors flex-shrink-0"
                  style={{ borderRadius: '8px' }}
                >
                  <X className="w-4 h-4 text-[#4a4a4a]" />
                </button>
              )}
              <button
                onClick={() => setSearchOpen(false)}
                className="mr-2 p-1.5 hover:bg-[#f3f0eb] transition-colors flex-shrink-0"
                style={{ borderRadius: '8px' }}
              >
                <X className="w-4 h-4 text-[#999]" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setSearchOpen(true); setTimeout(() => searchInputRef.current?.focus(), 50); }}
              className="flex items-center gap-2 px-3 py-2 border-2 border-[#e0d8cf] bg-white hover:border-[#d41c1c] transition-colors"
              style={{ borderRadius: '10px' }}
            >
              <Search className="w-4 h-4 text-[#4a4a4a]" />
              {searchQuery && (
                <span style={{ fontSize: '13px', color: '#d41c1c', fontWeight: 500, maxWidth: '150px' }} className="truncate">
                  "{searchQuery}"
                </span>
              )}
            </button>
          )}
          {searchQuery.trim() && !searchOpen && (
            <p className="mt-2" style={{ fontSize: '13px', color: '#4a4a4a' }}>
              {totalResults} {isVi ? 'kết quả cho' : 'results for'} "<span style={{ color: '#d41c1c', fontWeight: 500 }}>{searchQuery}</span>"
            </p>
          )}
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05 }}>
              {selectedCategory ? categoryName(selectedCategory) : v('Shop All', 'Tất cả sản phẩm')}
            </h1>
            <p style={{ fontSize: '14px', color: '#4a4a4a', marginTop: '4px' }}>
              {totalResults} {v('products found', 'sản phẩm')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="relative" ref={sortRef}>
              <div
                className="flex items-center pl-4 pr-10 py-2.5 border-2 border-[#e0d8cf] bg-white cursor-pointer select-none hover:border-[#d41c1c] transition-colors"
                style={{ borderRadius: '10px', fontSize: '14px', color: '#0d0d0d', minWidth: '160px' }}
                onClick={() => setSortOpen(!sortOpen)}
              >
                {isVi
                  ? SORT_OPTIONS.find(o => o.value === sortBy)?.labelVi
                  : SORT_OPTIONS.find(o => o.value === sortBy)?.label}
              </div>
              <ChevronDown
                className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4a4a4a] pointer-events-none transition-transform ${sortOpen ? 'rotate-180' : ''}`}
              />
              {sortOpen && (
                <div
                  className="absolute right-0 top-full mt-2 bg-white border-2 border-[#e0d8cf] z-10 min-w-[200px] p-1.5 overflow-hidden"
                  style={{ borderRadius: '12px', boxShadow: '0px 10px 25px rgba(0,0,0,0.1), 0px 4px 10px rgba(0,0,0,0.05)' }}
                >
                  {SORT_OPTIONS.map(o => (
                    <button
                      key={o.value}
                      disabled={o.disabled}
                      onClick={() => { if (o.disabled) return; setSortBy(o.value); setSortOpen(false); setCurrentPage(1); }}
                      className={`w-full text-left py-2.5 px-4 transition-colors ${
                        o.disabled
                          ? 'text-[#bbb] cursor-not-allowed'
                          : sortBy === o.value ? 'bg-[#d41c1c] text-white' : 'text-[#0d0d0d] hover:bg-[#f3f0eb]'
                      }`}
                      style={{ borderRadius: '8px', fontSize: '14px' }}
                    >
                      {isVi ? o.labelVi : o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View Toggle */}
            <div className="hidden sm:flex items-center border-2 border-[#e0d8cf]" style={{ borderRadius: '10px' }}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-[#d41c1c] text-white' : 'text-[#4a4a4a] hover:text-[#d41c1c]'}`}
                style={{ borderRadius: '8px 0 0 8px' }}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-[#d41c1c] text-white' : 'text-[#4a4a4a] hover:text-[#d41c1c]'}`}
                style={{ borderRadius: '0 8px 8px 0' }}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Toggle (mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center gap-2 px-4 py-2.5 border-2 border-[#e0d8cf]"
              style={{ borderRadius: '8px', fontSize: '14px' }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {v('Filters', 'Bộ lọc')}
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-[#d41c1c] text-white rounded-full flex items-center justify-center" style={{ fontSize: '11px' }}>
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Active Filters Bar */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {selectedCategory && (
              <FilterTag label={`${v('Category', 'Danh mục')}: ${categoryName(selectedCategory)}`} onRemove={() => { setSelectedCategory(''); setCurrentPage(1); }} />
            )}
            {selectedStyle && (
              <FilterTag label={`${v('Style', 'Phong cách')}: ${styleName(selectedStyle)}`} onRemove={() => { setSelectedStyle(''); setCurrentPage(1); }} />
            )}
            {selectedSizes.map(s => (
              <FilterTag key={s} label={`${v('Size', 'Cỡ')}: ${s}`} onRemove={() => toggleArrayFilter(selectedSizes, s, setSelectedSizes)} />
            ))}
            {selectedPriceRange !== null && (
              <FilterTag label={PRICE_RANGES[selectedPriceRange].label} onRemove={() => { setSelectedPriceRange(null); setCurrentPage(1); }} />
            )}
            <button
              onClick={clearAllFilters}
              className="px-3 py-1.5 hover:bg-[#f3f0eb] transition-colors"
              style={{ fontSize: '12px', color: '#E7000B', borderRadius: '9999px' }}
            >
              {v('Clear all', 'Xóa tất cả')}
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`${showFilters ? 'block' : 'hidden'} sm:block w-full sm:w-[210px] flex-shrink-0`}
          >
            <div className="sticky top-24 space-y-0">
              {/* Categories */}
              <FilterSection title={v('Categories', 'Danh mục')}>
                {categories.map(cat => (
                  <button
                    key={cat.slug}
                    onClick={() => { setSelectedCategory(selectedCategory === cat.slug ? '' : cat.slug); setCurrentPage(1); }}
                    className={`w-full flex items-center justify-between py-2 px-3 transition-colors ${
                      selectedCategory === cat.slug ? 'bg-[#d41c1c] text-white' : 'hover:bg-[#f3f0eb]'
                    }`}
                    style={{ borderRadius: '4px', fontSize: '14px' }}
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </FilterSection>

              {/* Styles */}
              <FilterSection title={v('Style', 'Phong cách')}>
                <div className="overflow-y-auto scrollbar-hover-show" style={{ maxHeight: '240px' }}>
                {styleTags.map(style => (
                  <button
                    key={style.slug}
                    onClick={() => { setSelectedStyle(selectedStyle === style.slug ? '' : style.slug); setCurrentPage(1); }}
                    className={`w-full flex items-center justify-between py-2 px-3 transition-colors ${
                      selectedStyle === style.slug ? 'bg-[#d41c1c] text-white' : 'hover:bg-[#f3f0eb]'
                    }`}
                    style={{ borderRadius: '4px', fontSize: '14px' }}
                  >
                    <span>{style.name}</span>
                  </button>
                ))}
                </div>
              </FilterSection>

              {/* Price Range */}
              <FilterSection title={v('Price Range', 'Khoảng giá')}>
                <div className="space-y-1 overflow-y-auto scrollbar-hover-show" style={{ maxHeight: '240px' }}>
                  {PRICE_RANGES.map((range, idx) => (
                    <label
                      key={idx}
                      className="flex items-center gap-3 py-2 px-3 cursor-pointer transition-colors hover:bg-[#f3f0eb]"
                      style={{ borderRadius: '4px' }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPriceRange === idx}
                        onChange={() => { setSelectedPriceRange(selectedPriceRange === idx ? null : idx); setCurrentPage(1); }}
                        className="w-4 h-4 accent-[#d41c1c] shrink-0"
                      />
                      <span className="flex-1" style={{ fontSize: '14px', color: '#0d0d0d' }}>
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Sizes */}
              <FilterSection title={v('Sizes', 'Kích cỡ')}>
                <div className="space-y-1 overflow-y-auto scrollbar-hover-show" style={{ maxHeight: '240px' }}>
                  {SIZES.map(size => (
                    <label
                      key={size}
                      className="flex items-center gap-3 py-2 px-3 cursor-pointer transition-colors hover:bg-[#f3f0eb]"
                      style={{ borderRadius: '4px' }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(size)}
                        onChange={() => toggleArrayFilter(selectedSizes, size, setSelectedSizes)}
                        className="w-4 h-4 accent-[#d41c1c] shrink-0"
                      />
                      <span className="flex-1" style={{ fontSize: '14px', color: '#0d0d0d' }}>{size}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div data-testid="shop-loading" className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-[#e0d8cf] border-t-[#d41c1c] rounded-full animate-spin" />
                <p className="mt-4" style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Loading...', 'Đang tải...')}</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20">
                <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '8px' }}>{v('Something went wrong', 'Đã có lỗi xảy ra')}</p>
                <p style={{ fontSize: '14px', color: '#4a4a4a', marginBottom: '24px' }}>{error}</p>
                <button
                  onClick={() => fetchProducts()}
                  className="px-6 py-3 bg-[#0d0d0d] text-white transition-colors hover:bg-[#d41c1c]"
                  style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
                >
                  {v('Retry', 'Thử lại')}
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Search className="w-16 h-16 text-[#e0d8cf] mb-4" />
                <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '8px' }}>{v('No products found', 'Không tìm thấy sản phẩm')}</p>
                <p style={{ fontSize: '14px', color: '#4a4a4a', marginBottom: '24px' }}>{v('Try adjusting your filters', 'Hãy thử điều chỉnh bộ lọc')}</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-[#0d0d0d] text-white transition-colors hover:bg-[#d41c1c]"
                  style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
                >
                  {v('Clear All Filters', 'Xóa tất cả bộ lọc')}
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4" style={{ gap: '20px', rowGap: '32px' }}>
                {products.map(product => (
                  <ProductGridCard
                    key={product.id}
                    product={product}
                    inWishlist={isInWishlist(product.id)}
                    onToggleWishlist={() => toggle(product.id)}
                    wishlistPending={isPending(product.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map(product => (
                  <ProductListCard
                    key={product.id}
                    product={product}
                    inWishlist={isInWishlist(product.id)}
                    onToggleWishlist={() => toggle(product.id)}
                    wishlistPending={isPending(product.id)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10 mb-16">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => { setCurrentPage(page); window.scrollTo(0, 0); }}
                    className={`w-10 h-10 flex items-center justify-center transition-colors ${
                      currentPage === page ? 'bg-[#d41c1c] text-white' : 'hover:bg-[#f3f0eb]'
                    }`}
                    style={{ borderRadius: '4px', fontSize: '14px' }}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#f3f0eb]"
      style={{ borderRadius: '9999px', fontSize: '12px', color: '#0d0d0d' }}
    >
      {label}
      <button onClick={onRemove} className="hover:text-[#E7000B] transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="pb-3 pt-3" style={{ borderBottom: '1px solid #e0d8cf' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between mb-2"
      >
        <span style={{ fontSize: '13px', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</span>
        <ChevronDown className={`w-4 h-4 text-[#666] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="space-y-0">{children}</div>}
    </div>
  );
}

function priceDisplay(product: ProductSummary): string {
  if (product.max_price > product.min_price) {
    return `${formatVND(product.min_price)} - ${formatVND(product.max_price)}`;
  }
  return formatVND(product.min_price);
}

function ProductGridCard({
  product,
  inWishlist,
  onToggleWishlist,
  wishlistPending,
}: {
  product: ProductSummary;
  inWishlist: boolean;
  onToggleWishlist: () => void;
  wishlistPending?: boolean;
}) {
  const { v } = useLanguage();
  return (
    <div className="group">
      <div className="relative">
        <Link to={`/product/${product.id}`}>
          <div className="relative overflow-hidden bg-white" style={{ borderRadius: '0', aspectRatio: '3/4' }}>
            <ImageWithFallback
              src={product.primary_image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {!product.in_stock && (
              <span
                className="absolute top-3 left-3 px-2.5 py-1"
                style={{ backgroundColor: '#4a4a4a', color: '#FFFFFF', fontSize: '12px', fontWeight: 700, borderRadius: '3px' }}
              >
                {v('Out of stock', 'Hết hàng')}
              </span>
            )}
          </div>
        </Link>
        <div className="absolute top-3 right-3">
          <WishlistHeartButton active={inWishlist} onToggle={onToggleWishlist} pending={wishlistPending} />
        </div>
      </div>

      <Link to={`/product/${product.id}`}>
        <p className="line-clamp-2 hover:underline" style={{ fontSize: '14px', color: '#222', lineHeight: 1.4, marginTop: '10px', marginBottom: '4px', fontWeight: 400 }}>
          {product.name}
        </p>
      </Link>
      <p style={{ fontSize: '13px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.2px', marginBottom: '6px', fontWeight: 400 }}>
        {product.brand_name}
      </p>
      <p style={{ fontSize: '15px', color: '#222', fontWeight: 500 }}>
        {priceDisplay(product)}
      </p>
    </div>
  );
}

function ProductListCard({
  product,
  inWishlist,
  onToggleWishlist,
  wishlistPending,
}: {
  product: ProductSummary;
  inWishlist: boolean;
  onToggleWishlist: () => void;
  wishlistPending?: boolean;
}) {
  const { v } = useLanguage();
  return (
    <div
      className="flex gap-4 p-4 bg-white border-2 border-[#e0d8cf] hover:shadow-md transition-shadow"
      style={{ borderRadius: '10px' }}
    >
      <Link to={`/product/${product.id}`} className="flex-shrink-0">
        <div className="relative w-32 h-40 overflow-hidden bg-[#f3f0eb]" style={{ borderRadius: '4px' }}>
          <ImageWithFallback src={product.primary_image} alt={product.name} className="w-full h-full object-cover" />
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p style={{ fontSize: '12px', color: '#4a4a4a', marginBottom: '4px' }}>{product.brand_name}</p>
          <WishlistHeartButton
            active={inWishlist}
            onToggle={onToggleWishlist}
            pending={wishlistPending}
            className="p-1.5 -mt-1 -mr-1 hover:bg-[#f3f0eb] rounded-full transition-colors flex-shrink-0"
          />
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="hover:underline" style={{ fontSize: '16px', fontWeight: 600, color: '#0d0d0d', marginBottom: '8px' }}>{product.name}</h3>
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#0d0d0d' }}>
            {priceDisplay(product)}
          </span>
        </div>
        {!product.in_stock && (
          <span style={{ fontSize: '12px', color: '#4a4a4a' }}>{v('Out of stock', 'Hết hàng')}</span>
        )}
      </div>
    </div>
  );
}
