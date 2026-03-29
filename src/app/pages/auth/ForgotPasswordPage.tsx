import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { ArrowLeft, Loader2, MailCheck } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AuthLayout } from '@/app/components/auth/AuthLayout';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { toast } from 'sonner';
import { useLanguage } from '@/app/i18n/LanguageContext';

export function ForgotPasswordPage() {
  const { v } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { register, handleSubmit, getValues, formState: { errors } } = useForm({
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: { email: string }) => {
    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, data.email);
      setEmailSent(true);
    } catch (error: any) {
      const code = error?.code;
      if (code === 'auth/user-not-found') {
        toast.error(v('No account found with this email.', 'Không tìm thấy tài khoản với email này.'));
      } else if (code === 'auth/too-many-requests') {
        toast.error(v('Too many requests. Please try again later.', 'Quá nhiều yêu cầu. Vui lòng thử lại sau.'));
      } else {
        toast.error(v('Failed to send reset email.', 'Gửi email đặt lại thất bại.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <AuthLayout
        title={v("Check your email", "Kiểm tra email")}
        subtitle={v("We've sent a password reset link to your email.", "Chúng tôi đã gửi liên kết đặt lại mật khẩu đến email của bạn.")}
        imageSrc="https://images.unsplash.com/photo-1631541911232-72bc7448820a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9vZCUyMGJvYXJkJTIwbWluaW1hbCUyMG5ldXRyYWx8ZW58MXx8fHwxNzcwMDkyMzgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
      >
        <div className="space-y-6 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fff9f2', border: '2px solid #e0d8cf' }}>
              <MailCheck className="w-8 h-8 text-[#d41c1c]" />
            </div>
          </div>

          <p className="text-sm" style={{ color: '#4a4a4a' }}>
            {v('We sent a reset link to', 'Chúng tôi đã gửi liên kết đến')}{' '}
            <strong>{getValues('email')}</strong>
          </p>

          <Button
            onClick={() => setEmailSent(false)}
            variant="outline"
            className="w-full h-12"
          >
            {v('Try another email', 'Thử email khác')}
          </Button>

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

  return (
    <AuthLayout
      title={v("Forgot password?", "Quên mật khẩu?")}
      subtitle={v("No worries, we'll send you reset instructions.", "Đừng lo, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.")}
      imageSrc="https://images.unsplash.com/photo-1631541911232-72bc7448820a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9vZCUyMGJvYXJkJTIwbWluaW1hbCUyMG5ldXRyYWx8ZW58MXx8fHwxNzcwMDkyMzgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{v('Email address', 'Địa chỉ email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={v("Enter your email", "Nhập email của bạn")}
              {...register('email', { required: v('Email is required', 'Email là bắt buộc') })}
              className="h-12"
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message as string}</p>}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-[#0d0d0d] hover:bg-[#d41c1c] text-white"
          style={{ borderRadius: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '13px', fontFamily: "'Oswald', sans-serif" }}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
          {v('Send reset link', 'Gửi liên kết đặt lại')}
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
