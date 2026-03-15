import { useState } from 'react';
import { Link } from 'react-router';
import { Ticket, Copy, ChevronRight, Clock, CheckCircle, XCircle, Gift } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { vouchers } from '@/app/data/mockData';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { copyToClipboard } from '@/app/utils/clipboard';
import { AccountLayout } from '@/app/components/AccountLayout';

export function VouchersPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'used' | 'expired'>('active');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [redeemCode, setRedeemCode] = useState('');
  const { v } = useLanguage();

  const filteredVouchers = vouchers.filter(vc => vc.status === activeTab);

  const copyCode = (code: string) => {
    copyToClipboard(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleRedeem = () => {
    if (redeemCode.trim()) {
      alert(`Voucher "${redeemCode}" has been applied!`);
      setRedeemCode('');
    }
  };

  const tabs = [
    { key: 'active' as const, label: v('Active', 'Đang dùng'), count: vouchers.filter(vc => vc.status === 'active').length, icon: Ticket },
    { key: 'used' as const, label: v('Used', 'Đã dùng'), count: vouchers.filter(vc => vc.status === 'used').length, icon: CheckCircle },
    { key: 'expired' as const, label: v('Expired', 'Hết hạn'), count: vouchers.filter(vc => vc.status === 'expired').length, icon: XCircle },
  ];

  return (
    <AccountLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05 }}>{v('My Vouchers', 'Voucher của tôi')}</h1>
            <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>
              {v('Manage your discount codes and coupons', 'Quản lý mã giảm giá và phiếu mua hàng')}
            </p>
          </div>
        </div>

        {/* Redeem Code */}
        <div
          className="p-6 mb-8 bg-white"
          style={{ borderRadius: '10px', border: '2px solid #e0d8cf' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Gift className="w-5 h-5" style={{ color: '#e2b93b' }} />
            <h3 style={{ fontSize: '16px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' }}>{v('Have a voucher code?', 'Bạn có mã voucher?')}</h3>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={redeemCode}
              onChange={e => setRedeemCode(e.target.value.toUpperCase())}
              placeholder={v('Enter voucher code', 'Nhập mã voucher')}
              className="flex-1 px-4 py-3 border-2 border-[#e0d8cf] bg-[#fefcfa] focus:border-[#d41c1c] focus:outline-none transition-colors"
              style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Montserrat', sans-serif" }}
            />
            <button
              onClick={handleRedeem}
              disabled={!redeemCode.trim()}
              className="px-6 py-3 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors disabled:bg-[#e0d8cf] disabled:cursor-not-allowed"
              style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
            >
              {v('Redeem', 'Đổi mã')}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex" style={{ borderBottom: '2px solid #e0d8cf' }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 px-6 py-4 border-b-2 transition-colors mb-[-2px]"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontFamily: "'Oswald', sans-serif",
                borderColor: activeTab === tab.key ? '#d41c1c' : 'transparent',
                color: activeTab === tab.key ? '#0d0d0d' : '#888',
              }}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  backgroundColor: activeTab === tab.key ? '#d41c1c' : '#f0ebe4',
                  color: activeTab === tab.key ? '#FFFFFF' : '#888',
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Vouchers List */}
        {filteredVouchers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f3f0eb' }}>
              <Ticket className="w-10 h-10" style={{ color: '#888' }} />
            </div>
            <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '8px' }}>
              {v(`No ${activeTab} vouchers`, activeTab === 'active' ? 'Không có voucher đang dùng' : activeTab === 'used' ? 'Không có voucher đã dùng' : 'Không có voucher hết hạn')}
            </p>
            <p style={{ fontSize: '14px', color: '#888' }}>
              {activeTab === 'active'
                ? v('Browse our shop and collect vouchers!', 'Duyệt cửa hàng và thu thập voucher!')
                : v(`You don't have any ${activeTab} vouchers`, activeTab === 'used' ? 'Bạn chưa sử dụng voucher nào' : 'Bạn không có voucher hết hạn')}
            </p>
            {activeTab === 'active' && (
              <Link
                to="/shop"
                className="inline-block mt-6 px-6 py-3 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors"
                style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
              >
                {v('Browse Shop', 'Duyệt cửa hàng')}
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVouchers.map(voucher => (
              <div
                key={voucher.id}
                className={`relative overflow-hidden ${
                  voucher.status === 'active' ? '' : 'opacity-70'
                }`}
                style={{ borderRadius: '10px', border: '2px solid #e0d8cf' }}
              >
                <div className="flex">
                  {/* Left accent */}
                  <div
                    className="w-24 flex-shrink-0 flex flex-col items-center justify-center p-4"
                    style={{ backgroundColor: voucher.status === 'active' ? '#d41c1c' : '#4a4a4a', color: '#FFFFFF' }}
                  >
                    <span style={{ fontSize: '28px', fontFamily: "'Oswald', sans-serif", fontWeight: 700 }}>
                      {voucher.discountType === 'percentage' ? `${voucher.discount}%` : `$${voucher.discount}`}
                    </span>
                    <span style={{ fontSize: '11px', opacity: 0.8, fontFamily: "'Oswald', sans-serif", textTransform: 'uppercase' }}>
                      OFF
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0d0d0d' }}>
                          {voucher.title}
                        </h3>
                        {voucher.brandName && (
                          <div className="flex items-center gap-2 mt-1">
                            {voucher.brandLogo && (
                              <ImageWithFallback
                                src={voucher.brandLogo}
                                alt={voucher.brandName}
                                className="w-4 h-4 rounded-full object-cover"
                              />
                            )}
                            <span style={{ fontSize: '12px', color: '#888' }}>{voucher.brandName}</span>
                          </div>
                        )}
                      </div>
                      {voucher.status === 'active' && (
                        <button
                          onClick={() => copyCode(voucher.code)}
                          className="flex items-center gap-1 px-3 py-1.5 hover:bg-[#f0ebe4] transition-colors"
                          style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, color: '#d41c1c', backgroundColor: '#f3f0eb' }}
                        >
                          <Copy className="w-3 h-3" />
                          {copiedCode === voucher.code ? v('Copied!', 'Đã sao chép!') : voucher.code}
                        </button>
                      )}
                    </div>

                    <p style={{ fontSize: '13px', color: '#4a4a4a', marginBottom: '8px' }}>
                      {voucher.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: '12px', color: '#888' }}>
                          {v('Min. order', 'Đơn tối thiểu')}: ${voucher.minOrder}
                        </span>
                        {voucher.maxDiscount && (
                          <span style={{ fontSize: '12px', color: '#888' }}>
                            Max: ${voucher.maxDiscount}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#4a4a4a]" />
                        <span
                          style={{
                            fontSize: '12px',
                            color: voucher.status === 'expired' ? '#d41c1c' : '#888',
                          }}
                        >
                          {voucher.status === 'expired'
                            ? v('Expired', 'Hết hạn')
                            : `${v('Expires', 'Hết hạn')} ${voucher.expiresAt}`}
                        </span>
                      </div>
                    </div>

                    {/* Usage bar */}
                    {voucher.status === 'active' && (
                      <div className="mt-3 pt-3" style={{ borderTop: '1px solid #e0d8cf' }}>
                        <div className="flex items-center justify-between mb-1">
                          <span style={{ fontSize: '11px', color: '#888' }}>
                            {v('Used', 'Đã dùng')}: {voucher.usedCount}/{voucher.maxUses}
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden" style={{ backgroundColor: '#f0ebe4', borderRadius: '9999px' }}>
                          <div
                            className="h-full"
                            style={{ width: `${(voucher.usedCount / voucher.maxUses) * 100}%`, backgroundColor: '#d41c1c', borderRadius: '9999px' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dashed border decoration */}
                <div className="absolute left-[96px] top-0 bottom-0 border-l-2 border-dashed border-white/30" />
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
