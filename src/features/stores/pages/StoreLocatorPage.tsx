import { useState } from 'react';
import { Link } from 'react-router';
import { ChevronRight, Search, MapPin, Clock, Star, Navigation, Phone, Filter, Grid3X3, Map, ExternalLink } from 'lucide-react';
import { ImageWithFallback } from '@/shared/components/figma/ImageWithFallback';
import { stores, type Store } from '@/shared/data/wardrobeMockData';
import { useLanguage } from '@/shared/i18n/LanguageContext';

export function StoreLocatorPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance');
  const { v, lang } = useLanguage();

  const allBrands = [...new Set(stores.map(s => s.brandName))];

  let filtered = stores.filter(s => {
    if (selectedBrand !== 'all' && s.brandName !== selectedBrand) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.brandName.toLowerCase().includes(q) || s.district.toLowerCase().includes(q) || s.address.toLowerCase().includes(q);
    }
    return true;
  });

  if (sortBy === 'distance') filtered = [...filtered].sort((a, b) => a.distance - b.distance);
  else filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
      <div className="mx-auto px-6 lg:px-12 py-6 sm:py-8" style={{ maxWidth: 'calc(75% + 320px)' }}>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6" style={{ fontSize: '13px', color: '#888', letterSpacing: '0.03em' }}>
          <Link to="/" className="hover:text-[#d41c1c] transition-colors">{v('Home', 'Trang chủ')}</Link>
          <ChevronRight className="w-3 h-3" />
          <span style={{ color: '#0d0d0d' }}>{v('Store Locator', 'Tìm cửa hàng')}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 style={{ fontSize: '32px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>{v('Store Locator', 'Tìm cửa hàng')}</h1>
            <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>{v(`Find fashion stores near you • ${filtered.length} stores found`, `Tìm cửa hàng thời trang gần bạn • ${filtered.length} cửa hàng`)}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border border-[#e0d8cf] overflow-hidden" style={{ borderRadius: '10px' }}>
              <button onClick={() => setViewMode('list')} className={`flex items-center gap-1 px-3 py-2 ${viewMode === 'list' ? 'bg-[#d41c1c] text-white' : 'bg-white text-[#4a4a4a]'}`}>
                <Grid3X3 className="w-4 h-4" />
                <span style={{ fontSize: '13px' }}>{v('List', 'Danh sách')}</span>
              </button>
              <button onClick={() => setViewMode('map')} className={`flex items-center gap-1 px-3 py-2 ${viewMode === 'map' ? 'bg-[#d41c1c] text-white' : 'bg-white text-[#4a4a4a]'}`}>
                <Map className="w-4 h-4" />
                <span style={{ fontSize: '13px' }}>{v('Map', 'Bản đồ')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={v('Search by store name, brand, or district...', 'Tìm theo tên cửa hàng, thương hiệu, hoặc quận...')}
              className="w-full pl-11 pr-4 py-3 border border-[#e0d8cf] bg-[#fff9f2] focus:border-[#d41c1c] focus:outline-none transition-colors"
              style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Montserrat', sans-serif" }}
            />
          </div>
          <select
            value={selectedBrand}
            onChange={e => setSelectedBrand(e.target.value)}
            className="px-4 py-3 border border-[#e0d8cf] bg-[#fff9f2] focus:border-[#d41c1c] focus:outline-none transition-colors appearance-none cursor-pointer"
            style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Montserrat', sans-serif" }}
          >
            <option value="all">{v('All Brands', 'Tất cả thương hiệu')}</option>
            {allBrands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-4 py-3 border border-[#e0d8cf] bg-[#fff9f2] focus:border-[#d41c1c] focus:outline-none transition-colors appearance-none cursor-pointer"
            style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Montserrat', sans-serif" }}
          >
            <option value="distance">{v('Nearest First', 'Gần nhất')}</option>
            <option value="rating">{v('Highest Rated', 'Đánh giá cao nhất')}</option>
          </select>
        </div>

        {viewMode === 'map' ? (
          /* Map View (placeholder) */
          <div className="bg-white overflow-hidden" style={{ borderRadius: '10px', border: '1px solid #e0d8cf', boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)' }}>
            <div className="relative h-96 flex items-center justify-center" style={{ backgroundColor: '#f3f0eb' }}>
              <div className="text-center">
                <Map className="w-16 h-16 mx-auto text-[#e0d8cf] mb-4" />
                <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', marginBottom: '8px', textTransform: 'uppercase' as const }}>{v('Interactive Map', 'Bản đồ tương tác')}</p>
                <p style={{ fontSize: '14px', color: '#888' }}>{v('Map view would display store pins on Google Maps', 'Chế độ bản đồ sẽ hiển thị ghim cửa hàng trên Google Maps')}</p>
              </div>
              {/* Store pins overlay */}
              {filtered.map((store, idx) => (
                <Link
                  key={store.id}
                  to={`/stores/${store.slug}`}
                  className="absolute flex items-center gap-1 px-2 py-1 bg-[#d41c1c] text-white hover:bg-[#b01818] transition-colors"
                  style={{
                    borderRadius: '10px', fontSize: '11px', fontWeight: 600,
                    left: `${15 + idx * 14}%`,
                    top: `${25 + (idx % 3) * 20}%`,
                  }}
                >
                  <MapPin className="w-3 h-3" />{store.name.split(' ').slice(0, 2).join(' ')}
                </Link>
              ))}
            </div>

            {/* Store List Below Map */}
            <div className="p-4" style={{ borderTop: '1px solid #e0d8cf' }}>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {filtered.map(store => (
                  <Link
                    key={store.id}
                    to={`/stores/${store.slug}`}
                    className="flex-shrink-0 flex items-center gap-3 px-4 py-3 hover:bg-[#e0d8cf] transition-colors"
                    style={{ borderRadius: '10px', minWidth: '260px', backgroundColor: '#f3f0eb' }}
                  >
                    <ImageWithFallback src={store.image} alt={store.name} className="w-12 h-12 object-cover" style={{ borderRadius: '4px' } as any} />
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#0d0d0d' }}>{store.name}</p>
                      <p style={{ fontSize: '12px', color: '#888' }}>{store.distance} km {v('away', 'cách đây')}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* List View */
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-16 bg-white" style={{ borderRadius: '10px', border: '1px solid #e0d8cf' }}>
                <MapPin className="w-16 h-16 mx-auto text-[#e0d8cf] mb-4" />
                <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', marginBottom: '8px', textTransform: 'uppercase' as const }}>{v('No stores found', 'Không tìm thấy cửa hàng')}</p>
                <p style={{ fontSize: '14px', color: '#888' }}>{v('Try adjusting your search or filters', 'Thử điều chỉnh tìm kiếm hoặc bộ lọc')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(store => (
                  <Link
                    key={store.id}
                    to={`/stores/${store.slug}`}
                    className="bg-white overflow-hidden group"
                    style={{ borderRadius: '10px', border: '1px solid #e0d8cf', boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)' }}
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden" style={{ backgroundColor: '#f3f0eb' }}>
                      <ImageWithFallback src={store.image} alt={store.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute top-3 left-3 px-2.5 py-1 text-white" style={{ fontSize: '12px', borderRadius: '10px', backgroundColor: 'rgba(13,13,13,0.7)' }}>
                        <span className="flex items-center gap-1">
                          <Navigation className="w-3 h-3" />{store.distance} km
                        </span>
                      </div>
                      <div className={`absolute top-3 right-3 px-2.5 py-1 ${store.isOpen ? 'bg-[#2D6A2D]' : 'bg-[#d41c1c]'} text-white`} style={{ fontSize: '11px', fontWeight: 600, borderRadius: '10px', letterSpacing: '0.05em' }}>
                        {store.isOpen ? v('Open', 'Mở cửa') : v('Closed', 'Đóng cửa')}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 style={{ fontSize: '16px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' as const }}>{store.name}</h3>
                          <p style={{ fontSize: '13px', color: '#d41c1c', fontWeight: 600 }}>{store.brandName}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Star className="w-4 h-4 fill-[#e2b93b] text-[#e2b93b]" />
                          <span style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{store.rating}</span>
                          <span style={{ fontSize: '12px', color: '#888' }}>({store.reviewCount})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mb-2" style={{ fontSize: '13px', color: '#4a4a4a' }}>
                        <MapPin className="w-3.5 h-3.5" style={{ color: '#e2b93b' }} />
                        {store.address}, {store.district}
                      </div>

                      <div className="flex items-center gap-1 mb-3" style={{ fontSize: '13px', color: '#888' }}>
                        <Clock className="w-3.5 h-3.5" />
                        {store.hours[0].day}: {store.hours[0].open} – {store.hours[0].close}
                      </div>

                      {/* Categories */}
                      <div className="flex flex-wrap gap-1.5">
                        {store.categories.slice(0, 3).map(cat => (
                          <span key={cat} className="px-2 py-0.5" style={{ fontSize: '11px', color: '#4a4a4a', borderRadius: '9999px', backgroundColor: '#f3f0eb' }}>
                            {cat}
                          </span>
                        ))}
                        {store.categories.length > 3 && (
                          <span className="px-2 py-0.5" style={{ fontSize: '11px', color: '#4a4a4a', borderRadius: '9999px', backgroundColor: '#f3f0eb' }}>
                            +{store.categories.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Featured Products */}
                      {store.featuredProducts.length > 0 && (
                        <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: '1px solid #e0d8cf' }}>
                          {store.featuredProducts.slice(0, 3).map(p => (
                            <div key={p.id} className="w-12 h-12 overflow-hidden flex-shrink-0" style={{ borderRadius: '4px', backgroundColor: '#f3f0eb' }}>
                              <ImageWithFallback src={p.image} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                          ))}
                          <div className="flex items-center" style={{ fontSize: '12px', color: '#888' }}>
                            {store.featuredProducts.length} {v('items', 'sản phẩm')}
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}