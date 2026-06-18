import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Eye, EyeOff, Facebook, Chrome } from 'lucide-react';
import { AuthLayout } from '@/shared/components/auth/AuthLayout';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Checkbox } from '@/shared/ui/checkbox';
import { Label } from '@/shared/ui/label';
import { toast } from 'sonner';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { useAuth } from '@/shared/contexts/AuthContext';

type LoginFormValues = {
  email: string
  password: string
  rememberMe: boolean
}

function safeRedirectTarget(rawRedirect: string | null): string {
  if (typeof rawRedirect === 'string' && rawRedirect.startsWith('/') && !rawRedirect.startsWith('//')) {
    return rawRedirect;
  }

  return '/';
}

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { v } = useLanguage();
  const { login } = useAuth();
  const { register, handleSubmit, control, formState: { errors } } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);

    try {
      await login(
        {
          email: data.email,
          password: data.password,
        },
        data.rememberMe,
      );
      toast.success(v('Login successful!', 'Đăng nhập thành công!'));
      navigate(safeRedirectTarget(searchParams.get('redirect')));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : v('Login failed', 'Đăng nhập thất bại'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout 
      title={v('Welcome back', 'Chào mừng trở lại')} 
      subtitle={v('Please enter your details to sign in.', 'Vui lòng nhập thông tin để đăng nhập.')}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" type="button" className="h-12 w-full" disabled>
            <Chrome className="mr-2 h-5 w-5" />
            Google (Chưa hỗ trợ)
          </Button>
          <Button variant="outline" type="button" className="h-12 w-full" disabled>
            <Facebook className="mr-2 h-5 w-5" />
            Facebook (Chưa hỗ trợ)
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
              placeholder={v('Enter your email', 'Nhập email của bạn')}
              {...register('email', { required: v('Email is required', 'Email là bắt buộc') })}
              className="h-12"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message as string}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{v('Password', 'Mật khẩu')}</Label>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••"
                {...register('password', { required: v('Password is required', 'Mật khẩu là bắt buộc') })}
                className="h-12 pr-10"
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
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <Checkbox 
                  id="remember" 
                  checked={field.value} 
                  onCheckedChange={field.onChange} 
                />
              )}
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {v('Remember me', 'Ghi nhớ đăng nhập')}
            </label>
          </div>
          <Link 
            to="/forgot-password" 
            className="text-sm font-medium text-black hover:underline"
          >
            {v('Forgot password?', 'Quên mật khẩu?')}
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-[#0d0d0d] hover:bg-[#d41c1c] text-white"
          style={{ borderRadius: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '13px', fontFamily: "'Oswald', sans-serif" }}
        >
          {isSubmitting ? v('Signing in...', 'Đang đăng nhập...') : v('Sign in', 'Đăng nhập')}
        </Button>

        <p className="text-center text-sm" style={{ color: '#4a4a4a' }}>
          {v("Don't have an account?", 'Chưa có tài khoản?')}{' '}
          <Link to="/register" className="hover:underline" style={{ fontWeight: 600, color: '#d41c1c' }}>
            {v('Sign up', 'Đăng ký')}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
