import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { AuthLayout } from '@/app/components/auth/AuthLayout';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useLanguage } from '@/app/i18n/LanguageContext';

export function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { v } = useLanguage();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const password = watch('password');

  const onSubmit = (data: any) => {
    console.log('Reset password data:', data);
    navigate('/login');
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
                  minLength: { value: 8, message: v('Password must be at least 8 characters', 'Mật khẩu phải có ít nhất 8 ký tự') }
                })}
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{v('Confirm Password', 'Xác nhận mật khẩu')}</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              placeholder="••••••••"
              {...register('confirmPassword', { 
                required: v('Please confirm your password', 'Vui lòng xác nhận mật khẩu'),
                validate: value => value === password || v('Passwords do not match', 'Mật khẩu không khớp')
              })}
              className="h-12"
            />
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message as string}</p>}
          </div>
        </div>

        <Button type="submit" className="w-full h-12 bg-[#0d0d0d] hover:bg-[#d41c1c] text-white" style={{ borderRadius: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '13px', fontFamily: "'Oswald', sans-serif" }}>
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