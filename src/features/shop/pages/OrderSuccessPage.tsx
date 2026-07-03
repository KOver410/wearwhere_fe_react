import { Link, useLocation } from 'react-router';
import { CheckCircle, Package, MapPin, Copy, ArrowRight, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ImageWithFallback } from '@/shared/components/figma/ImageWithFallback';
import { getOrder, type Order } from '@/features/account/api/orderApi';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { copyToClipboard } from '@/shared/utils/clipboard';
import { formatVND } from '@/shared/utils/currency';

export function OrderSuccessPage() {
  const location = useLocation();
  const { v, lang } = useLanguage();
  const isVi = lang === 'vi';
  const orderNo = new URLSearchParams(location.search).get('orderNo');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!orderNo) {
      setError(true);
      setLoading(false);
      return;
    }
    let active = true;
    setLoading(true);
    setError(false);
    getOrder(orderNo)
      .then((res) => {
        if (active) setOrder(res);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [orderNo]);

  const copyOrderNumber = () => {
    if (!order) return;
    copyToClipboard(order.order_no);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
        <p style={{ fontSize: '14px', color: '#888' }}>{v('Loading order...', 'Đang tải đơn hàng...')}</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
        <div className="text-center bg-white p-8 max-w-md w-full" style={{ borderRadius: '10px', border: '2px solid #e0d8cf' }}>
          <h1 style={{ fontSize: 'clamp(22px, 4vw, 28px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '12px' }}>
            {v('Order not found', 'Không tìm thấy đơn hàng')}
          </h1>
          <p style={{ fontSize: '14px', color: '#4a4a4a', marginBottom: '20px' }}>
            {orderNo
              ? v('We could not load this order. Please check your orders.', 'Chúng tôi không thể tải đơn hàng này. Vui lòng kiểm tra danh sách đơn hàng.')
              : v('Missing order number. Please check your orders.', 'Thiếu mã đơn hàng. Vui lòng kiểm tra danh sách đơn hàng.')}
          </p>
          <Link
            to="/account/orders"
            className="inline-block px-6 py-3 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors"
            style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
          >
            {v('Go to My Orders', 'Đến đơn hàng của tôi')}
          </Link>
        </div>
      </div>
    );
  }

  // A redirect back from PayOS can land here even when the payment was not
  // actually completed (user cancelled, card declined, window expired, or the
  // confirmation webhook simply hasn't landed yet). In all those cases the order
  // exists but is unpaid, so we must NOT show a confirmation. A PayOS order that
  // is still `pending` is the most common instance of this — the redirect back
  // routinely arrives before the webhook flips the status. COD orders, by
  // contrast, are legitimately `pending` (paid on delivery), so they stay
  // confirmed.
  const paymentFailed =
    order.payment_status === 'failed' ||
    order.payment_status === 'cancelled' ||
    order.payment_status === 'expired' ||
    (order.payment_method === 'payos' && order.payment_status === 'pending');

  if (paymentFailed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
        <div className="text-center bg-white p-8 max-w-md w-full" style={{ borderRadius: '10px', border: '2px solid #e0d8cf' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: '#fdecec' }}>
            <AlertTriangle className="w-8 h-8" style={{ color: '#d41c1c' }} />
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 4vw, 28px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '12px' }}>
            {v('Payment not completed', 'Thanh toán chưa hoàn tất')}
          </h1>
          <p style={{ fontSize: '14px', color: '#4a4a4a', marginBottom: '8px' }}>
            {v(
              'Your payment was not completed, so this order has not been confirmed.',
              'Thanh toán của bạn chưa hoàn tất, nên đơn hàng này chưa được xác nhận.',
            )}
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <span style={{ fontSize: '13px', color: '#888' }}>{v('Order Number:', 'Mã đơn hàng:')}</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#0d0d0d' }}>{order.order_no}</span>
          </div>
          {/* The cart is cleared server-side at placement, so there is nothing to
              "retry" there; the unpaid order can be managed (or cancelled) from
              its detail page, and a fresh purchase starts from the shop. */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/shop"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors"
              style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
            >
              {v('Continue Shopping', 'Tiếp tục mua sắm')}
            </Link>
            <Link
              to={`/account/orders/${order.order_no}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-[#0d0d0d] hover:bg-[#f3f0eb] transition-colors"
              style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: '#0d0d0d', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
            >
              {v('View Order', 'Xem đơn hàng')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const addr = order.shipping_address;
  const flatItems = order.sub_orders.flatMap((sub) =>
    sub.items.map((item) => ({ item, brand: sub.brand.name })),
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#d41c1c' }}>
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05, marginBottom: '8px' }}>
            {v('Order Confirmed!', 'Đặt hàng thành công!')}
          </h1>
          <p style={{ fontSize: '16px', color: '#4a4a4a', marginBottom: '16px' }}>
            {v('Thank you for shopping with WearWhere', 'Cảm ơn bạn đã mua sắm tại WearWhere')}
          </p>
          <div className="flex items-center justify-center gap-2">
            <span style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Order Number:', 'Mã đơn hàng:')}</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{order.order_no}</span>
            <button
              onClick={copyOrderNumber}
              className="p-1 hover:bg-[#f3f0eb] rounded transition-colors"
              title={v('Copy order number', 'Sao chép mã đơn hàng')}
            >
              <Copy className="w-4 h-4 text-[#888]" />
            </button>
            {copied && (
              <span style={{ fontSize: '12px', color: '#d41c1c' }}>{v('Copied!', 'Đã sao chép!')}</span>
            )}
          </div>
        </div>

        {/* Shipping snapshot */}
        <div
          className="bg-white p-6 mb-6"
          style={{ borderRadius: '10px', border: '2px solid #e0d8cf', boxShadow: '0px 1px 3px rgba(0,0,0,0.05)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-5 h-5" style={{ color: '#d41c1c' }} />
            <h2 style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' }}>{v('Shipping Address', 'Địa chỉ giao hàng')}</h2>
          </div>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{addr.recipient}</p>
          <p style={{ fontSize: '14px', color: '#4a4a4a', marginTop: '4px' }}>{addr.line1}</p>
          <p style={{ fontSize: '14px', color: '#4a4a4a' }}>{addr.ward}, {addr.district}, {addr.city}</p>
          <p style={{ fontSize: '14px', color: '#888', marginTop: '8px' }}>{addr.phone}</p>
        </div>

        {/* Order Items */}
        <div
          className="bg-white p-6 mb-6"
          style={{ borderRadius: '10px', border: '2px solid #e0d8cf', boxShadow: '0px 1px 3px rgba(0,0,0,0.05)' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-5 h-5" style={{ color: '#d41c1c' }} />
            <h2 style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' }}>
              {v('Order Items', 'Sản phẩm')} ({flatItems.length})
            </h2>
          </div>

          <div className="space-y-4">
            {flatItems.map(({ item, brand }) => (
              <div key={item.id} className="flex gap-4 pb-4 last:border-b-0 last:pb-0" style={{ borderBottom: '1px solid #e0d8cf' }}>
                <div className="w-20 h-20 flex-shrink-0 overflow-hidden" style={{ borderRadius: '4px', backgroundColor: '#f3f0eb' }}>
                  <ImageWithFallback src={item.image_url ?? ''} alt={item.product_name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{item.product_name}</p>
                  <p style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{item.variant_label} · {v('Qty:', 'SL:')} {item.qty}</p>
                  <p style={{ fontSize: '12px', color: '#888' }}>{brand}</p>
                </div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{formatVND(item.line_total_vnd)}</p>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-6 pt-4 space-y-2" style={{ borderTop: '2px solid #e0d8cf' }}>
            <div className="flex justify-between">
              <span style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Subtotal', 'Tạm tính')}</span>
              <span style={{ fontSize: '14px', color: '#0d0d0d' }}>{formatVND(order.subtotal_vnd)}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Shipping', 'Phí vận chuyển')}</span>
              <span style={{ fontSize: '14px', color: '#0d0d0d' }}>{formatVND(order.shipping_total_vnd)}</span>
            </div>
            <div className="flex justify-between pt-3" style={{ borderTop: '2px solid #e0d8cf' }}>
              <span style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' }}>{v('Total', 'Tổng cộng')}</span>
              <span style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#d41c1c' }}>{formatVND(order.grand_total_vnd)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Link
            to={`/account/orders/${order.order_no}`}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors"
            style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
          >
            {v('View Order', 'Xem đơn hàng')}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/account/orders"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-[#0d0d0d] hover:bg-[#f3f0eb] transition-colors"
            style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: '#0d0d0d', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
          >
            {v('My Orders', 'Đơn hàng của tôi')}
          </Link>
        </div>

        <div className="text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2"
            style={{ fontSize: '12px', fontWeight: 600, color: '#d41c1c', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
          >
            {v('Continue Shopping', 'Tiếp tục mua sắm')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
