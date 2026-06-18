import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Check } from 'lucide-react';
import { OnboardingLayout } from '@/features/onboarding/pages/OnboardingLayout';
import { useLanguage } from '@/shared/i18n/LanguageContext';

const STYLES = [
  { id: 'streetwear', name: 'Streetwear', nameVi: 'Đường phố', image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=600' },
  { id: 'minimalist', name: 'Minimalist', nameVi: 'Tối giản', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=600' },
  { id: 'vintage', name: 'Vintage', nameVi: 'Cổ điển', image: 'https://images.unsplash.com/photo-1550614000-4b9519e0233b?auto=format&fit=crop&q=80&w=600' },
  { id: 'casual', name: 'Casual', nameVi: 'Thường ngày', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600' },
  { id: 'luxury', name: 'Luxury', nameVi: 'Cao cấp', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600' },
  { id: 'sporty', name: 'Sporty', nameVi: 'Thể thao', image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=600' },
];

export function OnboardingStylePage() {
  const navigate = useNavigate();
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const { v, lang } = useLanguage();

  const toggleStyle = (id: string) => {
    setSelectedStyles(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    console.log('Selected styles:', selectedStyles);
    navigate('/onboarding/price');
  };

  return (
    <OnboardingLayout
      currentStep={1}
      totalSteps={4}
      title={v("What's your style?", 'Phong cách của bạn là gì?')}
      subtitle={v("Select the styles that you're interested in. We'll use this to personalize your feed.", 'Chọn những phong cách bạn yêu thích. Chúng tôi sẽ dùng để cá nhân hoá nguồn cấp dữ liệu.')}
      onSkip={() => navigate('/onboarding/price')}
      onNext={handleNext}
      isNextDisabled={selectedStyles.length === 0}
    >
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {STYLES.map((style) => (
          <div 
            key={style.id}
            onClick={() => toggleStyle(style.id)}
            className="group relative cursor-pointer overflow-hidden aspect-[3/4]"
            style={{ borderRadius: '4px' }}
          >
            <img 
              src={style.image} 
              alt={lang === 'vi' ? style.nameVi : style.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className={`absolute inset-0 bg-black/20 transition-colors ${selectedStyles.includes(style.id) ? 'bg-black/50' : 'group-hover:bg-black/30'}`} />
            
            {/* Selected border overlay */}
            {selectedStyles.includes(style.id) && (
              <div className="absolute inset-0 pointer-events-none" style={{ border: '3px solid #d41c1c' }} />
            )}

            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
               {selectedStyles.includes(style.id) && (
                 <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 animate-in zoom-in duration-200" style={{ backgroundColor: '#d41c1c' }}>
                   <Check className="w-6 h-6 text-white" />
                 </div>
               )}
               <span className="text-white text-lg md:text-xl tracking-wide uppercase shadow-sm" style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, letterSpacing: '0.1em' }}>
                 {lang === 'vi' ? style.nameVi : style.name}
               </span>
            </div>
          </div>
        ))}
      </div>
    </OnboardingLayout>
  );
}
