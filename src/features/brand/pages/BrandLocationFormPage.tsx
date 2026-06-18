import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { Switch } from '@/shared/ui/switch';
import { Checkbox } from '@/shared/ui/checkbox';
import { Separator } from '@/shared/ui/separator'; // I need to create this later if not exist, but I'll use simple HR for now if it breaks, but assuming I can create it or use HR. I'll stick to div border.
import { ArrowLeft, MapPin, Upload, Plus, Trash2 } from 'lucide-react';
import { ImageWithFallback } from '@/shared/components/figma/ImageWithFallback';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function BrandLocationFormPage() {
  const navigate = useNavigate();
  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      name: '',
      address: '',
      city: '',
      phone: '',
      latitude: '10.7769',
      longitude: '106.7009',
      parking: true,
      wifi: true,
      wheelchair: false,
      schedule: DAYS.map(day => ({
        day,
        isOpen: true,
        openTime: '09:00',
        closeTime: '22:00'
      })),
      paymentMethods: {
        cash: true,
        visa: true,
        mastercard: true,
        momo: false,
        vnpay: false
      }
    }
  });

  const onSubmit = (data: any) => {
    console.log('Location data:', data);
    navigate('/brand/locations');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <Button variant="ghost" className="pl-0 hover:bg-transparent" onClick={() => navigate('/brand/locations')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Locations
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#0F172A]">Add New Location</h2>
          <p className="text-[#64748B]">Add details about your new store branch.</p>
        </div>
        <Button onClick={handleSubmit(onSubmit)} className="bg-[#F54900] text-white hover:bg-[#E04400]">
          Save Location
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>General details and contact information.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Location Name</Label>
              <Input id="name" placeholder="e.g. WearWhere Flagship Store" {...register('name')} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="e.g. 123 Fashion St" {...register('address')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City/Province</Label>
              <Input id="city" placeholder="e.g. Ho Chi Minh City" {...register('city')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="+84 ..." {...register('phone')} />
            </div>
          </CardContent>
        </Card>

        {/* Map / Coordinates */}
        <Card>
          <CardHeader>
            <CardTitle>Location Coordinates</CardTitle>
            <CardDescription>Pin your store on the map for customers to find.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {/* Fake Map Picker */}
             <div className="w-full h-[300px] bg-gray-100 rounded-lg border border-gray-200 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/OpenStreetMap_Standard_map.png')] bg-cover opacity-50 grayscale"></div>
                <div className="z-10 flex flex-col items-center">
                  <MapPin className="h-10 w-10 text-[#F54900] mb-2 drop-shadow-md" fill="currentColor" />
                  <span className="bg-white px-3 py-1 rounded-full text-xs font-bold shadow-sm border">
                    Drag to adjust
                  </span>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label>Latitude</Label>
                 <Input {...register('latitude')} />
               </div>
               <div className="space-y-2">
                 <Label>Longitude</Label>
                 <Input {...register('longitude')} />
               </div>
             </div>
          </CardContent>
        </Card>

        {/* Operating Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Operating Hours</CardTitle>
            <CardDescription>Set the opening and closing time for each day.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {DAYS.map((day, index) => (
              <div key={day} className="flex items-center gap-4 py-2 border-b last:border-0 border-gray-100">
                <div className="w-32 font-medium">{day}</div>
                <Controller
                  name={`schedule.${index}.isOpen`}
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <span className="text-sm text-gray-500 w-16">
                  {watch(`schedule.${index}.isOpen`) ? 'Open' : 'Closed'}
                </span>
                
                {watch(`schedule.${index}.isOpen`) && (
                  <div className="flex items-center gap-2 ml-auto">
                    <Input 
                      type="time" 
                      className="w-32" 
                      {...register(`schedule.${index}.openTime`)} 
                    />
                    <span className="text-gray-400">-</span>
                    <Input 
                      type="time" 
                      className="w-32" 
                      {...register(`schedule.${index}.closeTime`)} 
                    />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Amenities & Payment */}
        <Card>
          <CardHeader>
            <CardTitle>Amenities & Payment</CardTitle>
            <CardDescription>What features and payment methods are available?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="text-base">Store Amenities</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                 <div className="flex items-center space-x-2">
                    <Controller
                      name="parking"
                      control={control}
                      render={({ field }) => (
                        <Checkbox id="parking" checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                    <label htmlFor="parking" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Free Parking
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Controller
                      name="wifi"
                      control={control}
                      render={({ field }) => (
                        <Checkbox id="wifi" checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                    <label htmlFor="wifi" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Free Wi-Fi
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Controller
                      name="wheelchair"
                      control={control}
                      render={({ field }) => (
                        <Checkbox id="wheelchair" checked={field.value} onCheckedChange={field.onChange} />
                      )}
                    />
                    <label htmlFor="wheelchair" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Wheelchair Access
                    </label>
                  </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base">Payment Methods</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {['Cash', 'Visa', 'Mastercard', 'MoMo', 'VNPay'].map((method) => (
                    <div key={method} className="flex items-center space-x-2">
                      <Controller
                        name={`paymentMethods.${method.toLowerCase()}`}
                        control={control}
                        render={({ field }) => (
                          <Checkbox id={method} checked={field.value} onCheckedChange={field.onChange} />
                        )}
                      />
                      <label htmlFor={method} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {method}
                      </label>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photos */}
        <Card>
          <CardHeader>
            <CardTitle>Store Photos</CardTitle>
            <CardDescription>Upload photos of your store (Exterior, Interior).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 flex flex-col items-center justify-center text-center hover:bg-[#F54900]/5 hover:border-[#F54900]/30 transition-colors cursor-pointer">
              <div className="h-12 w-12 rounded-full bg-[#F54900]/10 flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-[#F54900]" />
              </div>
              <h4 className="text-sm font-semibold">Click to upload or drag and drop</h4>
              <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[1, 2, 3].map((i) => (
                 <div key={i} className="aspect-video bg-gray-100 rounded-lg relative group overflow-hidden">
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => alert('Image removed!')}>
                         <Trash2 className="h-4 w-4" />
                       </Button>
                    </div>
                 </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}