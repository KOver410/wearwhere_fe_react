import { useState } from 'react';
import { Link } from 'react-router';
import { Heart, HeartOff, ChevronRight, Trash2, ShoppingCart } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { products as allProducts } from '@/app/data/mockData';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { formatVnd } from '@/app/utils/currency';

export function WishlistPage() {
  const { v } = useLanguage();
  const [wishlist, setWishlist] = useState(allProducts.slice(0, 8).map(p => ({ ...p, addedAt: '2 days ago' })));
  const [removingId, setRemovingId] = useState<number | null>(null);

  const removeFromWishlist = (id: number) => {
    setRemovingId(id);
    setTimeout(() => {
      setWishlist(prev => prev.filter(p => p.id !== id));
      setRemovingId(null);
    }, 300);
  };

  const suggestedProducts = allProducts.slice(8, 14);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: '#fff9f2' }}>
      <div className="mx-auto px-4 lg:px-6 py-3 sm:py-4" style={{ maxWidth: 'calc(75% + 320px)' }}>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-6" style={{ fontSize: '14px', color: '#4a4a4a' }}>
          <Link to="/" className="hover:text-[#d41c1c] transition-colors">{v('Home', 'Trang chủ')}</Link>
          <ChevronRight className="w-3 h-3" />
          <span style={{ color: '#0d0d0d' }}>{v('Wishlist', 'Yêu thích')}</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05 }}>
              {v('My Wishlist', 'Yêu thích của tôi')}
            </h1>
            <p style={{ fontSize: '14px', color: '#4a4a4a', marginTop: '4px' }}>
              {wishlist.length} {v('items saved', 'sản phẩm đã lưu')}
            </p>
          </div>
          {wishlist.length > 0 && (
            <button
              className="px-4 py-2 border-2 border-[#e0d8cf] hover:bg-[#f3f0eb] transition-colors flex items-center gap-2"
              style={{ borderRadius: '10px', fontSize: '14px' }}
              onClick={() => setWishlist([])}
            >
              <Trash2 className="w-4 h-4" />
              {v('Clear All', 'Xóa tất cả')}
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-[#f3f0eb] rounded-full flex items-center justify-center mb-6">
              <HeartOff className="w-12 h-12 text-[#4a4a4a]" />
            </div>
            <p style={{ fontSize: '24px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '8px' }}>{v('Your wishlist is empty', 'Danh sách yêu thích trống')}</p>
            <p style={{ fontSize: '14px', color: '#4a4a4a', marginBottom: '32px', textAlign: 'center', maxWidth: '400px' }}>
              {v('Start browsing and save items you love!', 'Bắt đầu duyệt và lưu những sản phẩm bạn yêu thích!')}
            </p>
            <Link
              to="/shop"
              className="px-8 py-3 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors"
              style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
            >
              {v('Start Shopping', 'Bắt đầu mua sắm')}
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {wishlist.map(product => {
                const discount = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;
                return (
                  <div
                    key={product.id}
                    className={`group transition-opacity duration-300 ${removingId === product.id ? 'opacity-0' : 'opacity-100'}`}
                  >
                    <div className="relative overflow-hidden bg-[#f3f0eb] aspect-[3/4] mb-3" style={{ borderRadius: '4px' }}>
                      <Link to={`/product/${product.id}`}>
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                      {product.salePrice && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center" style={{ display: 'none' }}>
                          {/* Out of stock overlay placeholder */}
                        </div>
                      )}
                      {discount > 0 && (
                        <span className="absolute top-3 left-3 px-2.5 py-1" style={{ backgroundColor: '#E7000B', color: '#FFF', fontSize: '11px', fontWeight: 700, borderRadius: '9999px' }}>
                          -{discount}%
                        </span>
                      )}
                      {/* Actions overlay */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => removeFromWishlist(product.id)}
                          className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                        >
                          <Heart className="w-4 h-4 fill-[#E7000B] text-[#E7000B]" />
                        </button>
                        <button className="p-2 bg-white rounded-full shadow-md hover:bg-[#f3f0eb] transition-colors">
                          <ShoppingCart className="w-4 h-4 text-[#0d0d0d]" />
                        </button>
                      </div>
                    </div>
                    <p style={{ fontSize: '12px', color: '#4a4a4a', marginBottom: '2px' }}>{product.brand}</p>
                    <Link to={`/product/${product.id}`}>
                      <p className="line-clamp-2 hover:underline" style={{ fontSize: '14px', color: '#0d0d0d', marginBottom: '4px' }}>{v(product.name, product.nameVi)}</p>
                    </Link>
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: '16px', fontWeight: 700, color: product.salePrice ? '#F54900' : '#0d0d0d' }}>
                        {formatVnd(product.salePrice || product.price)}
                      </span>
                      {product.salePrice && (
                        <span className="line-through" style={{ fontSize: '13px', color: '#4a4a4a' }}>{formatVnd(product.price)}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* You Might Also Like */}
            <div className="mt-16 pt-8 border-t-2 border-[#e0d8cf]">
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '24px' }}>
                {v('You Might Also Like', 'Có thể bạn cũng thích')}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {suggestedProducts.map(product => (
                  <Link key={product.id} to={`/product/${product.id}`} className="group">
                    <div className="relative overflow-hidden bg-[#f3f0eb] aspect-[3/4] mb-2" style={{ borderRadius: '4px' }}>
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="line-clamp-1" style={{ fontSize: '13px', color: '#0d0d0d' }}>{v(product.name, product.nameVi)}</p>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#0d0d0d' }}>{formatVnd(product.salePrice || product.price)}</p>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}