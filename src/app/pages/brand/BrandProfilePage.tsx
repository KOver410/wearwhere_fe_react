import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Facebook, Instagram, Globe, Upload, Save, Languages } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useLanguage } from '@/app/i18n/LanguageContext';

export function BrandProfilePage() {
  const { v } = useLanguage();
  const [activeTab, setActiveTab] = useState('general');
  const [lang, setLang] = useState<'en' | 'vi'>('en');

  const { register, handleSubmit } = useForm({
    defaultValues: {
      brandName: 'Brand One',
      description_en: 'Brand One is a premium fashion retailer focusing on sustainable materials and timeless designs.',
      description_vi: 'Brand One là nhà bán lẻ thời trang cao cấp tập trung vào các chất liệu bền vững và thiết kế vượt thời gian.',
      story: 'Founded in 2020, Brand One started with a simple mission: to create clothes that last. We believe in quality over quantity...',
      facebook: 'https://facebook.com/brandone',
      instagram: 'https://instagram.com/brandone',
      tiktok: '',
      website: 'https://brandone.com',
      returnPolicy: '30-day return policy for unworn items with original tags.',
      warrantyPolicy: '1-year warranty on all leather goods.',
      shippingPolicy: 'Free shipping on orders over $100. Standard delivery 3-5 business days.'
    }
  });

  const onSubmit = (data: any) => {
    console.log('Profile updated:', data);
    // Simulate API call
    alert(v('Brand profile updated successfully!', 'Cập nhật hồ sơ thương hiệu thành công!'));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">{v('Store Profile', 'Hồ sơ cửa hàng')}</h2>
          <p className="text-[#64748B]">{v('Manage your brand identity, social links, and store policies.', 'Quản lý nhận diện thương hiệu, liên kết mạng xã hội và chính sách cửa hàng.')}</p>
        </div>
        <Button onClick={handleSubmit(onSubmit)} className="bg-[#F54900] text-white hover:bg-[#E04400]">
          <Save className="mr-2 h-4 w-4" /> {v('Save Changes', 'Lưu thay đổi')}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="general">{v('General Info', 'Thông tin chung')}</TabsTrigger>
          <TabsTrigger value="social">{v('Social Links', 'Mạng xã hội')}</TabsTrigger>
          <TabsTrigger value="policies">{v('Policies', 'Chính sách')}</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{v('Brand Identity', 'Nhận diện thương hiệu')}</CardTitle>
              <CardDescription>{v('Basic information about your brand displayed to customers.', 'Thông tin cơ bản về thương hiệu của bạn hiển thị cho khách hàng.')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label>{v('Brand Logo', 'Logo thương hiệu')}</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-24 w-24 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                       <span className="text-2xl font-bold text-gray-400">B1</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => alert(v('Logo upload functionality coming soon!', 'Chức năng tải logo sắp ra mắt!'))}>
                      <Upload className="mr-2 h-4 w-4" /> {v('Upload Logo', 'Tải logo')}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{v('Cover Image', 'Ảnh bìa')}</Label>
                  <div className="h-32 w-full rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" size="sm">{v('Change Cover', 'Đổi ảnh bìa')}</Button>
                    </div>
                    <span className="text-sm text-gray-400">{v('No cover image uploaded', 'Chưa tải ảnh bìa')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brandName">{v('Brand Name', 'Tên thương hiệu')}</Label>
                <Input id="brandName" {...register('brandName')} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">{v('Description', 'Mô tả')}</Label>
                  <Button variant="ghost" size="sm" onClick={() => setLang(lang === 'en' ? 'vi' : 'en')} className="h-6 text-xs">
                    <Languages className="mr-1 h-3 w-3" />
                    {lang === 'en' ? v('English', 'Tiếng Anh') : v('Vietnamese', 'Tiếng Việt')}
                  </Button>
                </div>
                {lang === 'en' ? (
                  <Textarea 
                    id="description_en" 
                    className="min-h-[100px]" 
                    placeholder="Describe your brand in English..."
                    {...register('description_en')} 
                  />
                ) : (
                  <Textarea 
                    id="description_vi" 
                    className="min-h-[100px]" 
                    placeholder="Mô tả thương hiệu bằng tiếng Việt..."
                    {...register('description_vi')} 
                  />
                )}
                <p className="text-xs text-muted-foreground">
                  {v('Switch language to edit localized descriptions.', 'Chuyển ngôn ngữ để chỉnh sửa mô tả theo từng ngôn ngữ.')}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="story">{v('Brand Story', 'Câu chuyện thương hiệu')}</Label>
                <Textarea 
                  id="story" 
                  className="min-h-[150px]" 
                  {...register('story')} 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Links Tab */}
        <TabsContent value="social" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{v('Social Media & Website', 'Mạng xã hội & Website')}</CardTitle>
              <CardDescription>{v('Connect your social profiles to build trust with customers.', 'Kết nối các trang mạng xã hội để tạo niềm tin với khách hàng.')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="facebook" className="text-right flex items-center justify-end gap-2">
                    <Facebook className="h-4 w-4" /> Facebook
                  </Label>
                  <Input id="facebook" className="col-span-3" {...register('facebook')} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="instagram" className="text-right flex items-center justify-end gap-2">
                    <Instagram className="h-4 w-4" /> Instagram
                  </Label>
                  <Input id="instagram" className="col-span-3" {...register('instagram')} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tiktok" className="text-right flex items-center justify-end gap-2">
                     <span className="font-bold">Tk</span> TikTok
                  </Label>
                  <Input id="tiktok" className="col-span-3" placeholder="https://tiktok.com/@..." {...register('tiktok')} />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="website" className="text-right flex items-center justify-end gap-2">
                    <Globe className="h-4 w-4" /> Website
                  </Label>
                  <Input id="website" className="col-span-3" {...register('website')} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Policies Tab */}
        <TabsContent value="policies" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{v('Store Policies', 'Chính sách cửa hàng')}</CardTitle>
              <CardDescription>{v('Define clear policies for returns, warranty and shipping.', 'Xác định rõ ràng chính sách đổi trả, bảo hành và giao hàng.')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="returnPolicy">{v('Return & Refund Policy', 'Chính sách đổi trả & hoàn tiền')}</Label>
                <Textarea id="returnPolicy" className="min-h-[100px]" {...register('returnPolicy')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warrantyPolicy">{v('Warranty Policy', 'Chính sách bảo hành')}</Label>
                <Textarea id="warrantyPolicy" className="min-h-[100px]" {...register('warrantyPolicy')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shippingPolicy">{v('Shipping Policy', 'Chính sách giao hàng')}</Label>
                <Textarea id="shippingPolicy" className="min-h-[100px]" {...register('shippingPolicy')} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}