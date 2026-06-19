import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Sparkles, Check, ShoppingBag, Sun, Cloud, Thermometer, Heart, Filter, Star } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { styleSuggestions, type StyleSuggestion } from '@/app/data/wardrobeMockData';
import { styleVi } from '@/app/data/mockData';
import { formatVnd } from '@/app/utils/currency';
import { useLanguage } from '@/app/i18n/LanguageContext';

const OCCASIONS_DATA = [
  { en: 'All', vi: 'Tất cả' },
  { en: 'Casual', vi: 'Thường ngày' },
  { en: 'Date Night', vi: 'Hẹn hò tối' },
  { en: 'Brunch', vi: 'Brunch' },
  { en: 'City Walk', vi: 'Dạo phố' },
  { en: 'Shopping', vi: 'Mua sắm' },
  { en: 'Work', vi: 'Công sở' },
];

const weatherIcons: Record<string, any> = {
  Warm: Sun,
  Sunny: Sun,
  Cool: Cloud,
  Mild: Thermometer,
  Any: Star,
};

export function StyleSuggestionsPage() {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<StyleSuggestion[]>(styleSuggestions);
  const [occasion, setOccasion] = useState('All');
  const [showOwned, setShowOwned] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const { v, lang } = useLanguage();

  const toggleSave = (id: number) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = suggestions.filter(s => {
    if (occasion !== 'All' && s.occasion !== occasion) return false;
    if (showOwned && s.items.some(i => !i.owned)) return false;
    return true;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
      <div className="mx-auto px-6 lg:px-12 py-6 sm:py-8" style={{ maxWidth: 'calc(75% + 320px)' }}>
        <Link to="/account/wardrobe" className="inline-flex items-center gap-2 mb-6 hover:gap-3 transition-all" style={{ fontSize: '12px', fontWeight: 600, color: '#d41c1c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <ArrowLeft className="w-4 h-4" />{v('Back to Wardrobe', 'Quay lại tủ đồ')}
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-6 h-6" style={{ color: '#e2b93b' }} />
              <h1 style={{ fontSize: '28px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>{v('Style Suggestions', 'Gợi ý phong cách')}</h1>
            </div>
            <p style={{ fontSize: '14px', color: '#888' }}>{v('AI-powered outfit ideas based on your wardrobe', 'Gợi ý trang phục AI dựa trên tủ đồ của bạn')}</p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={showOwned} onChange={() => setShowOwned(!showOwned)} className="w-4 h-4 accent-[#d41c1c]" />
            <span style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Only items I own', 'Chỉ đồ tôi có')}</span>
          </label>
        </div>

        {/* Occasion Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {OCCASIONS_DATA.map(o => (
            <button key={o.en} onClick={() => setOccasion(o.en)}
              className={`flex-shrink-0 px-4 py-2 transition-colors ${occasion === o.en ? 'bg-[#d41c1c] text-white' : 'bg-white border border-[#e0d8cf] text-[#4a4a4a] hover:bg-[#f3f0eb]'}`}
              style={{ borderRadius: '10px', fontSize: '13px' }}
            >
              {lang === 'vi' ? o.vi : o.en}
            </button>
          ))}
        </div>

        {/* Suggestions */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white" style={{ borderRadius: '10px', border: '1px solid #e0d8cf' }}>
            <Sparkles className="w-16 h-16 mx-auto text-[#e0d8cf] mb-4" />
            <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', marginBottom: '8px', textTransform: 'uppercase' as const }}>{v('No suggestions found', 'Không tìm thấy gợi ý')}</p>
            <p style={{ fontSize: '14px', color: '#888' }}>{v('Try adjusting your filters', 'Thử điều chỉnh bộ lọc')}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map(suggestion => {
              const ownedCount = suggestion.items.filter(i => i.owned).length;
              const totalCount = suggestion.items.length;
              const allOwned = ownedCount === totalCount;
              const WeatherIcon = suggestion.weather ? weatherIcons[suggestion.weather] || Sun : null;

              return (
                <div key={suggestion.id} className="bg-white overflow-hidden" style={{ borderRadius: '10px', border: '1px solid #e0d8cf', boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)' }}>
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-72 flex-shrink-0">
                      <ImageWithFallback src={suggestion.image} alt={v(suggestion.title, suggestion.titleVi)} className="w-full h-56 md:h-full object-cover" />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <h2 style={{ fontSize: '20px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' as const }}>{v(suggestion.title, suggestion.titleVi)}</h2>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="px-2.5 py-0.5 capitalize" style={{ fontSize: '12px', color: '#4a4a4a', borderRadius: '9999px', backgroundColor: '#f3f0eb' }}>{v(suggestion.style, styleVi(suggestion.style))}</span>
                            <span className="px-2.5 py-0.5" style={{ fontSize: '12px', color: '#4a4a4a', borderRadius: '9999px', backgroundColor: '#f3f0eb' }}>{v(suggestion.occasion, suggestion.occasionVi)}</span>
                            {WeatherIcon && suggestion.weather && (
                              <span className="flex items-center gap-1 px-2.5 py-0.5" style={{ fontSize: '12px', color: '#8B6914', borderRadius: '9999px', backgroundColor: '#FAF0DC' }}>
                                <WeatherIcon className="w-3 h-3" />{v(suggestion.weather, suggestion.weatherVi ?? suggestion.weather)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0 w-14 h-14 rounded-full flex flex-col items-center justify-center" style={{ backgroundColor: suggestion.matchScore >= 90 ? '#E8F5E8' : suggestion.matchScore >= 80 ? '#FAF0DC' : '#F5E8E8' }}>
                          <span style={{ fontSize: '16px', fontWeight: 600, color: suggestion.matchScore >= 90 ? '#2D6A2D' : suggestion.matchScore >= 80 ? '#8B6914' : '#d41c1c' }}>{suggestion.matchScore}</span>
                          <span style={{ fontSize: '8px', color: '#888' }}>{v('match', 'phù hợp')}</span>
                        </div>
                      </div>

                      <p style={{ fontSize: '14px', color: '#4a4a4a', lineHeight: '1.6', marginBottom: '16px' }}>{v(suggestion.description, suggestion.descriptionVi)}</p>

                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {suggestion.items.map(item => (
                          <Link key={item.id} to={`/product/${item.id}`} className="flex items-center gap-2.5 px-3 py-2 hover:bg-[#e0d8cf] transition-colors flex-shrink-0" style={{ borderRadius: '10px', backgroundColor: '#f3f0eb' }}>
                            <div className="relative">
                              <ImageWithFallback src={item.image} alt={v(item.name, item.nameVi)} className="w-10 h-10 object-cover" style={{ borderRadius: '4px' } as any} />
                              {item.owned && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#e2b93b' }}>
                                  <Check className="w-2.5 h-2.5 text-white" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="line-clamp-1" style={{ fontSize: '12px', fontWeight: 600, color: '#0d0d0d' }}>{v(item.name, item.nameVi)}</p>
                              <p style={{ fontSize: '11px', color: item.owned ? '#e2b93b' : '#d41c1c' }}>
                                {item.owned ? v('In wardrobe', 'Trong tủ đồ') : formatVnd(item.price)}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid #e0d8cf' }}>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1" style={{ fontSize: '12px', fontWeight: 600, color: allOwned ? '#2D6A2D' : '#4a4a4a', backgroundColor: allOwned ? '#E8F5E8' : '#f3f0eb', borderRadius: '9999px' }}>
                            {v(`${ownedCount}/${totalCount} items owned`, `${ownedCount}/${totalCount} món đã có`)}
                          </span>
                          {!allOwned && (
                            <span style={{ fontSize: '12px', color: '#d41c1c' }}>
                              {v(`Need ${formatVnd(suggestion.items.filter(i => !i.owned).reduce((s, i) => s + i.price, 0))} more`, `Cần thêm ${formatVnd(suggestion.items.filter(i => !i.owned).reduce((s, i) => s + i.price, 0))}`)}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {!allOwned && (
                            <Link to="/shop" className="flex items-center gap-1 px-3 py-1.5 border border-[#e0d8cf] hover:bg-[#f3f0eb] transition-colors" style={{ borderRadius: '10px', fontSize: '12px', color: '#4a4a4a' }}>
                              <ShoppingBag className="w-3 h-3" />{v('Shop missing', 'Mua đồ thiếu')}
                            </Link>
                          )}
                          <button
                            onClick={() => toggleSave(suggestion.id)}
                            className={`flex items-center gap-1 px-3 py-1.5 transition-colors ${savedIds.has(suggestion.id) ? 'bg-[#d41c1c] text-white' : 'bg-[#d41c1c] text-white hover:bg-[#b01818]'}`}
                            style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600 }}
                          >
                            <Heart className={`w-3 h-3 ${savedIds.has(suggestion.id) ? 'fill-white' : ''}`} />{savedIds.has(suggestion.id) ? v('Saved', 'Đã lưu') : v('Save', 'Lưu')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}