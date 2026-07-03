import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { AuthLayout } from '@/shared/components/auth/AuthLayout';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { forgotPassword } from '@/features/auth/api/authApi';

interface ForgotPasswordFormData {
  email: string;
}

export function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { v } = useLanguage();
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);

    try {
      const response = await forgotPassword(data.email);
      toast.success(response.message);
      navigate('/reset-password', { state: { email: data.email } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : v('Unable to send code', 'Không thể gửi mã'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout 
      title={v("Forgot password?", "Quên mật khẩu?")} 
      subtitle={v("No worries, we'll send you a reset code.", "Đừng lo, chúng tôi sẽ gửi mã đặt lại mật khẩu.")}
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
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message as string}</p>}
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full h-12 bg-[#0d0d0d] hover:bg-[#d41c1c] text-white" style={{ borderRadius: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '13px', fontFamily: "'Oswald', sans-serif" }}>
          {isSubmitting ? v('Sending...', 'Đang gửi...') : v('Send code', 'Gửi mã')}
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
