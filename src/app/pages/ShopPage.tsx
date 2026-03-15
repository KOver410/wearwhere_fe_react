import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router';
import {
  Search, SlidersHorizontal, X, ChevronDown, Heart, Grid3X3, LayoutList, ChevronRight,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import {
  products as allProducts, CATEGORIES, STYLES, COLORS, SIZES, PRICE_RANGES, SORT_OPTIONS,
} from '@/app/data/mockData';
import { useLanguage } from '@/app/i18n/LanguageContext';

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { v, lang } = useLanguage();
  const isVi = lang === 'vi';
  const urlCategory = searchParams.get('category') || '';
  const urlStyle = searchParams.get('style') || '';
  const urlSort = searchParams.get('sort') || '';

  const [showFilters, setShowFilters] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [selectedStyle, setSelectedStyle] = useState(urlStyle);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState(urlSort || 'newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());
  const [sortOpen, setSortOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const itemsPerPage = 20;

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
  useEffect(() => {
    setSelectedCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    setSelectedStyle(urlStyle);
  }, [urlStyle]);

  useEffect(() => {
    if (urlSort) setSortBy(urlSort);
  }, [urlSort]);

  const uniqueBrands = useMemo(() => [...new Set(allProducts.map(p => p.brand))], []);

  const filteredProducts = useMemo(() => {
    let result = [...allProducts];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.style.toLowerCase().includes(q)
      );
    }
    if (selectedCategory) result = result.filter(p => p.category === selectedCategory);
    if (selectedStyle) result = result.filter(p => p.style === selectedStyle);
    if (selectedColors.length > 0) result = result.filter(p => p.colors.some(c => selectedColors.includes(c)));
    if (selectedSizes.length > 0) result = result.filter(p => p.sizes.some(s => selectedSizes.includes(s)));
    if (selectedBrands.length > 0) result = result.filter(p => selectedBrands.includes(p.brand));
    if (selectedPriceRange !== null) {
      const range = PRICE_RANGES[selectedPriceRange];
      result = result.filter(p => {
        const price = p.salePrice || p.price;
        return price >= range.min && price <= range.max;
      });
    }
    switch (sortBy) {
      case 'price-low': result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price)); break;
      case 'price-high': result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price)); break;
      case 'popular': result.sort((a, b) => b.likes - a.likes); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }
    return result;
  }, [selectedCategory, selectedStyle, selectedColors, selectedSizes, selectedBrands, selectedPriceRange, sortBy, searchQuery]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeFilterCount = [
    selectedCategory, selectedStyle, selectedColors.length > 0, selectedSizes.length > 0,
    selectedPriceRange !== null, selectedBrands.length > 0,
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedStyle('');
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedPriceRange(null);
    setSelectedBrands([]);
    setCurrentPage(1);
  };

  const toggleLike = (id: number) => {
    setLikedProducts(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const toggleArrayFilter = (arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]);
    setCurrentPage(1);
  };

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
              <span style={{ color: '#0d0d0d' }} className="capitalize">{isVi ? (CATEGORIES.find(c => c.slug === selectedCategory)?.nameVi || selectedCategory) : selectedCategory}</span>
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
                onKeyDown={e => { if (e.key === 'Escape') { setSearchOpen(false); if (!searchQuery) setSearchQuery(''); } }}
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
                onClick={() => { setSearchOpen(false); if (!searchQuery) setSearchQuery(''); }}
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
              {filteredProducts.length} {isVi ? 'kết quả cho' : 'results for'} "<span style={{ color: '#d41c1c', fontWeight: 500 }}>{searchQuery}</span>"
            </p>
          )}
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05 }}>
              {selectedCategory ? (isVi ? CATEGORIES.find(c => c.slug === selectedCategory)?.nameVi : CATEGORIES.find(c => c.slug === selectedCategory)?.name) || v('Shop', 'Cửa hàng') : v('Shop All', 'Tất cả sản phẩm')}
            </h1>
            <p style={{ fontSize: '14px', color: '#4a4a4a', marginTop: '4px' }}>
              {filteredProducts.length} {v('products found', 'sản phẩm')}
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
                      onClick={() => { setSortBy(o.value); setSortOpen(false); }}
                      className={`w-full text-left py-2.5 px-4 transition-colors ${
                        sortBy === o.value ? 'bg-[#d41c1c] text-white' : 'text-[#0d0d0d] hover:bg-[#f3f0eb]'
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
              <FilterTag label={`${v('Category', 'Danh mục')}: ${isVi ? (CATEGORIES.find(c => c.slug === selectedCategory)?.nameVi || selectedCategory) : selectedCategory}`} onRemove={() => { setSelectedCategory(''); setCurrentPage(1); }} />
            )}
            {selectedStyle && (
              <FilterTag label={`${v('Style', 'Phong cách')}: ${isVi ? (STYLES.find(s => s.slug === selectedStyle)?.nameVi || selectedStyle) : selectedStyle}`} onRemove={() => { setSelectedStyle(''); setCurrentPage(1); }} />
            )}
            {selectedColors.map(c => (
              <FilterTag key={c} label={`${v('Color', 'Màu')}: ${isVi ? (COLORS.find(cl => cl.name === c)?.nameVi || c) : c}`} onRemove={() => toggleArrayFilter(selectedColors, c, setSelectedColors)} />
            ))}
            {selectedSizes.map(s => (
              <FilterTag key={s} label={`${v('Size', 'Cỡ')}: ${s}`} onRemove={() => toggleArrayFilter(selectedSizes, s, setSelectedSizes)} />
            ))}
            {selectedPriceRange !== null && (
              <FilterTag label={isVi ? PRICE_RANGES[selectedPriceRange].labelVi : PRICE_RANGES[selectedPriceRange].label} onRemove={() => { setSelectedPriceRange(null); setCurrentPage(1); }} />
            )}
            {selectedBrands.map(b => (
              <FilterTag key={b} label={b} onRemove={() => toggleArrayFilter(selectedBrands, b, setSelectedBrands)} />
            ))}
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
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.slug}
                    onClick={() => { setSelectedCategory(selectedCategory === cat.slug ? '' : cat.slug); setCurrentPage(1); }}
                    className={`w-full flex items-center justify-between py-2 px-3 transition-colors ${
                      selectedCategory === cat.slug ? 'bg-[#d41c1c] text-white' : 'hover:bg-[#f3f0eb]'
                    }`}
                    style={{ borderRadius: '4px', fontSize: '14px' }}
                  >
                    <span>{isVi ? cat.nameVi : cat.name}</span>
                    <span style={{ fontSize: '12px', opacity: 0.6 }}>{cat.count}</span>
                  </button>
                ))}
              </FilterSection>

              {/* Styles */}
              <FilterSection title={v('Style', 'Phong cách')}>
                <div className="overflow-y-auto scrollbar-hover-show" style={{ maxHeight: '240px' }}>
                {STYLES.map(style => (
                  <button
                    key={style.slug}
                    onClick={() => { setSelectedStyle(selectedStyle === style.slug ? '' : style.slug); setCurrentPage(1); }}
                    className={`w-full flex items-center justify-between py-2 px-3 transition-colors ${
                      selectedStyle === style.slug ? 'bg-[#d41c1c] text-white' : 'hover:bg-[#f3f0eb]'
                    }`}
                    style={{ borderRadius: '4px', fontSize: '14px' }}
                  >
                    <span>{isVi ? style.nameVi : style.name}</span>
                    <span style={{ fontSize: '12px', opacity: 0.6 }}>{style.count}</span>
                  </button>
                ))}
                </div>
              </FilterSection>

              {/* Price Range */}
              <FilterSection title={v('Price Range', 'Khoảng giá')}>
                <div className="space-y-1 overflow-y-auto scrollbar-hover-show" style={{ maxHeight: '240px' }}>
                  {PRICE_RANGES.map((range, idx) => {
                    const count = allProducts.filter(p => {
                      const price = p.salePrice || p.price;
                      return price >= range.min && price <= range.max;
                    }).length;
                    return (
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
                          {isVi ? range.labelVi : range.label}
                        </span>
                        <span style={{ fontSize: '12px', color: '#999' }}>({count})</span>
                      </label>
                    );
                  })}
                </div>
              </FilterSection>

              {/* Colors */}
              <FilterSection title={v('Colors', 'Màu sắc')}>
                <div className="space-y-0 overflow-y-auto scrollbar-hover-show" style={{ maxHeight: '240px' }}>
                  {COLORS.map(color => {
                    const count = allProducts.filter(p => p.colors.includes(color.name)).length;
                    return (
                      <label
                        key={color.name}
                        className={`flex items-center gap-3 py-1.5 px-1 cursor-pointer transition-colors hover:bg-[#f3f0eb] ${
                          selectedColors.includes(color.name) ? 'bg-[#fef0f0]' : ''
                        }`}
                        style={{ borderRadius: '4px' }}
                      >
                        <span
                          className="shrink-0 rounded-full"
                          style={{
                            width: '28px',
                            height: '28px',
                            backgroundColor: color.value,
                            border: color.name === 'White' ? '1px solid #ccc' : 'none',
                            boxShadow: selectedColors.includes(color.name) ? '0 0 0 2px #fff, 0 0 0 4px #d41c1c' : 'none',
                          }}
                        />
                        <span className="flex-1" style={{ fontSize: '13px', color: '#333' }}>
                          {isVi ? color.nameVi : color.name}
                        </span>
                        <span style={{ fontSize: '12px', color: '#999' }}>({count})</span>
                        <input
                          type="checkbox"
                          checked={selectedColors.includes(color.name)}
                          onChange={() => toggleArrayFilter(selectedColors, color.name, setSelectedColors)}
                          className="sr-only"
                        />
                      </label>
                    );
                  })}
                </div>
              </FilterSection>

              {/* Sizes */}
              <FilterSection title={v('Sizes', 'Kích cỡ')}>
                <div className="space-y-1 overflow-y-auto scrollbar-hover-show" style={{ maxHeight: '240px' }}>
                  {SIZES.map(size => {
                    const count = allProducts.filter(p => p.sizes.includes(size)).length;
                    return (
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
                        <span style={{ fontSize: '12px', color: '#999' }}>({count})</span>
                      </label>
                    );
                  })}
                </div>
              </FilterSection>

              {/* Brands */}
              <FilterSection title={v('Brands', 'Thương hiệu')}>
                <div className="overflow-y-auto scrollbar-hover-show" style={{ maxHeight: '240px' }}>
                {uniqueBrands.map(brand => (
                  <label key={brand} className="flex items-center gap-2 py-1.5 px-3 cursor-pointer hover:bg-[#f3f0eb]" style={{ borderRadius: '4px' }}>
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleArrayFilter(selectedBrands, brand, setSelectedBrands)}
                      className="w-4 h-4 accent-[#d41c1c]"
                    />
                    <span style={{ fontSize: '14px' }}>{brand}</span>
                  </label>
                ))}
                </div>
              </FilterSection>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {paginatedProducts.length === 0 ? (
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
                {paginatedProducts.map(product => (
                  <ProductGridCard key={product.id} product={product} isLiked={likedProducts.has(product.id)} onToggleLike={() => toggleLike(product.id)} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedProducts.map(product => (
                  <ProductListCard key={product.id} product={product} isLiked={likedProducts.has(product.id)} onToggleLike={() => toggleLike(product.id)} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
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

function ProductGridCard({ product, isLiked, onToggleLike }: { product: typeof allProducts[0]; isLiked: boolean; onToggleLike: () => void }) {
  const discount = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;
  const productColors = COLORS.filter(c => product.colors.includes(c.name));
  return (
    <div className="group">
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden bg-white" style={{ borderRadius: '0', aspectRatio: '3/4' }}>
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* "MỚI" badge — top right, green */}
          {product.isNew && (
            <span
              className="absolute top-3 right-3 px-2.5 py-1"
              style={{ backgroundColor: '#2e7d32', color: '#FFFFFF', fontSize: '12px', fontWeight: 700, borderRadius: '3px', letterSpacing: '0.3px' }}
            >
              MỚI
            </span>
          )}
          {/* Discount badge — top left */}
          {discount > 0 && (
            <span
              className="absolute top-3 left-3 px-2.5 py-1"
              style={{ backgroundColor: '#E7000B', color: '#FFFFFF', fontSize: '12px', fontWeight: 700, borderRadius: '3px' }}
            >
              -{discount}%
            </span>
          )}
          {/* Heart button on hover */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleLike(); }}
            className="absolute bottom-3 right-3 p-2 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-[#E7000B] text-[#E7000B]' : 'text-[#666]'}`} />
          </button>
        </div>
      </Link>

      {/* Color swatches */}
      {productColors.length > 0 && (
        <div className="flex items-center gap-1.5" style={{ marginTop: '10px', marginBottom: '6px' }}>
          {productColors.map(c => (
            <span
              key={c.name}
              className="rounded-full"
              style={{
                width: '14px',
                height: '14px',
                backgroundColor: c.value,
                border: c.name === 'White' ? '1px solid #ccc' : c.name === 'Black' ? '1px solid #444' : `1px solid ${c.value}`,
              }}
              title={c.name}
            />
          ))}
        </div>
      )}

      {/* Product info */}
      <Link to={`/product/${product.id}`}>
        <p className="line-clamp-2 hover:underline" style={{ fontSize: '14px', color: '#222', lineHeight: 1.4, marginTop: productColors.length === 0 ? '10px' : '0', marginBottom: '4px', fontWeight: 400 }}>
          {product.name}
        </p>
      </Link>
      <p style={{ fontSize: '13px', color: '#999', textTransform: 'uppercase', letterSpacing: '0.2px', marginBottom: '6px', fontWeight: 400 }}>
        {product.brand}
      </p>
      <p style={{ fontSize: '15px', color: '#222', fontWeight: 500 }}>
        {product.salePrice ? (
          <>
            <span style={{ color: '#E7000B' }}>
              {(product.salePrice * 25000).toLocaleString('vi-VN')}đ
            </span>
            {' '}
            <span className="line-through" style={{ fontSize: '12px', color: '#999' }}>
              {(product.price * 25000).toLocaleString('vi-VN')}đ
            </span>
          </>
        ) : (
          <span>{(product.price * 25000).toLocaleString('vi-VN')}đ</span>
        )}
      </p>
    </div>
  );
}

function ProductListCard({ product, isLiked, onToggleLike }: { product: typeof allProducts[0]; isLiked: boolean; onToggleLike: () => void }) {
  const { v } = useLanguage();
  const discount = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;
  return (
    <div
      className="flex gap-4 p-4 bg-white border-2 border-[#e0d8cf] hover:shadow-md transition-shadow"
      style={{ borderRadius: '10px' }}
    >
      <Link to={`/product/${product.id}`} className="flex-shrink-0">
        <div className="relative w-32 h-40 overflow-hidden bg-[#f3f0eb]" style={{ borderRadius: '4px' }}>
          <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
          {discount > 0 && (
            <span className="absolute top-2 left-2 px-2 py-0.5" style={{ backgroundColor: '#E7000B', color: '#FFF', fontSize: '11px', fontWeight: 700, borderRadius: '9999px' }}>
              -{discount}%
            </span>
          )}
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <p style={{ fontSize: '12px', color: '#4a4a4a', marginBottom: '4px' }}>{product.brand}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="hover:underline" style={{ fontSize: '16px', fontWeight: 600, color: '#0d0d0d', marginBottom: '8px' }}>{product.name}</h3>
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <span style={{ fontSize: '18px', fontWeight: 700, color: product.salePrice ? '#F54900' : '#0d0d0d' }}>
            ${(product.salePrice || product.price).toFixed(0)}
          </span>
          {product.salePrice && (
            <span className="line-through" style={{ fontSize: '14px', color: '#4a4a4a' }}>${product.price}</span>
          )}
        </div>
        <div className="flex items-center gap-3 mb-2">
          <span style={{ fontSize: '12px', color: '#4a4a4a' }}>{product.style}</span>
          <span style={{ fontSize: '12px', color: '#4a4a4a' }}>•</span>
          <span style={{ fontSize: '12px', color: '#4a4a4a' }}>{product.likes} {v('likes', 'lượt thích')}</span>
          <span style={{ fontSize: '12px', color: '#4a4a4a' }}>•</span>
          <span style={{ fontSize: '12px', color: '#4a4a4a' }}>★ {product.rating}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {product.sizes.slice(0, 4).map(s => (
            <span key={s} className="px-2 py-0.5 border border-[#e0d8cf]" style={{ fontSize: '11px', borderRadius: '4px' }}>{s}</span>
          ))}
        </div>
      </div>
      <button onClick={onToggleLike} className="self-start p-2 hover:bg-[#f3f0eb] transition-colors" style={{ borderRadius: '8px' }}>
        <Heart className={`w-5 h-5 ${isLiked ? 'fill-[#E7000B] text-[#E7000B]' : 'text-[#4a4a4a]'}`} />
      </button>
    </div>
  );
}