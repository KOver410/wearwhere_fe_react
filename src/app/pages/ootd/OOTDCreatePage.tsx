import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft, Upload, X, Plus, Image as ImageIcon, Tag, MapPin } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { products as allProducts, STYLES } from '@/app/data/mockData';
import { formatVnd } from '@/app/utils/currency';
import { useLanguage } from '@/app/i18n/LanguageContext';

export function OOTDCreatePage() {
  const navigate = useNavigate();
  const { v, lang } = useLanguage();
  const [caption, setCaption] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const addTag = () => {
    const tag = tagInput.trim().replace('#', '');
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag));

  const toggleProduct = (id: number) => {
    setSelectedProducts(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const filteredProducts = allProducts.filter(p =>
    !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.brand.toLowerCase().includes(productSearch.toLowerCase())
  );

  const handleSubmit = () => {
    alert(v('OOTD posted successfully!', 'Đăng OOTD thành công!'));
    navigate('/ootd');
  };

  const simulateUpload = () => {
    setImagePreview('https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Link to="/ootd" className="inline-flex items-center gap-2 mb-6 hover:gap-3 transition-all" style={{ fontSize: '12px', fontWeight: 600, color: '#d41c1c', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <ArrowLeft className="w-4 h-4" />{v('Back to Feed', 'Quay lại bảng tin')}
        </Link>

        <h1 style={{ fontSize: '28px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', letterSpacing: '0.05em', textTransform: 'uppercase' as const, marginBottom: '8px' }}>{v('Share Your OOTD', 'Chia sẻ OOTD của bạn')}</h1>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '32px' }}>{v('Show off your outfit and inspire the community', 'Khoe trang phục và truyền cảm hứng cho cộng đồng')}</p>

        <div className="space-y-6">
          {/* Image Upload */}
          <div className="bg-white p-6" style={{ borderRadius: '10px', border: '1px solid #e0d8cf' }}>
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="w-5 h-5" style={{ color: '#d41c1c' }} />
              <h2 style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{v('Photo', 'Ảnh')}</h2>
            </div>

            {imagePreview ? (
              <div className="relative inline-block">
                <ImageWithFallback src={imagePreview} alt="Preview" className="max-h-96 object-cover" style={{ borderRadius: '10px' } as any} />
                <button onClick={() => setImagePreview(null)} className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full text-white hover:bg-black transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={simulateUpload}
                className="w-full p-12 border-2 border-dashed border-[#e0d8cf] hover:border-[#e2b93b] transition-colors text-center cursor-pointer"
                style={{ borderRadius: '10px' }}
              >
                <Upload className="w-10 h-10 mx-auto text-[#888] mb-3" />
                <p style={{ fontSize: '16px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', marginBottom: '4px', textTransform: 'uppercase' as const }}>{v('Upload your outfit photo', 'Tải ảnh trang phục lên')}</p>
                <p style={{ fontSize: '14px', color: '#888' }}>{v('JPG, PNG up to 10MB. Recommended: portrait orientation', 'JPG, PNG tối đa 10MB. Khuyến nghị: ảnh dọc')}</p>
              </button>
            )}
          </div>

          {/* Caption */}
          <div className="bg-white p-6" style={{ borderRadius: '10px', border: '1px solid #e0d8cf' }}>
            <h2 style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', marginBottom: '16px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{v('Caption & Details', 'Mô tả & Chi tiết')}</h2>
            <textarea
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder={v('Tell us about your outfit...', 'Kể về trang phục của bạn...')}
              className="w-full px-4 py-3 border border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors resize-none"
              style={{ borderRadius: '10px', fontSize: '14px', minHeight: '120px', backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}
              maxLength={500}
            />
            <p className="text-right mt-1" style={{ fontSize: '12px', color: '#888' }}>{caption.length}/500</p>

            {/* Style */}
            <div className="mt-4">
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d', marginBottom: '8px', display: 'block' }}>{v('Style', 'Phong cách')}</label>
              <div className="flex flex-wrap gap-2">
                {STYLES.map(s => (
                  <button
                    key={s.slug}
                    onClick={() => setSelectedStyle(selectedStyle === s.slug ? '' : s.slug)}
                    className={`px-3 py-1.5 transition-colors ${
                      selectedStyle === s.slug ? 'bg-[#d41c1c] text-white' : 'border border-[#e0d8cf] hover:bg-[#f3f0eb]'
                    }`}
                    style={{ borderRadius: '10px', fontSize: '13px' }}
                  >
                    {lang === 'vi' ? s.nameVi : s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="mt-4">
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d', marginBottom: '8px', display: 'block' }}>
                <MapPin className="w-4 h-4 inline mr-1" />{v('Location (optional)', 'Vị trí (tùy chọn)')}
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder={v('e.g. Saigon, Vietnam', 'VD: Sài Gòn, Việt Nam')}
                className="w-full px-4 py-2.5 border border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors"
                style={{ borderRadius: '10px', fontSize: '14px', backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}
              />
            </div>

            {/* Tags */}
            <div className="mt-4">
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d', marginBottom: '8px', display: 'block' }}>
                <Tag className="w-4 h-4 inline mr-1" />{v('Tags', 'Thẻ')}
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-3 py-1" style={{ fontSize: '13px', borderRadius: '9999px', color: '#0d0d0d', backgroundColor: '#f3f0eb' }}>
                    #{tag}
                    <button onClick={() => removeTag(tag)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTag()}
                  placeholder={v('Add a tag...', 'Thêm thẻ...')}
                  className="flex-1 px-4 py-2.5 border border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors"
                  style={{ borderRadius: '10px', fontSize: '14px', backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}
                />
                <button onClick={addTag} className="px-4 py-2.5 hover:bg-[#e0d8cf] transition-colors" style={{ borderRadius: '10px', fontSize: '14px', backgroundColor: '#f3f0eb' }}>
                  {v('Add', 'Thêm')}
                </button>
              </div>
            </div>
          </div>

          {/* Tag Products */}
          <div className="bg-white p-6" style={{ borderRadius: '10px', border: '1px solid #e0d8cf' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{v('Tag Products', 'Gắn thẻ sản phẩm')}</h2>
              <button
                onClick={() => setShowProductPicker(!showProductPicker)}
                className="flex items-center gap-1 px-4 py-2 border border-[#e0d8cf] hover:bg-[#f3f0eb] transition-colors"
                style={{ borderRadius: '10px', fontSize: '13px', color: '#d41c1c' }}
              >
                <Plus className="w-4 h-4" />{v('Add Product', 'Thêm sản phẩm')}
              </button>
            </div>

            {/* Selected Products */}
            {selectedProducts.length > 0 && (
              <div className="space-y-2 mb-4">
                {selectedProducts.map(pid => {
                  const prod = allProducts.find(p => p.id === pid);
                  if (!prod) return null;
                  return (
                    <div key={pid} className="flex items-center gap-3 p-3" style={{ borderRadius: '10px', backgroundColor: '#f3f0eb' }}>
                      <ImageWithFallback src={prod.image} alt={v(prod.name, prod.nameVi)} className="w-12 h-12 object-cover" style={{ borderRadius: '4px' } as any} />
                      <div className="flex-1 min-w-0">
                        <p className="truncate" style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{v(prod.name, prod.nameVi)}</p>
                        <p style={{ fontSize: '12px', color: '#888' }}>{prod.brand} · {formatVnd(prod.salePrice || prod.price)}</p>
                      </div>
                      <button onClick={() => toggleProduct(pid)} className="p-1.5 hover:bg-red-50 rounded transition-colors">
                        <X className="w-4 h-4 text-[#d41c1c]" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Product Picker */}
            {showProductPicker && (
              <div className="border border-[#e0d8cf] p-4" style={{ borderRadius: '10px' }}>
                <input
                  type="text" value={productSearch} onChange={e => setProductSearch(e.target.value)}
                  placeholder={v('Search products...', 'Tìm sản phẩm...')}
                  className="w-full px-4 py-2.5 border border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors mb-3"
                  style={{ borderRadius: '10px', fontSize: '14px', backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}
                />
                <div className="max-h-60 overflow-y-auto space-y-1">
                  {filteredProducts.slice(0, 10).map(prod => (
                    <button
                      key={prod.id}
                      onClick={() => toggleProduct(prod.id)}
                      className={`w-full flex items-center gap-3 p-2 text-left transition-colors ${
                        selectedProducts.includes(prod.id) ? 'bg-[#f3f0eb]' : 'hover:bg-[#fff9f2]'
                      }`}
                      style={{ borderRadius: '10px' }}
                    >
                      <ImageWithFallback src={prod.image} alt={v(prod.name, prod.nameVi)} className="w-10 h-10 object-cover" style={{ borderRadius: '4px' } as any} />
                      <div className="flex-1 min-w-0">
                        <p className="truncate" style={{ fontSize: '13px', color: '#0d0d0d' }}>{v(prod.name, prod.nameVi)}</p>
                        <p style={{ fontSize: '12px', color: '#888' }}>{prod.brand}</p>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#0d0d0d' }}>{formatVnd(prod.salePrice || prod.price)}</span>
                      {selectedProducts.includes(prod.id) && (
                        <span className="w-5 h-5 text-white rounded-full flex items-center justify-center" style={{ fontSize: '10px', backgroundColor: '#d41c1c' }}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={!imagePreview || !caption.trim()}
              className="flex-1 py-3.5 bg-[#d41c1c] text-white hover:bg-[#b01818] transition-colors disabled:bg-[#e0d8cf] disabled:cursor-not-allowed"
              style={{ borderRadius: '10px', fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', border: '2px solid transparent' }}
            >
              {v('Post OOTD', 'Đăng OOTD')}
            </button>
            <button
              onClick={() => navigate('/ootd')}
              className="px-6 py-3.5 border-2 border-[#d41c1c] hover:bg-[#f3f0eb] transition-colors"
              style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: '#d41c1c', letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              {v('Cancel', 'Hủy')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}