import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAtom } from 'jotai';
import { OnboardingLayout } from '@/app/pages/onboarding/OnboardingLayout';
import { ProductCard } from '@/app/components/ProductCard';
import { useLanguage } from '@/app/i18n/LanguageContext';
import { useAuth } from '@/app/contexts/AuthContext';
import { userService } from '@/services/user';
import { toast } from 'sonner';
import {
  onboardingStylesAtom,
  onboardingBudgetAtom,
  onboardingSizesAtom,
  onboardingGenderAtom,
} from '@/app/stores/onboarding';

const RECOMMENDED_PRODUCTS = [
  {
    id: 1,
    title: "Vintage 90s Oversized Leather Jacket",
    price: 120,
    image: "https://images.unsplash.com/photo-1551488852-d81a27e02e0b?auto=format&fit=crop&q=80&w=800",
    seller: { name: "RetroFinds", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" },
    likes: 45
  },
  {
    id: 2,
    title: "Minimalist Cream Wool Coat",
    price: 250,
    image: "https://images.unsplash.com/photo-1580651315530-69c8e0026377?auto=format&fit=crop&q=80&w=800",
    seller: { name: "StudioMinimal", avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=100" },
    likes: 128
  },
  {
    id: 3,
    title: "Pleated Trousers Black",
    price: 85,
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800",
    seller: { name: "UrbanStyle", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" },
    likes: 67
  }
];

export function OnboardingCompletePage() {
  const navigate = useNavigate();
  const { v } = useLanguage();
  const { refreshUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [stylePrefs] = useAtom(onboardingStylesAtom);
  const [budget] = useAtom(onboardingBudgetAtom);
  const [preferredSizes] = useAtom(onboardingSizesAtom);
  const [gender] = useAtom(onboardingGenderAtom);

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      await userService.updatePreferences({
        stylePrefs,
        budgetMin: budget[0],
        budgetMax: budget[1],
        preferredSizes,
        ...(gender ? { gender } : {}),
      });
      await refreshUser();
      toast.success(v('Preferences saved!', 'Đã lưu sở thích!'));
      navigate('/');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || v('Failed to save preferences.', 'Lưu sở thích thất bại.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingLayout
      currentStep={4}
      totalSteps={4}
      title={v('All set!', 'Sẵn sàng!')}
      subtitle={v("Based on your preferences, we think you'll love these items.", 'Dựa trên sở thích của bạn, chúng tôi nghĩ bạn sẽ thích những sản phẩm này.')}
      nextLabel={v('Start Exploring', 'Bắt đầu khám phá')}
      onNext={handleFinish}
      isNextDisabled={isSubmitting}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {RECOMMENDED_PRODUCTS.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </OnboardingLayout>
  );
}
