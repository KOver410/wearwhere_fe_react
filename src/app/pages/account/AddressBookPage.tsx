import { useState, useEffect } from 'react';
import { MapPin, Plus, Edit3, Trash2, Check, Loader2 } from 'lucide-react';
import { AccountLayout } from '@/app/components/AccountLayout';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { userService } from '@/services/user';
import { toast } from 'sonner';
import type { UserAddress } from '@/types/user';

interface AddressForm {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

const emptyForm: AddressForm = {
  fullName: '', phone: '', addressLine1: '', addressLine2: '',
  district: '', city: '', province: '', postalCode: '', isDefault: false,
};

export function AddressBookPage() {
  const [addressList, setAddressList] = useState<UserAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AddressForm>(emptyForm);
  const { v } = useLanguage();

  const loadAddresses = async () => {
    try {
      const data = await userService.getAddresses();
      setAddressList(data);
    } catch {
      toast.error(v('Failed to load addresses.', 'Không thể tải địa chỉ.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadAddresses(); }, []);

  const setDefault = async (id: string) => {
    try {
      await userService.setDefaultAddress(id);
      await loadAddresses();
      toast.success(v('Default address updated!', 'Đã đặt địa chỉ mặc định!'));
    } catch {
      toast.error(v('Failed to set default.', 'Không thể đặt mặc định.'));
    }
  };

  const deleteAddress = async (id: string) => {
    if (!window.confirm(v('Delete this address?', 'Xóa địa chỉ này?'))) return;
    try {
      await userService.deleteAddress(id);
      setAddressList(prev => prev.filter(a => a.id !== id));
      toast.success(v('Address deleted!', 'Đã xóa địa chỉ!'));
    } catch {
      toast.error(v('Failed to delete address.', 'Không thể xóa địa chỉ.'));
    }
  };

  const startEdit = (addr: UserAddress) => {
    setForm({
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || '',
      district: addr.district || '',
      city: addr.city,
      province: addr.province,
      postalCode: addr.postalCode || '',
      isDefault: addr.isDefault,
    });
    setEditing(addr.id);
    setShowForm(true);
  };

  const startNew = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(true);
  };

  const save = async () => {
    setIsSaving(true);
    try {
      const payload = {
        fullName: form.fullName,
        phone: form.phone,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2 || undefined,
        district: form.district || undefined,
        city: form.city,
        province: form.province,
        postalCode: form.postalCode || undefined,
        isDefault: form.isDefault,
      };

      if (editing) {
        await userService.updateAddress(editing, payload);
        toast.success(v('Address updated!', 'Đã cập nhật địa chỉ!'));
      } else {
        await userService.createAddress(payload);
        toast.success(v('Address added!', 'Đã thêm địa chỉ!'));
      }
      await loadAddresses();
      setShowForm(false);
      setEditing(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || v('Failed to save address.', 'Không thể lưu địa chỉ.'));
    } finally {
      setIsSaving(false);
    }
  };

  const formFields = [
    { key: 'fullName', label: v('Full Name', 'Họ và tên'), span: false },
    { key: 'phone', label: v('Phone', 'Điện thoại'), span: false },
    { key: 'addressLine1', label: v('Address Line 1', 'Địa chỉ dòng 1'), span: true },
    { key: 'addressLine2', label: v('Address Line 2 (optional)', 'Địa chỉ dòng 2 (tùy chọn)'), span: true },
    { key: 'district', label: v('District', 'Quận / Huyện'), span: false },
    { key: 'city', label: v('City', 'Thành phố'), span: false },
    { key: 'province', label: v('Province', 'Tỉnh / TP'), span: false },
    { key: 'postalCode', label: v('Postal Code', 'Mã bưu điện'), span: false },
  ];

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
              {formFields.map(f => (
                <div key={f.key} className={f.span ? 'sm:col-span-2' : ''}>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>{f.label}</label>
                  <input type="text" value={(form as any)[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors"
                    style={{ borderRadius: '10px', fontSize: '14px', backgroundColor: '#fefcfa', fontFamily: "'Montserrat', sans-serif" }}
                    disabled={isSaving}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors disabled:opacity-50" style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editing ? v('Update', 'Cập nhật') : v('Save', 'Lưu')}
              </button>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-6 py-2.5 border-2 border-[#e0d8cf] hover:bg-[#f3f0eb] transition-colors" style={{ borderRadius: '10px', fontSize: '12px', color: '#4a4a4a', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {v('Cancel', 'Hủy')}
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#d41c1c]" />
          </div>
        ) : addressList.length === 0 ? (
          <div className="text-center py-16" style={{ backgroundColor: '#fefcfa', borderRadius: '10px', border: '2px dashed #e0d8cf' }}>
            <MapPin className="w-12 h-12 mx-auto mb-3" style={{ color: '#e0d8cf' }} />
            <p style={{ fontSize: '16px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '6px' }}>
              {v('No addresses yet', 'Chưa có địa chỉ')}
            </p>
            <p style={{ fontSize: '13px', color: '#888' }}>
              {v('Add your first delivery address.', 'Thêm địa chỉ giao hàng đầu tiên.')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addressList.map(addr => (
              <div key={addr.id} className={`bg-white p-5 border-2 transition-colors ${addr.isDefault ? 'border-[#d41c1c]' : 'border-[#e0d8cf]'}`} style={{ borderRadius: '10px', boxShadow: '0px 1px 3px rgba(0,0,0,0.05)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" style={{ color: '#e2b93b' }} />
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{addr.fullName}</span>
                    {addr.isDefault && (
                      <span className="px-2 py-0.5 text-white" style={{ fontSize: '10px', fontWeight: 600, borderRadius: '9999px', backgroundColor: '#d41c1c', letterSpacing: '0.1em', fontFamily: "'Oswald', sans-serif" }}>DEFAULT</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => startEdit(addr)} className="p-1.5 hover:bg-[#f3f0eb] rounded transition-colors"><Edit3 className="w-4 h-4 text-[#888]" /></button>
                    {!addr.isDefault && (
                      <button onClick={() => deleteAddress(addr.id)} className="p-1.5 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4 text-[#d41c1c]" /></button>
                    )}
                  </div>
                </div>
                <p style={{ fontSize: '14px', color: '#4a4a4a', marginTop: '2px' }}>{addr.addressLine1}</p>
                {addr.addressLine2 && <p style={{ fontSize: '14px', color: '#4a4a4a' }}>{addr.addressLine2}</p>}
                <p style={{ fontSize: '14px', color: '#4a4a4a' }}>
                  {[addr.district, addr.city, addr.province].filter(Boolean).join(', ')}
                  {addr.postalCode ? ` ${addr.postalCode}` : ''}
                </p>
                <p style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>{addr.phone}</p>
                {!addr.isDefault && (
                  <button onClick={() => setDefault(addr.id)} className="flex items-center gap-1 mt-3 px-3 py-1.5 border-2 border-[#e0d8cf] hover:bg-[#f3f0eb] transition-colors" style={{ borderRadius: '10px', fontSize: '12px', color: '#d41c1c' }}>
                    <Check className="w-3 h-3" />{v('Set as default', 'Đặt làm mặc định')}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
