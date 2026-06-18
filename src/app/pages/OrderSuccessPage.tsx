import { Link } from 'react-router';
import { CheckCircle, Package, Truck, MapPin, Copy, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { products as allProducts } from '@/app/data/mockData';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { copyToClipboard } from '@/app/utils/clipboard';

export function OrderSuccessPage() {
  const [copied, setCopied] = useState(false);
  const { v } = useLanguage();
  const orderNumber = 'WW-2026022201';
  const estimatedDelivery = 'Feb 27 - Mar 01, 2026';

  const orderedItems = [
    { ...allProducts[0], quantity: 1, size: 'M', selectedColor: 'Brown' },
    { ...allProducts[1], quantity: 1, size: 'L', selectedColor: 'White' },
    { ...allProducts[10], quantity: 2, size: 'One Size', selectedColor: 'Brown' },
  ];

  const subtotal = orderedItems.reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0);
  const shipping = 0;
  const discount = subtotal * 0.1;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;

  const copyOrderNumber = () => {
    copyToClipboard(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const recommendedProducts = allProducts.filter(p => !orderedItems.find(o => o.id === p.id)).slice(0, 4);

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
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{orderNumber}</span>
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

        {/* Delivery Timeline */}
        <div
          className="bg-white p-6 mb-6"
          style={{ borderRadius: '10px', border: '2px solid #e0d8cf', boxShadow: '0px 1px 3px rgba(0,0,0,0.05)' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Truck className="w-5 h-5" style={{ color: '#d41c1c' }} />
            <h2 style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' }}>{v('Delivery Info', 'Thông tin giao hàng')}</h2>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center mb-6">
            {[
              { label: v('Confirmed', 'Xác nhận'), active: true },
              { label: v('Processing', 'Đang xử lý'), active: false },
              { label: v('Shipped', 'Đã gửi'), active: false },
              { label: v('Delivered', 'Đã giao'), active: false },
            ].map((step, idx) => (
              <div key={step.label} className="flex-1 flex items-center">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.active ? 'text-white' : 'text-[#888]'
                    }`}
                    style={{ fontSize: '12px', fontWeight: 600, backgroundColor: step.active ? '#d41c1c' : '#f0ebe4' }}
                  >
                    {idx + 1}
                  </div>
                  <span style={{ fontSize: '11px', color: step.active ? '#0d0d0d' : '#888', marginTop: '4px', fontWeight: step.active ? 600 : 400 }}>
                    {step.label}
                  </span>
                </div>
                {idx < 3 && (
                  <div className={`h-0.5 flex-1 ${step.active ? 'bg-[#d41c1c]' : 'bg-[#e0d8cf]'}`} />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-start gap-3 p-4" style={{ backgroundColor: '#fff9f2', borderRadius: '10px', border: '2px solid #e0d8cf' }}>
            <MapPin className="w-5 h-5 mt-0.5" style={{ color: '#e2b93b' }} />
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{v('Estimated Delivery', 'Dự kiến giao hàng')}</p>
              <p style={{ fontSize: '14px', color: '#4a4a4a' }}>{estimatedDelivery}</p>
              <p style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
                123 Nguyen Hue Street, District 1, Ho Chi Minh City
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div
          className="bg-white p-6 mb-6"
          style={{ borderRadius: '10px', border: '2px solid #e0d8cf', boxShadow: '0px 1px 3px rgba(0,0,0,0.05)' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-5 h-5" style={{ color: '#d41c1c' }} />
            <h2 style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' }}>
              {v('Order Items', 'Sản phẩm')} ({orderedItems.length})
            </h2>
          </div>

          <div className="space-y-4">
            {orderedItems.map((item, idx) => (
              <div key={idx} className="flex gap-4 pb-4 last:border-b-0 last:pb-0" style={{ borderBottom: '1px solid #e0d8cf' }}>
                <div className="w-20 h-20 flex-shrink-0 overflow-hidden" style={{ borderRadius: '4px', backgroundColor: '#f3f0eb' }}>
                  <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{item.name}</p>
                  <p style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                    {v('Size', 'Kích cỡ')}: {item.size} | {v('Color', 'Màu')}: {item.selectedColor} | {v('Qty', 'SL')}: {item.quantity}
                  </p>
                  <p style={{ fontSize: '12px', color: '#888' }}>{item.brand}</p>
                </div>
                <div className="text-right">
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>
                    ${((item.salePrice || item.price) * item.quantity).toFixed(2)}
                  </p>
                  {item.salePrice && (
                    <p className="line-through" style={{ fontSize: '12px', color: '#888' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="mt-6 pt-4 space-y-2" style={{ borderTop: '2px solid #e0d8cf' }}>
            <div className="flex justify-between">
              <span style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Subtotal', 'Tạm tính')}</span>
              <span style={{ fontSize: '14px', color: '#0d0d0d' }}>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontSize: '14px', color: '#e2b93b' }}>{v('Discount (10%)', 'Giảm giá (10%)')}</span>
              <span style={{ fontSize: '14px', color: '#e2b93b' }}>-${discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Shipping', 'Phí vận chuyển')}</span>
              <span style={{ fontSize: '14px', color: '#e2b93b', fontWeight: 600 }}>{v('FREE', 'MIỄN PHÍ')}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Tax', 'Thuế')}</span>
              <span style={{ fontSize: '14px', color: '#0d0d0d' }}>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-3" style={{ borderTop: '2px solid #e0d8cf' }}>
              <span style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' }}>{v('Total', 'Tổng cộng')}</span>
              <span style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#d41c1c' }}>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-12">
          <Link
            to="/shop"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors"
            style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
          >
            {v('Continue Shopping', 'Tiếp tục mua sắm')}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-[#0d0d0d] hover:bg-[#f3f0eb] transition-colors"
            style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: '#0d0d0d', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
          >
            {v('Back to Home', 'Về trang chủ')}
          </Link>
        </div>

        {/* Recommended Products */}
        <div>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '24px', lineHeight: 1.05 }}>
            {v('Recommended For You', 'Gợi ý cho bạn')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommendedProducts.map(product => (
              <Link key={product.id} to={`/product/${product.id}`} className="group">
                <div className="relative overflow-hidden aspect-[3/4] mb-2" style={{ borderRadius: '4px', backgroundColor: '#f3f0eb' }}>
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <p style={{ fontSize: '12px', color: '#888' }}>{product.brand}</p>
                <p className="line-clamp-1" style={{ fontSize: '14px', color: '#0d0d0d', marginBottom: '2px' }}>{product.name}</p>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#d41c1c' }}>
                  ${(product.salePrice || product.price).toFixed(0)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
