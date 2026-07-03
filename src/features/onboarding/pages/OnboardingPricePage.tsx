import { useState } from 'react';
import { useNavigate } from 'react-router';
import { OnboardingLayout } from '@/features/onboarding/pages/OnboardingLayout';
import { Slider } from '@/shared/ui/slider';
import { Label } from '@/shared/ui/label';
import { useLanguage } from '@/shared/i18n/LanguageContext';

export function OnboardingPricePage() {
  const navigate = useNavigate();
  const [priceRange, setPriceRange] = useState([50, 500]);
  const { v } = useLanguage();

  const handleNext = () => {
    console.log('Price range:', priceRange);
    navigate('/onboarding/size-location');
  };

  return (
    <OnboardingLayout
      currentStep={2}
      totalSteps={4}
      title={v('Set your budget', 'Thiết lập ngân sách')}
      subtitle={v('How much do you typically spend on a single item?', 'Bạn thường chi bao nhiêu cho một sản phẩm?')}
      onBack={() => navigate('/onboarding/style')}
      onSkip={() => navigate('/onboarding/size-location')}
      onNext={handleNext}
    >
      <div className="max-w-md mx-auto py-12 px-4">
        <div className="mb-12 text-center">
          <span style={{ fontSize: '48px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', letterSpacing: '-0.02em' }}>
            ${priceRange[0]} - ${priceRange[1]}
          </span>
          <span style={{ fontSize: '24px', color: '#888', marginLeft: '4px' }}>+</span>
        </div>

        <div className="space-y-8">
          <Slider
            defaultValue={[50, 500]}
            max={1000}
            step={10}
            value={priceRange}
            onValueChange={setPriceRange}
            className="w-full"
          />
          
          <div className="flex justify-between" style={{ fontSize: '13px', color: '#888', fontWeight: 500 }}>
            <span>$0</span>
            <span>$250</span>
            <span>$500</span>
            <span>$750</span>
            <span>$1000+</span>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4">
          <div className="p-4 border-2 border-[#e0d8cf] text-center cursor-pointer hover:border-[#d41c1c] transition-colors" style={{ borderRadius: '10px' }} onClick={() => setPriceRange([0, 100])}>
            <div style={{ fontSize: '16px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', marginBottom: '4px', textTransform: 'uppercase' }}>{v('Thrifty', 'Tiết kiệm')}</div>
            <div style={{ fontSize: '13px', color: '#888' }}>{v('Under $100', 'Dưới $100')}</div>
          </div>
          <div className="p-4 border-2 border-[#e0d8cf] text-center cursor-pointer hover:border-[#d41c1c] transition-colors" style={{ borderRadius: '10px' }} onClick={() => setPriceRange([100, 300])}>
            <div style={{ fontSize: '16px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', marginBottom: '4px', textTransform: 'uppercase' }}>{v('Casual', 'Bình thường')}</div>
            <div style={{ fontSize: '13px', color: '#888' }}>$100 - $300</div>
          </div>
          <div className="p-4 border-2 border-[#e0d8cf] text-center cursor-pointer hover:border-[#d41c1c] transition-colors" style={{ borderRadius: '10px' }} onClick={() => setPriceRange([300, 600])}>
            <div style={{ fontSize: '16px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', marginBottom: '4px', textTransform: 'uppercase' }}>Premium</div>
            <div style={{ fontSize: '13px', color: '#888' }}>$300 - $600</div>
          </div>
          <div className="p-4 border-2 border-[#e0d8cf] text-center cursor-pointer hover:border-[#d41c1c] transition-colors" style={{ borderRadius: '10px' }} onClick={() => setPriceRange([600, 1000])}>
            <div style={{ fontSize: '16px', fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#0d0d0d', marginBottom: '4px', textTransform: 'uppercase' }}>{v('Luxury', 'Cao cấp')}</div>
            <div style={{ fontSize: '13px', color: '#888' }}>$600+</div>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}
