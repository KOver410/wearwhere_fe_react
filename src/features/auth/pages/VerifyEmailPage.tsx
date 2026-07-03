import { Link, useLocation, useNavigate } from 'react-router';
import { Mail } from 'lucide-react';
import { AuthLayout } from '@/shared/components/auth/AuthLayout';
import { Button } from '@/shared/ui/button';
import { useState } from 'react';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { Input } from '@/shared/ui/input';
import { useAuth } from '@/shared/contexts/AuthContext';
import { sendVerifyEmailOtp, verifyEmailOtp } from '@/features/auth/api/authApi';
import { toast } from 'sonner';

type VerifyEmailLocationState = {
  email?: string
}

export function VerifyEmailPage() {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { v } = useLanguage();
  const emailFromState = (location.state as VerifyEmailLocationState | null)?.email ?? null;
  const email = emailFromState || user?.email || null;

  const handleVerify = async () => {
    if (!email) {
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError(v('Enter the 6-digit code from your email.', 'Nhập mã 6 chữ số từ email của bạn.'));
      return;
    }

    setIsVerifying(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await verifyEmailOtp({
        email,
        otp,
      });
      setSuccessMessage(response.message);
      toast.success(response.message);
      navigate('/email-verified');
    } catch (reason) {
      const message =
        reason instanceof Error ? reason.message : v('Verification failed', 'Xác minh thất bại');
      setError(message);
      toast.error(message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      return;
    }

    setIsResending(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await sendVerifyEmailOtp(email);
      setSuccessMessage(response.message);
      toast.success(response.message);
    } catch (reason) {
      const message =
        reason instanceof Error ? reason.message : v('Unable to resend code', 'Không thể gửi lại mã');
      setError(message);
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <AuthLayout 
        title={v('Check your email', 'Kiểm tra email của bạn')} 
        subtitle={v('We need your email address to verify this account.', 'Chúng tôi cần địa chỉ email để xác minh tài khoản này.')}
      >
        <div className="flex flex-col items-center space-y-6 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fff9f2', border: '2px solid #e0d8cf' }}>
            <Mail className="w-8 h-8" style={{ color: '#d41c1c' }} />
          </div>

          <p style={{ color: '#4a4a4a' }}>
            {v('We need your email address to verify this account.', 'Chúng tôi cần địa chỉ email để xác minh tài khoản này.')}
          </p>

          <Link to="/login" className="text-sm font-medium hover:text-[#d41c1c]" style={{ color: '#4a4a4a' }}>
            {v('Back to log in', 'Quay lại đăng nhập')}
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title={v('Check your email', 'Kiểm tra email của bạn')} 
      subtitle={v('Enter the 6-digit verification code we sent to your email address.', 'Nhập mã xác minh 6 chữ số chúng tôi đã gửi đến email của bạn.')}
    >
      <div className="flex flex-col items-center space-y-6 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fff9f2', border: '2px solid #e0d8cf' }}>
          <Mail className="w-8 h-8" style={{ color: '#d41c1c' }} />
        </div>
        
        <p style={{ color: '#4a4a4a' }}>
          {email}
        </p>

        <div className="w-full space-y-2">
          <label htmlFor="verification-code" className="block text-sm font-medium text-left" style={{ color: '#0d0d0d' }}>
            {v('Verification code', 'Mã xác minh')}
          </label>
          <Input
            id="verification-code"
            aria-label={v('Verification code', 'Mã xác minh')}
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(event) => {
              setOtp(event.target.value.replace(/\D/g, '').slice(0, 6));
              if (error) {
                setError('');
              }
            }}
            placeholder="123456"
            className="h-12 text-center tracking-[0.4em] text-lg"
          />
        </div>

        {error && (
          <p className="w-full text-sm text-left text-red-500">
            {error}
          </p>
        )}

        {successMessage && (
          <p className="w-full text-sm text-left text-green-600">
            {successMessage}
          </p>
        )}

        <Button className="w-full h-12 bg-[#0d0d0d] hover:bg-[#d41c1c] text-white" onClick={handleVerify} disabled={isVerifying}>
          {isVerifying ? v('Verifying...', 'Đang xác minh...') : v('Verify email', 'Xác minh email')}
        </Button>

        <Button variant="outline" className="w-full h-12" onClick={handleResend} disabled={isResending}>
          {isResending ? v('Sending...', 'Đang gửi...') : v('Resend code', 'Gửi lại mã')}
        </Button>

        <Link to="/login" className="text-sm font-medium hover:text-[#d41c1c]" style={{ color: '#4a4a4a' }}>
          {v('Back to log in', 'Quay lại đăng nhập')}
        </Link>
      </div>
    </AuthLayout>
  );
}
