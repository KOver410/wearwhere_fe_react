import React, { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { Link, useNavigate } from 'react-router';
import { 
  ArrowLeft, Upload, X, Plus, Trash2, 
  HelpCircle, AlertCircle, Save 
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Textarea } from '@/shared/ui/textarea';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Switch } from '@/shared/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { toast } from 'sonner';
import { cn } from '@/shared/ui/utils';

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
      toast.success('Product created successfully');
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
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Add New Product</h1>
          <p className="text-sm text-[#64748B]">Create a new product for your store.</p>
        </div>
        <div className="ml-auto flex gap-3">
          <Link to="/brand/products">
            <Button variant="outline">Discard</Button>
          </Link>
          <Button type="submit" className="bg-[#F54900] text-white hover:bg-[#E04400]" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Product'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Title</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Oversized Cotton T-Shirt" 
                  {...register('name', { required: 'Product name is required' })}
                  className={errors.name ? 'border-red-300' : ''}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe your product..." 
                  className="min-h-[120px]"
                  {...register('description')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
              <CardDescription>Upload images or videos of your product.</CardDescription>
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
                  <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
                </div>
              </div>

              {/* Image Previews */}
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                      <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
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
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
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
                  <Label htmlFor="compareAtPrice">Compare-at Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
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
                  Charge tax on this product
                </label>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="costPerItem">Cost per item</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input 
                        id="costPerItem" 
                        type="number" 
                        step="0.01"
                        className="pl-7"
                        {...register('costPerItem')}
                      />
                    </div>
                    <p className="text-xs text-gray-500">Customers won't see this</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Profit</Label>
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
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                  <Input 
                    id="sku" 
                    {...register('sku')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barcode">Barcode (ISBN, UPC, GTIN, etc.)</Label>
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
                <Label htmlFor="trackQuantity">Track quantity</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
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
              <CardTitle>Variants</CardTitle>
              <CardDescription>Add variations like size or color.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                 <div className="flex items-center gap-3">
                   <Plus className="h-5 w-5 text-gray-500" />
                   <div>
                     <p className="font-medium text-gray-900">Add options like size or color</p>
                     <p className="text-sm text-gray-500">This product has multiple options</p>
                   </div>
                 </div>
                 <Button variant="outline" size="sm" onClick={() => setHasVariants(!hasVariants)}>
                   {hasVariants ? 'Cancel' : 'Add Options'}
                 </Button>
               </div>

               {hasVariants && (
                 <div className="space-y-6 pt-4">
                   {/* Simplified Variant UI */}
                   {options.map((option, idx) => (
                     <div key={idx} className="space-y-3 pb-4 border-b border-gray-100 last:border-0">
                       <Label>Option Name</Label>
                       <Input value={option.name} readOnly className="bg-gray-50" />
                       <Label>Option Values</Label>
                       <Input placeholder="Separate values with comma (e.g. Small, Medium, Large)" />
                     </div>
                   ))}
                   <Button variant="ghost" className="text-sm text-gray-600" onClick={() => alert('Adding custom option...')}>
                     <Plus className="h-4 w-4 mr-2" /> Add another option
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
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-xs text-gray-500 mt-2">
                Active products are available to customers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                 <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tops">Tops</SelectItem>
                        <SelectItem value="bottoms">Bottoms</SelectItem>
                        <SelectItem value="dresses">Dresses</SelectItem>
                        <SelectItem value="outerwear">Outerwear</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="productType">Product Type</Label>
                <Input 
                  id="productType" 
                  placeholder="e.g. T-Shirt"
                  {...register('productType')} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input 
                  id="tags" 
                  placeholder="e.g. Summer, Cotton, Vintage"
                  {...register('tags')} 
                />
                <p className="text-xs text-gray-500">Comma separated</p>
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