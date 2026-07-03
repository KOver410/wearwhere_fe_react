import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Trash2, ArrowLeft, CreditCard, Lock, ShoppingBag, AlertTriangle, MapPin, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';
import { Textarea } from '@/shared/ui/textarea';
import { ImageWithFallback } from '@/shared/components/figma/ImageWithFallback';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { formatVND } from '@/shared/utils/currency';
import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  type CartResponse,
} from '@/features/account/api/cartApi';
import { notifyCartUpdated } from '@/features/account/api/cartEvents';
import { listAddresses, type CustomerAddress } from '@/features/account/api/addressApi';
import {
  previewCheckout,
  placeOrder,
  type CheckoutPreview,
  type PaymentMethod,
} from '@/features/account/api/orderApi';

const MAX_QUANTITY = 10;

/** The payment method actually selected; only cod/payos are supported by the BE. */
type SelectedPaymentMethod = PaymentMethod;

export function CartCheckoutPage() {
  const navigate = useNavigate();
  const { v } = useLanguage();
  const [currentStep, setCurrentStep] = useState<'cart' | 'shipping' | 'payment'>('cart');

  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Ids of lines whose quantity/remove request is in flight.
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [clearing, setClearing] = useState(false);

  // --- Shipping (saved addresses) ---
  const [addresses, setAddresses] = useState<CustomerAddress[] | null>(null);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [addressesError, setAddressesError] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // --- Preview ---
  const [preview, setPreview] = useState<CheckoutPreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // --- Payment / placement ---
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<SelectedPaymentMethod>('cod');
  const [notes, setNotes] = useState('');
  const [placing, setPlacing] = useState(false);

  const items = cart?.items ?? [];
  const summary = cart?.summary;

  // Monotonic request-sequence guard shared by EVERY setCart caller on this page
  // (initial load + mutation-driven refresh). Each getCart() captures the seq it
  // was issued at; its result is only applied if it is still the latest, so an
  // out-of-order (older) response can never overwrite newer cart state.
  const reqSeq = useRef(0);

  const loadCart = useCallback(() => {
    setLoading(true);
    setError(null);
    const seq = ++reqSeq.current;
    let active = true;
    getCart()
      .then((res) => {
        if (active && seq === reqSeq.current) setCart(res);
      })
      .catch((e: unknown) => {
        if (active && seq === reqSeq.current)
          setError(e instanceof Error ? e.message : v('Failed to load cart', 'Không tải được giỏ hàng'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [v]);

  useEffect(() => {
    const cancel = loadCart();
    return cancel;
  }, [loadCart]);

  // Re-fetch the authoritative cart (and notify the header) after every mutation
  // so subtotals/totals always come from the backend, never local arithmetic.
  const refreshCart = useCallback(async () => {
    const seq = ++reqSeq.current;
    const res = await getCart();
    // Only apply if this is still the latest in-flight request; a stale late
    // resolver from a concurrent mutation must not overwrite newer state.
    if (seq === reqSeq.current) setCart(res);
    notifyCartUpdated();
  }, []);

  const setPending = (id: string, on: boolean) => {
    setPendingIds((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const updateQuantity = async (id: string, newQuantity: number, stockQty: number) => {
    const clamped = Math.min(Math.max(1, newQuantity), Math.min(MAX_QUANTITY, stockQty));
    if (clamped < 1 || pendingIds.has(id)) return;
    setPending(id, true);
    try {
      await updateCartItem(id, clamped);
      await refreshCart();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : v('Could not update item', 'Không thể cập nhật sản phẩm'));
    } finally {
      setPending(id, false);
    }
  };

  const removeItem = async (id: string) => {
    if (pendingIds.has(id)) return;
    setPending(id, true);
    try {
      await removeCartItem(id);
      await refreshCart();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : v('Could not remove item', 'Không thể xóa sản phẩm'));
    } finally {
      setPending(id, false);
    }
  };

  const handleClearCart = async () => {
    if (clearing) return;
    setClearing(true);
    try {
      await clearCart();
      await refreshCart();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : v('Could not clear cart', 'Không thể xóa giỏ hàng'));
    } finally {
      setClearing(false);
    }
  };

  // Load saved addresses on first entry to the shipping step. Auto-select the
  // default address (fallback: first address) so a preview can be issued.
  const loadAddresses = useCallback(() => {
    setAddressesLoading(true);
    setAddressesError(null);
    listAddresses()
      .then((res) => {
        const list = res.items;
        setAddresses(list);
        setSelectedAddressId((prev) => {
          if (prev && list.some((a) => a.id === prev)) return prev;
          const def = list.find((a) => a.is_default);
          return def?.id ?? list[0]?.id ?? null;
        });
      })
      .catch((e: unknown) => {
        setAddressesError(
          e instanceof Error ? e.message : v('Failed to load addresses', 'Không tải được địa chỉ'),
        );
      })
      .finally(() => setAddressesLoading(false));
  }, [v]);

  // Re-fetch the BE preview whenever the selected address changes. A sequence
  // guard prevents an out-of-order (stale) preview from overwriting newer state.
  const previewSeq = useRef(0);
  useEffect(() => {
    if (!selectedAddressId) {
      setPreview(null);
      setPreviewError(null);
      return;
    }
    const seq = ++previewSeq.current;
    let active = true;
    setPreviewLoading(true);
    setPreviewError(null);
    previewCheckout(selectedAddressId)
      .then((res) => {
        if (active && seq === previewSeq.current) setPreview(res);
      })
      .catch((e: unknown) => {
        if (active && seq === previewSeq.current) {
          setPreview(null);
          setPreviewError(
            e instanceof Error ? e.message : v('Failed to preview checkout', 'Không tải được xem trước'),
          );
        }
      })
      .finally(() => {
        if (active && seq === previewSeq.current) setPreviewLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selectedAddressId, v]);

  // Load saved addresses the first time the shipping step becomes active.
  useEffect(() => {
    if (currentStep === 'shipping' && addresses === null && !addressesLoading && !addressesError) {
      loadAddresses();
    }
  }, [currentStep, addresses, addressesLoading, addressesError, loadAddresses]);

  const canProceed = items.length > 0 && !summary?.has_unavailable;

  const handleContinueToShipping = () => {
    if (!canProceed) return;
    setCurrentStep('shipping');
  };

  const handleContinueToPayment = () => {
    if (!selectedAddressId) return;
    setCurrentStep('payment');
  };

  // FE never computes totals: gating is driven entirely by the BE preview.
  const canPlaceOrder =
    !!selectedAddressId &&
    !!preview &&
    !preview.cart_empty &&
    preview.meets_min_order &&
    preview.warnings.length === 0 &&
    !previewLoading &&
    !placing;

  const handlePlaceOrder = async () => {
    if (!selectedAddressId || !canPlaceOrder || placing) return;
    setPlacing(true);
    try {
      const { order, payment } = await placeOrder({
        address_id: selectedAddressId,
        payment_method: selectedPaymentMethod,
        notes,
      });
      // The cart is cleared server-side on placement; keep the header badge in sync.
      notifyCartUpdated();
      if (selectedPaymentMethod === 'payos') {
        if (payment.checkout_url) {
          window.location.href = payment.checkout_url;
          return;
        }
        toast.error(
          v('Missing PayOS checkout URL. Please try again.', 'Thiếu liên kết thanh toán PayOS. Vui lòng thử lại.'),
        );
        setPlacing(false);
        return;
      }
      navigate(`/order/success?orderNo=${encodeURIComponent(order.order_no)}`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : v('Could not place order', 'Không thể đặt hàng'));
      setPlacing(false);
    }
  };

  // Shared BE-driven checkout preview block (sub-orders, money, warnings).
  // FE renders only the backend values and never computes totals.
  const renderPreview = () => {
    if (previewLoading) {
      return (
        <div data-testid="preview-loading" className="flex items-center justify-center py-6">
          <div className="w-8 h-8 border-4 border-[#e0d8cf] border-t-[#d41c1c] rounded-full animate-spin" />
        </div>
      );
    }
    if (previewError) {
      return (
        <p data-testid="preview-error" style={{ fontSize: '13px', color: '#d41c1c', fontWeight: 600 }}>
          {previewError}
        </p>
      );
    }
    if (!preview) return null;

    return (
      <div data-testid="preview-summary">
        {/* Per-brand sub-orders */}
        <div className="space-y-4 mb-4">
          {preview.sub_orders.map((so) => (
            <div
              key={so.brand.id}
              className="p-4"
              style={{ borderRadius: '10px', border: '2px solid #e0d8cf', backgroundColor: '#fefcfa' }}
            >
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                {so.brand.name}
              </p>
              <div className="space-y-2">
                {so.items.map((it) => (
                  <div key={it.variant_id} className="flex items-center gap-3">
                    <div className="w-12 h-12 flex-shrink-0 overflow-hidden" style={{ borderRadius: '4px', backgroundColor: '#f3f0eb' }}>
                      <ImageWithFallback src={it.image_url ?? undefined} alt={it.product_name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#0d0d0d' }} className="truncate">
                        {it.product_name}
                      </p>
                      <p style={{ fontSize: '12px', color: '#888' }}>
                        {it.variant_label} · ×{it.qty}
                      </p>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#0d0d0d' }}>
                      {formatVND(it.line_total_vnd)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-3 pt-2" style={{ borderTop: '1px solid #e0d8cf' }}>
                <span style={{ fontSize: '12px', color: '#4a4a4a' }}>{v('Shipping', 'Vận chuyển')}</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#0d0d0d' }}>
                  {formatVND(so.shipping_fee_vnd)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Warnings (unavailable / low-stock variants) */}
        {preview.warnings.length > 0 && (
          <div data-testid="preview-warnings" className="mb-4 space-y-1">
            {preview.warnings.map((w, i) => (
              <p key={i} className="flex items-start gap-1" style={{ fontSize: '12px', color: '#d41c1c', fontWeight: 600 }}>
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                {w}
              </p>
            ))}
          </div>
        )}

        {/* Minimum order notice */}
        {!preview.meets_min_order && (
          <p data-testid="preview-min-order" className="flex items-start gap-1 mb-4" style={{ fontSize: '12px', color: '#d41c1c', fontWeight: 600 }}>
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            {v('Minimum order value is', 'Giá trị đơn hàng tối thiểu là')} {formatVND(preview.min_order_value_vnd)}
          </p>
        )}

        {/* BE totals */}
        <div className="p-4" style={{ backgroundColor: '#fff9f2', borderRadius: '10px', border: '2px solid #e0d8cf' }}>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Subtotal', 'Tạm tính')}</span>
              <span data-testid="preview-subtotal" style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>
                {formatVND(preview.subtotal_vnd)}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Shipping', 'Vận chuyển')}</span>
              <span data-testid="preview-shipping" style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>
                {formatVND(preview.shipping_total_vnd)}
              </span>
            </div>
            <div className="flex justify-between pt-2" style={{ borderTop: '2px solid #e0d8cf' }}>
              <span style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' }}>
                {v('Total', 'Tổng cộng')}
              </span>
              <span data-testid="preview-grand-total" style={{ fontSize: '24px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#d41c1c' }}>
                {formatVND(preview.grand_total_vnd)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
        <div data-testid="cart-loading" className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-[#e0d8cf] border-t-[#d41c1c] rounded-full animate-spin" />
          <p className="mt-4" style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Loading...', 'Đang tải...')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
        <div className="text-center">
          <p style={{ fontSize: '24px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '12px' }}>
            {v('Failed to load cart', 'Không tải được giỏ hàng')}
          </p>
          <p style={{ fontSize: '14px', color: '#4a4a4a', marginBottom: '16px' }}>{error}</p>
          <button
            onClick={() => loadCart()}
            className="px-6 py-3 bg-[#0d0d0d] text-white inline-block hover:bg-[#d41c1c] transition-colors"
            style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Oswald', sans-serif" }}
          >
            {v('Retry', 'Thử lại')}
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" style={{ fontFamily: "'Montserrat', sans-serif" }}>
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f3f0eb' }}>
              <ShoppingBag className="w-12 h-12" style={{ color: '#888' }} />
            </div>
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, color: '#0d0d0d', marginBottom: '16px', fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase', lineHeight: 1.05 }}>
            {v('Your cart is empty', 'Giỏ hàng trống')}
          </h2>
          <p style={{ fontSize: '16px', color: '#4a4a4a', marginBottom: '32px' }}>
            {v("Looks like you haven't added anything to your cart yet", 'Có vẻ bạn chưa thêm sản phẩm nào vào giỏ hàng')}
          </p>
          <Link to="/">
            <Button
              style={{
                backgroundColor: '#0d0d0d',
                color: '#FFFFFF',
                borderRadius: '10px',
                height: '48px',
                paddingLeft: '32px',
                paddingRight: '32px',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                fontFamily: "'Oswald', sans-serif",
              }}
            >
              {v('Start Shopping', 'Bắt đầu mua sắm')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
      <div className="mx-auto px-4 lg:px-6 py-4" style={{ maxWidth: 'calc(75% + 320px)' }}>
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-4 hover:gap-3 transition-all"
            style={{ fontSize: '12px', fontWeight: 600, color: '#d41c1c', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
          >
            <ArrowLeft className="w-5 h-5" />
            {v('Continue Shopping', 'Tiếp tục mua sắm')}
          </Link>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05, marginBottom: '8px' }}>
            {v('Cart & Checkout', 'Giỏ hàng & Thanh toán')}
          </h1>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'cart' ? 'bg-[#d41c1c] text-white' : 'bg-[#4a4a4a] text-white'
                }`}
                style={{ fontSize: '14px', fontWeight: 600 }}
              >
                1
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: currentStep === 'cart' ? '#0d0d0d' : '#4a4a4a' }}>
                {v('Cart', 'Giỏ hàng')}
              </span>
            </div>
            <div className="h-px flex-1" style={{ backgroundColor: '#e0d8cf' }} />
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'shipping' ? 'bg-[#d41c1c] text-white' : currentStep === 'payment' ? 'bg-[#4a4a4a] text-white' : 'text-[#888]'
                }`}
                style={{ fontSize: '14px', fontWeight: 600, backgroundColor: currentStep !== 'shipping' && currentStep !== 'payment' ? '#f0ebe4' : undefined }}
              >
                2
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: currentStep === 'shipping' ? '#0d0d0d' : currentStep === 'payment' ? '#4a4a4a' : '#888' }}>
                {v('Shipping', 'Giao hàng')}
              </span>
            </div>
            <div className="h-px flex-1" style={{ backgroundColor: '#e0d8cf' }} />
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'payment' ? 'bg-[#d41c1c] text-white' : 'text-[#888]'
                }`}
                style={{ fontSize: '14px', fontWeight: 600, backgroundColor: currentStep !== 'payment' ? '#f0ebe4' : undefined }}
              >
                3
              </div>
              <span style={{ fontSize: '14px', fontWeight: 600, color: currentStep === 'payment' ? '#0d0d0d' : '#888' }}>
                {v('Payment', 'Thanh toán')}
              </span>
            </div>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT SIDE - Cart Items */}
            <div className="lg:col-span-7">
              <div
                className="bg-white p-6"
                style={{
                  borderRadius: '10px',
                  border: '2px solid #e0d8cf',
                  boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 style={{ fontSize: '24px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' }}>
                    {v('Your Items', 'Sản phẩm')} ({summary?.item_count ?? items.length})
                  </h2>
                  <button
                    type="button"
                    onClick={handleClearCart}
                    disabled={clearing}
                    className="flex items-center gap-1 text-[#d41c1c] hover:text-[#b01818] transition-colors disabled:opacity-40"
                    style={{ fontSize: '13px', fontWeight: 600 }}
                  >
                    <Trash2 className="w-4 h-4" />
                    {v('Clear Cart', 'Xóa giỏ hàng')}
                  </button>
                </div>

                {/* Cart Items List */}
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => {
                      const busy = pendingIds.has(item.id);
                      const maxQty = Math.min(MAX_QUANTITY, item.variant.stock_qty);
                      return (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-4 pb-4 last:border-b-0"
                        style={{ borderBottom: '1px solid #e0d8cf' }}
                      >
                        {/* Product Image */}
                        <Link
                          to={`/product/${item.product.id}`}
                          className="w-24 h-24 flex-shrink-0 overflow-hidden"
                          style={{ borderRadius: '4px', backgroundColor: '#f3f0eb' }}
                        >
                          <ImageWithFallback
                            src={item.product.primary_image_url}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <p style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {item.brand.name}
                          </p>
                          <Link to={`/product/${item.product.id}`}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0d0d0d', marginBottom: '4px' }}>
                              {item.product.name}
                            </h3>
                          </Link>
                          <p style={{ fontSize: '14px', color: '#888', marginBottom: '4px' }}>
                            {v('Size', 'Cỡ')}: {item.variant.size} | {v('Color', 'Màu')}: {item.variant.color}
                          </p>
                          <p style={{ fontSize: '18px', fontWeight: 700, color: '#0d0d0d' }}>
                            {formatVND(item.current_price)}
                          </p>

                          {item.price_changed && (
                            <p data-testid={`price-changed-${item.id}`} className="flex items-center gap-1 mt-1" style={{ fontSize: '12px', color: '#e2b93b', fontWeight: 600 }}>
                              <AlertTriangle className="w-3.5 h-3.5" />
                              {v('Price changed since you added this item', 'Giá đã thay đổi kể từ khi bạn thêm sản phẩm này')}
                            </p>
                          )}
                          {item.unavailable && (
                            <p data-testid={`unavailable-${item.id}`} className="flex items-center gap-1 mt-1" style={{ fontSize: '12px', color: '#d41c1c', fontWeight: 600 }}>
                              <AlertTriangle className="w-3.5 h-3.5" />
                              {item.unavailable_reason || v('This item is no longer available', 'Sản phẩm này không còn khả dụng')}
                            </p>
                          )}

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center border-2 border-[#e0d8cf]" style={{ borderRadius: '10px' }}>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.qty - 1, item.variant.stock_qty)}
                                disabled={busy || item.qty <= 1}
                                aria-label={v('Decrease quantity', 'Giảm số lượng')}
                                className="px-3 py-1 hover:bg-[#fff9f2] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{ fontSize: '16px', fontWeight: 600, color: '#0d0d0d' }}
                              >
                                -
                              </button>
                              <span className="px-4 py-1" style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>
                                {item.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, item.qty + 1, item.variant.stock_qty)}
                                disabled={busy || item.qty >= maxQty}
                                aria-label={v('Increase quantity', 'Tăng số lượng')}
                                className="px-3 py-1 hover:bg-[#fff9f2] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{ fontSize: '16px', fontWeight: 600, color: '#0d0d0d' }}
                              >
                                +
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              disabled={busy}
                              className="flex items-center gap-1 text-[#d41c1c] hover:text-[#b01818] transition-colors disabled:opacity-40"
                              style={{ fontSize: '14px', fontWeight: 400 }}
                            >
                              <Trash2 className="w-4 h-4" />
                              {v('Remove', 'Xóa')}
                            </button>
                          </div>
                        </div>

                        {/* Item Subtotal */}
                        <div className="text-right">
                          <p style={{ fontSize: '18px', fontWeight: 700, color: '#0A0A0A' }}>
                            {formatVND(item.subtotal_current)}
                          </p>
                        </div>
                      </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE - Shipping & Payment Form */}
            <div className="lg:col-span-5">
              {/* Step 1: Cart Review (Show Order Summary) */}
              {currentStep === 'cart' && (
                <div
                  className="bg-white p-6"
                  style={{
                    borderRadius: '10px',
                    border: '2px solid #e0d8cf',
                    boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  <h2 style={{ fontSize: '24px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '24px' }}>
                    {v('Order Summary', 'Tóm tắt đơn hàng')}
                  </h2>

                  <div className="space-y-3 mb-6 pb-6" style={{ borderBottom: '2px solid #e0d8cf' }}>
                    <div className="flex justify-between">
                      <span style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Items', 'Số lượng')}</span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>
                        {summary?.total_qty ?? 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Shipping', 'Vận chuyển')}</span>
                      <span style={{ fontSize: '14px', color: '#888' }}>
                        {v('Calculated at checkout', 'Tính khi thanh toán')}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between mb-6">
                    <span style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' }}>{v('Total', 'Tổng cộng')}</span>
                    <span data-testid="cart-total" style={{ fontSize: '28px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#d41c1c' }}>
                      {formatVND(summary?.total_current ?? '0')}
                    </span>
                  </div>

                  {summary?.has_unavailable && (
                    <p data-testid="cart-blocked" className="flex items-center gap-1 mb-4" style={{ fontSize: '13px', color: '#d41c1c', fontWeight: 600 }}>
                      <AlertTriangle className="w-4 h-4" />
                      {v('Remove unavailable items to continue', 'Xóa sản phẩm không khả dụng để tiếp tục')}
                    </p>
                  )}

                  <Button
                    type="button"
                    onClick={handleContinueToShipping}
                    disabled={!canProceed}
                    className="w-full"
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
                    {v('Continue to Shipping', 'Tiếp tục đến giao hàng')}
                  </Button>

                  <p style={{ fontSize: '12px', color: '#888', marginTop: '12px', textAlign: 'center' }}>
                    {v('Secure checkout powered by encryption', 'Thanh toán bảo mật bằng mã hóa')}
                  </p>
                </div>
              )}

              {/* Step 2: Shipping Information — saved address selection */}
              {currentStep === 'shipping' && (
                <div
                  className="bg-white p-6"
                  style={{
                    borderRadius: '4px',
                    border: '2px solid #e0d8cf',
                    boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 style={{ fontSize: '24px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' }}>
                      {v('Shipping Address', 'Địa chỉ giao hàng')}
                    </h2>
                    <Link
                      to="/account/addresses"
                      className="inline-flex items-center gap-1 hover:gap-2 transition-all"
                      style={{ fontSize: '12px', fontWeight: 600, color: '#d41c1c', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
                    >
                      <Plus className="w-4 h-4" />
                      {v('Add / Edit Address', 'Thêm / Sửa địa chỉ')}
                    </Link>
                  </div>

                  {addressesLoading && (
                    <div data-testid="addresses-loading" className="flex items-center justify-center py-8">
                      <div className="w-8 h-8 border-4 border-[#e0d8cf] border-t-[#d41c1c] rounded-full animate-spin" />
                    </div>
                  )}

                  {!addressesLoading && addressesError && (
                    <div className="text-center py-6">
                      <p style={{ fontSize: '14px', color: '#d41c1c', marginBottom: '12px' }}>{addressesError}</p>
                      <button
                        type="button"
                        onClick={loadAddresses}
                        className="px-5 py-2 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors"
                        style={{ borderRadius: '10px', fontSize: '13px', fontFamily: "'Oswald', sans-serif" }}
                      >
                        {v('Retry', 'Thử lại')}
                      </button>
                    </div>
                  )}

                  {!addressesLoading && !addressesError && addresses && addresses.length === 0 && (
                    <div data-testid="no-addresses" className="text-center py-8">
                      <div className="mb-4 flex justify-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f3f0eb' }}>
                          <MapPin className="w-8 h-8" style={{ color: '#888' }} />
                        </div>
                      </div>
                      <p style={{ fontSize: '15px', fontWeight: 600, color: '#0d0d0d', marginBottom: '8px' }}>
                        {v('No saved addresses yet', 'Chưa có địa chỉ nào')}
                      </p>
                      <p style={{ fontSize: '13px', color: '#4a4a4a', marginBottom: '16px' }}>
                        {v('Add a delivery address to continue checkout', 'Thêm địa chỉ giao hàng để tiếp tục thanh toán')}
                      </p>
                      <Link
                        to="/account/addresses"
                        className="inline-block px-6 py-3 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors"
                        style={{ borderRadius: '10px', fontSize: '13px', fontFamily: "'Oswald', sans-serif", letterSpacing: '0.1em', textTransform: 'uppercase' }}
                      >
                        {v('Add Address', 'Thêm địa chỉ')}
                      </Link>
                    </div>
                  )}

                  {!addressesLoading && !addressesError && addresses && addresses.length > 0 && (
                    <div className="space-y-3" role="radiogroup" aria-label={v('Saved addresses', 'Địa chỉ đã lưu')}>
                      {addresses.map((addr) => {
                        const selected = addr.id === selectedAddressId;
                        return (
                          <button
                            type="button"
                            key={addr.id}
                            role="radio"
                            aria-checked={selected}
                            onClick={() => setSelectedAddressId(addr.id)}
                            data-testid={`address-card-${addr.id}`}
                            className="w-full text-left p-4 transition-colors"
                            style={{
                              borderRadius: '10px',
                              border: selected ? '2px solid #d41c1c' : '2px solid #e0d8cf',
                              backgroundColor: selected ? '#fff4f0' : '#fefcfa',
                            }}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {addr.label}
                              </span>
                              {addr.is_default && (
                                <span style={{ fontSize: '10px', fontWeight: 600, color: '#d41c1c', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                  {v('Default', 'Mặc định')}
                                </span>
                              )}
                            </div>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>
                              <span>{addr.recipient_name}</span>
                              <span style={{ color: '#888', fontWeight: 400 }}> · {addr.recipient_phone}</span>
                            </p>
                            <p style={{ fontSize: '13px', color: '#4a4a4a', marginTop: '2px' }}>
                              {addr.address_line}, {addr.ward}, {addr.district}, {addr.city}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* BE checkout preview for the selected address. */}
                  {selectedAddressId && (
                    <div className="mt-6">
                      {renderPreview()}
                    </div>
                  )}

                  <div className="flex gap-3 mt-6">
                    <Button
                      type="button"
                      onClick={() => setCurrentStep('cart')}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#d41c1c',
                        borderRadius: '10px',
                        height: '52px',
                        paddingLeft: '24px',
                        paddingRight: '24px',
                        fontSize: '12px',
                        fontWeight: 600,
                        border: '2px solid #d41c1c',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase' as const,
                        fontFamily: "'Oswald', sans-serif",
                      }}
                    >
                      {v('Back', 'Quay lại')}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleContinueToPayment}
                      disabled={!selectedAddressId || previewLoading || !preview}
                      className="flex-1"
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
                      {v('Continue to Payment', 'Tiếp tục thanh toán')}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Information */}
              {currentStep === 'payment' && (
                <div
                  className="bg-white p-6"
                  style={{
                    borderRadius: '10px',
                    border: '2px solid #e0d8cf',
                    boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  <h2 style={{ fontSize: '24px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '24px' }}>
                    {v('Payment Method', 'Phương thức thanh toán')}
                  </h2>

                  {/* Payment Method Selection — only COD/PayOS are supported. */}
                  <RadioGroup
                    value={selectedPaymentMethod}
                    onValueChange={(val) => setSelectedPaymentMethod(val as SelectedPaymentMethod)}
                    className="space-y-3 mb-6"
                  >
                    {/* Supported: COD */}
                    <div
                      className="flex items-center space-x-3 p-3 bg-white border-2 border-[#e0d8cf] hover:border-[#d41c1c] cursor-pointer transition-colors"
                      style={{ borderRadius: '10px' }}
                    >
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="cursor-pointer flex-1" style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>
                        {v('Cash on Delivery', 'Thanh toán khi nhận hàng')}
                      </Label>
                    </div>

                    {/* Supported: PayOS */}
                    <div
                      className="flex items-center space-x-3 p-3 bg-white border-2 border-[#e0d8cf] hover:border-[#d41c1c] cursor-pointer transition-colors"
                      style={{ borderRadius: '10px' }}
                    >
                      <RadioGroupItem value="payos" id="payos" />
                      <Label htmlFor="payos" className="cursor-pointer flex-1" style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>
                        PayOS
                      </Label>
                    </div>

                    {/* Unsupported: Card */}
                    <div
                      className="flex items-center space-x-3 p-3 bg-white border-2 border-[#e0d8cf] opacity-60"
                      style={{ borderRadius: '10px' }}
                    >
                      <RadioGroupItem value="card" id="card" disabled />
                      <Label htmlFor="card" className="flex items-center gap-2 flex-1" style={{ fontSize: '14px', fontWeight: 600, color: '#888' }}>
                        <CreditCard className="w-4 h-4" />
                        {v('Credit / Debit Card', 'Thẻ tín dụng / Ghi nợ')}
                      </Label>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#888' }}>{v('Chưa hỗ trợ', 'Chưa hỗ trợ')}</span>
                    </div>

                    {/* Unsupported: PayPal */}
                    <div
                      className="flex items-center space-x-3 p-3 bg-white border-2 border-[#e0d8cf] opacity-60"
                      style={{ borderRadius: '10px' }}
                    >
                      <RadioGroupItem value="paypal" id="paypal" disabled />
                      <Label htmlFor="paypal" className="flex-1" style={{ fontSize: '14px', fontWeight: 600, color: '#888' }}>
                        PayPal
                      </Label>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#888' }}>{v('Chưa hỗ trợ', 'Chưa hỗ trợ')}</span>
                    </div>

                    {/* Unsupported: Voucher */}
                    <div
                      className="flex items-center space-x-3 p-3 bg-white border-2 border-[#e0d8cf] opacity-60"
                      style={{ borderRadius: '10px' }}
                    >
                      <RadioGroupItem value="voucher" id="voucher" disabled />
                      <Label htmlFor="voucher" className="flex-1" style={{ fontSize: '14px', fontWeight: 600, color: '#888' }}>
                        {v('Voucher', 'Voucher')}
                      </Label>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#888' }}>{v('Chưa hỗ trợ', 'Chưa hỗ trợ')}</span>
                    </div>
                  </RadioGroup>

                  {/* Optional order note */}
                  <div className="mb-6">
                    <Label htmlFor="notes" style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                      {v('Order Note (optional)', 'Ghi chú đơn hàng (tuỳ chọn)')}
                    </Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      maxLength={500}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={v('Notes for the delivery...', 'Ghi chú cho đơn hàng...')}
                      style={{ borderRadius: '10px', fontSize: '14px', backgroundColor: '#fefcfa', border: '2px solid #e0d8cf' }}
                    />
                  </div>

                  {/* BE-driven order summary (sub-orders, warnings, totals). */}
                  <div className="mb-6">{renderPreview()}</div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={() => setCurrentStep('shipping')}
                      style={{
                        backgroundColor: 'transparent',
                        color: '#d41c1c',
                        borderRadius: '10px',
                        height: '52px',
                        paddingLeft: '24px',
                        paddingRight: '24px',
                        fontSize: '12px',
                        fontWeight: 600,
                        border: '2px solid #d41c1c',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase' as const,
                        fontFamily: "'Oswald', sans-serif",
                      }}
                    >
                      {v('Back', 'Quay lại')}
                    </Button>
                    <Button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={!canPlaceOrder}
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
                      <Lock className="w-5 h-5" />
                      {placing ? v('Placing...', 'Đang đặt...') : v('Place Order', 'Đặt hàng')}
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Lock className="w-4 h-4 text-[#888]" />
                    <p style={{ fontSize: '12px', color: '#888' }}>
                      {v('Secure checkout with SSL encryption', 'Thanh toán bảo mật với mã hóa SSL')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}