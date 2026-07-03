import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Heart, HeartOff, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '@/shared/components/figma/ImageWithFallback';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { formatVND } from '@/shared/utils/currency';
import { listWishlist, removeWishlistProduct } from '@/features/account/api/wishlistApi';
import type { WishlistItem, WishlistListResponse } from '@/features/account/api/wishlistApi';

const ITEMS_PER_PAGE = 24;

export function WishlistPage() {
  const { v } = useLanguage();

  const [response, setResponse] = useState<WishlistListResponse | null>(null);
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = useCallback(() => {
    setLoading(true);
    setError(null);
    let active = true;
    listWishlist(currentPage, ITEMS_PER_PAGE)
      .then(res => {
        if (!active) return;
        setResponse(res);
        setItems(res.items);
      })
      .catch((e: unknown) => {
        if (active) setError(e instanceof Error ? e.message : v('Failed to load wishlist', 'Không tải được danh sách yêu thích'));
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    const cancel = fetchWishlist();
    return cancel;
  }, [fetchWishlist]);

  const removeFromWishlist = (productId: string) => {
    // 1) Save the prior list. 2) Optimistically remove. 3) Call BE.
    const prior = items;
    setItems(prev => prev.filter(p => p.product_id !== productId));
    removeWishlistProduct(productId).catch((e: unknown) => {
      // 4) Restore the prior list and toast on failure.
      setItems(prior);
      const message = e instanceof Error ? e.message : v('Could not remove item', 'Không thể xóa sản phẩm');
      toast.error(message);
    });
  };

  const pagination = response?.pagination;
  const totalPages = pagination?.total_pages ?? 0;

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
              {pagination?.total ?? items.length} {v('items saved', 'sản phẩm đã lưu')}
            </p>
          </div>
        </div>

        {loading ? (
          <div data-testid="wishlist-loading" className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#e0d8cf] border-t-[#d41c1c] rounded-full animate-spin" />
            <p className="mt-4" style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Loading...', 'Đang tải...')}</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '8px' }}>{v('Something went wrong', 'Đã có lỗi xảy ra')}</p>
            <p style={{ fontSize: '14px', color: '#4a4a4a', marginBottom: '24px' }}>{error}</p>
            <button
              onClick={() => fetchWishlist()}
              className="px-6 py-3 bg-[#0d0d0d] text-white transition-colors hover:bg-[#d41c1c]"
              style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
            >
              {v('Retry', 'Thử lại')}
            </button>
          </div>
        ) : items.length === 0 ? (
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
              {items.map(product => (
                <div key={product.product_id} className="group">
                  <div className="relative overflow-hidden bg-[#f3f0eb] aspect-[3/4] mb-3" style={{ borderRadius: '4px' }}>
                    <Link to={`/product/${product.product_id}`}>
                      <ImageWithFallback
                        src={product.primary_image_url}
                        alt={product.product_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    {/* Actions overlay */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        aria-label={v('Remove from wishlist', 'Xóa khỏi danh sách yêu thích')}
                        title={v('Remove from wishlist', 'Xóa khỏi danh sách yêu thích')}
                        onClick={() => removeFromWishlist(product.product_id)}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                      >
                        <Heart className="w-4 h-4 fill-[#E7000B] text-[#E7000B]" />
                      </button>
                    </div>
                  </div>
                  <p style={{ fontSize: '12px', color: '#4a4a4a', marginBottom: '2px' }}>{product.brand.name}</p>
                  <Link to={`/product/${product.product_id}`}>
                    <p className="line-clamp-2 hover:underline" style={{ fontSize: '14px', color: '#0d0d0d', marginBottom: '4px' }}>{product.product_name}</p>
                  </Link>
                  {product.min_price !== undefined && (
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: '16px', fontWeight: 700, color: '#0d0d0d' }}>
                        {formatVND(product.min_price)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

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
          </>
        )}
      </div>
    </div>
  );
}
