import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link, useNavigate, useLocation, Navigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import { AuthLayout } from '@/shared/components/auth/AuthLayout';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Checkbox } from '@/shared/ui/checkbox';
import { Label } from '@/shared/ui/label';
import { toast } from 'sonner';
import { useLanguage } from '@/shared/i18n/LanguageContext';
import { ApiError } from '@/shared/api/contracts';
import type { AuthUser } from '@/features/auth/api/contracts';

export type PortalLoginFormProps = {
  role: string;
  loginFn: (input: { email: string; password: string }, rememberMe: boolean) => Promise<AuthUser>;
  isLoggedIn: boolean;
  currentRole: string | null;
  routePrefix: string;
  dashboardPath: string;
  idPrefix: string;
  title: string;
  subtitle: string;
};

type PortalLoginValues = {
  email: string;
  password: string;
  rememberMe: boolean;
};

function safePortalRedirect(raw: string | null, prefix: string, fallback: string): string {
  if (typeof raw === 'string' && raw.startsWith(prefix) && !raw.startsWith('//')) {
    return raw;
  }
  return fallback;
}

export function PortalLoginForm({
  role,
  loginFn,
  isLoggedIn,
  currentRole,
  routePrefix,
  dashboardPath,
  idPrefix,
  title,
  subtitle,
}: PortalLoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { v } = useLanguage();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PortalLoginValues>({
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const fromState = (location.state as { from?: { pathname?: string; search?: string } } | null)?.from;
  const fromPath = fromState ? `${fromState.pathname ?? ''}${fromState.search ?? ''}` : null;
  const target = safePortalRedirect(fromPath, routePrefix, dashboardPath);

  const onSubmit = async (data: PortalLoginValues) => {
    setIsSubmitting(true);
    try {
      await loginFn({ email: data.email, password: data.password }, data.rememberMe);
      toast.success(v('Login successful!', 'Đăng nhập thành công!'));
      navigate(target);
    } catch (error) {
      const message =
        error instanceof ApiError && error.code === 'INVALID_CREDENTIALS'
          ? v('Email or password is incorrect', 'Email hoặc mật khẩu không đúng')
          : error instanceof ApiError && error.code === 'ACCOUNT_LOCKED'
            ? v('Account temporarily locked after too many attempts. Try again later.', 'Tài khoản tạm khóa do đăng nhập sai quá nhiều lần. Vui lòng thử lại sau.')
            : error instanceof ApiError && error.code === 'ACCOUNT_DELETED'
              ? v('This account has been deleted.', 'Tài khoản này đã bị xóa.')
              : error instanceof Error
                ? error.message
                : v('Login failed', 'Đăng nhập thất bại');
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoggedIn && currentRole === role) {
    return <Navigate to={target} replace />;
  }

  return (
    <AuthLayout title={title} subtitle={subtitle}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-email`}>{v('Email address', 'Địa chỉ email')}</Label>
            <Input
              id={`${idPrefix}-email`}
              type="email"
              placeholder={v('Enter your email', 'Nhập email của bạn')}
              {...register('email', { required: v('Email is required', 'Email là bắt buộc') })}
              className="h-12"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message as string}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}-password`}>{v('Password', 'Mật khẩu')}</Label>
            <div className="relative">
              <Input
                id={`${idPrefix}-password`}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password', { required: v('Password is required', 'Mật khẩu là bắt buộc') })}
                className="h-12 pr-10"
              />
              <button
                type="button"
                aria-label={showPassword ? v('Hide password', 'Ẩn mật khẩu') : v('Show password', 'Hiện mật khẩu')}
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
                <Checkbox id={`${idPrefix}-remember`} checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
            <label htmlFor={`${idPrefix}-remember`} className="text-sm font-medium leading-none">
              {v('Remember me', 'Ghi nhớ đăng nhập')}
            </label>
          </div>
          <Link to="/login" className="text-sm font-medium text-black hover:underline">
            {v('Customer login', 'Đăng nhập khách hàng')}
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
      </form>
    </AuthLayout>
  );
}
