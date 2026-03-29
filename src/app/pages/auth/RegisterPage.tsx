import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, Facebook, Chrome, Loader2 } from 'lucide-react';
import { AuthLayout } from '@/app/components/auth/AuthLayout';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import { toast } from 'sonner';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { useAuth } from '@/app/contexts/AuthContext';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const { v } = useLanguage();
  const { registerWithEmail, loginWithGoogle } = useAuth();
  const { register, handleSubmit, watch, control, formState: { errors } } = useForm<RegisterForm>({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', terms: false },
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    setIsSubmitting(true);
    try {
      const user = await registerWithEmail(data.email, data.password);
      toast.success(v('Account created successfully!', 'Tạo tài khoản thành công!'));
      if (!user.onboardingDone) {
        navigate('/onboarding/style');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      const code = error?.code;
      if (code === 'auth/email-already-in-use') {
        toast.error(v('This email is already registered.', 'Email này đã được đăng ký.'));
      } else if (code === 'auth/weak-password') {
        toast.error(v('Password is too weak.', 'Mật khẩu quá yếu.'));
      } else {
        const message = error?.response?.data?.message || error?.message || 'Registration failed';
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true);
    try {
      const user = await loginWithGoogle();
      toast.success(v('Account created successfully!', 'Tạo tài khoản thành công!'));
      if (!user.onboardingDone) {
        navigate('/onboarding/style');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      const code = error?.code;
      if (code === 'auth/popup-closed-by-user') return;
      const message = error?.response?.data?.message || error?.message || 'Google sign-up failed';
      toast.error(message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <AuthLayout
      title={v("Create an account", "Tạo tài khoản")}
      subtitle={v("Join us to discover your perfect style.", "Tham gia để khám phá phong cách hoàn hảo.")}
      imageSrc="https://images.unsplash.com/photo-1767334010488-83cdb8539273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwY2xvdGhpbmclMjByYWNrJTIwYWVzdGhldGljfGVufDF8fHx8MTc3MDA1NTU3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            type="button"
            className="h-12 w-full"
            disabled={isGoogleLoading || isSubmitting}
            onClick={handleGoogleRegister}
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
            <span className="px-2 text-[#888]" style={{ backgroundColor: '#FFFFFF' }}>{v('Or sign up with email', 'Hoặc đăng ký bằng email')}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{v('Full Name', 'Họ và tên')}</Label>
            <Input
              id="name"
              type="text"
              placeholder={v("Enter your name", "Nhập họ tên")}
              {...register('name', { required: v('Name is required', 'Tên là bắt buộc') })}
              className="h-12"
              disabled={isSubmitting}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

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
                placeholder={v("Create a password", "Tạo mật khẩu")}
                {...register('password', {
                  required: v('Password is required', 'Mật khẩu là bắt buộc'),
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
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{v('Confirm Password', 'Xác nhận mật khẩu')}</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={v("Confirm your password", "Nhập lại mật khẩu")}
              {...register('confirmPassword', {
                required: v('Please confirm your password', 'Vui lòng xác nhận mật khẩu'),
                validate: value => value === password || v('Passwords do not match', 'Mật khẩu không khớp'),
              })}
              className="h-12"
              disabled={isSubmitting}
            />
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Controller
            name="terms"
            control={control}
            rules={{ required: v('You must accept the terms', 'Bạn phải đồng ý điều khoản') }}
            render={({ field }) => (
              <Checkbox
                id="terms"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="mt-1"
                disabled={isSubmitting}
              />
            )}
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600"
            >
              I agree to the <Link to="/terms" className="text-black underline">{v('Terms of Service', 'Điều khoản sử dụng')}</Link> and <Link to="/privacy" className="text-black underline">{v('Privacy Policy', 'Chính sách bảo mật')}</Link>
            </label>
            {errors.terms && <p className="text-sm text-red-500">{errors.terms.message}</p>}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-[#0d0d0d] hover:bg-[#d41c1c] text-white"
          style={{ borderRadius: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '13px', fontFamily: "'Oswald', sans-serif" }}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
          {v('Create account', 'Tạo tài khoản')}
        </Button>

        <p className="text-center text-sm" style={{ color: '#4a4a4a' }}>
          {v('Already have an account?', 'Đã có tài khoản?')}{' '}
          <Link to="/login" className="hover:underline" style={{ fontWeight: 600, color: '#d41c1c' }}>
            {v('Sign in', 'Đăng nhập')}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
