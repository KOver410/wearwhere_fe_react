import { Link, useParams } from 'react-router';
import { ArrowLeft, Package, MapPin, CreditCard, Copy } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { AccountLayout } from '@/shared/components/AccountLayout';
import { ImageWithFallback } from '@/shared/components/figma/ImageWithFallback';
import {
  getOrder,
  cancelOrder,
  type Order,
  type OrderStatus,
  type SubOrderStatus,
} from '@/features/account/api/orderApi';
import { ApiError } from '@/shared/api/contracts';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { copyToClipboard } from '@/shared/utils/clipboard';
import { formatVND } from '@/shared/utils/currency';

const rootStatusLabel: Record<OrderStatus, { en: string; vi: string; bg: string; text: string }> = {
  pending_payment: { en: 'Pending payment', vi: 'Chờ thanh toán', bg: '#FAF0DC', text: '#8B6914' },
  processing: { en: 'Processing', vi: 'Đang xử lý', bg: '#E8EDF5', text: '#3B5998' },
  completed: { en: 'Completed', vi: 'Hoàn thành', bg: '#E8F5E8', text: '#2D6A2D' },
  cancelled: { en: 'Cancelled', vi: 'Đã hủy', bg: '#fce8e8', text: '#d41c1c' },
};

const subStatusLabel: Record<SubOrderStatus, { en: string; vi: string }> = {
  pending: { en: 'Pending', vi: 'Chờ xác nhận' },
  confirmed: { en: 'Confirmed', vi: 'Đã xác nhận' },
  preparing: { en: 'Preparing', vi: 'Đang chuẩn bị' },
  shipped: { en: 'Shipped', vi: 'Đang giao' },
  delivered: { en: 'Delivered', vi: 'Đã giao' },
  cancelled: { en: 'Cancelled', vi: 'Đã hủy' },
};

/**
 * Cancellation is permitted only when the root status is neither cancelled nor
 * completed, every sub-order is still pending, and the order is not an already
 * paid PayOS order. The backend remains authoritative and may still reject.
 */
function DetailCard({ children, title, icon: Icon }: { children: React.ReactNode; title: string; icon?: any }) {
  return (
    <div className="bg-white p-6" style={{ borderRadius: '10px', border: '2px solid #e0d8cf', boxShadow: '0px 1px 3px rgba(0,0,0,0.05)' }}>
      <div className="flex items-center gap-2 mb-5">
        {Icon && <Icon className="w-5 h-5" style={{ color: '#d41c1c' }} />}
        <h2 style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' }}>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function canCancel(order: Order): boolean {
  if (order.status === 'cancelled' || order.status === 'completed') return false;
  if (order.sub_orders.length === 0) return false;
  if (!order.sub_orders.every((s) => s.status === 'pending')) return false;
  const paidPayos = order.payment_method === 'payos' && order.payment_status === 'paid';
  if (paidPayos) return false;
  return true;
}

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const orderNo = id ?? '';
  const { v, lang } = useLanguage();
  const isVi = lang === 'vi';

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);
  const [showCancel, setShowCancel] = useState(false);
  const [reason, setReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // Tracks mount status for the imperative post-cancel reload (which runs
  // outside the effect's own `active` guard).
  const mountedRef = useRef(true);
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Shared loader. `isAlive` lets the caller supply its own liveness check:
  // the effect passes a per-run `active` flag (also guarding out-of-order
  // resolutions); the imperative post-cancel reload uses mountedRef.
  const load = useCallback(
    (isAlive: () => boolean) => {
      if (!orderNo) {
        if (isAlive()) {
          setError(true);
          setLoading(false);
        }
        return;
      }
      setLoading(true);
      setError(false);
      getOrder(orderNo)
        .then((res) => {
          if (isAlive()) setOrder(res);
        })
        .catch(() => {
          if (isAlive()) setError(true);
        })
        .finally(() => {
          if (isAlive()) setLoading(false);
        });
    },
    [orderNo],
  );

  useEffect(() => {
    let active = true;
    load(() => active);
    return () => {
      active = false;
    };
  }, [load]);

  const copyTracking = (tracking: string) => {
    copyToClipboard(tracking);
    setCopiedTracking(tracking);
    setTimeout(() => {
      if (mountedRef.current) setCopiedTracking((cur) => (cur === tracking ? null : cur));
    }, 2000);
  };

  const handleCancel = async () => {
    if (cancelling) return;
    setCancelling(true);
    try {
      await cancelOrder(orderNo, reason.trim());
      toast.success(v('Order cancelled', 'Đã hủy đơn hàng'));
      setShowCancel(false);
      setReason('');
      load(() => mountedRef.current);
    } catch (err) {
      if (err instanceof ApiError && err.code === 'CANCEL_NOT_ALLOWED') {
        toast.error(v('This order can no longer be cancelled.', 'Đơn hàng này không thể hủy được nữa.'));
      } else {
        toast.error(err instanceof Error ? err.message : v('Could not cancel order', 'Không thể hủy đơn hàng'));
      }
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <AccountLayout>
        <div className="text-center py-20 bg-white" style={{ borderRadius: '10px', border: '2px solid #e0d8cf' }} data-testid="order-loading">
          <p style={{ fontSize: '14px', color: '#888' }}>{v('Loading order...', 'Đang tải đơn hàng...')}</p>
        </div>
      </AccountLayout>
    );
  }

  if (error || !order) {
    return (
      <AccountLayout>
        <div className="text-center py-20 bg-white" style={{ borderRadius: '10px', border: '2px solid #e0d8cf' }}>
          <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' }}>{v('Order not found', 'Không tìm thấy đơn hàng')}</p>
          <Link to="/account/orders" className="inline-block mt-4 px-6 py-3 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors" style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
            {v('Back to Orders', 'Về danh sách đơn')}
          </Link>
        </div>
      </AccountLayout>
    );
  }

  const badge = rootStatusLabel[order.status];
  const addr = order.shipping_address;
  // Flatten sub-order items for the items section while keeping brand/status labels.
  const flatItems = order.sub_orders.flatMap((sub) =>
    sub.items.map((item) => ({ item, sub })),
  );

  return (
    <AccountLayout>
      <div className="space-y-6">
        {/* Back + Header */}
        <div>
          <Link to="/account/orders" className="inline-flex items-center gap-2 mb-4 hover:gap-3 transition-all" style={{ fontSize: '12px', fontWeight: 600, color: '#d41c1c', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
            <ArrowLeft className="w-4 h-4" />{v('Back to Orders', 'Về danh sách đơn')}
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05 }}>{v('Order', 'Đơn hàng')} {order.order_no}</h1>
              <p style={{ fontSize: '14px', color: '#888' }}>{v('Placed on', 'Đặt ngày')} {new Date(order.created_at).toLocaleDateString(isVi ? 'vi-VN' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-1">
              <span
                className="self-start px-4 py-1.5"
                style={{ backgroundColor: badge.bg, color: badge.text, fontSize: '11px', fontWeight: 600, borderRadius: '9999px', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
              >
                {isVi ? badge.vi : badge.en}
              </span>
              <span style={{ fontSize: '12px', color: '#888' }}>{v('Payment:', 'Thanh toán:')} {order.payment_method.toUpperCase()} · {order.payment_status}</span>
            </div>
          </div>
          {order.status === 'cancelled' && order.cancel_reason && (
            <p className="mt-2" style={{ fontSize: '13px', color: '#d41c1c' }}>{v('Cancellation reason:', 'Lý do hủy:')} {order.cancel_reason}</p>
          )}
        </div>

        {/* Sub-orders with their items */}
        <DetailCard title={v('Order Items', 'Sản phẩm')} icon={Package}>
          <div className="space-y-6">
            {order.sub_orders.map((sub) => {
              const subLabel = subStatusLabel[sub.status];
              return (
                <div key={sub.id} className="pb-4" style={{ borderBottom: '1px solid #e0d8cf' }}>
                  <div className="flex items-center justify-between mb-3">
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#0d0d0d' }}>{sub.brand.name}</p>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#3B5998', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
                      {isVi ? subLabel.vi : subLabel.en}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {sub.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-20 h-20 flex-shrink-0 overflow-hidden" style={{ borderRadius: '4px', backgroundColor: '#f3f0eb' }}>
                          <ImageWithFallback src={item.image_url ?? ''} alt={item.product_name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{item.product_name}</p>
                          <p style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{item.variant_label}</p>
                          <p style={{ fontSize: '12px', color: '#888' }}>{v('Qty:', 'SL:')} {item.qty}</p>
                        </div>
                        <p style={{ fontSize: '16px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d' }}>{formatVND(item.line_total_vnd)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-1 mt-3 pt-3" style={{ borderTop: '1px dashed #e0d8cf' }}>
                    {sub.tracking_no && (
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: '12px', color: '#888' }}>{v('Tracking:', 'Mã vận đơn:')}</span>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#0d0d0d' }}>{sub.tracking_no}</span>
                        <button onClick={() => copyTracking(sub.tracking_no!)} className="p-1 hover:bg-[#f0ebe4] rounded transition-colors"><Copy className="w-3.5 h-3.5 text-[#888]" /></button>
                        {copiedTracking === sub.tracking_no && <span style={{ fontSize: '11px', color: '#d41c1c' }}>{v('Copied!', 'Đã sao chép!')}</span>}
                      </div>
                    )}
                    <div className="flex justify-between"><span style={{ fontSize: '13px', color: '#4a4a4a' }}>{v('Shipping fee', 'Phí vận chuyển')}</span><span style={{ fontSize: '13px', color: '#0d0d0d' }}>{formatVND(sub.shipping_fee_vnd)}</span></div>
                    <div className="flex justify-between"><span style={{ fontSize: '13px', color: '#4a4a4a' }}>{v('Sub-order total', 'Tổng đơn con')}</span><span style={{ fontSize: '13px', fontWeight: 600, color: '#0d0d0d' }}>{formatVND(sub.total_vnd)}</span></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Root totals */}
          <div className="mt-6 pt-4 space-y-2" style={{ borderTop: '2px solid #e0d8cf' }}>
            <div className="flex justify-between"><span style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Subtotal', 'Tạm tính')}</span><span style={{ fontSize: '14px', color: '#0d0d0d' }}>{formatVND(order.subtotal_vnd)}</span></div>
            <div className="flex justify-between"><span style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Shipping', 'Vận chuyển')}</span><span style={{ fontSize: '14px', color: '#0d0d0d' }}>{formatVND(order.shipping_total_vnd)}</span></div>
            <div className="flex justify-between pt-3" style={{ borderTop: '2px solid #e0d8cf' }}>
              <span style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' }}>{v('Total', 'Tổng cộng')}</span>
              <span style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#d41c1c' }}>{formatVND(order.grand_total_vnd)}</span>
            </div>
          </div>

          {/* Hidden flattened item count anchor (all items rendered above across sub-orders) */}
          <p className="sr-only" data-testid="flat-item-count">{flatItems.length}</p>
        </DetailCard>

        {/* Shipping & Payment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <DetailCard title={v('Shipping Address', 'Địa chỉ giao hàng')} icon={MapPin}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{addr.recipient}</p>
            <p style={{ fontSize: '14px', color: '#4a4a4a', marginTop: '4px' }}>{addr.line1}</p>
            <p style={{ fontSize: '14px', color: '#4a4a4a' }}>{addr.ward}, {addr.district}, {addr.city}</p>
            <p style={{ fontSize: '14px', color: '#888', marginTop: '8px' }}>{addr.phone}</p>
          </DetailCard>
          <DetailCard title={v('Payment Method', 'Thanh toán')} icon={CreditCard}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{order.payment_method.toUpperCase()}</p>
            <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>{v('Status:', 'Trạng thái:')} {order.payment_status}</p>
            <p style={{ fontSize: '14px', color: '#888', marginTop: '8px' }}>{v('Amount:', 'Số tiền:')} <span style={{ fontWeight: 600, color: '#0d0d0d' }}>{formatVND(order.grand_total_vnd)}</span></p>
          </DetailCard>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {canCancel(order) && !showCancel && (
            <button
              onClick={() => setShowCancel(true)}
              className="px-5 py-3 border-2 border-[#d41c1c] hover:bg-red-50 transition-colors"
              style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: '#d41c1c', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
            >
              {v('Cancel Order', 'Hủy đơn hàng')}
            </button>
          )}

          {/* Return — not supported yet */}
          <div className="relative">
            <button
              disabled
              className="px-5 py-3 border-2 border-[#e0d8cf] opacity-50 cursor-not-allowed"
              style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: '#4a4a4a', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
            >
              {v('Request Return', 'Yêu cầu đổi trả')}
            </button>
            <span style={{ fontSize: '11px', color: '#888', marginLeft: '8px' }}>{v('Not supported', 'Chưa hỗ trợ')}</span>
          </div>

          {/* Buy Again — not supported yet */}
          <div className="relative">
            <button
              disabled
              className="px-5 py-3 bg-[#e0d8cf] text-[#888] opacity-70 cursor-not-allowed"
              style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
            >
              {v('Buy Again', 'Mua lại')}
            </button>
            <span style={{ fontSize: '11px', color: '#888', marginLeft: '8px' }}>{v('Not supported', 'Chưa hỗ trợ')}</span>
          </div>
        </div>

        {/* Cancellation form */}
        {showCancel && (
          <DetailCard title={v('Cancel Order', 'Hủy đơn hàng')}>
            <p style={{ fontSize: '13px', color: '#4a4a4a', marginBottom: '12px' }}>{v('Tell us why you are cancelling (optional).', 'Cho chúng tôi biết lý do hủy (không bắt buộc).')}</p>
            <textarea
              data-testid="cancel-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder={v('Reason (optional)', 'Lý do (không bắt buộc)')}
              className="w-full p-3 border-2 border-[#e0d8cf] bg-[#fefcfa] focus:border-[#d41c1c] focus:outline-none transition-colors"
              style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Montserrat', sans-serif" }}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="px-5 py-3 bg-[#d41c1c] text-white hover:bg-[#b01616] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
              >
                {v('Confirm Cancel', 'Xác nhận hủy')}
              </button>
              <button
                onClick={() => { setShowCancel(false); setReason(''); }}
                disabled={cancelling}
                className="px-5 py-3 border-2 border-[#e0d8cf] hover:bg-[#f3f0eb] transition-colors disabled:opacity-50"
                style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: '#4a4a4a', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
              >
                {v('Keep Order', 'Giữ đơn hàng')}
              </button>
            </div>
          </DetailCard>
        )}
      </div>
    </AccountLayout>
  );
}
