import { Link } from 'react-router';
import { Mail } from 'lucide-react';
import { AuthLayout } from '@/app/components/auth/AuthLayout';
import { Button } from '@/app/components/ui/button';
import { useState } from 'react';
import { useLanguage } from '@/app/i18n/LanguageContext';

export function VerifyEmailPage() {
  const [resent, setResent] = useState(false);
  const { v } = useLanguage();

  const handleResend = () => {
    setResent(true);
    setTimeout(() => setResent(false), 5000);
  };

  return (
    <AuthLayout 
      title={v('Check your email', 'Kiểm tra email của bạn')} 
      subtitle={v('We sent a verification link to your email address.', 'Chúng tôi đã gửi liên kết xác minh đến địa chỉ email của bạn.')}
    >
      <div className="flex flex-col items-center space-y-6 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#fff9f2', border: '2px solid #e0d8cf' }}>
          <Mail className="w-8 h-8" style={{ color: '#d41c1c' }} />
        </div>
        
        <p style={{ color: '#4a4a4a' }}>
          {v("Didn't receive the email? Check your spam folder or", 'Không nhận được email? Kiểm tra thư mục spam hoặc')}
        </p>

        <Button variant="outline" className="w-full h-12" onClick={handleResend} disabled={resent}>
          {resent ? v('Email sent! Check your inbox', 'Email đã gửi! Kiểm tra hộp thư') : v('Click to resend', 'Nhấn để gửi lại')}
        </Button>

        <Link to="/login" className="text-sm font-medium hover:text-[#d41c1c]" style={{ color: '#4a4a4a' }}>
          {v('Back to log in', 'Quay lại đăng nhập')}
        </Link>
      </div>
    </AuthLayout>
  );
}
