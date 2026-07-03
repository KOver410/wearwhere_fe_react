import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Lock, Bell, Globe, Eye, EyeOff, Shield, Trash2 } from 'lucide-react';
import { changePassword, deleteAccount } from '@/features/auth/api/authApi';
import { ApiError } from '@/shared/api/contracts';
import { AccountLayout } from '@/shared/components/AccountLayout';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useLanguage } from '@/shared/i18n/LanguageContext';

type ChangePasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const PASSWORD_RULE = /^(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const Card = ({ children, title, icon: Icon }: { children: React.ReactNode; title: string; icon: any }) => (
  <div className="bg-white p-6" style={{ borderRadius: '10px', border: '2px solid #e0d8cf', boxShadow: '0px 1px 3px rgba(0,0,0,0.05)' }}>
    <div className="flex items-center gap-2 mb-5">
      <Icon className="w-5 h-5" style={{ color: '#d41c1c' }} />
      <h2 style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' }}>{title}</h2>
    </div>
    {children}
  </div>
);

export function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true, pushNotifications: true, orderUpdates: true, promotions: false, socialNotifications: true,
    language: 'en', currency: 'USD', profileVisibility: 'public', showOOTD: true, twoFactor: false,
  });

  const toggle = (key: keyof typeof settings) => { setSettings(prev => ({ ...prev, [key]: !prev[key] })); };

  const Toggle = ({ checked, onChange, label, desc }: { checked: boolean; onChange: () => void; label: string; desc?: string }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <p style={{ fontSize: '14px', fontWeight: 600, color: '#0d0d0d' }}>{label}</p>
        {desc && <p style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{desc}</p>}
      </div>
      <button onClick={onChange} className={`w-11 h-6 rounded-full transition-colors relative ${checked ? 'bg-[#d41c1c]' : 'bg-[#e0d8cf]'}`}>
        <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform ${checked ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );

  const { v } = useLanguage();

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const { message } = await deleteAccount(deletePassword);
      toast.success(message);
      try {
        await logout();
      } catch {
        // Session is already revoked server-side; ignore the expected logout error.
      }
      navigate('/login');
    } catch (error) {
      const msg =
        error instanceof ApiError && error.code === 'INVALID_CREDENTIALS'
          ? v('Password is incorrect', 'Mật khẩu không đúng')
          : error instanceof ApiError && error.code === 'PENDING_ORDERS'
            ? v('You have pending orders and cannot delete your account yet.', 'Bạn còn đơn hàng đang xử lý nên chưa thể xóa tài khoản.')
            : error instanceof Error
              ? error.message
              : v('Could not delete account', 'Không thể xóa tài khoản');
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch: watchPassword,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  const newPassword = watchPassword('newPassword');

  const onChangePassword = async (values: ChangePasswordFormValues) => {
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      toast.success(v('Password changed. Please log in again.', 'Đã đổi mật khẩu. Vui lòng đăng nhập lại.'));
      try {
        await logout();
      } catch {
        // The password change may already have invalidated the session.
      }
      navigate('/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : v('Unable to change password', 'Không thể đổi mật khẩu'));
    }
  };

  return (
    <AccountLayout>
      <div className="space-y-6">
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05 }}>{v('Settings', 'Cài đặt')}</h1>

        <Card title={v('Change Password', 'Đổi mật khẩu')} icon={Lock}>
          <form className="space-y-4 max-w-md" onSubmit={handlePasswordSubmit(onChangePassword)}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>{v('Current Password', 'Mật khẩu hiện tại')}</label>
              <div className="relative">
                <input {...registerPassword('currentPassword', { required: v('Current password is required', 'Vui lòng nhập mật khẩu hiện tại') })} type={showPassword ? 'text' : 'password'} placeholder={v('Enter current password', 'Nhập mật khẩu hiện tại')} className="w-full px-4 py-2.5 border-2 border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors pr-10" style={{ borderRadius: '10px', fontSize: '14px', backgroundColor: '#fefcfa', fontFamily: "'Montserrat', sans-serif" }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff className="w-4 h-4 text-[#888]" /> : <Eye className="w-4 h-4 text-[#888]" />}
                </button>
              </div>
              {errors.currentPassword && <p className="mt-1 text-xs text-[#d41c1c]">{errors.currentPassword.message}</p>}
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>{v('New Password', 'Mật khẩu mới')}</label>
              <input {...registerPassword('newPassword', {
                required: v('New password is required', 'Vui lòng nhập mật khẩu mới'),
                pattern: {
                  value: PASSWORD_RULE,
                  message: v('Password must be at least 8 characters and include a number and special character', 'Mật khẩu phải có ít nhất 8 ký tự và bao gồm số cùng ký tự đặc biệt'),
                },
              })} type="password" placeholder={v('Enter new password', 'Nhập mật khẩu mới')} className="w-full px-4 py-2.5 border-2 border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors" style={{ borderRadius: '10px', fontSize: '14px', backgroundColor: '#fefcfa', fontFamily: "'Montserrat', sans-serif" }} />
              {errors.newPassword && <p className="mt-1 text-xs text-[#d41c1c]">{errors.newPassword.message}</p>}
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>{v('Confirm Password', 'Xác nhận mật khẩu')}</label>
              <input {...registerPassword('confirmPassword', {
                required: v('Please confirm your new password', 'Vui lòng xác nhận mật khẩu mới'),
                validate: value => value === newPassword || v('Passwords do not match', 'Mật khẩu không khớp'),
              })} type="password" placeholder={v('Confirm new password', 'Xác nhận mật khẩu mới')} className="w-full px-4 py-2.5 border-2 border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors" style={{ borderRadius: '10px', fontSize: '14px', backgroundColor: '#fefcfa', fontFamily: "'Montserrat', sans-serif" }} />
              {errors.confirmPassword && <p className="mt-1 text-xs text-[#d41c1c]">{errors.confirmPassword.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors disabled:opacity-60 disabled:cursor-not-allowed" style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
              {isSubmitting ? v('Updating...', 'Đang cập nhật...') : v('Update Password', 'Cập nhật mật khẩu')}
            </button>
          </form>
        </Card>

        <Card title={v('Notification Preferences', 'Tùy chọn thông báo')} icon={Bell}>
          <div className="divide-y" style={{ borderColor: '#e0d8cf' }}>
            <Toggle checked={settings.emailNotifications} onChange={() => toggle('emailNotifications')} label={v('Email Notifications', 'Thông báo email')} desc={v('Receive updates via email', 'Nhận cập nhật qua email')} />
            <Toggle checked={settings.pushNotifications} onChange={() => toggle('pushNotifications')} label={v('Push Notifications', 'Thông báo đẩy')} desc={v('Browser push notifications', 'Thông báo đẩy trình duyệt')} />
            <Toggle checked={settings.orderUpdates} onChange={() => toggle('orderUpdates')} label={v('Order Updates', 'Cập nhật đơn hàng')} desc={v('Get notified about order status changes', 'Nhận thông báo khi đơn hàng thay đổi trạng thái')} />
            <Toggle checked={settings.promotions} onChange={() => toggle('promotions')} label={v('Promotional Emails', 'Email khuyến mãi')} desc={v('Receive deals and offers', 'Nhận ưu đãi và khuyến mãi')} />
            <Toggle checked={settings.socialNotifications} onChange={() => toggle('socialNotifications')} label={v('Social Notifications', 'Thông báo xã hội')} desc={v('Likes, comments, and new followers', 'Lượt thích, bình luận và người theo dõi mới')} />
          </div>
        </Card>

        <Card title={v('Preferences', 'Tùy chọn')} icon={Globe}>
          <div className="space-y-4 max-w-md">
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>{v('Language', 'Ngôn ngữ')}</label>
              <select value={settings.language} onChange={e => setSettings({ ...settings, language: e.target.value })} className="w-full px-4 py-2.5 border-2 border-[#e0d8cf] bg-[#fefcfa] focus:border-[#d41c1c] focus:outline-none transition-colors appearance-none cursor-pointer" style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Montserrat', sans-serif" }}>
                <option value="en">English</option>
                <option value="vi">Tiếng Việt</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>{v('Currency', 'Tiền tệ')}</label>
              <select value={settings.currency} onChange={e => setSettings({ ...settings, currency: e.target.value })} className="w-full px-4 py-2.5 border-2 border-[#e0d8cf] bg-[#fefcfa] focus:border-[#d41c1c] focus:outline-none transition-colors appearance-none cursor-pointer" style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Montserrat', sans-serif" }}>
                <option value="USD">USD ($)</option>
                <option value="VND">VND (₫)</option>
              </select>
            </div>
          </div>
        </Card>

        <Card title={v('Privacy & Security', 'Quyền riêng tư & Bảo mật')} icon={Shield}>
          <div className="divide-y" style={{ borderColor: '#e0d8cf' }}>
            <div className="py-3">
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>{v('Profile Visibility', 'Hiển thị hồ sơ')}</label>
              <select value={settings.profileVisibility} onChange={e => setSettings({ ...settings, profileVisibility: e.target.value })} className="px-4 py-2.5 border-2 border-[#e0d8cf] bg-[#fefcfa] focus:border-[#d41c1c] focus:outline-none transition-colors appearance-none cursor-pointer" style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Montserrat', sans-serif" }}>
                <option value="public">{v('Public', 'Công khai')}</option>
                <option value="followers">{v('Followers Only', 'Chỉ người theo dõi')}</option>
                <option value="private">{v('Private', 'Riêng tư')}</option>
              </select>
            </div>
            <Toggle checked={settings.showOOTD} onChange={() => toggle('showOOTD')} label={v('Show OOTDs on Profile', 'Hiển thị OOTD trên hồ sơ')} desc={v('Display your OOTD posts on your public profile', 'Hiển thị bài OOTD trên hồ sơ công khai')} />
            <Toggle checked={settings.twoFactor} onChange={() => toggle('twoFactor')} label={v('Two-Factor Authentication', 'Xác thực hai yếu tố')} desc={v('Add an extra layer of security', 'Thêm lớp bảo mật')} />
          </div>
        </Card>

        {/* Danger Zone */}
        <div className="bg-white p-6 border-2 border-[#d41c1c]/20" style={{ borderRadius: '10px' }}>
          <div className="flex items-center gap-2 mb-3">
            <Trash2 className="w-5 h-5 text-[#d41c1c]" />
            <h2 style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#d41c1c', textTransform: 'uppercase' }}>{v('Danger Zone', 'Vùng nguy hiểm')}</h2>
          </div>
          <p style={{ fontSize: '14px', color: '#4a4a4a', marginBottom: '16px' }}>
            {v('Once you delete your account, there is no going back.', 'Khi bạn xóa tài khoản, không thể khôi phục.')}
          </p>
          <button onClick={() => { setDeletePassword(''); setShowDeleteModal(true); }} className="px-5 py-2.5 border-2 border-[#d41c1c] text-[#d41c1c] hover:bg-red-50 transition-colors" style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
            {v('Delete Account', 'Xóa tài khoản')}
          </button>
        </div>

        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            <div className="absolute inset-0 bg-black/50" onClick={() => { if (!isDeleting) setShowDeleteModal(false); }} />
            <form
              onSubmit={(e) => { e.preventDefault(); void handleDeleteAccount(); }}
              className="relative w-full max-w-md bg-white p-6"
              style={{ borderRadius: '14px', boxShadow: '0px 10px 15px rgba(0,0,0,0.1), 0px 4px 6px rgba(0,0,0,0.1)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Trash2 className="w-5 h-5 text-[#d41c1c]" />
                <h2 style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#d41c1c', textTransform: 'uppercase' }}>
                  {v('Delete Account', 'Xóa tài khoản')}
                </h2>
              </div>
              <p style={{ fontSize: '14px', color: '#4a4a4a', marginBottom: '16px' }}>
                {v(
                  'This is permanent. Your account will be scheduled for deletion and you will be signed out. Enter your password to confirm.',
                  'Hành động này là vĩnh viễn. Tài khoản sẽ được lên lịch xóa và bạn sẽ bị đăng xuất. Nhập mật khẩu để xác nhận.',
                )}
              </p>
              <label htmlFor="delete-password" style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>
                {v('Password', 'Mật khẩu')}
              </label>
              <div className="relative mb-5">
                <input
                  id="delete-password"
                  type={showDeletePassword ? 'text' : 'password'}
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border-2 border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors pr-10"
                  style={{ borderRadius: '10px', fontSize: '14px', backgroundColor: '#fefcfa', fontFamily: "'Montserrat', sans-serif" }}
                />
                <button type="button" onClick={() => setShowDeletePassword(!showDeletePassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showDeletePassword ? <EyeOff className="w-4 h-4 text-[#888]" /> : <Eye className="w-4 h-4 text-[#888]" />}
                </button>
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="px-5 py-2.5 transition-colors hover:bg-[#fff9f2]"
                  style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', border: '2px solid #e0d8cf', color: '#4a4a4a' }}
                >
                  {v('Cancel', 'Hủy')}
                </button>
                <button
                  type="submit"
                  disabled={isDeleting}
                  className="px-5 py-2.5 bg-[#d41c1c] text-white hover:bg-[#b01818] transition-colors disabled:opacity-60"
                  style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
                >
                  {isDeleting ? v('Deleting...', 'Đang xóa...') : v('Delete Account', 'Xóa tài khoản')}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
