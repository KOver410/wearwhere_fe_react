import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router';
import { Heart, ShoppingCart, Truck, Package, Check, Zap } from 'lucide-react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import { Button } from '@/shared/ui/button';
import { ImageWithFallback } from '@/shared/components/figma/ImageWithFallback';
import * as Tabs from '@radix-ui/react-tabs';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { useAuth } from '@/shared/contexts/AuthContext';
import { toast } from 'sonner';
import { formatVND } from '@/shared/utils/currency';
import { getProductById } from '@/features/shop/api/catalogApi';
import { addCartItem } from '@/features/account/api/cartApi';
import { notifyCartUpdated } from '@/features/account/api/cartEvents';
import { useWishlistToggle } from '@/features/account/hooks/useWishlistToggle';
import type { ProductDetail, ProductVariant } from '@/features/shop/api/contracts';

const MAX_QUANTITY = 10;

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { v } = useLanguage();
  const { isLoggedIn, promptLogin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [addingToCart, setAddingToCart] = useState(false);

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const fetchProduct = useCallback(() => {
    if (!id) return () => {};
    setLoading(true);
    setError(null);
    let active = true;
    getProductById(id)
      .then(res => {
        if (!active) return;
        setProduct(res.product);
        setSelectedImage(0);
        setSelectedColor(null);
        setSelectedSize(null);
        setQuantity(1);
      })
      .catch((e: unknown) => {
        if (active) setError(e instanceof Error ? e.message : v('Failed to load product', 'Không tải được sản phẩm'));
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const cancel = fetchProduct();
    return cancel;
  }, [fetchProduct]);

  // Sorted backend images for the gallery.
  const images = useMemo(
    () => (product ? [...product.images].sort((a, b) => a.sort_order - b.sort_order) : []),
    [product],
  );

  // Active variants only.
  const activeVariants = useMemo(
    () => (product ? product.variants.filter(vt => vt.is_active) : []),
    [product],
  );

  const colors = useMemo(() => {
    const seen = new Map<string, { color: string; color_hex?: string }>();
    for (const vt of activeVariants) {
      if (!seen.has(vt.color)) {
        seen.set(vt.color, { color: vt.color, color_hex: vt.color_hex });
      }
    }
    return [...seen.values()];
  }, [activeVariants]);

  const sizes = useMemo(() => {
    const seen = new Set<string>();
    for (const vt of activeVariants) {
      seen.add(vt.size);
    }
    return [...seen];
  }, [activeVariants]);

  // Auto-select the only color when there is exactly one.
  useEffect(() => {
    if (selectedColor === null && colors.length === 1) {
      setSelectedColor(colors[0].color);
    }
  }, [colors, selectedColor]);

  // A combination (color + size) maps to one variant.
  const variantFor = useCallback(
    (color: string | null, size: string | null): ProductVariant | undefined => {
      if (!color || !size) return undefined;
      return activeVariants.find(vt => vt.color === color && vt.size === size);
    },
    [activeVariants],
  );

  const selectedVariant = variantFor(selectedColor, selectedSize);

  // Clamp quantity to 1..min(10, stock).
  useEffect(() => {
    if (selectedVariant) {
      const max = Math.min(MAX_QUANTITY, selectedVariant.stock_qty);
      setQuantity(q => Math.min(Math.max(1, q), Math.max(1, max)));
    }
  }, [selectedVariant]);

  // Price: selected variant price, or active-variant min/max range before selection.
  const priceLabel = useMemo(() => {
    if (selectedVariant) {
      return formatVND(selectedVariant.price);
    }
    if (activeVariants.length === 0) return '';
    const prices = activeVariants.map(vt => vt.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return max > min ? `${formatVND(min)} - ${formatVND(max)}` : formatVND(min);
  }, [selectedVariant, activeVariants]);

  const isSizeAvailableForColor = (size: string): boolean => {
    if (!selectedColor) {
      // No color picked yet: a size is available if any active variant with that
      // size has stock.
      return activeVariants.some(vt => vt.size === size && vt.stock_qty > 0);
    }
    const vt = variantFor(selectedColor, size);
    return !!vt && vt.stock_qty > 0;
  };

  const isColorAvailable = (color: string): boolean =>
    activeVariants.some(vt => vt.color === color && vt.stock_qty > 0);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setSelectedSize(null);
  };

  const maxQuantity = selectedVariant ? Math.min(MAX_QUANTITY, selectedVariant.stock_qty) : MAX_QUANTITY;

  // Wishlist heart for this product. Hook runs unconditionally (before the
  // loading/error early returns); it only probes membership once a UUID exists.
  const wishlistIds = useMemo(() => (product ? [product.id] : []), [product]);
  const { isInWishlist, toggle, isPending } = useWishlistToggle(wishlistIds);
  const inWishlist = product ? isInWishlist(product.id) : false;

  // Add the selected variant to the backend cart. Requires an authenticated
  // customer and an available selected variant. Returns true on success so the
  // Buy Now flow can navigate to the cart afterwards. Never mutates local fake
  // state: on failure the backend error is surfaced and nothing is recorded.
  const addSelectedToCart = useCallback(async (): Promise<boolean> => {
    if (!isLoggedIn) {
      promptLogin(location.pathname + location.search);
      return false;
    }
    if (!selectedVariant) {
      toast.error(v('Please select size and color', 'Vui lòng chọn kích cỡ và màu sắc'));
      return false;
    }
    if (selectedVariant.stock_qty <= 0) {
      toast.error(v('This option is out of stock', 'Tùy chọn này đã hết hàng'));
      return false;
    }
    if (addingToCart) return false;

    setAddingToCart(true);
    try {
      await addCartItem(selectedVariant.id, quantity);
      notifyCartUpdated();
      toast.success(v('Added to cart', 'Đã thêm vào giỏ'));
      return true;
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : v('Could not add to cart', 'Không thể thêm vào giỏ'));
      return false;
    } finally {
      setAddingToCart(false);
    }
  }, [isLoggedIn, promptLogin, location.pathname, location.search, selectedVariant, addingToCart, quantity, v]);

  const handleAddToCart = () => {
    void addSelectedToCart();
  };

  const handleBuyNow = () => {
    void addSelectedToCart().then(ok => {
      if (ok) navigate('/cart');
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
        <div data-testid="product-loading" className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-[#e0d8cf] border-t-[#d41c1c] rounded-full animate-spin" />
          <p className="mt-4" style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Loading...', 'Đang tải...')}</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
        <div className="text-center">
          <p style={{ fontSize: '24px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '12px' }}>{v('Product not found', 'Không tìm thấy sản phẩm')}</p>
          {error && <p style={{ fontSize: '14px', color: '#4a4a4a', marginBottom: '16px' }}>{error}</p>}
          <button
            onClick={() => fetchProduct()}
            className="px-6 py-3 bg-[#0d0d0d] text-white inline-block mr-3 hover:bg-[#d41c1c] transition-colors"
            style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Oswald', sans-serif" }}
          >
            {v('Retry', 'Thử lại')}
          </button>
          <Link to="/shop" className="px-6 py-3 bg-white border-2 border-[#0d0d0d] text-[#0d0d0d] inline-block hover:bg-[#f3f0eb] transition-colors" style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Oswald', sans-serif" }}>
            {v('Browse All Products', 'Xem tất cả sản phẩm')}
          </Link>
        </div>
      </div>
    );
  }

  const galleryImage = images[selectedImage]?.url ?? images[0]?.url;
  const inStock = activeVariants.some(vt => vt.stock_qty > 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
      <div className="mx-auto px-4 lg:px-6 py-4" style={{ maxWidth: 'calc(75% + 320px)' }}>
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center gap-2 text-sm" style={{ color: '#888' }}>
            <Link to="/" className="hover:text-[#d41c1c] transition-colors">{v('Home', 'Trang chủ')}</Link>
            <span>/</span>
            <Link to={`/brands/${product.brand.slug}`} className="hover:text-[#d41c1c] transition-colors">{product.brand.name}</Link>
            <span>/</span>
            <Link to={`/shop?category=${product.category.slug}`} className="hover:text-[#d41c1c] transition-colors">{product.category.name}</Link>
            <span>/</span>
            <span style={{ color: '#0d0d0d' }}>{product.name}</span>
          </nav>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* LEFT: Image Gallery */}
          <div className="space-y-4">
            <div className="relative overflow-hidden" style={{ borderRadius: '4px', backgroundColor: '#f3f0eb' }}>
              <Zoom>
                <ImageWithFallback
                  src={galleryImage}
                  alt={product.name}
                  className="w-full aspect-square object-cover"
                />
              </Zoom>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`relative overflow-hidden transition-all ${
                      selectedImage === index ? 'ring-2 ring-[#d41c1c]' : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{ borderRadius: '4px', backgroundColor: '#f3f0eb' }}
                  >
                    <ImageWithFallback
                      src={image.url}
                      alt={image.alt_text || `${product.name} ${index + 1}`}
                      className="w-full aspect-square object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Info */}
          <div>
            <p style={{ fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              {product.brand.name}
            </p>
            <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05, marginBottom: '12px' }}>
              {product.name}
            </h1>

            {/* Style tags */}
            {product.style_tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.style_tags.map(tag => (
                  <Link
                    key={tag.id}
                    to={`/style/${tag.slug}`}
                    className="px-3 py-1 bg-[#f3f0eb] hover:bg-[#ede8e0] transition-colors"
                    style={{ fontSize: '12px', borderRadius: '9999px', color: '#4a4a4a' }}
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-8">
              <span style={{ fontSize: '32px', fontWeight: 700, color: '#0d0d0d' }}>
                {priceLabel}
              </span>
            </div>

            {/* Color Selector */}
            {colors.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>
                    {v('Color', 'Màu sắc')}: {selectedColor && <span style={{ fontWeight: 400, color: '#4a4a4a' }}>{selectedColor}</span>}
                  </label>
                </div>
                <div className="flex flex-wrap gap-3">
                  {colors.map(c => {
                    const available = isColorAvailable(c.color);
                    return (
                      <button
                        key={c.color}
                        onClick={() => available && handleColorChange(c.color)}
                        disabled={!available}
                        title={c.color}
                        aria-label={c.color}
                        className={`w-12 h-12 rounded-full border-2 transition-all ${
                          selectedColor === c.color ? 'border-[#d41c1c] scale-110' : 'border-[#e0d8cf] hover:border-[#e2b93b]'
                        } ${!available ? 'opacity-40 cursor-not-allowed' : ''}`}
                        style={{ backgroundColor: c.color_hex || '#ccc' }}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>
                    {v('Size', 'Kích cỡ')}: {selectedSize && <span style={{ fontWeight: 400, color: '#4a4a4a' }}>{selectedSize}</span>}
                  </label>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {sizes.map(size => {
                    const available = isSizeAvailableForColor(size);
                    return (
                      <button
                        key={size}
                        onClick={() => available && setSelectedSize(size)}
                        disabled={!available}
                        className={`py-3 border-2 transition-all ${
                          selectedSize === size
                            ? 'border-[#d41c1c] bg-[#d41c1c] text-white'
                            : 'border-[#e0d8cf] hover:border-[#d41c1c]'
                        } ${!available ? 'opacity-40 cursor-not-allowed line-through' : ''}`}
                        style={{
                          borderRadius: '4px',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: selectedSize === size ? '#FFFFFF' : '#0d0d0d',
                        }}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-8">
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d', marginBottom: '8px', display: 'block' }}>
                {v('Quantity', 'Số lượng')}
              </label>
              <div className="flex items-center border-2 border-[#e0d8cf] w-fit" style={{ borderRadius: '10px' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-[#fff9f2] transition-colors"
                  style={{ fontSize: '16px', fontWeight: 600, color: '#0d0d0d' }}
                >
                  -
                </button>
                <span className="px-6 py-3 border-l border-r border-[#e0d8cf]" style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                  disabled={quantity >= maxQuantity}
                  className="px-4 py-3 hover:bg-[#fff9f2] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ fontSize: '16px', fontWeight: 600, color: '#0d0d0d' }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">
              <Button
                onClick={handleAddToCart}
                disabled={addingToCart}
                aria-busy={addingToCart}
                className="flex-1 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: 'transparent',
                  color: '#d41c1c',
                  borderRadius: '10px',
                  height: '52px',
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase' as const,
                  border: '2px solid #d41c1c',
                  fontFamily: "'Oswald', sans-serif",
                }}
              >
                <ShoppingCart className="w-5 h-5" />
                {v('Add to Cart', 'Thêm vào giỏ')}
              </Button>
              <Button
                onClick={handleBuyNow}
                disabled={addingToCart}
                aria-busy={addingToCart}
                className="flex-1 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: '#0d0d0d',
                  color: '#FFFFFF',
                  borderRadius: '10px',
                  height: '52px',
                  fontSize: '13px',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase' as const,
                  fontFamily: "'Oswald', sans-serif",
                }}
              >
                <Zap className="w-5 h-5" />
                {v('Buy Now', 'Mua ngay')}
              </Button>
              <Button
                onClick={() => toggle(product.id)}
                disabled={isPending(product.id)}
                aria-busy={isPending(product.id)}
                aria-pressed={inWishlist}
                aria-label={inWishlist
                  ? v('Remove from wishlist', 'Xóa khỏi danh sách yêu thích')
                  : v('Add to wishlist', 'Thêm vào yêu thích')}
                title={inWishlist
                  ? v('Remove from wishlist', 'Xóa khỏi danh sách yêu thích')
                  : v('Add to wishlist', 'Thêm vào yêu thích')}
                style={{
                  backgroundColor: inWishlist ? '#d41c1c' : 'transparent',
                  color: inWishlist ? '#FFFFFF' : '#d41c1c',
                  borderRadius: '10px',
                  height: '52px',
                  width: '52px',
                  border: '2px solid #d41c1c',
                }}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              {inStock ? (
                <>
                  <Check className="w-5 h-5" style={{ color: '#2e7d32' }} />
                  <span style={{ fontSize: '14px', fontWeight: 400, color: '#0d0d0d' }}>
                    {v('In Stock', 'Còn hàng')}
                  </span>
                </>
              ) : (
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#d41c1c' }}>
                  {v('Out of Stock', 'Hết hàng')}
                </span>
              )}
            </div>

            {/* Quick Info */}
            <div className="space-y-3 p-4" style={{ backgroundColor: '#fff9f2', borderRadius: '10px', border: '2px solid #e0d8cf' }}>
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 mt-0.5" style={{ color: '#e2b93b' }} />
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{v('Shipping', 'Vận chuyển')}</p>
                  <p style={{ fontSize: '12px', color: '#888' }}>{v('Calculated at checkout', 'Tính khi thanh toán')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 mt-0.5" style={{ color: '#e2b93b' }} />
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{v('Returns', 'Đổi trả')}</p>
                  <p style={{ fontSize: '12px', color: '#888' }}>{v('See store policy', 'Xem chính sách cửa hàng')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-16">
          <Tabs.Root defaultValue="description">
            <Tabs.List className="flex mb-8" style={{ borderBottom: '2px solid #e0d8cf' }}>
              {[
                { value: 'description', label: v('Description', 'Mô tả') },
                { value: 'details', label: v('Details', 'Chi tiết') },
              ].map((tab) => (
                <Tabs.Trigger
                  key={tab.value}
                  value={tab.value}
                  className="px-6 py-4 border-b-2 transition-colors data-[state=active]:border-[#d41c1c] data-[state=inactive]:border-transparent data-[state=active]:text-[#d41c1c] data-[state=inactive]:text-[#888]"
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    fontFamily: "'Oswald', sans-serif",
                  }}
                >
                  {tab.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <Tabs.Content value="description">
              <div className="max-w-3xl">
                <p style={{ fontSize: '16px', color: '#4a4a4a', lineHeight: '1.8' }}>
                  {product.description || v('No description available.', 'Chưa có mô tả.')}
                </p>
              </div>
            </Tabs.Content>

            <Tabs.Content value="details">
              <div className="max-w-3xl">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#d41c1c' }} />
                    <span style={{ fontSize: '16px', color: '#4a4a4a' }}>{v('Brand', 'Thương hiệu')}: {product.brand.name}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#d41c1c' }} />
                    <span style={{ fontSize: '16px', color: '#4a4a4a' }}>{v('Category', 'Danh mục')}: {product.category.name}</span>
                  </li>
                  {selectedVariant && (
                    <li className="flex items-start gap-2">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#d41c1c' }} />
                      <span style={{ fontSize: '16px', color: '#4a4a4a' }}>SKU: {selectedVariant.sku}</span>
                    </li>
                  )}
                </ul>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
    </div>
  );
}
