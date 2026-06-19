import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { 
  ArrowLeft, 
  Printer, 
  Truck, 
  Package, 
  CreditCard, 
  MapPin, 
  Mail, 
  Phone, 
  User, 
  Calendar,
  CheckCircle2,
  XCircle,
  MoreVertical,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { format } from "date-fns";
import { cn } from "@/app/components/ui/utils";
import { toast } from "sonner";
import { useLanguage } from '@/app/i18n/LanguageContext';
import { formatVnd } from '@/app/utils/currency';

// Mock Data
const MOCK_ORDER = {
  id: 'ORD-7782-9012',
  date: '2025-06-12T10:30:00',
  status: 'pending',
  paymentStatus: 'paid',
  paymentMethod: 'Visa ending in 4242',
  subtotal: 220.00,
  shipping: 15.00,
  tax: 10.00,
  total: 245.00,
  customer: {
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  shippingAddress: {
    street: '123 Fashion Ave, Apt 4B',
    city: 'New York',
    cityVi: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'United States',
    countryVi: 'Việt Nam'
  },
  billingAddress: {
    street: '123 Fashion Ave, Apt 4B',
    city: 'New York',
    cityVi: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'United States',
    countryVi: 'Việt Nam'
  },
  items: [
    {
      id: 1,
      name: 'Essential Cotton T-Shirt',
      nameVi: 'Áo Thun Cotton Cơ Bản',
      variant: 'Black / M',
      variantVi: 'Đen / M',
      sku: 'TSH-BLK-M',
      price: 45.00,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=100&h=100&q=80'
    },
    {
      id: 2,
      name: 'Slim Fit Denim Jeans',
      nameVi: 'Quần Jeans Denim Ôm',
      variant: 'Blue / 32',
      variantVi: 'Xanh / 32',
      sku: 'JNS-BLU-32',
      price: 130.00,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=100&h=100&q=80'
    }
  ],
  timeline: [
    {
      id: 1,
      title: 'Order Placed',
      titleVi: 'Đã đặt đơn',
      description: 'Order #ORD-7782-9012 was placed by Sarah Johnson.',
      descriptionVi: 'Đơn hàng #ORD-7782-9012 đã được đặt bởi Sarah Johnson.',
      date: '2025-06-12T10:30:00',
      icon: Package
    },
    {
      id: 2,
      title: 'Payment Confirmed',
      titleVi: 'Đã xác nhận thanh toán',
      description: 'Payment of 6.125.000₫ was confirmed via Stripe.',
      descriptionVi: 'Thanh toán 6.125.000₫ đã được xác nhận qua Stripe.',
      date: '2025-06-12T10:30:05',
      icon: CreditCard
    }
  ]
};

export default function BrandOrderDetailPage() {
  const { v, lang } = useLanguage();
  const { id } = useParams();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isShipOpen, setIsShipOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState(MOCK_ORDER.status);

  // Handlers
  const handleConfirmOrder = () => {
    setOrderStatus('confirmed');
    setIsConfirmOpen(false);
    toast.success(v("Order confirmed successfully", "Đã xác nhận đơn hàng thành công"));
  };

  const handleShipOrder = () => {
    setOrderStatus('shipped');
    setIsShipOpen(false);
    toast.success(v("Order shipped successfully", "Đã giao đơn hàng thành công"));
  };

  const handleCancelOrder = () => {
    setOrderStatus('cancelled');
    setIsCancelOpen(false);
    toast.error(v("Order cancelled", "Đã hủy đơn hàng"));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return v('Pending', 'Chờ xử lý');
      case 'confirmed': return v('Confirmed', 'Đã xác nhận');
      case 'shipped': return v('Shipped', 'Đã giao');
      case 'delivered': return v('Delivered', 'Đã nhận');
      case 'cancelled': return v('Cancelled', 'Đã hủy');
      case 'paid': return v('Paid', 'Đã thanh toán');
      case 'refunded': return v('Refunded', 'Đã hoàn tiền');
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/brand/orders">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{id || MOCK_ORDER.id}</h1>
              <Badge variant="secondary" className={cn("font-medium border", getStatusColor(orderStatus))}>
                {getStatusLabel(orderStatus)}
              </Badge>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              {v('Placed on', 'Đặt ngày')} {format(new Date(MOCK_ORDER.date), "MMMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="gap-2" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            {v('Print', 'In')}
          </Button>
          
          {orderStatus === 'pending' && (
            <Button onClick={() => setIsConfirmOpen(true)} className="gap-2 bg-[#F54900] text-white hover:bg-[#E04400]">
              <CheckCircle2 className="h-4 w-4" />
              {v('Confirm Order', 'Xác nhận đơn')}
            </Button>
          )}

          {orderStatus === 'confirmed' && (
            <Button onClick={() => setIsShipOpen(true)} className="gap-2 bg-[#F54900] text-white hover:bg-[#E04400]">
              <Truck className="h-4 w-4" />
              {v('Ship Order', 'Giao đơn')}
            </Button>
          )}

          {(orderStatus === 'pending' || orderStatus === 'confirmed') && (
            <Button onClick={() => setIsCancelOpen(true)} variant="outline" className="text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700">
              <XCircle className="h-4 w-4" />
              {v('Cancel', 'Hủy')}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>{v('Order Items', 'Sản phẩm trong đơn')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {MOCK_ORDER.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-md border border-gray-100 overflow-hidden">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{lang === 'vi' ? item.nameVi : item.name}</p>
                        <p className="text-sm text-gray-500">{lang === 'vi' ? item.variantVi : item.variant}</p>
                        <p className="text-xs text-gray-400 font-mono mt-1">{v('SKU', 'SKU')}: {item.sku}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatVnd(item.price)}</p>
                      <p className="text-sm text-gray-500">{v('Qty', 'SL')}: {item.quantity}</p>
                      <p className="font-medium text-gray-900 mt-1">{formatVnd(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>{v('Subtotal', 'Tạm tính')}</span>
                    <span>{formatVnd(MOCK_ORDER.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>{v('Shipping', 'Phí vận chuyển')}</span>
                    <span>{formatVnd(MOCK_ORDER.shipping)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>{v('Tax', 'Thuế')}</span>
                    <span>{formatVnd(MOCK_ORDER.tax)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg text-gray-900 pt-2">
                    <span>{v('Total', 'Tổng cộng')}</span>
                    <span>{formatVnd(MOCK_ORDER.total)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>{v('Timeline', 'Tiến trình đơn hàng')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-l border-gray-200 ml-3 space-y-8 pb-4">
                {MOCK_ORDER.timeline.map((event, index) => (
                  <div key={event.id} className="mb-8 relative pl-6">
                    <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#F54900] ring-4 ring-white">
                      <event.icon className="h-3 w-3 text-white" aria-hidden="true" />
                    </span>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                      <div>
                        <p className="font-medium text-gray-900">{lang === 'vi' ? event.titleVi : event.title}</p>
                        <p className="text-sm text-gray-500 mt-1">{lang === 'vi' ? event.descriptionVi : event.description}</p>
                      </div>
                      <time className="text-xs text-gray-400 mt-1 sm:mt-0 whitespace-nowrap">
                        {format(new Date(event.date), "MMM d, h:mm a")}
                      </time>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
           {/* Payment Info */}
          <Card>
             <CardHeader>
                <CardTitle>{v('Payment Details', 'Chi tiết thanh toán')}</CardTitle>
             </CardHeader>
             <CardContent>
                <div className="flex justify-between items-center p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border shadow-sm">
                            <CreditCard className="h-5 w-5 text-gray-600"/>
                        </div>
                        <div>
                            <p className="font-medium text-gray-900">{v('Payment via Card', 'Thanh toán bằng thẻ')}</p>
                            <p className="text-sm text-gray-500">{MOCK_ORDER.paymentMethod}</p>
                        </div>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {getStatusLabel(MOCK_ORDER.paymentStatus).toUpperCase()}
                    </Badge>
                </div>
             </CardContent>
          </Card>
        </div>

        {/* Sidebar (Right Column) */}
        <div className="space-y-6">
          {/* Customer */}
          <Card>
            <CardHeader>
              <CardTitle>{v('Customer', 'Khách hàng')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden">
                   <img src={MOCK_ORDER.customer.avatar} alt="" className="h-full w-full object-cover"/>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{MOCK_ORDER.customer.name}</p>
                  <p className="text-xs text-gray-500">{v('Customer since 2023', 'Khách hàng từ 2023')}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-3 text-sm">
                 <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4"/>
                    <a href={`mailto:${MOCK_ORDER.customer.email}`} className="hover:text-black hover:underline">{MOCK_ORDER.customer.email}</a>
                 </div>
                 <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4"/>
                    <span>{MOCK_ORDER.customer.phone}</span>
                 </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>{v('Shipping Address', 'Địa chỉ giao hàng')}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-1">
               <p className="font-medium text-gray-900">{MOCK_ORDER.customer.name}</p>
               <p>{MOCK_ORDER.shippingAddress.street}</p>
               <p>{lang === 'vi' ? MOCK_ORDER.shippingAddress.cityVi : MOCK_ORDER.shippingAddress.city}, {MOCK_ORDER.shippingAddress.state} {MOCK_ORDER.shippingAddress.zip}</p>
               <p>{lang === 'vi' ? MOCK_ORDER.shippingAddress.countryVi : MOCK_ORDER.shippingAddress.country}</p>
            </CardContent>
          </Card>
          
           {/* Billing Address */}
           <Card>
            <CardHeader>
              <CardTitle>{v('Billing Address', 'Địa chỉ thanh toán')}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-1">
               <p className="font-medium text-gray-900">{MOCK_ORDER.customer.name}</p>
               <p>{MOCK_ORDER.billingAddress.street}</p>
               <p>{lang === 'vi' ? MOCK_ORDER.billingAddress.cityVi : MOCK_ORDER.billingAddress.city}, {MOCK_ORDER.billingAddress.state} {MOCK_ORDER.billingAddress.zip}</p>
               <p>{lang === 'vi' ? MOCK_ORDER.billingAddress.countryVi : MOCK_ORDER.billingAddress.country}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirm Order Modal */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{v('Confirm Order', 'Xác nhận đơn hàng')}</DialogTitle>
            <DialogDescription>
              {v('Select a shipping carrier and confirm stock availability.', 'Chọn đơn vị vận chuyển và xác nhận tình trạng còn hàng.')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
             <div className="space-y-2">
                <Label htmlFor="confirm-carrier">{v('Preferred Carrier', 'Đơn vị vận chuyển ưu tiên')}</Label>
                <Select defaultValue="fedex">
                   <SelectTrigger>
                      <SelectValue placeholder={v('Select carrier', 'Chọn đơn vị vận chuyển')}/>
                   </SelectTrigger>
                   <SelectContent>
                      <SelectItem value="fedex">FedEx</SelectItem>
                      <SelectItem value="ups">UPS</SelectItem>
                      <SelectItem value="dhl">DHL</SelectItem>
                      <SelectItem value="usps">USPS</SelectItem>
                   </SelectContent>
                </Select>
             </div>
             <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-md flex gap-3 text-sm text-yellow-800">
                <AlertCircle className="h-5 w-5 shrink-0 text-yellow-600"/>
                <p>{v('Ensure all items are in stock and ready to be packed.', 'Đảm bảo tất cả sản phẩm còn hàng và sẵn sàng đóng gói.')}</p>
             </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>{v('Cancel', 'Hủy')}</Button>
            <Button onClick={handleConfirmOrder} className="bg-[#F54900] text-white hover:bg-[#E04400]">{v('Confirm Order', 'Xác nhận đơn')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ship Order Modal */}
      <Dialog open={isShipOpen} onOpenChange={setIsShipOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{v('Update Shipping', 'Cập nhật vận chuyển')}</DialogTitle>
            <DialogDescription>
              {v('Enter tracking information for this order.', 'Nhập thông tin theo dõi cho đơn hàng này.')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
             <div className="space-y-2">
                <Label htmlFor="carrier">{v('Carrier', 'Đơn vị vận chuyển')}</Label>
                <Select defaultValue="fedex">
                   <SelectTrigger>
                      <SelectValue placeholder={v('Select carrier', 'Chọn đơn vị vận chuyển')}/>
                   </SelectTrigger>
                   <SelectContent>
                      <SelectItem value="fedex">FedEx</SelectItem>
                      <SelectItem value="ups">UPS</SelectItem>
                      <SelectItem value="dhl">DHL</SelectItem>
                      <SelectItem value="usps">USPS</SelectItem>
                   </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <Label htmlFor="tracking">{v('Tracking Number', 'Mã vận đơn')}</Label>
                <Input id="tracking" placeholder={v('e.g. 123456789012', 'ví dụ: 123456789012')} />
             </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsShipOpen(false)}>{v('Cancel', 'Hủy')}</Button>
            <Button onClick={handleShipOrder} className="bg-[#F54900] text-white hover:bg-[#E04400]">{v('Mark as Shipped', 'Đánh dấu đã giao')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Order Modal */}
      <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{v('Cancel Order', 'Hủy đơn hàng')}</DialogTitle>
            <DialogDescription>
              {v('This action cannot be undone. The customer will be refunded automatically.', 'Hành động này không thể hoàn tác. Khách hàng sẽ được hoàn tiền tự động.')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
             <div className="space-y-2">
                <Label htmlFor="reason">{v('Reason for cancellation', 'Lý do hủy đơn')}</Label>
                <Select>
                   <SelectTrigger>
                      <SelectValue placeholder={v('Select reason', 'Chọn lý do')}/>
                   </SelectTrigger>
                   <SelectContent>
                      <SelectItem value="oos">{v('Out of Stock', 'Hết hàng')}</SelectItem>
                      <SelectItem value="customer">{v('Customer Request', 'Yêu cầu của khách hàng')}</SelectItem>
                      <SelectItem value="fraud">{v('Fraudulent Activity', 'Hoạt động gian lận')}</SelectItem>
                      <SelectItem value="other">{v('Other', 'Khác')}</SelectItem>
                   </SelectContent>
                </Select>
             </div>
             <div className="space-y-2">
                <Label htmlFor="note">{v('Additional Note (Optional)', 'Ghi chú thêm (Tùy chọn)')}</Label>
                <Textarea id="note" placeholder={v('Add a note for the customer...', 'Thêm ghi chú cho khách hàng...')} />
             </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelOpen(false)}>{v('Back', 'Quay lại')}</Button>
            <Button onClick={handleCancelOrder} variant="destructive">{v('Cancel Order', 'Hủy đơn hàng')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}