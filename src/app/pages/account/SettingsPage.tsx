import { useState, useEffect } from 'react';
import { Lock, Bell, Globe, Eye, EyeOff, Shield, Trash2, Loader2 } from 'lucide-react';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AccountLayout } from '@/app/components/AccountLayout';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { useAuth } from '@/app/contexts/AuthContext';
import { userService } from '@/services/user';
import { toast } from 'sonner';
import type { NotificationPreferences } from '@/types/user';

export function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [isPwdSaving, setIsPwdSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [notifPrefs, setNotifPrefs] = useState<NotificationPreferences>({
    orders: true, promotions: true, social: true, push: true,
  });
  const [isNotifLoading, setIsNotifLoading] = useState(true);

  const [language, setLanguageVal] = useState('vi');
  const { v } = useLanguage();
  const { user, logout, refreshUser } = useAuth();

  // Load notification preferences
  useEffect(() => {
    userService.getNotificationPrefs()
      .then(data => setNotifPrefs(data))
      .catch(() => {})
      .finally(() => setIsNotifLoading(false));
  }, []);

  // Sync language from user profile
  useEffect(() => {
    if (user) setLanguageVal(user.language);
  }, [user]);

  const toggleNotif = async (key: keyof NotificationPreferences) => {
    const newVal = !notifPrefs[key];
    const prev = { ...notifPrefs };
    setNotifPrefs(p => ({ ...p, [key]: newVal }));
    try {
      await userService.updateNotificationPrefs({ [key]: newVal });
    } catch {
      setNotifPrefs(prev);
      toast.error(v('Failed to update notification.', 'Cập nhật thông báo thất bại.'));
    }
  };

  const handleLanguageChange = async (newLang: string) => {
    setLanguageVal(newLang);
    try {
      await userService.updateProfile({ language: newLang as 'vi' | 'en' });
      await refreshUser();
    } catch {
      toast.error(v('Failed to update language.', 'Cập nhật ngôn ngữ thất bại.'));
    }
  };

  const handlePasswordChange = async () => {
    if (newPwd !== confirmPwd) {
      toast.error(v('Passwords do not match.', 'Mật khẩu không khớp.'));
      return;
    }
    if (newPwd.length < 8) {
      toast.error(v('Password must be at least 8 characters.', 'Mật khẩu phải có ít nhất 8 ký tự.'));
      return;
    }

    setIsPwdSaving(true);
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser || !firebaseUser.email) throw new Error('Not authenticated');

      // Re-authenticate first
      const credential = EmailAuthProvider.credential(firebaseUser.email, currentPwd);
      await reauthenticateWithCredential(firebaseUser, credential);

      // Update password on Firebase
      await updatePassword(firebaseUser, newPwd);

      // Invalidate other sessions on backend
      await userService.invalidateSessions();

      toast.success(v('Password updated!', 'Đã cập nhật mật khẩu!'));
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
    } catch (error: any) {
      const code = error?.code;
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        toast.error(v('Current password is incorrect.', 'Mật khẩu hiện tại không đúng.'));
      } else if (code === 'auth/weak-password') {
        toast.error(v('New password is too weak.', 'Mật khẩu mới quá yếu.'));
      } else {
        toast.error(v('Failed to update password.', 'Cập nhật mật khẩu thất bại.'));
      }
    } finally {
      setIsPwdSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm(v('Are you sure you want to delete your account? This cannot be undone.', 'Bạn có chắc muốn xóa tài khoản? Hành động này không thể hoàn tác.'))) return;
    setIsDeleting(true);
    try {
      await userService.deleteAccount();
      await logout();
      window.location.href = '/login';
    } catch {
      toast.error(v('Failed to delete account.', 'Xóa tài khoản thất bại.'));
      setIsDeleting(false);
    }
  };

  const Card = ({ children, title, icon: Icon }: { children: React.ReactNode; title: string; icon: any }) => (
    <div className="bg-white p-6" style={{ borderRadius: '10px', border: '2px solid #e0d8cf', boxShadow: '0px 1px 3px rgba(0,0,0,0.05)' }}>
      <div className="flex items-center gap-2 mb-5">
        <Icon className="w-5 h-5" style={{ color: '#d41c1c' }} />
        <h2 style={{ fontSize: '18px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase' }}>{title}</h2>
      </div>
      {children}
    </div>
  );

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

  return (
    <AccountLayout>
      <div className="space-y-6">
        <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05 }}>{v('Settings', 'Cài đặt')}</h1>

        {/* Change Password */}
        <Card title={v('Change Password', 'Đổi mật khẩu')} icon={Lock}>
          <div className="space-y-4 max-w-md">
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>{v('Current Password', 'Mật khẩu hiện tại')}</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} placeholder={v('Enter current password', 'Nhập mật khẩu hiện tại')} className="w-full px-4 py-2.5 border-2 border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors pr-10" style={{ borderRadius: '10px', fontSize: '14px', backgroundColor: '#fefcfa', fontFamily: "'Montserrat', sans-serif" }} disabled={isPwdSaving} />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff className="w-4 h-4 text-[#888]" /> : <Eye className="w-4 h-4 text-[#888]" />}
                </button>
              </div>
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>{v('New Password', 'Mật khẩu mới')}</label>
              <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder={v('Enter new password', 'Nhập mật khẩu mới')} className="w-full px-4 py-2.5 border-2 border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors" style={{ borderRadius: '10px', fontSize: '14px', backgroundColor: '#fefcfa', fontFamily: "'Montserrat', sans-serif" }} disabled={isPwdSaving} />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>{v('Confirm Password', 'Xác nhận mật khẩu')}</label>
              <input type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} placeholder={v('Confirm new password', 'Xác nhận mật khẩu mới')} className="w-full px-4 py-2.5 border-2 border-[#e0d8cf] focus:border-[#d41c1c] focus:outline-none transition-colors" style={{ borderRadius: '10px', fontSize: '14px', backgroundColor: '#fefcfa', fontFamily: "'Montserrat', sans-serif" }} disabled={isPwdSaving} />
            </div>
            <button onClick={handlePasswordChange} disabled={isPwdSaving || !currentPwd || !newPwd || !confirmPwd} className="flex items-center gap-2 px-6 py-2.5 bg-[#0d0d0d] text-white hover:bg-[#d41c1c] transition-colors disabled:opacity-50" style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
              {isPwdSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {v('Update Password', 'Cập nhật mật khẩu')}
            </button>
          </div>
        </Card>

        {/* Notification Preferences */}
        <Card title={v('Notification Preferences', 'Tùy chọn thông báo')} icon={Bell}>
          {isNotifLoading ? (
            <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-[#d41c1c]" /></div>
          ) : (
            <div className="divide-y" style={{ borderColor: '#e0d8cf' }}>
              <Toggle checked={notifPrefs.orders} onChange={() => toggleNotif('orders')} label={v('Order Updates', 'Cập nhật đơn hàng')} desc={v('Get notified about order status changes', 'Nhận thông báo khi đơn hàng thay đổi trạng thái')} />
              <Toggle checked={notifPrefs.promotions} onChange={() => toggleNotif('promotions')} label={v('Promotional Emails', 'Email khuyến mãi')} desc={v('Receive deals and offers', 'Nhận ưu đãi và khuyến mãi')} />
              <Toggle checked={notifPrefs.social} onChange={() => toggleNotif('social')} label={v('Social Notifications', 'Thông báo xã hội')} desc={v('Likes, comments, and new followers', 'Lượt thích, bình luận và người theo dõi mới')} />
              <Toggle checked={notifPrefs.push} onChange={() => toggleNotif('push')} label={v('Push Notifications', 'Thông báo đẩy')} desc={v('Browser push notifications', 'Thông báo đẩy trình duyệt')} />
            </div>
          )}
        </Card>

        {/* Preferences */}
        <Card title={v('Preferences', 'Tùy chọn')} icon={Globe}>
          <div className="space-y-4 max-w-md">
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>{v('Language', 'Ngôn ngữ')}</label>
              <select value={language} onChange={e => handleLanguageChange(e.target.value)} className="w-full px-4 py-2.5 border-2 border-[#e0d8cf] bg-[#fefcfa] focus:border-[#d41c1c] focus:outline-none transition-colors appearance-none cursor-pointer" style={{ borderRadius: '10px', fontSize: '14px', fontFamily: "'Montserrat', sans-serif" }}>
                <option value="en">English</option>
                <option value="vi">Tiếng Việt</option>
              </select>
            </div>
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
          <button onClick={handleDeleteAccount} disabled={isDeleting} className="flex items-center gap-2 px-5 py-2.5 border-2 border-[#d41c1c] text-[#d41c1c] hover:bg-red-50 transition-colors disabled:opacity-50" style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
            {v('Delete Account', 'Xóa tài khoản')}
          </button>
        </div>
      </div>
    </AccountLayout>
  );
}
