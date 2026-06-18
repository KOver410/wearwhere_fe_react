import { ReactNode } from 'react';
import { Link } from 'react-router';
import logoImage from '@/assets/80e96fc2cdc554ebf44dc26a8edeb9829e3445b2.png';
import { useLanguage } from '@/shared/i18n/LanguageContext';

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  onNext?: () => void;
  isNextDisabled?: boolean;
}

export function OnboardingLayout({
  children,
  currentStep,
  totalSteps,
  title,
  subtitle,
  onBack,
  onSkip,
  nextLabel,
  onNext,
  isNextDisabled = false
}: OnboardingLayoutProps) {
  const { v } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FFFFFF', fontFamily: "'Montserrat', sans-serif" }}>
      {/* Top accent line */}
      <div className="h-[3px]" style={{ background: 'linear-gradient(to right, transparent, #d41c1c 20%, #e2b93b 50%, #d41c1c 80%, transparent)' }} />

      {/* Header */}
      <header className="h-20 flex items-center justify-between px-6 md:px-12" style={{ borderBottom: '2px solid #e0d8cf' }}>
        <div className="w-20">
          {currentStep > 1 && onBack && (
            <button 
              onClick={onBack}
              className="transition-colors hover:text-[#d41c1c]"
              style={{ fontSize: '13px', fontWeight: 600, color: '#4a4a4a', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
            >
              {v('Back', 'Quay lại')}
            </button>
          )}
        </div>
        
        <Link to="/">
          <img src={logoImage} alt="Wear Where" className="h-9 w-auto" />
        </Link>

        <div className="w-20 text-right">
          {onSkip && (
            <button 
              onClick={onSkip}
              className="transition-colors hover:text-[#d41c1c]"
              style={{ fontSize: '13px', fontWeight: 500, color: '#888', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}
            >
              {v('Skip', 'Bỏ qua')}
            </button>
          )}
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full h-1" style={{ backgroundColor: '#f0ebe4' }}>
        <div 
          className="h-1 transition-all duration-500 ease-in-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%`, background: 'linear-gradient(to right, #d41c1c, #e2b93b)' }}
        />
      </div>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 max-w-4xl mx-auto w-full">
        <div className="text-center mb-10 max-w-lg">
          <span className="block mb-3" style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#d41c1c', fontFamily: "'Oswald', sans-serif" }}>
            {v(`Step ${currentStep} of ${totalSteps}`, `Bước ${currentStep} / ${totalSteps}`)}
          </span>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.05 }}>
            {title}
          </h1>
          {subtitle && <p className="mt-3" style={{ fontSize: '16px', color: '#4a4a4a', fontWeight: 400, lineHeight: 1.5 }}>{subtitle}</p>}
        </div>

        <div className="w-full mb-12">
          {children}
        </div>

        {/* Footer Actions */}
        <div className="w-full max-w-xs mx-auto">
          <button
            onClick={onNext}
            disabled={isNextDisabled}
            className="w-full h-12 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#d41c1c]"
            style={{
              backgroundColor: '#0d0d0d',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              borderRadius: '10px',
              fontFamily: "'Oswald', sans-serif",
            }}
          >
            {nextLabel || v('Next', 'Tiếp tục')}
          </button>
        </div>
      </main>
    </div>
  );
}