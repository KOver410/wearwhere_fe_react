import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { AuthLayout } from '@/shared/components/auth/AuthLayout';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { forgotPassword, resetPassword } from '@/features/auth/api/authApi';

interface ResetPasswordLocationState {
  email?: string;
}

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

const PASSWORD_RULE = /^(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { v } = useLanguage();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordFormData>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });
  const password = watch('password');
  const email = (location.state as ResetPasswordLocationState | null)?.email || null;

  if (!email) {
    return (
      <AuthLayout
        title={v('Set new password', 'Đặt mật khẩu mới')}
        subtitle={v(
          'We need to send a code to your email first.',
          'Chúng tôi cần gửi mã đến email của bạn trước.',
        )}
      >
        <div className="space-y-6 text-center">
          <p className="text-sm text-gray-600">
            {v(
              'Your password reset session has expired. Request a new code to continue.',
              'Phiên đặt lại mật khẩu của bạn đã hết hạn. Hãy yêu cầu mã mới để tiếp tục.',
            )}
          </p>
          <Link
            to="/forgot-password"
            className="inline-flex text-sm font-medium text-[#d41c1c] hover:underline"
          >
            {v('Request a new code', 'Gửi lại mã')}
          </Link>
          <div>
            <Link
              to="/login"
              className="inline-flex items-center text-sm font-medium hover:text-[#d41c1c]"
              style={{ color: '#4a4a4a' }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {v('Back to log in', 'Quay lại đăng nhập')}
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!/^\d{6}$/.test(otp)) {
      setOtpError(v(
        'Enter the 6-digit code from your email.',
        'Nhập mã 6 chữ số từ email của bạn.',
      ));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await resetPassword({ email, otp, newPassword: data.password });
      toast.success(response.message);
      navigate('/login');
    } catch (error) {
      toast.error(error instanceof Error
        ? error.message
        : v('Password reset failed', 'Đặt lại mật khẩu thất bại'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setOtpError('');

    try {
      const response = await forgotPassword(email);
      toast.success(response.message);
    } catch (error) {
      toast.error(error instanceof Error
        ? error.message
        : v('Unable to resend code', 'Không thể gửi lại mã'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthLayout
      title={v('Set new password', 'Đặt mật khẩu mới')}
      subtitle={v(
        'Enter the code we sent and choose a new password.',
        'Nhập mã chúng tôi đã gửi và chọn mật khẩu mới.',
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verificationCode">{v('Verification code', 'Mã xác minh')}</Label>
            <Input
              id="verificationCode"
              aria-label={v('Verification code', 'Mã xác minh')}
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(event) => {
                setOtp(event.target.value.replace(/\D/g, '').slice(0, 6));
                setOtpError('');
              }}
              placeholder="123456"
              className="h-12"
            />
            {otpError && <p className="text-sm text-red-500">{otpError}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{v('New Password', 'Mật khẩu mới')}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password', {
                  required: v('Password is required', 'Vui lòng nhập mật khẩu'),
                  validate: (value) => PASSWORD_RULE.test(value) || v(
                    'Password must be at least 8 characters and include a number and special character',
                    'Mật khẩu phải có ít nhất 8 ký tự và bao gồm số cùng ký tự đặc biệt',
                  ),
                })}
                className="h-12 pr-10"
              />
              <button
                type="button"
                aria-label={v('Toggle password visibility', 'Hiện hoặc ẩn mật khẩu')}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{v('Confirm Password', 'Xác nhận mật khẩu')}</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword', {
                required: v('Please confirm your password', 'Vui lòng xác nhận mật khẩu'),
                validate: (value) => value === password || v(
                  'Passwords do not match',
                  'Mật khẩu không khớp',
                ),
              })}
              className="h-12"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-[#0d0d0d] hover:bg-[#d41c1c] text-white"
          style={{
            borderRadius: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontSize: '13px',
            fontFamily: "'Oswald', sans-serif",
          }}
        >
          {isSubmitting
            ? v('Resetting...', 'Đang đặt lại...')
            : v('Reset password', 'Đặt lại mật khẩu')}
        </Button>

        <div className="text-center space-y-4">
          <Button
            type="button"
            variant="ghost"
            disabled={isResending}
            onClick={handleResend}
            className="text-sm text-[#d41c1c] hover:text-[#d41c1c]"
          >
            {isResending ? v('Sending...', 'Đang gửi...') : v('Resend code', 'Gửi lại mã')}
          </Button>
          <div>
            <Link
              to="/login"
              className="inline-flex items-center text-sm font-medium hover:text-[#d41c1c]"
              style={{ color: '#4a4a4a' }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {v('Back to log in', 'Quay lại đăng nhập')}
            </Link>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
}
