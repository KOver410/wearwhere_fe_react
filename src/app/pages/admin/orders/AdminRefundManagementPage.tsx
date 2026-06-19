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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import {
  Search,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  ExternalLink,
  TrendingDown,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/app/i18n/LanguageContext';

// Mock data
const mockRefunds = [
  { id: 'REF-001', orderId: 'ORD-2024-006', customer: 'Nguyen Thi F', brand: 'COS', amount: 1950000, reason: 'Dispute resolved', reasonVi: 'Đã giải quyết tranh chấp', status: 'pending', requestDate: '2024-02-14', processedDate: null, method: 'original' },
  { id: 'REF-002', orderId: 'ORD-2024-005', customer: 'Hoang Van E', brand: 'Zara', amount: 1800000, reason: 'Order cancelled', reasonVi: 'Đơn hàng đã hủy', status: 'processing', requestDate: '2024-02-13', processedDate: null, method: 'original' },
  { id: 'REF-003', orderId: 'ORD-2024-012', customer: 'Tran Van K', brand: 'H&M', amount: 890000, reason: 'Wrong size', reasonVi: 'Sai kích cỡ', status: 'completed', requestDate: '2024-02-10', processedDate: '2024-02-12', method: 'original' },
  { id: 'REF-004', orderId: 'ORD-2024-018', customer: 'Pham Thi L', brand: 'Mango', amount: 650000, reason: 'Quality issues', reasonVi: 'Vấn đề chất lượng', status: 'pending', requestDate: '2024-02-14', processedDate: null, method: 'bank' },
  { id: 'REF-005', orderId: 'ORD-2024-021', customer: 'Le Thi H', brand: 'Uniqlo', amount: 2400000, reason: 'Damaged product', reasonVi: 'Sản phẩm bị hư hỏng', status: 'processing', requestDate: '2024-02-13', processedDate: null, method: 'original' },
  { id: 'REF-006', orderId: 'ORD-2024-024', customer: 'Nguyen Van M', brand: 'COS', amount: 1250000, reason: 'Missing items', reasonVi: 'Thiếu sản phẩm', status: 'completed', requestDate: '2024-02-09', processedDate: '2024-02-11', method: 'wallet' },
  { id: 'REF-007', orderId: 'ORD-2024-027', customer: 'Tran Thi N', brand: 'H&M', amount: 980000, reason: 'Color mismatch', reasonVi: 'Màu sắc không khớp', status: 'rejected', requestDate: '2024-02-11', processedDate: '2024-02-13', method: 'original' },
  { id: 'REF-008', orderId: 'ORD-2024-030', customer: 'Le Van O', brand: 'Zara', amount: 1150000, reason: 'Late delivery', reasonVi: 'Giao hàng trễ', status: 'completed', requestDate: '2024-02-08', processedDate: '2024-02-10', method: 'original' },
];

const statusConfig = {
  pending: { label: 'Pending Approval', color: 'bg-[#F54900]/10 text-[#F54900]', icon: AlertCircle },
  processing: { label: 'Processing', color: 'bg-[#F59E0B]/10 text-[#F59E0B]', icon: Clock },
  completed: { label: 'Completed', color: 'bg-[#10B981]/10 text-[#10B981]', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-[#6A7282]/10 text-[#6A7282]', icon: XCircle },
};

const methodConfig = {
  original: 'Original Payment Method',
  bank: 'Bank Transfer',
  wallet: 'Platform Wallet',
};

export default function AdminRefundManagementPage() {
  const { v, lang } = useLanguage();
  const statusLabels: Record<string, string> = {
    pending: v('Pending Approval', 'Chờ duyệt'),
    processing: v('Processing', 'Đang xử lý'),
    completed: v('Completed', 'Hoàn tất'),
    rejected: v('Rejected', 'Đã từ chối'),
  };
  const methodLabels: Record<string, string> = {
    original: v('Original Payment Method', 'Phương thức thanh toán gốc'),
    bank: v('Bank Transfer', 'Chuyển khoản ngân hàng'),
    wallet: v('Platform Wallet', 'Ví nền tảng'),
  };
  const [refunds, setRefunds] = useState(mockRefunds);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRefund, setSelectedRefund] = useState<any>(null);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter refunds
  const filteredRefunds = refunds.filter((refund) => {
    const matchesSearch =
      refund.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      refund.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || refund.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRefunds.length / itemsPerPage);
  const paginatedRefunds = filteredRefunds.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const stats = {
    total: refunds.length,
    pending: refunds.filter((r) => r.status === 'pending').length,
    processing: refunds.filter((r) => r.status === 'processing').length,
    totalAmount: refunds
      .filter((r) => r.status === 'completed')
      .reduce((sum, r) => sum + r.amount, 0),
  };

  const handleApprove = () => {
    setRefunds(
      refunds.map((r) =>
        r.id === selectedRefund?.id ? { ...r, status: 'processing' } : r
      )
    );
    setApproveModalOpen(false);
    setSelectedRefund(null);
    toast.success(v('Refund approved and processing', 'Đã duyệt và đang xử lý hoàn tiền'));
  };

  const handleReject = () => {
    setRefunds(
      refunds.map((r) =>
        r.id === selectedRefund?.id ? { ...r, status: 'rejected' } : r
      )
    );
    setRejectModalOpen(false);
    setSelectedRefund(null);
    toast.success(v('Refund rejected', 'Đã từ chối hoàn tiền'));
  };

  const handleExport = () => {
    const csv = refunds
      .map((r) => `${r.id},${r.orderId},${r.customer},${r.brand},${r.amount},${r.status},${r.reason}`)
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'refunds.csv';
    a.click();
    toast.success(v('Refunds exported', 'Đã xuất hoàn tiền'));
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
            {v('Refund Management', 'Quản lý hoàn tiền')}
          </h1>
          <p
            className="text-[#4A5565]"
            style={{ fontSize: '16px', fontFamily: 'Arimo, sans-serif' }}
          >
            {v('Quản lý và theo dõi refunds', 'Quản lý và theo dõi hoàn tiền')}
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
              {v('View Disputes', 'Xem tranh chấp')}
            </Button>
          </Link>
          <Link to="/admin/orders">
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
              {v('Back to Orders', 'Quay lại đơn hàng')}
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
              <TrendingDown className="text-[#0A0A0A]" style={{ width: '24px', height: '24px' }} />
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
              {v('Total Refunds', 'Tổng hoàn tiền')}
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
              className="flex items-center justify-center bg-[#F54900]/10"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <AlertCircle className="text-[#F54900]" style={{ width: '24px', height: '24px' }} />
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
              {v('Pending Approval', 'Chờ duyệt')}
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
              className="flex items-center justify-center bg-[#F59E0B]/10"
              style={{ width: '48px', height: '48px', borderRadius: '10px' }}
            >
              <Clock className="text-[#F59E0B]" style={{ width: '24px', height: '24px' }} />
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
              {v('Processing', 'Đang xử lý')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {stats.processing}
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
              <DollarSign className="text-[#E7000B]" style={{ width: '24px', height: '24px' }} />
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
              {v('Total Refunded', 'Tổng đã hoàn')}
            </p>
            <h3
              className="text-[#0A0A0A]"
              style={{ fontSize: '30px', fontWeight: '700', fontFamily: 'Arimo, sans-serif' }}
            >
              {(stats.totalAmount / 1000000).toFixed(1)}M
            </h3>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card
        className="bg-white"
        style={{ padding: '24px', borderRadius: '14px', border: '1px solid #E5E7EB' }}
      >
        <div className="grid grid-cols-3" style={{ gap: '16px' }}>
          {/* Search */}
          <div className="col-span-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                style={{ width: '16px', height: '16px' }}
              />
              <Input
                placeholder={v('Search by refund ID, order ID, customer...', 'Tìm theo mã hoàn tiền, mã đơn, khách hàng...')}
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
                <SelectValue placeholder={v('Status', 'Trạng thái')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{v('All Status', 'Tất cả trạng thái')}</SelectItem>
                <SelectItem value="pending">{v('Pending Approval', 'Chờ duyệt')}</SelectItem>
                <SelectItem value="processing">{v('Processing', 'Đang xử lý')}</SelectItem>
                <SelectItem value="completed">{v('Completed', 'Hoàn tất')}</SelectItem>
                <SelectItem value="rejected">{v('Rejected', 'Đã từ chối')}</SelectItem>
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

      {/* Refunds Table */}
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
                  {v('Refund ID', 'Mã hoàn tiền')}
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
                  {v('Amount', 'Số tiền')}
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
                  {v('Reason', 'Lý do')}
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
                  {v('Method', 'Phương thức')}
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
                  {v('Request Date', 'Ngày yêu cầu')}
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
              {paginatedRefunds.map((refund) => (
                <tr key={refund.id} className="border-b border-[#E5E7EB] hover:bg-[#F9FAFB]">
                  <td style={{ padding: '16px 24px' }}>
                    <p
                      className="text-[#0A0A0A]"
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                      }}
                    >
                      {refund.id}
                    </p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <Link to={`/admin/orders/${refund.orderId}`}>
                      <p
                        className="text-[#0A0A0A] hover:underline"
                        style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                      >
                        {refund.orderId}
                      </p>
                    </Link>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <p
                      className="text-[#0A0A0A]"
                      style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {refund.customer}
                    </p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <p
                      className="text-[#0A0A0A]"
                      style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {refund.brand}
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
                      {refund.amount.toLocaleString('vi-VN')}đ
                    </p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <p
                      className="text-[#6A7282]"
                      style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {lang === 'vi' ? refund.reasonVi : refund.reason}
                    </p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <p
                      className="text-[#6A7282]"
                      style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {methodLabels[refund.method]}
                    </p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <Badge
                      className={statusConfig[refund.status as keyof typeof statusConfig].color}
                      style={{
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '700',
                        fontFamily: 'Arimo, sans-serif',
                        padding: '6px 12px',
                      }}
                    >
                      {statusLabels[refund.status]}
                    </Badge>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <p
                      className="text-[#6A7282]"
                      style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                    >
                      {new Date(refund.requestDate).toLocaleDateString('vi-VN')}
                    </p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <div className="flex items-center justify-end" style={{ gap: '8px' }}>
                      {refund.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => {
                              setSelectedRefund(refund);
                              setRejectModalOpen(true);
                            }}
                            variant="ghost"
                            size="sm"
                            style={{
                              padding: '8px',
                              borderRadius: '8px',
                            }}
                          >
                            <XCircle
                              className="text-[#E7000B]"
                              style={{ width: '16px', height: '16px' }}
                            />
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedRefund(refund);
                              setApproveModalOpen(true);
                            }}
                            variant="ghost"
                            size="sm"
                            style={{
                              padding: '8px',
                              borderRadius: '8px',
                            }}
                          >
                            <CheckCircle
                              className="text-[#10B981]"
                              style={{ width: '16px', height: '16px' }}
                            />
                          </Button>
                        </>
                      )}
                      <Link to={`/admin/orders/${refund.orderId}`}>
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
            {Math.min(currentPage * itemsPerPage, filteredRefunds.length)} {v('of', 'trong')}{' '}
            {filteredRefunds.length} {v('refunds', 'hoàn tiền')}
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

      {/* Approve Modal */}
      <Dialog open={approveModalOpen} onOpenChange={setApproveModalOpen}>
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
              {v('Approve Refund', 'Duyệt hoàn tiền')}
            </DialogTitle>
            <DialogDescription style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}>
              {v('Approve this refund and start processing', 'Duyệt hoàn tiền này và bắt đầu xử lý')}
            </DialogDescription>
          </DialogHeader>
          {selectedRefund && (
            <div className="flex flex-col" style={{ gap: '16px', marginTop: '24px' }}>
              <div className="bg-[#F9FAFB]" style={{ padding: '16px', borderRadius: '10px' }}>
                <div className="flex justify-between" style={{ marginBottom: '8px' }}>
                  <p
                    className="text-[#6A7282]"
                    style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {v('Refund ID', 'Mã hoàn tiền')}
                  </p>
                  <p
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    {selectedRefund.id}
                  </p>
                </div>
                <div className="flex justify-between" style={{ marginBottom: '8px' }}>
                  <p
                    className="text-[#6A7282]"
                    style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {v('Customer', 'Khách hàng')}
                  </p>
                  <p
                    className="text-[#0A0A0A]"
                    style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {selectedRefund.customer}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p
                    className="text-[#6A7282]"
                    style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {v('Amount', 'Số tiền')}
                  </p>
                  <p
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    {selectedRefund.amount.toLocaleString('vi-VN')}đ
                  </p>
                </div>
              </div>
              <p
                className="text-[#6A7282]"
                style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
              >
                {v("This refund will be processed to the customer's", 'Khoản hoàn tiền này sẽ được xử lý qua')}{' '}
                {methodLabels[selectedRefund.method].toLowerCase()}.
              </p>
            </div>
          )}
          <DialogFooter style={{ marginTop: '24px' }}>
            <Button
              variant="outline"
              onClick={() => {
                setApproveModalOpen(false);
                setSelectedRefund(null);
              }}
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
              onClick={handleApprove}
              className="bg-[#10B981] text-white hover:bg-[#10B981]/90"
              style={{
                height: '48px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '700',
                fontFamily: 'Arimo, sans-serif',
                padding: '0 24px',
              }}
            >
              <CheckCircle style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              {v('Approve & Process', 'Duyệt & Xử lý')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
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
              {v('Reject Refund', 'Từ chối hoàn tiền')}
            </DialogTitle>
            <DialogDescription style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}>
              {v('Reject this refund request', 'Từ chối yêu cầu hoàn tiền này')}
            </DialogDescription>
          </DialogHeader>
          {selectedRefund && (
            <div className="flex flex-col" style={{ gap: '16px', marginTop: '24px' }}>
              <div className="bg-[#F9FAFB]" style={{ padding: '16px', borderRadius: '10px' }}>
                <div className="flex justify-between" style={{ marginBottom: '8px' }}>
                  <p
                    className="text-[#6A7282]"
                    style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {v('Refund ID', 'Mã hoàn tiền')}
                  </p>
                  <p
                    className="text-[#0A0A0A]"
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      fontFamily: 'Arimo, sans-serif',
                    }}
                  >
                    {selectedRefund.id}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p
                    className="text-[#6A7282]"
                    style={{ fontSize: '12px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {v('Customer', 'Khách hàng')}
                  </p>
                  <p
                    className="text-[#0A0A0A]"
                    style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
                  >
                    {selectedRefund.customer}
                  </p>
                </div>
              </div>
              <p
                className="text-[#6A7282]"
                style={{ fontSize: '14px', fontFamily: 'Arimo, sans-serif' }}
              >
                {v('The customer will be notified that their refund request has been rejected.', 'Khách hàng sẽ được thông báo rằng yêu cầu hoàn tiền của họ đã bị từ chối.')}
              </p>
            </div>
          )}
          <DialogFooter style={{ marginTop: '24px' }}>
            <Button
              variant="outline"
              onClick={() => {
                setRejectModalOpen(false);
                setSelectedRefund(null);
              }}
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
              onClick={handleReject}
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
              <XCircle style={{ width: '16px', height: '16px', marginRight: '8px' }} />
              {v('Reject Refund', 'Từ chối hoàn tiền')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
