import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { Search, MapPin, Star, ChevronRight, BadgeCheck, Users } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { brands, locationVi, styleVi } from '@/app/data/mockData';
import { useLanguage } from '@/app/i18n/LanguageContext';

export function AllBrandsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'verified'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'az'>('popular');
  const { v } = useLanguage();

  const filteredBrands = useMemo(() => {
    let result = [...brands];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b =>
        b.name.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q) ||
        b.styles.some(s => s.toLowerCase().includes(q))
      );
    }
    if (selectedFilter === 'verified') {
      result = result.filter(b => b.verified);
    }
    switch (sortBy) {
      case 'popular': result.sort((a, b) => b.followers - a.followers); break;
      case 'newest': result.sort((a, b) => parseInt(b.founded) - parseInt(a.founded)); break;
      case 'az': result.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return result;
  }, [searchQuery, selectedFilter, sortBy]);

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

        {/* Search & Filters */}
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
            <div className="flex border-2 border-[#e0d8cf]" style={{ borderRadius: '10px' }}>
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-4 py-2.5 transition-colors ${selectedFilter === 'all' ? 'bg-[#d41c1c] text-white' : 'text-[#4a4a4a] hover:bg-[#f3f0eb]'}`}
                style={{ borderRadius: '8px 0 0 8px', fontSize: '14px' }}
              >
                {v('All', 'Tất cả')}
              </button>
              <button
                onClick={() => setSelectedFilter('verified')}
                className={`px-4 py-2.5 flex items-center gap-1.5 transition-colors ${selectedFilter === 'verified' ? 'bg-[#d41c1c] text-white' : 'text-[#4a4a4a] hover:bg-[#f3f0eb]'}`}
                style={{ borderRadius: '0 8px 8px 0', fontSize: '14px' }}
              >
                <BadgeCheck className="w-4 h-4" />
                {v('Verified', 'Xác thực')}
              </button>
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="appearance-none px-4 py-2.5 border-2 border-[#e0d8cf] bg-white cursor-pointer"
              style={{ borderRadius: '10px', fontSize: '14px' }}
            >
              <option value="popular">{v('Most Popular', 'Phổ biến nhất')}</option>
              <option value="newest">{v('Newest', 'Mới nhất')}</option>
              <option value="az">A - Z</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: v('Total Brands', 'Tổng thương hiệu'), value: brands.length.toString() },
            { label: v('Verified Brands', 'Đã xác thực'), value: brands.filter(b => b.verified).length.toString() },
            { label: v('Total Products', 'Tổng sản phẩm'), value: brands.reduce((a, b) => a + b.productCount, 0).toLocaleString() },
            { label: v('Total Followers', 'Tổng người theo dõi'), value: (brands.reduce((a, b) => a + b.followers, 0) / 1000).toFixed(1) + 'k' },
          ].map(stat => (
            <div key={stat.label} className="p-4 bg-[#fff9f2]" style={{ borderRadius: '10px', border: '2px solid #e0d8cf' }}>
              <p style={{ fontSize: '24px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d' }}>{stat.value}</p>
              <p style={{ fontSize: '12px', color: '#4a4a4a' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map(brand => (
            <Link
              key={brand.id}
              to={`/brands/${brand.slug}`}
              className="group border-2 border-[#e0d8cf] overflow-hidden hover:shadow-lg transition-shadow"
              style={{ borderRadius: '10px' }}
            >
              {/* Banner */}
              <div className="relative h-40 overflow-hidden">
                <ImageWithFallback
                  src={brand.banner}
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <div className="flex items-center gap-3">
                    <ImageWithFallback
                      src={brand.logo}
                      alt={brand.name}
                      className="w-12 h-12 rounded-full border-2 border-white object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>{brand.name}</h3>
                        {brand.verified && <BadgeCheck className="w-4 h-4 text-blue-400" />}
                      </div>
                      <div className="flex items-center gap-1" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                        <MapPin className="w-3 h-3" />
                        {v(brand.location, locationVi(brand.location))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="line-clamp-2 mb-4" style={{ fontSize: '14px', color: '#4a4a4a' }}>
                  {v(brand.shortDesc, brand.shortDescVi)}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {brand.styles.map(s => (
                    <span key={s} className="px-2.5 py-1 bg-[#f3f0eb] capitalize" style={{ fontSize: '11px', borderRadius: '9999px', color: '#4a4a4a' }}>
                      {v(s, styleVi(s))}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t-2 border-[#e0d8cf]">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#d41c1c] text-[#d41c1c]" />
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#0d0d0d' }}>{brand.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-[#4a4a4a]" />
                    <span style={{ fontSize: '13px', color: '#4a4a4a' }}>{(brand.followers / 1000).toFixed(1)}k</span>
                  </div>
                  <span style={{ fontSize: '13px', color: '#4a4a4a' }}>{brand.productCount} {v('products', 'sản phẩm')}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredBrands.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 mx-auto text-[#e0d8cf] mb-4" />
            <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '8px' }}>{v('No brands found', 'Không tìm thấy thương hiệu')}</p>
            <p style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Try a different search term', 'Hãy thử từ khóa khác')}</p>
          </div>
        )}
      </div>
    </div>
  );
}