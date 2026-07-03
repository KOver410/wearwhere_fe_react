import { Link } from 'react-router';
import { CheckCircle } from 'lucide-react';
import { AuthLayout } from '@/shared/components/auth/AuthLayout';
import { Button } from '@/shared/ui/button';
import { useLanguage } from '@/shared/i18n/LanguageContext';

export function EmailVerifiedPage() {
  const { v } = useLanguage();

  return (
    <AuthLayout 
      title={v('Email verified', 'Email đã xác minh')} 
      subtitle={v('Your account has been successfully verified.', 'Tài khoản của bạn đã được xác minh thành công.')}
    >
      <div className="flex flex-col items-center space-y-6 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#d41c1c' }}>
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        
        <div className="w-full">
          <Link to="/onboarding/style">
            <Button className="w-full h-12 bg-[#0d0d0d] hover:bg-[#d41c1c] text-white" style={{ borderRadius: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '13px', fontFamily: "'Oswald', sans-serif" }}>
              {v('Continue', 'Tiếp tục')}
            </Button>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
