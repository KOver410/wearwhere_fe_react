import { useCallback, useEffect, useState } from 'react';
import { MapPin, Plus, Edit3, Trash2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { AccountLayout } from '@/shared/components/AccountLayout';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import {
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  type CustomerAddress,
  type CreateAddressRequest,
} from '@/features/account/api/addressApi';

type AddressForm = {
  label: string;
  recipient_name: string;
  recipient_phone: string;
  address_line: string;
  ward: string;
  district: string;
  city: string;
  country: string;
  postal_code: string;
  note: string;
  is_default: boolean;
};

const emptyForm: AddressForm = {
  label: '',
  recipient_name: '',
  recipient_phone: '',
  address_line: '',
  ward: '',
  district: '',
  city: '',
  country: 'VN',
  postal_code: '',
  note: '',
  is_default: false,
};

function toForm(addr: CustomerAddress): AddressForm {
  return {
    label: addr.label,
    recipient_name: addr.recipient_name,
    recipient_phone: addr.recipient_phone,
    address_line: addr.address_line,
    ward: addr.ward,
    district: addr.district,
    city: addr.city,
    country: addr.country,
    postal_code: addr.postal_code ?? '',
    note: addr.note ?? '',
    is_default: addr.is_default,
  };
}

/** Build the request body, dropping empty optional fields. */
function toRequest(form: AddressForm): CreateAddressRequest {
  const body: CreateAddressRequest = {
    label: form.label.trim(),
    recipient_name: form.recipient_name.trim(),
    recipient_phone: form.recipient_phone.trim(),
    address_line: form.address_line.trim(),
    ward: form.ward.trim(),
    district: form.district.trim(),
    city: form.city.trim(),
    country: form.country.trim().toUpperCase(),
    is_default: form.is_default,
  };
  const postalCode = form.postal_code.trim();
  if (postalCode) body.postal_code = postalCode;
  const note = form.note.trim();
  if (note) body.note = note;
  return body;
}

export function AddressBookPage() {
  const { v } = useLanguage();

  const [addressList, setAddressList] = useState<CustomerAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AddressForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchAddresses = useCallback(() => {
    setLoading(true);
    setError(null);
    let active = true;
    listAddresses()
      .then(res => {
        if (active) setAddressList(res.items);
      })
      .catch((e: unknown) => {
        if (active)
          setError(
            e instanceof Error
              ? e.message
              : v('Failed to load addresses', 'Không tải được địa chỉ'),
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [v]);

  useEffect(() => {
    const cancel = fetchAddresses();
    return cancel;
  }, [fetchAddresses]);

  const startEdit = (addr: CustomerAddress) => {
    setForm(toForm(addr));
    setEditing(addr.id);
    setShowForm(true);
  };

  const startNew = () => {
    setForm(emptyForm);
    setEditing(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const save = () => {
    if (submitting) return;
    setSubmitting(true);
    const body = toRequest(form);
    const action = editing
      ? updateAddress(editing, body)
      : createAddress(body);
    action
      .then(() => {
        closeForm();
        toast.success(
          editing
            ? v('Address updated', 'Đã cập nhật địa chỉ')
            : v('Address added', 'Đã thêm địa chỉ'),
        );
        fetchAddresses();
      })
      .catch((e: unknown) => {
        const message =
          e instanceof Error
            ? e.message
            : v('Could not save address', 'Không thể lưu địa chỉ');
        toast.error(message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const setDefault = (id: string) => {
    if (submitting) return;
    setSubmitting(true);
    updateAddress(id, { is_default: true })
      .then(() => {
        toast.success(
          v('Default address updated', 'Đã cập nhật địa chỉ mặc định'),
        );
        fetchAddresses();
      })
      .catch((e: unknown) => {
        const message =
          e instanceof Error
            ? e.message
            : v('Could not update default', 'Không thể cập nhật mặc định');
        toast.error(message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const removeAddress = (id: string) => {
    if (!window.confirm(v('Delete this address?', 'Xóa địa chỉ này?'))) return;
    deleteAddress(id)
      .then(() => {
        toast.success(v('Address deleted', 'Đã xóa địa chỉ'));
        fetchAddresses();
      })
      .catch((e: unknown) => {
        const message =
          e instanceof Error
            ? e.message
            : v('Could not delete address', 'Không thể xóa địa chỉ');
        toast.error(message);
      });
  };

  const textFields: { key: keyof AddressForm; label: string; span: boolean; placeholder?: string }[] = [
    { key: 'label', label: v('Label (e.g. Home, Office)', 'Nhãn (VD: Nhà, Văn phòng)'), span: false },
    { key: 'recipient_name', label: v('Recipient Name', 'Tên người nhận'), span: false },
    { key: 'recipient_phone', label: v('Recipient Phone', 'Số điện thoại'), span: false, placeholder: '+84901234567' },
    { key: 'address_line', label: v('Address Line', 'Địa chỉ'), span: true },
    { key: 'ward', label: v('Ward', 'Phường / Xã'), span: false },
    { key: 'district', label: v('District', 'Quận / Huyện'), span: false },
    { key: 'city', label: v('City', 'Tỉnh / TP'), span: false },
    { key: 'country', label: v('Country (2-letter code)', 'Quốc gia (mã 2 chữ)'), span: false },
    { key: 'postal_code', label: v('Postal Code (optional)', 'Mã bưu điện (tùy chọn)'), span: false },
    { key: 'note', label: v('Note (optional)', 'Ghi chú (tùy chọn)'), span: true },
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
              {textFields.map(f => (
                <div key={f.key} className={f.span ? 'sm:col-span-2' : ''}>
                  <label htmlFor={`addr-${f.key}`} style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>{f.label}</label>
                  <input id={`addr-${f.key}`} type="text" value={form[f.key] as string} placeholder={f.placeholder} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    className="w-full px-4 py-2.5 border-2 border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors"
                    style={{ borderRadius: '10px', fontSize: '14px', backgroundColor: '#fefcfa', fontFamily: "'Montserrat', sans-serif" }}
                  />
                </div>
              ))}
              <div className="sm:col-span-2">
                <label className="flex items-center gap-2" style={{ fontSize: '14px', color: '#0d0d0d' }}>
                  <input type="checkbox" checked={form.is_default} onChange={e => setForm({ ...form, is_default: e.target.checked })} />
                  {v('Set as default address', 'Đặt làm địa chỉ mặc định')}
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={save} disabled={submitting} className="px-6 py-2.5 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors disabled:opacity-60" style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
                {editing ? v('Update', 'Cập nhật') : v('Save', 'Lưu')}
              </button>
              <button onClick={closeForm} disabled={submitting} className="px-6 py-2.5 border-2 border-[#e0d8cf] hover:bg-[#f3f0eb] transition-colors disabled:opacity-60" style={{ borderRadius: '10px', fontSize: '12px', color: '#4a4a4a', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {v('Cancel', 'Hủy')}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div data-testid="address-loading" className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#e0d8cf] border-t-[#d41c1c] rounded-full animate-spin" />
            <p className="mt-4" style={{ fontSize: '14px', color: '#4a4a4a' }}>{v('Loading...', 'Đang tải...')}</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '8px' }}>{v('Something went wrong', 'Đã có lỗi xảy ra')}</p>
            <p style={{ fontSize: '14px', color: '#4a4a4a', marginBottom: '24px' }}>{error}</p>
            <button
              onClick={() => fetchAddresses()}
              className="px-6 py-3 bg-[#0d0d0d] text-white transition-colors hover:bg-[#d41c1c]"
              style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
            >
              {v('Retry', 'Thử lại')}
            </button>
          </div>
        ) : addressList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-[#f3f0eb] rounded-full flex items-center justify-center mb-6">
              <MapPin className="w-12 h-12 text-[#4a4a4a]" />
            </div>
            <p style={{ fontSize: '24px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', marginBottom: '8px' }}>{v('No addresses yet', 'Chưa có địa chỉ')}</p>
            <p style={{ fontSize: '14px', color: '#4a4a4a', textAlign: 'center', maxWidth: '400px' }}>
              {v('Add your first delivery address to get started.', 'Thêm địa chỉ giao hàng đầu tiên để bắt đầu.')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addressList.map(addr => (
              <div key={addr.id} className={`bg-white p-5 border-2 transition-colors ${addr.is_default ? 'border-[#d41c1c]' : 'border-[#e0d8cf]'}`} style={{ borderRadius: '10px', boxShadow: '0px 1px 3px rgba(0,0,0,0.05)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" style={{ color: '#e2b93b' }} />
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{addr.label}</span>
                    {addr.is_default && (
                      <span className="px-2 py-0.5 text-white" style={{ fontSize: '10px', fontWeight: 600, borderRadius: '9999px', backgroundColor: '#d41c1c', letterSpacing: '0.1em', fontFamily: "'Oswald', sans-serif" }}>DEFAULT</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button aria-label={v('Edit address', 'Sửa địa chỉ')} onClick={() => startEdit(addr)} className="p-1.5 hover:bg-[#f3f0eb] rounded transition-colors"><Edit3 className="w-4 h-4 text-[#888]" /></button>
                    <button aria-label={v('Delete address', 'Xóa địa chỉ')} onClick={() => removeAddress(addr.id)} className="p-1.5 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4 text-[#d41c1c]" /></button>
                  </div>
                </div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{addr.recipient_name}</p>
                <p style={{ fontSize: '14px', color: '#4a4a4a', marginTop: '2px' }}>{addr.address_line}</p>
                <p style={{ fontSize: '14px', color: '#4a4a4a' }}>{addr.ward}, {addr.district}</p>
                <p style={{ fontSize: '14px', color: '#4a4a4a' }}>{addr.city}{addr.postal_code ? ` ${addr.postal_code}` : ''}, {addr.country}</p>
                {addr.note && <p style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>{addr.note}</p>}
                <p style={{ fontSize: '13px', color: '#888', marginTop: '8px' }}>{addr.recipient_phone}</p>
                {!addr.is_default && (
                  <button onClick={() => setDefault(addr.id)} disabled={submitting} className="flex items-center gap-1 mt-3 px-3 py-1.5 border-2 border-[#e0d8cf] hover:bg-[#f3f0eb] transition-colors disabled:opacity-60" style={{ borderRadius: '10px', fontSize: '12px', color: '#d41c1c' }}>
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
