import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, Facebook, Chrome, Loader2 } from 'lucide-react';
import { AuthLayout } from '@/app/components/auth/AuthLayout';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { toast } from 'sonner';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { useAuth } from '@/app/contexts/AuthContext';

interface LoginForm {
  email: string;
  password: string;
}

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { v } = useLanguage();
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    defaultValues: { email: '', password: '' },
  });

  const handleNavigateByRole = (role: string, onboardingDone: boolean) => {
    if (!onboardingDone && role === 'CUSTOMER') {
      navigate('/onboarding/style');
    } else if (role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else if (role === 'BRAND') {
      navigate('/brand/dashboard');
    } else {
      navigate('/');
    }
  };

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    try {
      const user = await loginWithEmail(data.email, data.password);
      toast.success(v('Login successful!', 'Đăng nhập thành công!'));
      handleNavigateByRole(user.role, user.onboardingDone);
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Login failed';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const user = await loginWithGoogle();
      toast.success(v('Login successful!', 'Đăng nhập thành công!'));
      handleNavigateByRole(user.role, user.onboardingDone);
    } catch (error: any) {
      const code = error?.code;
      if (code === 'auth/popup-closed-by-user') return;
      const message = error?.response?.data?.message || error?.message || 'Google login failed';
      toast.error(message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <AuthLayout
      title={v("Welcome back", "Chào mừng trở lại")}
      subtitle={v("Please enter your details to sign in.", "Vui lòng nhập thông tin để đăng nhập.")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Social Login */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            type="button"
            className="h-12 w-full"
            disabled={isGoogleLoading || isSubmitting}
            onClick={handleGoogleLogin}
          >
            {isGoogleLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Chrome className="mr-2 h-5 w-5" />}
            Google
          </Button>
          <Button variant="outline" type="button" className="h-12 w-full" disabled>
            <Facebook className="mr-2 h-5 w-5" />
            Facebook
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" style={{ borderColor: '#e0d8cf' }} />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2 text-[#888]" style={{ backgroundColor: '#FFFFFF' }}>{v('Or continue with', 'Hoặc tiếp tục với')}</span>
          </div>
        </div>

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
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{v('Password', 'Mật khẩu')}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register('password', { required: v('Password is required', 'Mật khẩu là bắt buộc') })}
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
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-black hover:underline"
          >
            {v('Forgot password?', 'Quên mật khẩu?')}
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-[#0d0d0d] hover:bg-[#d41c1c] text-white"
          style={{ borderRadius: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '13px', fontFamily: "'Oswald', sans-serif" }}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
          {v('Sign in', 'Đăng nhập')}
        </Button>

        <p className="text-center text-sm" style={{ color: '#4a4a4a' }}>
          {v("Don't have an account?", "Chưa có tài khoản?")}{' '}
          <Link to="/register" className="hover:underline" style={{ fontWeight: 600, color: '#d41c1c' }}>
            {v('Sign up', 'Đăng ký')}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
