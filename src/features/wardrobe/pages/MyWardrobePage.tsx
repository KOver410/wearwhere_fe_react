import { useState } from 'react';
import { Link } from 'react-router';
import { ChevronRight, Heart, Plus, Search, Shirt, Sparkles, Grid3X3, LayoutList, Star, Upload } from 'lucide-react';
import { ImageWithFallback } from '@/shared/components/figma/ImageWithFallback';
import { wardrobeItems, type WardrobeItem } from '@/shared/data/wardrobeMockData';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { AccountLayout } from '@/shared/components/AccountLayout';

const CATEGORIES = [
  { key: 'all', label: 'All', labelVi: 'Tất cả', icon: Grid3X3 },
  { key: 'tops', label: 'Tops', labelVi: 'Áo', icon: Shirt },
  { key: 'bottoms', label: 'Bottoms', labelVi: 'Quần', icon: Shirt },
  { key: 'outerwear', label: 'Outerwear', labelVi: 'Áo khoác', icon: Shirt },
  { key: 'dresses', label: 'Dresses', labelVi: 'Đầm', icon: Shirt },
  { key: 'shoes', label: 'Shoes', labelVi: 'Giày', icon: Shirt },
  { key: 'bags', label: 'Bags', labelVi: 'Túi', icon: Shirt },
  { key: 'accessories', label: 'Accessories', labelVi: 'Phụ kiện', icon: Shirt },
];

export function MyWardrobePage() {
  const [items, setItems] = useState<WardrobeItem[]>(wardrobeItems);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'worn' | 'favorite'>('recent');
  const { v, lang } = useLanguage();

  const toggleFavorite = (id: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, isFavorite: !i.isFavorite } : i));
  };

  let filtered = items.filter(i => {
    if (category !== 'all' && i.category !== category) return false;
    if (search && !i.name.toLowerCase().includes(search.toLowerCase()) && !i.brand.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (sortBy === 'worn') filtered = [...filtered].sort((a, b) => b.wornCount - a.wornCount);
  if (sortBy === 'favorite') filtered = [...filtered].sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));

  const stats = {
    total: items.length,
    categories: new Set(items.map(i => i.category)).size,
    brands: new Set(items.map(i => i.brand)).size,
    favorites: items.filter(i => i.isFavorite).length,
  };

  return (
    <AccountLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 style={{ fontSize: '28px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>{v('My Wardrobe', 'Tủ đồ của tôi')}</h1>
            <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>{v('Manage your closet and discover new outfit combinations', 'Quản lý tủ đồ và khám phá cách phối đồ mới')}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/account/wardrobe/suggestions" className="flex items-center gap-2 px-5 py-2.5 border-2 border-[#d41c1c] hover:bg-[#d41c1c] hover:text-white transition-colors" style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: '#d41c1c', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              <Sparkles className="w-4 h-4" />{v('Style Suggestions', 'Gợi ý phong cách')}
            </Link>
            <Link to="/account/wardrobe/add" className="flex items-center gap-2 px-5 py-2.5 border-2 border-[#d41c1c] hover:bg-[#d41c1c] hover:text-white transition-colors" style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: '#d41c1c', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              <Upload className="w-4 h-4" />{v('Add Items', 'Thêm đồ')}
            </Link>
            <Link to="/account/wardrobe/outfit-builder" className="flex items-center gap-2 px-5 py-2.5 bg-[#d41c1c] text-white hover:bg-[#b01818] transition-colors" style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', border: '2px solid #d41c1c' }}>
              <Plus className="w-4 h-4" />{v('Build Outfit', 'Phối đồ')}
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: v('Total Items', 'Tổng đồ'), value: stats.total, color: '#0d0d0d' },
            { label: v('Categories', 'Danh mục'), value: stats.categories, color: '#d41c1c' },
            { label: v('Brands', 'Thương hiệu'), value: stats.brands, color: '#e2b93b' },
            { label: v('Favorites', 'Yêu thích'), value: stats.favorites, color: '#d41c1c' },
          ].map(s => (
            <div key={s.label} className="bg-white p-4 text-center" style={{ borderRadius: '10px', border: '1px solid #e0d8cf' }}>
              <p style={{ fontSize: '28px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: s.color }}>{s.value}</p>
              <p style={{ fontSize: '11px', color: '#888', marginTop: '2px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search + Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888]" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={v('Search items...', 'Tìm kiếm đồ...')}
              className="w-full pl-11 pr-4 py-3 border border-[#e0d8cf] bg-[#fff9f2] focus:border-[#d41c1c] focus:outline-none transition-colors"
              style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Montserrat', sans-serif" }}
            />
          </div>
          <select
            value={sortBy} onChange={e => setSortBy(e.target.value as any)}
            className="px-4 py-3 border border-[#e0d8cf] bg-[#fff9f2] focus:border-[#d41c1c] focus:outline-none transition-colors appearance-none cursor-pointer"
            style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Montserrat', sans-serif" }}
          >
            <option value="recent">{v('Recently Added', 'Mới thêm')}</option>
            <option value="worn">{v('Most Worn', 'Mặc nhiều nhất')}</option>
            <option value="favorite">{v('Favorites First', 'Yêu thích trước')}</option>
          </select>
          <div className="flex border border-[#e0d8cf] overflow-hidden" style={{ borderRadius: '10px' }}>
            <button onClick={() => setViewMode('grid')} className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-[#d41c1c] text-white' : 'bg-white text-[#4a4a4a]'}`}><Grid3X3 className="w-5 h-5" /></button>
            <button onClick={() => setViewMode('list')} className={`px-3 py-2 ${viewMode === 'list' ? 'bg-[#d41c1c] text-white' : 'bg-white text-[#4a4a4a]'}`}><LayoutList className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-2">
          {CATEGORIES.map(c => (
            <button key={c.key} onClick={() => setCategory(c.key)}
              className={`flex-shrink-0 px-4 py-2 transition-colors ${category === c.key ? 'bg-[#d41c1c] text-white' : 'bg-white border border-[#e0d8cf] text-[#4a4a4a] hover:bg-[#f3f0eb]'}`}
              style={{ borderRadius: '10px', fontSize: '13px' }}
            >
              {lang === 'vi' ? c.labelVi : c.label}
            </button>
          ))}
        </div>

        {/* Items Grid / List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white" style={{ borderRadius: '10px', border: '1px solid #e0d8cf' }}>
            <Shirt className="w-16 h-16 mx-auto text-[#e0d8cf] mb-4" />
            <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', marginBottom: '8px', textTransform: 'uppercase' as const }}>{v('No items found', 'Không tìm thấy đồ nào')}</p>
            <p style={{ fontSize: '14px', color: '#888' }}>{v('Try adjusting your filters or add new items from your orders', 'Thử điều chỉnh bộ lọc hoặc thêm đồ mới từ đơn hàng')}</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map(item => (
              <div key={item.id} className="bg-white overflow-hidden group relative" style={{ borderRadius: '10px', border: '1px solid #e0d8cf', boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)' }}>
                <button onClick={() => toggleFavorite(item.id)} className="absolute top-3 right-3 p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors z-10">
                  <Heart className={`w-4 h-4 ${item.isFavorite ? 'fill-[#d41c1c] text-[#d41c1c]' : 'text-[#4a4a4a]'}`} />
                </button>
                <Link to={`/product/${item.productId}`} className="block">
                  <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: '#f3f0eb' }}>
                    <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute bottom-3 left-3 px-2 py-0.5 text-white capitalize" style={{ fontSize: '10px', fontWeight: 600, borderRadius: '9999px', backgroundColor: 'rgba(212,28,28,0.8)', letterSpacing: '0.05em' }}>
                      {item.category}
                    </span>
                  </div>
                </Link>
                <div className="p-3">
                  <p className="truncate" style={{ fontSize: '13px', fontWeight: 600, color: '#0d0d0d' }}>{item.name}</p>
                  <p style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{item.brand}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span style={{ fontSize: '11px', color: '#888' }}>{v(`Worn ${item.wornCount}x`, `Mặc ${item.wornCount} lần`)}</span>
                    <span className="px-2 py-0.5 capitalize" style={{ fontSize: '10px', color: '#4a4a4a', borderRadius: '9999px', backgroundColor: '#f3f0eb' }}>{item.style}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(item => (
              <div key={item.id} className="bg-white p-4 flex items-center gap-4" style={{ borderRadius: '10px', border: '1px solid #e0d8cf' }}>
                <div className="w-16 h-16 flex-shrink-0 overflow-hidden" style={{ borderRadius: '4px', backgroundColor: '#f3f0eb' }}>
                  <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate" style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{item.name}</p>
                  <p style={{ fontSize: '12px', color: '#888' }}>{item.brand} · {item.color} · {v('Size', 'Size')} {item.size}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#0d0d0d' }}>{v(`Worn ${item.wornCount}x`, `Mặc ${item.wornCount} lần`)}</p>
                  <p style={{ fontSize: '11px', color: '#888' }}>{item.lastWorn ? `${v('Last:', 'Lần cuối:')} ${new Date(item.lastWorn).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', { month: 'short', day: 'numeric' })}` : v('Never worn', 'Chưa mặc')}</p>
                </div>
                <button onClick={() => toggleFavorite(item.id)} className="p-2 hover:bg-[#f3f0eb] rounded transition-colors">
                  <Heart className={`w-5 h-5 ${item.isFavorite ? 'fill-[#d41c1c] text-[#d41c1c]' : 'text-[#e0d8cf]'}`} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}