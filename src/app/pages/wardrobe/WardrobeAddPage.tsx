import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Search, Plus, Check, Upload, Package } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { orders } from '@/app/data/accountMockData';
import { wardrobeItems } from '@/app/data/wardrobeMockData';
import { categoryVi } from '@/app/data/mockData';
import { useLanguage } from '@/app/i18n/LanguageContext';

const CATEGORIES = ['tops', 'bottoms', 'outerwear', 'dresses', 'shoes', 'bags', 'accessories'];

export function WardrobeAddPage() {
  const navigate = useNavigate();
  const { v, lang } = useLanguage();
  const [tab, setTab] = useState<'orders' | 'manual'>('orders');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [manualForm, setManualForm] = useState({ name: '', category: '', color: '', size: '', brand: '' });

  // Items from delivered orders that aren't already in wardrobe
  const existingIds = new Set(wardrobeItems.map(w => w.productId));
  const deliveredItems = orders
    .filter(o => o.status === 'delivered')
    .flatMap(o => o.items.map(i => ({ ...i, orderId: o.id, orderNumber: o.orderNumber, orderDate: o.date })))
    .filter(i => !existingIds.has(i.id));

  const filteredItems = deliveredItems.filter(i =>
    !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.brand.toLowerCase().includes(search.toLowerCase())
  );

  const toggleItem = (id: number) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleAddFromOrders = () => {
    alert(v(`Added ${selectedItems.length} items to your wardrobe!`, `Đã thêm ${selectedItems.length} món vào tủ đồ!`));
    navigate('/account/wardrobe');
  };

  const handleAddManual = () => {
    alert(v(`Added "${manualForm.name}" to your wardrobe!`, `Đã thêm "${manualForm.name}" vào tủ đồ!`));
    navigate('/account/wardrobe');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Link to="/account/wardrobe" className="inline-flex items-center gap-2 mb-6 hover:gap-3 transition-all" style={{ fontSize: '12px', fontWeight: 600, color: '#d41c1c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <ArrowLeft className="w-4 h-4" />{v('Back to Wardrobe', 'Quay lại tủ đồ')}
        </Link>

        <h1 style={{ fontSize: '28px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', letterSpacing: '0.05em', textTransform: 'uppercase' as const, marginBottom: '8px' }}>{v('Add to Wardrobe', 'Thêm vào tủ đồ')}</h1>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '24px' }}>{v('Add items from your orders or enter them manually', 'Thêm đồ từ đơn hàng hoặc nhập thủ công')}</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('orders')}
            className={`flex items-center gap-2 px-5 py-2.5 transition-colors ${tab === 'orders' ? 'bg-[#d41c1c] text-white' : 'bg-white border border-[#e0d8cf] text-[#4a4a4a] hover:bg-[#f3f0eb]'}`}
            style={{ borderRadius: '10px', fontSize: '13px', fontWeight: tab === 'orders' ? 600 : 400, letterSpacing: '0.03em' }}
          >
            <Package className="w-4 h-4" />{v('From Orders', 'Từ đơn hàng')}
          </button>
          <button
            onClick={() => setTab('manual')}
            className={`flex items-center gap-2 px-5 py-2.5 transition-colors ${tab === 'manual' ? 'bg-[#d41c1c] text-white' : 'bg-white border border-[#e0d8cf] text-[#4a4a4a] hover:bg-[#f3f0eb]'}`}
            style={{ borderRadius: '10px', fontSize: '13px', fontWeight: tab === 'manual' ? 600 : 400, letterSpacing: '0.03em' }}
          >
            <Plus className="w-4 h-4" />{v('Manual Entry', 'Nhập thủ công')}
          </button>
        </div>

        {tab === 'orders' ? (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888]" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={v('Search delivered items...', 'Tìm sản phẩm đã giao...')}
                className="w-full pl-11 pr-4 py-3 border border-[#e0d8cf] bg-[#fff9f2] focus:border-[#d41c1c] focus:outline-none transition-colors"
                style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Montserrat', sans-serif" }}
              />
            </div>

            {filteredItems.length === 0 ? (
              <div className="text-center py-12 bg-white" style={{ borderRadius: '10px', border: '1px solid #e0d8cf' }}>
                <Package className="w-12 h-12 mx-auto text-[#e0d8cf] mb-3" />
                <p style={{ fontSize: '16px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', marginBottom: '4px', textTransform: 'uppercase' as const }}>{v('All items already added', 'Đã thêm tất cả sản phẩm')}</p>
                <p style={{ fontSize: '14px', color: '#888' }}>{v('All delivered items are already in your wardrobe', 'Tất cả sản phẩm đã giao đều đã có trong tủ đồ')}</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {filteredItems.map(item => {
                    const isSelected = selectedItems.includes(item.id);
                    return (
                      <label
                        key={`${item.id}-${item.orderId}`}
                        className={`flex items-center gap-4 p-4 bg-white cursor-pointer border-2 transition-colors ${isSelected ? 'border-[#d41c1c]' : 'border-transparent hover:border-[#e0d8cf]'}`}
                        style={{ borderRadius: '10px', border: '1px solid #e0d8cf', boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)' }}
                      >
                        <input type="checkbox" checked={isSelected} onChange={() => toggleItem(item.id)} className="sr-only" />
                        <div className={`w-6 h-6 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'bg-[#d41c1c]' : 'border-2 border-[#e0d8cf]'}`} style={{ borderRadius: '4px' }}>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <div className="w-16 h-16 flex-shrink-0 overflow-hidden" style={{ borderRadius: '4px', backgroundColor: '#f3f0eb' }}>
                          <ImageWithFallback src={item.image} alt={v(item.name, item.nameVi)} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate" style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{v(item.name, item.nameVi)}</p>
                          <p style={{ fontSize: '12px', color: '#888' }}>{item.brand} · {v(item.color, item.colorVi)} · {v('Size', 'Size')} {item.size}</p>
                          <p style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                            {v('Order', 'Đơn hàng')} {item.orderNumber} · {new Date(item.orderDate).toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {selectedItems.length > 0 && (
                  <div className="sticky bottom-4">
                    <button
                      onClick={handleAddFromOrders}
                      className="w-full py-3.5 bg-[#d41c1c] text-white hover:bg-[#b01818] transition-colors"
                      style={{ borderRadius: '10px', fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', boxShadow: '0px 10px 15px rgba(212,28,28,0.2)', border: '2px solid #d41c1c' }}
                    >
                      {v(`Add ${selectedItems.length} item${selectedItems.length > 1 ? 's' : ''} to Wardrobe`, `Thêm ${selectedItems.length} món vào tủ đồ`)}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          /* Manual Entry */
          <div className="bg-white p-6 space-y-4" style={{ borderRadius: '10px', border: '1px solid #e0d8cf', boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)' }}>
            {/* Photo Upload */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>{v('Photo', 'Ảnh')}</label>
              <div className="border-2 border-dashed border-[#e0d8cf] p-8 text-center cursor-pointer hover:border-[#e2b93b] transition-colors" style={{ borderRadius: '10px' }}>
                <Upload className="w-8 h-8 mx-auto text-[#888] mb-2" />
                <p style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Upload a photo of your item', 'Tải ảnh sản phẩm lên')}</p>
                <p style={{ fontSize: '12px', color: '#888' }}>{v('JPG, PNG up to 5MB', 'JPG, PNG tối đa 5MB')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>{v('Item Name *', 'Tên sản phẩm *')}</label>
                <input
                  type="text"
                  value={manualForm.name}
                  onChange={e => setManualForm({ ...manualForm, name: e.target.value })}
                  placeholder={v('e.g. Black Leather Jacket', 'VD: Áo khoác da đen')}
                  className="w-full px-4 py-2.5 border border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors"
                  style={{ borderRadius: '10px', fontSize: '14px', backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>{v('Category *', 'Danh mục *')}</label>
                <select
                  value={manualForm.category}
                  onChange={e => setManualForm({ ...manualForm, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#e0d8cf] bg-[#fff9f2] focus:border-[#d41c1c] focus:outline-none transition-colors appearance-none cursor-pointer capitalize"
                  style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Montserrat', sans-serif" }}
                >
                  <option value="">{v('Select category', 'Chọn danh mục')}</option>
                  {CATEGORIES.map(c => <option key={c} value={c} className="capitalize">{v(c, categoryVi(c))}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>{v('Brand', 'Thương hiệu')}</label>
                <input
                  type="text"
                  value={manualForm.brand}
                  onChange={e => setManualForm({ ...manualForm, brand: e.target.value })}
                  placeholder={v('e.g. URBAN STUDIO', 'VD: URBAN STUDIO')}
                  className="w-full px-4 py-2.5 border border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors"
                  style={{ borderRadius: '10px', fontSize: '14px', backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>{v('Color', 'Màu sắc')}</label>
                <input
                  type="text"
                  value={manualForm.color}
                  onChange={e => setManualForm({ ...manualForm, color: e.target.value })}
                  placeholder={v('e.g. Black', 'VD: Đen')}
                  className="w-full px-4 py-2.5 border border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors"
                  style={{ borderRadius: '10px', fontSize: '14px', backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>{v('Size', 'Size')}</label>
                <input
                  type="text"
                  value={manualForm.size}
                  onChange={e => setManualForm({ ...manualForm, size: e.target.value })}
                  placeholder={v('e.g. M', 'VD: M')}
                  className="w-full px-4 py-2.5 border border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors"
                  style={{ borderRadius: '10px', fontSize: '14px', backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>
            </div>

            <button
              onClick={handleAddManual}
              disabled={!manualForm.name || !manualForm.category}
              className="w-full py-3.5 bg-[#d41c1c] text-white hover:bg-[#b01818] transition-colors disabled:bg-[#e0d8cf] disabled:cursor-not-allowed"
              style={{ borderRadius: '10px', fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', border: '2px solid transparent' }}
            >
              {v('Add to Wardrobe', 'Thêm vào tủ đồ')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}