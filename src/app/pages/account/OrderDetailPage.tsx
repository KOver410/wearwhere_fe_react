import { Link, useParams, useNavigate } from 'react-router';
import { ArrowLeft, Package, Truck, MapPin, CreditCard, Copy } from 'lucide-react';
import { useState } from 'react';
import { AccountLayout } from '@/app/components/AccountLayout';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { orders } from '@/app/data/accountMockData';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { copyToClipboard } from '@/app/utils/clipboard';

const statusSteps = ['Confirmed', 'Processing', 'Shipped', 'Delivered'];
const statusStepsVi = ['Xác nhận', 'Đang xử lý', 'Đang giao', 'Đã giao'];
const statusIndex: Record<string, number> = { pending: 0, processing: 1, shipped: 2, delivered: 3, cancelled: -1, returned: -1 };
const statusLabels: Record<string, { en: string; vi: string }> = {
  pending: { en: 'Pending', vi: 'Chờ xử lý' },
  processing: { en: 'Processing', vi: 'Đang xử lý' },
  shipped: { en: 'Shipped', vi: 'Đang giao' },
  delivered: { en: 'Delivered', vi: 'Đã giao' },
  cancelled: { en: 'Cancelled', vi: 'Đã hủy' },
  returned: { en: 'Returned', vi: 'Đã trả' },
};

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const order = orders.find(o => o.id === id);
  const [copied, setCopied] = useState(false);
  const { v, lang } = useLanguage();
  const isVi = lang === 'vi';

  if (!order) {
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

  const currentStep = statusIndex[order.status];
  const isCancelled = order.status === 'cancelled';

  const copyTracking = () => {
    if (order.trackingNumber) {
      copyToClipboard(order.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const Card = ({ children, title, icon: Icon }: { children: React.ReactNode; title: string; icon?: any }) => (
    <div className="bg-white p-6" style={{ borderRadius: '10px', border: '2px solid #e0d8cf', boxShadow: '0px 1px 3px rgba(0,0,0,0.05)' }}>
      <div className="flex items-center gap-2 mb-5">
        {Icon && <Icon className="w-5 h-5" style={{ color: '#d41c1c' }} />}
        <h2 style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' }}>{title}</h2>
      </div>
      {children}
    </div>
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
              <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05 }}>{v('Order', 'Đơn hàng')} {order.orderNumber}</h1>
              <p style={{ fontSize: '14px', color: '#888' }}>{v('Placed on', 'Đặt ngày')} {new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <span
              className="self-start px-4 py-1.5"
              style={{
                backgroundColor: isCancelled ? '#fce8e8' : '#E8F5E8',
                color: isCancelled ? '#d41c1c' : '#2D6A2D',
                fontSize: '11px', fontWeight: 600, borderRadius: '9999px', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif",
              }}
            >
              {isVi ? (statusLabels[order.status]?.vi ?? order.status) : (statusLabels[order.status]?.en ?? order.status.charAt(0).toUpperCase() + order.status.slice(1))}
            </span>
          </div>
        </div>

        {/* Status Timeline */}
        {!isCancelled && (
          <Card title={v('Order Status', 'Trạng thái đơn hàng')} icon={Truck}>
            <div className="flex items-center">
              {(isVi ? statusStepsVi : statusSteps).map((step, idx) => (
                <div key={step} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        idx <= currentStep ? 'text-white' : 'text-[#888]'
                      }`}
                      style={{ fontSize: '13px', fontWeight: 600, backgroundColor: idx <= currentStep ? '#d41c1c' : '#f0ebe4' }}
                    >
                      {idx + 1}
                    </div>
                    <span style={{ fontSize: '12px', color: idx <= currentStep ? '#0d0d0d' : '#888', marginTop: '6px', fontWeight: idx <= currentStep ? 600 : 400, textAlign: 'center' }}>
                      {step}
                    </span>
                  </div>
                  {idx < statusSteps.length - 1 && (
                    <div className="h-0.5 flex-1 -mt-5" style={{ backgroundColor: idx < currentStep ? '#d41c1c' : '#e0d8cf' }} />
                  )}
                </div>
              ))}
            </div>
            {order.trackingNumber && (
              <div className="flex items-center gap-2 mt-6 p-3" style={{ backgroundColor: '#fff9f2', borderRadius: '10px', border: '2px solid #e0d8cf' }}>
                <span style={{ fontSize: '13px', color: '#888' }}>{v('Tracking:', 'Mã vận đơn:')}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0d0d0d' }}>{order.trackingNumber}</span>
                <button onClick={copyTracking} className="p-1 hover:bg-[#f0ebe4] rounded transition-colors"><Copy className="w-3.5 h-3.5 text-[#888]" /></button>
                {copied && <span style={{ fontSize: '11px', color: '#d41c1c' }}>{v('Copied!', 'Đã sao chép!')}</span>}
              </div>
            )}
            {order.estimatedDelivery && (
              <p className="mt-3" style={{ fontSize: '13px', color: '#4a4a4a' }}>{v('Estimated delivery:', 'Dự kiến giao hàng:')} <span style={{ fontWeight: 600, color: '#0d0d0d' }}>{order.estimatedDelivery}</span></p>
            )}
          </Card>
        )}

        {/* Order Items */}
        <Card title={v('Order Items', 'Sản phẩm')} icon={Package}>
          <div className="space-y-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex gap-4 pb-4 last:border-b-0 last:pb-0" style={{ borderBottom: '1px solid #e0d8cf' }}>
                <div className="w-20 h-20 flex-shrink-0 overflow-hidden" style={{ borderRadius: '4px', backgroundColor: '#f3f0eb' }}>
                  <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{item.name}</p>
                  <p style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{item.brand}</p>
                  <p style={{ fontSize: '12px', color: '#888' }}>{v('Size', 'Size')}: {item.size} | {v('Color', 'Màu')}: {item.color} | {v('Qty', 'SL')}: {item.quantity}</p>
                </div>
                <p style={{ fontSize: '16px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d' }}>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 pt-4 space-y-2" style={{ borderTop: '2px solid #e0d8cf' }}>
            <div className="flex justify-between"><span style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Subtotal', 'Tạm tính')}</span><span style={{ fontSize: '14px', color: '#0d0d0d' }}>${order.subtotal.toFixed(2)}</span></div>
            {order.discount > 0 && <div className="flex justify-between"><span style={{ fontSize: '14px', color: '#e2b93b' }}>{v('Discount', 'Giảm giá')}</span><span style={{ fontSize: '14px', color: '#e2b93b' }}>-${order.discount.toFixed(2)}</span></div>}
            <div className="flex justify-between"><span style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Shipping', 'Vận chuyển')}</span><span style={{ fontSize: '14px', color: order.shipping === 0 ? '#e2b93b' : '#0d0d0d', fontWeight: order.shipping === 0 ? 600 : 400 }}>{order.shipping === 0 ? v('FREE', 'MIỄN PHÍ') : `$${order.shipping.toFixed(2)}`}</span></div>
            <div className="flex justify-between"><span style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Tax', 'Thuế')}</span><span style={{ fontSize: '14px', color: '#0d0d0d' }}>${order.tax.toFixed(2)}</span></div>
            <div className="flex justify-between pt-3" style={{ borderTop: '2px solid #e0d8cf' }}>
              <span style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' }}>{v('Total', 'Tổng cộng')}</span>
              <span style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#d41c1c' }}>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* Shipping & Payment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card title={v('Shipping Address', 'Địa chỉ giao hàng')} icon={MapPin}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{order.shippingAddress.fullName}</p>
            <p style={{ fontSize: '14px', color: '#4a4a4a', marginTop: '4px' }}>{order.shippingAddress.street}</p>
            <p style={{ fontSize: '14px', color: '#4a4a4a' }}>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
            <p style={{ fontSize: '14px', color: '#4a4a4a' }}>{order.shippingAddress.country}</p>
            <p style={{ fontSize: '14px', color: '#888', marginTop: '8px' }}>{order.shippingAddress.phone}</p>
          </Card>
          <Card title={v('Payment Method', 'Thanh toán')} icon={CreditCard}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{order.paymentMethod}</p>
            <p style={{ fontSize: '14px', color: '#888', marginTop: '8px' }}>{v('Amount charged:', 'Số tiền:')} <span style={{ fontWeight: 600, color: '#0d0d0d' }}>${order.total.toFixed(2)}</span></p>
          </Card>
        </div>

        {/* Actions */}
        {order.status === 'delivered' && (
          <div className="flex gap-3">
            <Link to={`/account/orders/${order.id}/return`} className="px-5 py-3 border-2 border-[#d41c1c] hover:bg-red-50 transition-colors" style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: '#d41c1c', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
              {v('Request Return', 'Yêu cầu đổi trả')}
            </Link>
            <button onClick={() => { alert(v('Items added to cart!', 'Đã thêm sản phẩm vào giỏ hàng!')); navigate('/cart'); }} className="px-5 py-3 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors" style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
              {v('Buy Again', 'Mua lại')}
            </button>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}