import { useState } from 'react';
import { Link } from 'react-router';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Search,
  Download,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/app/i18n/LanguageContext';

// Mock data
const mockOrders = [
  { id: 'ORD-2024-001', customer: 'Nguyen Van A', email: 'nguyenvana@gmail.com', brand: 'Zara', items: 3, total: 1250000, status: 'delivered', date: '2024-02-10', payment: 'paid' },
  { id: 'ORD-2024-002', customer: 'Tran Thi B', email: 'tranthib@gmail.com', brand: 'H&M', items: 2, total: 890000, status: 'shipped', date: '2024-02-12', payment: 'paid' },
  { id: 'ORD-2024-003', customer: 'Le Van C', email: 'levanc@gmail.com', brand: 'Uniqlo', items: 5, total: 2100000, status: 'processing', date: '2024-02-13', payment: 'paid' },
  { id: 'ORD-2024-004', customer: 'Pham Thi D', email: 'phamthid@gmail.com', brand: 'Mango', items: 1, total: 650000, status: 'pending', date: '2024-02-14', payment: 'pending' },
  { id: 'ORD-2024-005', customer: 'Hoang Van E', email: 'hoangvane@gmail.com', brand: 'Zara', items: 4, total: 1800000, status: 'cancelled', date: '2024-02-14', payment: 'refunded' },
  { id: 'ORD-2024-006', customer: 'Nguyen Thi F', email: 'nguyenthif@gmail.com', brand: 'COS', items: 2, total: 1950000, status: 'disputed', date: '2024-02-13', payment: 'paid' },
  { id: 'ORD-2024-007', customer: 'Tran Van G', email: 'tranvang@gmail.com', brand: 'H&M', items: 3, total: 1150000, status: 'delivered', date: '2024-02-09', payment: 'paid' },
  { id: 'ORD-2024-008', customer: 'Le Thi H', email: 'lethih@gmail.com', brand: 'Uniqlo', items: 6, total: 2400000, status: 'shipped', date: '2024-02-11', payment: 'paid' },
  { id: 'ORD-2024-009', customer: 'Pham Van I', email: 'phamvani@gmail.com', brand: 'Mango', items: 2, total: 980000, status: 'processing', date: '2024-02-14', payment: 'paid' },
  { id: 'ORD-2024-010', customer: 'Hoang Thi K', email: 'hoangthik@gmail.com', brand: 'Zara', items: 1, total: 750000, status: 'pending', date: '2024-02-15', payment: 'pending' },
];

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-[#F54900]/10 text-[#F54900]' },
  processing: { label: 'Processing', color: 'bg-[#F59E0B]/10 text-[#F59E0B]' },
  shipped: { label: 'Shipped', color: 'bg-[#3B82F6]/10 text-[#3B82F6]' },
  delivered: { label: 'Delivered', color: 'bg-[#10B981]/10 text-[#10B981]' },
  cancelled: { label: 'Cancelled', color: 'bg-[#6A7282]/10 text-[#6A7282]' },
  disputed: { label: 'Disputed', color: 'bg-[#E7000B]/10 text-[#E7000B]' },
};

const paymentConfig = {
  pending: { label: 'Pending', color: 'bg-[#F54900]/10 text-[#F54900]' },
  paid: { label: 'Paid', color: 'bg-[#10B981]/10 text-[#10B981]' },
  refunded: { label: 'Refunded', color: 'bg-[#6A7282]/10 text-[#6A7282]' },
  failed: { label: 'Failed', color: 'bg-[#E7000B]/10 text-[#E7000B]' },
};

export default function AdminAllOrdersPage() {
  const { v } = useLanguage();
  const statusLabels: Record<string, string> = {
    pending: v('Pending', 'Đang chờ'),
    processing: v('Processing', 'Đang xử lý'),
    shipped: v('Shipped', 'Đang giao hàng'),
    delivered: v('Delivered', 'Đã giao'),
    cancelled: v('Cancelled', 'Đã hủy'),
    disputed: v('Disputed', 'Đang tranh chấp'),
  };
  const paymentLabels: Record<string, string> = {
    pending: v('Pending', 'Đang chờ'),
    paid: v('Paid', 'Đã thanh toán'),
    refunded: v('Refunded', 'Đã hoàn tiền'),
    failed: v('Failed', 'Thất bại'),
  };
  const [orders, setOrders] = useState(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.payment === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const stats = {
    total: orders.length,
    revenue: orders
      .filter((o) => o.payment === 'paid')
      .reduce((sum, o) => sum + o.total, 0),
    pending: orders.filter((o) => o.status === 'pending').length,
    disputed: orders.filter((o) => o.status === 'disputed').length,
  };

  const handleExport = () => {
    const csv = orders
      .map((o) => `${o.id},${o.customer},${o.email},${o.brand},${o.items},${o.total},${o.status},${o.payment}`)
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all-orders.csv';
    a.click();
    toast.success(v('Orders exported', 'Đã xuất đơn hàng'));
  };

  return (
    <div className="flex flex-col" style={{ gap: '32px', maxWidth: '1501px', margin: '0 auto' }}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
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
            {v('All Orders', 'Tất cả đơn hàng')}
          </h1>
          <p
            className="text-[#4A5565]"
            style={{ fontSize: '16px', fontFamily: 'Arimo, sans-serif' }}
          >
            {v('Danh sách tất cả orders trên platform', 'Danh sách tất cả đơn hàng trên nền tảng')}
          </p>
        </div>
        <div className="flex items-center" style={{ gap: '12px' }}>
          <Link to="/admin/orders/disputes">
            <Button
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
              <AlertCircle style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              {v('View Disputes', 'Xem tranh chấp')}
            </Button>
          </Link>
          <Link to="/admin/orders/refunds">
            <Button
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
              {v('View Refunds', 'Xem hoàn tiền')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4" style={{ gap: '24px' }}>
        <Card
          className="bg-white"
          style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <div
              className="flex items-center justify-center bg-[#F3F4F6]"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <ShoppingBag className="text-[#0A0A0A]" style={{ width: '24px', height: '24px' }} />
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
              {v('Total Orders', 'Tổng đơn hàng')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.total}
            </h3>
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
                marginBottom: '4px',
              }}
            >
              {v('Total Revenue', 'Tổng doanh thu')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {(stats.revenue / 1000000).toFixed(1)}M
            </h3>
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
              <TrendingUp className="text-[#F54900]" style={{ width: '24px', height: '24px' }} />
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
              {v('Pending Orders', 'Đơn hàng đang chờ')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.pending}
            </h3>
          </div>
        </Card>

        <Card
          className="bg-white"
          style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: '12px' }}>
            <div
              className="flex items-center justify-center bg-[#E7000B]/10"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <AlertCircle className="text-[#E7000B]" style={{ width: '24px', height: '24px' }} />
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
              {v('Disputed Orders', 'Đơn hàng tranh chấp')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.disputed}
            </h3>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card
        className="bg-white"
        style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
      >
        <div className="grid grid-cols-4" style={{ gap: '16px' }}>
          {/* Search */}
          <div className="col-span-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                style={{ width: '16px', height: '16px' }}
              />
              <Input
                placeholder={v('Search by order ID, customer, email, brand...', 'Tìm theo mã đơn, khách hàng, email, thương hiệu...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-[#D1D5DC]"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger
                className="border-[#D1D5DC]"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                <SelectValue placeholder={v('Order Status', 'Trạng thái đơn hàng')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{v('All Status', 'Tất cả trạng thái')}</SelectItem>
                <SelectItem value="pending">{v('Pending', 'Đang chờ')}</SelectItem>
                <SelectItem value="processing">{v('Processing', 'Đang xử lý')}</SelectItem>
                <SelectItem value="shipped">{v('Shipped', 'Đang giao hàng')}</SelectItem>
                <SelectItem value="delivered">{v('Delivered', 'Đã giao')}</SelectItem>
                <SelectItem value="cancelled">{v('Cancelled', 'Đã hủy')}</SelectItem>
                <SelectItem value="disputed">{v('Disputed', 'Đang tranh chấp')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Filter */}
          <div>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger
                className="border-[#D1D5DC]"
                style={{
                  height: '48px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                }}
              >
                <SelectValue placeholder={v('Payment Status', 'Trạng thái thanh toán')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{v('All Payment', 'Tất cả thanh toán')}</SelectItem>
                <SelectItem value="pending">{v('Pending', 'Đang chờ')}</SelectItem>
                <SelectItem value="paid">{v('Paid', 'Đã thanh toán')}</SelectItem>
                <SelectItem value="refunded">{v('Refunded', 'Đã hoàn tiền')}</SelectItem>
                <SelectItem value="failed">{v('Failed', 'Thất bại')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end" style={{ marginTop: '16px' }}>
          <Button
            onClick={handleExport}
            variant="outline"
            className="border-[#D1D5DC]"
            style={{
              height: '40px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              fontFamily: 'Arimo, sans-serif',
            }}
          >
            <Download style={{ width: '16px', height: '16px', marginRight: '8px' }} />
            {v('Export CSV', 'Xuất CSV')}
          </Button>
        </div>
      </Card>

      {/* Orders Table */}
      <Card
        className="bg-white"
        style={{
          padding: '0',
          borderRadius: '14px',
          border: '1px solid #E5E7EB',
          overflow: 'hidden',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <tr>
                <th
                  className="text-left text-[#0A0A0A]"
                  style={{
                    padding: '16px 24px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {v('Order ID', 'Mã đơn hàng')}
                </th>
                <th
                  className="text-left text-[#0A0A0A]"
                  style={{
                    padding: '16px 24px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {v('Customer', 'Khách hàng')}
                </th>
                <th
                  className="text-left text-[#0A0A0A]"
                  style={{
                    padding: '16px 24px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {v('Brand', 'Thương hiệu')}
                </th>
                <th
                  className="text-left text-[#0A0A0A]"
                  style={{
                    padding: '16px 24px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {v('Items', 'Sản phẩm')}
                </th>
                <th
                  className="text-left text-[#0A0A0A]"
                  style={{
                    padding: '16px 24px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {v('Total', 'Tổng tiền')}
                </th>
                <th
                  className="text-left text-[#0A0A0A]"
                  style={{
                    padding: '16px 24px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {v('Status', 'Trạng thái')}
                </th>
                <th
                  className="text-left text-[#0A0A0A]"
                  style={{
                    padding: '16px 24px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {v('Payment', 'Thanh toán')}
                </th>
                <th
                  className="text-left text-[#0A0A0A]"
                  style={{
                    padding: '16px 24px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {v('Date', 'Ngày')}
                </th>
                <th
                  className="text-right text-[#0A0A0A]"
                  style={{
                    padding: '16px 24px',
                    fontSize: '14px',
                    fontWeight: '700',
                    fontFamily: 'Arimo, sans-serif',
                  }}
                >
                  {v('Actions', 'Thao tác')}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB]">
                  <td style={{ padding: '16px 24px' }}>
                    <p
                      className="text-[#0A0A0A]"
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    >
                      {order.id}
                    </p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <p
                      className="text-[#0A0A0A]"
                      style={{
                        fontSize: '14px',
                        fontFamily: 'Arimo, sans-serif',
                        marginBottom: '2px',
                      }}
                    >
                      {order.customer}
                    </p>
                    <p
                      className="text-[#6A7282]"
                      style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {order.email}
                    </p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <p
                      className="text-[#0A0A0A]"
                      style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {order.brand}
                    </p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <p
                      className="text-[#0A0A0A]"
                      style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {order.items}
                    </p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <p
                      className="text-[#0A0A0A]"
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    >
                      {order.total.toLocaleString('vi-VN')}đ
                    </p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <Badge
                      className={statusConfig[order.status as keyof typeof statusConfig].color}
                      style={{
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                        padding: '6px 12px',
                      }}
                    >
                      {statusLabels[order.status]}
                    </Badge>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <Badge
                      className={paymentConfig[order.payment as keyof typeof paymentConfig].color}
                      style={{
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                        padding: '6px 12px',
                      }}
                    >
                      {paymentLabels[order.payment]}
                    </Badge>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <p
                      className="text-[#6A7282]"
                      style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {new Date(order.date).toLocaleDateString('vi-VN')}
                    </p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div className="flex items-center justify-end">
                      <Link to={`/admin/orders/${order.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          style={{
                            padding: '8px',
                            borderRadius: '8px',
                          }}
                        >
                          <ExternalLink
                            className="text-[#0A0A0A]"
                            style={{ width: '16px', height: '16px' }}
                          />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className="flex items-center justify-between bg-[#F9FAFB] border-t border-[#E5E7EB]"
          style={{ padding: '16px 24px' }}
        >
          <p
            className="text-[#6A7282]"
            style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
          >
            {v('Showing', 'Hiển thị')} {(currentPage - 1) * itemsPerPage + 1} {v('to', 'đến')}{' '}
            {Math.min(currentPage * itemsPerPage, filteredOrders.length)} {v('of', 'trong')}{' '}
            {filteredOrders.length} {v('orders', 'đơn hàng')}
          </p>
          <div className="flex items-center" style={{ gap: '8px' }}>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              style={{
                height: '36px',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'Arimo, sans-serif',
              }}
            >
              {v('Previous', 'Trước')}
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={
                  currentPage === page
                    ? 'bg-[#0A0A0A] text-white'
                    : 'border-[#D1D5DC] text-[#0A0A0A]'
                }
                style={{
                  height: '36px',
                  width: '36px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'Arimo, sans-serif',
                  padding: '0',
                }}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              style={{
                height: '36px',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'Arimo, sans-serif',
              }}
            >
              {v('Next', 'Tiếp')}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
