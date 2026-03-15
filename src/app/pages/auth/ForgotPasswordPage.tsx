import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { AuthLayout } from '@/app/components/auth/AuthLayout';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useLanguage } from '@/app/i18n/LanguageContext';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { v } = useLanguage();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = (data: any) => {
    console.log('Forgot password data:', data);
    // Simulate sending reset link
    // Ideally navigate to a "check your email" page or show a toast
    // For this flow, maybe just redirect to login with a message or verify email page
    navigate('/login'); 
  };

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
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message as string}</p>}
          </div>
        </div>

        <Button type="submit" className="w-full h-12 bg-[#0d0d0d] hover:bg-[#d41c1c] text-white" style={{ borderRadius: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '13px', fontFamily: "'Oswald', sans-serif" }}>
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