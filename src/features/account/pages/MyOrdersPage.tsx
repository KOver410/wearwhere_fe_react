import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Package, Eye } from 'lucide-react';
import { AccountLayout } from '@/shared/components/AccountLayout';
import { ImageWithFallback } from '@/shared/components/figma/ImageWithFallback';
import {
  listOrders,
  type OrderListItem,
  type OrderListResponse,
  type OrderStatus,
} from '@/features/account/api/orderApi';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { formatVND } from '@/shared/utils/currency';

const PAGE_SIZE = 10;

/** Tab key -> backend root status. `all` maps to no status filter. */
type TabKey = 'all' | OrderStatus;

const statusBadge: Record<OrderStatus, { bg: string; text: string; en: string; vi: string }> = {
  pending_payment: { bg: '#FAF0DC', text: '#8B6914', en: 'Pending payment', vi: 'Chờ thanh toán' },
  processing: { bg: '#E8EDF5', text: '#3B5998', en: 'Processing', vi: 'Đang xử lý' },
  completed: { bg: '#E8F5E8', text: '#2D6A2D', en: 'Completed', vi: 'Hoàn thành' },
  cancelled: { bg: '#fce8e8', text: '#d41c1c', en: 'Cancelled', vi: 'Đã hủy' },
};

export function MyOrdersPage() {
  const { v, lang } = useLanguage();
  const isVi = lang === 'vi';

  const [tab, setTab] = useState<TabKey>('all');
  const [page, setPage] = useState(1);
  const [response, setResponse] = useState<OrderListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Guarded fetch: React runs the previous effect's cleanup (setting the prior
  // `active = false`) before running the next, so out-of-order resolutions from
  // overlapping tab/page changes are ignored and no state is set after unmount.
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    listOrders({
      status: tab === 'all' ? undefined : tab,
      page,
      page_size: PAGE_SIZE,
    })
      .then((res) => {
        if (active) setResponse(res);
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
  }, [tab, page, reloadKey]);

  const handleTab = (key: TabKey) => {
    setTab(key);
    setPage(1);
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'all', label: v('All', 'Tất cả') },
    { key: 'pending_payment', label: v('Pending payment', 'Chờ thanh toán') },
    { key: 'processing', label: v('Processing', 'Đang xử lý') },
    { key: 'completed', label: v('Completed', 'Hoàn thành') },
    { key: 'cancelled', label: v('Cancelled', 'Đã hủy') },
  ];

  const orders = response?.data ?? [];
  const totalPages = response?.total_pages ?? 0;
  const currentPage = response?.page ?? page;

  return (
    <AccountLayout>
      <div className="space-y-6">
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05 }}>{v('My Orders', 'Đơn hàng của tôi')}</h1>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => handleTab(t.key)}
              className={`flex-shrink-0 px-4 py-2 transition-colors ${
                tab === t.key ? 'bg-[#d41c1c] text-white' : 'bg-white border-2 border-[#e0d8cf] text-[#4a4a4a] hover:bg-[#f3f0eb]'
              }`}
              style={{ borderRadius: '9999px', fontSize: '13px', letterSpacing: '0.03em' }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16 bg-white" style={{ borderRadius: '10px', border: '2px solid #e0d8cf' }} data-testid="orders-loading">
            <p style={{ fontSize: '14px', color: '#888' }}>{v('Loading orders...', 'Đang tải đơn hàng...')}</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-16 bg-white" style={{ borderRadius: '10px', border: '2px solid #e0d8cf' }}>
            <p style={{ fontSize: '16px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '12px' }}>{v('Could not load orders', 'Không thể tải đơn hàng')}</p>
            <button
              onClick={() => setReloadKey((k) => k + 1)}
              className="inline-block mt-2 px-6 py-3 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors"
              style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
            >
              {v('Retry', 'Thử lại')}
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-16 bg-white" style={{ borderRadius: '10px', border: '2px solid #e0d8cf' }}>
            <Package className="w-16 h-16 mx-auto text-[#e0d8cf] mb-4" />
            <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '8px' }}>{v('No orders found', 'Chưa có đơn hàng')}</p>
            <Link to="/shop" className="inline-block mt-4 px-6 py-3 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors" style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
              {v('Start Shopping', 'Bắt đầu mua sắm')}
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order: OrderListItem) => {
              const badge = statusBadge[order.status];
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
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{order.order_no}</p>
                        <p style={{ fontSize: '12px', color: '#888' }}>{new Date(order.created_at).toLocaleDateString(isVi ? 'vi-VN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                      <span className="px-3 py-1" style={{ backgroundColor: badge.bg, color: badge.text, fontSize: '11px', fontWeight: 600, borderRadius: '9999px', letterSpacing: '0.05em', fontFamily: "'Oswald', sans-serif" }}>
                        {isVi ? badge.vi : badge.en}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d' }}>{formatVND(order.grand_total_vnd)}</span>
                      <Link
                        to={`/account/orders/${order.order_no}`}
                        className="flex items-center gap-1 px-4 py-2 border-2 border-[#e0d8cf] hover:bg-[#f3f0eb] transition-colors"
                        style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: '#d41c1c', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
                      >
                        <Eye className="w-4 h-4" />
                        {v('Details', 'Chi tiết')}
                      </Link>
                    </div>
                  </div>

                  {/* First-item summary (list response only carries the first item). */}
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 flex-shrink-0 overflow-hidden" style={{ borderRadius: '4px', backgroundColor: '#f3f0eb' }}>
                      <ImageWithFallback src={order.first_item_image ?? ''} alt={order.first_item_name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate" style={{ fontSize: '14px', color: '#0d0d0d' }}>{order.first_item_name}</p>
                      <p style={{ fontSize: '12px', color: '#888' }}>
                        {v(`${order.item_count} item(s)`, `${order.item_count} sản phẩm`)} · {v(`${order.brand_count} brand(s)`, `${order.brand_count} thương hiệu`)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-2" data-testid="orders-pagination">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="px-4 py-2 border-2 border-[#e0d8cf] hover:bg-[#f3f0eb] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: '#4a4a4a', letterSpacing: '0.05em', textTransform: 'uppercase' }}
                >
                  {v('Prev', 'Trước')}
                </button>
                <span style={{ fontSize: '13px', color: '#4a4a4a' }}>
                  {v(`Page ${currentPage} of ${totalPages}`, `Trang ${currentPage} / ${totalPages}`)}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="px-4 py-2 border-2 border-[#e0d8cf] hover:bg-[#f3f0eb] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: '#4a4a4a', letterSpacing: '0.05em', textTransform: 'uppercase' }}
                >
                  {v('Next', 'Sau')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
