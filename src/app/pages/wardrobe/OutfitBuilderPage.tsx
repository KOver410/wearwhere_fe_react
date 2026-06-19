import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowLeft, Plus, X, Save, Shuffle, ChevronDown, ChevronUp } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { wardrobeItems, type WardrobeItem } from '@/app/data/wardrobeMockData';
import { styleVi } from '@/app/data/mockData';
import { useLanguage } from '@/app/i18n/LanguageContext';

const SLOTS_DATA = [
  { key: 'tops', label: 'Top', labelVi: 'Áo', categories: ['tops'] },
  { key: 'outerwear', label: 'Layer', labelVi: 'Áo khoác', categories: ['outerwear'] },
  { key: 'bottoms', label: 'Bottom', labelVi: 'Quần', categories: ['bottoms', 'dresses'] },
  { key: 'shoes', label: 'Shoes', labelVi: 'Giày', categories: ['shoes'] },
  { key: 'bags', label: 'Bag', labelVi: 'Túi', categories: ['bags'] },
  { key: 'accessories', label: 'Accessory', labelVi: 'Phụ kiện', categories: ['accessories'] },
];

export function OutfitBuilderPage() {
  const [outfit, setOutfit] = useState<Record<string, WardrobeItem | null>>({
    tops: null, outerwear: null, bottoms: null, shoes: null, bags: null, accessories: null,
  });
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [outfitName, setOutfitName] = useState('');
  const [saved, setSaved] = useState(false);
  const { v, lang } = useLanguage();

  const assignItem = (slotKey: string, item: WardrobeItem) => {
    setOutfit(prev => ({ ...prev, [slotKey]: item }));
    setActiveSlot(null);
  };

  const removeItem = (slotKey: string) => {
    setOutfit(prev => ({ ...prev, [slotKey]: null }));
  };

  const randomize = () => {
    const newOutfit: Record<string, WardrobeItem | null> = {};
    SLOTS_DATA.forEach(slot => {
      const candidates = wardrobeItems.filter(i => slot.categories.includes(i.category));
      newOutfit[slot.key] = candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : null;
    });
    setOutfit(newOutfit);
  };

  const filledSlots = Object.values(outfit).filter(Boolean).length;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Link to="/account/wardrobe" className="inline-flex items-center gap-2 mb-6 hover:gap-3 transition-all" style={{ fontSize: '12px', fontWeight: 600, color: '#d41c1c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <ArrowLeft className="w-4 h-4" />{v('Back to Wardrobe', 'Quay lại tủ đồ')}
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 style={{ fontSize: '28px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>{v('Outfit Builder', 'Phối đồ')}</h1>
            <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>{v('Mix and match items from your wardrobe', 'Phối hợp các món đồ trong tủ của bạn')}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={randomize} className="flex items-center gap-2 px-4 py-2.5 border border-[#e0d8cf] hover:bg-[#f3f0eb] transition-colors" style={{ borderRadius: '10px', fontSize: '13px', color: '#4a4a4a' }}>
              <Shuffle className="w-4 h-4" />{v('Randomize', 'Ngẫu nhiên')}
            </button>
            <button
              onClick={handleSave}
              disabled={filledSlots < 2}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#d41c1c] text-white hover:bg-[#b01818] transition-colors disabled:bg-[#e0d8cf] disabled:cursor-not-allowed"
              style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', border: '2px solid transparent' }}
            >
              <Save className="w-4 h-4" />{saved ? v('Saved!', 'Đã lưu!') : v('Save Outfit', 'Lưu trang phục')}
            </button>
          </div>
        </div>

        {/* Outfit Name */}
        <div className="mb-6">
          <input
            type="text"
            value={outfitName}
            onChange={e => setOutfitName(e.target.value)}
            placeholder={v('Name your outfit (e.g. Weekend Casual, Date Night...)', 'Đặt tên trang phục (VD: Cuối tuần thoải mái, Hẹn hò tối...)')}
            className="w-full max-w-md px-4 py-3 border border-[#e0d8cf] bg-[#fff9f2] focus:border-[#d41c1c] focus:outline-none transition-colors"
            style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Montserrat', sans-serif" }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Outfit Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 sticky top-24" style={{ borderRadius: '10px', border: '1px solid #e0d8cf', boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', marginBottom: '16px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{v('Your Outfit', 'Trang phục của bạn')}</h2>
              <div className="grid grid-cols-3 gap-3">
                {SLOTS_DATA.map(slot => {
                  const item = outfit[slot.key];
                  return (
                    <div key={slot.key} className="text-center">
                      {item ? (
                        <div className="relative group">
                          <div className="aspect-square overflow-hidden mb-1" style={{ borderRadius: '4px', backgroundColor: '#f3f0eb' }}>
                            <ImageWithFallback src={item.image} alt={v(item.name, item.nameVi)} className="w-full h-full object-cover" />
                          </div>
                          <button
                            onClick={() => removeItem(slot.key)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-[#d41c1c] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => setActiveSlot(activeSlot === slot.key ? null : slot.key)}
                          className="aspect-square border-2 border-dashed border-[#e0d8cf] flex items-center justify-center cursor-pointer hover:border-[#d41c1c] transition-colors mb-1"
                          style={{ borderRadius: '4px' }}
                        >
                          <Plus className="w-5 h-5 text-[#e0d8cf]" />
                        </div>
                      )}
                      <p style={{ fontSize: '11px', color: '#888' }}>{lang === 'vi' ? slot.labelVi : slot.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Style Analysis */}
              {filledSlots >= 2 && (
                <div className="mt-6 pt-4" style={{ borderTop: '1px solid #e0d8cf' }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{v('Style Analysis', 'Phân tích phong cách')}</p>
                  <div className="space-y-2">
                    {(() => {
                      const styles = Object.values(outfit).filter(Boolean).map(i => i!.style);
                      const styleCount: Record<string, number> = {};
                      styles.forEach(s => { styleCount[s] = (styleCount[s] || 0) + 1; });
                      const dominant = Object.entries(styleCount).sort((a, b) => b[1] - a[1]);
                      const cohesion = dominant.length > 0 ? Math.round((dominant[0][1] / styles.length) * 100) : 0;
                      return (
                        <>
                          <div className="flex justify-between">
                            <span style={{ fontSize: '13px', color: '#4a4a4a' }}>{v('Dominant Style', 'Phong cách chủ đạo')}</span>
                            <span className="capitalize" style={{ fontSize: '13px', fontWeight: 600, color: '#0d0d0d' }}>{dominant[0]?.[0] ? v(dominant[0][0], styleVi(dominant[0][0])) : '—'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span style={{ fontSize: '13px', color: '#4a4a4a' }}>{v('Style Cohesion', 'Độ đồng nhất')}</span>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: cohesion >= 60 ? '#e2b93b' : '#d41c1c' }}>{cohesion}%</span>
                          </div>
                          <div className="w-full h-2 overflow-hidden" style={{ borderRadius: '9999px', backgroundColor: '#e0d8cf' }}>
                            <div className="h-full transition-all" style={{ width: `${cohesion}%`, backgroundColor: cohesion >= 60 ? '#e2b93b' : '#d41c1c', borderRadius: '9999px' }} />
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Item Picker */}
          <div className="lg:col-span-2">
            <div className="space-y-3">
              {SLOTS_DATA.map(slot => {
                const isOpen = activeSlot === slot.key;
                const candidates = wardrobeItems.filter(i => slot.categories.includes(i.category));

                return (
                  <div key={slot.key} className="bg-white overflow-hidden" style={{ borderRadius: '10px', border: '1px solid #e0d8cf' }}>
                    <button
                      onClick={() => setActiveSlot(isOpen ? null : slot.key)}
                      className="w-full flex items-center justify-between p-4 hover:bg-[#fff9f2] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: '16px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' as const }}>{lang === 'vi' ? slot.labelVi : slot.label}</span>
                        {outfit[slot.key] && (
                          <span className="px-2 py-0.5" style={{ fontSize: '11px', fontWeight: 600, color: '#e2b93b', borderRadius: '9999px', backgroundColor: '#FAF0DC', letterSpacing: '0.05em' }}>{v('Selected', 'Đã chọn')}</span>
                        )}
                        <span style={{ fontSize: '13px', color: '#888' }}>{candidates.length} {v('items', 'món')}</span>
                      </div>
                      {isOpen ? <ChevronUp className="w-5 h-5 text-[#888]" /> : <ChevronDown className="w-5 h-5 text-[#888]" />}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4" style={{ borderTop: '1px solid #e0d8cf' }}>
                        {candidates.length === 0 ? (
                          <p className="py-6 text-center" style={{ fontSize: '14px', color: '#888' }}>{v('No items in this category', 'Không có đồ trong danh mục này')}</p>
                        ) : (
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
                            {candidates.map(item => {
                              const isSelected = outfit[slot.key]?.id === item.id;
                              return (
                                <button
                                  key={item.id}
                                  onClick={() => assignItem(slot.key, item)}
                                  className={`text-left overflow-hidden border-2 transition-colors ${isSelected ? 'border-[#d41c1c]' : 'border-transparent hover:border-[#e0d8cf]'}`}
                                  style={{ borderRadius: '10px' }}
                                >
                                  <div className="aspect-square overflow-hidden" style={{ backgroundColor: '#f3f0eb' }}>
                                    <ImageWithFallback src={item.image} alt={v(item.name, item.nameVi)} className="w-full h-full object-cover" />
                                  </div>
                                  <div className="p-2">
                                    <p className="truncate" style={{ fontSize: '11px', fontWeight: 600, color: '#0d0d0d' }}>{v(item.name, item.nameVi)}</p>
                                    <p style={{ fontSize: '10px', color: '#888' }}>{v(item.color, item.colorVi)} · {item.size}</p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}