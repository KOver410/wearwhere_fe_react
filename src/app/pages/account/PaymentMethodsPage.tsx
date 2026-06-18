import { useState } from 'react';
import { CreditCard, Plus, Trash2, Check, Shield } from 'lucide-react';
import { AccountLayout } from '@/app/components/AccountLayout';
import { paymentMethods as initialMethods, type PaymentMethod } from '@/app/data/accountMockData';
import { useLanguage } from '@/app/i18n/LanguageContext';

const cardIcons: Record<string, { color: string; label: string }> = {
  visa: { color: '#1A1F71', label: 'VISA' },
  mastercard: { color: '#EB001B', label: 'MC' },
  momo: { color: '#A50064', label: 'MoMo' },
  zalopay: { color: '#0068FF', label: 'ZPay' },
};

export function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>(initialMethods);
  const [showForm, setShowForm] = useState(false);
  const { v } = useLanguage();

  const setDefault = (id: string) => { setMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id }))); };
  const deleteMethod = (id: string) => { setMethods(prev => prev.filter(m => m.id !== id)); };

  return (
    <AccountLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05 }}>{v('Payment Methods', 'Phương thức thanh toán')}</h1>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-5 py-2.5 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors" style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
            <Plus className="w-4 h-4" />{v('Add Card', 'Thêm thẻ')}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6" style={{ borderRadius: '10px', border: '2px solid #e0d8cf' }}>
            <h2 style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '20px' }}>{v('Add Payment Method', 'Thêm phương thức thanh toán')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>{v('Card Number', 'Số thẻ')}</label>
                <input type="text" placeholder="1234 5678 9012 3456" className="w-full px-4 py-2.5 border-2 border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors" style={{ borderRadius: '10px', fontSize: '14px', backgroundColor: '#fefcfa', fontFamily: "'Montserrat', sans-serif" }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>{v('Cardholder Name', 'Tên chủ thẻ')}</label>
                <input type="text" placeholder="NGUYEN VAN A" className="w-full px-4 py-2.5 border-2 border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors" style={{ borderRadius: '10px', fontSize: '14px', backgroundColor: '#fefcfa', fontFamily: "'Montserrat', sans-serif" }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>{v('Expiry', 'Hạn')}</label>
                  <input type="text" placeholder="MM/YY" className="w-full px-4 py-2.5 border-2 border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors" style={{ borderRadius: '10px', fontSize: '14px', backgroundColor: '#fefcfa', fontFamily: "'Montserrat', sans-serif" }} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>CVV</label>
                  <input type="text" placeholder="123" className="w-full px-4 py-2.5 border-2 border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors" style={{ borderRadius: '10px', fontSize: '14px', backgroundColor: '#fefcfa', fontFamily: "'Montserrat', sans-serif" }} />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors" style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>{v('Save Card', 'Lưu thẻ')}</button>
              <button onClick={() => setShowForm(false)} className="px-6 py-2.5 border-2 border-[#e0d8cf] hover:bg-[#f3f0eb] transition-colors" style={{ borderRadius: '10px', fontSize: '12px', color: '#4a4a4a' }}>{v('Cancel', 'Hủy')}</button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {methods.map(method => {
            const ci = cardIcons[method.type];
            return (
              <div key={method.id} className={`bg-white p-5 flex items-center gap-4 border-2 transition-colors ${method.isDefault ? 'border-[#d41c1c]' : 'border-[#e0d8cf]'}`} style={{ borderRadius: '10px', boxShadow: '0px 1px 3px rgba(0,0,0,0.05)' }}>
                <div className="w-14 h-10 flex items-center justify-center" style={{ backgroundColor: ci.color + '15', border: `1px solid ${ci.color}30`, borderRadius: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: ci.color }}>{ci.label}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>
                      {method.type === 'momo' ? 'MoMo' : method.type === 'zalopay' ? 'ZaloPay' : method.type.charAt(0).toUpperCase() + method.type.slice(1)} ···· {method.last4}
                    </p>
                    {method.isDefault && (
                      <span className="px-2 py-0.5 text-white" style={{ fontSize: '10px', fontWeight: 600, borderRadius: '9999px', backgroundColor: '#d41c1c', letterSpacing: '0.1em', fontFamily: "'Oswald', sans-serif" }}>{v('DEFAULT', 'MẶC ĐỊNH')}</span>
                    )}
                  </div>
                  <p style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>
                    {method.holderName}{method.expiryDate ? ` · ${v('Expires', 'Hết hạn')} ${method.expiryDate}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!method.isDefault && (
                    <button onClick={() => setDefault(method.id)} className="flex items-center gap-1 px-3 py-1.5 border-2 border-[#e0d8cf] hover:bg-[#f3f0eb] transition-colors" style={{ borderRadius: '10px', fontSize: '12px', color: '#d41c1c' }}>
                      <Check className="w-3 h-3" />{v('Default', 'Mặc định')}
                    </button>
                  )}
                  {!method.isDefault && (
                    <button onClick={() => deleteMethod(method.id)} className="p-2 hover:bg-red-50 rounded transition-colors">
                      <Trash2 className="w-4 h-4 text-[#d41c1c]" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-start gap-3 p-4" style={{ backgroundColor: '#fff9f2', borderRadius: '10px', border: '2px solid #e0d8cf' }}>
          <Shield className="w-5 h-5 mt-0.5" style={{ color: '#e2b93b' }} />
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{v('Your payment info is secure', 'Thông tin thanh toán được bảo mật')}</p>
            <p style={{ fontSize: '13px', color: '#4a4a4a' }}>{v('All card data is encrypted and securely stored.', 'Mọi dữ liệu thẻ đều được mã hóa và lưu trữ an toàn.')}</p>
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}