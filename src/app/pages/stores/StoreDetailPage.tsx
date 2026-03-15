import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, MapPin, Phone, Mail, Clock, Star, Navigation, ExternalLink, Share2, Heart, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { stores } from '@/app/data/wardrobeMockData';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { copyToClipboard } from '@/app/utils/clipboard';

export function StoreDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const store = stores.find(s => s.slug === slug);
  const [isSaved, setIsSaved] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const { v, lang } = useLanguage();

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
        <div className="text-center">
          <p style={{ fontSize: '24px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', marginBottom: '16px', textTransform: 'uppercase' as const }}>{v('Store not found', 'Không tìm thấy cửa hàng')}</p>
          <Link to="/stores" className="px-6 py-3 bg-[#d41c1c] text-white inline-block hover:bg-[#b01818] transition-colors" style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', border: '2px solid #d41c1c' }}>
            {v('Back to Stores', 'Quay lại cửa hàng')}
          </Link>
        </div>
      </div>
    );
  }

  // Find other stores from same brand for "More Stores"
  const relatedStores = stores.filter(s => s.brandSlug === store.brandSlug && s.id !== store.id);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6" style={{ fontSize: '13px', color: '#888', letterSpacing: '0.03em' }}>
          <Link to="/" className="hover:text-[#d41c1c] transition-colors">{v('Home', 'Trang chủ')}</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/stores" className="hover:text-[#d41c1c] transition-colors">{v('Stores', 'Cửa hàng')}</Link>
          <ChevronRight className="w-3 h-3" />
          <span style={{ color: '#0d0d0d' }}>{store.name}</span>
        </nav>

        {/* Hero Image */}
        <div className="relative overflow-hidden mb-6" style={{ borderRadius: '10px', backgroundColor: '#f3f0eb' }}>
          <ImageWithFallback
            src={store.images[activeImageIdx] || store.image}
            alt={store.name}
            className="w-full h-64 sm:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className={`inline-block px-3 py-1 ${store.isOpen ? 'bg-[#2D6A2D]' : 'bg-[#d41c1c]'} text-white mb-3`} style={{ fontSize: '11px', fontWeight: 600, borderRadius: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {store.isOpen ? v('Open Now', 'Đang mở cửa') : v('Closed', 'Đóng cửa')}
            </div>
            <h1 className="text-white" style={{ fontSize: '30px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>{store.name}</h1>
            <p className="text-white/80" style={{ fontSize: '14px', marginTop: '4px' }}>{store.brandName}</p>
          </div>
          {/* Actions */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={() => setIsSaved(!isSaved)} className="p-2.5 bg-white/90 hover:bg-white rounded-full transition-colors">
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-[#E7000B] text-[#E7000B]' : 'text-[#0A0A0A]'}`} />
            </button>
            <button className="p-2.5 bg-white/90 hover:bg-white rounded-full transition-colors" onClick={() => { if (navigator.share) navigator.share({ title: store.name, url: window.location.href }); else copyToClipboard(window.location.href); }}>
              <Share2 className="w-5 h-5 text-[#0A0A0A]" />
            </button>
          </div>
          {/* Image Tabs */}
          {store.images.length > 1 && (
            <div className="absolute bottom-4 right-6 flex gap-2">
              {store.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${activeImageIdx === idx ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white p-6" style={{ borderRadius: '10px', border: '1px solid #e0d8cf', boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', marginBottom: '12px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{v('About', 'Giới thiệu')}</h2>
              <p style={{ fontSize: '14px', color: '#4a4a4a', lineHeight: '1.7' }}>{store.description}</p>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mt-4">
                {store.features.map(f => (
                  <span key={f} className="px-3 py-1.5" style={{ fontSize: '13px', color: '#4a4a4a', borderRadius: '9999px', backgroundColor: '#f3f0eb' }}>
                    {f}
                  </span>
                ))}
              </div>

              {/* Categories */}
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid #e0d8cf' }}>
                <p style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{v('Categories', 'Danh mục')}</p>
                <div className="flex flex-wrap gap-2">
                  {store.categories.map(cat => (
                    <span key={cat} className="px-3 py-1 border border-[#e0d8cf]" style={{ fontSize: '13px', color: '#0d0d0d', borderRadius: '10px' }}>
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Featured Products */}
            {store.featuredProducts.length > 0 && (
              <div className="bg-white p-6" style={{ borderRadius: '10px', border: '1px solid #e0d8cf', boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{v('Available in Store', 'Có sẵn tại cửa hàng')}</h2>
                  <Link to={`/brands/${store.brandSlug}`} className="flex items-center gap-1" style={{ fontSize: '12px', fontWeight: 600, color: '#d41c1c', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {v('View All', 'Xem tất cả')}<ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {store.featuredProducts.map(prod => (
                    <Link key={prod.id} to={`/product/${prod.id}`} className="group">
                      <div className="aspect-square overflow-hidden mb-2" style={{ borderRadius: '4px', backgroundColor: '#f3f0eb' }}>
                        <ImageWithFallback src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <p className="truncate" style={{ fontSize: '13px', fontWeight: 600, color: '#0d0d0d' }}>{prod.name}</p>
                      <p style={{ fontSize: '14px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#d41c1c' }}>${prod.price}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Map Placeholder */}
            <div className="bg-white p-6" style={{ borderRadius: '10px', border: '1px solid #e0d8cf', boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', marginBottom: '16px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{v('Location', 'Vị trí')}</h2>
              <div className="h-48 flex items-center justify-center relative overflow-hidden" style={{ borderRadius: '10px', backgroundColor: '#f3f0eb' }}>
                <div className="text-center">
                  <MapPin className="w-10 h-10 mx-auto mb-2" style={{ color: '#d41c1c' }} />
                  <p style={{ fontSize: '14px', color: '#4a4a4a' }}>{store.address}, {store.district}</p>
                  <p style={{ fontSize: '13px', color: '#888' }}>{store.city}</p>
                </div>
                {/* Grid lines to simulate map */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#0A0A0A 1px, transparent 1px), linear-gradient(90deg, #0A0A0A 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              </div>
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mt-4 px-5 py-2.5 bg-[#d41c1c] text-white hover:bg-[#b01818] transition-colors w-full justify-center" style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', border: '2px solid #d41c1c' }}>
                <Navigation className="w-4 h-4" />{v('Get Directions', 'Chỉ đường')}
              </a>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact & Hours */}
            <div className="bg-white p-6 sticky top-24" style={{ borderRadius: '10px', border: '1px solid #e0d8cf', boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)' }}>
              {/* Rating */}
              <div className="flex items-center gap-2 mb-5 pb-5" style={{ borderBottom: '1px solid #e0d8cf' }}>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`w-5 h-5 ${s <= Math.floor(store.rating) ? 'fill-[#e2b93b] text-[#e2b93b]' : 'text-[#e0d8cf]'}`} />
                  ))}
                </div>
                <span style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d' }}>{store.rating}</span>
                <span style={{ fontSize: '14px', color: '#888' }}>({store.reviewCount} {v('reviews', 'đánh giá')})</span>
              </div>

              {/* Contact */}
              <div className="space-y-4 mb-5 pb-5" style={{ borderBottom: '1px solid #e0d8cf' }}>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#e2b93b' }} />
                  <div>
                    <p style={{ fontSize: '14px', color: '#0d0d0d' }}>{store.address}</p>
                    <p style={{ fontSize: '13px', color: '#888' }}>{store.district}, {store.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 flex-shrink-0" style={{ color: '#e2b93b' }} />
                  <a href={`tel:${store.phone}`} style={{ fontSize: '14px', color: '#0d0d0d' }} className="hover:text-[#d41c1c] transition-colors">
                    {store.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 flex-shrink-0" style={{ color: '#e2b93b' }} />
                  <a href={`mailto:${store.email}`} style={{ fontSize: '14px', color: '#0d0d0d' }} className="hover:text-[#d41c1c] transition-colors">
                    {store.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Navigation className="w-5 h-5 flex-shrink-0" style={{ color: '#e2b93b' }} />
                  <span style={{ fontSize: '14px', color: '#0d0d0d' }}>{store.distance} km {v('from you', 'từ vị trí của bạn')}</span>
                </div>
              </div>

              {/* Hours */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-5 h-5" style={{ color: '#e2b93b' }} />
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{v('Opening Hours', 'Giờ mở cửa')}</p>
                </div>
                <div className="space-y-2">
                  {store.hours.map(h => (
                    <div key={h.day} className="flex justify-between">
                      <span style={{ fontSize: '14px', color: '#4a4a4a' }}>{h.day}</span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{h.open} – {h.close}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 mt-5 pt-5" style={{ borderTop: '1px solid #e0d8cf' }}>
                <a
                  href={`tel:${store.phone}`}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#d41c1c] text-white hover:bg-[#b01818] transition-colors"
                  style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', border: '2px solid #d41c1c' }}
                >
                  <Phone className="w-4 h-4" />{v('Call Store', 'Gọi cửa hàng')}
                </a>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 border-2 border-[#d41c1c] hover:bg-[#f3f0eb] transition-colors"
                  style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: '#d41c1c', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                >
                  <Navigation className="w-4 h-4" />{v('Get Directions', 'Chỉ đường')}
                </a>
              </div>
            </div>

            {/* Brand Link */}
            <Link
              to={`/brands/${store.brandSlug}`}
              className="block bg-white p-5 hover:bg-[#fff9f2] transition-colors"
              style={{ borderRadius: '10px', border: '1px solid #e0d8cf', boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ fontSize: '14px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#d41c1c', backgroundColor: '#f3f0eb', border: '1px solid #e0d8cf' }}>
                  {store.brandName.charAt(0)}
                </div>
                <div className="flex-1">
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{store.brandName}</p>
                  <p style={{ fontSize: '12px', color: '#888' }}>{v('View brand page', 'Xem trang thương hiệu')}</p>
                </div>
                <ExternalLink className="w-4 h-4" style={{ color: '#e2b93b' }} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}