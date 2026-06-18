import { useState } from 'react';
import { MapPin, Plus, Edit3, Trash2, Check } from 'lucide-react';
import { AccountLayout } from '@/app/components/AccountLayout';
import { addresses as initialAddresses, type Address } from '@/app/data/accountMockData';
import { useLanguage } from '@/app/i18n/LanguageContext';

export function AddressBookPage() {
  const [addressList, setAddressList] = useState<Address[]>(initialAddresses);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Address>>({});
  const { v } = useLanguage();

  const setDefault = (id: string) => { setAddressList(prev => prev.map(a => ({ ...a, isDefault: a.id === id }))); };
  const deleteAddress = (id: string) => { setAddressList(prev => prev.filter(a => a.id !== id)); };
  const startEdit = (addr: Address) => { setForm(addr); setEditing(addr.id); setShowForm(true); };
  const startNew = () => { setForm({ label: '', fullName: '', phone: '', street: '', city: '', state: '', zipCode: '', country: 'Vietnam', isDefault: false }); setEditing(null); setShowForm(true); };
  const save = () => {
    if (editing) { setAddressList(prev => prev.map(a => a.id === editing ? { ...a, ...form } as Address : a)); }
    else { setAddressList(prev => [...prev, { ...form, id: `a${Date.now()}` } as Address]); }
    setShowForm(false); setEditing(null);
  };

  return (
    <AccountLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05 }}>{v('Address Book', 'Sổ địa chỉ')}</h1>
          <button onClick={startNew} className="flex items-center gap-2 px-5 py-2.5 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors" style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
            <Plus className="w-4 h-4" />{v('Add Address', 'Thêm địa chỉ')}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6" style={{ borderRadius: '10px', border: '2px solid #e0d8cf' }}>
            <h2 style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '20px' }}>
              {editing ? v('Edit Address', 'Sửa địa chỉ') : v('Add New Address', 'Thêm địa chỉ mới')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'label', label: v('Label (e.g. Home, Office)', 'Nhãn (VD: Nhà, Văn phòng)'), span: false },
                { key: 'fullName', label: v('Full Name', 'Họ và tên'), span: false },
                { key: 'phone', label: v('Phone', 'Điện thoại'), span: false },
                { key: 'street', label: v('Street Address', 'Địa chỉ'), span: true },
                { key: 'city', label: v('City / District', 'Quận / Huyện'), span: false },
                { key: 'state', label: v('State / Province', 'Tỉnh / TP'), span: false },
                { key: 'zipCode', label: v('Zip Code', 'Mã bưu điện'), span: false },
                { key: 'country', label: v('Country', 'Quốc gia'), span: false },
              ].map(f => (
                <div key={f.key} className={f.span ? 'sm:col-span-2' : ''}>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>{f.label}</label>
                  <input type="text" value={(form as any)[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors"
                    style={{ borderRadius: '10px', fontSize: '14px', backgroundColor: '#fefcfa', fontFamily: "'Montserrat', sans-serif" }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} className="px-6 py-2.5 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors" style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
                {editing ? v('Update', 'Cập nhật') : v('Save', 'Lưu')}
              </button>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-6 py-2.5 border-2 border-[#e0d8cf] hover:bg-[#f3f0eb] transition-colors" style={{ borderRadius: '10px', fontSize: '12px', color: '#4a4a4a', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {v('Cancel', 'Hủy')}
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addressList.map(addr => (
            <div key={addr.id} className={`bg-white p-5 border-2 transition-colors ${addr.isDefault ? 'border-[#d41c1c]' : 'border-[#e0d8cf]'}`} style={{ borderRadius: '10px', boxShadow: '0px 1px 3px rgba(0,0,0,0.05)' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: '#e2b93b' }} />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{addr.label}</span>
                  {addr.isDefault && (
                    <span className="px-2 py-0.5 text-white" style={{ fontSize: '10px', fontWeight: 600, borderRadius: '9999px', backgroundColor: '#d41c1c', letterSpacing: '0.1em', fontFamily: "'Oswald', sans-serif" }}>{v('DEFAULT', 'MẶC ĐỊNH')}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => startEdit(addr)} className="p-1.5 hover:bg-[#f3f0eb] rounded transition-colors"><Edit3 className="w-4 h-4 text-[#888]" /></button>
                  {!addr.isDefault && (
                    <button onClick={() => deleteAddress(addr.id)} className="p-1.5 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4 text-[#d41c1c]" /></button>
                  )}
                </div>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{addr.fullName}</p>
              <p style={{ fontSize: '14px', color: '#4a4a4a', marginTop: '2px' }}>{addr.street}</p>
              <p style={{ fontSize: '14px', color: '#4a4a4a' }}>{addr.city}, {addr.state} {addr.zipCode}</p>
              <p style={{ fontSize: '14px', color: '#4a4a4a' }}>{addr.country}</p>
              <p style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>{addr.phone}</p>
              {!addr.isDefault && (
                <button onClick={() => setDefault(addr.id)} className="flex items-center gap-1 mt-3 px-3 py-1.5 border-2 border-[#e0d8cf] hover:bg-[#f3f0eb] transition-colors" style={{ borderRadius: '10px', fontSize: '12px', color: '#d41c1c' }}>
                  <Check className="w-3 h-3" />{v('Set as default', 'Đặt làm mặc định')}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </AccountLayout>
  );
}