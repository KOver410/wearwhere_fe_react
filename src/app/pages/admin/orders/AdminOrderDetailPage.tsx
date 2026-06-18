import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import {
  ArrowLeft,
  Package,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Edit3,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/app/i18n/LanguageContext';

const mockOrderDetail = {
  id: 'ORD-2024-001',
  date: '2024-02-10',
  status: 'delivered',
  payment: 'paid',
  customer: {
    name: 'Nguyen Van A',
    email: 'nguyenvana@gmail.com',
    phone: '0901234567',
    address: '123 Nguyen Trai, District 1, Ho Chi Minh City',
  },
  brand: {
    name: 'Zara',
    email: 'zara@gmail.com',
    phone: '0287654321',
  },
  items: [
    { id: 1, name: 'Classic Blazer', sku: 'ZR-BLZ-001', price: 650000, quantity: 1, image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=200' },
    { id: 2, name: 'Slim Fit Jeans', sku: 'ZR-JNS-045', price: 450000, quantity: 1, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200' },
    { id: 3, name: 'Cotton T-Shirt', sku: 'ZR-TSH-089', price: 150000, quantity: 1, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200' },
  ],
  shipping: {
    method: 'Standard Delivery',
    cost: 30000,
    tracking: 'VN-TRACK-123456789',
    carrier: 'Giao Hang Nhanh',
  },
  subtotal: 1250000,
  shippingCost: 30000,
  discount: 0,
  total: 1280000,
  timeline: [
    { date: '2024-02-10 10:30', status: 'Order placed', description: 'Order has been placed' },
    { date: '2024-02-10 14:15', status: 'Payment confirmed', description: 'Payment received successfully' },
    { date: '2024-02-11 09:00', status: 'Processing', description: 'Brand is preparing your order' },
    { date: '2024-02-11 16:45', status: 'Shipped', description: 'Order has been shipped' },
    { date: '2024-02-13 11:20', status: 'Delivered', description: 'Order delivered successfully' },
  ],
};

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-[#F54900]/10 text-[#F54900]' },
  processing: { label: 'Processing', color: 'bg-[#F59E0B]/10 text-[#F59E0B]' },
  shipped: { label: 'Shipped', color: 'bg-[#3B82F6]/10 text-[#3B82F6]' },
  delivered: { label: 'Delivered', color: 'bg-[#10B981]/10 text-[#10B981]' },
  cancelled: { label: 'Cancelled', color: 'bg-[#6A7282]/10 text-[#6A7282]' },
  disputed: { label: 'Disputed', color: 'bg-[#E7000B]/10 text-[#E7000B]' },
};

export default function AdminOrderDetailPage() {
  const { v } = useLanguage();
  const statusLabels: Record<string, string> = {
    pending: v('Pending', 'Đang chờ'),
    processing: v('Processing', 'Đang xử lý'),
    shipped: v('Shipped', 'Đang giao hàng'),
    delivered: v('Delivered', 'Đã giao'),
    cancelled: v('Cancelled', 'Đã hủy'),
    disputed: v('Disputed', 'Đang tranh chấp'),
  };
  const { id } = useParams();
  const [order, setOrder] = useState(mockOrderDetail);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(order.status);
  const [refundReason, setRefundReason] = useState('');
  const [refundAmount, setRefundAmount] = useState(order.total.toString());

  const handleUpdateStatus = () => {
    setOrder({ ...order, status: newStatus });
    setStatusModalOpen(false);
    toast.success(v('Order status updated', 'Đã cập nhật trạng thái đơn hàng'));
  };

  const handleRefund = () => {
    setOrder({ ...order, payment: 'refunded', status: 'cancelled' });
    setRefundModalOpen(false);
    toast.success(v('Refund processed successfully', 'Đã xử lý hoàn tiền thành công'));
  };

  return (
    <div className="flex flex-col" style={{ gap: '32px', maxWidth: '1501px', margin: '0 auto' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center" style={{ gap: '16px' }}>
          <Link to="/admin/orders">
            <Button
              variant="outline"
              size="sm"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                padding: '0',
              }}
            >
              <ArrowLeft style={{ width: '20px', height: '20px' }} />
            </Button>
          </Link>
          <div>
            <h1
              className="text-[#0A0A0A]"
              style={{
                fontSize: '36px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '8px',
              }}
            >
              {v('Order', 'Đơn hàng')} {order.id}
            </h1>
            <p
              className="text-[#4A5565]"
              style={{ fontSize: '16px', fontFamily: 'Arimo, sans-serif' }}
            >
              {v('Placed on', 'Đặt ngày')} {new Date(order.date).toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>
        <div className="flex items-center" style={{ gap: '12px' }}>
          <Button
            onClick={() => setStatusModalOpen(true)}
            variant="outline"
            className="border-[#D1D5DC]"
            style={{
              height: '48px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              fontFamily: 'Arimo, sans-serif',
              padding: '0 24px',
            }}
          >
            <Edit3 style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            {v('Override Status', 'Ghi đè trạng thái')}
          </Button>
          <Button
            onClick={() => setRefundModalOpen(true)}
            variant="outline"
            className="border-[#E7000B] text-[#E7000B]"
            style={{
              height: '48px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              fontFamily: 'Arimo, sans-serif',
              padding: '0 24px',
            }}
          >
            <RotateCcw style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            {v('Process Refund', 'Xử lý hoàn tiền')}
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-3" style={{ gap: '24px' }}>
        <Card
          className="bg-white"
          style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <div
              className="flex items-center justify-center bg-[#F3F4F6]"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <Package className="text-[#0A0A0A]" style={{ width: '24px', height: '24px' }} />
            </div>
          </div>
          <div>
            <p
              className="text-[#6A7282]"
              style={{
                fontSize: '14px',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '8px',
              }}
            >
              {v('Order Status', 'Trạng thái đơn hàng')}
            </p>
            <Badge
              className={statusConfig[order.status as keyof typeof statusConfig].color}
              style={{
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                padding: '8px 16px',
              }}
            >
              {statusLabels[order.status]}
            </Badge>
          </div>
        </Card>

        <Card
          className="bg-white"
          style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <div
              className="flex items-center justify-center bg-[#10B981]/10"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <DollarSign className="text-[#10B981]" style={{ width: '24px', height: '24px' }} />
            </div>
          </div>
          <div>
            <p
              className="text-[#6A7282]"
              style={{
                fontSize: '14px',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '8px',
              }}
            >
              {v('Payment Status', 'Trạng thái thanh toán')}
            </p>
            <Badge
              className={
                order.payment === 'paid'
                  ? 'bg-[#10B981]/10 text-[#10B981]'
                  : 'bg-[#6A7282]/10 text-[#6A7282]'
              }
              style={{
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                padding: '8px 16px',
              }}
            >
              {order.payment === 'paid' ? v('Paid', 'Đã thanh toán') : v('Refunded', 'Đã hoàn tiền')}
            </Badge>
          </div>
        </Card>

        <Card
          className="bg-white"
          style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <div
              className="flex items-center justify-center bg-[#F54900]/10"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <DollarSign className="text-[#F54900]" style={{ width: '24px', height: '24px' }} />
            </div>
          </div>
          <div>
            <p
              className="text-[#6A7282]"
              style={{
                fontSize: '14px',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '4px',
              }}
            >
              {v('Total Amount', 'Tổng số tiền')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '24px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {order.total.toLocaleString('vi-VN')}đ
            </h3>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-3" style={{ gap: '24px' }}>
        {/* Left Column */}
        <div className="col-span-2 flex flex-col" style={{ gap: '24px' }}>
          {/* Order Items */}
          <Card
            className="bg-white"
            style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
          >
            <h3
              className="text-[#0A0A0A]"
              style={{
                fontSize: '18px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '20px',
              }}
            >
              {v('Order Items', 'Sản phẩm trong đơn')}
            </h3>
            <div className="flex flex-col" style={{ gap: '16px' }}>
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-[#E5E7EB] pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center" style={{ gap: '16px' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '10px',
                        objectFit: 'cover',
                      }}
                    />
                    <div>
                      <p
                        className="text-[#0A0A0A]"
                        style={{
                          fontSize: '14px',
                          fontWeight: '700',
                          fontFamily: 'Arimo, sans-serif',
                          marginBottom: '4px',
                        }}
                      >
                        {item.name}
                      </p>
                      <p
                        className="text-[#6A7282]"
                        style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                      >
                        {v('SKU', 'Mã SKU')}: {item.sku}
                      </p>
                      <p
                        className="text-[#6A7282]"
                        style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                      >
                        {v('Quantity', 'Số lượng')}: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    {item.price.toLocaleString('vi-VN')}đ
                  </p>
                </div>
              ))}
            </div>

            <div
              className="border-t border-[#E5E7EB] flex flex-col"
              style={{ marginTop: '20px', paddingTop: '20px', gap: '12px' }}
            >
              <div className="flex justify-between">
                <p
                  className="text-[#6A7282]"
                  style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                >
                  {v('Subtotal', 'Tạm tính')}
                </p>
                <p
                  className="text-[#0A0A0A]"
                  style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                >
                  {order.subtotal.toLocaleString('vi-VN')}đ
                </p>
              </div>
              <div className="flex justify-between">
                <p
                  className="text-[#6A7282]"
                  style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                >
                  {v('Shipping', 'Phí vận chuyển')}
                </p>
                <p
                  className="text-[#0A0A0A]"
                  style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                >
                  {order.shippingCost.toLocaleString('vi-VN')}đ
                </p>
              </div>
              <div className="flex justify-between border-t border-[#E5E7EB] pt-3">
                <p
                  className="text-[#0A0A0A]"
                  style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {v('Total', 'Tổng cộng')}
                </p>
                <p
                  className="text-[#0A0A0A]"
                  style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {order.total.toLocaleString('vi-VN')}đ
                </p>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card
            className="bg-white"
            style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
          >
            <h3
              className="text-[#0A0A0A]"
              style={{
                fontSize: '18px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '20px',
              }}
            >
              {v('Order Timeline', 'Tiến trình đơn hàng')}
            </h3>
            <div className="flex flex-col" style={{ gap: '16px' }}>
              {order.timeline.map((event, idx) => (
                <div key={idx} className="flex" style={{ gap: '16px' }}>
                  <div className="flex flex-col items-center" style={{ gap: '4px' }}>
                    <div
                      className="flex items-center justify-center bg-[#10B981] rounded-full"
                      style={{ width: '32px', height: '32px', flexShrink: 0 }}
                    >
                      <CheckCircle className="text-white" style={{ width: '16px', height: '16px' }} />
                    </div>
                    {idx < order.timeline.length - 1 && (
                      <div className="w-px h-full bg-[#E5E7EB]" style={{ minHeight: '40px' }} />
                    )}
                  </div>
                  <div style={{ paddingBottom: idx < order.timeline.length - 1 ? '16px' : '0' }}>
                    <p
                      className="text-[#0A0A0A]"
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                        marginBottom: '4px',
                      }}
                    >
                      {event.status}
                    </p>
                    <p
                      className="text-[#6A7282]"
                      style={{
                        fontSize: '12px',
                        fontFamily: 'Arimo, sans-serif',
                        marginBottom: '4px',
                      }}
                    >
                      {event.description}
                    </p>
                    <p
                      className="text-[#6A7282]"
                      style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {event.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="flex flex-col" style={{ gap: '24px' }}>
          {/* Customer Info */}
          <Card
            className="bg-white"
            style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
          >
            <h3
              className="text-[#0A0A0A]"
              style={{
                fontSize: '18px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '16px',
              }}
            >
              {v('Customer', 'Khách hàng')}
            </h3>
            <div className="flex flex-col" style={{ gap: '12px' }}>
              <div>
                <p
                  className="text-[#6A7282]"
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '4px',
                  }}
                >
                  {v('Name', 'Tên')}
                </p>
                <p
                  className="text-[#0A0A0A]"
                  style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                >
                  {order.customer.name}
                </p>
              </div>
              <div>
                <p
                  className="text-[#6A7282]"
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '4px',
                  }}
                >
                  {v('Email', 'Email')}
                </p>
                <p
                  className="text-[#0A0A0A]"
                  style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                >
                  {order.customer.email}
                </p>
              </div>
              <div>
                <p
                  className="text-[#6A7282]"
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '4px',
                  }}
                >
                  {v('Phone', 'Số điện thoại')}
                </p>
                <p
                  className="text-[#0A0A0A]"
                  style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                >
                  {order.customer.phone}
                </p>
              </div>
              <div>
                <p
                  className="text-[#6A7282]"
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '4px',
                  }}
                >
                  {v('Address', 'Địa chỉ')}
                </p>
                <p
                  className="text-[#0A0A0A]"
                  style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                >
                  {order.customer.address}
                </p>
              </div>
            </div>
          </Card>

          {/* Brand Info */}
          <Card
            className="bg-white"
            style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
          >
            <h3
              className="text-[#0A0A0A]"
              style={{
                fontSize: '18px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '16px',
              }}
            >
              {v('Brand', 'Thương hiệu')}
            </h3>
            <div className="flex flex-col" style={{ gap: '12px' }}>
              <div>
                <p
                  className="text-[#6A7282]"
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '4px',
                  }}
                >
                  {v('Name', 'Tên')}
                </p>
                <p
                  className="text-[#0A0A0A]"
                  style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                >
                  {order.brand.name}
                </p>
              </div>
              <div>
                <p
                  className="text-[#6A7282]"
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '4px',
                  }}
                >
                  {v('Email', 'Email')}
                </p>
                <p
                  className="text-[#0A0A0A]"
                  style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                >
                  {order.brand.email}
                </p>
              </div>
              <div>
                <p
                  className="text-[#6A7282]"
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '4px',
                  }}
                >
                  {v('Phone', 'Số điện thoại')}
                </p>
                <p
                  className="text-[#0A0A0A]"
                  style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                >
                  {order.brand.phone}
                </p>
              </div>
            </div>
          </Card>

          {/* Shipping Info */}
          <Card
            className="bg-white"
            style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
          >
            <h3
              className="text-[#0A0A0A]"
              style={{
                fontSize: '18px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '16px',
              }}
            >
              {v('Shipping', 'Vận chuyển')}
            </h3>
            <div className="flex flex-col" style={{ gap: '12px' }}>
              <div>
                <p
                  className="text-[#6A7282]"
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '4px',
                  }}
                >
                  {v('Method', 'Phương thức')}
                </p>
                <p
                  className="text-[#0A0A0A]"
                  style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                >
                  {order.shipping.method}
                </p>
              </div>
              <div>
                <p
                  className="text-[#6A7282]"
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '4px',
                  }}
                >
                  {v('Carrier', 'Đơn vị vận chuyển')}
                </p>
                <p
                  className="text-[#0A0A0A]"
                  style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                >
                  {order.shipping.carrier}
                </p>
              </div>
              <div>
                <p
                  className="text-[#6A7282]"
                  style={{
                    fontSize: '12px',
                    fontFamily: 'Arimo, sans-serif',
                    marginBottom: '4px',
                  }}
                >
                  {v('Tracking Number', 'Mã vận đơn')}
                </p>
                <p
                  className="text-[#0A0A0A]"
                  style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                >
                  {order.shipping.tracking}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Override Status Modal */}
      <Dialog open={statusModalOpen} onOpenChange={setStatusModalOpen}>
        <DialogContent style={{ maxWidth: '500px', borderRadius: '14px', padding: '32px' }}>
          <DialogHeader>
            <DialogTitle
              style={{
                fontSize: '24px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '8px',
              }}
            >
              {v('Override Order Status', 'Ghi đè trạng thái đơn hàng')}
            </DialogTitle>
            <DialogDescription style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}>
              {v('Manually change the order status', 'Thay đổi trạng thái đơn hàng thủ công')}
            </DialogDescription>
          </DialogHeader>
          <div style={{ marginTop: '24px' }}>
            <Label
              style={{
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '8px',
                display: 'block',
              }}
            >
              {v('New Status', 'Trạng thái mới')} *
            </Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger
                className="border-[#D1D5DC]"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">{v('Pending', 'Đang chờ')}</SelectItem>
                <SelectItem value="processing">{v('Processing', 'Đang xử lý')}</SelectItem>
                <SelectItem value="shipped">{v('Shipped', 'Đang giao hàng')}</SelectItem>
                <SelectItem value="delivered">{v('Delivered', 'Đã giao')}</SelectItem>
                <SelectItem value="cancelled">{v('Cancelled', 'Đã hủy')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter style={{ marginTop: '24px' }}>
            <Button
              variant="outline"
              onClick={() => setStatusModalOpen(false)}
              style={{
                height: '48px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                padding: '0 24px',
              }}
            >
              {v('Cancel', 'Hủy')}
            </Button>
            <Button
              onClick={handleUpdateStatus}
              className="bg-[#0A0A0A] text-white hover:bg-[#0A0A0A]/90"
              style={{
                height: '48px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                padding: '0 24px',
              }}
            >
              {v('Update Status', 'Cập nhật trạng thái')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Modal */}
      <Dialog open={refundModalOpen} onOpenChange={setRefundModalOpen}>
        <DialogContent style={{ maxWidth: '500px', borderRadius: '14px', padding: '32px' }}>
          <DialogHeader>
            <DialogTitle
              style={{
                fontSize: '24px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                marginBottom: '8px',
              }}
            >
              {v('Process Refund', 'Xử lý hoàn tiền')}
            </DialogTitle>
            <DialogDescription style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}>
              {v('Issue a refund for this order', 'Hoàn tiền cho đơn hàng này')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col" style={{ gap: '20px', marginTop: '24px' }}>
            <div>
              <Label
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                {v('Refund Amount', 'Số tiền hoàn')} *
              </Label>
              <Input
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                className="border-[#D1D5DC]"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              />
            </div>
            <div>
              <Label
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  fontFamily: 'Arimo, sans-serif',
                  marginBottom: '8px',
                  display: 'block',
                }}
              >
                {v('Reason', 'Lý do')} *
              </Label>
              <Textarea
                placeholder={v('Enter refund reason...', 'Nhập lý do hoàn tiền...')}
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="border-[#D1D5DC]"
                style={{
                  minHeight: '120px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              />
            </div>
          </div>
          <DialogFooter style={{ marginTop: '24px' }}>
            <Button
              variant="outline"
              onClick={() => setRefundModalOpen(false)}
              style={{
                height: '48px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                padding: '0 24px',
              }}
            >
              {v('Cancel', 'Hủy')}
            </Button>
            <Button
              onClick={handleRefund}
              className="bg-[#E7000B] text-white hover:bg-[#E7000B]/90"
              style={{
                height: '48px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                padding: '0 24px',
              }}
            >
              <RotateCcw style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              {v('Process Refund', 'Xử lý hoàn tiền')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
