import { Link } from 'react-router';
import { RotateCcw, Eye } from 'lucide-react';
import { AccountLayout } from '@/app/components/AccountLayout';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { returns } from '@/app/data/accountMockData';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { formatVnd } from '@/app/utils/currency';

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#FAF0DC', text: '#8B6914' },
  approved: { bg: '#E8EDF5', text: '#3B5998' },
  rejected: { bg: '#fce8e8', text: '#d41c1c' },
  completed: { bg: '#E8F5E8', text: '#2D6A2D' },
};

const statusLabels: Record<string, { en: string; vi: string }> = {
  pending: { en: 'Pending', vi: 'Chờ xử lý' },
  approved: { en: 'Approved', vi: 'Đã duyệt' },
  rejected: { en: 'Rejected', vi: 'Từ chối' },
  completed: { en: 'Completed', vi: 'Hoàn tất' },
};

export function MyReturnsPage() {
  const { v, lang } = useLanguage();
  const isVi = lang === 'vi';
  return (
    <AccountLayout>
      <div className="space-y-6">
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05 }}>{v('My Returns', 'Đổi trả của tôi')}</h1>

        {returns.length === 0 ? (
          <div className="text-center py-16 bg-white" style={{ borderRadius: '10px', border: '2px solid #e0d8cf' }}>
            <RotateCcw className="w-16 h-16 mx-auto text-[#e0d8cf] mb-4" />
            <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '8px' }}>{v('No returns yet', 'Chưa có đổi trả')}</p>
            <p style={{ fontSize: '14px', color: '#888' }}>{v("You haven't made any return requests", 'Bạn chưa có yêu cầu đổi trả nào')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {returns.map(ret => {
              const sc = statusColors[ret.status];
              return (
                <div key={ret.id} className="bg-white p-5" style={{ borderRadius: '10px', border: '2px solid #e0d8cf', boxShadow: '0px 1px 3px rgba(0,0,0,0.05)' }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid #e0d8cf' }}>
                    <div>
                      <div className="flex items-center gap-3">
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{v('Return', 'Đổi trả')} #{ret.id.toUpperCase()}</p>
                        <span className="px-3 py-1 capitalize" style={{ backgroundColor: sc.bg, color: sc.text, fontSize: '11px', fontWeight: 600, borderRadius: '9999px', letterSpacing: '0.05em', fontFamily: "'Oswald', sans-serif" }}>
                          {isVi ? (statusLabels[ret.status]?.vi ?? ret.status) : (statusLabels[ret.status]?.en ?? ret.status)}
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                        {v('From order', 'Từ đơn hàng')} {ret.orderNumber} · {v('Submitted', 'Gửi ngày')} {new Date(ret.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <Link to={`/account/orders/${ret.orderId}`} className="flex items-center gap-1 px-4 py-2 border-2 border-[#e0d8cf] hover:bg-[#f3f0eb] transition-colors" style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: '#d41c1c', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
                      <Eye className="w-4 h-4" />{v('View Order', 'Xem đơn')}
                    </Link>
                  </div>

                  <div className="space-y-3 mb-4">
                    {ret.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-14 h-14 flex-shrink-0 overflow-hidden" style={{ borderRadius: '4px', backgroundColor: '#f3f0eb' }}>
                          <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate" style={{ fontSize: '14px', color: '#0d0d0d' }}>{v(item.name, item.nameVi)}</p>
                          <p style={{ fontSize: '12px', color: '#888' }}>{item.brand} · {v('Size', 'Size')}: {item.size}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3" style={{ backgroundColor: '#fff9f2', borderRadius: '10px', border: '2px solid #e0d8cf' }}>
                    <div className="flex items-center justify-between mb-1">
                      <span style={{ fontSize: '13px', color: '#4a4a4a' }}>{v('Reason:', 'Lý do:')} {v(ret.reason, ret.reasonVi)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: '13px', color: '#4a4a4a' }}>{v('Refund:', 'Hoàn tiền:')} {v(ret.refundMethod, ret.refundMethodVi)}</span>
                      <span style={{ fontSize: '16px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#d41c1c' }}>{formatVnd(ret.refundAmount)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
