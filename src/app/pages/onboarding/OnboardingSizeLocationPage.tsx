import { useState } from 'react';
import { useNavigate } from 'react-router';
import { OnboardingLayout } from '@/app/pages/onboarding/OnboardingLayout';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { useLanguage } from '@/app/i18n/LanguageContext';

export function OnboardingSizeLocationPage() {
  const navigate = useNavigate();
  const { v } = useLanguage();
  const [sizes, setSizes] = useState({
    tops: '',
    bottoms: '',
    shoes: ''
  });
  const [location, setLocation] = useState('');

  const handleNext = () => {
    console.log('Sizes:', sizes, 'Location:', location);
    navigate('/onboarding/complete');
  };

  const isComplete = sizes.tops && sizes.bottoms && sizes.shoes && location;

  return (
    <OnboardingLayout
      currentStep={3}
      totalSteps={4}
      title={v('Size & Details', 'Kích thước & Chi tiết')}
      subtitle={v('Help us find items that fit you perfectly.', 'Giúp chúng tôi tìm sản phẩm vừa vặn với bạn.')}
      onBack={() => navigate('/onboarding/price')}
      onNext={handleNext}
      isNextDisabled={!isComplete}
    >
      <div className="max-w-md mx-auto space-y-8">
        {/* Size Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold border-b pb-2">{v('My Sizes', 'Kích thước của tôi')}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{v('Tops', 'Áo')}</Label>
              <Select onValueChange={(val) => setSizes({...sizes, tops: val})}>
                <SelectTrigger>
                  <SelectValue placeholder={v('Select', 'Chọn')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xs">XS</SelectItem>
                  <SelectItem value="s">S</SelectItem>
                  <SelectItem value="m">M</SelectItem>
                  <SelectItem value="l">L</SelectItem>
                  <SelectItem value="xl">XL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{v('Bottoms', 'Quần')}</Label>
              <Select onValueChange={(val) => setSizes({...sizes, bottoms: val})}>
                <SelectTrigger>
                  <SelectValue placeholder={v('Select', 'Chọn')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="28">28"</SelectItem>
                  <SelectItem value="30">30"</SelectItem>
                  <SelectItem value="32">32"</SelectItem>
                  <SelectItem value="34">34"</SelectItem>
                  <SelectItem value="36">36"</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{v('Shoes', 'Giày')}</Label>
              <Select onValueChange={(val) => setSizes({...sizes, shoes: val})}>
                <SelectTrigger>
                  <SelectValue placeholder={v('Select', 'Chọn')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">US 7</SelectItem>
                  <SelectItem value="8">US 8</SelectItem>
                  <SelectItem value="9">US 9</SelectItem>
                  <SelectItem value="10">US 10</SelectItem>
                  <SelectItem value="11">US 11</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold border-b pb-2">{v('Location', 'Vị trí')}</h3>
          
          <div className="space-y-2">
            <Label htmlFor="location">{v('City or Country', 'Thành phố hoặc Quốc gia')}</Label>
            <Input 
              id="location" 
              placeholder={v('e.g. New York, USA', 'VD: Hồ Chí Minh, Việt Nam')} 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-12"
            />
            <p style={{ fontSize: '12px', color: '#888' }}>{v('We use this to show you items shipping from nearby.', 'Chúng tôi dùng thông tin này để hiển thị sản phẩm giao hàng gần bạn.')}</p>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}