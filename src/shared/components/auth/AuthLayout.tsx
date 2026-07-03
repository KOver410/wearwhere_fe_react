import { ReactNode } from 'react';
import { Link } from 'react-router';
import logoImage from '@/assets/80e96fc2cdc554ebf44dc26a8edeb9829e3445b2.png';

interface AuthLayoutProps {
  children: ReactNode;
  imageSrc?: string;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ 
  children, 
  imageSrc = "https://images.unsplash.com/photo-1764148803719-188173576d71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGFyY2hpdGVjdHVyZSUyMGx1eHVyeSUyMGhlcml0YWdlJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzIxMDYwNzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
  title,
  subtitle
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex w-full" style={{ backgroundColor: '#fff9f2', fontFamily: "'Montserrat', sans-serif" }}>
      {/* Left Side - Image */}
      <div className="hidden lg:block w-1/2 relative" style={{ backgroundColor: '#F3F4F6' }}>
        <img 
          src={imageSrc} 
          alt="Fashion" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(13,13,13,0.4) 0%, transparent 40%, rgba(13,13,13,0.3) 100%)' }} />
        {/* Bold corner frames — editorial style */}
        <div className="absolute top-6 left-6 w-16 h-16" style={{ borderTop: '2px solid #d41c1c', borderLeft: '2px solid #d41c1c' }} />
        <div className="absolute top-6 right-6 w-16 h-16" style={{ borderTop: '2px solid #d41c1c', borderRight: '2px solid #d41c1c' }} />
        <div className="absolute bottom-6 left-6 w-16 h-16" style={{ borderBottom: '2px solid #d41c1c', borderLeft: '2px solid #d41c1c' }} />
        <div className="absolute bottom-6 right-6 w-16 h-16" style={{ borderBottom: '2px solid #d41c1c', borderRight: '2px solid #d41c1c' }} />
        <div className="absolute top-8 left-8">
           <Link to="/">
             <img src={logoImage} alt="Wear Where" className="h-9 w-auto brightness-0 invert" />
           </Link>
        </div>
      </div>

      {/* Right Side - Content */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 md:px-16 xl:px-24 py-12" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-md w-full mx-auto">
          {/* Top accent line */}
          <div className="mb-8 h-[2px]" style={{ background: 'linear-gradient(to right, #d41c1c, #e2b93b, transparent)', maxWidth: '120px' }} />

          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Link to="/">
              <img src={logoImage} alt="Wear Where" className="h-9 w-auto" />
            </Link>
          </div>

          <div className="mb-8">
            <h1 style={{ fontSize: '30px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', textTransform: 'uppercase', lineHeight: 1.1 }}>
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3" style={{ fontSize: '15px', color: '#4a4a4a', fontWeight: 400, lineHeight: 1.5 }}>{subtitle}</p>
            )}
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
