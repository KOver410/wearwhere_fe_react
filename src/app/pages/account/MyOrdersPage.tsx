import { useState } from 'react';
import { Link } from 'react-router';
import { Package, Search, Eye } from 'lucide-react';
import { AccountLayout } from '@/app/components/AccountLayout';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { orders } from '@/app/data/accountMockData';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { formatVnd } from '@/app/utils/currency';

const statusLabels: Record<string, { en: string; vi: string }> = {
  pending: { en: 'Pending', vi: 'Chờ xử lý' },
  processing: { en: 'Processing', vi: 'Đang xử lý' },
  shipped: { en: 'Shipped', vi: 'Đang giao' },
  delivered: { en: 'Delivered', vi: 'Đã giao' },
  cancelled: { en: 'Cancelled', vi: 'Đã hủy' },
  returned: { en: 'Returned', vi: 'Đã trả' },
};

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: '#FAF0DC', text: '#8B6914', label: 'Pending' },
  processing: { bg: '#E8EDF5', text: '#3B5998', label: 'Processing' },
  shipped: { bg: '#E8F5E8', text: '#2D6A2D', label: 'Shipped' },
  delivered: { bg: '#E8F5E8', text: '#2D6A2D', label: 'Delivered' },
  cancelled: { bg: '#fce8e8', text: '#d41c1c', label: 'Cancelled' },
  returned: { bg: '#f3f0eb', text: '#4a4a4a', label: 'Returned' },
};

export function MyOrdersPage() {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { v, lang } = useLanguage();
  const isVi = lang === 'vi';

  const filtered = orders.filter(o => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (searchQuery && !o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) && !o.items.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    return true;
  });

  const tabs = [
    { key: 'all', label: v('All', 'Tất cả') },
    { key: 'processing', label: v('Processing', 'Đang xử lý') },
    { key: 'shipped', label: v('Shipped', 'Đang giao') },
    { key: 'delivered', label: v('Delivered', 'Đã giao') },
    { key: 'cancelled', label: v('Cancelled', 'Đã hủy') },
  ];

  return (
    <AccountLayout>
      <div className="space-y-6">
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05 }}>{v('My Orders', 'Đơn hàng của tôi')}</h1>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={v('Search by order number or product...', 'Tìm theo mã đơn hoặc sản phẩm...')}
            className="w-full pl-11 pr-4 py-3 border-2 border-[#e0d8cf] bg-[#fefcfa] focus:border-[#d41c1c] focus:outline-none transition-colors"
            style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Montserrat', sans-serif" }}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-shrink-0 px-4 py-2 transition-colors ${
                filter === tab.key ? 'bg-[#d41c1c] text-white' : 'bg-white border-2 border-[#e0d8cf] text-[#4a4a4a] hover:bg-[#f3f0eb]'
              }`}
              style={{ borderRadius: '9999px', fontSize: '13px', letterSpacing: '0.03em' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white" style={{ borderRadius: '10px', border: '2px solid #e0d8cf' }}>
            <Package className="w-16 h-16 mx-auto text-[#e0d8cf] mb-4" />
            <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '8px' }}>{v('No orders found', 'Không tìm thấy đơn hàng')}</p>
            <Link to="/shop" className="inline-block mt-4 px-6 py-3 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors" style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
              {v('Start Shopping', 'Bắt đầu mua sắm')}
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(order => {
              const sc = statusColors[order.status];
              return (
                <div
                  key={order.id}
                  className="bg-white p-5"
                  style={{ borderRadius: '10px', border: '2px solid #e0d8cf', boxShadow: '0px 1px 3px rgba(0,0,0,0.05)' }}
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4" style={{ borderBottom: '1px solid #e0d8cf' }}>
                    <div className="flex items-center gap-4">
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{order.orderNumber}</p>
                        <p style={{ fontSize: '12px', color: '#888' }}>{new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                      <span className="px-3 py-1" style={{ backgroundColor: sc.bg, color: sc.text, fontSize: '11px', fontWeight: 600, borderRadius: '9999px', letterSpacing: '0.05em', fontFamily: "'Oswald', sans-serif" }}>
                        {isVi ? statusLabels[order.status]?.vi : sc.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d' }}>{formatVnd(order.total)}</span>
                      <Link
                        to={`/account/orders/${order.id}`}
                        className="flex items-center gap-1 px-4 py-2 border-2 border-[#e0d8cf] hover:bg-[#f3f0eb] transition-colors"
                        style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: '#d41c1c', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
                      >
                        <Eye className="w-4 h-4" />
                        {v('Details', 'Chi tiết')}
                      </Link>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-14 h-14 flex-shrink-0 overflow-hidden" style={{ borderRadius: '4px', backgroundColor: '#f3f0eb' }}>
                          <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate" style={{ fontSize: '14px', color: '#0d0d0d' }}>{v(item.name, item.nameVi)}</p>
                          <p style={{ fontSize: '12px', color: '#888' }}>{item.brand} · {v('Size', 'Size')}: {item.size} · {v('Qty', 'SL')}: {item.quantity}</p>
                        </div>
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{formatVnd(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  {order.status === 'delivered' && (
                    <div className="flex gap-2 mt-4 pt-4" style={{ borderTop: '1px solid #e0d8cf' }}>
                      <Link
                        to={`/account/orders/${order.id}/return`}
                        className="px-4 py-2 border-2 border-[#e0d8cf] hover:bg-[#f3f0eb] transition-colors"
                        style={{ borderRadius: '10px', fontSize: '12px', color: '#4a4a4a', letterSpacing: '0.05em', textTransform: 'uppercase' }}
                      >
                        {v('Request Return', 'Yêu cầu đổi trả')}
                      </Link>
                      <button
                        className="px-4 py-2 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors"
                        style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
                      >
                        {v('Buy Again', 'Mua lại')}
                      </button>
                    </div>
                  )}
                  {order.trackingNumber && order.status === 'shipped' && (
                    <div className="flex items-center gap-2 mt-4 pt-4" style={{ borderTop: '1px solid #e0d8cf' }}>
                      <span style={{ fontSize: '13px', color: '#888' }}>{v('Tracking:', 'Mã vận đơn:')}</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#0d0d0d' }}>{order.trackingNumber}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
