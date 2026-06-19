import { useState } from 'react';
import { Link } from 'react-router';
import { Bell, ShoppingBag, Tag, Users, Settings, Check, Trash2, ChevronRight, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { notifications as initialNotifications, type Notification } from '@/app/data/accountMockData';
import { useLanguage } from '@/app/i18n/LanguageContext';

const typeConfig: Record<string, { icon: any; color: string; bgColor: string; label: string; labelVi: string }> = {
  order: { icon: ShoppingBag, color: '#d41c1c', bgColor: '#fce8e8', label: 'Order', labelVi: 'Đơn hàng' },
  promo: { icon: Tag, color: '#e2b93b', bgColor: '#faf0dc', label: 'Promo', labelVi: 'Khuyến mãi' },
  social: { icon: Users, color: '#4a4a4a', bgColor: '#f3f0eb', label: 'Social', labelVi: 'Xã hội' },
  system: { icon: Settings, color: '#4a4a4a', bgColor: '#f0ebe4', label: 'System', labelVi: 'Hệ thống' },
};

export function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<string>('all');
  const { v, lang } = useLanguage();

  const filtered = filter === 'all' ? notifs : notifs.filter(n => n.type === filter);
  const unreadCount = notifs.filter(n => !n.read).length;

  const markAllRead = () => { setNotifs(prev => prev.map(n => ({ ...n, read: true }))); };
  const markRead = (id: string) => { setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)); };
  const deleteNotif = (id: string) => { setNotifs(prev => prev.filter(n => n.id !== id)); };

  const tabs = [
    { key: 'all', label: v('All', 'Tất cả'), count: notifs.length },
    { key: 'order', label: v('Orders', 'Đơn hàng'), count: notifs.filter(n => n.type === 'order').length },
    { key: 'promo', label: v('Promos', 'Khuyến mãi'), count: notifs.filter(n => n.type === 'promo').length },
    { key: 'social', label: v('Social', 'Xã hội'), count: notifs.filter(n => n.type === 'social').length },
    { key: 'system', label: v('System', 'Hệ thống'), count: notifs.filter(n => n.type === 'system').length },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return v('Just now', 'Vừa xong');
    if (diffMins < 60) return `${diffMins} ${v('min ago', 'phút trước')}`;
    if (diffHours < 24) return `${diffHours} ${v('hours ago', 'giờ trước')}`;
    if (diffDays < 7) return `${diffDays} ${v('days ago', 'ngày trước')}`;
    return date.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
      <div className="mx-auto px-6 lg:px-12 py-8 sm:py-10" style={{ maxWidth: 'calc(75% + 320px)' }}>
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8" style={{ fontSize: '13px', color: '#888', letterSpacing: '0.03em' }}>
          <Link to="/" className="hover:text-[#d41c1c] transition-colors">{v('Home', 'Trang chủ')}</Link>
          <ChevronRight className="w-3 h-3" />
          <span style={{ color: '#0d0d0d' }}>{v('Notifications', 'Thông báo')}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-2 hover:bg-[#f3f0eb] transition-colors hidden sm:flex"
              style={{ borderRadius: '8px' }}
            >
              <ArrowLeft className="w-5 h-5 text-[#4a4a4a]" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05 }}>
                  {v('Notifications', 'Thông báo')}
                </h1>
                {unreadCount > 0 && (
                  <span
                    className="px-3 py-1 text-white"
                    style={{ fontSize: '12px', fontWeight: 600, borderRadius: '9999px', backgroundColor: '#d41c1c' }}
                  >
                    {unreadCount} {v('new', 'mới')}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '14px', color: '#4a4a4a', marginTop: '4px' }}>
                {v('Stay updated with your orders, promotions and more', 'Cập nhật đơn hàng, khuyến mãi và nhiều hơn nữa')}
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 px-5 py-2.5 border-2 border-[#e0d8cf] hover:bg-[#f3f0eb] transition-colors self-start sm:self-auto"
              style={{ borderRadius: '10px', fontSize: '13px', color: '#d41c1c', fontWeight: 500 }}
            >
              <Check className="w-4 h-4" />
              {v('Mark all as read', 'Đánh dấu tất cả đã đọc')}
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6" style={{ scrollbarWidth: 'none' }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 transition-all ${
                filter === tab.key
                  ? 'bg-[#d41c1c] text-white shadow-sm'
                  : 'bg-white border-2 border-[#e0d8cf] text-[#4a4a4a] hover:bg-[#f3f0eb] hover:border-[#d41c1c]'
              }`}
              style={{ borderRadius: '9999px', fontSize: '13px', fontWeight: filter === tab.key ? 600 : 400 }}
            >
              {tab.label}
              <span
                className={`px-1.5 py-0.5 ${filter === tab.key ? 'bg-white/20' : 'bg-[#f3f0eb]'}`}
                style={{ borderRadius: '9999px', fontSize: '11px', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Notification List */}
        {filtered.length === 0 ? (
          <div
            className="text-center py-20 bg-white"
            style={{ borderRadius: '10px', border: '2px solid #e0d8cf' }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: '#f3f0eb' }}
            >
              <Bell className="w-10 h-10 text-[#e0d8cf]" />
            </div>
            <p style={{ fontSize: '20px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '8px' }}>
              {v('No notifications', 'Không có thông báo')}
            </p>
            <p style={{ fontSize: '14px', color: '#888' }}>
              {v("You're all caught up! Check back later.", 'Bạn đã đọc hết thông báo! Quay lại sau nhé.')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(notif => {
              const tc = typeConfig[notif.type];
              const Icon = tc.icon;
              const content = (
                <div
                  className={`bg-white p-5 flex items-start gap-4 transition-all hover:shadow-md group ${!notif.read ? 'border-l-[3px]' : ''}`}
                  style={{
                    borderRadius: '10px',
                    border: '2px solid #e0d8cf',
                    borderLeftColor: !notif.read ? '#d41c1c' : undefined,
                    boxShadow: !notif.read ? '0px 1px 4px rgba(212,28,28,0.08)' : '0px 1px 2px rgba(0,0,0,0.03)',
                  }}
                >
                  {/* Icon / Avatar */}
                  {notif.image ? (
                    <ImageWithFallback
                      src={notif.image}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      style={{ border: '2px solid #e0d8cf' } as any}
                    />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: tc.bgColor }}
                    >
                      <Icon className="w-5 h-5" style={{ color: tc.color }} />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="px-2 py-0.5"
                            style={{
                              fontSize: '10px',
                              fontWeight: 600,
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                              color: tc.color,
                              backgroundColor: tc.bgColor,
                              borderRadius: '4px',
                              fontFamily: "'Oswald', sans-serif",
                            }}
                          >
                            {v(tc.label, tc.labelVi)}
                          </span>
                          <span style={{ fontSize: '12px', color: '#888' }}>
                            {formatDate(notif.date)}
                          </span>
                        </div>
                        <p style={{ fontSize: '14px', fontWeight: notif.read ? 400 : 600, color: '#0d0d0d', marginBottom: '2px' }}>
                          {v(notif.title, notif.titleVi)}
                        </p>
                        <p className="line-clamp-2" style={{ fontSize: '13px', color: '#4a4a4a', lineHeight: 1.5 }}>
                          {v(notif.message, notif.messageVi)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notif.read && (
                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); markRead(notif.id); }}
                            className="p-2 hover:bg-[#f3f0eb] transition-colors"
                            style={{ borderRadius: '8px' }}
                            title={v('Mark as read', 'Đánh dấu đã đọc')}
                          >
                            <Check className="w-4 h-4 text-[#4a4a4a]" />
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteNotif(notif.id); }}
                          className="p-2 hover:bg-red-50 transition-colors"
                          style={{ borderRadius: '8px' }}
                          title={v('Delete', 'Xóa')}
                        >
                          <Trash2 className="w-4 h-4 text-[#d41c1c]" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Unread dot */}
                  {!notif.read && (
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-2" style={{ backgroundColor: '#d41c1c' }} />
                  )}
                </div>
              );
              return notif.link ? (
                <Link key={notif.id} to={notif.link} onClick={() => markRead(notif.id)}>{content}</Link>
              ) : (
                <div key={notif.id}>{content}</div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}