import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Eye, EyeOff, ArrowLeft, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { confirmPasswordReset } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AuthLayout } from '@/app/components/auth/AuthLayout';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { toast } from 'sonner';
import { useLanguage } from '@/app/i18n/LanguageContext';

export function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { v } = useLanguage();
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get('oobCode');

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { password: '', confirmPassword: '' },
  });

  const password = watch('password');

  // No oobCode = invalid link
  if (!oobCode) {
    return (
      <AuthLayout
        title={v('Invalid link', 'Liên kết không hợp lệ')}
        subtitle={v('This password reset link is invalid or has expired.', 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.')}
      >
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fef2f2', border: '2px solid #fecaca' }}>
              <AlertTriangle className="w-8 h-8 text-[#d41c1c]" />
            </div>
          </div>
          <Link to="/forgot-password">
            <Button className="w-full h-12 bg-[#0d0d0d] hover:bg-[#d41c1c] text-white" style={{ borderRadius: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '13px', fontFamily: "'Oswald', sans-serif" }}>
              {v('Request a new link', 'Yêu cầu liên kết mới')}
            </Button>
          </Link>
          <div className="text-center">
            <Link to="/login" className="inline-flex items-center text-sm font-medium hover:text-[#d41c1c]" style={{ color: '#4a4a4a' }}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {v('Back to log in', 'Quay lại đăng nhập')}
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Success state
  if (success) {
    return (
      <AuthLayout
        title={v('Password reset!', 'Đặt lại mật khẩu thành công!')}
        subtitle={v('Your password has been successfully reset.', 'Mật khẩu của bạn đã được đặt lại thành công.')}
      >
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#f0fdf4', border: '2px solid #bbf7d0' }}>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <Button
            onClick={() => navigate('/login')}
            className="w-full h-12 bg-[#0d0d0d] hover:bg-[#d41c1c] text-white"
            style={{ borderRadius: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '13px', fontFamily: "'Oswald', sans-serif" }}
          >
            {v('Go to login', 'Đến trang đăng nhập')}
          </Button>
        </div>
      </AuthLayout>
    );
  }

  const onSubmit = async (data: { password: string }) => {
    setIsSubmitting(true);
    try {
      await confirmPasswordReset(auth, oobCode, data.password);
      setSuccess(true);
    } catch (error: any) {
      const code = error?.code;
      if (code === 'auth/expired-action-code') {
        toast.error(v('This link has expired. Please request a new one.', 'Liên kết đã hết hạn. Vui lòng yêu cầu liên kết mới.'));
      } else if (code === 'auth/invalid-action-code') {
        toast.error(v('This link is invalid or has already been used.', 'Liên kết không hợp lệ hoặc đã được sử dụng.'));
      } else if (code === 'auth/weak-password') {
        toast.error(v('Password is too weak.', 'Mật khẩu quá yếu.'));
      } else {
        toast.error(v('Failed to reset password.', 'Đặt lại mật khẩu thất bại.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title={v('Set new password', 'Đặt mật khẩu mới')}
      subtitle={v('Must be at least 8 characters.', 'Phải có ít nhất 8 ký tự.')}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">{v('New Password', 'Mật khẩu mới')}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register('password', {
                  required: v('Password is required', 'Vui lòng nhập mật khẩu'),
                  minLength: { value: 8, message: v('Password must be at least 8 characters', 'Mật khẩu phải có ít nhất 8 ký tự') },
                })}
                className="h-12 pr-10"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password.message as string}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{v('Confirm Password', 'Xác nhận mật khẩu')}</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              {...register('confirmPassword', {
                required: v('Please confirm your password', 'Vui lòng xác nhận mật khẩu'),
                validate: value => value === password || v('Passwords do not match', 'Mật khẩu không khớp'),
              })}
              className="h-12"
              disabled={isSubmitting}
            />
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message as string}</p>}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-[#0d0d0d] hover:bg-[#d41c1c] text-white"
          style={{ borderRadius: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '13px', fontFamily: "'Oswald', sans-serif" }}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
          {v('Reset password', 'Đặt lại mật khẩu')}
        </Button>

        <div className="text-center">
          <Link to="/login" className="inline-flex items-center text-sm font-medium hover:text-[#d41c1c]" style={{ color: '#4a4a4a' }}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {v('Back to log in', 'Quay lại đăng nhập')}
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
