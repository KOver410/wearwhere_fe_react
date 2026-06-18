import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { format } from "date-fns";
import { cn } from "@/app/components/ui/utils";
import { toast } from "sonner";
import { useLanguage } from '@/app/i18n/LanguageContext';

// Mock Data
const MOCK_RETURN = {
  id: 'RET-8821-401',
  orderId: 'ORD-7782-9012',
  date: '2025-06-14T15:30:00',
  status: 'pending',
  reason: 'Size too small',
  comment: 'I usually wear a medium but this fits like a small.',
  customer: {
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 123-4567',
  },
  items: [
    {
      id: 1,
      name: 'Essential Cotton T-Shirt',
      variant: 'Black / M',
      sku: 'TSH-BLK-M',
      price: 45.00,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=100&h=100&q=80'
    }
  ],
  images: [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&h=300&q=80',
    'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=300&h=300&q=80'
  ]
};

export default function BrandReturnDetailPage() {
  const { v } = useLanguage();
  const { id } = useParams();
  const [status, setStatus] = useState(MOCK_RETURN.status);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const handleApprove = () => {
    setStatus('approved');
    toast.success(v("Return request approved", "Đã duyệt yêu cầu trả hàng"));
  };

  const handleReject = () => {
    setStatus('rejected');
    setIsRejectOpen(false);
    toast.error(v("Return request rejected", "Đã từ chối yêu cầu trả hàng"));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return v('Pending', 'Chờ xử lý');
      case 'approved': return v('Approved', 'Đã duyệt');
      case 'rejected': return v('Rejected', 'Đã từ chối');
      case 'refunded': return v('Refunded', 'Đã hoàn tiền');
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/brand/returns">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{id || MOCK_RETURN.id}</h1>
              <Badge variant="secondary" className={cn("font-medium border", getStatusColor(status))}>
                {getStatusLabel(status)}
              </Badge>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              {v('Requested on', 'Yêu cầu vào')} {format(new Date(MOCK_RETURN.date), "MMMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
        </div>
        
        {status === 'pending' && (
          <div className="flex gap-2">
            <Button onClick={() => setIsRejectOpen(true)} variant="outline" className="text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700">
              <XCircle className="h-4 w-4 mr-2" />
              {v('Reject Request', 'Từ chối yêu cầu')}
            </Button>
            <Button onClick={handleApprove} className="bg-[#F54900] text-white hover:bg-[#E04400]">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {v('Approve Return', 'Duyệt trả hàng')}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
           {/* Reason & Comment */}
           <Card>
            <CardHeader>
              <CardTitle>{v('Reason for Return', 'Lý do trả hàng')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div>
                  <h4 className="text-sm font-medium text-gray-500">{v('Reason', 'Lý do')}</h4>
                  <p className="text-gray-900 mt-1">{MOCK_RETURN.reason}</p>
               </div>
               <div>
                  <h4 className="text-sm font-medium text-gray-500">{v('Customer Comment', 'Bình luận của khách hàng')}</h4>
                  <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm text-gray-700 flex gap-3">
                     <MessageSquare className="h-4 w-4 shrink-0 mt-0.5 text-gray-400"/>
                     <p>"{MOCK_RETURN.comment}"</p>
                  </div>
               </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>{v('Items to Return', 'Sản phẩm cần trả')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_RETURN.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-md border border-gray-100 overflow-hidden">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.variant}</p>
                        <p className="text-xs text-gray-400 font-mono mt-1">SKU: {item.sku}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Evidence Images */}
          <Card>
            <CardHeader>
              <CardTitle>{v('Evidence Images', 'Hình ảnh minh chứng')}</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {MOCK_RETURN.images.map((img, i) => (
                     <div key={i} className="aspect-square rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                        <img src={img} alt={`${v('Evidence', 'Minh chứng')} ${i+1}`} className="w-full h-full object-cover"/>
                     </div>
                  ))}
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{v('Customer Details', 'Thông tin khách hàng')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div>
                  <p className="font-medium text-gray-900">{MOCK_RETURN.customer.name}</p>
                  <p className="text-sm text-gray-500">{MOCK_RETURN.customer.email}</p>
                  <p className="text-sm text-gray-500">{MOCK_RETURN.customer.phone}</p>
               </div>
               <Separator />
               <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">{v('Original Order', 'Đơn hàng gốc')}</p>
                  <Link to={`/brand/orders/${MOCK_RETURN.orderId}`} className="text-sm font-medium text-black underline">
                     {MOCK_RETURN.orderId}
                  </Link>
               </div>
            </CardContent>
          </Card>

           {/* Policy Check */}
           <Card className="bg-[#F54900]/5 border-[#F54900]/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-[#F54900] text-sm flex items-center gap-2">
                 <AlertTriangle className="h-4 w-4"/>
                 {v('Policy Check', 'Kiểm tra chính sách')}
              </CardTitle>
            </CardHeader>
            <CardContent>
               <ul className="text-xs text-[#0F172A]/70 space-y-2 list-disc pl-4">
                  <li>{v('Return requested within 30 days window (2 days remaining).', 'Yêu cầu trả hàng trong thời hạn 30 ngày (còn 2 ngày).')}</li>
                  <li>{v('Item category allows returns.', 'Danh mục sản phẩm cho phép trả hàng.')}</li>
                  <li>{v('Customer has good return history.', 'Khách hàng có lịch sử trả hàng tốt.')}</li>
               </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reject Modal */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{v('Reject Return Request', 'Từ chối yêu cầu trả hàng')}</DialogTitle>
            <DialogDescription>
              {v('Please provide a reason for rejecting this return. This will be sent to the customer.', 'Vui lòng cung cấp lý do từ chối trả hàng. Lý do này sẽ được gửi đến khách hàng.')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
             <div className="space-y-2">
                <Label htmlFor="reject-reason">{v('Reason', 'Lý do')}</Label>
                <Textarea id="reject-reason" placeholder={v('e.g. Item returned damaged, Outside policy window...', 'ví dụ: Sản phẩm trả về bị hư hỏng, Ngoài thời hạn chính sách...')} />
             </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectOpen(false)}>{v('Cancel', 'Hủy')}</Button>
            <Button onClick={handleReject} variant="destructive">{v('Reject Request', 'Từ chối yêu cầu')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}