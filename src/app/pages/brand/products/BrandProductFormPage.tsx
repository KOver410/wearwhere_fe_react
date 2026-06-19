import React, { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { Link, useNavigate } from 'react-router';
import { 
  ArrowLeft, Upload, X, Plus, Trash2, 
  HelpCircle, AlertCircle, Save 
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Switch } from '@/app/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { toast } from 'sonner';
import { cn } from '@/app/components/ui/utils';
import { useLanguage } from '@/app/i18n/LanguageContext';

interface ProductFormValues {
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  costPerItem?: number;
  sku: string;
  barcode?: string;
  trackQuantity: boolean;
  quantity: number;
  category: string;
  productType: string;
  tags: string;
  status: 'active' | 'draft';
}

export default function BrandProductFormPage() {
  const { v } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  // Variants state (simplified)
  const [hasVariants, setHasVariants] = useState(false);
  const [options, setOptions] = useState<{name: string, values: string[]}[]>([
    { name: 'Size', values: [] },
    { name: 'Color', values: [] }
  ]);

  const { register, handleSubmit, control, formState: { errors } } = useForm<ProductFormValues>({
    defaultValues: {
      status: 'active',
      trackQuantity: true,
      price: 0,
      quantity: 0
    }
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages(prev => [...prev, ...acceptedFiles]);
    const newUrls = acceptedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newUrls]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.webp']
    }
  });

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      // Revoke old URL to avoid memory leaks
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const onSubmit = async (data: ProductFormValues) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Form Data:', data);
      console.log('Images:', images);
      toast.success(v('Product created successfully', 'Tạo sản phẩm thành công'));
      setIsLoading(false);
      navigate('/brand/products');
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/brand/products">
          <Button variant="outline" size="icon" className="h-10 w-10">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">{v('Add New Product', 'Thêm sản phẩm mới')}</h1>
          <p className="text-sm text-[#64748B]">{v('Create a new product for your store.', 'Tạo một sản phẩm mới cho cửa hàng của bạn.')}</p>
        </div>
        <div className="ml-auto flex gap-3">
          <Link to="/brand/products">
            <Button variant="outline">{v('Discard', 'Hủy bỏ')}</Button>
          </Link>
          <Button type="submit" className="bg-[#F54900] text-white hover:bg-[#E04400]" disabled={isLoading}>
            {isLoading ? v('Saving...', 'Đang lưu...') : v('Save Product', 'Lưu sản phẩm')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>{v('Product Details', 'Chi tiết sản phẩm')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{v('Title', 'Tiêu đề')}</Label>
                <Input
                  id="name"
                  placeholder={v('e.g. Oversized Cotton T-Shirt', 'VD: Áo thun cotton form rộng')}
                  {...register('name', { required: v('Product name is required', 'Tên sản phẩm là bắt buộc') })}
                  className={errors.name ? 'border-red-300' : ''}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{v('Description', 'Mô tả')}</Label>
                <Textarea
                  id="description"
                  placeholder={v('Describe your product...', 'Mô tả sản phẩm của bạn...')}
                  className="min-h-[120px]"
                  {...register('description')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card>
            <CardHeader>
              <CardTitle>{v('Media', 'Hình ảnh & video')}</CardTitle>
              <CardDescription>{v('Upload images or videos of your product.', 'Tải lên hình ảnh hoặc video sản phẩm của bạn.')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                {...getRootProps()} 
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                  isDragActive ? "border-[#F54900] bg-[#F54900]/5" : "border-gray-200 hover:border-gray-300"
                )}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center">
                  <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <Upload className="h-6 w-6 text-gray-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{v('Click to upload or drag and drop', 'Nhấn để tải lên hoặc kéo thả')}</p>
                  <p className="text-xs text-gray-500 mt-1">{v('SVG, PNG, JPG or GIF (max. 5MB)', 'SVG, PNG, JPG hoặc GIF (tối đa 5MB)')}</p>
                </div>
              </div>

              {/* Image Previews */}
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                      <img src={url} alt={`${v('Preview', 'Xem trước')} ${index}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>{v('Pricing', 'Giá')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">{v('Price', 'Giá bán')}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₫</span>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      className="pl-7"
                      {...register('price', { required: true, min: 0 })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compareAtPrice">{v('Compare-at Price', 'Giá so sánh')}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₫</span>
                    <Input 
                      id="compareAtPrice" 
                      type="number" 
                      step="0.01"
                      className="pl-7"
                      {...register('compareAtPrice')}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="tax" defaultChecked />
                <label
                  htmlFor="tax"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {v('Charge tax on this product', 'Tính thuế cho sản phẩm này')}
                </label>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="costPerItem">{v('Cost per item', 'Giá vốn mỗi sản phẩm')}</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₫</span>
                      <Input 
                        id="costPerItem" 
                        type="number" 
                        step="0.01"
                        className="pl-7"
                        {...register('costPerItem')}
                      />
                    </div>
                    <p className="text-xs text-gray-500">{v("Customers won't see this", 'Khách hàng sẽ không thấy thông tin này')}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>{v('Profit', 'Lợi nhuận')}</Label>
                    <div className="h-10 px-3 py-2 text-sm text-gray-500 border border-transparent flex items-center">
                      --
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle>{v('Inventory', 'Tồn kho')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">{v('SKU (Stock Keeping Unit)', 'SKU (Mã quản lý hàng hóa)')}</Label>
                  <Input 
                    id="sku" 
                    {...register('sku')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barcode">{v('Barcode (ISBN, UPC, GTIN, etc.)', 'Mã vạch (ISBN, UPC, GTIN, v.v.)')}</Label>
                  <Input 
                    id="barcode" 
                    {...register('barcode')}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Controller
                  name="trackQuantity"
                  control={control}
                  render={({ field }) => (
                    <Switch 
                      id="trackQuantity" 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  )}
                />
                <Label htmlFor="trackQuantity">{v('Track quantity', 'Theo dõi số lượng')}</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">{v('Quantity', 'Số lượng')}</Label>
                <Input 
                  id="quantity" 
                  type="number"
                  {...register('quantity')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Variants */}
          <Card>
            <CardHeader>
              <CardTitle>{v('Variants', 'Biến thể')}</CardTitle>
              <CardDescription>{v('Add variations like size or color.', 'Thêm các biến thể như kích cỡ hoặc màu sắc.')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                 <div className="flex items-center gap-3">
                   <Plus className="h-5 w-5 text-gray-500" />
                   <div>
                     <p className="font-medium text-gray-900">{v('Add options like size or color', 'Thêm tùy chọn như kích cỡ hoặc màu sắc')}</p>
                     <p className="text-sm text-gray-500">{v('This product has multiple options', 'Sản phẩm này có nhiều tùy chọn')}</p>
                   </div>
                 </div>
                 <Button variant="outline" size="sm" onClick={() => setHasVariants(!hasVariants)}>
                   {hasVariants ? v('Cancel', 'Hủy') : v('Add Options', 'Thêm tùy chọn')}
                 </Button>
               </div>

               {hasVariants && (
                 <div className="space-y-6 pt-4">
                   {/* Simplified Variant UI */}
                   {options.map((option, idx) => (
                     <div key={idx} className="space-y-3 pb-4 border-b border-gray-100 last:border-0">
                       <Label>{v('Option Name', 'Tên tùy chọn')}</Label>
                       <Input value={option.name} readOnly className="bg-gray-50" />
                       <Label>{v('Option Values', 'Giá trị tùy chọn')}</Label>
                       <Input placeholder={v('Separate values with comma (e.g. Small, Medium, Large)', 'Ngăn cách các giá trị bằng dấu phẩy (VD: Nhỏ, Vừa, Lớn)')} />
                     </div>
                   ))}
                   <Button variant="ghost" className="text-sm text-gray-600" onClick={() => alert(v('Adding custom option...', 'Đang thêm tùy chọn tùy chỉnh...'))}>
                     <Plus className="h-4 w-4 mr-2" /> {v('Add another option', 'Thêm tùy chọn khác')}
                   </Button>
                 </div>
               )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Organization */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{v('Status', 'Trạng thái')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder={v('Select status', 'Chọn trạng thái')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{v('Active', 'Đang bán')}</SelectItem>
                      <SelectItem value="draft">{v('Draft', 'Bản nháp')}</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-xs text-gray-500 mt-2">
                {v('Active products are available to customers.', 'Sản phẩm đang bán sẽ hiển thị với khách hàng.')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{v('Organization', 'Phân loại')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">{v('Category', 'Danh mục')}</Label>
                 <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder={v('Select category', 'Chọn danh mục')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tops">{v('Tops', 'Áo')}</SelectItem>
                        <SelectItem value="bottoms">{v('Bottoms', 'Quần')}</SelectItem>
                        <SelectItem value="dresses">{v('Dresses', 'Váy đầm')}</SelectItem>
                        <SelectItem value="outerwear">{v('Outerwear', 'Áo khoác')}</SelectItem>
                        <SelectItem value="accessories">{v('Accessories', 'Phụ kiện')}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productType">{v('Product Type', 'Loại sản phẩm')}</Label>
                <Input
                  id="productType"
                  placeholder={v('e.g. T-Shirt', 'VD: Áo thun')}
                  {...register('productType')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">{v('Tags', 'Thẻ')}</Label>
                <Input
                  id="tags"
                  placeholder={v('e.g. Summer, Cotton, Vintage', 'VD: Mùa hè, Cotton, Vintage')}
                  {...register('tags')}
                />
                <p className="text-xs text-gray-500">{v('Comma separated', 'Ngăn cách bằng dấu phẩy')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}

// Helper component for checkbox
function Checkbox({ id, ...props }: any) {
  return (
    <input 
      type="checkbox" 
      id={id} 
      className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black" 
      {...props} 
    />
  )
}