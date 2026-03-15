import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, Facebook, Chrome } from 'lucide-react';
import { AuthLayout } from '@/app/components/auth/AuthLayout';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Label } from '@/app/components/ui/label';
import { toast } from 'sonner';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { useAuth } from '@/app/contexts/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { v } = useLanguage();
  const { login } = useAuth();
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      role: 'user',
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const onSubmit = (data: any) => {
    console.log('Login data:', data);
    
    // Check for admin credentials
    if (data.role === 'admin' || (data.email === 'admin1@gmail.com' && data.password === 'admin1')) {
      localStorage.setItem('adminAuth', 'true');
      toast.success(v('Admin login successful!', 'Đăng nhập Admin thành công!'));
      navigate('/admin/dashboard');
      return;
    }
    
    // Check for brand credentials
    if (data.role === 'brand' || data.email === 'brand1@gmail.com' && data.password === 'brand1') {
      localStorage.setItem('brandAuth', 'true');
      toast.success(v('Brand login successful!', 'Đăng nhập Brand thành công!'));
      navigate('/brand/dashboard');
      return;
    }
    
    // Default user flow - go to home instead of onboarding
    login();
    toast.success(v('Login successful!', 'Đăng nhập thành công!'));
    navigate('/');
  };

  return (
    <AuthLayout 
      title={v("Welcome back", "Chào mừng trở lại")} 
      subtitle={v("Please enter your details to sign in.", "Vui lòng nhập thông tin để đăng nhập.")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Social Login */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" type="button" className="h-12 w-full" onClick={() => alert('Google sign-in coming soon!')}>
            <Chrome className="mr-2 h-5 w-5" />
            Google
          </Button>
          <Button variant="outline" type="button" className="h-12 w-full" onClick={() => alert('Facebook sign-in coming soon!')}>
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
            <Label htmlFor="role">{v('Account Type', 'Loại tài khoản')}</Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger id="role" className="h-12">
                    <SelectValue placeholder={v("Select account type", "Chọn loại tài khoản")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="brand">Brand</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="password">{v('Password', 'Mật khẩu')}</Label>
            <div className="relative">
              <Input 
                id="password" 
                type={showPassword ? "text" : "password"} 
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

        <Button type="submit" className="w-full h-12 bg-[#0d0d0d] hover:bg-[#d41c1c] text-white" style={{ borderRadius: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '13px', fontFamily: "'Oswald', sans-serif" }}>
          {v('Sign in', 'Đăng nhập')}
        </Button>

        {/* Demo Credentials */}
        <div className="p-4 text-xs" style={{ backgroundColor: '#fff9f2', border: '2px solid #e0d8cf', borderRadius: '10px', color: '#4a4a4a' }}>
          <p className="mb-2" style={{ fontWeight: 600, color: '#0d0d0d' }}>{v('Demo Accounts:', 'Tài khoản demo:')}</p>
          <div className="space-y-1">
            <p><strong>Brand:</strong> brand1@gmail.com / brand1</p>
            <p><strong>Admin:</strong> admin1@gmail.com / admin1</p>
          </div>
        </div>

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