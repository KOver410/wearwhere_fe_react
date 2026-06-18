import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import { AccountLayout } from '@/shared/components/AccountLayout';
import { ImageWithFallback } from '@/shared/components/figma/ImageWithFallback';
import { orders } from '@/shared/data/accountMockData';
import { useLanguage } from '@/shared/i18n/LanguageContext';

const reasons = ['Size doesn\'t fit', 'Product quality not as expected', 'Wrong item received', 'Product damaged during shipping', 'Changed my mind', 'Other'];
const reasonsVi = ['Không vừa size', 'Chất lượng không như mong đợi', 'Nhận sai sản phẩm', 'Sản phẩm bị hư hỏng khi vận chuyển', 'Đổi ý', 'Lý do khác'];

export function ReturnRequestPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const order = orders.find(o => o.id === id);
  const { v, lang } = useLanguage();
  const isVi = lang === 'vi';
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [refundMethod, setRefundMethod] = useState('original');
  const [submitted, setSubmitted] = useState(false);

  if (!order || order.status !== 'delivered') {
    return (
      <AccountLayout>
        <div className="text-center py-20 bg-white" style={{ borderRadius: '10px', border: '2px solid #e0d8cf' }}>
          <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' }}>{v('Order not eligible for return', 'Đơn hàng không đủ điều kiện đổi trả')}</p>
          <Link to="/account/orders" className="inline-block mt-4 px-6 py-3 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors" style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
            {v('Back to Orders', 'Về danh sách đơn')}
          </Link>
        </div>
      </AccountLayout>
    );
  }

  const toggleItem = (itemId: number) => {
    setSelectedItems(prev => prev.includes(itemId) ? prev.filter(i => i !== itemId) : [...prev, itemId]);
  };

  const refundAmount = order.items.filter(i => selectedItems.includes(i.id)).reduce((sum, i) => sum + i.price * i.quantity, 0);
  const handleSubmit = () => { setSubmitted(true); };

  if (submitted) {
    return (
      <AccountLayout>
        <div className="text-center py-16 bg-white" style={{ borderRadius: '10px', border: '2px solid #e0d8cf' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#d41c1c' }}>
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 style={{ fontSize: '24px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '8px' }}>{v('Return Request Submitted', 'Yêu cầu đổi trả đã gửi')}</h2>
          <p style={{ fontSize: '14px', color: '#4a4a4a', maxWidth: '400px', margin: '0 auto 24px' }}>
            {v("We'll review your request within 1-2 business days.", 'Chúng tôi sẽ xem xét yêu cầu trong 1-2 ngày làm việc.')}
          </p>
          <div className="flex justify-center gap-3">
            <Link to="/account/returns" className="px-6 py-3 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors" style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>{v('View My Returns', 'Xem đổi trả')}</Link>
            <Link to="/account/orders" className="px-6 py-3 border-2 border-[#0d0d0d] hover:bg-[#f3f0eb] transition-colors" style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: '#0d0d0d', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>{v('Back to Orders', 'Về danh sách đơn')}</Link>
          </div>
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout>
      <div className="space-y-6">
        <div>
          <Link to={`/account/orders/${id}`} className="inline-flex items-center gap-2 mb-4 hover:gap-3 transition-all" style={{ fontSize: '12px', fontWeight: 600, color: '#d41c1c', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
            <ArrowLeft className="w-4 h-4" />{v('Back to Order', 'Về đơn hàng')}
          </Link>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05 }}>{v('Request Return', 'Yêu cầu đổi trả')}</h1>
          <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>Order {order.orderNumber}</p>
        </div>

        {/* Select Items */}
        <div className="bg-white p-6" style={{ borderRadius: '10px', border: '2px solid #e0d8cf' }}>
          <h2 style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '16px' }}>{v('Select items to return', 'Chọn sản phẩm cần đổi trả')}</h2>
          <div className="space-y-3">
            {order.items.map(item => (
              <label key={item.id} className={`flex items-center gap-4 p-4 border-2 cursor-pointer transition-colors ${selectedItems.includes(item.id) ? 'border-[#d41c1c] bg-[#fff9f2]' : 'border-[#e0d8cf] hover:border-[#d41c1c]'}`} style={{ borderRadius: '10px' }}>
                <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => toggleItem(item.id)} className="w-5 h-5 accent-[#d41c1c]" />
                <div className="w-16 h-16 flex-shrink-0 overflow-hidden" style={{ borderRadius: '4px', backgroundColor: '#f3f0eb' }}>
                  <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{item.name}</p>
                  <p style={{ fontSize: '12px', color: '#888' }}>Size: {item.size} | Color: {item.color} | Qty: {item.quantity}</p>
                </div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>${item.price.toFixed(2)}</p>
              </label>
            ))}
          </div>
        </div>

        {/* Reason */}
        <div className="bg-white p-6" style={{ borderRadius: '10px', border: '2px solid #e0d8cf' }}>
          <h2 style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '16px' }}>{v('Reason for return', 'Lý do đổi trả')}</h2>
          <div className="space-y-2 mb-4">
            {(isVi ? reasonsVi : reasons).map(r => (
              <label key={r} className={`flex items-center gap-3 p-3 border-2 cursor-pointer transition-colors ${reason === r ? 'border-[#d41c1c] bg-[#fff9f2]' : 'border-[#e0d8cf] hover:border-[#d41c1c]'}`} style={{ borderRadius: '10px' }}>
                <input type="radio" name="reason" checked={reason === r} onChange={() => setReason(r)} className="w-4 h-4 accent-[#d41c1c]" />
                <span style={{ fontSize: '14px', color: '#0d0d0d' }}>{r}</span>
              </label>
            ))}
          </div>
          <textarea
            value={details} onChange={e => setDetails(e.target.value)}
            placeholder={v('Additional details (optional)...', 'Chi tiết bổ sung (không bắt buộc)...')}
            className="w-full px-4 py-3 border-2 border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors resize-none"
            style={{ borderRadius: '10px', fontSize: '14px', minHeight: '100px', backgroundColor: '#fefcfa', fontFamily: "'Montserrat', sans-serif" }}
          />
          <div className="mt-4 p-4 border-2 border-dashed border-[#e0d8cf] text-center cursor-pointer hover:border-[#d41c1c] transition-colors" style={{ borderRadius: '10px' }}>
            <Upload className="w-6 h-6 mx-auto text-[#888] mb-2" />
            <p style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Upload photos (optional)', 'Tải ảnh lên (không bắt buộc)')}</p>
            <p style={{ fontSize: '12px', color: '#888' }}>JPG, PNG up to 5MB each</p>
          </div>
        </div>

        {/* Refund Method */}
        <div className="bg-white p-6" style={{ borderRadius: '10px', border: '2px solid #e0d8cf' }}>
          <h2 style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '16px' }}>{v('Refund method', 'Phương thức hoàn tiền')}</h2>
          <div className="space-y-2">
            {[{ key: 'original', label: v('Original payment method', 'Hoàn về phương thức thanh toán ban đầu'), desc: v('Refund to your original payment method (3-5 business days)', 'Hoàn tiền về phương thức thanh toán ban đầu (3-5 ngày làm việc)') },
              { key: 'credit', label: v('Store credit', 'Tín dụng cửa hàng'), desc: v('Get instant store credit to use on your next purchase', 'Nhận tín dụng cửa hàng ngay để dùng cho đơn hàng tiếp theo') },
            ].map(m => (
              <label key={m.key} className={`flex items-start gap-3 p-4 border-2 cursor-pointer transition-colors ${refundMethod === m.key ? 'border-[#d41c1c] bg-[#fff9f2]' : 'border-[#e0d8cf] hover:border-[#d41c1c]'}`} style={{ borderRadius: '10px' }}>
                <input type="radio" name="refund" checked={refundMethod === m.key} onChange={() => setRefundMethod(m.key)} className="w-4 h-4 accent-[#d41c1c] mt-0.5" />
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{m.label}</p>
                  <p style={{ fontSize: '12px', color: '#888' }}>{m.desc}</p>
                </div>
              </label>
            ))}
          </div>
          {selectedItems.length > 0 && (
            <div className="mt-4 p-4" style={{ backgroundColor: '#fff9f2', borderRadius: '10px', border: '2px solid #e0d8cf' }}>
              <div className="flex justify-between">
                <span style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Estimated refund', 'Ước tính hoàn tiền')}</span>
                <span style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#d41c1c' }}>${refundAmount.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={selectedItems.length === 0 || !reason}
          className="w-full py-3.5 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors disabled:bg-[#e0d8cf] disabled:cursor-not-allowed"
          style={{ borderRadius: '10px', fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
        >
          {v('Submit Return Request', 'Gửi yêu cầu đổi trả')}
        </button>
      </div>
    </AccountLayout>
  );
}
