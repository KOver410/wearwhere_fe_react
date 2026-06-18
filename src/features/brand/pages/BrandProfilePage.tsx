import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Facebook, Instagram, Globe, Upload, Save, Languages } from 'lucide-react';
import { ImageWithFallback } from '@/shared/components/figma/ImageWithFallback';

export function BrandProfilePage() {
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
    alert('Brand profile updated successfully!');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">Store Profile</h2>
          <p className="text-[#64748B]">Manage your brand identity, social links, and store policies.</p>
        </div>
        <Button onClick={handleSubmit(onSubmit)} className="bg-[#F54900] text-white hover:bg-[#E04400]">
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="general">General Info</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Identity</CardTitle>
              <CardDescription>Basic information about your brand displayed to customers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label>Brand Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-24 w-24 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                       <span className="text-2xl font-bold text-gray-400">B1</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => alert('Logo upload functionality coming soon!')}>
                      <Upload className="mr-2 h-4 w-4" /> Upload Logo
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <div className="h-32 w-full rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center relative overflow-hidden group cursor-pointer">
                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" size="sm">Change Cover</Button>
                    </div>
                    <span className="text-sm text-gray-400">No cover image uploaded</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="brandName">Brand Name</Label>
                <Input id="brandName" {...register('brandName')} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">Description</Label>
                  <Button variant="ghost" size="sm" onClick={() => setLang(lang === 'en' ? 'vi' : 'en')} className="h-6 text-xs">
                    <Languages className="mr-1 h-3 w-3" />
                    {lang === 'en' ? 'English' : 'Vietnamese'}
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
                  Switch language to edit localized descriptions.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="story">Brand Story</Label>
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
              <CardTitle>Social Media & Website</CardTitle>
              <CardDescription>Connect your social profiles to build trust with customers.</CardDescription>
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
              <CardTitle>Store Policies</CardTitle>
              <CardDescription>Define clear policies for returns, warranty and shipping.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="returnPolicy">Return & Refund Policy</Label>
                <Textarea id="returnPolicy" className="min-h-[100px]" {...register('returnPolicy')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warrantyPolicy">Warranty Policy</Label>
                <Textarea id="warrantyPolicy" className="min-h-[100px]" {...register('warrantyPolicy')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shippingPolicy">Shipping Policy</Label>
                <Textarea id="shippingPolicy" className="min-h-[100px]" {...register('shippingPolicy')} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}